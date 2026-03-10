import { NextResponse } from "next/server";
import { dealService } from "@/lib/services/deal-service";

export async function GET() {
    try {
        const deals = await dealService.getDeals();
        return NextResponse.json(deals);
    } catch (error) {
        console.error("GET Deals API Error:", error);
        return NextResponse.json(
            { error: "Failed to fetch deals" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        if (!body.title || !body.amount || !body.leadId) {
            return NextResponse.json(
                { error: "Title, amount, and leadId are required" },
                { status: 400 }
            );
        }

        const deal = await dealService.createDeal(body);
        return NextResponse.json(deal, { status: 201 });
    } catch (error) {
        console.error("POST Deal API Error:", error);
        return NextResponse.json(
            { error: "Failed to create deal" },
            { status: 500 }
        );
    }
}
