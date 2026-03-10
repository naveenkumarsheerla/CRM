"use client";

import { Bell, Search, ChevronDown } from "lucide-react";
import { useAuth } from "@/lib/contexts/auth-context";
import { GlobalSearch } from "./global-search";

export function Header() {
    const { user } = useAuth();

    // Initials for avatar
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };

    const displayName = user?.name || "Guest User";
    const displayRole = user?.role || "Visitor";
    const initials = user?.name ? getInitials(user.name) : "GU";
    return (
        <header className="h-16 border-b border-zinc-200 bg-white/80 backdrop-blur-md sticky top-0 z-30">
            <div className="h-full px-8 flex items-center justify-between">
                <GlobalSearch />

                <div className="flex items-center gap-4">
                    <button className="p-2 text-zinc-500 hover:bg-zinc-100 rounded-full relative transition-colors">
                        <Bell size={20} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full border-2 border-white"></span>
                    </button>

                    <div className="h-8 w-px bg-zinc-200 mx-2"></div>

                    <button className="flex items-center gap-3 p-1.5 rounded-full hover:bg-zinc-100 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-blue-600/20">
                            {initials}
                        </div>
                        <div className="hidden sm:block text-left">
                            <p className="text-sm font-semibold text-zinc-900 leading-none">{displayName}</p>
                            <p className="text-xs text-zinc-500 mt-1 leading-none">{displayRole}</p>
                        </div>
                        <ChevronDown size={14} className="text-zinc-400" />
                    </button>
                </div>
            </div>
        </header>
    );
}
