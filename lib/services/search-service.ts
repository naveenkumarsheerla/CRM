import { supabase } from "../supabase";

export interface SearchResults {
    leads: any[];
    deals: any[];
    tasks: any[];
    users: any[];
}

export const searchService = {
    async globalSearch(query: string): Promise<SearchResults> {
        if (!query || query.length < 2) {
            return { leads: [], deals: [], tasks: [], users: [] };
        }

        const searchTerm = `%${query}%`;

        const [leads, deals, tasks, users] = await Promise.all([
            // Search Leads
            supabase
                .from("leads")
                .select("id, name, email, status")
                .or(`name.ilike.${searchTerm},email.ilike.${searchTerm}`)
                .limit(5),

            // Search Deals
            supabase
                .from("deals")
                .select("id, title, amount, stage")
                .ilike("title", searchTerm)
                .limit(5),

            // Search Tasks
            supabase
                .from("tasks")
                .select("id, title, status")
                .ilike("title", searchTerm)
                .limit(5),

            // Search Users (Team Members)
            supabase
                .from("users")
                .select("id, name, email, role")
                .or(`name.ilike.${searchTerm},email.ilike.${searchTerm}`)
                .limit(5)
        ]);

        return {
            leads: leads.data || [],
            deals: deals.data || [],
            tasks: tasks.data || [],
            users: users.data || []
        };
    }
};
