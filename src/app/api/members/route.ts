import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Member from "@/models/Member";
import User from "@/models/User"; // Ensure your User model file is imported correctly

export async function GET() {
    try {
        // 1. Connect to the database
        await connectDB();
        
        // 2. Fetch members and populate the linked user data (email & mobile)
        const members = await Member.find({})
            .populate({
                path: "user",
                model: User,
                select: "email mobile step allstep_completed" // Selects exact fields from the User table
            })
            .sort({ createdAt: -1 })
            .lean();

        // 3. Format the data so email and mobile sit directly on the root object
        const formattedMembers = members.map((member: any) => {
            const userData = member.user || {};
            return {
                ...member,
                email: userData.email || null,
                mobile: userData.mobile || null,
                step: userData.step !== undefined ? userData.step : member.step,
                allstep_completed: userData.allstep_completed !== undefined ? userData.allstep_completed : member.allstep_completed,
            };
        });

        // 4. Return the data successfully
        return NextResponse.json({
            success: true,
            count: formattedMembers.length,
            data: formattedMembers
        }, { status: 200 });

    } catch (error) {
        // 5. Handle any errors
        console.error("Error fetching members:", error);
        
        return NextResponse.json({
            success: false,
            message: "Failed to fetch members"
        }, { status: 500 });
    }
}