'use client';
import { useLanguage } from '@/context/LanguageContext';
import { useResume } from '@/context/ResumeContext';
import { Plus, Trash2, Sparkles, Loader2, Briefcase, MapPin, Building2, Calendar } from 'lucide-react';
import { useState } from 'react';
import { useTokens } from '@/context/TokenContext';
import { useAuth } from '@/context/AuthContext';
import React from 'react';

export function ExperienceStep() {
  const { t } = useLanguage();
  const { resumeData, addExperience, updateExperience, removeExperience } = useResume();
  const { consumeToken } = useTokens();
  const { user } = useAuth();
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const handleAdd = () => {
    addExperience({
      id: Date.now().toString(),
      jobTitle: '',
      company: '',
      city: '',
      startDate: '',
      endDate: '',
      tasks: ''
    });
  };

  const handleGenerateTasks = async (expId: string, expTitle: string) => {
    if (!expTitle) {
      alert("💡 Astuce : Veuillez renseigner le 'Poste' de cette expérience avant de générer les tâches.");
      return;
    }

    const success = consumeToken(3);
    if (!success) return;

    setGeneratingId(expId);
    
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt_type: 'experience',
          context: { 
            jobTitle: expTitle,
            company: resumeData.experiences.find((e: any) => e.id === expId)?.company || 'une entreprise'
          },
          userId: user?.id || 'guest',
        }),
      });

      if (!response.ok) throw new Error('Erreur API');

      const data = await response.json();
      if (data.text) {
        // Transformer en liste à puce si le LLM n'a pas mis les puces
        const list = data.text.split('\n').map((line: string) => line.startsWith('•') ? line : `• ${line}`).join('\n');
        updateExperience(expId, 'tasks', list);
      }
    } catch (error) {
      console.error(error);
      alert('Une erreur est survenue lors de la génération IA.');
    } finally {
      setGeneratingId(null);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-slate-800">{t('editorStepExperience')}</h2>
      
      {resumeData.experiences.length === 0 ? (
        <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-500">
           <Briefcase className="w-12 h-12 text-slate-300 mb-3" />
           <p className="mb-4 text-sm font-medium">Aucune expérience ajoutée pour le moment.</p>
           <button onClick={handleAdd} className="px-6 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 shadow-sm hover:shadow-md hover:border-[#1062FE] hover:text-[#1062FE] transition-all flex items-center">
             <Plus className="w-4 h-4 mr-2" /> {t('btnAddExperience')}
           </button>
        </div>
      ) : (
        <div className="space-y-8">
          {resumeData.experiences.map((exp, index) => (
            <div key={exp.id} className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-[0_2px_12px_rgba(0,0,0,0.03)] relative group hover:border-slate-300 transition-colors">
               <div className="absolute -top-3 -left-3 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                 {index + 1}
               </div>
               <button onClick={() => removeExperience(exp.id)} className="absolute -top-3 -right-3 p-2 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white border border-red-100 rounded-full shadow-md transition-all" title="Supprimer">
                 <Trash2 className="w-4 h-4" />
               </button>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                 <InputField icon={<Briefcase />} value={exp.jobTitle} onChange={(e: any) => updateExperience(exp.id, 'jobTitle', e.target.value)} placeholder={t('fieldPosition')} className="sm:col-span-2" />
                 <InputField icon={<Building2 />} value={exp.company} onChange={(e: any) => updateExperience(exp.id, 'company', e.target.value)} placeholder={t('fieldCompany')} />
                 <InputField icon={<MapPin />} value={exp.city} onChange={(e: any) => updateExperience(exp.id, 'city', e.target.value)} placeholder="Ville" />
                 <InputField icon={<Calendar />} value={exp.startDate} onChange={(e: any) => updateExperience(exp.id, 'startDate', e.target.value)} placeholder={t('fieldStartMonth') + ' / ' + t('fieldStartYear')} type="month" />
                 <InputField icon={<Calendar />} value={exp.endDate} onChange={(e: any) => updateExperience(exp.id, 'endDate', e.target.value)} placeholder={t('fieldEndMonth') + ' / ' + t('fieldEndYear')} type="month" />
               </div>

               <div className="mt-6">
                 <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                   <label className="text-sm font-semibold text-slate-700">Tâches et Réalisations</label>
                   <button 
                     onClick={() => handleGenerateTasks(exp.id, exp.jobTitle)}
                     disabled={generatingId === exp.id}
                     className="flex items-center justify-center text-xs font-semibold px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-100 disabled:opacity-50 group-hover:shadow-sm"
                   >
                     {generatingId === exp.id ? <Loader2 className="w-3 h-3 mr-1.5 animate-spin" /> : <Sparkles className="w-3 h-3 mr-1.5" />}
                     {t('btnGenerateTasks')} <span className="ml-1 opacity-70 font-normal">(3 💎)</span>
                   </button>
                 </div>
                 <div className="p-[1px] rounded-xl bg-gradient-to-br from-slate-200 to-slate-100 focus-within:from-[#1062FE] focus-within:to-indigo-400 transition-colors">
                   <textarea
                     value={exp.tasks}
                     onChange={(e) => updateExperience(exp.id, 'tasks', e.target.value)}
                     placeholder={t('fieldTasksDesc')}
                     className="w-full h-32 p-3 bg-white rounded-[11px] border-none resize-none focus:outline-none focus:ring-0 text-sm text-slate-700 leading-relaxed"
                   />
                 </div>
               </div>
            </div>
          ))}
          
          <button onClick={handleAdd} className="w-full py-4 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl text-sm font-semibold text-slate-500 hover:text-[#1062FE] hover:bg-blue-50 hover:border-blue-200 transition-all flex items-center justify-center">
            <Plus className="w-5 h-5 mr-2" /> {t('btnAddExperience')}
          </button>
        </div>
      )}
    </div>
  );
}

function InputField({ icon, value, onChange, placeholder, type = "text", className = "" }: any) {
  return (
    <div className={`relative group ${className}`}>
       <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1062FE] transition-colors">
          {React.cloneElement(icon, { className: "w-4 h-4" })}
       </div>
       <input 
         type={type}
         value={value}
         onChange={onChange}
         placeholder={placeholder}
         className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1062FE] transition-all"
       />
    </div>
  );
}
