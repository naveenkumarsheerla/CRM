import { supabase } from "../supabase";

export interface Task {
    id?: string;
    title: string;
    description?: string | null;
    status: string;
    dueDate?: string | null;
    leadId?: string | null;
    userId?: string | null;
    created_at?: string;
    updated_at?: string;
    lead?: {
        id: string;
        name: string;
    };
    user?: {
        id: string;
        name: string;
    };
}

export const taskService = {
    async getTasks() {
        const { data, error } = await supabase
            .from("tasks")
            .select("*, lead:leads(id, name), user:users(id, name)")
            .order("created_at", { ascending: false });

        if (error) throw error;
        return data as Task[];
    },

    async getTaskById(id: string) {
        const { data, error } = await supabase
            .from("tasks")
            .select("*, lead:leads(id, name), user:users(id, name)")
            .eq("id", id)
            .single();

        if (error) throw error;
        return data as Task;
    },

    async createTask(task: Omit<Task, "id" | "created_at" | "updated_at" | "lead" | "user">) {
        const { data, error } = await supabase
            .from("tasks")
            .insert([{
                title: task.title,
                description: task.description,
                status: task.status || "pending",
                dueDate: task.dueDate || null,
                leadId: task.leadId || null,
                userId: task.userId || null,
                updated_at: new Date().toISOString()
            }])
            .select()
            .single();

        if (error) throw error;
        return data as Task;
    },

    async updateTask(id: string, task: Partial<Task>) {
        // Remove nested objects and timestamps before updating
        const { lead, user, created_at, updated_at, ...updateData } = task;
        
        const { data, error } = await supabase
            .from("tasks")
            .update({
                ...updateData,
                updated_at: new Date().toISOString()
            })
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return data as Task;
    },

    async deleteTask(id: string) {
        const { error } = await supabase
            .from("tasks")
            .delete()
            .eq("id", id);

        if (error) throw error;
        return true;
    },
};
