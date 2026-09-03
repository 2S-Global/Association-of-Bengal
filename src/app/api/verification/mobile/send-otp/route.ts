import crypto from "crypto";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import Member from "@/models/Member";
import User from "@/models/User";
import Verification from "@/models/Verification";

// ============================================================
// OTP CONFIGURATION
// ============================================================

const OTP_TTL_MINUTES = 2;
const RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_RESEND_COUNT = 12;
const MAX_ATTEMPTS = 4;

// ============================================================
// MOBILE HELPERS
// ============================================================

function normalizeMobile(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  const digits = value.replace(/\D/g, "");

  // 10-digit Indian mobile number
  if (digits.length === 10) {
    return digits;
  }

  // 12-digit number with 91 prefix
  if (digits.length === 12 && digits.startsWith("91")) {
    return digits.slice(2);
  }

  return digits;
}

function maskMobile(value: string): string {
  if (value.length <= 4) {
    return `******${value.slice(-2)}`;
  }

  return `******${value.slice(-4)}`;
}

// ============================================================
// HASH HELPER
// ============================================================

function hashValue(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

// ============================================================
// OTP GENERATOR
// ============================================================

function getOtp(): string {
  return crypto.randomInt(100000, 1000000).toString();
}

// ============================================================
// SMS PROVIDER RESPONSE PARSER
// ============================================================

function parseSmsResponse(payload: unknown): {
  success: boolean;
  message?: string;
  requestId?: string;
} {
  const record = Array.isArray(payload) ? payload[0] : payload;

  if (!record || typeof record !== "object") {
    return {
      success: false,
      message: "Invalid SMS provider response.",
    };
  }

  const response = record as Record<string, unknown>;

  const errorCode = response.ErrorCode ?? response.errorCode;

  const errorDescription =
    typeof response.ErrorDescription === "string"
      ? response.ErrorDescription
      : undefined;

  // MyLogin returns recipient information inside Data
  const data = response.Data ?? response.data;

  const firstDelivery = Array.isArray(data) ? data[0] : data;

  const delivery =
    firstDelivery && typeof firstDelivery === "object"
      ? (firstDelivery as Record<string, unknown>)
      : {};

  const requestId =
    response.MessageId ??
    response.messageId ??
    response.RequestId ??
    response.requestId ??
    delivery.MessageId ??
    delivery.messageId;

  // MyLogin success response
  if (errorCode === 0 || errorCode === "0" || errorCode === "000") {
    return {
      success: true,
      message: errorDescription || "SMS accepted by provider.",
      requestId: requestId == null ? undefined : String(requestId),
    };
  }

  if (typeof errorDescription === "string" && errorDescription.trim()) {
    return {
      success: false,
      message: errorDescription,
    };
  }

  if (typeof response.message === "string" && response.message.trim()) {
    return {
      success: false,
      message: response.message,
    };
  }

  return {
    success: false,
    message: "SMS provider returned an error.",
  };
}

// ============================================================
// SEND SMS OTP USING MYLOGIN
// ============================================================

async function sendSmsOtp(
  mobile: string,
  otp: string,
): Promise<{
  message: string;
  requestId?: string;
}> {
  // ----------------------------------------------------------
  // Read SMS configuration from .env
  // ----------------------------------------------------------

  const smsLink = process.env.SMS_LINK?.trim().replace(/^["']|["'];?$/g, "");

  const apiKey = process.env.API_KEY?.trim().replace(/^["']|["'];?$/g, "");

  const clientId = process.env.CLIENT_ID?.trim().replace(/^["']|["'];?$/g, "");

  const senderId = process.env.SENDER_ID?.trim().replace(/^["']|["'];?$/g, "");

  // ----------------------------------------------------------
  // Validate configuration
  // ----------------------------------------------------------

  if (!smsLink || !apiKey || !clientId || !senderId) {
    throw new Error("SMS provider credentials are not configured.");
  }

  // ----------------------------------------------------------
  // MyLogin expects Indian country code
  // Example:
  // 7908073117 -> 917908073117
  // ----------------------------------------------------------

  const mobileNumber = `91${mobile}`;

  // ----------------------------------------------------------
  // Dynamic OTP message
  // ----------------------------------------------------------

  const smsMessage = `Dear User, Use OTP : ${otp} to verify your mobile number for GEISIL. This code is valid for 2 minutes. Global Employability Information Services India Limited.`;

  // ----------------------------------------------------------
  // Build URL safely using URLSearchParams
  // ----------------------------------------------------------

  const params = new URLSearchParams({
    SenderId: senderId,
    Message: smsMessage,
    MobileNumbers: mobileNumber,
    ApiKey: apiKey,
    ClientId: clientId,
  });

  const url = `${smsLink}?${params.toString()}`;

  // ----------------------------------------------------------
  // Safe logging
  // DO NOT log API key or complete SMS URL
  // ----------------------------------------------------------

  console.log("SMS API:", smsLink);
  console.log("SMS Sender ID:", senderId);
  console.log("Sending OTP SMS to:", maskMobile(mobile));

  try {
    // --------------------------------------------------------
    // Call MyLogin SendSMS API
    // --------------------------------------------------------

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "text/plain",
      },
      cache: "no-store",
    });

    // --------------------------------------------------------
    // Read provider response
    // --------------------------------------------------------

    const text = await response.text();

    console.log("MyLogin HTTP status:", response.status);

    console.log("MyLogin raw response:", text);

    let parsed: unknown = null;

    try {
      parsed = text ? JSON.parse(text) : null;
    } catch {
      throw new Error("Invalid response received from SMS provider.");
    }

    // --------------------------------------------------------
    // Parse MyLogin response
    // --------------------------------------------------------

    const result = parseSmsResponse(parsed);

    console.log("MyLogin parsed response:", JSON.stringify(result, null, 2));

    // --------------------------------------------------------
    // SMS accepted
    // --------------------------------------------------------

    if (response.ok && result.success) {
      return {
        message: result.message || "SMS accepted by provider.",
        requestId: result.requestId,
      };
    }

    // --------------------------------------------------------
    // SMS rejected
    // --------------------------------------------------------

    throw new Error(
      result.message || `SMS provider rejected request: ${response.status}`,
    );
  } catch (error) {
    console.error("MyLogin SMS error:", error);

    throw new Error(
      error instanceof Error ? error.message : "Unable to send SMS OTP.",
    );
  }
}

// ============================================================
// GET - SEND MOBILE OTP
// ============================================================

export async function GET(request: Request) {
  try {
    // ----------------------------------------------------------
    // Connect MongoDB
    // ----------------------------------------------------------

    await connectDB();

    // ----------------------------------------------------------
    // Read query parameters
    //
    // Supported:
    // ?mobile=8250397426
    // ?phone=8250397426
    // ?mobileNumber=8250397426
    // ?phone_number=8250397426
    // ----------------------------------------------------------

    const params = new URL(request.url).searchParams;

    const mobile = normalizeMobile(
      params.get("mobile") ??
        params.get("phone") ??
        params.get("mobileNumber") ??
        params.get("phone_number"),
    );

    const memberId = params.get("memberId")?.trim() ?? "";

    const userId = params.get("userId")?.trim() ?? "";

    // ----------------------------------------------------------
    // Validate mobile
    // ----------------------------------------------------------

    if (!mobile || mobile.length !== 10) {
      return NextResponse.json(
        {
          success: false,
          message: "A valid 10-digit mobile number is required.",
        },
        { status: 400 },
      );
    }

    // ----------------------------------------------------------
    // Hash mobile
    // ----------------------------------------------------------

    const mobileHash = hashValue(mobile);

    // ----------------------------------------------------------
    // Find existing verification session
    // ----------------------------------------------------------

    const existingSession = await Verification.findOne({
      type: "mobile",
      mobileHash,
    }).sort({
      createdAt: -1,
    });

    // ----------------------------------------------------------
    // Requested IDs
    // ----------------------------------------------------------

    const requestedUserId = userId || "";
    const requestedMemberId = memberId || "";

    // ----------------------------------------------------------
    // Find user
    // ----------------------------------------------------------

    const userRecord = requestedUserId
      ? mongoose.Types.ObjectId.isValid(requestedUserId)
        ? await User.findById(requestedUserId).select("_id").lean()
        : null
      : await User.findOne({
          mobile: {
            $in: [mobile, `91${mobile}`, `+91${mobile}`],
          },
        })
          .select("_id")
          .lean();

    // ----------------------------------------------------------
    // Find member
    // ----------------------------------------------------------

    const memberRecord = requestedMemberId
      ? mongoose.Types.ObjectId.isValid(requestedMemberId)
        ? await Member.findById(requestedMemberId)
            .select("_id memberId user")
            .lean()
        : await Member.findOne({
            memberId: requestedMemberId,
          })
            .select("_id memberId user")
            .lean()
      : userRecord
        ? await Member.findOne({
            user: userRecord._id,
          })
            .select("_id memberId user")
            .lean()
        : null;

    // ==========================================================
    // RESEND COOLDOWN
    // ==========================================================

    if (
      existingSession &&
      !existingSession.verified &&
      existingSession.lastSentAt &&
      Date.now() - new Date(existingSession.lastSentAt).getTime() <
        RESEND_COOLDOWN_MS
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please wait before requesting a new OTP.",
        },
        { status: 429 },
      );
    }

    // ==========================================================
    // MAX RESEND LIMIT
    // ==========================================================

    if (
      existingSession &&
      !existingSession.verified &&
      Number(existingSession.resendCount ?? 0) >= MAX_RESEND_COUNT
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Maximum OTP requests reached. Please try again later.",
        },
        { status: 429 },
      );
    }

    // ==========================================================
    // GENERATE OTP
    // ==========================================================

    const otp = getOtp();

    console.log(`Generated OTP for ${maskMobile(mobile)}`);

    // ----------------------------------------------------------
    // Hash OTP
    // ----------------------------------------------------------

    const otpHash = hashValue(otp);

    // ==========================================================
    // SEND SMS FIRST
    //
    // Important:
    // We only save/update the verification session after
    // MyLogin successfully accepts the SMS.
    // ==========================================================

    const providerResult = await sendSmsOtp(mobile, otp);

    // ==========================================================
    // PREPARE VERIFICATION SESSION
    // ==========================================================

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

      lastProviderMessage: providerResult.message,
    };

    // ----------------------------------------------------------
    // Attach member ID when available
    // ----------------------------------------------------------

    if (memberRecord?._id || requestedMemberId) {
      payload.memberId = memberRecord?._id || requestedMemberId;
    }

    // ----------------------------------------------------------
    // Attach user ID when available
    // ----------------------------------------------------------

    if (userRecord?._id || requestedUserId) {
      payload.userId = userRecord?._id || requestedUserId;
    }

    // ----------------------------------------------------------
    // Store provider request/message ID
    // ----------------------------------------------------------

    if (providerResult.requestId) {
      payload.providerRequestId = providerResult.requestId;
    }

    // ==========================================================
    // UPDATE EXISTING SESSION
    // ==========================================================

    if (existingSession?._id) {
      await Verification.updateOne(
        {
          _id: existingSession._id,
        },
        {
          $set: payload,

          $unset: {
            aadhaarHash: 1,
            aadhaarMasked: 1,
          },
        },
      );
    }

    // ==========================================================
    // CREATE NEW SESSION
    // ==========================================================
    else {
      await Verification.create(payload);
    }

    // ==========================================================
    // SUCCESS RESPONSE
    // ==========================================================

    return NextResponse.json(
      {
        success: true,
        message: "OTP sent successfully.",
        mobile: maskMobile(mobile),
        expiresIn: OTP_TTL_MINUTES * 60,
      },
      { status: 200 },
    );
  } catch (error) {
    // ==========================================================
    // ERROR HANDLING
    // ==========================================================

    console.error("Mobile OTP send error:", error);

    const message =
      error instanceof Error ? error.message : "Unable to send OTP.";

    return NextResponse.json(
      {
        success: false,
        message: message.includes("configured")
          ? "SMS provider is not configured on this server."
          : "Unable to send OTP. Please try again.",
      },
      {
        status: message.includes("configured") ? 500 : 400,
      },
    );
  }
}
