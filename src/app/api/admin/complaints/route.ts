import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Complaint from "@/models/Complaint";
import { sendSupportResponseEmail } from "@/lib/supportEmail"; 

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const complaint = await Complaint.findById(id);
      if (!complaint) {
        return NextResponse.json({ error: "Complaint not found." }, { status: 404 });
      }
      return NextResponse.json({ success: true, complaint }, { status: 200 });
    }

    const complaints = await Complaint.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, complaints }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching admin complaints:", error);
    return NextResponse.json({ error: "Internal Server Error." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, adminReply, isRead } = body;

    if (!id) {
      return NextResponse.json({ error: "Complaint ID is required." }, { status: 400 });
    }

    await connectDB();

    const updateFields: any = {};
    if (status) updateFields.status = status;
    if (adminReply !== undefined) updateFields.adminReply = adminReply.trim();
    if (isRead !== undefined) updateFields.isRead = isRead;

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedComplaint) {
      return NextResponse.json({ error: "Complaint not found." }, { status: 404 });
    }

    if (adminReply !== undefined && adminReply.trim() !== "") {
      try {
        await sendSupportResponseEmail(
          updatedComplaint.email,
          updatedComplaint.name,
          updatedComplaint.trackingId,
          updatedComplaint.subject,
          updatedComplaint.category,
          updatedComplaint.status,
          adminReply.trim()
        );
      } catch (emailError) {
        console.error("Failed to send support response email:", emailError);
      }
    }

    return NextResponse.json({ success: true, complaint: updatedComplaint }, { status: 200 });
  } catch (error: any) {
    console.error("Error updating complaint:", error);
    return NextResponse.json({ error: "Internal Server Error." }, { status: 500 });
  }
}