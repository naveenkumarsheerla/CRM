"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/contexts/auth-context";
import { Loader2 } from "lucide-react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isLoading) {
            const isLoginPage = pathname === "/login";
            if (!user && !isLoginPage) {
                router.replace("/login");
            } else if (user && isLoginPage) {
                router.replace("/");
            }
        }
    }, [user, isLoading, pathname, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-zinc-100 via-transparent to-transparent">
                <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
                <h2 className="text-xl font-black tracking-tighter text-zinc-900">INITIALIZING</h2>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mt-2">Checking Operational Clearance...</p>
            </div>
        );
    }

    // Render nothing if user is required but missing (will redirect)
    // or if user is present but trying to access login (will redirect)
    const isLoginPage = pathname === "/login";
    if (!user && !isLoginPage) return null;
    if (user && isLoginPage) return null;

    return <>{children}</>;
}
