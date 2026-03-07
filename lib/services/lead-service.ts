import { supabase } from "../supabase";

export interface Lead {
    id?: string;
    name: string;
    email: string;
    phone?: string | null;
    status: string;
    assignedId?: number | string | null;
    created_at?: string;
    updated_at?: string;
    assignedTo?: {
        id: string;
        name: string;
        role?: string;
    };
}

export const leadService = {
    async getLeads() {
        const { data, error } = await supabase
            .from("leads")
            .select("*, assignedTo:users(*)")
            .order("created_at", { ascending: false });

        if (error) throw error;
        return data;
    },

    async getLeadById(id: string) {
        const { data, error } = await supabase
            .from("leads")
            .select("*, assignedTo:users(*)")
            .eq("id", id)
            .single();

        if (error) throw error;
        return data;
    },

    async createLead(lead: Omit<Lead, "id" | "created_at" | "updated_at">) {
        const { data, error } = await supabase
            .from("leads")
            .insert([{
                name: lead.name,
                email: lead.email,
                phone: lead.phone,
                status: lead.status || "new",
                assigned_to: lead.assignedId === "" ? null : lead.assignedId
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async updateLead(id: string, lead: Partial<Lead>) {
        const { data, error } = await supabase
            .from("leads")
            .update({
                name: lead.name,
                email: lead.email,
                phone: lead.phone,
                status: lead.status,
                assigned_to: lead.assignedId === "" ? null : lead.assignedId
            })
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async deleteLead(id: string) {
        const { error } = await supabase
            .from("leads")
            .delete()
            .eq("id", id);

        if (error) throw error;
        return true;
    },
};
