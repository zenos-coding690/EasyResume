'use client';

import React from 'react';
import { useCoverLetter } from '@/context/CoverLetterContext';
import { useLanguage } from '@/context/LanguageContext';
import { User, MapPin, Phone, Mail } from 'lucide-react';

export function SenderInfoStep() {
  const { letterData, updateField } = useCoverLetter();
  const { t } = useLanguage();

  const fields = [
    { key: 'senderFullName' as const, label: t('clSenderName'), icon: User, placeholder: 'Jean Dupont' },
    { key: 'senderAddress' as const, label: t('clSenderAddress'), icon: MapPin, placeholder: '123 Rue de la Paix' },
    { key: 'senderCity' as const, label: t('clSenderCity'), icon: MapPin, placeholder: 'Paris, 75001' },
    { key: 'senderPhone' as const, label: t('clSenderPhone'), icon: Phone, placeholder: '+33 6 12 34 56 78' },
    { key: 'senderEmail' as const, label: t('clSenderEmail'), icon: Mail, placeholder: 'jean.dupont@email.com' },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">{t('clStepSender')}</h2>
        <p className="text-sm text-slate-400 font-medium">
          Ces informations apparaîtront en en-tête de votre lettre.
        </p>
      </div>

      <div className="space-y-5">
        {fields.map((field) => {
          const Icon = field.icon;
          return (
            <div key={field.key} className="group">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                {field.label}
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#1062FE] transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <input
                  type={field.key === 'senderEmail' ? 'email' : field.key === 'senderPhone' ? 'tel' : 'text'}
                  value={letterData[field.key]}
                  onChange={(e) => updateField(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 font-medium placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1062FE]/20 focus:border-[#1062FE] transition-all duration-200"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
