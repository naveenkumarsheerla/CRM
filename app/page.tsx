"use client";

import { useState, useEffect } from "react";
import {
  Users,
  TrendingUp,
  DollarSign,
  Briefcase,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  Activity as ActivityIcon,
  Plus,
  ChevronRight,
  Calendar,
  Layers,
  Sparkles
} from "lucide-react";
import { userService } from "@/lib/services/user-service";
import { dealService } from "@/lib/services/deal-service";
import { taskService } from "@/lib/services/task-service";
import { activityService } from "@/lib/services/activity-service";
import Link from "next/link";

export default function Home() {
  const [stats, setStats] = useState([
    { name: "Total Users", value: "0", change: "+0%", trend: "neutral", icon: Users, color: "bg-blue-500" },
    { name: "Total Leads", value: "0", change: "+0%", trend: "neutral", icon: TrendingUp, color: "bg-emerald-500" },
    { name: "Total Revenue", value: "$0", change: "+0%", trend: "neutral", icon: DollarSign, color: "bg-amber-500" },
    { name: "Pending Tasks", value: "0", change: "+0%", trend: "neutral", icon: CheckCircle2, color: "bg-purple-500" },
  ]);
  const [activities, setActivities] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [users, deals, allTasks, allActivities] = await Promise.all([
        userService.getUsers(),
        dealService.getDeals(),
        taskService.getTasks(),
        activityService.getActivities()
      ]);

      const wonDeals = deals.filter(d => d.stage === "closed_won");
      const totalRevenue = wonDeals.reduce((sum, d) => sum + d.amount, 0);
      const pendingTasks = allTasks.filter(t => t.status !== "completed");

      setStats([
        { 
          name: "Total Users", 
          value: users.length.toString(), 
          change: "Total registered", 
          trend: "neutral", 
          icon: Users, 
          color: "bg-blue-500" 
        },
        { 
          name: "Active Deals", 
          value: deals.length.toString(), 
          change: "In the pipeline", 
          trend: "up", 
          icon: TrendingUp, 
          color: "bg-emerald-500" 
        },
        { 
          name: "Total Revenue", 
          value: `$${totalRevenue.toLocaleString()}`, 
          change: "Closed won", 
          trend: "up", 
          icon: DollarSign, 
          color: "bg-amber-500" 
        },
        { 
          name: "Pending Tasks", 
          value: pendingTasks.length.toString(), 
          change: "Immediate priority", 
          trend: "down", 
          icon: CheckCircle2, 
          color: "bg-purple-500" 
        },
      ]);

      setActivities(allActivities.slice(0, 5));
      setTasks(pendingTasks.slice(0, 5));
    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getTimeAgo = (dateString?: string) => {
    if (!dateString) return "";
    const seconds = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };

  return (
    <div className="mx-auto max-w-7xl space-y-10 animate-in fade-in duration-700 pb-12">
      <div className="flex flex-col gap-2">
        <h1 className="flex items-center gap-3 text-xl font-black tracking-tighter text-zinc-900">
          <Sparkles className="text-blue-500 animate-pulse" size={24} />
          CRM Dashboard
        </h1>
        {/* <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-xs opacity-60">

        </p> */}
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="group relative overflow-hidden p-8 bg-white rounded-[40px] border border-zinc-200 shadow-xl shadow-zinc-200/40 hover:shadow-2xl hover:shadow-zinc-300/40 transition-all hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-8">
              <div className={`p-4 rounded-[22px] ${stat.color} text-white shadow-lg shadow-${stat.color.split('-')[1]}-500/20`}>
                <stat.icon size={24} />
              </div>
              <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full ${stat.color.replace('bg-', 'bg-opacity-10 text-').replace('500', '600')} bg-opacity-10`}>
                {stat.change}
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">{stat.name}</p>
              <p className="text-5xl font-black text-zinc-900 tracking-tighter">{stat.value}</p>
            </div>
            {/* Subtle background icon for depth */}
            <div className="absolute -bottom-6 -right-6 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity text-zinc-900 rotate-12">
                <stat.icon size={120} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-10 lg:grid-cols-12">
        {/* Recent Activity */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-black text-2xl tracking-tighter text-zinc-900 uppercase flex items-center gap-3">
              <ActivityIcon size={24} className="text-zinc-400" />
              Chronicle
            </h3>
            <Link href="/activities" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-blue-600 transition-colors">View All Archive</Link>
          </div>
          
          <div className="p-8 bg-white rounded-[48px] border border-zinc-200 shadow-xl shadow-zinc-200/30 space-y-8 min-h-[400px]">
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                    <Clock size={48} className="text-zinc-100 animate-spin" />
                </div>
            ) : activities.length > 0 ? (
                activities.map((activity, idx) => (
                    <div key={activity.id} className="flex gap-6 group animate-in slide-in-from-bottom-2" style={{ animationDelay: `${idx * 50}ms` }}>
                        <div className="relative">
                            <div className="w-12 h-12 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400 group-hover:scale-110 transition-transform">
                                {activity.type === 'call' && <Clock size={20} />}
                                {activity.type === 'email' && <Clock size={20} />}
                                {activity.type === 'meeting' && <Clock size={20} />}
                                {activity.type === 'note' && <Clock size={20} />}
                            </div>
                            {idx !== activities.length - 1 && (
                                <div className="absolute top-12 left-1/2 -translate-x-px w-0.5 h-8 bg-zinc-100" />
                            )}
                        </div>
                        <div>
                            <p className="text-base font-bold text-zinc-900 leading-relaxed">
                                <span className="text-zinc-400 uppercase text-[10px] font-black tracking-widest block mb-1">{activity.user?.name || "System Orchestrator"}</span>
                                {activity.note || `Logged a ${activity.type} for `}
                                <span className="font-black tracking-tight ml-1 underline decoration-zinc-100 decoration-2 underline-offset-4">{activity.lead?.name}</span>
                            </p>
                            <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest mt-2">{getTimeAgo(activity.created_at)}</p>
                        </div>
                    </div>
                ))
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                    <Layers size={64} className="text-zinc-100 mb-4" />
                    <p className="font-black uppercase tracking-[0.3em] text-[10px]">Awaiting Chronicles...</p>
                </div>
            )}
          </div>
        </div>

        {/* Pending Tasks Sidebar */}
        <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center justify-between px-2">
                <h3 className="font-black text-2xl tracking-tighter text-zinc-900 uppercase flex items-center gap-3">
                    <Plus size={24} className="text-zinc-400" />
                    Stack
                </h3>
                <Link href="/tasks" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-blue-600 transition-colors">View Stack</Link>
            </div>

            <div className="space-y-4">
                {isLoading ? (
                    [1, 2, 3].map(i => <div key={i} className="h-24 w-full bg-zinc-50 rounded-3xl animate-pulse" />)
                ) : tasks.length > 0 ? (
                    tasks.map((task, idx) => (
                        <div 
                            key={task.id} 
                            className="p-6 bg-white rounded-3xl border border-zinc-200 shadow-lg shadow-zinc-200/20 hover:shadow-xl hover:shadow-zinc-300/20 transition-all group animate-in slide-in-from-right-4"
                            style={{ animationDelay: `${idx * 100}ms` }}
                        >
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <h4 className="font-black text-zinc-900 tracking-tight leading-none group-hover:text-blue-600 transition-colors">{task.title}</h4>
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.1em] text-zinc-400">
                                        <Calendar size={12} />
                                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No Deadline"}
                                    </div>
                                </div>
                                <div className="p-2 rounded-xl bg-zinc-50 text-zinc-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                                    <ChevronRight size={16} />
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-12 text-center rounded-[40px] border-4 border-dashed border-zinc-50 opacity-40">
                        <CheckCircle2 size={48} className="mx-auto text-zinc-100 mb-4" />
                        <p className="font-black uppercase tracking-[0.2em] text-[10px]">Stack Empty</p>
                    </div>
                )}

                {/* Dashboard Usage Card */}
                <div className="mt-10 p-8 bg-blue-600 rounded-[48px] shadow-2xl relative overflow-hidden group">
                    <div className="absolute -right-10 -bottom-10 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                        <TrendingUp size={240} className="text-white" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.4em] mb-4">Operational Efficiency</p>
                        <div className="flex items-baseline gap-2 mb-8">
                            <span className="text-6xl font-black text-white tracking-tighter">
                                {isLoading ? "..." : Math.floor((tasks.length / (tasks.length + 1) || 0) * 100)}%
                            </span>
                            <span className="text-white/40 font-bold uppercase text-xs tracking-widest">Load Factor</span>
                        </div>
                        <Link href="/leads" className="inline-flex w-full items-center justify-center py-4 bg-white text-blue-600 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-zinc-100 transition-all shadow-xl shadow-blue-900/20">
                             Expand Territory
                        </Link>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
