"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Lock, Mail, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { loginAction } from "./actions";
import { useAuth } from "@/lib/contexts/auth-context";

export default function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const result = await loginAction(email, password);
            if (result.success && result.user) {
                login(result.user);
                router.push("/");
            } else {
                setError(result.error || "Authentication failed.");
                setIsLoading(false);
            }
        } catch (err) {
            setError("Communication link severed. Retry sequence.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-zinc-100 via-transparent to-transparent">
            <div className="w-full max-w-lg space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                {/* Branding */}
                <div className="text-center space-y-4">
                    <div className="inline-flex h-20 w-20 items-center justify-center rounded-[24px] bg-zinc-900 shadow-2xl shadow-zinc-900/20 transition-transform hover:scale-110 duration-500">
                        <Sparkles size={40} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter text-zinc-900">CRM Core</h1>
                        <p className="text-sm font-bold uppercase tracking-[0.3em] text-zinc-500 opacity-60 mt-2">Operational Command Center</p>
                    </div>
                </div>

                {/* Login Card */}
                <div className="bg-white/70 backdrop-blur-3xl p-10 rounded-[48px] border border-white shadow-2xl shadow-zinc-200/50">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-2">Access Portal Identity</label>
                            <div className="relative group">
                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" size={20} />
                                <input
                                    required
                                    type="email"
                                    placeholder="admin@crm.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full rounded-3xl border border-zinc-100 bg-zinc-50/50 px-14 py-5 text-base font-bold transition-all focus:bg-white focus:border-zinc-900 focus:outline-none focus:ring-4 focus:ring-zinc-900/5"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-2">Secure Keyphrase</label>
                            <div className="relative group">
                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" size={20} />
                                <input
                                    required
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-3xl border border-zinc-100 bg-zinc-50/50 px-14 py-5 text-base font-bold transition-all focus:bg-white focus:border-zinc-900 focus:outline-none focus:ring-4 focus:ring-zinc-900/5"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 animate-in shake duration-300">
                                <AlertCircle size={20} />
                                <p className="text-xs font-bold uppercase tracking-widest">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full h-16 flex items-center justify-center overflow-hidden rounded-3xl bg-zinc-900 font-black text-white shadow-2xl transition-all hover:bg-zinc-800 hover:-translate-y-1 active:scale-95 disabled:opacity-50"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={24} />
                            ) : (
                                <div className="flex items-center gap-3">
                                    <span className="uppercase tracking-[0.2em] text-sm">Initialize Session</span>
                                    <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                                </div>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-loose">
                            Protected by Enterprise Shield<br />
                            v4.2.0-STABLE
                        </p>
                    </div>
                </div>

                <div className="text-center opacity-40">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em]">CRM CORE ORCHESTRATOR</p>
                </div>
            </div>
        </div>
    );
}
