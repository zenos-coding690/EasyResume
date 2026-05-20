'use client';

import React, { useState } from 'react';
import { 
  Shield, 
  CreditCard, 
  Sliders, 
  Bell, 
  Key, 
  Check, 
  FileText, 
  HelpCircle, 
  DollarSign, 
  Info,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

type SettingsTab = 'security' | 'billing' | 'preferences' | 'notifications';

export default function SettingsPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<SettingsTab>('security');
  
  // Security Tab States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Billing Tab States (Mock Invoices)
  const invoices = [
    { id: "INV-2026-001", date: "15/05/2026", amount: "2 500 FCFA", status: "Payé" },
    { id: "INV-2026-002", date: "15/04/2026", amount: "2 500 FCFA", status: "Payé" }
  ];

  // Preferences Tab States
  const [paperFormat, setPaperFormat] = useState<'A4' | 'Letter'>('A4');
  const [defaultLang, setDefaultLang] = useState<'FR' | 'EN'>('FR');

  // Notifications Tab States
  const [notifyDownloads, setNotifyDownloads] = useState(true);
  const [notifyTemplates, setNotifyTemplates] = useState(false);
  const [notifyTips, setNotifyTips] = useState(true);

  // Password strength checker helper
  const getPasswordStrength = () => {
    if (!newPassword) return { label: "", color: "bg-slate-100", width: "w-0" };
    if (newPassword.length < 5) return { label: "Faible / Weak", color: "bg-red-500", width: "w-1/3" };
    if (newPassword.length < 8) return { label: "Moyen / Medium", color: "bg-amber-500", width: "w-2/3" };
    return { label: "Fort / Strong", color: "bg-emerald-500", width: "w-full" };
  };

  const strength = getPasswordStrength();

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    // Reset passwords
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 select-none">
      
      {/* Title & Header */}
      <ScrollReveal delay={100} duration={500} direction="up">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">{t('settingsTitle')}</h1>
          <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-2xl">{t('settingsSubtitle')}</p>
        </div>
      </ScrollReveal>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ============================================================== */}
        {/* LEFT COLUMN: TABS NAVIGATION                                   */}
        {/* ============================================================== */}
        <div className="col-span-1 lg:col-span-4 space-y-3">
          {[
            { id: 'security', label: t('tabSecurity'), icon: Shield, desc: "Password & account safety" },
            { id: 'billing', label: t('tabBilling'), icon: CreditCard, desc: "Premium invoicing & plans" },
            { id: 'preferences', label: t('tabPreferences'), icon: Sliders, desc: "A4 / Letter defaults & locales" },
            { id: 'notifications', label: t('tabNotifications'), icon: Bell, desc: "Configure email alerts" }
          ].map((tab, idx) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <ScrollReveal key={tab.id} delay={150 + idx * 50} duration={400} direction="up">
                <div
                  onClick={() => setActiveTab(tab.id as SettingsTab)}
                  className={cn(
                    "rounded-2xl p-4 cursor-pointer border transition-all duration-300 flex items-center space-x-4",
                    isActive 
                      ? "bg-white text-slate-800 border-blue-100 shadow-sm ring-1 ring-blue-50" 
                      : "bg-[#E0EFFF]/30 text-slate-600 border-transparent hover:bg-[#E0EFFF]/60 hover:scale-[1.01]"
                  )}
                >
                  <div className={cn(
                    "p-2.5 rounded-xl border transition-colors",
                    isActive 
                      ? "bg-blue-50 text-[#1062FE] border-blue-100" 
                      : "bg-white text-slate-500 border-slate-100"
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={cn("font-bold text-[14px]", isActive ? "text-slate-800" : "text-slate-700")}>
                      {tab.label}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-semibold tracking-wide mt-0.5 uppercase">{tab.desc}</p>
                  </div>
                  {isActive && (
                    <div className="w-1.5 h-6 rounded-full bg-[#1062FE]" />
                  )}
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* ============================================================== */}
        {/* RIGHT COLUMN: ACTIVE PANEL VIEW                                */}
        {/* ============================================================== */}
        <div className="col-span-1 lg:col-span-8">
          <ScrollReveal delay={250} duration={500} direction="up">
            <div className="bg-white rounded-[1.5rem] border border-slate-100 p-6 sm:p-8 shadow-sm h-full min-h-[460px] flex flex-col justify-between">
              
              <div className="space-y-6">
                
                {/* -------------------------------------------------------- */}
                {/* TAB 1: SECURITY & PASSWORD PANEL                         */}
                {/* -------------------------------------------------------- */}
                {activeTab === 'security' && (
                  <form onSubmit={handleSaveSettings} className="space-y-6">
                    <div className="border-b border-slate-100 pb-4">
                      <h3 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
                        <Key className="w-5 h-5 text-[#1062FE]" />
                        {t('changePasswordTitle')}
                      </h3>
                      <p className="text-slate-400 text-xs font-semibold mt-1">{t('changePasswordDesc')}</p>
                    </div>

                    <div className="space-y-4 max-w-lg">
                      {/* Current Password */}
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('currentPasswordLabel')}</label>
                        <input 
                          type="password"
                          required
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full mt-1.5 px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1062FE]/20 focus:border-[#1062FE] transition-all"
                          placeholder="••••••••"
                        />
                      </div>

                      {/* New Password */}
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('newPasswordLabel')}</label>
                        <input 
                          type="password"
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full mt-1.5 px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1062FE]/20 focus:border-[#1062FE] transition-all"
                          placeholder="••••••••"
                        />
                        {/* Interactive Password Strength Indicator */}
                        {newPassword && (
                          <div className="mt-2.5 space-y-1.5">
                            <div className="flex items-center justify-between text-[11px] font-bold">
                              <span className="text-slate-400">Force :</span>
                              <span className={cn(
                                strength.label.includes("Fort") ? "text-emerald-500" : strength.label.includes("Moyen") ? "text-amber-500" : "text-red-500"
                              )}>{strength.label}</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div className={cn("h-full transition-all duration-500 ease-out", strength.color, strength.width)} />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Confirm Password */}
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('confirmPasswordLabel')}</label>
                        <input 
                          type="password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full mt-1.5 px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1062FE]/20 focus:border-[#1062FE] transition-all"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    {saveSuccess && (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-center gap-2.5 text-emerald-800 text-xs font-semibold animate-fadeIn max-w-lg">
                        <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        {t('copiedSuccess') === 'Copié !' ? 'Paramètres sauvegardés avec succès !' : 'Settings saved successfully!'}
                      </div>
                    )}

                    <div className="pt-4">
                      <Button 
                        type="submit"
                        className="bg-[#1062FE] hover:bg-blue-700 text-white rounded-xl px-5 py-3 text-xs font-bold tracking-wide transition-all shadow-md shadow-blue-500/10"
                      >
                        {t('saveSettingsBtn')}
                      </Button>
                    </div>
                  </form>
                )}

                {/* -------------------------------------------------------- */}
                {/* TAB 2: BILLING & SUBSCRIPTION PANEL                      */}
                {/* -------------------------------------------------------- */}
                {activeTab === 'billing' && (
                  <div className="space-y-6">
                    <div className="border-b border-slate-100 pb-4">
                      <h3 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-[#1062FE]" />
                        {t('billingTitle')}
                      </h3>
                      <p className="text-slate-400 text-xs font-semibold mt-1">{t('billingDesc')}</p>
                    </div>

                    {/* Premium Plan Card representation */}
                    <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-[1.25rem] p-6 text-white shadow-lg relative overflow-hidden flex flex-col justify-between h-40 max-w-md hover:scale-[1.02] transition-transform duration-300 group">
                      <div className="absolute top-0 right-0 transform translate-x-12 -translate-y-8 w-44 h-44 bg-white/5 rounded-full blur-xl group-hover:scale-110 transition-transform duration-500" />
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[10px] font-bold text-blue-100 uppercase tracking-widest">{t('currentPlanLabel')}</p>
                          <h4 className="text-2xl font-extrabold mt-1 tracking-tight">MYEASYRESUME</h4>
                        </div>
                        <span className="bg-white/20 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-white/10">Premium</span>
                      </div>
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[10px] font-medium text-blue-100 tracking-wide">Tarif / Price</p>
                          <p className="text-lg font-bold tracking-tight">{t('planPremiumPrice')}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-medium text-blue-100 tracking-wide">Statut</p>
                          <p className="text-sm font-bold tracking-tight text-emerald-300">Actif</p>
                        </div>
                      </div>
                    </div>

                    {/* Invoice History Table */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mt-6">Historique des factures</h4>
                      <div className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/50">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
                              <th className="py-3 px-4">Facture ID</th>
                              <th className="py-3 px-4">{t('invoiceDate')}</th>
                              <th className="py-3 px-4">{t('invoiceAmount')}</th>
                              <th className="py-3 px-4">{t('invoiceStatus')}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 bg-white">
                            {invoices.map((inv) => (
                              <tr key={inv.id} className="text-slate-700 font-semibold">
                                <td className="py-3.5 px-4 font-mono text-slate-500">{inv.id}</td>
                                <td className="py-3.5 px-4">{inv.date}</td>
                                <td className="py-3.5 px-4">{inv.amount}</td>
                                <td className="py-3.5 px-4">
                                  <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold text-[10px] border border-emerald-100">
                                    {inv.status === 'Payé' && t('copiedSuccess') === 'Copié !' ? 'Payé' : 'Paid'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* -------------------------------------------------------- */}
                {/* TAB 3: LAYOUT & PRINT PREFERENCES PANEL                   */}
                {/* -------------------------------------------------------- */}
                {activeTab === 'preferences' && (
                  <div className="space-y-6">
                    <div className="border-b border-slate-100 pb-4">
                      <h3 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
                        <Sliders className="w-5 h-5 text-[#1062FE]" />
                        {t('prefTitle')}
                      </h3>
                      <p className="text-slate-400 text-xs font-semibold mt-1">{t('prefDesc')}</p>
                    </div>

                    <div className="space-y-6 max-w-xl">
                      {/* Default Paper Size Choices */}
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('paperFormatLabel')}</label>
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { id: 'A4', title: "A4 (210 x 297 mm)", desc: "Standard International" },
                            { id: 'Letter', title: "US Letter (8.5 x 11 in)", desc: "Standard Américain" }
                          ].map((format) => {
                            const isSel = paperFormat === format.id;
                            return (
                              <div
                                key={format.id}
                                onClick={() => setPaperFormat(format.id as 'A4' | 'Letter')}
                                className={cn(
                                  "rounded-2xl p-4 border cursor-pointer transition-all duration-300 select-none relative overflow-hidden",
                                  isSel 
                                    ? "bg-blue-50/20 border-[#1062FE] ring-1 ring-[#1062FE]/20" 
                                    : "bg-white border-slate-100 hover:border-slate-200"
                                )}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-sm text-slate-800">{format.title}</span>
                                  {isSel && (
                                    <div className="w-4 h-4 rounded-full bg-[#1062FE] flex items-center justify-center">
                                      <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                                    </div>
                                  )}
                                </div>
                                <p className="text-xs text-slate-400 font-semibold mt-1 uppercase tracking-wider">{format.desc}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Default Language Selector */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('defaultLangLabel')}</label>
                        <div className="flex space-x-3 mt-1.5">
                          {[
                            { id: 'FR', label: "Français (FR)" },
                            { id: 'EN', label: "English (EN)" }
                          ].map((lang) => {
                            const isSel = defaultLang === lang.id;
                            return (
                              <button
                                key={lang.id}
                                onClick={() => setDefaultLang(lang.id as 'FR' | 'EN')}
                                className={cn(
                                  "px-4 py-2 text-xs font-bold rounded-xl border transition-all select-none",
                                  isSel 
                                    ? "bg-[#1062FE] text-white border-[#1062FE]" 
                                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                )}
                              >
                                {lang.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* -------------------------------------------------------- */}
                {/* TAB 4: NOTIFICATIONS ALERTS PANEL                        */}
                {/* -------------------------------------------------------- */}
                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <div className="border-b border-slate-100 pb-4">
                      <h3 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
                        <Bell className="w-5 h-5 text-[#1062FE]" />
                        {t('notifyTitle')}
                      </h3>
                      <p className="text-slate-400 text-xs font-semibold mt-1">{t('notifyDesc')}</p>
                    </div>

                    <div className="space-y-6 max-w-xl">
                      {/* Toggle list */}
                      {[
                        { 
                          title: t('notifyDownloads'), 
                          desc: "Recevoir une alerte e-mail dès qu'un recruteur télécharge ou consulte l'un de vos CV en ligne.",
                          state: notifyDownloads, 
                          toggle: () => setNotifyDownloads(!notifyDownloads) 
                        },
                        { 
                          title: t('notifyTemplates'), 
                          desc: "Restez informé dès que nos équipes d'ingénierie visuelle publient de nouveaux modèles exclusifs.",
                          state: notifyTemplates, 
                          toggle: () => setNotifyTemplates(!notifyTemplates) 
                        },
                        { 
                          title: "Conseils et astuces de carrière", 
                          desc: "Recevoir une newsletter mensuelle rédigée par des experts en recrutement avec des guides pratiques.",
                          state: notifyTips, 
                          toggle: () => setNotifyTips(!notifyTips) 
                        }
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-start justify-between space-x-6">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm text-slate-800 leading-snug">{item.title}</h4>
                            <p className="text-xs text-slate-400 font-medium leading-relaxed mt-1">{item.desc}</p>
                          </div>
                          
                          {/* Capsule custom pill toggle switch */}
                          <div 
                            onClick={item.toggle}
                            className={cn(
                              "w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 relative flex-shrink-0",
                              item.state ? "bg-[#1062FE]" : "bg-slate-200"
                            )}
                          >
                            <div className={cn(
                              "w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-sm",
                              item.state ? "transform translate-x-6" : "transform translate-x-0"
                            )} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Bottom footer notice inside panel */}
              <div className="border-t border-slate-50 pt-4 flex items-center space-x-2 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                <Info className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                <span>myeasyresume App Control System • V1.0.0</span>
              </div>

            </div>
          </ScrollReveal>
        </div>

      </div>
    </div>
  );
}
