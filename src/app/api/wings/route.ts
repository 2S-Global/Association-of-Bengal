import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";

type WingDocument = {
  _id?: ObjectId;
  id?: string;
  name?: string;
  nameBn?: string;
  description?: string;
  icon?: string;
  fees?: number;
  bgColor?: string;
  color?: string;
  isActive?: boolean;
  sortOrder?: number;
  createdAt?: Date;
  updatedAt?: Date;
};

const wingProjection = {
  _id: 1,
  id: 1,
  name: 1,
  nameBn: 1,
  description: 1,
  icon: 1,
  fees: 1,
  bgColor: 1,
  color: 1,
  isActive: 1,
  sortOrder: 1,
};

const cleanText = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const createSlug = (name: string) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "wing";

const wingFilter = (identifier: string) => {
  const filters: Record<string, unknown>[] = [{ id: identifier }];
  if (ObjectId.isValid(identifier)) filters.push({ _id: new ObjectId(identifier) });
  return { $or: filters };
};

export async function GET(request: Request) {
  try {
    await connectDB();
    const includeInactive =
      new URL(request.url).searchParams.get("admin") === "true";
    const collection = mongoose.connection.db?.collection<WingDocument>("wings");

    if (!collection) throw new Error("Wings collection is unavailable.");

    const wings = await collection
      .find(
        includeInactive ? {} : { isActive: true },
        {
          projection: includeInactive
            ? wingProjection
            : { _id: 0, id: 1, name: 1, nameBn: 1, sortOrder: 1 },
        },
      )
      .sort({ sortOrder: 1, name: 1 })
      .toArray();

    if (includeInactive) {
      return NextResponse.json({
        success: true,
        data: wings.map((wing) => ({
          ...wing,
          _id: wing._id?.toString(),
          isActive: wing.isActive !== false,
        })),
      });
    }

    const data = wings
      .filter(
        (wing) => typeof wing.name === "string" && wing.name.trim().length > 0,
      )
      .map((wing) => ({
        id: wing.id ?? wing.name!.trim().toLowerCase().replace(/\s+/g, "-"),
        name: wing.name!.trim(),
        nameBn: typeof wing.nameBn === "string" ? wing.nameBn.trim() : "",
      }));

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("GET wings error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load wings. Please try again.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const collection = mongoose.connection.db?.collection<WingDocument>("wings");
    if (!collection) throw new Error("Wings collection is unavailable.");

    const body = await request.json();
    const name = cleanText(body.name);
    if (!name) {
      return NextResponse.json(
        { success: false, message: "Wing name is required." },
        { status: 400 },
      );
    }

    const baseId = createSlug(cleanText(body.id) || name);
    let id = baseId;
    let suffix = 2;
    while (await collection.findOne({ id }, { projection: { _id: 1 } })) {
      id = `${baseId}-${suffix++}`;
    }

    const sortOrder = Number(body.sortOrder);
    const fees = Number(body.fees);
    const now = new Date();
    const wing: WingDocument = {
      id,
      name,
      nameBn: cleanText(body.nameBn),
      description: cleanText(body.description),
      icon: cleanText(body.icon),
      fees: Number.isFinite(fees) && fees >= 0 ? fees : 0,
      bgColor: cleanText(body.bgColor),
      color: cleanText(body.color),
      sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };
    const result = await collection.insertOne(wing);

    return NextResponse.json(
      { success: true, message: "Wing created successfully.", data: { ...wing, _id: result.insertedId.toString() } },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST wings error:", error);
    return NextResponse.json({ success: false, message: "Unable to create wing." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();
    const collection = mongoose.connection.db?.collection<WingDocument>("wings");
    if (!collection) throw new Error("Wings collection is unavailable.");

    const body = await request.json();
    const identifier = cleanText(body.id);
    const name = cleanText(body.name);
    if (!identifier || !name) {
      return NextResponse.json({ success: false, message: "Wing ID and name are required." }, { status: 400 });
    }

    const sortOrder = Number(body.sortOrder);
    const fees = Number(body.fees);
    const update = {
      name,
      nameBn: cleanText(body.nameBn),
      description: cleanText(body.description),
      icon: cleanText(body.icon),
      fees: Number.isFinite(fees) && fees >= 0 ? fees : 0,
      bgColor: cleanText(body.bgColor),
      color: cleanText(body.color),
      sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
      updatedAt: new Date(),
    };
    const result = await collection.findOneAndUpdate(
      wingFilter(identifier),
      { $set: update },
      { returnDocument: "after" },
    );
    if (!result) {
      return NextResponse.json({ success: false, message: "Wing not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Wing updated successfully.", data: { ...result, _id: result._id?.toString() } });
  } catch (error) {
    console.error("PUT wings error:", error);
    return NextResponse.json({ success: false, message: "Unable to update wing." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectDB();
    const identifier = new URL(request.url).searchParams.get("id")?.trim();
    const collection = mongoose.connection.db?.collection<WingDocument>("wings");
    if (!collection) throw new Error("Wings collection is unavailable.");
    if (!identifier) {
      return NextResponse.json({ success: false, message: "Wing ID is required." }, { status: 400 });
    }

    const result = await collection.findOneAndUpdate(
      wingFilter(identifier),
      { $set: { isActive: false, updatedAt: new Date() } },
      { returnDocument: "after" },
    );
    if (!result) return NextResponse.json({ success: false, message: "Wing not found." }, { status: 404 });

    return NextResponse.json({ success: true, message: "Wing deactivated successfully." });
  } catch (error) {
    console.error("DELETE wings error:", error);
    return NextResponse.json({ success: false, message: "Unable to delete wing." }, { status: 500 });
  }
}
