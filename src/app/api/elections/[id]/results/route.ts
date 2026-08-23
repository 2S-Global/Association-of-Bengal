import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Election from "@/models/Election";
import Member from "@/models/Member";
import Nomination from "@/models/Nomination";
import User from "@/models/User";
import Vote from "@/models/Vote";

type RouteContext = { params: Promise<{ id: string }> };

const votingHasEnded = (endDate: string, endTime: string) => {
  const end = new Date(`${endDate}T${endTime}:00`);
  return !Number.isNaN(end.getTime()) && Date.now() >= end.getTime();
};

export async function GET(_: Request, { params }: RouteContext) {
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid election ID." }, { status: 400 });
  }

  try {
    await connectDB();
    const election = await Election.findById(id).lean();

    if (!election) {
      return NextResponse.json({ message: "Election not found." }, { status: 404 });
    }

    if (!votingHasEnded(election.voting.endDate, election.voting.endTime)) {
      return NextResponse.json(
        { message: "Voting results are available after the voting period ends." },
        { status: 403 },
      );
    }

    const electionId = new mongoose.Types.ObjectId(id);
    const [approvedNominations, votes] = await Promise.all([
      Nomination.find({ election: electionId, status: "approved" })
        .populate({ path: "member", model: Member, select: "fullName memberId photoUrl" })
        .lean(),
      Vote.find({ election: electionId })
        .populate({
          path: "voter",
          model: Member,
          select: "fullName memberId user",
          populate: { path: "user", model: User, select: "name email" },
        })
        .populate({ path: "nominations", model: Nomination, select: "position member" })
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    const counts = new Map<string, number>();
    for (const vote of votes) {
      for (const nomination of vote.nominations as unknown as {
        _id?: mongoose.Types.ObjectId;
      }[]) {
        const key = nomination._id?.toString() || nomination.toString();
        counts.set(key, (counts.get(key) || 0) + 1);
      }
    }

    const candidates = approvedNominations
      .map((nomination) => {
        const member = nomination.member as { fullName?: string; memberId?: string } | null;
        return {
          _id: nomination._id.toString(),
          fullName: member?.fullName || "Unknown candidate",
          memberId: member?.memberId || "",
          position: nomination.position,
          wing: nomination.wing,
          votes: counts.get(nomination._id.toString()) || 0,
        };
      })
      .sort((a, b) => b.votes - a.votes || a.position.localeCompare(b.position) || a.fullName.localeCompare(b.fullName));

    const voterDetails = votes.map((vote) => {
      const voter = vote.voter as {
        fullName?: string;
        memberId?: string;
        user?: { name?: string; email?: string } | null;
      } | null;
      const selections = (vote.nominations as unknown as { _id: mongoose.Types.ObjectId; position?: string }[])
        .map((nomination) => ({ _id: nomination._id.toString(), position: nomination.position || "Unknown position" }));

      return {
        _id: vote._id.toString(),
        castAt: vote.castAt || vote.createdAt,
        voter: {
          fullName: voter?.fullName || voter?.user?.name || "Unknown voter",
          memberId: voter?.memberId || "",
          email: voter?.user?.email || "",
        },
        selections,
      };
    });

    return NextResponse.json({
      data: {
        totalBallots: votes.length,
        candidates,
        voters: voterDetails,
      },
    });
  } catch (error) {
    console.error("GET election results error:", error);
    return NextResponse.json({ message: "Unable to load voting results." }, { status: 500 });
  }
}
