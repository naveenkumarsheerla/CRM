"use client";

import { useState } from "react";
import { 
    Pencil, 
    Trash2, 
    CheckCircle2, 
    Clock, 
    AlertCircle,
    User,
    Target
} from "lucide-react";
import { Task } from "@/lib/services/task-service";
import { Lead } from "@/lib/services/lead-service";

interface TaskTableProps {
    tasks: Task[];
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
}

export function TaskTable({ tasks, onEdit, onDelete }: TaskTableProps) {

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "completed":
                return <CheckCircle2 className="text-emerald-500" size={18} />;
            case "in-progress":
                return <Clock className="text-amber-500" size={18} />;
            default:
                return <AlertCircle className="text-zinc-400" size={18} />;
        }
    };

    const formatDate = (dateString?: string | null) => {
        if (!dateString) return "No date";
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="w-full overflow-hidden rounded-[40px] border border-zinc-200 bg-white shadow-2xl shadow-zinc-200/40 animate-in fade-in duration-500">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-0">
                    <thead className="bg-zinc-50/50 text-zinc-400">
                        <tr>
                            <th className="px-8 py-7 font-black  tracking-[0.2em] text-[10px]">Task</th>
                            <th className="px-8 py-7 font-black  tracking-[0.2em] text-[10px]">Lead</th>
                            <th className="px-8 py-7 font-black  tracking-[0.2em] text-[10px]">Deadline</th>
                            <th className="px-8 py-7 font-black  tracking-[0.2em] text-[10px]">Status</th>
                            <th className="px-8 py-7 font-black  tracking-[0.2em] text-[10px]">Assignee</th>
                            <th className="px-8 py-7 text-right"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                    {tasks.map((task) => (
                        <tr key={task.id} className="group hover:bg-zinc-50/80 transition-all">
                            <td className="px-8 py-8">
                                <div className="space-y-2">
                                    <div className="font-black text-zinc-900 text-lg tracking-tighter">
                                        {task.title}
                                    </div>
                                    {task.description && (
                                        <div className="text-sm text-zinc-500 font-medium line-clamp-1 max-w-xs">
                                            {task.description}
                                        </div>
                                    )}
                                </div>
                            </td>
                            <td className="px-8 py-8">
                                {task.lead ? (
                                    <div className="flex items-center gap-3 text-zinc-500">
                                        <Target size={14} className="opacity-40" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{task.lead.name}</span>
                                    </div>
                                ) : (
                                    <span className="text-[10px] text-zinc-300 font-black uppercase tracking-[0.3em]">Isolated Ops</span>
                                )}
                            </td>
                            <td className="px-8 py-8">
                                <span className={`text-sm font-black tracking-tighter ${
                                    task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed'
                                    ? "text-red-600"
                                    : "text-zinc-600"
                                }`}>
                                    {formatDate(task.dueDate)}
                                </span>
                            </td>
                            <td className="px-8 py-8">
                                <div className="flex items-center gap-3">
                                    <div className="translate-y-px">{getStatusIcon(task.status)}</div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                                        {task.status.replace('-', ' ')}
                                    </span>
                                </div>
                            </td>
                            <td className="px-8 py-8">
                                {task.user ? (
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-[14px] bg-zinc-50 flex items-center justify-center text-zinc-400 border border-zinc-100 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-600/20 transition-all">
                                            <User size={16} />
                                        </div>
                                        <span className="text-[10px] font-black  tracking-[0.15em] text-zinc-600">{task.user.name}</span>
                                    </div>
                                ) : (
                                    <span className="text-[10px] text-zinc-300 font-black  tracking-widest">Unorchestrated</span>
                                )}
                            </td>
                            <td className="px-8 py-8 text-right relative">
                                <div className="flex justify-end gap-3 opacity-0 transition-all translate-x-4 group-hover:opacity-100 group-hover:translate-x-0">
                                    <button
                                        onClick={() => onEdit(task)}
                                        className="p-4 rounded-[20px] text-zinc-400 hover:text-white hover:bg-blue-600 transition-all"
                                    >
                                        <Pencil size={20} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (task.id && confirm("Delete this task?")) onDelete(task.id);
                                        }}
                                        className="p-4 rounded-[20px] text-zinc-400 hover:text-white hover:bg-red-500 transition-all"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {tasks.length === 0 && (
                        <tr>
                            <td colSpan={6} className="px-8 py-32 text-center">
                                <div className="space-y-4">
                                    <div className="h-24 w-24 rounded-[32px] bg-zinc-50 border border-zinc-100 flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle2 size={48} className="text-zinc-200" />
                                    </div>
                                    <div className="text-2xl font-black text-zinc-900 tracking-tighter uppercase">Total Sync</div>
                                    <p className="text-zinc-400 font-bold text-[10px] tracking-[0.3em] uppercase opacity-60">Operations clear & ready for deployment</p>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
    );
}
