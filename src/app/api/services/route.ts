import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Service from "@/models/Service";

const cleanText = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const findService = (identifier: string) => {
  const number = Number(identifier);
  if (isValidObjectId(identifier)) return Service.findById(identifier);
  if (Number.isInteger(number) && number > 0) return Service.findOne({ number });
  return null;
};

export async function GET(request: Request) {
  try {
    await connectDB();
    const includeInactive = new URL(request.url).searchParams.get("admin") === "true";
    const services = await Service.find(includeInactive ? {} : { isActive: true }).sort({ number: 1 });

    return NextResponse.json({ success: true, data: services }, { status: 200 });
  } catch (error: unknown) {
    console.error("GET services error:", error);
    return NextResponse.json(
      { success: false, message: "Unable to load services. Please try again." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const number = Number(body.number);
    const title = cleanText(body.title);
    const description = cleanText(body.description);

    if (!Number.isInteger(number) || number < 1 || !title || !description) {
      return NextResponse.json(
        { success: false, message: "Number, title, and description are required." },
        { status: 400 },
      );
    }
    if (await Service.exists({ number })) {
      return NextResponse.json(
        { success: false, message: "A service with this number already exists." },
        { status: 409 },
      );
    }

    const service = await Service.create({ number, title, description, isActive: true });
    return NextResponse.json(
      { success: true, message: "Service created successfully.", data: service },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error("POST services error:", error);
    return NextResponse.json({ success: false, message: "Unable to create service." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const identifier = cleanText(body.id);
    const number = Number(body.number);
    const title = cleanText(body.title);
    const description = cleanText(body.description);

    if (!identifier || !Number.isInteger(number) || number < 1 || !title || !description) {
      return NextResponse.json(
        { success: false, message: "Number, title, and description are required." },
        { status: 400 },
      );
    }

    const service = await findService(identifier);
    if (!service) {
      return NextResponse.json({ success: false, message: "Service not found." }, { status: 404 });
    }
    const duplicate = await Service.findOne({ number });
    if (duplicate && duplicate._id.toString() !== service._id.toString()) {
      return NextResponse.json({ success: false, message: "A service with this number already exists." }, { status: 409 });
    }

    service.number = number;
    service.title = title;
    service.description = description;
    await service.save();

    return NextResponse.json({ success: true, message: "Service updated successfully.", data: service }, { status: 200 });
  } catch (error: unknown) {
    console.error("PUT services error:", error);
    return NextResponse.json({ success: false, message: "Unable to update service." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectDB();
    const identifier = new URL(request.url).searchParams.get("id")?.trim();
    if (!identifier) {
      return NextResponse.json({ success: false, message: "Service ID is required." }, { status: 400 });
    }

    const service = await findService(identifier);
    if (!service) {
      return NextResponse.json({ success: false, message: "Service not found." }, { status: 404 });
    }
    service.isActive = false;
    await service.save();

    return NextResponse.json({ success: true, message: "Service deactivated successfully." }, { status: 200 });
  } catch (error: unknown) {
    console.error("DELETE services error:", error);
    return NextResponse.json({ success: false, message: "Unable to delete service." }, { status: 500 });
  }
}
