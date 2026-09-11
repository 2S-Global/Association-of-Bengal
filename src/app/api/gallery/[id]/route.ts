import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Gallery from "@/models/Gallery";
import cloudinary from "@/lib/cloudinary";

function getCloudinaryPublicId(imageUrl: string): string | null {
  try {
    const parts = imageUrl.split("/");
    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex === -1) return null;
    const pathParts = parts.slice(uploadIndex + 1);
    if (pathParts[0]?.startsWith("v")) pathParts.shift();
    const fullPath = pathParts.join("/");
    return fullPath.substring(0, fullPath.lastIndexOf("."));
  } catch (err) {
    return null;
  }
}

// PUT: Update album details, remove old images, or add new images
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const formData = await request.formData();

    const album = formData.get("album") as string;
    const category = formData.get("category") as string;
    const date = formData.get("date") as string;
    const location = formData.get("location") as string;
    const imageAlt = formData.get("imageAlt") as string;
    
    // Existing images kept by the admin
    const keptImagesJson = formData.get("keptImages") as string;
    const keptImages: string[] = keptImagesJson ? JSON.parse(keptImagesJson) : [];

    // Newly added files during edit
    const newFiles = formData.getAll("newImages") as File[];

    const existingAlbum = await Gallery.findById(id);
    if (!existingAlbum) {
      return NextResponse.json({ success: false, message: "Album not found." }, { status: 404 });
    }

    // Find images that were removed by the admin and delete them from Cloudinary
    const removedImages = existingAlbum.imageUrls.filter((url: string) => !keptImages.includes(url));
    for (const imgUrl of removedImages) {
      if (imgUrl.includes("cloudinary.com")) {
        const publicId = getCloudinaryPublicId(imgUrl);
        if (publicId) await cloudinary.uploader.destroy(publicId);
      }
    }

    // Upload any newly added files to Cloudinary
    const newlyUploadedUrls: string[] = [];
    for (let i = 0; i < newFiles.length; i++) {
      const file = newFiles[i];
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64String = `data:${file.type};base64,${buffer.toString("base64")}`;

      const uploadResponse = await cloudinary.uploader.upload(base64String, {
        folder: "association-albums",
      });
      newlyUploadedUrls.push(uploadResponse.secure_url);
    }

    const finalImageUrls = [...keptImages, ...newlyUploadedUrls];

    if (finalImageUrls.length === 0) {
      return NextResponse.json({ success: false, message: "An album must contain at least one image." }, { status: 400 });
    }

    const updatedAlbum = await Gallery.findByIdAndUpdate(
      id,
      {
        album: album || existingAlbum.album,
        category: category || existingAlbum.category,
        date: date || existingAlbum.date,
        location: location || existingAlbum.location,
        imageUrls: finalImageUrls,
        imageAlt: imageAlt || existingAlbum.imageAlt,
      },
      { new: true }
    );

    return NextResponse.json({ success: true, message: "Album updated successfully!", data: updatedAlbum }, { status: 200 });
  } catch (error: any) {
    console.error("PUT folder error:", error);
    return NextResponse.json({ success: false, message: error.message || "Failed to update album." }, { status: 500 });
  }
}

// DELETE: Remove entire album and all its Cloudinary assets
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const album = await Gallery.findById(id);
    if (!album) {
      return NextResponse.json({ success: false, message: "Album not found." }, { status: 404 });
    }

    if (album.imageUrls && Array.isArray(album.imageUrls)) {
      for (const url of album.imageUrls) {
        if (url.includes("cloudinary.com")) {
          const publicId = getCloudinaryPublicId(url);
          if (publicId) await cloudinary.uploader.destroy(publicId);
        }
      }
    }

    await Gallery.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Album and all its photos deleted successfully!" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || "Failed to delete album." }, { status: 500 });
  }
}