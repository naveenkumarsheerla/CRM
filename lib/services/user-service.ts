import { supabase } from "../supabase";

export interface User {
    id?: string;
    name: string;
    email: string;
    role: string;
    created_at?: string;
    updated_at?: string;
    password?: string;
}

export const userService = {
    async getUsers() {
        const { data, error } = await supabase
            .from("users")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;
        return data as User[];
    },

    async getUserById(id: string) {
        const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", id)
            .single();

        if (error) throw error;
        return data as User;
    },

    async createUser(user: Omit<User, "id" | "created_at" | "updated_at">) {
        const userData = {
            ...user,
            password: user.password || "password123"
        };
        const { data, error } = await supabase
            .from("users")
            .insert([userData])
            .select()
            .single();

        if (error) throw error;
        return data as User;
    },

    async updateUser(id: string, user: Partial<User>) {
        const { data, error } = await supabase
            .from("users")
            .update(user)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return data as User;
    },

    async deleteUser(id: string) {
        const { error } = await supabase
            .from("users")
            .delete()
            .eq("id", id);

        if (error) throw error;
        return true;
    }
};
