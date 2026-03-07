"use client";

import { useState, useEffect } from "react";
import { Lead } from "@/lib/services/lead-service";
import { User } from "@/lib/services/user-service";

interface LeadFormProps {
    initialData?: any;
    users: User[];
    onSubmit: (data: Omit<Lead, "id" | "created_at" | "updated_at">) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

const statusOptions = [
    { label: "New", value: "new" },
    { label: "Contacted", value: "contacted" },
    { label: "Qualified", value: "qualified" },
    { label: "Closed", value: "closed" },
];

export function LeadForm({ initialData, users, onSubmit, onCancel, isLoading }: LeadFormProps) {
    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        email: initialData?.email || "",
        phone: initialData?.phone || "",
        status: initialData?.status || "new",
        assignedId: initialData?.assignedId || "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            assignedId: formData.assignedId === "" ? null : formData.assignedId,
        } as any);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                    <label className="block text-[10px] font-black  tracking-[0.2em] text-zinc-400 mb-2">
                       Lead Name
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full rounded-[20px] border border-zinc-100 bg-zinc-50/50 px-6 py-4 text-sm font-bold shadow-inner transition-all focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/5 placeholder:text-zinc-300"
                        placeholder="Organization or Individual Designation"
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-black  tracking-[0.2em] text-zinc-400 mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full rounded-[20px] border border-zinc-100 bg-zinc-50/50 px-6 py-4 text-sm font-bold shadow-inner transition-all focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/5 placeholder:text-zinc-300"
                        placeholder="contact@nexus-intel.com"
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-black tracking-[0.2em] text-zinc-400 mb-2">
                        Phone
                    </label>
                    <input
                        type="text"
                        value={formData.phone || ""}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full rounded-[20px] border border-zinc-100 bg-zinc-50/50 px-6 py-4 text-sm font-bold shadow-inner transition-all focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/5 placeholder:text-zinc-300"
                        placeholder="+1 (555) 000-0000"
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-black tracking-[0.2em] text-zinc-400 mb-2">
                        Phase
                    </label>
                    <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full rounded-[20px] border border-zinc-100 bg-zinc-50/50 px-6 py-4 text-sm font-bold shadow-inner transition-all focus:bg-white focus:border-zinc-900 focus:outline-none focus:ring-4 focus:ring-zinc-900/5 appearance-none"
                    >
                        {statusOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-[10px] font-black  tracking-[0.2em] text-zinc-400 mb-2">
                        Lead Assignee
                    </label>
                    <select
                        value={formData.assignedId || ""}
                        onChange={(e) => setFormData({ ...formData, assignedId: e.target.value })}
                        className="w-full rounded-[20px] border border-zinc-100 bg-zinc-50/50 px-6 py-4 text-sm font-bold shadow-inner transition-all focus:bg-white focus:border-zinc-900 focus:outline-none focus:ring-4 focus:ring-zinc-900/5 appearance-none"
                    >
                        <option value="">Unassigned</option>
                        {users.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.name} ({user.role})
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="flex items-center justify-end gap-4 pt-8">
                <button
                    type="button"
                    onClick={onCancel}
                    className="h-14 px-10 rounded-[20px] text-xs font-black  tracking-widest text-zinc-400 hover:bg-zinc-50 hover:text-zinc-900 transition-all"
                >
                    Discard
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="h-14 px-12 rounded-[20px] bg-blue-600 text-xs font-black  tracking-widest text-white shadow-2xl shadow-blue-600/30 hover:-translate-y-1 transition-all disabled:opacity-50 hover:bg-blue-700 active:scale-95"
                >
                    {isLoading ? "Syncing..." : initialData ? "Update Lead" : "Add Lead"}
                </button>
            </div>
        </form>
    );
}
