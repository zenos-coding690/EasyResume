'use client';

import React from 'react';
import { useResume, Reference } from '@/context/ResumeContext';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Users } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export function ReferenceStep() {
  const { resumeData, addReference, updateReference, removeReference } = useResume();
  const { t } = useLanguage();
  
  const references = resumeData.references || [];

  const handleAdd = () => {
    addReference({
      id: Date.now().toString(),
      name: '',
      position: '',
      company: '',
      email: '',
      phone: ''
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Users className="w-6 h-6 text-[#1062FE]" />
          {t('copiedSuccess') === 'Copié !' ? 'Références' : 'References'}
        </h2>
        <p className="text-slate-500 mt-1">
          {t('copiedSuccess') === 'Copié !' 
            ? 'Ajoutez des contacts professionnels qui peuvent témoigner de vos compétences.' 
            : 'Add professional contacts who can vouch for your skills.'}
        </p>
      </div>

      <div className="space-y-6">
        {references.map((ref, index) => (
          <ScrollReveal key={ref.id} delay={index * 100} duration={400} direction="up">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 relative group transition-all hover:border-slate-200 hover:shadow-sm">
              <button
                onClick={() => removeReference(ref.id)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                title="Supprimer cette référence"
              >
                <Trash2 className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    {t('copiedSuccess') === 'Copié !' ? 'Nom complet' : 'Full Name'}
                  </label>
                  <input
                    value={ref.name}
                    onChange={(e) => updateReference(ref.id, 'name', e.target.value)}
                    placeholder="Ex: Jean Dupont"
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1062FE] transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    {t('copiedSuccess') === 'Copié !' ? 'Poste' : 'Position'}
                  </label>
                  <input
                    value={ref.position}
                    onChange={(e) => updateReference(ref.id, 'position', e.target.value)}
                    placeholder="Ex: Directeur Technique"
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1062FE] transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    {t('copiedSuccess') === 'Copié !' ? 'Entreprise' : 'Company'}
                  </label>
                  <input
                    value={ref.company}
                    onChange={(e) => updateReference(ref.id, 'company', e.target.value)}
                    placeholder="Ex: Google"
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1062FE] transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    {t('copiedSuccess') === 'Copié !' ? 'Téléphone' : 'Phone'}
                  </label>
                  <input
                    value={ref.phone}
                    onChange={(e) => updateReference(ref.id, 'phone', e.target.value)}
                    placeholder="Ex: +33 6 12 34 56 78"
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1062FE] transition-all"
                  />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    {t('copiedSuccess') === 'Copié !' ? 'Email' : 'Email'}
                  </label>
                  <input
                    value={ref.email}
                    onChange={(e) => updateReference(ref.id, 'email', e.target.value)}
                    placeholder="Ex: jean.dupont@entreprise.com"
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1062FE] transition-all"
                  />
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}

        <Button
          variant="outline"
          onClick={handleAdd}
          className="w-full py-6 border-2 border-dashed border-slate-200 text-slate-500 hover:text-[#1062FE] hover:border-[#1062FE] hover:bg-blue-50/50 rounded-2xl transition-all flex items-center justify-center gap-2 group"
        >
          <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
            <Plus className="w-4 h-4 text-slate-600 group-hover:text-[#1062FE]" />
          </div>
          <span className="font-semibold">
            {t('copiedSuccess') === 'Copié !' ? 'Ajouter une référence' : 'Add a reference'}
          </span>
        </Button>
      </div>
    </div>
  );
}
