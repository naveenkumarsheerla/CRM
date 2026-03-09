import { NextResponse } from "next/server";
import { taskService } from "@/lib/services/task-service";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const task = await taskService.getTaskById(id);
        return NextResponse.json(task);
    } catch (error) {
        console.error("GET Task API Error:", error);
        return NextResponse.json(
            { error: "Task not found" },
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
        const task = await taskService.updateTask(id, body);
        return NextResponse.json(task);
    } catch (error) {
        console.error("PATCH Task API Error:", error);
        return NextResponse.json(
            { error: "Failed to update task" },
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
        await taskService.deleteTask(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE Task API Error:", error);
        return NextResponse.json(
            { error: "Failed to delete task" },
            { status: 500 }
        );
    }
}
