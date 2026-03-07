"use client";

import { useState, useEffect } from "react";
import { User } from "@/lib/services/user-service";

interface UserFormProps {
    initialData?: User;
    onSubmit: (data: Omit<User, "id" | "created_at" | "updated_at">) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export function UserForm({ initialData, onSubmit, onCancel, isLoading }: UserFormProps) {
    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        email: initialData?.email || "",
        role: initialData?.role || "viewer",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2">
                    Full Name
                </label>
                <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-[20px] border border-zinc-100 bg-zinc-50/50 px-6 py-4 text-sm font-bold shadow-inner transition-all focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/5 placeholder:text-zinc-300"
                    placeholder="e.g. Alexander Pierce"
                />
            </div>
            <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2">
                    Email Address
                </label>
                <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-[20px] border border-zinc-100 bg-zinc-50/50 px-6 py-4 text-sm font-bold shadow-inner transition-all focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/5 placeholder:text-zinc-300"
                    placeholder="alex@nexus-intel.com"
                />
            </div>
            <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2">
                    Role
                </label>
                <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full rounded-[20px] border border-zinc-100 bg-zinc-50/50 px-6 py-4 text-sm font-bold shadow-inner transition-all focus:bg-white focus:border-zinc-900 focus:outline-none focus:ring-4 focus:ring-zinc-900/5 appearance-none"
                >
                    <option value="admin">System Admin</option>
                    <option value="editor">Strategist</option>
                    <option value="viewer">Observer</option>
                    <option value="editor">Editor</option>
                </select>
            </div>
            <div className="flex items-center justify-end gap-4 pt-6">
                <button
                    type="button"
                    onClick={onCancel}
                    className="h-14 px-8 rounded-[20px] text-xs font-black uppercase tracking-widest text-zinc-400 hover:bg-zinc-50 hover:text-zinc-900 transition-all"
                >
                    Discard
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="h-14 px-10 rounded-[20px] bg-blue-600 text-xs font-black uppercase tracking-widest text-white shadow-2xl shadow-blue-600/30 hover:-translate-y-1 transition-all disabled:opacity-50 hover:bg-blue-700 active:scale-95"
                >
                    {isLoading ? "Syncing..." : initialData ? "Update User" : "Save"}
                </button>
            </div>
        </form>
    );
}
