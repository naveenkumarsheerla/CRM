"use server";

import { activityService, Activity } from "@/lib/services/activity-service";
import { revalidatePath } from "next/cache";

export async function getActivitiesAction() {
    return await activityService.getActivities();
}

export async function createActivityAction(data: Omit<Activity, "id" | "created_at" | "lead" | "user">) {
    const activity = await activityService.createActivity(data);
    revalidatePath("/activities");
    revalidatePath("/leads"); // Also revalidate leads as activities are linked to them
    return activity;
}

export async function deleteActivityAction(id: string) {
    await activityService.deleteActivity(id);
    revalidatePath("/activities");
    return true;
}
