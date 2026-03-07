"use client";

import { X, Sparkles, Clock, Target, User, FileText, Info } from "lucide-react";
import { Activity } from "@/lib/services/activity-service";

interface ActivityDetailDialogProps {
    isOpen: boolean;
    onClose: () => void;
    activity: Activity | null;
}

export function ActivityDetailDialog({ isOpen, onClose, activity }: ActivityDetailDialogProps) {
    if (!isOpen || !activity) return null;

    const formatDate = (dateString?: string) => {
        if (!dateString) return "";
        return new Intl.DateTimeFormat('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(dateString));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-500">
            <div className="w-full max-w-2xl rounded-[40px] bg-white p-12 shadow-2xl shadow-blue-900/10 border border-zinc-100 animate-in zoom-in-95 duration-500">
                <div className="flex items-center justify-between mb-10">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <Info size={24} className="text-blue-500" />
                            <h2 className="text-4xl font-black tracking-tighter text-zinc-900 uppercase">
                                Transmission Intel
                            </h2>
                        </div>
                        <p className="text-sm text-zinc-500 font-bold uppercase tracking-widest opacity-60">Complete Activity Breakdown</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-2xl p-4 text-zinc-400 hover:bg-zinc-50 hover:text-zinc-900 transition-all border border-transparent hover:border-zinc-100"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-10">
                    {/* Note Content */}
                    <div className="rounded-[32px] bg-zinc-50/50 p-8 border border-zinc-100 shadow-inner group">
                        <div className="flex items-center gap-3 mb-6">
                            <FileText size={18} className="text-zinc-400" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Tactical Summary</span>
                        </div>
                        <p className="text-2xl font-black text-zinc-900 tracking-tight italic leading-relaxed">
                            "{activity.note}"
                        </p>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-8 px-2">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                                <Target size={14} /> Intelligence Target
                            </label>
                            <p className="text-lg font-black text-zinc-900 tracking-tighter uppercase">
                                {activity.lead?.name || "Unassigned Target"}
                            </p>
                            <p className="text-xs font-bold text-zinc-400 lowercase italic">{activity.lead?.email || "No intelligence target email"}</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                                <User size={14} /> Operative
                            </label>
                            <p className="text-lg font-black text-zinc-900 tracking-tighter uppercase">
                                {activity.user?.name || "System Automated"}
                            </p>
                            <p className="text-xs font-bold text-zinc-400 lowercase italic">{activity.user?.email || "System intelligence source"}</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                                <Info size={14} /> Channel Type
                            </label>
                            <p className="text-lg font-black text-zinc-900 tracking-tighter uppercase">
                                {activity.type}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                                <Clock size={14} /> Logged At
                            </label>
                            <p className="text-sm font-black text-zinc-900 tracking-tight">
                                {formatDate(activity.created_at)}
                            </p>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-zinc-50 flex justify-end">
                        <button
                            onClick={onClose}
                            className="h-16 px-12 rounded-[24px] bg-blue-600 text-xs font-black uppercase tracking-widest text-white shadow-2xl shadow-blue-600/30 hover:-translate-y-1 transition-all active:scale-95 hover:bg-blue-700"
                        >
                            Close Intel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
