"use client";

import { useState, useEffect } from "react";
import { User, userService } from "@/lib/services/user-service";
import { leadService } from "@/lib/services/lead-service";
import { TaskTable } from "@/components/tasks/task-table";
import { TaskDialog } from "@/components/tasks/task-dialog";
import { Plus, CheckCircle2, RefreshCw, AlertCircle, Search, Filter } from "lucide-react";
import { getTasksAction, createTaskAction, updateTaskAction, deleteTaskAction } from "./actions";
import { Task } from "@/lib/services/task-service";

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [leads, setLeads] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | undefined>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [tasksData, usersData, leadsData] = await Promise.all([
                getTasksAction(),
                userService.getUsers(),
                leadService.getLeads()
            ]);
            setTasks(tasksData);
            setUsers(usersData);
            setLeads(leadsData);
        } catch (err: any) {
            console.error(err);
            setError("Failed to synchronize with the database. Ensure Prisma is generated and the database is reachable.");
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
            if (editingTask?.id) {
                await updateTaskAction(editingTask.id, formData);
            } else {
                await createTaskAction(formData);
            }
            setIsDialogOpen(false);
            setEditingTask(undefined);
            fetchData();
        } catch (err: any) {
            console.error(err);
            alert("Database Error: " + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (task: Task) => {
        setEditingTask(task);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteTaskAction(id);
            fetchData();
        } catch (err: any) {
            console.error(err);
            alert("Deletion Failed: " + err.message);
        }
    };

    const filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="mx-auto max-w-7xl space-y-12 animate-in fade-in duration-700 pb-12">
            {/* Header Section */}
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between px-2">
                <div>
                    <h1 className="flex items-center gap-4 text-xl font-black tracking-tighter text-zinc-900 uppercase">
                        <CheckCircle2 className="text-blue-500" size={32} />
                        Tasks
                    </h1>
                    <p className="mt-2 text-[10px] font-black tracking-[0.3em] text-zinc-400">
                        Manage your tasks
                    </p>
                </div>
                <div className="flex flex-wrap gap-4">
                    <button
                        onClick={fetchData}
                        className="inline-flex h-14 items-center justify-center rounded-[20px] border border-zinc-200 bg-white px-6 text-xs font-black uppercase tracking-widest text-zinc-600 shadow-xl shadow-zinc-200/50 transition-all hover:-translate-y-1 active:scale-95"
                    >
                        <RefreshCw size={18} className={`mr-3 ${isLoading ? 'animate-spin' : ''}`} />
                        Sync
                    </button>
                    <button
                        onClick={() => {
                            setEditingTask(undefined);
                            setIsDialogOpen(true);
                        }}
                        className="inline-flex h-14 items-center justify-center rounded-[20px] bg-blue-600 px-8 text-xs font-black uppercase tracking-widest text-white shadow-2xl shadow-blue-600/30 transition-all hover:-translate-y-1 active:scale-95 hover:bg-blue-700"
                    >
                        <Plus size={18} className="mr-3" />
                        New Task
                    </button>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center px-2">
                <div className="relative flex-1 group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search tasks by title or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-[24px] border border-zinc-100 bg-zinc-50/50 pl-14 pr-6 py-5 text-sm font-bold shadow-inner transition-all focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/5"
                    />
                </div>
                {/* <button className="inline-flex h-16 items-center justify-center rounded-[24px] border border-zinc-100 bg-white px-10 text-xs font-black uppercase tracking-widest text-zinc-400 transition-all hover:bg-zinc-900 hover:text-white hover:border-zinc-900 shadow-lg shadow-zinc-100/50">
                    <Filter size={20} className="mr-3 opacity-40 group-hover:opacity-100" />
                    Advanced Filters
                </button> */}
            </div>

            {/* Error Message */}
            {error && (
                <div className="flex items-center gap-4 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400 animate-in slide-in-from-top-2">
                    <AlertCircle size={24} />
                    <p className="text-sm font-bold">{error}</p>
                </div>
            )}

            {/* Main Content Area */}
            {isLoading ? (
                <div className="flex h-96 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 bg-white/50 backdrop-blur-sm dark:border-zinc-800 dark:bg-black/20">
                    <RefreshCw size={48} className="animate-spin text-zinc-200 dark:text-zinc-800" />
                    <p className="mt-4 text-zinc-400 font-black uppercase tracking-widest text-xs">Loading Workspace...</p>
                </div>
            ) : (
                <TaskTable
                    tasks={filteredTasks}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}

            <TaskDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                title={editingTask ? "Edit Task" : "New Task"}
                users={users}
                leads={leads}
                initialData={editingTask}
                onSubmit={handleCreateOrUpdate}
                isLoading={isSubmitting}
            />
        </div>
    );
}
