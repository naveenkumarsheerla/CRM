"use client";

import { X } from "lucide-react";
import { LeadForm } from "./lead-form";
import { Lead } from "@/lib/services/lead-service";
import { User } from "@/lib/services/user-service";

interface LeadDialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    users: User[];
    initialData?: any;
    onSubmit: (data: Omit<Lead, "id" | "created_at" | "updated_at">) => void;
    isLoading?: boolean;
}

export function LeadDialog({
    isOpen,
    onClose,
    title,
    users,
    initialData,
    onSubmit,
    isLoading,
}: LeadDialogProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="w-full max-w-2xl rounded-[40px] bg-white p-10 shadow-2xl shadow-blue-900/10 animate-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-xl font-black tracking-tighter text-zinc-900">
                            {title}
                        </h2>
                        <p className="text-xs font-black tracking-[0.2em] opacity-60 mt-1">Lead Management</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-xl p-3 text-zinc-400 hover:bg-zinc-50 hover:text-zinc-900 transition-all"
                    >
                        <X size={24} />
                    </button>
                </div>
                <LeadForm
                    initialData={initialData}
                    users={users}
                    onSubmit={onSubmit}
                    onCancel={onClose}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
}
