'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  User, 
  FileText, 
  Mail, 
  CreditCard, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';
import { useTokens } from '@/context/TokenContext';
import { useAuth } from '@/context/AuthContext';
import { Sparkles } from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();
  const { tokens, maxTokens, openModal } = useTokens();
  const { logout } = useAuth();

  const navItems = [
    { name: t('dashboard'), href: '/dashboard', icon: LayoutDashboard },
    { name: t('profile'), href: '/profile', icon: User },
    { name: t('templates'), href: '/templates', icon: FileText },
    { name: t('coverLetter'), href: '/cover-letter', icon: Mail },
    { name: t('subscribe'), href: '/subscribe', icon: CreditCard },
    { name: t('settings'), href: '/settings', icon: Settings },
  ];

  return (
    <div className="flex flex-col h-full bg-[#E0EFFF] text-[#1E293B] w-[260px] p-4 font-sans select-none">
      <Link href="/" className="flex items-center space-x-2 px-4 py-6 mb-4 hover:opacity-80 transition-opacity">
        <span className="text-[#1062FE] text-2xl font-bold tracking-tight">myeasyresume</span>
      </Link>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname === '/' && item.href === '/dashboard');
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200",
                isActive 
                  ? "bg-white text-[#1062FE] shadow-sm font-semibold" 
                  : "text-slate-600 hover:bg-white/50 hover:text-[#1062FE] font-medium"
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* AI Token Tracker */}
      <div 
        onClick={openModal}
        className="mb-4 bg-white/70 hover:bg-white border border-blue-100/50 rounded-2xl p-4 cursor-pointer hover:shadow-sm hover:scale-[1.01] active:scale-[0.99] transition-all group"
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Jetons IA</span>
          <span className="text-[11px] font-extrabold text-[#1062FE] flex items-center gap-1 group-hover:scale-105 transition-transform">
            <Sparkles className="w-3.5 h-3.5 text-[#1062FE] animate-pulse" />
            {tokens} / {maxTokens}
          </span>
        </div>
        <div className="h-1.5 w-full bg-blue-50 rounded-full overflow-hidden mb-2">
          <div 
            className="h-full bg-[#1062FE] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.min((tokens / maxTokens) * 100, 100)}%` }}
          />
        </div>
        <p className="text-[9px] text-[#1062FE]/80 font-bold uppercase tracking-wider text-center group-hover:text-blue-700 transition-colors">
          + {t('copiedSuccess') === 'Copié !' ? "Recharger jetons" : "Refill tokens"}
        </p>
      </div>

      <div className="mt-auto">
        <button 
          onClick={async () => {
            await logout();
            router.push('/login');
          }}
          className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-slate-600 hover:bg-white/50 hover:text-red-500 transition-all font-medium"
        >
          <LogOut className="w-5 h-5" />
          <span>{t('logout')}</span>
        </button>
      </div>
    </div>
  );
}
