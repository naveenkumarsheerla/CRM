"use client";

import { User } from "@/lib/services/user-service";
import { Edit2, Trash2, Mail, Shield, User as UserIcon } from "lucide-react";

interface UserTableProps {
    users: User[];
    onEdit: (user: User) => void;
    onDelete: (id: string) => void;
}

export function UserTable({ users, onEdit, onDelete }: UserTableProps) {
    return (
        <div className="overflow-hidden rounded-[40px] border border-zinc-200 bg-white shadow-2xl shadow-zinc-200/40 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-separate border-spacing-0" >
                    <thead className="bg-zinc-50/50">
                        <tr>
                            <th className="px-8 py-6 font-black uppercase tracking-[0.2em] text-[10px]">User</th>
                            <th className="px-8 py-6 font-black uppercase tracking-[0.2em] text-[10px]">Email</th>
                            <th className="px-8 py-6 font-black uppercase tracking-[0.2em] text-[10px]">Role</th>
                            <th className="px-8 py-6 font-black uppercase tracking-[0.2em] text-[10px] text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-zinc-500">
                                    No users found.
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr
                                    key={user.id}
                                    className="group transition-all hover:bg-zinc-50/80"
                                >
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-50 border border-zinc-100 text-zinc-400 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-600/20 transition-all">
                                                <UserIcon size={20} />
                                            </div>
                                            <span className="font-black tracking-tight">
                                                {user.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3 text-zinc-400 font-bold text-xs uppercase tracking-widest">
                                            <Mail size={14} className="opacity-40" />
                                            {user.email}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="inline-flex items-center gap-2 rounded-xl bg-zinc-50 border border-zinc-100 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
                                            <Shield size={12} className="opacity-40" />
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-3 opacity-0 transition-all translate-x-4 group-hover:opacity-100 group-hover:translate-x-0">
                                            <button
                                                onClick={() => onEdit(user)}
                                                className="rounded-2xl p-3 text-zinc-400 transition-all hover:bg-blue-600 hover:text-white"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => user.id && onDelete(user.id)}
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
