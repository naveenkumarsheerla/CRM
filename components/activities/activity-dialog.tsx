"use client";

import { useState } from "react";
import { X, Save, Loader2, Sparkles, Phone, Mail, Users, FileText, Target, User as UserIcon } from "lucide-react";
import { Activity } from "@/lib/services/activity-service";
import { Lead } from "@/lib/services/lead-service";
import { User } from "@/lib/services/user-service";

interface ActivityDialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    leads: Lead[];
    users: User[];
    initialData?: Activity;
    onSubmit: (data: Omit<Activity, "id" | "created_at" | "lead" | "user">) => void;
    isLoading?: boolean;
}

const activityTypes = [
    { label: "Call", value: "call", icon: Phone },
    { label: "Email", value: "email", icon: Mail },
    { label: "Meeting", value: "meeting", icon: Users },
    { label: "Note", value: "note", icon: FileText },
];

export function ActivityDialog({
    isOpen,
    onClose,
    title,
    leads,
    users,
    initialData,
    onSubmit,
    isLoading,
}: ActivityDialogProps) {
    const [formData, setFormData] = useState({
        type: initialData?.type || "note",
        note: initialData?.note || "",
        leadId: initialData?.leadId || "",
        userId: initialData?.userId || "",
    });



    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-500">
            <div className="w-full max-w-xl rounded-[40px] bg-white p-10 shadow-2xl shadow-blue-900/10 border border-zinc-100 animate-in zoom-in-95 duration-500 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <Sparkles size={24} className="text-blue-500 animate-pulse" />
                            <h2 className="text-xl font-black tracking-tighter text-zinc-900">
                                {title}
                            </h2>
                        </div>
                        <p className="text-[10px] font-black tracking-[0.3em] text-zinc-400">Activity Logger</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-2xl p-4 text-zinc-400 hover:bg-zinc-50 hover:text-zinc-900 transition-all border border-transparent hover:border-zinc-100"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-black tracking-widest text-zinc-500 ml-1">Activity Type</label>
                            <div className="grid grid-cols-4 gap-3">
                                {activityTypes.map((type) => {
                                    const Icon = type.icon;
                                    const isSelected = formData.type === type.value;
                                    return (
                                        <button
                                            key={type.value}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, type: type.value })}
                                            className={`flex flex-col items-center justify-center gap-2 p-5 rounded-[24px] border transition-all ${
                                                isSelected
                                                    ? "bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-600/30 scale-105"
                                                    : "bg-white border-zinc-100 text-zinc-400 hover:bg-zinc-50"
                                            }`}
                                        >
                                            <Icon size={20} />
                                            <span className="text-[10px] font-black tracking-widest">{type.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black tracking-widest text-zinc-500 ml-1 flex items-center gap-2">
                                <FileText size={14} /> Notes / Details
                            </label>
                             <textarea
                                rows={4}
                                placeholder="Describe the operational specifics..."
                                value={formData.note}
                                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                className="w-full rounded-[24px] border border-zinc-100 bg-zinc-50/50 px-6 py-4 text-sm font-bold shadow-inner transition-all focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/5 placeholder:text-zinc-300 resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black tracking-widest text-zinc-500 ml-1 flex items-center gap-2">
                                    <Target size={14} /> Related Lead
                                </label>
                                 <select
                                    required
                                    value={formData.leadId}
                                    onChange={(e) => setFormData({ ...formData, leadId: e.target.value })}
                                    className="w-full rounded-[20px] border border-zinc-100 bg-zinc-50/50 px-6 py-4 text-sm font-bold shadow-inner transition-all focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/5 placeholder:text-zinc-300 appearance-none"
                                >
                                    <option value="">Select Lead...</option>
                                    {leads.map((lead) => (
                                        <option key={lead.id} value={lead.id}>
                                            {lead.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black tracking-widest text-zinc-500 ml-1 flex items-center gap-2">
                                    <UserIcon size={14} /> Logged By
                                </label>
                                 <select
                                    value={formData.userId}
                                    onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                                    className="w-full rounded-[20px] border border-zinc-100 bg-zinc-50/50 px-6 py-4 text-sm font-bold shadow-inner transition-all focus:bg-white focus:border-zinc-900 focus:outline-none focus:ring-4 focus:ring-zinc-900/5 appearance-none"
                                >
                                    <option value="">Unknown</option>
                                    {users.map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 pt-10">
                        <button
                            type="button"
                            onClick={onClose}
                            className="h-16 flex-1 rounded-[24px] text-xs font-black tracking-widest text-zinc-400 hover:bg-zinc-50 hover:text-zinc-900 transition-all"
                        >
                            Discard
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="h-16 flex-[2] flex items-center justify-center gap-4 rounded-[24px] bg-blue-600 text-xs font-black tracking-widest text-white shadow-2xl shadow-blue-600/30 hover:-translate-y-1 transition-all disabled:opacity-50 hover:bg-blue-700 active:scale-95"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    <Save size={18} />
                                    Save
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
