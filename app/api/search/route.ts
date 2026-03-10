import { NextResponse } from "next/server";
import { searchService } from "@/lib/services/search-service";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get("q");

        if (!query) {
            return NextResponse.json({
                leads: [],
                deals: [],
                tasks: [],
                users: []
            });
        }

        const results = await searchService.globalSearch(query);
        return NextResponse.json(results);
    } catch (error) {
        console.error("Global Search API Error:", error);
        return NextResponse.json(
            { error: "Failed to perform global search" },
            { status: 500 }
        );
    }
}
