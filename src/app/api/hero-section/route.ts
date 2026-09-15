import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import cloudinary from "@/lib/cloudinary";
import HeroSection from "@/models/HeroSection";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 2 * 1024 * 1024;

const cleanText = (value: FormDataEntryValue | null) =>
  typeof value === "string" ? value.trim() : "";

const getLegacyNumber = (stats: unknown, label: string) => {
  if (!Array.isArray(stats)) return 0;
  const item = stats.find(
    (stat) =>
      stat &&
      typeof stat === "object" &&
      "label" in stat &&
      (stat as { label?: unknown }).label === label,
  ) as { value?: unknown } | undefined;
  const value = String(item?.value ?? "").trim().toUpperCase();
  const numeric = Number.parseFloat(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(numeric) ? Math.round(numeric * (value.includes("K") ? 1000 : 1)) : 0;
};

const toBsonDate = (value: unknown) => {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return null;
  const serializedValue =
    value && typeof value === "object" && "$date" in value
      ? (value as { $date?: unknown }).$date
      : value;
  const date = new Date(typeof serializedValue === "string" || typeof serializedValue === "number" ? serializedValue : "");
  return Number.isNaN(date.getTime()) ? null : date;
};

async function migrateLegacyHeroSection() {
  // Use the native collection so malformed Extended JSON date objects are never hydrated by Mongoose.
  const legacyHero = await HeroSection.collection.findOne({});
  if (!legacyHero) return;

  const set: Record<string, unknown> = {};
  const createdAt = toBsonDate(legacyHero.createdAt);
  const updatedAt = toBsonDate(legacyHero.updatedAt);
  if (createdAt) set.createdAt = createdAt;
  if (updatedAt) set.updatedAt = updatedAt;

  if (Array.isArray(legacyHero.stats)) {
    set.eventsPlanned = getLegacyNumber(legacyHero.stats, "Events Planned");
    set.registeredMembers = getLegacyNumber(legacyHero.stats, "Registered Members");
    set.indianCities = getLegacyNumber(legacyHero.stats, "Indian Cities");
  }

  if (Object.keys(set).length > 0 || Array.isArray(legacyHero.stats)) {
    await HeroSection.collection.updateOne(
      { _id: legacyHero._id },
      {
        ...(Object.keys(set).length > 0 ? { $set: set } : {}),
        ...(Array.isArray(legacyHero.stats) ? { $unset: { stats: "" } } : {}),
      },
    );
  }
}

function getCloudinaryPublicId(imageUrl: string) {
  if (!imageUrl.includes("res.cloudinary.com")) return null;
  const uploadMarker = "/upload/";
  const uploadIndex = imageUrl.indexOf(uploadMarker);
  if (uploadIndex === -1) return null;
  const path = imageUrl.slice(uploadIndex + uploadMarker.length).replace(/^v\d+\//, "");
  const lastDot = path.lastIndexOf(".");
  return lastDot === -1 ? path : path.slice(0, lastDot);
}

async function uploadHeroImage(file: File) {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error("Hero image must be a JPG, PNG, or WEBP file.");
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Hero image must be 2 MB or smaller.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  return new Promise<string>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "association/hero-section", resource_type: "image" },
      (error, result) => {
        if (error || !result?.secure_url) reject(error || new Error("Hero image upload failed."));
        else resolve(result.secure_url);
      },
    );
    uploadStream.end(buffer);
  });
}

export async function GET(request: Request) {
  try {
    await connectDB();
    await migrateLegacyHeroSection();
    const includeInactive = new URL(request.url).searchParams.get("admin") === "true";
    const heroSection = await HeroSection.findOne(includeInactive ? {} : { isActive: true }).sort({ createdAt: 1 });

    if (!heroSection) {
      return NextResponse.json({ success: false, message: "Hero Section not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: heroSection }, { status: 200 });
  } catch (error) {
    console.error("GET hero section error:", error);
    return NextResponse.json({ success: false, message: "Unable to load Hero Section. Please try again." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();
    await migrateLegacyHeroSection();
    const formData = await request.formData();
    const badgeText = cleanText(formData.get("badgeText"));
    const welcomeTitle = cleanText(formData.get("welcomeTitle"));
    const tagline = cleanText(formData.get("tagline"));
    const headline = cleanText(formData.get("headline"));
    const description = cleanText(formData.get("description"));
    const eventsPlanned = Number(formData.get("eventsPlanned"));
    const registeredMembers = Number(formData.get("registeredMembers"));
    const indianCities = Number(formData.get("indianCities"));
    const activeValue = cleanText(formData.get("isActive"));

    if (!badgeText || !welcomeTitle || !tagline || !headline || !description) {
      return NextResponse.json({ success: false, message: "All text fields are required." }, { status: 400 });
    }
    if (![eventsPlanned, registeredMembers, indianCities].every((value) => Number.isInteger(value) && value >= 0)) {
      return NextResponse.json({ success: false, message: "Statistics must be whole numbers greater than or equal to zero." }, { status: 400 });
    }
    if (activeValue && activeValue !== "true" && activeValue !== "false") {
      return NextResponse.json({ success: false, message: "Active status is required." }, { status: 400 });
    }

    const heroSection = await HeroSection.findOne({}).sort({ createdAt: 1 });
    if (!heroSection) {
      return NextResponse.json({ success: false, message: "Hero Section not found." }, { status: 404 });
    }

    const previousHeroImage = heroSection.heroImage;
    const imageEntry = formData.get("heroImage");
    let uploadedImageUrl: string | null = null;
    if (imageEntry instanceof File && imageEntry.size > 0) uploadedImageUrl = await uploadHeroImage(imageEntry);

    heroSection.badgeText = badgeText;
    heroSection.welcomeTitle = welcomeTitle;
    heroSection.tagline = tagline;
    heroSection.headline = headline;
    heroSection.description = description;
    heroSection.eventsPlanned = eventsPlanned;
    heroSection.registeredMembers = registeredMembers;
    heroSection.indianCities = indianCities;
    if (activeValue) heroSection.isActive = activeValue === "true";
    if (uploadedImageUrl) heroSection.heroImage = uploadedImageUrl;
    await heroSection.save();

    if (uploadedImageUrl) {
      const oldImagePublicId = getCloudinaryPublicId(previousHeroImage);
      if (oldImagePublicId && oldImagePublicId !== getCloudinaryPublicId(uploadedImageUrl)) {
        await cloudinary.uploader.destroy(oldImagePublicId).catch((error) => console.error("Unable to delete previous hero image:", error));
      }
    }

    return NextResponse.json({ success: true, message: "Hero Section updated successfully.", data: heroSection }, { status: 200 });
  } catch (error) {
    console.error("PUT hero section error:", error);
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Unable to update Hero Section." }, { status: 500 });
  }
}
