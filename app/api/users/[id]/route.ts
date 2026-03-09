import { NextResponse } from "next/server";
import { userService } from "@/lib/services/user-service";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const user = await userService.getUserById(params.id);
        return NextResponse.json(user);
    } catch (error) {
        console.error("GET User API Error:", error);
        return NextResponse.json(
            { error: "User not found" },
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
        const user = await userService.updateUser(params.id, body);
        return NextResponse.json(user);
    } catch (error) {
        console.error("PATCH User API Error:", error);
        return NextResponse.json(
            { error: "Failed to update user" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await userService.deleteUser(params.id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE User API Error:", error);
        return NextResponse.json(
            { error: "Failed to delete user" },
            { status: 500 }
        );
    }
}
