import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/admin/admin-session";
import mongoose from "mongoose";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

    const session = await verifyAdminSession(token);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const admin = await mongoose.connection.db?.collection("admins").findOne(
      { name: session.username },
      { projection: { password: 0 } }
    );

    if (!admin) {
      return NextResponse.json({ message: "Admin not found" }, { status: 404 });
    }

    return NextResponse.json({
      name: admin.name,
      email: admin.email,
      role: admin.role,
    });
  } catch (error) {
    console.error("Failed to fetch admin:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}