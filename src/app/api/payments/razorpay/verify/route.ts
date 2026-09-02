import { NextResponse } from 'next/server';
import crypto from 'crypto';
import mongoose from 'mongoose';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("📥 [Verify API] Incoming payload:", body);

    let {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      donationType,
      userId,
    } = body;

    // 🛡️ Fallback: If userId is missing from body, try to extract it from headers or query if available, 
    // or handle it gracefully so it doesn't crash the app.
    if (!userId) {
      console.warn("⚠️ [Verify API] userId was missing in request body!");
    }

    // Clean up format if passed as an object or string with quotes
    if (userId && typeof userId === 'object' && userId._id) {
      userId = userId._id;
    }
    if (typeof userId === 'string') {
      userId = userId.replace(/['"]+/g, '').trim();
    }

    // Validate MongoDB ObjectId (If still invalid, return a helpful debug message)
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      console.error("❌ [Verify API] Validation failed for userId:", userId);
      return NextResponse.json(
        { 
          success: false, 
          message: `Invalid MongoDB User ID provided. Received: '${userId}'` 
        },
        { status: 400 }
      );
    }

    // Verify HMAC-SHA256 signature from Razorpay
    const secret = process.env.RAZORPAY_KEY_SECRET || '';
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, message: 'Invalid Razorpay payment signature' },
        { status: 400 }
      );
    }

    const paymentResult = {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      userId: new mongoose.Types.ObjectId(userId),
      donationType: donationType || 'Membership Registration',
      status: 'PAID',
      paidAt: new Date(),
    };

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      data: paymentResult,
    });
  } catch (error: any) {
    console.error('[Razorpay Verify Error]:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Payment verification failed' },
      { status: 500 }
    );
  }
}