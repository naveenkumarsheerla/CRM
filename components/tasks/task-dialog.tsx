"use client";

import { useEffect, useState } from "react";
import { X, Save, Loader2, Sparkles, Calendar, User, Target, AlignLeft } from "lucide-react";
import { Task } from "@/lib/services/task-service";

interface TaskDialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    leads: any[];
    users: any[];
    initialData?: Task;
    onSubmit: (data: Omit<Task, "id" | "created_at" | "updated_at" | "lead" | "user">) => void;
    isLoading?: boolean;
}

export function TaskDialog({
    isOpen,
    onClose,
    title,
    leads,
    users,
    initialData,
    onSubmit,
    isLoading,
}: TaskDialogProps) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        status: "pending",
        dueDate: "",
        leadId: "",
        userId: "",
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || "",
                description: initialData.description || "",
                status: initialData.status || "pending",
                dueDate: initialData.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : "",
                leadId: initialData.leadId || "",
                userId: initialData.userId || "",
            });
        } else {
            setFormData({
                title: "",
                description: "",
                status: "pending",
                dueDate: "",
                leadId: "",
                userId: "",
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            dueDate: formData.dueDate || null,
            leadId: formData.leadId || null,
            userId: formData.userId || null,
        });
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
                        <p className="text-[10px] text-zinc-500 font-bold tracking-widest opacity-60">Task Management</p>
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
                            <label className="text-xs font-black  tracking-widest text-zinc-500 ml-1 flex items-center gap-2">
                                <Target size={14} /> Task Title
                            </label>
                             <input
                                required
                                type="text"
                                placeholder="e.g. Conduct Tactical Review"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full rounded-[20px] border border-zinc-100 bg-zinc-50/50 px-6 py-4 text-sm font-bold shadow-inner transition-all focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/5 placeholder:text-zinc-300"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black tracking-widest text-zinc-500 ml-1 flex items-center gap-2">
                                <AlignLeft size={14} /> Description
                            </label>
                            <textarea
                                rows={3}
                                placeholder="Elaborate on operational specifics..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full rounded-[20px] border border-zinc-100 bg-zinc-50/50 px-6 py-4 text-sm font-bold shadow-inner transition-all focus:bg-white focus:border-zinc-900 focus:outline-none focus:ring-4 focus:ring-zinc-900/5 placeholder:text-zinc-300 resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black tracking-widest text-zinc-500 ml-1">Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full rounded-[20px] border border-zinc-100 bg-zinc-50/50 px-6 py-4 text-sm font-bold shadow-inner transition-all focus:bg-white focus:border-zinc-900 focus:outline-none focus:ring-4 focus:ring-zinc-900/5 appearance-none"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>

                            <div className="space-y-2">\
                                <label className="text-xs font-black  tracking-widest text-zinc-500 ml-1 flex items-center gap-2">
                                    <Calendar size={14} /> Due Date
                                </label>
                                <input
                                    type="date"
                                    value={formData.dueDate}
                                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                    className="w-full rounded-[20px] border border-zinc-100 bg-zinc-50/50 px-6 py-4 text-sm font-bold shadow-inner transition-all focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/5"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black  tracking-widest text-zinc-500 ml-1 flex items-center gap-2">
                                    <Target size={14} /> Related Lead
                                </label>
                                <select
                                    value={formData.leadId}
                                    onChange={(e) => setFormData({ ...formData, leadId: e.target.value })}
                                    className="w-full rounded-[20px] border border-zinc-100 bg-zinc-50/50 px-6 py-4 text-sm font-bold shadow-inner transition-all focus:bg-white focus:border-zinc-900 focus:outline-none focus:ring-4 focus:ring-zinc-900/5 appearance-none"
                                >
                                    <option value="">None</option>
                                    {leads.map((lead) => (
                                        <option key={lead.id} value={lead.id}>
                                            {lead.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black  tracking-widest text-zinc-500 ml-1 flex items-center gap-2">
                                    <User size={14} /> Assignee
                                </label>
                                <select
                                    value={formData.userId}
                                    onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                                    className="w-full rounded-[20px] border border-zinc-100 bg-zinc-50/50 px-6 py-4 text-sm font-bold shadow-inner transition-all focus:bg-white focus:border-zinc-900 focus:outline-none focus:ring-4 focus:ring-zinc-900/5 appearance-none"
                                >
                                    <option value="">Unassigned</option>
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
                            className="h-16 flex-1 rounded-[24px] text-xs font-black  tracking-widest text-zinc-400 hover:bg-zinc-50 hover:text-zinc-900 transition-all"
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
