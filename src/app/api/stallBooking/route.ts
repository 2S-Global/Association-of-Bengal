// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/mongodb";
// import Application from "@/models/Application";
// import { sendConfirmationEmail } from "@/lib/bookingmali";
// import cloudinary from "@/lib/cloudinary";

// const ALLOWED_MIME_TYPES = ["application/pdf", "image/jpeg", "image/png"];
// const MAX_FILE_SIZE = 100 * 1024; // 100 KB limit

// export async function POST(request: Request) {
//   try {
//     // Connect to MongoDB using your project's connection utility
//     await connectDB();

//     const formData = await request.formData();
//     const data: Record<string, any> = {};

//     for (const [key, value] of formData.entries()) {
//       if (typeof value === "string") {
//         data[key] = value.trim();
//       }
//     }

//     const uploadToCloudinary = async (fileEntry: FormDataEntryValue | null, folder: string): Promise<string | null> => {
//       if (!fileEntry || typeof fileEntry === "string") return null;
//       const file = fileEntry as File;

//       if (!ALLOWED_MIME_TYPES.includes(file.type)) {
//         throw new Error(`Invalid file type for ${folder}. Only PDF, JPG, and PNG are allowed.`);
//       }

//       if (file.size > MAX_FILE_SIZE) {
//         throw new Error(`File size for ${folder} exceeds the 100 KB limit.`);
//       }

//       const bytes = await file.arrayBuffer();
//       const buffer = Buffer.from(bytes);

//       return new Promise((resolve, reject) => {
//         const uploadStream = cloudinary.uploader.upload_stream(
//           {
//             folder: `book-fair/${folder}`,
//             resource_type: "auto",
//           },
//           (error, result) => {
//             if (error) reject(error);
//             else resolve(result?.secure_url || null);
//           }
//         );

//         uploadStream.end(buffer);
//       });
//     };

//     // Upload documents to Cloudinary
//     data.pan_card_doc = await uploadToCloudinary(formData.get("pan_card_doc"), "pan_cards");
//     data.address_proof_doc = await uploadToCloudinary(formData.get("address_proof_doc"), "address_proofs");

//     // Save record to MongoDB
//     const newApplication = await Application.create(data);

//     // Send confirmation email
//     try {
//       await sendConfirmationEmail(
//         data.participant_email,
//         data.participant_name,
//         data.space_requirement,
//         data.declaration_date,
//         data.declaration_place
//       );
//     } catch (emailError) {
//       console.error("Non-blocking email transmission error:", emailError);
//     }

//     return NextResponse.json(
//       { success: true, message: "Stall application submitted successfully.", data: newApplication },
//       { status: 201 }
//     );

//   } catch (error: any) {
//     console.error("API Error [Stall Booking]:", error);
//     return NextResponse.json(
//       { success: false, error: error.message || "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Application from "@/models/Application";
import { sendConfirmationEmail } from "@/lib/bookingmali";
import cloudinary from "@/lib/cloudinary";

const ALLOWED_MIME_TYPES = ["application/pdf", "image/jpeg", "image/png"];
const MAX_FILE_SIZE = 100 * 1024; // 100 KB limit

export async function POST(request: Request) {
  try {
    await connectDB();

    const formData = await request.formData();
    const data: Record<string, any> = {};

    for (const [key, value] of formData.entries()) {
      if (typeof value === "string") {
        data[key] = value.trim();
      }
    }

    // --- DUPLICATE SUBMISSION CHECK ---
    const existingApplication = await Application.findOne({
      $or: [
        { participant_email: data.participant_email },
        { participant_mobile: data.participant_mobile }
      ]
    });

    if (existingApplication) {
      return NextResponse.json(
        { 
          success: false, 
          error: "An application with this email or mobile number has already been submitted." 
        },
        { status: 400 }
      );
    }
    // ----------------------------------

    const uploadToCloudinary = async (fileEntry: FormDataEntryValue | null, folder: string): Promise<string | null> => {
      if (!fileEntry || typeof fileEntry === "string") return null;
      const file = fileEntry as File;

      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        throw new Error(`Invalid file type for ${folder}. Only PDF, JPG, and PNG are allowed.`);
      }

      if (file.size > MAX_FILE_SIZE) {
        throw new Error(`File size for ${folder} exceeds the 100 KB limit.`);
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: `book-fair/${folder}`,
            resource_type: "auto",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result?.secure_url || null);
          }
        );

        uploadStream.end(buffer);
      });
    };

    data.pan_card_doc = await uploadToCloudinary(formData.get("pan_card_doc"), "pan_cards");
    data.address_proof_doc = await uploadToCloudinary(formData.get("address_proof_doc"), "address_proofs");

    const newApplication = await Application.create(data);

    try {
      await sendConfirmationEmail(
        data.participant_email,
        data.participant_name,
        data.space_requirement,
        data.declaration_date,
        data.declaration_place
      );
    } catch (emailError) {
      console.error("Non-blocking email transmission error:", emailError);
    }

    return NextResponse.json(
      { success: true, message: "Stall application submitted successfully.", data: newApplication },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("API Error [Stall Booking]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const applications = await Application.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: applications }, { status: 200 });
  } catch (error: any) {
    console.error("API Error [Fetch Stall Bookings]:", error);
    return NextResponse.json({ success: false, error: error.message || "Internal Server Error" }, { status: 500 });
  }
}