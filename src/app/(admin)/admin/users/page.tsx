"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Search, Edit2, Loader2, Save, X } from "lucide-react";

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Modal State
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editPlan, setEditPlan] = useState("");
  const [editBalance, setEditBalance] = useState(0);
  const [editDownloads, setEditDownloads] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.rpc('admin_get_users');
      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (user: any) => {
    setEditingUser(user);
    setEditPlan(user.plan);
    setEditBalance(user.balance || 0);
    setEditDownloads(user.download_credits || 0);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase.rpc('admin_update_user', {
        target_user_id: editingUser.id,
        new_plan: editPlan,
        new_balance: editBalance,
        new_downloads: editDownloads
      });
      if (error) throw error;
      
      // Update local state
      setUsers(users.map(u => 
        u.id === editingUser.id 
          ? { ...u, plan: editPlan, balance: editBalance, download_credits: editDownloads }
          : u
      ));
      setEditingUser(null);
    } catch (err) {
      console.error("Error saving user:", err);
      alert("Erreur lors de la sauvegarde.");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.email?.toLowerCase().includes(search.toLowerCase()) || 
    u.first_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.last_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Utilisateurs</h1>
          <p className="text-slate-500 mt-1">Gérez les comptes, les forfaits et les crédits.</p>
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-full sm:w-64"
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
                  <th className="px-6 py-4">Utilisateur</th>
                  <th className="px-6 py-4">Rôle</th>
                  <th className="px-6 py-4">Forfait</th>
                  <th className="px-6 py-4">Jetons IA</th>
                  <th className="px-6 py-4">Téléchargements</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{user.first_name} {user.last_name}</div>
                      <div className="text-slate-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${user.role === 'admin' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-700">{user.plan}</span>
                    </td>
                    <td className="px-6 py-4 font-mono">{user.balance || 0}</td>
                    <td className="px-6 py-4 font-mono">{user.download_credits || 0}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleEditClick(user)}
                        className="p-2 text-slate-400 hover:text-[#1062FE] hover:bg-blue-50 rounded-lg transition-colors inline-flex"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredUsers.length === 0 && (
            <div className="p-8 text-center text-slate-500">Aucun utilisateur trouvé.</div>
          )}
        </div>
      )}

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Éditer l'utilisateur</h3>
              <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
                <input type="text" disabled value={editingUser.email} className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Forfait (Plan)</label>
                <input 
                  type="text" 
                  value={editPlan} 
                  onChange={(e) => setEditPlan(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 focus:border-[#1062FE] focus:ring-1 focus:ring-[#1062FE] rounded-lg outline-none" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Jetons IA</label>
                  <input 
                    type="number" 
                    value={editBalance} 
                    onChange={(e) => setEditBalance(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 focus:border-[#1062FE] focus:ring-1 focus:ring-[#1062FE] rounded-lg outline-none font-mono" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Téléchargements</label>
                  <input 
                    type="number" 
                    value={editDownloads} 
                    onChange={(e) => setEditDownloads(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 focus:border-[#1062FE] focus:ring-1 focus:ring-[#1062FE] rounded-lg outline-none font-mono" 
                  />
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
              <button 
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Annuler
              </button>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-[#1062FE] hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors flex items-center disabled:opacity-70"
              >
                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
