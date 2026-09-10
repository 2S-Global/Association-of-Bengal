import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Event from "@/models/Event";
import cloudinary from "@/lib/cloudinary";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB limit for event banners

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

    // --- EXPLICITLY CAPTURE SEPARATE START AND END DATES FROM FORMDATA ---
    const startDate = formData.get("startDate");
    const endDate = formData.get("endDate");

    if (startDate && typeof startDate === "string") {
      data.startDate = startDate.trim();
    }
    if (endDate && typeof endDate === "string") {
      data.endDate = endDate.trim();
    } else if (data.startDate) {
      data.endDate = data.startDate;
    }

    const uploadToCloudinary = async (fileEntry: FormDataEntryValue | null, folder: string): Promise<string | null> => {
      if (!fileEntry || typeof fileEntry === "string") return null;
      const file = fileEntry as File;

      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        throw new Error(`Invalid file type for ${folder}. Only JPG, PNG, and WEBP are allowed.`);
      }

      if (file.size > MAX_FILE_SIZE) {
        throw new Error(`File size for ${folder} exceeds the 2 MB limit.`);
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: `book-fair/${folder}`,
            resource_type: "image",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result?.secure_url || null);
          }
        );

        uploadStream.end(buffer);
      });
    };

    const uploadedImageUrl = await uploadToCloudinary(formData.get("image"), "event_banners");
    data.image = uploadedImageUrl || "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=3840&q=95";

    if (!data.status) {
      data.status = "Published";
    }

    const newEvent = await Event.create(data);

    return NextResponse.json(
      { success: true, message: "Event created successfully.", data: newEvent },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("API Error [Event Creation]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const events = await Event.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: events }, { status: 200 });
  } catch (error: any) {
    console.error("API Error [Fetch Events]:", error);
    return NextResponse.json({ success: false, error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();
    const formData = await request.formData();
    const id = formData.get("id") as string;

    if (!id) {
      return NextResponse.json({ success: false, error: "Event ID is required for updating" }, { status: 400 });
    }

    const data: Record<string, any> = {};
    for (const [key, value] of formData.entries()) {
      if (key !== "id" && typeof value === "string") {
        data[key] = value.trim();
      }
    }

    const startDate = formData.get("startDate");
    const endDate = formData.get("endDate");

    if (startDate && typeof startDate === "string") {
      data.startDate = startDate.trim();
    }
    if (endDate && typeof endDate === "string") {
      data.endDate = endDate.trim();
    }

    const imageEntry = formData.get("image");
    if (imageEntry instanceof File) {
      const bytes = await imageEntry.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadResult: any = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "book-fair/event_banners", resource_type: "image" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(buffer);
      });

      data.image = uploadResult.secure_url;
    } else if (typeof imageEntry === "string") {
      data.image = imageEntry;
    }

    const updatedEvent = await Event.findByIdAndUpdate(id, data, { new: true });

    return NextResponse.json(
      { success: true, message: "Event updated successfully.", data: updatedEvent },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("API Error [Update Event]:", error);
    return NextResponse.json({ success: false, error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Event ID is required" }, { status: 400 });
    }

    const event = await Event.findById(id);
    if (!event) {
      return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 });
    }

    if (event.image && event.image.includes("cloudinary.com")) {
      try {
        const parts = event.image.split("/");
        const uploadIndex = parts.indexOf("upload");
        if (uploadIndex !== -1 && parts.length > uploadIndex + 1) {
          const pathParts = parts.slice(uploadIndex + 2);
          const publicIdWithExtension = pathParts.join("/");
          const publicId = publicIdWithExtension.substring(0, publicIdWithExtension.lastIndexOf("."));

          if (publicId) {
            await cloudinary.uploader.destroy(publicId);
          }
        }
      } catch (cloudinaryError) {
        console.error("Failed to delete image from Cloudinary:", cloudinaryError);
      }
    }

    await Event.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Event and image deleted successfully." }, { status: 200 });
  } catch (error: any) {
    console.error("API Error [Delete Event]:", error);
    return NextResponse.json({ success: false, error: error.message || "Internal Server Error" }, { status: 500 });
  }
}