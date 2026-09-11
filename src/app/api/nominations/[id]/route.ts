
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { hasElectionPeriodEnded } from "@/lib/election-timeline-validation";
import Election from "@/models/Election";
import Nomination from "@/models/Nomination";
import Member from "@/models/Member"; // Added Member model import for population
import { sendAcceptanceEmail, sendRejectionEmail } from "@/lib/nominationmaill";

type Context = {
  params: Promise<{ id: string }>;
};

export async function PATCH(
  request: Request,
  { params }: Context
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid nomination ID.",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const status = body.status;
    const remark = body.remark; // Captured optional remark if passed

    if (!["pending", "approved", "rejected", "withdrawn"].includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid nomination status.",
        },
        { status: 400 }
      );
    }

    const existingNomination = await Nomination.findById(id)
      .select("election member user email name")
      .populate({
        path: "member",
        model: Member,
        select: "email fullName name user",
      })
      .lean();

    if (!existingNomination) {
      return NextResponse.json(
        {
          success: false,
          message: "Nomination not found.",
        },
        { status: 404 }
      );
    }

    const election = await Election.findById((existingNomination as any).election)
      .select("voting title")
      .lean();

    if (!election) {
      return NextResponse.json(
        {
          success: false,
          message: "Election for this nomination was not found.",
        },
        { status: 404 }
      );
    }

    if (hasElectionPeriodEnded((election as any).voting)) {
      return NextResponse.json(
        {
          success: false,
          message: "Nomination status cannot be changed after the voting period has ended.",
        },
        { status: 403 }
      );
    }

    const nomination = await Nomination.findByIdAndUpdate(
      id,
      {
        status,
      },
      {
        new: true,
        runValidators: true,
      }
    ).lean();

    if (!nomination) {
      return NextResponse.json(
        {
          success: false,
          message: "Nomination not found.",
        },
        { status: 404 }
      );
    }

    // --- EMAIL NOTIFICATION INTEGRATION (Fixed to fetch email from Member / User) ---
    try {
      const nomAny = existingNomination as any;
      const memberObj = nomAny.member || {};
      
      let candidateEmail = nomAny.email || memberObj.email;
      let candidateName = nomAny.name || memberObj.fullName || memberObj.name || "Candidate";

      // Fallback check if email is in the User collection
      const userIdToLookup = nomAny.user || memberObj.user;
      if (!candidateEmail && userIdToLookup) {
        const usersCollection = mongoose.connection.db?.collection("users");
        const linkedUser = await usersCollection?.findOne({ _id: new mongoose.Types.ObjectId(userIdToLookup) });
        if (linkedUser) {
          candidateEmail = linkedUser.email;
          candidateName = linkedUser.name || linkedUser.fullName || candidateName;
        }
      }

      if (candidateEmail && (status === "approved" || status === "rejected")) {
        const electionAny = election as any;
        const electionName = electionAny.title || "Election";
        if (status === "approved") {
          await sendAcceptanceEmail(candidateEmail, candidateName, electionName, remark);
        } else if (status === "rejected") {
          await sendRejectionEmail(candidateEmail, candidateName, electionName, remark);
        }
      }
    } catch (emailError) {
      console.error("Failed to send nomination email notification:", emailError);
    }
    // -------------------------------------------------------------------

    return NextResponse.json({
      success: true,
      data: {
        ...nomination,
        _id: nomination._id.toString(),
        election: nomination.election.toString(),
        member: nomination.member.toString(),
      },
      message:
        status === "approved"
          ? "Candidate approved successfully."
          : status === "rejected"
            ? "Candidate rejected successfully."
            : status === "withdrawn"
              ? "Nomination marked as withdrawn."
              : "Nomination moved back to pending.",
    });
  } catch (error) {
    console.error("PATCH nomination error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to update nomination.",
      },
      { status: 500 }
    );
  }
}