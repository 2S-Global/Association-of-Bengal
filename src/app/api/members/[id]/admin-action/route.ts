import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/admin/admin-session";
import Member from "@/models/Member";

type Context = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: Context) {
  try {
    const cookieStore = await cookies();
    const session = await verifyAdminSession(
      cookieStore.get(ADMIN_SESSION_COOKIE)?.value,
    );

    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid member ID." }, { status: 400 });
    }

    const { action } = await request.json();
    if (action !== "approve" && action !== "reject") {
      return NextResponse.json({ success: false, message: "Invalid admin action." }, { status: 400 });
    }

    await connectDB();

    const member = await Member.findById(id).select("user").lean();
    if (!member) {
      return NextResponse.json({ success: false, message: "Member not found." }, { status: 404 });
    }

    const now = new Date();
    const users = mongoose.connection.db?.collection("users");

    if (!users) {
      throw new Error("Users collection is unavailable.");
    }

    const updateResult = await users.updateOne(
      { _id: member.user },
      {
        $set: {
          is_admin_approved: action === "approve",
          is_admin_rejected: action === "reject",
          adminActionTakenAt: now,
          updatedAt: now,
        },
      },
    );

    if (!updateResult.matchedCount) {
      return NextResponse.json({ success: false, message: "Linked user not found." }, { status: 404 });
    }

    const user = await users.findOne(
      { _id: member.user },
      {
        projection: {
          email: 1,
          mobile: 1,
          step: 1,
          allstep_completed: 1,
          is_admin_approved: 1,
          is_admin_rejected: 1,
          adminActionTakenAt: 1,
        },
      },
    );

    if (!user) {
      return NextResponse.json({ success: false, message: "Linked user not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: action === "approve" ? "Member approved successfully." : "Member rejected successfully.",
      data: {
        user: {
          ...user,
          _id: user._id.toString(),
        },
      },
    });
  } catch (error) {
    console.error("PATCH member admin action error:", error);
    return NextResponse.json(
      { success: false, message: "Unable to update the member approval status." },
      { status: 500 },
    );
  }
}
