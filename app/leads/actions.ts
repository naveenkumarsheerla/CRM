"use server";

import { leadService, Lead } from "@/lib/services/lead-service";
import { revalidatePath } from "next/cache";

export async function getLeadsAction() {
    return await leadService.getLeads();
}

export async function createLeadAction(data: Omit<Lead, "id" | "created_at" | "updated_at">) {
    const lead = await leadService.createLead(data);
    revalidatePath("/leads");
    return lead;
}

export async function updateLeadAction(id: string, data: Partial<Lead>) {
    const lead = await leadService.updateLead(id, data);
    revalidatePath("/leads");
    return lead;
}

export async function deleteLeadAction(id: string) {
    await leadService.deleteLead(id);
    revalidatePath("/leads");
    return true;
}
