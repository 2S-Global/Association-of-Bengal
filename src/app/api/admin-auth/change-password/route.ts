import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/admin/admin-session";
import { connectDB } from "@/lib/mongodb";

const MIN_PASSWORD_LENGTH = 8;

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const session = await verifyAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const currentPassword = typeof body.currentPassword === "string" ? body.currentPassword : "";
    const newPassword = typeof body.newPassword === "string" ? body.newPassword : "";
    const confirmPassword = typeof body.confirmPassword === "string" ? body.confirmPassword : "";

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json({ success: false, message: "All password fields are required." }, { status: 400 });
    }
    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      return NextResponse.json({ success: false, message: "New password must be at least 8 characters." }, { status: 400 });
    }
    if (newPassword !== confirmPassword) {
      return NextResponse.json({ success: false, message: "New passwords do not match." }, { status: 400 });
    }

    await connectDB();
    const admins = mongoose.connection.db?.collection<{ _id: mongoose.Types.ObjectId; password: string }>("admins");
    const admin = await admins?.findOne({ name: session.username, status: 1 });

    if (!admin || typeof admin.password !== "string" || !await bcrypt.compare(currentPassword, admin.password)) {
      return NextResponse.json({ success: false, message: "Current password is incorrect." }, { status: 400 });
    }

    const password = await bcrypt.hash(newPassword, 12);
    await admins?.updateOne({ _id: admin._id }, { $set: { password } });

    return NextResponse.json({ success: true, message: "Password changed successfully." });
  } catch {
    return NextResponse.json({ success: false, message: "Unable to change password. Please try again." }, { status: 500 });
  }
}
