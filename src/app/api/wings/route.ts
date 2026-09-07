import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";

type WingDocument = {
  id?: string;
  name?: string;
  nameBn?: string;
  isActive?: boolean;
  sortOrder?: number;
};

export async function GET() {
  try {
    await connectDB();

    const wings = await mongoose.connection.db
      ?.collection<WingDocument>("wings")
      .find(
        { isActive: true },
        {
          projection: {
            _id: 0,
            id: 1,
            name: 1,
            nameBn: 1,
            sortOrder: 1,
          },
        },
      )
      .sort({ sortOrder: 1, name: 1 })
      .toArray();

    const data = (wings ?? [])
      .filter(
        (wing) => typeof wing.name === "string" && wing.name.trim().length > 0,
      )
      .map((wing) => ({
        id: wing.id ?? wing.name!.trim().toLowerCase().replace(/\s+/g, "-"),
        name: wing.name!.trim(),
        nameBn: typeof wing.nameBn === "string" ? wing.nameBn.trim() : "",
      }));

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("GET wings error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load wings. Please try again.",
      },
      { status: 500 },
    );
  }
}
