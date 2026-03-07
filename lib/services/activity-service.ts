import { supabase } from "../supabase";

export interface Activity {
    id?: string;
    type: string;
    note?: string | null;
    leadId: string;
    userId?: string | null;
    created_at?: string;
    lead?: {
        id: string;
        name: string;
        email?: string;
    };
    user?: {
        id: string;
        name: string;
        email?: string;
    };
}

export const activityService = {
    async getActivities() {
        const { data, error } = await supabase
            .from("activities")
            .select("*, lead:leads(id, name, email), user:users(id, name, email)")
            .order("created_at", { ascending: false });

        if (error) throw error;
        return data as Activity[];
    },

    async getActivitiesByLead(leadId: string) {
        const { data, error } = await supabase
            .from("activities")
            .select("*, user:users(id, name, email)")
            .eq("leadId", leadId)
            .order("created_at", { ascending: false });

        if (error) throw error;
        return data as Activity[];
    },

    async createActivity(activity: Omit<Activity, "id" | "created_at" | "lead" | "user">) {
        const { data, error } = await supabase
            .from("activities")
            .insert([{
                type: activity.type,
                note: activity.note || null,
                leadId: activity.leadId,
                userId: activity.userId || null
            }])
            .select()
            .single();

        if (error) throw error;
        return data as Activity;
    },

    async deleteActivity(id: string) {
        const { error } = await supabase
            .from("activities")
            .delete()
            .eq("id", id);

        if (error) throw error;
        return true;
    },
};
