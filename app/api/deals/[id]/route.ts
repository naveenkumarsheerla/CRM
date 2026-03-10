import { NextResponse } from "next/server";
import { dealService } from "@/lib/services/deal-service";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const deal = await dealService.getDealById(id);
        return NextResponse.json(deal);
    } catch (error) {
        console.error("GET Deal API Error:", error);
        return NextResponse.json(
            { error: "Deal not found" },
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
        const deal = await dealService.updateDeal(id, body);
        return NextResponse.json(deal);
    } catch (error) {
        console.error("PATCH Deal API Error:", error);
        return NextResponse.json(
            { error: "Failed to update deal" },
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
        await dealService.deleteDeal(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE Deal API Error:", error);
        return NextResponse.json(
            { error: "Failed to delete deal" },
            { status: 500 }
        );
    }
}
