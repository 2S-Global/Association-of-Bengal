import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Gallery from "@/models/Gallery";
import cloudinary from "@/lib/cloudinary";

// GET: Fetch all folders/albums
export async function GET() {
  try {
    await connectDB();
    const folders = await Gallery.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: folders }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch folders." }, { status: 500 });
  }
}

// POST: Upload a complete folder of images
export async function POST(request: Request) {
  try {
    await connectDB();
    const formData = await request.formData();

    const album = formData.get("album") as string;
    const category = formData.get("category") as string;
    const date = formData.get("date") as string;
    const location = formData.get("location") as string;
    const imageAlt = formData.get("imageAlt") as string;

    const files = formData.getAll("images") as File[];

    if (!album || !location || !category || !date || files.length === 0) {
      return NextResponse.json(
        { success: false, message: "Please fill in all required fields and upload folder images." },
        { status: 400 }
      );
    }

    const imageUrls: string[] = [];

    // Upload every image in the folder to Cloudinary
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64String = `data:${file.type};base64,${buffer.toString("base64")}`;

      const uploadResponse = await cloudinary.uploader.upload(base64String, {
        folder: "association-folders",
      });
      imageUrls.push(uploadResponse.secure_url);
    }

    // Save as one unified folder document
    const newFolder = await Gallery.create({
      album,
      category,
      date,
      location,
      imageUrls,
      imageAlt: imageAlt || album,
    });

    return NextResponse.json({
      success: true,
      message: `Folder "${album}" uploaded successfully with ${imageUrls.length} image(s)!`,
      data: newFolder,
    }, { status: 201 });
  } catch (error: any) {
    console.error("POST folder error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Unable to upload folder." },
      { status: 500 }
    );
  }
}