import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    const users = await User.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("GET users error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch users",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();

    const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const mobile = typeof body.mobile === "string" ? body.mobile.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!fullName || !email || !mobile || password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message: "Full name, email, mobile number, and a password of at least 8 characters are required.",
        },
        { status: 400 },
      );
    }

    const user = await User.create({
      fullName,
      email,
      mobile,
      password,
    });

    return NextResponse.json(
      {
        success: true,
        data: user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST user error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create user",
      },
      { status: 500 }
    );
  }
}
