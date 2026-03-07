"use client";

import { useState, useEffect } from "react";
import { User, userService } from "@/lib/services/user-service";
import { UserTable } from "@/components/users/user-table";
import { UserDialog } from "@/components/users/user-dialog";
import { Plus, Users as UsersIcon, RefreshCw, AlertCircle } from "lucide-react";

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | undefined>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await userService.getUsers();
            setUsers(data);
        } catch (err: unknown) {
            console.error(err);
            setError("Failed to fetch users. Check your database connection.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreateOrUpdate = async (formData: Omit<User, "id" | "created_at" | "updated_at">) => {
        setIsSubmitting(true);
        try {
            if (editingUser?.id) {
                await userService.updateUser(editingUser.id, formData);
            } else {
                await userService.createUser(formData);
            }
            setIsDialogOpen(false);
            setEditingUser(undefined);
            fetchUsers();
        } catch (err: unknown) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : String(err);
            alert("Error saving user: " + errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this user?")) return;
        try {
            await userService.deleteUser(id);
            fetchUsers();
        } catch (err: unknown) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : String(err);
            alert("Error deleting user: " + errorMessage);
        }
    };

    return (
        <div className="mx-auto max-w-6xl space-y-12 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between px-2">
                <div>
                    <h1 className="flex items-center gap-4 text-xl font-black text-zinc-900">
                        <UsersIcon className="text-blue-500" size={32} />
                        Users
                    </h1>
                    <p className="mt-2 text-[10px] font-black tracking-[0.3em] text-zinc-400">
                        System Identity & Clearance Management
                    </p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={fetchUsers}
                        className="inline-flex h-14 items-center justify-center rounded-[20px] border border-zinc-200 bg-white px-6 text-xs font-black uppercase tracking-widest text-zinc-600 shadow-xl shadow-zinc-200/50 transition-all hover:-translate-y-1 active:scale-95"
                    >
                        <RefreshCw size={18} className={`mr-3 ${isLoading ? 'animate-spin' : ''}`} />
                        Sync
                    </button>
                    <button
                        onClick={() => {
                            setEditingUser(undefined);
                            setIsDialogOpen(true);
                        }}
                        className="inline-flex h-14 items-center justify-center rounded-[20px] bg-blue-600 px-8 text-xs font-black  tracking-widest text-white shadow-2xl shadow-blue-600/30 transition-all hover:-translate-y-1 active:scale-95 hover:bg-blue-700"
                    >
                        <Plus size={18} className="mr-3" />
                        Add User
                    </button>
                </div>
            </div>

            {/* Error State */}
            {error && (
                <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
                    <AlertCircle size={20} />
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}

            {/* Loading State or Table */}
            {isLoading ? (
                <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-white">
                    <div className="flex flex-col items-center gap-2">
                        <RefreshCw size={24} className="animate-spin text-zinc-400" />
                        <p className="text-sm text-zinc-500">Loading users...</p>
                    </div>
                </div>
            ) : (
                <UserTable
                    users={users}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}

            <UserDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                title={editingUser ? "Edit User" : "Add New User"}
                initialData={editingUser}
                onSubmit={handleCreateOrUpdate}
                isLoading={isSubmitting}
            />
        </div>
    );
}
