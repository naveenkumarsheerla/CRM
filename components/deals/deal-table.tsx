"use client";

import { Deal } from "@/lib/services/deal-service";
import { Edit2, Trash2, DollarSign, Tag, Calendar, User as UserIcon } from "lucide-react";

interface DealTableProps {
    deals: Deal[];
    onEdit: (deal: Deal) => void;
    onDelete: (id: string) => void;
}

const stageColors: Record<string, string> = {
    new: "bg-blue-100 text-blue-700",
    negotiation: "bg-amber-100 text-amber-700",
    closed_won: "bg-emerald-100 text-emerald-700",
    closed_lost: "bg-rose-100 text-rose-700",
};

export function DealTable({ deals, onEdit, onDelete }: DealTableProps) {
    return (
        <div className="w-full overflow-hidden rounded-[48px] border border-zinc-200 bg-white shadow-2xl shadow-zinc-200/40 animate-in fade-in duration-700">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-separate border-spacing-0">
                    <thead className="bg-zinc-50/50 text-zinc-400">
                        <tr>
                            <th className="px-8 py-7 font-black uppercase tracking-[0.2em] text-[10px]">Deal Title</th>
                            <th className="px-8 py-7 font-black uppercase tracking-[0.2em] text-[10px]">Value</th>
                            <th className="px-8 py-7 font-black uppercase tracking-[0.2em] text-[10px]">Stage</th>
                            <th className="px-8 py-7 font-black uppercase tracking-[0.2em] text-[10px]">Associated Lead</th>
                            <th className="px-8 py-7 font-black uppercase tracking-[0.2em] text-[10px] text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                        {deals.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-8 py-24 text-center">
                                    <div className="flex flex-col items-center gap-6">
                                        <div className="h-24 w-24 rounded-[32px] bg-zinc-50 flex items-center justify-center border border-zinc-100">
                                            <Tag size={48} className="text-zinc-200" />
                                        </div>
                                        <div>
                                            <p className="font-black text-xl text-zinc-900 tracking-tighter uppercase">Intelligence Gap</p>
                                            <p className="text-zinc-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-1">Awaiting high-value deal ingestion</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            deals.map((deal) => (
                                <tr
                                    key={deal.id}
                                    className="group transition-all hover:bg-zinc-50/80"
                                >
                                    <td className="px-8 py-8">
                                        <div className="flex items-center gap-5">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-[20px] bg-blue-600 text-white font-black shadow-2xl shadow-blue-600/20 transition-all group-hover:scale-110 group-hover:rotate-6">
                                                {deal.title.charAt(0)}
                                            </div>
                                            <div className="space-y-1">
                                                <span className="block font-black text-xl">
                                                    {deal.title}
                                                </span>
                                                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                                                    <Calendar size={12} className="opacity-40" />
                                                    {deal.created_at ? new Date(deal.created_at).toLocaleDateString() : 'Archives Offline'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className="flex items-center gap-2 font-black text-xl text-zinc-900">
                                            <span className="text-zinc-300">$</span>
                                            {deal.amount.toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <span className={`inline-flex items-center gap-3 rounded-2xl px-5 py-2 text-[10px] font-black uppercase tracking-[0.3em] transition-all
                                            ${deal.stage === 'closed_won' ? 'bg-emerald-50 border border-emerald-100 text-emerald-600' :
                                                deal.stage === 'closed_lost' ? 'bg-red-50 border border-red-100 text-red-600' :
                                                    'bg-zinc-50 border border-zinc-100 text-zinc-400 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600'
                                            }`}>
                                            <div className={`h-2 w-2 rounded-full ${deal.stage === 'closed_won' ? 'bg-emerald-500' : deal.stage === 'closed_lost' ? 'bg-red-500' : 'bg-zinc-300 animate-pulse'}`} />
                                            {deal.stage.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-8 py-8">
                                        {deal.lead ? (
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-[10px] font-black text-zinc-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                    {deal.lead.name.charAt(0)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-black text-base text-zinc-900 tracking-tight">{deal.lead.name}</span>
                                                    <span className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">{deal.lead.email}</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">Archives Redacted</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-8 text-right">
                                        <div className="flex justify-end gap-3 opacity-0 transition-all translate-x-4 group-hover:opacity-100 group-hover:translate-x-0">
                                            <button
                                                onClick={() => onEdit(deal)}
                                                className="rounded-[20px] p-4 text-zinc-400 transition-all hover:bg-blue-600 hover:text-white"
                                            >
                                                <Edit2 size={20} />
                                            </button>
                                            <button
                                                onClick={() => deal.id && onDelete(deal.id)}
                                                className="rounded-[20px] p-4 text-red-400 transition-all hover:bg-red-500 hover:text-white"
                                            >
                                                <Trash2 size={20} />
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
