import { supabase } from "../supabase";

export interface Deal {
    id?: string;
    title: string;
    amount: number;
    stage: string;
    leadId: string;
    created_at?: string;
    updated_at?: string;
    lead?: {
        id: string;
        name: string;
        email: string;
    };
}

export const dealService = {
    async getDeals() {
        const { data, error } = await supabase
            .from("deals")
            .select("*, lead:leads(id, name, email)")
            .order("created_at", { ascending: false });

        if (error) throw error;
        return data as Deal[];
    },

    async getDealById(id: string) {
        const { data, error } = await supabase
            .from("deals")
            .select("*, lead:leads(id, name, email)")
            .eq("id", id)
            .single();

        if (error) throw error;
        return data as Deal;
    },

    async createDeal(deal: Omit<Deal, "id" | "created_at" | "updated_at" | "lead">) {
        const { data, error } = await supabase
            .from("deals")
            .insert([{
                title: deal.title,
                amount: deal.amount,
                stage: deal.stage || "new",
                leadId: deal.leadId
            }])
            .select()
            .single();

        if (error) throw error;
        return data as Deal;
    },

    async updateDeal(id: string, deal: Partial<Deal>) {
        const { data, error } = await supabase
            .from("deals")
            .update({
                title: deal.title,
                amount: deal.amount,
                stage: deal.stage,
                leadId: deal.leadId
            })
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return data as Deal;
    },

    async deleteDeal(id: string) {
        const { error } = await supabase
            .from("deals")
            .delete()
            .eq("id", id);

        if (error) throw error;
        return true;
    }
};
