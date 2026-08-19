import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Nomination from "@/models/Nomination";
import Member from "@/models/Member";

export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const electionId = searchParams.get("election");

    if (!electionId) {
      return NextResponse.json(
        {
          success: false,
          message: "Election ID is required.",
        },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(electionId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid election ID.",
        },
        { status: 400 }
      );
    }

    const nominations = await Nomination.find({
      election: new mongoose.Types.ObjectId(electionId),
    })
      .populate({
        path: "member",
        model: Member,
        select: "fullName memberId photoUrl wings",
      })
      .sort({ createdAt: -1 })
      .lean();

    const data = nominations.map((nomination) => {
      const member = nomination.member as
        | {
            _id: mongoose.Types.ObjectId;
            fullName?: string;
            memberId?: string;
            photoUrl?: string;
            wings?: string[];
          }
        | null;

      return {
        _id: nomination._id.toString(),
        election: nomination.election.toString(),
        member: member
          ? {
              _id: member._id.toString(),
              fullName: member.fullName || "Unknown candidate",
              memberId: member.memberId || "",
              photoUrl: member.photoUrl || "",
              wings: member.wings || [],
            }
          : null,
        position: nomination.position,
        wing: nomination.wing,
        manifesto: nomination.manifesto,
        agreedToTerms: nomination.agreedToTerms,
        status: nomination.status,
        createdAt: nomination.createdAt,
        updatedAt: nomination.updatedAt,
      };
    });

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("GET nominations error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load nominations.",
      },
      { status: 500 }
    );
  }
}