

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Event from "@/models/Event";
import cloudinary from "@/lib/cloudinary";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB limit

// Helper: Upload file buffer to Cloudinary
async function uploadToCloudinary(fileEntry: FormDataEntryValue | null, folder: string): Promise<string | null> {
  if (!fileEntry || typeof fileEntry === "string") return null;
  const file = fileEntry as File;

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error(`Invalid file type for ${folder}. Only JPG, PNG, and WEBP are allowed.`);
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds the 2 MB limit.`);
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: `book-fair/${folder}`, resource_type: "image" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result?.secure_url || null);
      }
    );
    uploadStream.end(buffer);
  });
}

// Helper: Safely destroy image from Cloudinary
async function deleteFromCloudinary(imageUrl?: string | null) {
  if (!imageUrl || !imageUrl.includes("cloudinary.com")) return;
  try {
    const parts = imageUrl.split("/");
    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex !== -1 && parts.length > uploadIndex + 1) {
      const pathParts = parts.slice(uploadIndex + 2);
      const publicIdWithExtension = pathParts.join("/");
      const publicId = publicIdWithExtension.substring(0, publicIdWithExtension.lastIndexOf("."));
      if (publicId) await cloudinary.uploader.destroy(publicId);
    }
  } catch (err) {
    console.error("Failed to delete image from Cloudinary:", err);
  }
}

// Helper: Normalize incoming formData into matching schema structure
function normalizeEventData(formData: FormData, data: Record<string, any>) {
  const startDate = formData.get("startDate");
  const endDate = formData.get("endDate");

  if (startDate && typeof startDate === "string") data.startDate = startDate.trim();
  if (endDate && typeof endDate === "string") data.endDate = endDate.trim();
  else if (data.startDate) data.endDate = data.startDate;

  // Sync eventDate for mongoose requirement
  if (!data.eventDate && data.startDate) {
    data.eventDate = new Date(data.startDate);
  }

  // Format badge date string if missing
  if (!data.dateStr && data.startDate) {
    data.dateStr = data.endDate && data.endDate !== data.startDate
      ? `${data.startDate} - ${data.endDate}`
      : data.startDate;
  }

  // Safely map string location from frontend to the required object
  const venue = formData.get("venue");
  const rawLocation = formData.get("location");
  const city = formData.get("city");
  const country = formData.get("country");

  data.location = {
    venue: (venue as string)?.trim() || (typeof rawLocation === "string" ? rawLocation.trim() : "Venue TBD"),
    city: (city as string)?.trim() || "",
    country: (country as string)?.trim() || "INDIA",
  };

  // Sync published statuses
  if (data.status) {
    data.isPublished = data.status === "Published";
  } else if (data.isPublished !== undefined) {
    data.status = data.isPublished === "true" || data.isPublished === true ? "Published" : "Draft";
    data.isPublished = data.status === "Published";
  } else {
    data.status = "Published";
    data.isPublished = true;
  }
}

// -----------------------------------------------------------------------------
// GET: Fetch all events
// -----------------------------------------------------------------------------
export async function GET() {
  try {
    await connectDB();
    const events = await Event.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: events }, { status: 200 });
  } catch (error: any) {
    console.error("API Error [GET Events]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch events" },
      { status: 500 }
    );
  }
}

// -----------------------------------------------------------------------------
// POST: Create a new event
// -----------------------------------------------------------------------------
export async function POST(request: Request) {
  try {
    await connectDB();
    const formData = await request.formData();
    const data: Record<string, any> = {};

    for (const [key, value] of formData.entries()) {
      if (typeof value === "string") data[key] = value.trim();
    }

    normalizeEventData(formData, data);

    const uploadedImageUrl = await uploadToCloudinary(formData.get("image"), "event_banners");
    const fallbackImage = "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=3840&q=95";

    data.image = uploadedImageUrl || fallbackImage;
    data.imageUrl = data.image; // Sync both image references

    const newEvent = await Event.create(data);

    return NextResponse.json(
      { success: true, message: "Event created successfully.", data: newEvent },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("API Error [POST Event]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

// -----------------------------------------------------------------------------
// PUT: Update an existing event
// -----------------------------------------------------------------------------
export async function PUT(request: Request) {
  try {
    await connectDB();
    const formData = await request.formData();
    const id = formData.get("id") as string;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Event ID is required" },
        { status: 400 }
      );
    }

    const existingEvent = await Event.findById(id);
    if (!existingEvent) {
      return NextResponse.json(
        { success: false, error: "Event not found" },
        { status: 404 }
      );
    }

    const data: Record<string, any> = {};
    for (const [key, value] of formData.entries()) {
      if (key !== "id" && typeof value === "string") data[key] = value.trim();
    }

    normalizeEventData(formData, data);

    const imageEntry = formData.get("image");
    if (imageEntry instanceof File) {
      const newImageUrl = await uploadToCloudinary(imageEntry, "event_banners");
      if (newImageUrl) {
        await deleteFromCloudinary(existingEvent.image || existingEvent.imageUrl);
        data.image = newImageUrl;
        data.imageUrl = newImageUrl;
      }
    } else if (typeof imageEntry === "string" && imageEntry) {
      data.image = imageEntry;
      data.imageUrl = imageEntry;
    }

    const updatedEvent = await Event.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json(
      { success: true, message: "Event updated successfully.", data: updatedEvent },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("API Error [PUT Event]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

// -----------------------------------------------------------------------------
// DELETE: Remove an event
// -----------------------------------------------------------------------------
export async function DELETE(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Event ID is required" },
        { status: 400 }
      );
    }

    const event = await Event.findById(id);
    if (!event) {
      return NextResponse.json(
        { success: false, error: "Event not found" },
        { status: 404 }
      );
    }

    await deleteFromCloudinary(event.image || event.imageUrl);
    await Event.findByIdAndDelete(id);

    return NextResponse.json(
      { success: true, message: "Event deleted successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("API Error [DELETE Event]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}