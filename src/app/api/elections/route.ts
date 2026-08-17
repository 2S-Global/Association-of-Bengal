import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Election from "@/models/Election";

const periodKeys = ["nomination", "withdrawal", "voting"] as const;

function isValidPeriod(period: unknown): period is {
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
} {
  if (!period || typeof period !== "object") return false;

  const value = period as Record<string, unknown>;
  return ["startDate", "startTime", "endDate", "endTime"].every(
    (key) => typeof value[key] === "string" && value[key].trim().length > 0
  );
}

function timeToMinutes(time: string) {
  const twelveHourMatch = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);

  if (twelveHourMatch) {
    const [, hourText, minuteText, meridiem] = twelveHourMatch;
    const hour = Number(hourText);
    const minute = Number(minuteText);

    if (hour >= 1 && hour <= 12 && minute >= 0 && minute <= 59) {
      return (hour % 12) * 60 + minute + (meridiem.toUpperCase() === "PM" ? 720 : 0);
    }
  }

  const twentyFourHourMatch = time.match(/^(\d{2}):(\d{2})$/);

  if (twentyFourHourMatch) {
    const [, hourText, minuteText] = twentyFourHourMatch;
    const hour = Number(hourText);
    const minute = Number(minuteText);

    if (hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
      return hour * 60 + minute;
    }
  }

  return null;
}

function isChronological(period: {
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
}) {
  const startTime = timeToMinutes(period.startTime);
  const endTime = timeToMinutes(period.endTime);

  if (startTime === null || endTime === null) return false;

  if (period.startDate !== period.endDate) {
    return period.startDate < period.endDate;
  }

  return startTime <= endTime;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const hasValidPeriods = periodKeys.every(
      (key) => isValidPeriod(body[key]) && isChronological(body[key])
    );
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
      !hasValidPeriods
    ) {
      return NextResponse.json(
        { success: false, message: "Please complete all required election details." },
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
