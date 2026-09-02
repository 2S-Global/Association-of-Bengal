import { NextResponse } from "next/server";
import crypto from "crypto";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import VerificationSession from "@/models/Verification";
import Member from "@/models/Member";

const QUICK_EKYC_BASE_URL =
  (process.env.AADHAR_BASE_URL || "https://api.quickekyc.com").replace(/\/$/, "");
const QUICK_EKYC_API_KEY = process.env.AADHAR_KEY || process.env.QUICKEKYC_API_KEY;
const MAX_ATTEMPTS = 4;

function normalizeAadhaar(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  return value.replace(/\D/g, "");
}

function normalizeOtp(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  return value.replace(/\D/g, "");
}

function hashAadhaar(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function isProviderSuccess(payload: any): boolean {
  const statusCode = payload?.status_code ?? payload?.statusCode;
  const successFlag = payload?.success;

  return (
    statusCode === 200 ||
    statusCode === "200" ||
    successFlag === true ||
    payload?.data?.status_code === 200 ||
    payload?.data?.status_code === "200"
  );
}

async function submitOtpWithProvider(requestId: string, otp: string) {
  const apiKey = QUICK_EKYC_API_KEY;

  if (!apiKey) {
    throw new Error("Aadhaar OTP provider is not configured.");
  }

  const response = await fetch(`${QUICK_EKYC_BASE_URL}/api/v1/aadhaar-v2/submit-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      key: apiKey,
      request_id: requestId,
      otp,
    }),
  });

  const rawText = await response.text();
  let payload: any = {};

  try {
    payload = rawText ? JSON.parse(rawText) : {};
  } catch {
    throw new Error("Aadhaar OTP verification provider returned an invalid response.");
  }

  if (!response.ok || !isProviderSuccess(payload)) {
    const providerMessage =
      typeof payload?.message === "string" && payload.message.trim()
        ? payload.message
        : "Aadhaar OTP verification failed.";

    throw new Error(providerMessage);
  }

  return payload;
}

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json().catch(() => ({}));
    const aadhaar = normalizeAadhaar(body.aadhaar ?? body.aadhaarNumber);
    const otp = normalizeOtp(body.otp);
    const requestId = typeof body.requestId === "string" ? body.requestId.trim() : "";
    const memberId = typeof body.memberId === "string" ? body.memberId.trim() : "";
    const userId = typeof body.userId === "string" ? body.userId.trim() : "";

    if (!aadhaar || aadhaar.length !== 12) {
      return NextResponse.json(
        {
          success: false,
          message: "A valid 12-digit Aadhaar number is required.",
        },
        { status: 400 },
      );
    }

    if (!otp || otp.length !== 6) {
      return NextResponse.json(
        {
          success: false,
          message: "A valid 6-digit Aadhaar OTP is required.",
        },
        { status: 400 },
      );
    }

    const aadhaarHash = hashAadhaar(aadhaar);
    const sessionQuery: Record<string, unknown> = {
      type: "aadhaar",
      aadhaarHash,
    };

    if (memberId) {
      sessionQuery.memberId = memberId;
    }

    if (userId) {
      sessionQuery.userId = userId;
    }

    const session = await VerificationSession.findOne(sessionQuery).sort({ createdAt: -1 });

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Aadhaar verification session not found.",
        },
        { status: 404 },
      );
    }

    const sessionRequestId = requestId || session.providerRequestId || "";
    if (!sessionRequestId) {
      return NextResponse.json(
        {
          success: false,
          message: "Aadhaar verification request ID is missing.",
        },
        { status: 400 },
      );
    }

    if (session.verified) {
      return NextResponse.json(
        {
          success: true,
          message: "Aadhaar number is already verified.",
        },
        { status: 200 },
      );
    }

    if (session.expiresAt && new Date(session.expiresAt).getTime() < Date.now()) {
      return NextResponse.json(
        {
          success: false,
          message: "Aadhaar OTP has expired. Please request a new one.",
        },
        { status: 410 },
      );
    }

    if ((session.attempts ?? 0) >= MAX_ATTEMPTS) {
      return NextResponse.json(
        {
          success: false,
          message: "Too many Aadhaar OTP verification attempts. Please request a new code.",
        },
        { status: 429 },
      );
    }

    await submitOtpWithProvider(sessionRequestId, otp);

    session.verified = true;
    session.verifiedAt = new Date();
    session.attempts = Number(session.attempts ?? 0) + 1;
    session.lastProviderMessage = "OTP verified successfully";
    await session.save();

    const targetMemberId =
      session.memberId && mongoose.Types.ObjectId.isValid(String(session.memberId))
        ? String(session.memberId)
        : memberId || null;

    if (targetMemberId) {
      const memberRecord =
        mongoose.Types.ObjectId.isValid(targetMemberId)
          ? await Member.findById(targetMemberId)
          : await Member.findOne({ memberId: targetMemberId });

      if (memberRecord) {
        memberRecord.nid = aadhaar;
        memberRecord.verified = true;
        memberRecord.verifiedAt = new Date();
        await memberRecord.save();
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Aadhaar number verified successfully.",
      },
      { status: 200 },
    );
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : "Aadhaar OTP verification failed.";

    const genericMessage =
      message.toLowerCase().includes("invalid") ||
      message.toLowerCase().includes("expired") ||
      message.toLowerCase().includes("not configured")
        ? "Invalid or expired Aadhaar OTP. Please request a new one."
        : "Aadhaar OTP verification failed. Please try again.";

    return NextResponse.json(
      {
        success: false,
        message: genericMessage,
      },
      { status: 400 },
    );
  }
}
