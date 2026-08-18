import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Election from "@/models/Election";
import { validateElectionTimeline } from "@/lib/election-timeline-validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const timelineValidation = validateElectionTimeline(body);
    const postDesignations = Array.isArray(body.postDesignations)
      ? body.postDesignations.filter(
          (designation: unknown) => typeof designation === "string" && designation.trim()
        )
      : [];
    const wings = Array.isArray(body.wings)
      ? body.wings.filter((wing: unknown) => typeof wing === "string" && wing.trim())
      : [];

    if (
      typeof body.name !== "string" ||
      !body.name.trim() ||
      typeof body.location !== "string" ||
      !body.location.trim() ||
      !postDesignations.length ||
      !wings.length ||
      !timelineValidation.valid
    ) {
      return NextResponse.json(
        {
          success: false,
          message: !timelineValidation.valid
            ? timelineValidation.message
            : "Please complete all required election details.",
        },
        { status: 400 }
      );
    }

    await connectDB();
    const election = await Election.create({
      name: body.name.trim(),
      description: typeof body.description === "string" ? body.description.trim() : "",
      postDesignations,
      nomination: body.nomination,
      withdrawal: body.withdrawal,
      voting: body.voting,
      wings,
      location: body.location.trim(),
      status: "active",
      rulesAndRegulations: Array.isArray(body.rulesAndRegulations)
        ? body.rulesAndRegulations.filter((rule: unknown) => typeof rule === "string")
        : [],
    });

    return NextResponse.json({ success: true, data: election }, { status: 201 });
  } catch (error) {
    console.error("POST elections error:", error);
    return NextResponse.json(
      { success: false, message: "Unable to save the election. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const elections = await Election.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json({ success: true, data: elections });
  } catch (error) {
    console.error("GET elections error:", error);
    return NextResponse.json(
      { success: false, message: "Unable to load elections. Please try again." },
      { status: 500 }
    );
  }
}
