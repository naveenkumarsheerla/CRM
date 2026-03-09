import { NextResponse } from "next/server";
import { leadService } from "@/lib/services/lead-service";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const lead = await leadService.getLeadById(params.id);
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
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const lead = await leadService.updateLead(params.id, body);
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
    { params }: { params: { id: string } }
) {
    try {
        await leadService.deleteLead(params.id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE Lead API Error:", error);
        return NextResponse.json(
            { error: "Failed to delete lead" },
            { status: 500 }
        );
    }
}
