"use client";

import { Activity } from "@/lib/services/activity-service";
import { 
    Phone, 
    Mail, 
    Users, 
    FileText, 
    Trash2, 
    User,
    Target,
    Clock
} from "lucide-react";

interface ActivityTimelineProps {
    activities: Activity[];
    onDelete: (id: string) => void;
}

const typeConfig: Record<string, { icon: any, color: string, label: string }> = {
    call: { icon: Phone, color: "bg-blue-500", label: "Phone Call" },
    email: { icon: Mail, color: "bg-emerald-500", label: "Email Sent" },
    meeting: { icon: Users, color: "bg-purple-500", label: "Meeting" },
    note: { icon: FileText, color: "bg-zinc-500", label: "Internal Note" },
};

export function ActivityTimeline({ activities, onDelete }: ActivityTimelineProps) {
    const formatDate = (dateString?: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    return (
        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-px before:bg-gradient-to-b before:from-transparent before:via-zinc-200 before:to-transparent">
            {activities.map((activity, index) => {
                const config = typeConfig[activity.type] || typeConfig.note;
                const Icon = config.icon;

                return (
                    <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                        {/* Dot */}
                        <div className="flex items-center justify-center w-12 h-12 rounded-[18px] border-4 border-white bg-zinc-50 text-zinc-400 shadow-xl md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-all group-hover:bg-blue-600 group-hover:text-white group-hover:rotate-6">
                            <Icon size={18} className="transition-transform" />
                        </div>

                        {/* Card */}
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-8 rounded-[40px] bg-white border border-zinc-100 shadow-2xl shadow-zinc-200/40 transition-all hover:-translate-y-2">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <span className={`px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-lg ${config.color} shadow-${config.color.split('-')[1]}-200/40`}>
                                        {config.label}
                                    </span>
                                    <div className="flex items-center gap-2 text-zinc-300">
                                        <Clock size={12} className="opacity-40" />
                                        <time className="text-[10px] font-black uppercase tracking-widest">
                                            {formatDate(activity.created_at)}
                                        </time>
                                    </div>
                                </div>
                                <button
                                    onClick={() => activity.id && confirm("Erase this activity record?") && onDelete(activity.id)}
                                    className="p-3 rounded-2xl text-zinc-300 hover:text-white hover:bg-red-500 transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {activity.note && (
                                    <p className="text-zinc-900 font-black text-xl tracking-tighter leading-tight italic">
                                        "{activity.note}"
                                    </p>
                                )}

                                <div className="flex flex-wrap gap-6 pt-6 border-t border-zinc-50">
                                    {activity.lead && (
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                <Target size={14} className="opacity-40" />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                                                {activity.lead.name}
                                            </span>
                                        </div>
                                    )}
                                    {activity.user && (
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-100 group-hover:bg-zinc-900 group-hover:text-white transition-all">
                                                <User size={14} className="opacity-40" />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                                                {activity.user.name}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

            {activities.length === 0 && (
                <div className="flex flex-col items-center justify-center py-32 text-center">
                    <div className="w-24 h-24 rounded-[32px] bg-zinc-50 border border-zinc-100 flex items-center justify-center mb-8">
                        <Clock size={40} className="text-zinc-200" />
                    </div>
                    <h3 className="text-2xl font-black tracking-tighter text-zinc-900 uppercase">Silence in the Ranks</h3>
                    <p className="text-zinc-400 font-bold text-[10px] tracking-[0.3em] uppercase opacity-60 mt-2">No activity has been orchestrated yet.</p>
                </div>
            )}
        </div>
    );
}
