import crypto from "crypto";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Verification from "@/models/Verification";

const MAX_ATTEMPTS = 4;

function normalizeMobile(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  const digits = value.replace(/\D/g, "");

  if (digits.length === 10) {
    return digits;
  }

  if (digits.length === 12 && digits.startsWith("91")) {
    return digits.slice(2);
  }

  return digits;
}

function hashValue(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export async function GET(request: Request) {
  try {
    await connectDB();

    const params = new URL(request.url).searchParams;
    const mobile = normalizeMobile(
      params.get("mobile") ??
        params.get("phone") ??
        params.get("mobileNumber") ??
        params.get("phone_number"),
    );
    const otp = params.get("otp")?.trim() ?? "";

    if (!mobile || mobile.length !== 10) {
      return NextResponse.json(
        {
          success: false,
          message: "A valid 10-digit mobile number is required.",
        },
        { status: 400 },
      );
    }

    if (!otp || otp.length !== 6) {
      return NextResponse.json(
        {
          success: false,
          message: "A valid 6-digit OTP is required.",
        },
        { status: 400 },
      );
    }

    const mobileHash = hashValue(mobile);
    const session = await Verification.findOne({ type: "mobile", mobileHash }).sort({ createdAt: -1 });

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Mobile verification session not found.",
        },
        { status: 404 },
      );
    }

    if (session.verified) {
      return NextResponse.json(
        {
          success: true,
          message: "Mobile number is already verified.",
        },
        { status: 200 },
      );
    }

    if (session.expiresAt && new Date(session.expiresAt).getTime() < Date.now()) {
      return NextResponse.json(
        {
          success: false,
          message: "OTP has expired. Please request a new one.",
        },
        { status: 410 },
      );
    }

    if ((session.attempts ?? 0) >= MAX_ATTEMPTS) {
      return NextResponse.json(
        {
          success: false,
          message: "Too many OTP attempts. Please request a new code.",
        },
        { status: 429 },
      );
    }

    const currentOtpHash = session.otpHash || "";
    const submittedHash = hashValue(otp);

    if (currentOtpHash !== submittedHash) {
      session.attempts = Number(session.attempts ?? 0) + 1;
      await session.save();

      return NextResponse.json(
        {
          success: false,
          message: "Invalid OTP.",
        },
        { status: 400 },
      );
    }

    session.verified = true;
    session.verifiedAt = new Date();
    session.attempts = Number(session.attempts ?? 0) + 1;
    session.lastProviderMessage = "OTP verified successfully";
    await session.save();

    return NextResponse.json(
      {
        success: true,
        message: "Mobile number verified successfully.",
      },
      { status: 200 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "OTP verification failed.";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 400 },
    );
  }
}
