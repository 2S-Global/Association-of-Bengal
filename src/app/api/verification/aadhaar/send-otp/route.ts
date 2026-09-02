import { NextResponse } from "next/server";
import crypto from "crypto";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import VerificationSession from "@/models/Verification";
import Member from "@/models/Member";

const QUICK_EKYC_BASE_URL =
  (process.env.AADHAR_BASE_URL || "https://api.quickekyc.com").replace(/\/$/, "");
const QUICK_EKYC_API_KEY = process.env.AADHAR_KEY || process.env.QUICKEKYC_API_KEY;
const OTP_TTL_MINUTES = 10;
const RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_RESEND_COUNT = 5;

function normalizeAadhaar(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  return value.replace(/\D/g, "");
}

function hashAadhaar(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function maskAadhaar(value: string): string {
  if (value.length !== 12) {
    return "XXXX XXXX XXXX";
  }

  return `XXXX XXXX ${value.slice(-4)}`;
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

function toObjectIdOrNull(value: unknown): mongoose.Types.ObjectId | null {
  if (typeof value !== "string" || !mongoose.Types.ObjectId.isValid(value)) {
    return null;
  }

  return new mongoose.Types.ObjectId(value);
}

async function generateOtpWithProvider(aadhaar: string) {
  const apiKey = QUICK_EKYC_API_KEY;

  if (!apiKey) {
    throw new Error("Aadhaar OTP provider is not configured.");
  }

  const response = await fetch(`${QUICK_EKYC_BASE_URL}/api/v1/aadhaar-v2/generate-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      key: apiKey,
      id_number: aadhaar,
    }),
  });

  const rawText = await response.text();
  let payload: any = {};

  try {
    payload = rawText ? JSON.parse(rawText) : {};
  } catch {
    throw new Error("Aadhaar OTP provider returned an invalid response.");
  }

  if (!response.ok || !isProviderSuccess(payload)) {
    const providerMessage =
      typeof payload?.message === "string" && payload.message.trim()
        ? payload.message
        : "Aadhaar OTP request failed.";

    throw new Error(providerMessage);
  }

  const requestId =
    payload?.request_id ??
    payload?.requestId ??
    payload?.data?.request_id ??
    payload?.data?.requestId;

  if (!requestId) {
    throw new Error("Aadhaar OTP provider did not return a request ID.");
  }

  return {
    requestId,
    statusCode: Number(payload?.status_code ?? payload?.statusCode ?? 200),
  };
}

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json().catch(() => ({}));
    const aadhaar = normalizeAadhaar(body.aadhaar ?? body.aadhaarNumber);
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

    const aadhaarHash = hashAadhaar(aadhaar);
    const existingSession = await VerificationSession.findOne({
      type: "aadhaar",
      aadhaarHash,
    })
      .sort({ createdAt: -1 })
      .lean();

    if (
      existingSession &&
      existingSession.verified === false &&
      existingSession.lastSentAt &&
      Date.now() - new Date(existingSession.lastSentAt).getTime() < RESEND_COOLDOWN_MS
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please wait before requesting a new Aadhaar OTP.",
        },
        { status: 429 },
      );
    }

    if (
      existingSession &&
      existingSession.verified === false &&
      Number(existingSession.resendCount ?? 0) >= MAX_RESEND_COUNT
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Maximum Aadhaar OTP requests reached. Please try again later.",
        },
        { status: 429 },
      );
    }

    const { requestId } = await generateOtpWithProvider(aadhaar);

    const baseSessionPayload: Record<string, unknown> = {
      type: "aadhaar",
      aadhaarHash,
      aadhaarMasked: maskAadhaar(aadhaar),
      providerRequestId: requestId,
      expiresAt: new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000),
      attempts: 0,
      verified: false,
      verifiedAt: null,
      lastSentAt: new Date(),
      lastProviderMessage: "OTP requested successfully",
      resendCount: Number(existingSession?.resendCount ?? 0) + 1,
    };

    if (memberId) {
      baseSessionPayload.memberId = memberId;
    }

    if (userId) {
      baseSessionPayload.userId = toObjectIdOrNull(userId) ?? userId;
    }

    if (existingSession?._id) {
      await VerificationSession.updateOne(
        { _id: existingSession._id },
        {
          $set: baseSessionPayload,
        },
      );
    } else {
      await VerificationSession.create(baseSessionPayload);
    }

    if (memberId) {
      const memberRecord =
        mongoose.Types.ObjectId.isValid(memberId)
          ? await Member.findById(memberId)
          : await Member.findOne({ memberId });

      if (memberRecord) {
        memberRecord.nid = aadhaar;
        await memberRecord.save();
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Aadhaar OTP sent successfully.",
      },
      { status: 200 },
    );
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : "Unable to send Aadhaar OTP.";

    const status = message.includes("configured") || message.includes("invalid response") ? 500 : 400;

    return NextResponse.json(
      {
        success: false,
        message:
          status === 500
            ? "Aadhaar OTP provider is not configured on this server."
            : "Unable to send Aadhaar OTP. Please try again.",
      },
      { status },
    );
  }
}
