import { NextResponse } from "next/server";
import { leadService } from "@/lib/services/lead-service";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const lead = await leadService.getLeadById(id);
        return NextResponse.json(lead);
    } catch (error) {
        console.error("GET Lead API Error:", error);
        return NextResponse.json(
            { error: "Lead not found" },
            { status: 404 }
        );
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const lead = await leadService.updateLead(id, body);
        return NextResponse.json(lead);
    } catch (error) {
        console.error("PATCH Lead API Error:", error);
        return NextResponse.json(
            { error: "Failed to update lead" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await leadService.deleteLead(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE Lead API Error:", error);
        return NextResponse.json(
            { error: "Failed to delete lead" },
            { status: 500 }
        );
    }
}
