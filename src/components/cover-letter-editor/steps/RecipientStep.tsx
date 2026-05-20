'use client';

import React from 'react';
import { useCoverLetter } from '@/context/CoverLetterContext';
import { useLanguage } from '@/context/LanguageContext';
import { CVPickerCard } from '@/components/cover-letter-editor/CVPickerCard';
import { Building2, User, MapPin, Calendar, Briefcase, FileText, Sparkles } from 'lucide-react';

export function RecipientStep() {
  const { letterData, updateField, selectedResume } = useCoverLetter();
  const { t } = useLanguage();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">{t('clStepRecipient')}</h2>
        <p className="text-sm text-slate-400 font-medium">
          Informations sur l&apos;entreprise et l&apos;objet de votre lettre.
        </p>
      </div>

      <div className="space-y-5">
        {/* Destinataire */}
        <div className="p-5 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 rounded-2xl border border-blue-100/60 space-y-4">
          <h3 className="text-xs font-bold text-[#1062FE] uppercase tracking-widest flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5" /> Destinataire
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{t('clRecipientName')}</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input
                  type="text"
                  value={letterData.recipientName}
                  onChange={(e) => updateField('recipientName', e.target.value)}
                  placeholder="M. / Mme Dupont"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 font-medium placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1062FE]/20 focus:border-[#1062FE] transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{t('clRecipientTitle')}</label>
              <input
                type="text"
                value={letterData.recipientTitle}
                onChange={(e) => updateField('recipientTitle', e.target.value)}
                placeholder={t('clRecipientPlaceholder')}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 font-medium placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1062FE]/20 focus:border-[#1062FE] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{t('clCompanyName')}</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <input
                type="text"
                value={letterData.companyName}
                onChange={(e) => updateField('companyName', e.target.value)}
                placeholder="Google, Amazon, Microsoft..."
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 font-medium placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1062FE]/20 focus:border-[#1062FE] transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{t('clCompanyAddress')}</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input
                  type="text"
                  value={letterData.companyAddress}
                  onChange={(e) => updateField('companyAddress', e.target.value)}
                  placeholder="456 Avenue des Champs"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 font-medium placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1062FE]/20 focus:border-[#1062FE] transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{t('clCompanyCity')}</label>
              <input
                type="text"
                value={letterData.companyCity}
                onChange={(e) => updateField('companyCity', e.target.value)}
                placeholder="Paris, 75008"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 font-medium placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1062FE]/20 focus:border-[#1062FE] transition-all"
              />
            </div>
          </div>
        </div>

        {/* Date, Objet, Poste */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{t('clDate')}</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input
                  type="text"
                  value={letterData.date}
                  onChange={(e) => updateField('date', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 font-medium placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1062FE]/20 focus:border-[#1062FE] transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{t('clJobTitle')}</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input
                  type="text"
                  value={letterData.jobTitle}
                  onChange={(e) => updateField('jobTitle', e.target.value)}
                  placeholder="Développeur Full-Stack"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 font-medium placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1062FE]/20 focus:border-[#1062FE] transition-all"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{t('clSubject')}</label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <input
                type="text"
                value={letterData.subject}
                onChange={(e) => updateField('subject', e.target.value)}
                placeholder={t('clSubjectPlaceholder')}
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 font-medium placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1062FE]/20 focus:border-[#1062FE] transition-all"
              />
            </div>
          </div>
        </div>

        {/* ─── SECTION IA ─────────────────────────────────────────── */}
        <div className="rounded-2xl border-2 border-dashed border-violet-200 bg-gradient-to-br from-violet-50/60 to-purple-50/40 p-5 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-violet-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-violet-800">{t('clAiBrief')}</h3>
              <p className="text-xs text-violet-500 font-medium mt-0.5">{t('clAiBriefHint')}</p>
            </div>
          </div>

          {/* Sélecteur de CV */}
          <CVPickerCard />

          {/* Confirmation CV sélectionné */}
          {selectedResume && (
            <p className="text-xs text-slate-500 font-medium px-1">
              ✓ Les données du CV <span className="font-bold text-slate-700">&quot;{selectedResume.title}&quot;</span> seront utilisées par l&apos;IA.
            </p>
          )}

          {/* Brief complémentaire libre */}
          <div>
            <label className="block text-xs font-bold text-violet-600 uppercase tracking-wider mb-2">
              Brief complémentaire (optionnel)
            </label>
            <textarea
              value={letterData.aiBrief}
              onChange={(e) => updateField('aiBrief', e.target.value)}
              placeholder={t('clAiBriefPlaceholder')}
              rows={3}
              className="w-full px-4 py-3 bg-white border border-violet-200 rounded-xl text-sm text-slate-700 font-medium leading-relaxed placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-400/20 focus:border-violet-400 resize-none transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
