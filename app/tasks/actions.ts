"use server";

import { taskService, Task } from "@/lib/services/task-service";
import { revalidatePath } from "next/cache";

export async function getTasksAction() {
    return await taskService.getTasks();
}

export async function createTaskAction(data: Omit<Task, "id" | "created_at" | "updated_at" | "lead" | "user">) {
    const task = await taskService.createTask(data);
    revalidatePath("/tasks");
    return task;
}

export async function updateTaskAction(id: string, data: Partial<Task>) {
    const task = await taskService.updateTask(id, data);
    revalidatePath("/tasks");
    return task;
}

export async function deleteTaskAction(id: string) {
    await taskService.deleteTask(id);
    revalidatePath("/tasks");
    return true;
}
