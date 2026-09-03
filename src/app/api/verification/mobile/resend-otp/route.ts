import crypto from "crypto";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Member from "@/models/Member";
import User from "@/models/User";
import Verification from "@/models/Verification";

const OTP_TTL_MINUTES = 10;
const RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_RESEND_COUNT = 5;

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

function maskMobile(value: string): string {
  if (value.length <= 4) {
    return `******${value.slice(-2)}`;
  }

  return `******${value.slice(-4)}`;
}

function getOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function parseSmsResponse(payload: unknown): { success: boolean; message?: string; requestId?: string } {
  const record = Array.isArray(payload) ? payload[0] : payload;

  if (!record || typeof record !== "object") {
    return { success: false, message: "Invalid SMS provider response." };
  }

  const response = record as Record<string, unknown>;
  const errorCode = response.ErrorCode ?? response.errorCode;
  const errorDescription = typeof response.ErrorDescription === "string" ? response.ErrorDescription : undefined;
  // MyLogin returns the per-recipient message IDs inside Data for SendSMS.
  const data = response.Data ?? response.data;
  const firstDelivery = Array.isArray(data) ? data[0] : data;
  const delivery = firstDelivery && typeof firstDelivery === "object"
    ? (firstDelivery as Record<string, unknown>)
    : {};
  const requestId =
    response.MessageId ??
    response.messageId ??
    response.RequestId ??
    response.requestId ??
    delivery.MessageId ??
    delivery.messageId;

  if (errorCode === 0 || errorCode === "0" || errorCode === "000") {
    return {
      success: true,
      message: errorDescription || "SMS accepted by provider.",
      requestId: requestId == null ? undefined : String(requestId),
    };
  }

  if (typeof errorDescription === "string" && errorDescription.trim()) {
    return { success: false, message: errorDescription };
  }

  if (typeof response.message === "string" && response.message.trim()) {
    return { success: false, message: response.message };
  }

  return { success: false, message: "SMS provider returned an error." };
}

async function sendSmsOtp(mobile: string, otp: string): Promise<{ message: string; requestId?: string }> {
  const smsLink = (process.env.SMS_LINK || "https://api.mylogin.co.in").replace(/\/$/, "");
  const smsKey = process.env.SMS_KEY;
  const smsClientId = process.env.SMS_CLIENT_ID;
  const senderId = process.env.SMS_SENDER_ID || "ABLC";

  if (!smsKey || !smsClientId) {
    throw new Error("SMS provider credentials are not configured.");
  }

  const url = `${smsLink}/api/v2/SendSMS`;
  const body = {
    ApiKey: smsKey,
    ClientId: smsClientId,
    SenderId: senderId,
    Message: `Your verification OTP is ${otp}.`,
    MobileNumbers: mobile,
    Is_Unicode: false,
    Is_Flash: false,
    IsRegisteredForDelivery: true,
    DataCoding: "0",
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Type: "json",
      },
      body: JSON.stringify(body),
    });

    const text = await response.text();
    let parsed: unknown = null;

    try {
      parsed = text ? JSON.parse(text) : null;
    } catch {
      parsed = null;
    }

    const result = parseSmsResponse(parsed);

    if (response.ok && result.success) {
      return { message: result.message || "SMS accepted by provider.", requestId: result.requestId };
    }

    throw new Error(result.message || `SMS provider rejected request: ${response.status}`);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Unable to send SMS OTP.");
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json().catch(() => ({}));
    const mobile = normalizeMobile(body.mobile ?? body.phone ?? body.mobileNumber ?? body.phone_number);
    const memberId = typeof body.memberId === "string" ? body.memberId.trim() : "";
    const userId = typeof body.userId === "string" ? body.userId.trim() : "";

    if (!mobile || mobile.length !== 10) {
      return NextResponse.json(
        {
          success: false,
          message: "A valid 10-digit mobile number is required.",
        },
        { status: 400 },
      );
    }

    const mobileHash = hashValue(mobile);
    const existingSession = await Verification.findOne({ type: "mobile", mobileHash }).sort({ createdAt: -1 });
    const userRecord = userId
      ? mongoose.Types.ObjectId.isValid(userId)
        ? await User.findById(userId).select("_id").lean()
        : null
      : await User.findOne({ mobile: { $in: [mobile, `91${mobile}`, `+91${mobile}`] } })
          .select("_id")
          .lean();
    const memberRecord = memberId
      ? mongoose.Types.ObjectId.isValid(memberId)
        ? await Member.findById(memberId).select("_id memberId user").lean()
        : await Member.findOne({ memberId }).select("_id memberId user").lean()
      : userRecord
        ? await Member.findOne({ user: userRecord._id }).select("_id memberId user").lean()
        : null;

    if (
      existingSession &&
      !existingSession.verified &&
      existingSession.lastSentAt &&
      Date.now() - new Date(existingSession.lastSentAt).getTime() < RESEND_COOLDOWN_MS
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please wait before resending the OTP.",
        },
        { status: 429 },
      );
    }

    if (
      existingSession &&
      !existingSession.verified &&
      Number(existingSession.resendCount ?? 0) >= MAX_RESEND_COUNT
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Maximum OTP resend attempts reached.",
        },
        { status: 429 },
      );
    }

    const otp = getOtp();
    const otpHash = hashValue(otp);
    const payload: Record<string, unknown> = {
      type: "mobile",
      mobile,
      mobileHash,
      mobileMasked: maskMobile(mobile),
      otpHash,
      expiresAt: new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000),
      attempts: 0,
      resendCount: Number(existingSession?.resendCount ?? 0) + 1,
      verified: false,
      verifiedAt: null,
      lastSentAt: new Date(),
      lastProviderMessage: "OTP resent successfully",
    };

    if (memberRecord?._id || memberId) payload.memberId = memberRecord?._id || memberId;
    if (userRecord?._id || userId) payload.userId = userRecord?._id || userId;

    const providerResult = await sendSmsOtp(mobile, otp);
    if (providerResult.requestId) payload.providerRequestId = providerResult.requestId;
    payload.lastProviderMessage = providerResult.message;

    if (existingSession?._id) {
      await Verification.updateOne(
        { _id: existingSession._id },
        { $set: payload, $unset: { aadhaarHash: 1, aadhaarMasked: 1 } },
      );
    } else {
      await Verification.create(payload);
    }

    return NextResponse.json(
      {
        success: true,
        message: "OTP sent successfully.",
      },
      { status: 200 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to resend OTP.";

    return NextResponse.json(
      {
        success: false,
        message:
          message.includes("configured")
            ? "SMS provider is not configured on this server."
            : "Unable to resend OTP. Please try again.",
      },
      { status: message.includes("configured") ? 500 : 400 },
    );
  }
}
