import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Election from "@/models/Election";
import Member from "@/models/Member";
import Nomination from "@/models/Nomination";
import Vote from "@/models/Vote";
import { getElectionTimestamp } from "@/lib/election-timeline-validation";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const votingHasEnded = (endDate: string, endTime: string) => {
  if (!endDate || !endTime) return false;

  const endTimestamp = getElectionTimestamp(endDate, endTime);

  return endTimestamp !== null && Date.now() >= endTimestamp;
};

export async function GET(_: Request, { params }: RouteContext) {
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { message: "Invalid election ID." },
      { status: 400 },
    );
  }

  try {
    await connectDB();

    const election = await Election.findById(id).lean();

    if (!election) {
      return NextResponse.json(
        { message: "Election not found." },
        { status: 404 },
      );
    }

    if (!votingHasEnded(election.voting.endDate, election.voting.endTime)) {
      return NextResponse.json(
        {
          message: "Voting results are available after the voting period ends.",
        },
        { status: 403 },
      );
    }

    const electionId = new mongoose.Types.ObjectId(id);

    /*
     * Get all approved nominations for this election.
     *
     * The candidate structure remains:
     *
     * nomination
     *   -> member
     */
    const approvedNominations = await Nomination.find({
      election: electionId,
      status: "approved",
    })
      .populate({
        path: "member",
        model: Member,
        select: "fullName memberId photoUrl wings",
      })
      .lean();

    /*
     * Get all ballots cast for this election.
     *
     * Existing votes collection structure:
     *
     * {
     *   election,
     *   voter,
     *   nominations: [...]
     *   castAt
     * }
     */
    const votes = await Vote.find({
      election: electionId,
    })
      .select("nominations castAt")
      .lean();

    /*
     * Count how many ballots selected each nomination.
     */
    const voteCounts = new Map<string, number>();

    for (const vote of votes) {
      for (const nominationId of vote.nominations || []) {
        const key = nominationId.toString();

        voteCounts.set(key, (voteCounts.get(key) || 0) + 1);
      }
    }

    /*
     * Build candidate results from approved nominations.
     */
    const candidates = approvedNominations
      .map((nomination) => {
        const member = nomination.member as {
          _id?: mongoose.Types.ObjectId;
          fullName?: string;
          memberId?: string;
          photoUrl?: string;
          wings?: string[];
        } | null;

        const votesReceived = voteCounts.get(nomination._id.toString()) || 0;

        const percentage =
          votes.length > 0
            ? Number(((votesReceived / votes.length) * 100).toFixed(1))
            : 0;

        return {
          _id: nomination._id.toString(),

          fullName: member?.fullName || "Unknown candidate",

          memberId: member?.memberId || "",

          photoUrl: member?.photoUrl || "",

          position: nomination.position,

          wing: nomination.wing,

          votes: votesReceived,

          percentage,
        };
      })
      /*
       * IMPORTANT:
       * Highest vote count first.
       */
      .sort((a, b) => {
        if (b.votes !== a.votes) {
          return b.votes - a.votes;
        }

        /*
         * Stable secondary sorting when two candidates
         * have the same number of votes.
         */
        const positionCompare = a.position.localeCompare(b.position);

        if (positionCompare !== 0) {
          return positionCompare;
        }

        return a.fullName.localeCompare(b.fullName);
      });

    /*
     * Determine whether the result set has any votes.
     *
     * "Certified" here is a system-derived display state:
     * voting has ended and the final tally is available.
     *
     * We are NOT adding an audit/certification field
     * to MongoDB.
     */
    const auditStatus = "Certified";

    return NextResponse.json({
      success: true,

      data: {
        election: {
          _id: election._id.toString(),
          name: election.name,
          location: election.location,
          voting: {
            startDate: election.voting.startDate,
            startTime: election.voting.startTime,
            endDate: election.voting.endDate,
            endTime: election.voting.endTime,
          },
        },

        totalBallots: votes.length,

        auditStatus,

        candidates,
      },
    });
  } catch (error) {
    console.error("GET election results error:", error);

    return NextResponse.json(
      {
        message: "Unable to load voting results.",
      },
      { status: 500 },
    );
  }
}
