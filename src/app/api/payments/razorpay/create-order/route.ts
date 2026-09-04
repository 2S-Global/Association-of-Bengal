


import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: Request) {
  try {
    // 1. Check environment variables safely
    const key_id = 
      process.env.RAZORPAY_KEY_ID || 
      process.env.NEXT_PUBLIC_RAZORPAY_KEY; 

    const key_secret = 
      process.env.RAZORPAY_KEY_SECRET || 
      process.env.RAZORPAY_SECRET_KEY;

    if (!key_id || !key_secret) {
      console.error("❌ Razorpay Key ID or Secret is missing from environment variables.");
      return NextResponse.json(
        { 
          success: false, 
          message: "Server configuration error: Razorpay keys are missing." 
        },
        { status: 500 }
      );
    }

    // 2. Parse request body safely
    const body = await req.json();
    console.log("📥 [Create Order] Received request body:", body);

    const { amount, currency = "INR" } = body;
    const parsedAmount = Number(amount);

    // 3. Validate amount to prevent 400 Bad Request errors
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      console.error("❌ [Create Order] Invalid amount received:", amount);
      return NextResponse.json(
        { success: false, message: "Invalid amount provided. Amount must be a positive number." },
        { status: 400 }
      );
    }

    // 4. Initialize Razorpay instance securely on the server
    const razorpay = new Razorpay({
      key_id,
      key_secret,
    });

    const options = {
      amount: Math.round(parsedAmount * 100), // Convert amount to paise (e.g., 500 INR -> 50000 paise)
      currency,
      receipt: `rcpt_${Date.now()}`,
    };

    // 5. Create order with Razorpay
    const order = await razorpay.orders.create(options);
    console.log("✅ [Create Order] Order created successfully:", order.id);

    return NextResponse.json(
      { 
        success: true, 
        data: order 
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("❌ [Create Order] Crash:", error);
    
    const errorMessage = 
      error?.error?.description || 
      error?.message || 
      (typeof error === 'string' ? error : "Internal server error");

    return NextResponse.json(
      { 
        success: false, 
        message: errorMessage 
      },
      { status: 500 }
    );
  }
}