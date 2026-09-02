import { NextResponse } from 'next/server';
import crypto from 'crypto';
import mongoose from 'mongoose';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      donationType,
      userId,
    } = body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid MongoDB User ID provided' },
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

    // Save donation/payment record to database here
    const paymentResult = {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      userId,
      donationType,
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