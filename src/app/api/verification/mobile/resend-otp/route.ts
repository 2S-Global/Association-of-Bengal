import crypto from "crypto";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Verification from "@/models/Verification";

const OTP_TTL_MINUTES = 2;
const RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_RESEND_COUNT = 12;

function normalizeMobile(value: string | null): string {
  const digits = (value ?? "").replace(/\D/g, "");
  return digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits;
}

function maskMobile(value: string): string {
  return `******${value.slice(-4)}`;
}

function hashValue(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function parseSmsResponse(payload: unknown): { success: boolean; message?: string; requestId?: string } {
  if (!payload || typeof payload !== "object") {
    return { success: false, message: "Invalid SMS provider response." };
  }

  const response = payload as Record<string, unknown>;
  const errorCode = response.ErrorCode ?? response.errorCode;
  const errorDescription = typeof response.ErrorDescription === "string" ? response.ErrorDescription : undefined;
  const data = response.Data ?? response.data;
  const firstDelivery = Array.isArray(data) ? data[0] : data;
  const delivery = firstDelivery && typeof firstDelivery === "object"
    ? (firstDelivery as Record<string, unknown>)
    : {};
  const requestId = delivery.MessageId ?? delivery.messageId ?? response.MessageId ?? response.messageId;

  if (errorCode === 0 || errorCode === "0" || errorCode === "000") {
    return { success: true, message: errorDescription || "SMS accepted by provider.", requestId: requestId == null ? undefined : String(requestId) };
  }

  return { success: false, message: errorDescription || "SMS provider returned an error." };
}

async function sendSmsOtp(mobile: string, otp: string): Promise<{ message: string; requestId?: string }> {
  const smsLink = process.env.SMS_LINK?.trim().replace(/^["']|["'];?$/g, "");
  const apiKey = process.env.API_KEY?.trim().replace(/^["']|["'];?$/g, "");
  const clientId = process.env.CLIENT_ID?.trim().replace(/^["']|["'];?$/g, "");
  const senderId = process.env.SENDER_ID?.trim().replace(/^["']|["'];?$/g, "");

  if (!smsLink || !apiKey || !clientId || !senderId) {
    throw new Error("SMS provider credentials are not configured.");
  }

  const params = new URLSearchParams({
    SenderId: senderId,
    Message: `Dear User, Use OTP : ${otp} to verify your mobile number for GEISIL. This code is valid for 2 minutes. Global Employability Information Services India Limited.`,
    MobileNumbers: `91${mobile}`,
    ApiKey: apiKey,
    ClientId: clientId,
  });
  const response = await fetch(`${smsLink}?${params.toString()}`, {
    method: "GET",
    headers: { Accept: "text/plain" },
    cache: "no-store",
  });
  const text = await response.text();

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("Invalid response received from SMS provider.");
  }

  const result = parseSmsResponse(parsed);
  if (!response.ok || !result.success) {
    throw new Error(result.message || `SMS provider rejected request: ${response.status}`);
  }

  return { message: result.message || "SMS accepted by provider.", requestId: result.requestId };
}

export async function GET(request: Request) {
  try {
    await connectDB();

    const mobile = normalizeMobile(new URL(request.url).searchParams.get("mobile"));
    if (mobile.length !== 10) {
      return NextResponse.json({ success: false, message: "A valid 10-digit mobile number is required." }, { status: 400 });
    }

    const session = await Verification.findOne({ type: "mobile", mobileHash: hashValue(mobile) }).sort({ createdAt: -1 });
    if (!session) {
      return NextResponse.json({ success: false, message: "Mobile verification session not found." }, { status: 404 });
    }
    if (session.verified) {
      return NextResponse.json({ success: false, message: "Mobile number is already verified." }, { status: 400 });
    }
    if (session.lastSentAt && Date.now() - new Date(session.lastSentAt).getTime() < RESEND_COOLDOWN_MS) {
      return NextResponse.json({ success: false, message: "Please wait before resending the OTP." }, { status: 429 });
    }
    if (Number(session.resendCount ?? 0) >= MAX_RESEND_COUNT) {
      return NextResponse.json({ success: false, message: "Maximum OTP resend attempts reached." }, { status: 429 });
    }

    const otp = crypto.randomInt(100000, 1000000).toString();
    const providerResult = await sendSmsOtp(mobile, otp);
    session.otpHash = hashValue(otp);
    session.expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);
    session.attempts = 0;
    session.resendCount = Number(session.resendCount ?? 0) + 1;
    session.lastSentAt = new Date();
    session.lastProviderMessage = providerResult.message;
    if (providerResult.requestId) session.providerRequestId = providerResult.requestId;
    await session.save();

    return NextResponse.json({ success: true, message: "OTP resent successfully.", mobile: maskMobile(mobile), expiresIn: OTP_TTL_MINUTES * 60 }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to resend OTP.";
    return NextResponse.json(
      { success: false, message: message.includes("configured") ? "SMS provider is not configured on this server." : "Unable to resend OTP. Please try again." },
      { status: message.includes("configured") ? 500 : 400 },
    );
  }
}
