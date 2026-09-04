
import { NextResponse } from "next/server";
import crypto from "crypto";
import mongoose from "mongoose";
import Razorpay from "razorpay";
import Donation from "@/models/Donation";
import Member from "@/models/Member";
import User from "@/models/User";
import Notification from "@/models/Notification";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      donationType,
      userId,
      originalAmount,
      originalCurrency,
    } = body;

    // 1. Sanitize user ID format
    if (userId && typeof userId === "object" && userId._id) {
      userId = userId._id;
    }
    if (typeof userId === "string") {
      userId = userId.replace(/['"]+/g, "").trim();
    }

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, message: `Invalid MongoDB User ID provided. Received: '${userId}'` },
        { status: 400 }
      );
    }

    // 2. Verify HMAC-SHA256 signature from Razorpay
    const secret = process.env.RAZORPAY_KEY_SECRET || "";
    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, message: "Invalid Razorpay payment signature" },
        { status: 400 }
      );
    }

    // 3. Initialize Razorpay to fetch true status from server-side API
    const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY || process.env.RAZORPAY_KEY_ID;
    const razorpay = new Razorpay({ key_id: key_id!, key_secret: secret });
    
    const paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);
    if (paymentDetails.status !== "captured" && paymentDetails.status !== "authorized") {
      return NextResponse.json(
        { success: false, message: `Payment not completed. Status: ${paymentDetails.status}` },
        { status: 400 }
      );
    }

    // 4. Database Connection & Updates
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    const member = await Member.findOne({ user: userId });
    if (!member) {
      return NextResponse.json({ success: false, message: "Member profile not found" }, { status: 404 });
    }

    const existingDonation = await Donation.findOne({ transactionId: razorpay_payment_id });
    if (existingDonation) {
      return NextResponse.json({ success: true, message: "Payment already recorded", data: existingDonation });
    }

    const chargedAmount = Number(paymentDetails.amount) / 100;
    const recordAmount = originalAmount ? Number(originalAmount) : chargedAmount;
    const recordCurrency = originalCurrency || paymentDetails.currency || "INR";
    const resolvedDonationType = donationType || paymentDetails.notes?.donationType || "Membership Registration";

    const donation = await Donation.create({
      member: member._id,
      user: userId,
      type: resolvedDonationType,
      amount: recordAmount,
      currency: recordCurrency,
      paymentMethod: "razorpay",
      status: "completed",
      transactionId: razorpay_payment_id,
      notes: paymentDetails.notes?.donationNotes || "Digital Portal Verified Transaction",
      razorpayOrderId: razorpay_order_id,
    });

    await Member.findByIdAndUpdate(member._id, {
      $inc: { totalContributions: recordAmount },
    });

    await User.findByIdAndUpdate(userId, { allstep_completed: true });

    await Notification.create({
      user: userId,
      icon: "receipt_long",
      title: "Donation Receipt Ready",
      message: `Your contribution REF: ${donation.referenceId} (${recordCurrency} ${recordAmount.toLocaleString()}) has been received.`,
      type: "finance",
      actionUrl: `/dashboard/donations/${donation._id}`,
    });

    return NextResponse.json({
      success: true,
      message: "Payment verified and recorded successfully",
      data: donation,
    });

  } catch (error: any) {
    console.error("❌ [Razorpay Verify Error]:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Payment verification failed" },
      { status: 500 }
    );
  }
}