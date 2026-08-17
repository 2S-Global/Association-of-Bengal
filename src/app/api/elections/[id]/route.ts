import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Election from "@/models/Election";

type Context = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Context) {
  try {
    await connectDB();
    const { id } = await params;
    const election = await Election.findById(id).lean();

    if (!election) {
      return NextResponse.json({ success: false, message: "Election not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: election });
  } catch {
    return NextResponse.json({ success: false, message: "Unable to load election." }, { status: 400 });
  }
}

export async function PATCH(request: Request, { params }: Context) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const election = await Election.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).lean();

    if (!election) {
      return NextResponse.json({ success: false, message: "Election not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: election, message: "Election updated successfully." });
  } catch {
    return NextResponse.json({ success: false, message: "Unable to update election." }, { status: 400 });
  }
}
