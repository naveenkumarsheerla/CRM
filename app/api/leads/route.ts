import { NextResponse } from "next/server";
import { leadService } from "@/lib/services/lead-service";

export async function GET() {
    try {
        const leads = await leadService.getLeads();
        return NextResponse.json(leads);
    } catch (error) {
        console.error("GET Leads API Error:", error);
        return NextResponse.json(
            { error: "Failed to fetch leads" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        // Basic validation
        if (!body.name || !body.email) {
            return NextResponse.json(
                { error: "Name and email are required" },
                { status: 400 }
            );
        }

        const lead = await leadService.createLead(body);
        return NextResponse.json(lead, { status: 201 });
    } catch (error) {
        console.error("POST Lead API Error:", error);
        return NextResponse.json(
            { error: "Failed to create lead" },
            { status: 500 }
        );
    }
}
