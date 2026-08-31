import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Application from "@/models/Application";
import { sendAcceptanceEmail, sendRejectionEmail } from "@/lib/acceptemail";

export async function POST(req: Request) {
  try {
    // 1. Extract amount and remark along with applicationId and status
    const { applicationId, status, amount, remark } = await req.json();

    if (!applicationId || !status) {
      return NextResponse.json(
        { success: false, error: "Application ID and status are required." },
        { status: 400 }
      );
    }

    if (!["ACCEPTED", "REJECTED"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status value provided." },
        { status: 400 }
      );
    }

    await connectDB();

    // 2. Permanently update status, amount, and remark in MongoDB
    const updatedApp = await Application.findByIdAndUpdate(
      applicationId,
      { status, amount, remark },
      { new: true }
    );

    if (!updatedApp) {
      return NextResponse.json(
        { success: false, error: "Application not found in the database." },
        { status: 404 }
      );
    }

    if (!updatedApp.participant_email) {
      return NextResponse.json(
        { success: false, error: "Participant email not found." },
        { status: 400 }
      );
    }

    // 3. Trigger the dedicated email function with the correct arguments
    if (status === "ACCEPTED") {
      await sendAcceptanceEmail(
        updatedApp.participant_email, 
        updatedApp.participant_name, 
        amount, 
        remark
      );
    } else {
      await sendRejectionEmail(
        updatedApp.participant_email, 
        updatedApp.participant_name, 
        remark
      );
    }

    return NextResponse.json({
      success: true,
      message: `Application successfully updated to ${status} and email dispatched.`
    });

  } catch (error: any) {
    console.error("Status update & mail error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}