import { NextResponse } from "next/server";
import { activityService } from "@/lib/services/activity-service";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await activityService.deleteActivity(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE Activity API Error:", error);
        return NextResponse.json(
            { error: "Failed to delete activity" },
            { status: 500 }
        );
    }
}
