import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
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

    if (!["pending", "approved", "rejected"].includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid nomination status.",
        },
        { status: 400 }
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