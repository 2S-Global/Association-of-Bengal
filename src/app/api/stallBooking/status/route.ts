import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Application from "@/models/Application";
import { sendAcceptanceEmail, sendRejectionEmail } from "@/lib/acceptemail";

export async function POST(req: Request) {
  try {
    const { applicationId, status } = await req.json();

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

    // 1. Permanently update the status in MongoDB
    const updatedApp = await Application.findByIdAndUpdate(
      applicationId,
      { status },
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

    // 2. Trigger the dedicated email function based on the action
    if (status === "ACCEPTED") {
      await sendAcceptanceEmail(updatedApp.participant_email, updatedApp.participant_name);
    } else {
      await sendRejectionEmail(updatedApp.participant_email, updatedApp.participant_name);
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