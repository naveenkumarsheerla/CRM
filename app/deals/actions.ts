"use server";

import { dealService, Deal } from "@/lib/services/deal-service";
import { revalidatePath } from "next/cache";

export async function getDealsAction() {
    return await dealService.getDeals();
}

export async function createDealAction(data: Omit<Deal, "id" | "created_at" | "updated_at" | "lead">) {
    const deal = await dealService.createDeal(data);
    revalidatePath("/deals");
    return deal;
}

export async function updateDealAction(id: string, data: Partial<Deal>) {
    const deal = await dealService.updateDeal(id, data);
    revalidatePath("/deals");
    return deal;
}

export async function deleteDealAction(id: string) {
    await dealService.deleteDeal(id);
    revalidatePath("/deals");
    return true;
}
