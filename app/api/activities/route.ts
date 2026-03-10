import { NextResponse } from "next/server";
import { activityService } from "@/lib/services/activity-service";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const leadId = searchParams.get("leadId");
        
        let activities;
        if (leadId) {
            activities = await activityService.getActivitiesByLead(leadId);
        } else {
            activities = await activityService.getActivities();
        }
        
        return NextResponse.json(activities);
    } catch (error) {
        console.error("GET Activities API Error:", error);
        return NextResponse.json(
            { error: "Failed to fetch activities" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        if (!body.type || !body.leadId) {
            return NextResponse.json(
                { error: "Type and leadId are required" },
                { status: 400 }
            );
        }

        const activity = await activityService.createActivity(body);
        return NextResponse.json(activity, { status: 201 });
    } catch (error) {
        console.error("POST Activity API Error:", error);
        return NextResponse.json(
            { error: "Failed to create activity" },
            { status: 500 }
        );
    }
}
