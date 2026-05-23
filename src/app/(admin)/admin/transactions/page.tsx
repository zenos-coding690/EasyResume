"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Search, Loader2, Calendar, CheckCircle2, XCircle, TrendingUp } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase.rpc('admin_get_transactions');
      if (error) throw error;
      setTransactions(data || []);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(t => 
    t.first_name?.toLowerCase().includes(search.toLowerCase()) ||
    t.last_name?.toLowerCase().includes(search.toLowerCase()) ||
    t.pack_name?.toLowerCase().includes(search.toLowerCase())
  );

  // Accounting calculations
  const now = new Date();
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  let weekTotal = 0;
  let monthTotal = 0;
  let yearTotal = 0;

  transactions.forEach(t => {
    if (t.status === 'successful') {
      const tDate = new Date(t.created_at);
      if (tDate >= startOfWeek) weekTotal += t.amount;
      if (tDate >= startOfMonth) monthTotal += t.amount;
      if (tDate >= startOfYear) yearTotal += t.amount;
    }
  });

  // Data for the chart
  const chartData = [...transactions]
    .filter(t => t.status === 'successful')
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .reduce((acc: any[], t) => {
      const dateStr = new Date(t.created_at).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' });
      const existing = acc.find(item => item.date === dateStr);
      if (existing) {
        existing.amount += t.amount;
      } else {
        acc.push({ date: dateStr, amount: t.amount });
      }
      return acc;
    }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Comptabilité</h1>
        <p className="text-slate-500 mt-1">Historique des transactions Notch Pay et revenus.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
            <Calendar className="w-6 h-6 text-green-600" />
          </div>
          <div>
             <p className="text-sm text-slate-500 font-medium">Cette Semaine</p>
             <h3 className="text-xl font-bold text-slate-900">{weekTotal.toLocaleString()} XAF</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
            <Calendar className="w-6 h-6 text-blue-600" />
          </div>
          <div>
             <p className="text-sm text-slate-500 font-medium">Ce Mois</p>
             <h3 className="text-xl font-bold text-slate-900">{monthTotal.toLocaleString()} XAF</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
            <Calendar className="w-6 h-6 text-purple-600" />
          </div>
          <div>
             <p className="text-sm text-slate-500 font-medium">Cette Année</p>
             <h3 className="text-xl font-bold text-slate-900">{yearTotal.toLocaleString()} XAF</h3>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8">
        <div className="flex items-center space-x-2 mb-6">
          <TrendingUp className="w-5 h-5 text-slate-500" />
          <h2 className="text-lg font-bold text-slate-800">Évolution des revenus</h2>
        </div>
        <div className="h-[300px] w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1062FE" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#1062FE" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#94a3b8' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                  tickFormatter={(val) => `${val.toLocaleString()}`}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                  formatter={(value: number) => [`${value.toLocaleString()} XAF`, 'Revenus']}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#1062FE" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorAmount)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400">
              Aucune donnée disponible pour le graphique.
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-slate-800">Historique</h2>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1062FE] focus:border-transparent outline-none w-full sm:w-64"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">ID Transaction</th>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Achat</th>
                  <th className="px-6 py-4">Montant</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">
                      {t.id.substring(0, 13)}...
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{t.first_name} {t.last_name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md text-xs">{t.pack_name}</span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-700">
                      {t.amount} {t.currency}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(t.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {t.status === 'successful' ? (
                        <div className="inline-flex items-center text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md text-xs font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Payé
                        </div>
                      ) : (
                        <div className="inline-flex items-center text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md text-xs font-semibold">
                          <XCircle className="w-3.5 h-3.5 mr-1" /> Échoué
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredTransactions.length === 0 && (
            <div className="p-8 text-center text-slate-500">Aucune transaction trouvée.</div>
          )}
        </div>
      )}
    </div>
  );
}
