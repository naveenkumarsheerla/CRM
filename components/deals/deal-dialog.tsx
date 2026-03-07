"use client";

import { useState } from "react";
import { X, Save, Loader2, Sparkles } from "lucide-react";
import { Deal } from "@/lib/services/deal-service";
import { Lead } from "@/lib/services/lead-service";
 
interface DealDialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    leads: Lead[];
    initialData?: Deal;
    onSubmit: (data: Omit<Deal, "id" | "created_at" | "updated_at" | "lead">) => void;
    isLoading?: boolean;
}

export function DealDialog({
    isOpen,
    onClose,
    title,
    leads,
    initialData,
    onSubmit,
    isLoading,
}: DealDialogProps) {
    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        amount: initialData?.amount || 0,
        stage: initialData?.stage || "new",
        leadId: initialData?.leadId || "",
    });



    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-500">
            <div className="w-full max-w-xl rounded-[48px] bg-white p-12 shadow-2xl shadow-blue-900/10 border border-zinc-100 animate-in zoom-in-95 duration-500">
                <div className="flex items-center justify-between mb-10">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <Sparkles size={24} className="text-blue-500 animate-pulse" />
                            <h2 className="text-xl font-black tracking-tighter text-zinc-900">
                                {title}
                            </h2>
                        </div>
                        <p className="text-[10px] text-zinc-500 font-bold tracking-widest opacity-60">Track and manage your sales pipeline</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-2xl p-4 text-zinc-400 hover:bg-zinc-50 hover:text-zinc-900 transition-all border border-transparent hover:border-zinc-100"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black  tracking-widest text-zinc-500 ml-1">Deal Title</label>
                            <input
                                required
                                type="text"
                                placeholder="e.g. Enterprise Global Expansion"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full rounded-[20px] border border-zinc-100 bg-zinc-50/50 px-6 py-4 text-sm font-bold shadow-inner transition-all focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/5 placeholder:text-zinc-300"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black tracking-widest text-zinc-500 ml-1">Value ($)</label>
                                <input
                                    required
                                    type="number"
                                    placeholder="50000"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                                    className="w-full rounded-[20px] border border-zinc-100 bg-zinc-50/50 px-6 py-4 text-sm font-bold shadow-inner transition-all focus:bg-white focus:border-zinc-900 focus:outline-none focus:ring-4 focus:ring-zinc-900/5 appearance-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black tracking-widest text-zinc-500 ml-1">Stage</label>
                                <select
                                    value={formData.stage}
                                    onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                                    className="w-full rounded-[20px] border border-zinc-100 bg-zinc-50/50 px-6 py-4 text-sm font-bold shadow-inner transition-all focus:bg-white focus:border-zinc-900 focus:outline-none focus:ring-4 focus:ring-zinc-900/5 appearance-none"
                                >
                                    <option value="new">Target Acquisition</option>
                                    <option value="negotiation">Active Negotiation</option>
                                    <option value="closed_won">Operational Success</option>
                                    <option value="closed_lost">Tactical Withdrawal</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black tracking-widest text-zinc-500 ml-1">Associated Lead</label>
                            <select
                                required
                                value={formData.leadId}
                                onChange={(e) => setFormData({ ...formData, leadId: e.target.value })}
                                className="w-full rounded-[20px] border border-zinc-100 bg-zinc-50/50 px-6 py-4 text-sm font-bold shadow-inner transition-all focus:bg-white focus:border-zinc-900 focus:outline-none focus:ring-4 focus:ring-zinc-900/5 appearance-none"
                            >
                                <option value="">Select Target Lead...</option>
                                {leads.map((lead) => (
                                    <option key={lead.id} value={lead.id}>
                                        {lead.name.toUpperCase()} — {lead.email}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 pt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="h-16 flex-1 rounded-[24px] text-xs font-black uppercase tracking-widest text-zinc-400 hover:bg-zinc-50 hover:text-zinc-900 transition-all"
                        >
                            Discard
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="h-16 flex-[2] flex items-center justify-center gap-4 rounded-[24px] bg-blue-600 text-xs font-black uppercase tracking-widest text-white shadow-2xl shadow-blue-600/40 hover:-translate-y-1 transition-all disabled:opacity-50 hover:bg-blue-700 active:scale-95"
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
