import { NextResponse } from "next/server";
import { userService } from "@/lib/services/user-service";

export async function GET() {
    try {
        const users = await userService.getUsers();
        return NextResponse.json(users);
    } catch (error) {
        console.error("GET Users API Error:", error);
        return NextResponse.json(
            { error: "Failed to fetch users" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        if (!body.name || !body.email) {
            return NextResponse.json(
                { error: "Name and email are required" },
                { status: 400 }
            );
        }

        const user = await userService.createUser(body);
        return NextResponse.json(user, { status: 201 });
    } catch (error) {
        console.error("POST User API Error:", error);
        return NextResponse.json(
            { error: "Failed to create user" },
            { status: 500 }
        );
    }
}
