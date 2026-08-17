import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectDB();
    const wings = await mongoose.connection.db
      ?.collection("members")
      .distinct("wing", { wing: { $type: "string", $ne: "" } });
    const data = [...new Set((wings ?? []).map((wing) => wing.trim()).filter(Boolean))]
      .sort((first, second) => first.localeCompare(second, undefined, { sensitivity: "base" }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("GET wings error:", error);
    return NextResponse.json(
      { success: false, message: "Unable to load member wings. Please try again." },
      { status: 500 }
    );
  }
}
