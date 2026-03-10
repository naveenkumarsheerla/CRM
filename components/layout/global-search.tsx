"use client";

import { useState, useEffect, useRef } from "react";
import { Search, User, Briefcase, CheckSquare, Users, Loader2 } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import Link from "next/link";

interface SearchResult {
    id: string;
    name?: string;
    email?: string;
    title?: string;
    status?: string;
    amount?: number;
    stage?: string;
    role?: string;
}

interface SearchResults {
    leads: SearchResult[];
    deals: SearchResult[];
    tasks: SearchResult[];
    users: SearchResult[];
}

export function GlobalSearch() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResults | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const debouncedQuery = useDebounce(query, 300);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const performSearch = async () => {
            if (debouncedQuery.length < 2) {
                setResults(null);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                // Get token from localStorage (stored by AuthContext)
                const savedUser = localStorage.getItem("crm-user");
                const token = savedUser ? JSON.parse(savedUser).token : null;

                const response = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`Search failed with status: ${response.status}`);
                }
                const data = await response.json();
                setResults(data);
                setIsOpen(true);
            } catch (error) {
                console.error("Search error:", error);
                setResults(null);
            } finally {
                setIsLoading(false);
            }
        };

        performSearch();
    }, [debouncedQuery]);

    const hasResults = !!results && (
        (results.leads?.length || 0) > 0 || 
        (results.deals?.length || 0) > 0 || 
        (results.tasks?.length || 0) > 0 || 
        (results.users?.length || 0) > 0
    );

    return (
        <div className="relative w-96" ref={searchRef}>
            <div className="relative">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${isLoading ? 'text-blue-500' : 'text-zinc-400'}`} size={18} />
                <input
                    type="text"
                    placeholder="Search leads, deals, or team members..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => query.length >= 2 && setIsOpen(true)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-full py-2 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all"
                />
                {isLoading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Loader2 className="animate-spin text-blue-500" size={16} />
                    </div>
                )}
            </div>

            {isOpen && (query.length >= 2) && (
                <div className="absolute top-full mt-2 w-full bg-white/90 backdrop-blur-xl border border-zinc-200 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="max-h-[400px] overflow-y-auto p-2 custom-scrollbar">
                        {!hasResults && !isLoading ? (
                            <div className="p-8 text-center">
                                <Search className="mx-auto text-zinc-300 mb-2" size={32} />
                                <p className="text-sm text-zinc-500">No results found for "{query}"</p>
                            </div>
                        ) : (
                            <div className="space-y-4 p-2">
                                {/* Leads */}
                                {results?.leads && results.leads.length > 0 && (
                                    <div>
                                        <h3 className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                                            <User size={12} /> Leads
                                        </h3>
                                        {results.leads.map((lead) => (
                                            <Link 
                                                key={lead.id} 
                                                href={`/leads`}
                                                onClick={() => setIsOpen(false)}
                                                className="flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-100 transition-colors group"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                    <User size={14} />
                                                </div>
                                                <div className="flex-1 overflow-hidden">
                                                    <p className="text-sm font-medium text-zinc-900 truncate">{lead.name}</p>
                                                    <p className="text-xs text-zinc-500 truncate">{lead.email}</p>
                                                </div>
                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-500">
                                                    {lead.status}
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                )}

                                {/* Deals */}
                                {results?.deals && results.deals.length > 0 && (
                                    <div>
                                        <h3 className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                                            <Briefcase size={12} /> Deals
                                        </h3>
                                        {results.deals.map((deal) => (
                                            <Link 
                                                key={deal.id} 
                                                href={`/deals`}
                                                onClick={() => setIsOpen(false)}
                                                className="flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-100 transition-colors group"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                                    <Briefcase size={14} />
                                                </div>
                                                <div className="flex-1 overflow-hidden">
                                                    <p className="text-sm font-medium text-zinc-900 truncate">{deal.title}</p>
                                                    <p className="text-xs text-zinc-500 truncate">{deal.stage}</p>
                                                </div>
                                                <span className="text-xs font-semibold text-emerald-600">
                                                    ${deal.amount?.toLocaleString()}
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                )}

                                {/* Tasks */}
                                {results?.tasks && results.tasks.length > 0 && (
                                    <div>
                                        <h3 className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                                            <CheckSquare size={12} /> Tasks
                                        </h3>
                                        {results.tasks.map((task) => (
                                            <Link 
                                                key={task.id} 
                                                href={`/tasks`}
                                                onClick={() => setIsOpen(false)}
                                                className="flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-100 transition-colors group"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                                                    <CheckSquare size={14} />
                                                </div>
                                                <div className="flex-1 overflow-hidden">
                                                    <p className="text-sm font-medium text-zinc-900 truncate">{task.title}</p>
                                                    <p className="text-xs text-zinc-500 truncate">{task.status}</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}

                                {/* Users */}
                                {results?.users && results.users.length > 0 && (
                                    <div>
                                        <h3 className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                                            <Users size={12} /> Team Members
                                        </h3>
                                        {results.users.map((teamMember) => (
                                            <Link 
                                                key={teamMember.id} 
                                                href={`/users`}
                                                onClick={() => setIsOpen(false)}
                                                className="flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-100 transition-colors group"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                                    <Users size={14} />
                                                </div>
                                                <div className="flex-1 overflow-hidden">
                                                    <p className="text-sm font-medium text-zinc-900 truncate">{teamMember.name}</p>
                                                    <p className="text-xs text-zinc-500 truncate">{teamMember.role}</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
