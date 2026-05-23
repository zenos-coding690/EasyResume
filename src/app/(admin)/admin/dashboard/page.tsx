"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Users, FileText, FileBadge, Banknote, Loader2 } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase.rpc('admin_get_stats');
      if (error) throw error;
      setStats(data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  const statCards = [
    { name: "Utilisateurs Inscrits", value: stats?.total_users || 0, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { name: "Revenus (XAF)", value: (stats?.total_revenue || 0).toLocaleString(), icon: Banknote, color: "text-emerald-600", bg: "bg-emerald-50" },
    { name: "CV Générés", value: stats?.total_resumes || 0, icon: FileText, color: "text-indigo-600", bg: "bg-indigo-50" },
    { name: "Lettres Générées", value: stats?.total_cover_letters || 0, icon: FileBadge, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Vue d'ensemble</h1>
        <p className="text-slate-500 mt-1">Gérez votre activité et suivez vos statistiques.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${card.bg}`}>
                <Icon className={`w-7 h-7 ${card.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{card.name}</p>
                <h3 className="text-2xl font-bold text-slate-900">{card.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Placeholder for future charts */}
      <div className="mt-12 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm h-96 flex items-center justify-center">
        <p className="text-slate-400 font-medium">Les graphiques d'évolution arriveront bientôt.</p>
      </div>
    </div>
  );
}
