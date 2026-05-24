'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { MessageSquare, Loader2, Calendar, User, Mail, CheckCircle2 } from 'lucide-react';

export default function AdminMessages() {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const { data, error } = await supabase.rpc('admin_get_feedbacks');
      if (error) throw error;
      setFeedbacks(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_feedbacks')
        .update({ is_read: true })
        .eq('id', id);

      if (error) throw error;
      
      // Update local state
      setFeedbacks(prev => 
        prev.map(f => f.id === id ? { ...f, is_read: true } : f)
      );
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Messages Utilisateurs</h1>
          <p className="text-slate-500 mt-1">Gérez les retours et les signalements de vos clients.</p>
        </div>
        <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-sm font-semibold flex items-center border border-blue-100">
          <MessageSquare className="w-4 h-4 mr-2" />
          {feedbacks.length} messages
        </div>
      </div>

      <div className="grid gap-4">
        {feedbacks.length === 0 ? (
          <div className="bg-white rounded-[1.5rem] p-12 text-center border border-slate-100 shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Aucun message</h3>
            <p className="text-slate-500 mt-1">Vous n'avez pas encore reçu de retour utilisateur.</p>
          </div>
        ) : (
          feedbacks.map((msg) => (
            <div 
              key={msg.id} 
              className={`bg-white rounded-[1.5rem] p-6 border shadow-sm transition-all ${msg.is_read ? 'border-slate-100 opacity-75' : 'border-blue-200 ring-4 ring-blue-50'}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${msg.is_read ? 'bg-slate-100 text-slate-400' : 'bg-blue-100 text-blue-600'}`}>
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                      {msg.first_name || 'Utilisateur'} {msg.last_name || ''}
                      {!msg.is_read && <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] uppercase font-bold rounded-full tracking-wider">Nouveau</span>}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mt-1 mb-4">
                      <span className="flex items-center"><Mail className="w-3.5 h-3.5 mr-1.5" /> {msg.email}</span>
                      <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1.5" /> {new Date(msg.created_at).toLocaleString('fr-FR')}</span>
                    </div>
                    
                    <div className="bg-slate-50 rounded-xl p-4 text-slate-700 whitespace-pre-wrap text-sm border border-slate-100 leading-relaxed">
                      {msg.message}
                    </div>
                  </div>
                </div>
                
                {!msg.is_read && (
                  <button 
                    onClick={() => markAsRead(msg.id)}
                    className="shrink-0 flex items-center px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg text-sm font-semibold transition-colors border border-slate-200"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Marquer lu
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
