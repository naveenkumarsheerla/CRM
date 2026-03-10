"use server";

import { supabase } from "@/lib/supabase";
import { User } from "@/lib/services/user-service";

export async function loginAction(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
        const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("email", email)
            .single();

        if (error || !data) {
            return { success: false, error: "Authentication failed: Identity not found in operational records." };
        }

        const user = data as User;
        const dbPassword = user.password || "password123";

        if (dbPassword !== password) {
            return { success: false, error: "Access denied: Secure keyphrase mismatch." };
        }

        // Generate JWT token
        const { signToken } = await import("@/lib/auth");
        const token = await signToken({
            userId: user.id,
            email: user.email,
            role: user.role
        });

        return { 
            success: true, 
            user: {
                ...user,
                token
            } 
        };
    } catch {
        return { success: false, error: "System failure: Connection to intelligence nexus interrupted." };
    }
}
