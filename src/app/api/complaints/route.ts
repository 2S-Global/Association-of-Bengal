
// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/mongodb";
// import Complaint from "@/models/Complaint";
// import { sendSupportResponseEmail } from "@/lib/supportEmail"; 

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

//     // Automatically send email notification if an admin reply is present and updated
//     if (adminReply !== undefined && adminReply.trim() !== "") {
//       try {
//         await sendSupportResponseEmail(
//           updatedComplaint.email,
//           updatedComplaint.name,
//           updatedComplaint.trackingId,
//           updatedComplaint.subject,
//           updatedComplaint.category,
//           updatedComplaint.status,
//           adminReply.trim()
//         );
//       } catch (emailError) {
//         console.error("Failed to send support response email:", emailError);
//         // We log the error but don't block the API response from succeeding
//       }
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
import Member from "@/models/Member";
import { sendSupportResponseEmail } from "@/lib/supportEmail"; 

function parseJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized. Token missing." }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = parseJwt(token);

    if (!decoded) {
      return NextResponse.json({ error: "Invalid session token format." }, { status: 403 });
    }

    let userMembershipId = decoded.membershipId || decoded.memberId;

    if (!userMembershipId && decoded.sub) {
      const memberDoc = await Member.findOne({ user: decoded.sub });
      if (memberDoc) {
        userMembershipId = memberDoc.memberId;
      }
    }

    if (!userMembershipId) {
      return NextResponse.json({ error: "Session token missing member identification." }, { status: 403 });
    }

    const cleanMembershipId = String(userMembershipId).trim();

    if (id) {
      const complaint = await Complaint.findById(id);
      if (!complaint) {
        return NextResponse.json({ error: "Complaint not found." }, { status: 404 });
      }

      if (complaint.membershipId !== cleanMembershipId) {
        return NextResponse.json({ error: "Access denied." }, { status: 403 });
      }

      return NextResponse.json({ success: true, complaint }, { status: 200 });
    }

    const complaints = await Complaint.find({ membershipId: cleanMembershipId }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, complaints }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching complaints:", error);
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
      membershipId: membershipId.trim(),
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