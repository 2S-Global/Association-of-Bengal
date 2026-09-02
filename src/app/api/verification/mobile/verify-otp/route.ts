import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      message: "Mobile OTP verification is not enabled in this build.",
    },
    { status: 501 },
  );
}
