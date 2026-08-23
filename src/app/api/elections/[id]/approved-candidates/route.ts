import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Nomination from "@/models/Nomination";
import Member from "@/models/Member";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: RouteContext) {
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid election ID." }, { status: 400 });
  }

  try {
    await connectDB();

    const candidates = await Nomination.find({
      election: new mongoose.Types.ObjectId(id),
      status: "approved",
    })
      .populate({
        path: "member",
        model: Member,
        select: "fullName memberId photoUrl wings",
      })
      .sort({ position: 1, createdAt: 1 })
      .lean();

    return NextResponse.json({
      data: candidates.map((candidate) => {
        const member = candidate.member as {
          _id: mongoose.Types.ObjectId;
          fullName?: string;
          memberId?: string;
          photoUrl?: string;
        } | null;

        return {
          _id: candidate._id.toString(),
          position: candidate.position,
          wing: candidate.wing,
          manifesto: candidate.manifesto,
          member: member
            ? {
                _id: member._id.toString(),
                fullName: member.fullName || "Unknown candidate",
                memberId: member.memberId || "",
                photoUrl: member.photoUrl || "",
              }
            : null,
        };
      }),
    });
  } catch (error) {
    console.error("GET approved candidates error:", error);
    return NextResponse.json(
      { message: "Unable to load approved candidates." },
      { status: 500 },
    );
  }
}
