import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { hasElectionPeriodEnded } from "@/lib/election-timeline-validation";
import Election from "@/models/Election";
import Nomination from "@/models/Nomination";

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
      .select("election")
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

    const election = await Election.findById(existingNomination.election)
      .select("voting")
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

    if (hasElectionPeriodEnded(election.voting)) {
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
