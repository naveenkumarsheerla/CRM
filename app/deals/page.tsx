"use client";

import { useState, useEffect } from "react";
import { Plus, Tag, RefreshCw, AlertCircle, Search, Filter, Briefcase } from "lucide-react";
import { getDealsAction, createDealAction, updateDealAction, deleteDealAction } from "./actions";
import { getLeadsAction } from "../leads/actions";
import { DealTable } from "@/components/deals/deal-table";
import { DealDialog } from "@/components/deals/deal-dialog";
import { Deal } from "@/lib/services/deal-service";

export default function DealsPage() {
    const [deals, setDeals] = useState<Deal[]>([]);
    const [leads, setLeads] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingDeal, setEditingDeal] = useState<Deal | undefined>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [dealsData, leadsData] = await Promise.all([
                getDealsAction(),
                getLeadsAction()
            ]);
            setDeals(dealsData);
            setLeads(leadsData);
        } catch (err: any) {
            console.error(err);
            setError("Failed to synchronize with the database. Ensure schema is pushed and database is reachable.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateOrUpdate = async (formData: any) => {
        setIsSubmitting(true);
        try {
            if (editingDeal?.id) {
                await updateDealAction(editingDeal.id, formData);
            } else {
                await createDealAction(formData);
            }
            setIsDialogOpen(false);
            setEditingDeal(undefined);
            fetchData();
        } catch (err: any) {
            console.error(err);
            alert("Database Error: " + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (deal: Deal) => {
        setEditingDeal(deal);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you certain you want to purge this record? This action is irreversible.")) return;
        try {
            await deleteDealAction(id);
            fetchData();
        } catch (err: any) {
            console.error(err);
            alert("Deletion Failed: " + err.message);
        }
    };

    const filteredDeals = deals.filter(deal =>
        deal.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="mx-auto max-w-7xl space-y-12 animate-in fade-in duration-700">
            {/* Master Header */}
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between px-2">
                <div className="space-y-4">
                    <h1 className="flex items-center gap-4 text-xl font-black tracking-tighter text-zinc-900">
                        <Tag className="text-blue-500 rotate-12" size={24} />
                        Deals
                    </h1>
                    <p className="text-[10px] font-black tracking-[0.3em] text-zinc-400">
                        Track and manage your sales pipeline
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={fetchData}
                        className="inline-flex h-14 items-center justify-center rounded-[20px] border border-zinc-200 bg-white px-6 text-xs font-black uppercase tracking-widest text-zinc-600 shadow-xl shadow-zinc-200/50 transition-all hover:-translate-y-1 active:scale-95"
                    >
                        <RefreshCw size={18} className={`mr-3 ${isLoading ? 'animate-spin' : ''}`} />
                        Sync
                    </button>
                    <button
                        onClick={() => {
                            setEditingDeal(undefined);
                            setIsDialogOpen(true);
                        }}
                        className="inline-flex h-14 items-center justify-center rounded-[20px] bg-blue-600 px-10 text-xs font-black uppercase tracking-widest text-white shadow-2xl shadow-blue-600/30 transition-all hover:-translate-y-1 active:scale-95 hover:bg-blue-700"
                    >
                        <Plus size={18} className="mr-3" />
                        New Deal
                    </button>
                </div>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center px-2">
                <div className="relative flex-1 group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Scan opportunities..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-[24px] border border-zinc-100 bg-zinc-50/50 pl-14 pr-6 py-5 text-sm font-bold shadow-inner transition-all focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/5"
                    />
                </div>
                {/* <button className="inline-flex h-16 items-center justify-center rounded-[24px] border border-zinc-100 bg-white px-10 text-xs font-black uppercase tracking-widest text-zinc-400 transition-all hover:bg-zinc-900 hover:text-white hover:border-zinc-900 shadow-lg shadow-zinc-100/50">
                    <Filter size={20} className="mr-3 opacity-40 group-hover:opacity-100" />
                    Advanced Intel
                </button> */}
            </div>

            {/* Alerts */}
            {error && (
                <div className="flex items-center gap-4 rounded-[40px] border border-red-200 bg-red-50 p-6 text-red-800 shadow-xl shadow-red-500/10 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400 animate-in zoom-in-95">
                    <AlertCircle size={32} />
                    <div>
                        <p className="font-black uppercase tracking-widest text-xs mb-1">Critical Fault Detected</p>
                        <p className="text-sm font-bold opacity-90">{error}</p>
                    </div>
                </div>
            )}

            {/* Dynamic Content */}
            {isLoading ? (
                <div className="flex h-[500px] flex-col items-center justify-center rounded-[60px] border-4 border-dashed border-zinc-100 bg-white/50 backdrop-blur-3xl dark:border-zinc-900 dark:bg-black/20">
                    <div className="relative">
                        <RefreshCw size={80} className="animate-spin text-zinc-200 dark:text-zinc-800" />
                        <Briefcase size={32} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-zinc-900 dark:text-zinc-50" />
                    </div>
                    <p className="mt-8 text-zinc-400 font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">Syncing Global Pipeline</p>
                </div>
            ) : (
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <DealTable
                        deals={filteredDeals}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </div>
            )}

            <DealDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                title={editingDeal ? "Edit Deal" : "New Deal"}
                leads={leads}
                initialData={editingDeal}
                onSubmit={handleCreateOrUpdate}
                isLoading={isSubmitting}
            />
        </div>
    );
}
