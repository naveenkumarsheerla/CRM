"use client";

import { Lead } from "@/lib/services/lead-service";
import { Edit2, Trash2, Mail, Phone, Target, User as UserIcon } from "lucide-react";

interface LeadTableProps {
    leads: any[]; // Using any for now due to Prisma relation types
    onEdit: (lead: any) => void;
    onDelete: (id: string) => void;
}

const statusColors: Record<string, string> = {
    new: "bg-blue-100 text-blue-700",
    contacted: "bg-purple-100 text-purple-700",
    qualified: "bg-emerald-100 text-emerald-700",
    closed: "bg-zinc-100 text-zinc-700",
};

export function LeadTable({ leads, onEdit, onDelete }: LeadTableProps) {
    return (
        <div className="w-full overflow-hidden rounded-[40px] border border-zinc-200 bg-white shadow-2xl shadow-zinc-200/40 animate-in fade-in duration-500">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-separate border-spacing-0">
                    <thead className="bg-zinc-50/50 text-zinc-400">
                        <tr>
                            <th className="px-8 py-6 font-black uppercase tracking-[0.2em] text-[10px]">Lead Name</th>
                            <th className="px-8 py-6 font-black uppercase tracking-[0.2em] text-[10px]">Portal Identity</th>
                            <th className="px-8 py-6 font-black uppercase tracking-[0.2em] text-[10px]">Company Identity</th>
                            <th className="px-8 py-6 font-black uppercase tracking-[0.2em] text-[10px]">Status</th>
                            <th className="px-8 py-6 font-black uppercase tracking-[0.2em] text-[10px]">Assigned to</th>
                            <th className="px-8 py-6 font-black uppercase tracking-[0.2em] text-[10px] text-right">Operations</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 italic">
                        {leads.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="h-12 w-12 rounded-full bg-zinc-50 flex items-center justify-center">
                                            <UserIcon size={24} className="text-zinc-400" />
                                        </div>
                                        <p className="font-medium">No leads discovered yet</p>
                                        <p className="text-xs">Start your journey by adding a new lead.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            leads.map((lead) => (
                                <tr
                                    key={lead.id}
                                    className="group transition-all hover:bg-zinc-50/80"
                                >
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-50 border border-zinc-100 text-zinc-400 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-600/20 transition-all overflow-hidden relative">
                                                <Target size={20} />
                                            </div>
                                            <span className="font-black text-zinc-900 tracking-tight text-base italic not-italic">
                                                {lead.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3 text-zinc-400 font-bold text-xs  tracking-widest">
                                            <Mail size={14} className="opacity-40" />
                                            {lead.email}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        {lead.phone && (
                                            <div className="flex items-center gap-3 text-zinc-400 font-bold text-xs uppercase tracking-widest">
                                                <Phone size={14} className="opacity-40" />
                                                {lead.phone}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${statusColors[lead.status] || "bg-zinc-100"}`}>
                                            <div className="h-1.5 w-1.5 rounded-full bg-current" />
                                            {lead.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {lead.assignedTo ? (
                                            <div className="flex items-center gap-2 text-zinc-900">
                                                <div className="h-6 w-6 rounded-full bg-zinc-100 flex items-center justify-center text-[10px] font-bold">
                                                    {lead.assignedTo.name.charAt(0)}
                                                </div>
                                                <span className="font-medium text-xs">{lead.assignedTo.name}</span>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-zinc-400 italic font-medium">Unassigned</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-3 opacity-0 transition-all translate-x-4 group-hover:opacity-100 group-hover:translate-x-0">
                                            <button
                                                onClick={() => onEdit(lead)}
                                                className="rounded-2xl p-3 text-zinc-400 transition-all hover:bg-blue-600 hover:text-white"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => lead.id && onDelete(lead.id)}
                                                className="rounded-2xl p-3 text-red-400 transition-all hover:bg-red-500 hover:text-white"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
