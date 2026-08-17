import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_MAX_AGE, createAdminSession } from "@/lib/admin/admin-session";
import mongoose from "mongoose";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const username = typeof body.username === "string" ? body.username.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!username || !password) {
      return NextResponse.json({ success: false, message: "Username and password are required." }, { status: 400 });
    }

    await connectDB();
    const admin = await mongoose.connection.db?.collection("admins").findOne({
      name: username,
      password,
      status: 1,
    });

    if (!admin) {
      return NextResponse.json({ success: false, message: "Invalid username or password." }, { status: 401 });
    }

    const response = NextResponse.json({ success: true, data: { username: admin.name } });
    response.cookies.set({
      name: ADMIN_SESSION_COOKIE,
      value: await createAdminSession(admin.name),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: ADMIN_SESSION_MAX_AGE,
    });
    return response;
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json({ success: false, message: "Unable to sign in. Please try again." }, { status: 500 });
  }
}
