"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { AuthProvider } from "@/lib/contexts/auth-context";
import { AuthGuard } from "@/components/auth/auth-guard";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLoginPage = pathname === "/login";

    if (isLoginPage) {
        return (
            <AuthProvider>
                <AuthGuard>
                    <div className="flex-1 overflow-y-auto">{children}</div>
                </AuthGuard>
            </AuthProvider>
        );
    }

    return (
        <AuthProvider>
            <AuthGuard>
                <div className="flex h-screen overflow-hidden w-full bg-white text-zinc-900">
                    <Sidebar />
                    <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                        <Header />
                        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                            {children}
                        </main>
                    </div>
                </div>
            </AuthGuard>
        </AuthProvider>
    );
}
