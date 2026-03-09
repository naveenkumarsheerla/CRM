import { NextResponse } from "next/server";
import { taskService } from "@/lib/services/task-service";

export async function GET() {
    try {
        const tasks = await taskService.getTasks();
        return NextResponse.json(tasks);
    } catch (error) {
        console.error("GET Tasks API Error:", error);
        return NextResponse.json(
            { error: "Failed to fetch tasks" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        if (!body.title) {
            return NextResponse.json(
                { error: "Title is required" },
                { status: 400 }
            );
        }

        const task = await taskService.createTask(body);
        return NextResponse.json(task, { status: 201 });
    } catch (error) {
        console.error("POST Task API Error:", error);
        return NextResponse.json(
            { error: "Failed to create task" },
            { status: 500 }
        );
    }
}
