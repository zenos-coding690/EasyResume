'use client';

import React, { useEffect, useState } from 'react';
import { Bell, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function NotificationBell() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    fetchNotifications();

    // Optionally set up real-time listener here, but polling or fetch-on-mount is okay for now
    const channel = supabase
      .channel('public:user_notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setNotifications((prev) => [payload.new, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('user_notifications')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_read', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_notifications')
        .update({ is_read: true })
        .eq('id', id);

      if (error) throw error;
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative p-2 rounded-full hover:bg-slate-100 transition-colors focus:outline-none">
        <Bell className="w-5 h-5 text-slate-600" />
        {notifications.length > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-2 rounded-xl border-slate-100 shadow-xl z-50 bg-white">
        <div className="px-2 py-2 mb-2 border-b border-slate-50 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
          <span className="text-xs font-semibold text-slate-400">{notifications.length} nouvelle(s)</span>
        </div>
        
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-sm">
            Aucune nouvelle notification.
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
            {notifications.map((notif) => (
              <DropdownMenuItem 
                key={notif.id} 
                className="flex flex-col items-start p-3 bg-blue-50/50 hover:bg-blue-50 rounded-lg cursor-default focus:bg-blue-50 transition-colors"
                onSelect={(e) => e.preventDefault()}
              >
                <div className="flex justify-between items-start w-full gap-2">
                  <div className="text-sm text-slate-700 whitespace-pre-wrap flex-1 leading-relaxed">
                    <strong className="block text-[#1062FE] text-xs uppercase mb-1">Message de l'équipe</strong>
                    {notif.message}
                  </div>
                </div>
                <div className="flex items-center justify-between w-full mt-3">
                  <span className="text-[10px] text-slate-400 font-medium">
                    {new Date(notif.created_at).toLocaleDateString('fr-FR')}
                  </span>
                  <button 
                    onClick={() => markAsRead(notif.id)}
                    className="text-xs font-bold text-[#1062FE] hover:text-blue-700 flex items-center bg-white px-2 py-1 rounded-md shadow-sm border border-blue-100"
                  >
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Lu
                  </button>
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
