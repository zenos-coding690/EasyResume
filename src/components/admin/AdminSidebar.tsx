"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard,
  Settings,
  LogOut,
  ShieldAlert,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const links = [
    { name: 'Tableau de bord', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Utilisateurs', href: '/admin/users', icon: Users },
    { name: 'Comptabilité', href: '/admin/transactions', icon: CreditCard },
    { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
  ];

  return (
    <aside className="w-64 bg-slate-950 text-slate-300 h-screen fixed flex flex-col border-r border-slate-800 shadow-xl z-20">
      <div className="p-6">
        <Link href="/" className="flex items-center space-x-2 text-white">
          <ShieldAlert className="w-8 h-8 text-rose-500" />
          <span className="text-2xl font-bold tracking-tight">Admin<span className="text-rose-500">Panel</span></span>
        </Link>
      </div>

      <nav className="flex-1 px-4 mt-6 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center px-4 py-3 rounded-xl transition-all duration-300 group ${
                isActive 
                  ? 'bg-rose-500/10 text-rose-400 font-semibold border border-rose-500/20' 
                  : 'hover:bg-slate-900 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-rose-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 space-y-2">
        <Link 
          href="/dashboard"
          className="flex items-center px-4 py-3 text-sm font-medium hover:bg-slate-900 hover:text-white rounded-xl transition-colors"
        >
          Retour à l'App
        </Link>
        <button 
          onClick={logout}
          className="w-full flex items-center px-4 py-3 text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
