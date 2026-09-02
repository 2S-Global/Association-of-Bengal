import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import VerificationSession from "@/models/Verification";

const QUICK_EKYC_BASE_URL =
  (process.env.AADHAR_BASE_URL || "https://api.quickekyc.com").replace(/\/$/, "");
const QUICK_EKYC_API_KEY = process.env.AADHAR_KEY || process.env.QUICKEKYC_API_KEY;
const RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_RESEND_COUNT = 5;
const OTP_TTL_MINUTES = 10;

function normalizeAadhaar(value: unknown): string {
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
        : "Aadhaar OTP resend failed.";

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

  return requestId;
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

    if (session.verified) {
      return NextResponse.json(
        {
          success: false,
          message: "Aadhaar number is already verified.",
        },
        { status: 400 },
      );
    }

    if (
      session.lastSentAt &&
      Date.now() - new Date(session.lastSentAt).getTime() < RESEND_COOLDOWN_MS
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please wait before resending the Aadhaar OTP.",
        },
        { status: 429 },
      );
    }

    if ((session.resendCount ?? 0) >= MAX_RESEND_COUNT) {
      return NextResponse.json(
        {
          success: false,
          message: "Maximum Aadhaar OTP resend attempts reached.",
        },
        { status: 429 },
      );
    }

    const requestId = await generateOtpWithProvider(aadhaar);

    session.providerRequestId = requestId;
    session.expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);
    session.attempts = 0;
    session.resendCount = Number(session.resendCount ?? 0) + 1;
    session.lastSentAt = new Date();
    session.lastProviderMessage = "OTP resent successfully";
    await session.save();

    return NextResponse.json(
      {
        success: true,
        message: "Aadhaar OTP resent successfully.",
      },
      { status: 200 },
    );
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : "Unable to resend Aadhaar OTP.";

    return NextResponse.json(
      {
        success: false,
        message:
          message.includes("not configured")
            ? "Aadhaar OTP provider is not configured on this server."
            : "Unable to resend Aadhaar OTP. Please try again.",
      },
      { status: message.includes("not configured") ? 500 : 400 },
    );
  }
}
