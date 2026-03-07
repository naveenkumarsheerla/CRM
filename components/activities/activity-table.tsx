"use client";

import { Activity } from "@/lib/services/activity-service";
import {
    Phone,
    Mail,
    Users,
    FileText,
    Trash2,
    Eye,
    Clock,
    Target,
    User as UserIcon
} from "lucide-react";

interface ActivityTableProps {
    activities: Activity[];
    onView: (activity: Activity) => void;
    onDelete: (id: string) => void;
}

const typeConfig: Record<string, { icon: any, color: string, label: string }> = {
    call: { icon: Phone, color: "bg-blue-500", label: "Phone Call" },
    email: { icon: Mail, color: "bg-emerald-500", label: "Email Sent" },
    meeting: { icon: Users, color: "bg-purple-500", label: "Meeting" },
    note: { icon: FileText, color: "bg-zinc-500", label: "Internal Note" },
};

export function ActivityTable({ activities, onView, onDelete }: ActivityTableProps) {
    const formatDate = (dateString?: string) => {
        if (!dateString) return "";
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(dateString));
    };

    return (
        <div className="w-full overflow-hidden rounded-[40px] border border-zinc-200 bg-white shadow-2xl shadow-blue-900/5 animate-in fade-in duration-700">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-0">
                    <thead className="bg-zinc-50/30 text-zinc-400">
                        <tr>
                            <th className="px-8 py-6 font-black tracking-[0.25em] text-[10px] w-[250px]">Activity Type</th>
                            <th className="px-8 py-6 font-black tracking-[0.25em] text-[10px] w-[350px]">Activity</th>
                            <th className="px-8 py-6 font-black tracking-[0.25em] text-[10px] w-[350px]">Lead</th>
                            <th className="px-8 py-6 font-black tracking-[0.25em] text-[10px] w-[350px]">Operative</th>
                            <th className="px-8 py-6 font-black tracking-[0.25em] text-[10px] w-[200px]">Timestamp</th>
                            {/* <th className="px-10 py-6 text-right"></th> */}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100/50">
                        {activities.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-10 py-32 text-center">
                                    <div className="flex flex-col items-center gap-6">
                                        <div className="h-24 w-24 rounded-[32px] bg-zinc-50 flex items-center justify-center border border-zinc-100">
                                            <Clock size={40} className="text-zinc-200" />
                                        </div>
                                        <div>
                                            <p className="font-black text-xl text-zinc-900 tracking-tighter uppercase">No Signal Detected</p>
                                            <p className="text-zinc-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-1">Awaiting historical data ingestion</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            activities.map((activity) => {
                                const config = typeConfig[activity.type] || typeConfig.note;
                                const Icon = config.icon;
                                return (
                                    <tr key={activity.id} className="group hover:bg-zinc-50/50 transition-all duration-300">
                                        <td className="px-8 py-7">
                                            <div className="flex items-center gap-5">
                                                <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${config.color} text-white shadow-lg shadow-${config.color.split('-')[1]}-600/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                                                    <Icon size={14} />
                                                </div>
                                                <span className="text-[11px] font-black uppercase tracking-[0.15em] text-zinc-900">
                                                    {config.label}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-7">
                                            <p className="text-sm font-bold text-zinc-600 line-clamp-1 italic tracking-tight opacity-80 decoration-zinc-200 underline-offset-4 group-hover:opacity-100 transition-opacity first-letter:uppercase">
                                                {activity.note}                                           </p>
                                        </td>
                                        <td className="px-8 py-7">
                                            {activity.lead ? (
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center shadow-sm">
                                                        <Target size={16} className="text-zinc-400" />
                                                    </div>
                                                    <span className="text-sm font-bold text-zinc-900 group-hover:text-blue-600 transition-colors capitalize">
                                                        {activity.lead.name}
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-3 opacity-30">
                                                    <div className="h-10 w-10 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center">
                                                        <Target size={16} className="text-zinc-200" />
                                                    </div>
                                                    <span className="text-xs font-bold text-zinc-300 italic">Unassigned</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-8 py-7">
                                            {activity.user ? (
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-xs font-black text-blue-600 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-500 shadow-sm">
                                                        {activity.user.name.charAt(0)}
                                                    </div>
                                                    <span className="text-sm font-bold text-zinc-700 group-hover:text-zinc-900 transition-colors capitalize">
                                                        {activity.user.name.toLowerCase()}
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-3 opacity-30">
                                                    <div className="h-10 w-10 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center">
                                                        <UserIcon size={16} className="text-zinc-200" />
                                                    </div>
                                                    <span className="text-xs font-bold text-zinc-300 italic">System</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-8 py-7">
                                            <div className="flex items-center gap-3 text-zinc-400 whitespace-nowrap">
                                                <Clock size={16} className="opacity-60" />
                                                <span className="text-[11px] font-black uppercase tracking-[0.1em] tabular-nums">
                                                    {formatDate(activity.created_at)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-7 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 transition-all duration-300 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0">
                                                <button
                                                    onClick={() => onView(activity)}
                                                    className="rounded-2xl p-4 text-zinc-400 transition-all hover:bg-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-600/20 active:scale-95"
                                                    title="Inspect Intelligence"
                                                >
                                                    <Eye size={20} />
                                                </button>
                                                <button
                                                    onClick={() => activity.id && confirm("Erase this activity record?") && onDelete(activity.id)}
                                                    className="rounded-2xl p-4 text-zinc-400 hover:bg-red-500 hover:text-white active:scale-95"
                                                    title="Purge Sequence"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
