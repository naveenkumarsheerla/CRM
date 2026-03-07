"use client";

import { useState, useEffect } from "react";
import { User, userService } from "@/lib/services/user-service";
import { leadService } from "@/lib/services/lead-service";
import { ActivityTable } from "@/components/activities/activity-table";
import { ActivityDialog } from "@/components/activities/activity-dialog";
import { ActivityDetailDialog } from "@/components/activities/activity-detail-dialog";
import { Plus, Activity as ActivityIcon, RefreshCw, AlertCircle, Search, Filter } from "lucide-react";
import { getActivitiesAction, createActivityAction, deleteActivityAction } from "./actions";
import { Activity } from "@/lib/services/activity-service";

export default function ActivitiesPage() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [leads, setLeads] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [activitiesData, usersData, leadsData] = await Promise.all([
                getActivitiesAction(),
                userService.getUsers(),
                leadService.getLeads()
            ]);
            setActivities(activitiesData);
            setUsers(usersData);
            setLeads(leadsData);
        } catch (err: any) {
            console.error(err);
            setError("Failed to synchronize with the database. Check database connectivity.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreate = async (formData: any) => {
        setIsSubmitting(true);
        try {
            await createActivityAction(formData);
            setIsDialogOpen(false);
            fetchData();
        } catch (err: any) {
            console.error(err);
            alert("Database Error: " + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteActivityAction(id);
            if (selectedActivity?.id === id) {
                setIsDetailOpen(false);
                setSelectedActivity(null);
            }
            fetchData();
        } catch (err: any) {
            console.error(err);
            alert("Deletion Failed: " + err.message);
        }
    };

    const filteredActivities = activities.filter(activity =>
        (activity.note && activity.note.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (activity.type.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (activity.lead?.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleViewDetail = (activity: Activity) => {
        setSelectedActivity(activity);
        setIsDetailOpen(true);
    };

    return (
        <div className="mx-auto max-w-[1400px] space-y-12 animate-in fade-in duration-700 pb-20 px-4">
            {/* Header Section */}
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between px-2">
                <div>
                    <h1 className="flex items-center gap-4 text-xl font-black tracking-tighter text-zinc-900">
                        <ActivityIcon className="text-blue-500" size={24} />
                        Activities
                    </h1>
                    <p className="mt-2 text-[10px] font-black tracking-[0.3em] text-zinc-400">
                        Activity Management
                    </p>
                </div>
                <div className="flex flex-wrap gap-4">
                    <button
                        onClick={fetchData}
                        className="inline-flex h-14 items-center justify-center rounded-[20px] border border-zinc-200 bg-white px-6 text-xs font-black tracking-widest text-zinc-600 shadow-xl shadow-zinc-200/50 transition-all hover:-translate-y-1 active:scale-95"
                    >
                        <RefreshCw size={18} className={`mr-3 ${isLoading ? 'animate-spin' : ''}`} />
                        Sync
                    </button>
                    <button
                        onClick={() => {
                            setIsDialogOpen(true);
                        }}
                        className="inline-flex h-14 items-center justify-center rounded-[20px] bg-blue-600 px-10 text-xs font-black tracking-widest text-white shadow-2xl shadow-blue-600/30 transition-all hover:-translate-y-1 active:scale-95 hover:bg-blue-700"
                    >
                        <Plus size={18} className="mr-3" />
                        New Activity
                    </button>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center px-2">
                <div className="relative flex-1 group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Scan historical records..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-[24px] border border-zinc-100 bg-zinc-50/50 pl-14 pr-6 py-5 text-sm font-bold shadow-inner transition-all focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/5"
                    />
                </div>
                {/* <button className="inline-flex h-16 items-center justify-center rounded-[24px] border border-zinc-100 bg-white px-10 text-xs font-black uppercase tracking-widest text-zinc-400 transition-all hover:bg-zinc-900 hover:text-white hover:border-zinc-900 shadow-lg shadow-zinc-100/50 group">
                    <Filter size={20} className="mr-3 opacity-40 group-hover:opacity-100" />
                    Refine Stream
                </button> */}
            </div>

            {/* Error Message */}
            {error && (
                <div className="flex items-center gap-4 rounded-3xl border border-red-200 bg-red-50 p-6 text-red-800 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400 animate-in slide-in-from-top-4">
                    <AlertCircle size={28} />
                    <p className="text-sm font-black uppercase tracking-widest">{error}</p>
                </div>
            )}

            {/* Main Content Area */}
            {isLoading ? (
                <div className="flex h-96 flex-col items-center justify-center rounded-[48px] border-4 border-dashed border-zinc-100 bg-white/50 backdrop-blur-md dark:border-zinc-900/50 dark:bg-black/20">
                    <RefreshCw size={64} className="animate-spin text-zinc-200 dark:text-zinc-800" />
                    <p className="mt-6 text-zinc-400 font-black uppercase tracking-[0.3em] text-[10px]">Retrieving Chronicles...</p>
                </div>
            ) : (
                <ActivityTable
                    activities={filteredActivities}
                    onView={handleViewDetail}
                    onDelete={handleDelete}
                />
            )}

            <ActivityDetailDialog
                isOpen={isDetailOpen}
                onClose={() => {
                    setIsDetailOpen(false);
                    setSelectedActivity(null);
                }}
                activity={selectedActivity}
            />

            <ActivityDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                title="Log Execution"
                users={users}
                leads={leads}
                onSubmit={handleCreate}
                isLoading={isSubmitting}
            />
        </div>
    );
}
