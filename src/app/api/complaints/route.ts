// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/mongodb";
// import Complaint from "@/models/Complaint";

// export async function GET(request: Request) {
//   try {
//     await connectDB();
//     const { searchParams } = new URL(request.url);
//     const membershipId = searchParams.get("membershipId");
//     const id = searchParams.get("id");

//     if (id) {
//       const complaint = await Complaint.findById(id);
//       return NextResponse.json({ success: true, complaint }, { status: 200 });
//     }

//     if (membershipId) {
//       const complaints = await Complaint.find({ membershipId: membershipId.trim() }).sort({ createdAt: -1 });
//       return NextResponse.json({ success: true, complaints }, { status: 200 });
//     }

//     const complaints = await Complaint.find({}).sort({ createdAt: -1 });
//     return NextResponse.json({ success: true, complaints }, { status: 200 });
//   } catch (error: any) {
//     return NextResponse.json({ error: "Internal Server Error." }, { status: 500 });
//   }
// }

// export async function POST(request: Request) {
//   try {
//     const body = await request.json();
//     const { name, email, phone, membershipId, subject, category, message } = body;

//     if (!name || !email || !phone || !membershipId || !subject || !category || !message) {
//       return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
//     }

//     await connectDB();
//     const trackingId = `BALC-TCK-${Math.floor(100000 + Math.random() * 900000)}`;

//     await Complaint.create({
//       trackingId,
//       name,
//       email,
//       phone,
//       membershipId,
//       subject,
//       category,
//       message,
//       status: "PENDING",
//       adminReply: "",
//     });

//     return NextResponse.json({ success: true, trackingId }, { status: 201 });
//   } catch (error: any) {
//     return NextResponse.json({ error: "Internal Server Error." }, { status: 500 });
//   }
// }

// export async function PATCH(request: Request) {
//   try {
//     const body = await request.json();
//     const { id, status, adminReply, isRead } = body;

//     if (!id) {
//       return NextResponse.json({ error: "Complaint ID is required." }, { status: 400 });
//     }

//     await connectDB();

//     const updateFields: any = {};
//     if (status) updateFields.status = status;
//     if (adminReply !== undefined) updateFields.adminReply = adminReply.trim();
//     if (isRead !== undefined) updateFields.isRead = isRead;

//     const updatedComplaint = await Complaint.findByIdAndUpdate(
//       id,
//       { $set: updateFields },
//       { new: true, runValidators: true }
//     );

//     if (!updatedComplaint) {
//       return NextResponse.json({ error: "Complaint not found." }, { status: 404 });
//     }

//     return NextResponse.json({ success: true, complaint: updatedComplaint }, { status: 200 });
//   } catch (error: any) {
//     console.error("Error updating complaint:", error);
//     return NextResponse.json({ error: "Internal Server Error." }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Complaint from "@/models/Complaint";
import { sendSupportResponseEmail } from "@/lib/supportEmail"; // Import the email dispatcher

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const membershipId = searchParams.get("membershipId");
    const id = searchParams.get("id");

    if (id) {
      const complaint = await Complaint.findById(id);
      return NextResponse.json({ success: true, complaint }, { status: 200 });
    }

    if (membershipId) {
      const complaints = await Complaint.find({ membershipId: membershipId.trim() }).sort({ createdAt: -1 });
      return NextResponse.json({ success: true, complaints }, { status: 200 });
    }

    const complaints = await Complaint.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, complaints }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, membershipId, subject, category, message } = body;

    if (!name || !email || !phone || !membershipId || !subject || !category || !message) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    await connectDB();
    const trackingId = `BALC-TCK-${Math.floor(100000 + Math.random() * 900000)}`;

    await Complaint.create({
      trackingId,
      name,
      email,
      phone,
      membershipId,
      subject,
      category,
      message,
      status: "PENDING",
      adminReply: "",
    });

    return NextResponse.json({ success: true, trackingId }, { status: 201 });
  } catch (error: any) {
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

    // Automatically send email notification if an admin reply is present and updated
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
        // We log the error but don't block the API response from succeeding
      }
    }

    return NextResponse.json({ success: true, complaint: updatedComplaint }, { status: 200 });
  } catch (error: any) {
    console.error("Error updating complaint:", error);
    return NextResponse.json({ error: "Internal Server Error." }, { status: 500 });
  }
}