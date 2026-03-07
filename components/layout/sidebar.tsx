"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Settings,
    LogOut,
    ChevronRight,
    TrendingUp,
    Briefcase,
    Target,
    CheckCircle2,
    Activity as ActivityIcon
} from "lucide-react";

const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Users", href: "/users", icon: Users },
    { name: "Leads", href: "/leads", icon: Target },
    { name: "Deals", href: "/deals", icon: TrendingUp },
    { name: "Tasks", href: "/tasks", icon: CheckCircle2 },
    { name: "Activities", href: "/activities", icon: ActivityIcon },
    { name: "Clients", href: "/clients", icon: Briefcase },
    { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        // Logic to clear session could go here
        router.push("/login");
    };

    return (
        <div className="flex flex-col h-full bg-white border-r border-zinc-200 w-64 transition-all duration-300">
            <div className="p-6">
                <div className="flex items-center gap-2 px-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                        <span className="text-white font-bold text-lg">A</span>
                    </div>
                    <span className="font-bold text-xl tracking-tight text-zinc-900">CRM Core</span>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group ${isActive
                                ? "bg-blue-50 text-blue-600 italic font-black"
                                : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                                }`}
                        >
                            <item.icon size={18} className={isActive ? "text-blue-600" : "text-zinc-400 group-hover:text-zinc-600"} />
                            <span className="flex-1">{item.name}</span>
                            {isActive && <ChevronRight size={14} className="text-zinc-400" />}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-zinc-100">
                <button 
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
}
