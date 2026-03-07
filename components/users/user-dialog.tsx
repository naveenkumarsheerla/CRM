"use client";

import { X } from "lucide-react";
import { UserForm } from "./user-form";
import { User } from "@/lib/services/user-service";

interface UserDialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    initialData?: User;
    onSubmit: (data: Omit<User, "id" | "created_at" | "updated_at">) => void;
    isLoading?: boolean;
}

export function UserDialog({
    isOpen,
    onClose,
    title,
    initialData,
    onSubmit,
    isLoading,
}: UserDialogProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md rounded-[32px] bg-white p-8 shadow-2xl shadow-blue-900/10 animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-black text-zinc-900 tracking-tighter">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="rounded-xl p-2 text-zinc-400 hover:bg-zinc-50 hover:text-zinc-900 transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>
                <UserForm
                    initialData={initialData}
                    onSubmit={onSubmit}
                    onCancel={onClose}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
}
