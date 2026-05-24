'use client';
import { useLanguage } from '@/context/LanguageContext';
import { useResume } from '@/context/ResumeContext';
import { Wrench, Heart, Globe, Sparkles, Loader2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useTokens } from '@/context/TokenContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

export function SkillsStep() {
  const { t } = useLanguage();
  const { 
    resumeData, 
    updateSkills, 
    updateHobbies, 
    addLanguage, 
    updateLanguage, 
    removeLanguage 
  } = useResume();
  const { consumeToken } = useTokens();
  const { user } = useAuth();

  const [isGeneratingSkills, setIsGeneratingSkills] = useState(false);
  const [isGeneratingHobbies, setIsGeneratingHobbies] = useState(false);
  const [isGeneratingLanguages, setIsGeneratingLanguages] = useState(false);

  const handleGenerateSkills = async () => {
    if (!resumeData.personalInfo.jobTitle) {
      alert("💡 Astuce : Veuillez d'abord renseigner votre Profession ciblée (dans l'étape Informations Personnelles) pour que l'IA puisse générer des compétences en accord avec votre métier !");
      return;
    }

    const success = consumeToken(5);
    if (!success) return;

    setIsGeneratingSkills(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          prompt_type: 'skills',
          context: { jobTitle: resumeData.personalInfo.jobTitle },
          userId: user?.id || 'guest',
        }),
      });

      if (!response.ok) throw new Error('Erreur API');

      const data = await response.json();
      if (data.text) {
        // Le LLM peut répondre avec des virgules. Transformons cela en bullet points.
        const list = data.text.split(',').map((s: string) => `• ${s.trim()}`).join('\n');
        updateSkills(list);
      }
    } catch (error) {
      console.error(error);
      alert('Une erreur est survenue lors de la génération IA.');
    } finally {
      setIsGeneratingSkills(false);
    }
  };

  const handleGenerateHobbies = async () => {
    if (!resumeData.personalInfo.jobTitle) {
      alert("💡 Astuce : Renseignez d'abord votre Profession ciblée pour que l'IA vous suggère des centres d'intérêt qui valorisent au mieux votre profil !");
      return;
    }

    const success = consumeToken(5);
    if (!success) return;

    setIsGeneratingHobbies(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          prompt_type: 'hobbies',
          context: { jobTitle: resumeData.personalInfo.jobTitle },
          userId: user?.id || 'guest',
        }),
      });

      if (!response.ok) throw new Error('Erreur API');

      const data = await response.json();
      if (data.text) {
        updateHobbies(data.text);
      }
    } catch (error) {
      console.error(error);
      alert('Une erreur est survenue lors de la génération IA.');
    } finally {
      setIsGeneratingHobbies(false);
    }
  };

  const handleGenerateLanguages = async () => {
    const success = consumeToken(5);
    if (!success) return;

    setIsGeneratingLanguages(true);
    await new Promise(r => setTimeout(r, 1500));

    // Suggestions de langues standard
    const suggestedLangs = [
      { id: 'l1-' + Date.now(), name: 'Français', level: 100 },
      { id: 'l2-' + Date.now(), name: 'Anglais', level: 85 },
      { id: 'l3-' + Date.now(), name: 'Espagnol', level: 45 }
    ];

    // Vider les anciennes et ajouter les nouvelles
    if (resumeData.languages && resumeData.languages.length > 0) {
      resumeData.languages.forEach(l => removeLanguage(l.id));
    }
    suggestedLangs.forEach(lang => addLanguage(lang));

    setIsGeneratingLanguages(false);
  };

  const getLanguageLevelLabel = (level: number) => {
    if (level < 30) return `Débutant (${level}%)`;
    if (level < 50) return `Intermédiaire A2 (${level}%)`;
    if (level < 75) return `Intermédiaire B2 (${level}%)`;
    if (level < 95) return `Courant / C1 (${level}%)`;
    return `Bilingue / C2 (${level}%)`;
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto space-y-8 pb-12">
      <h2 className="text-xl sm:text-2xl font-bold text-slate-800">{t('editorStepSkills')}</h2>
      
      {/* SECTION: SKILLS */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
          <div className="flex items-center">
             <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1062FE] flex items-center justify-center mr-3">
               <Wrench className="w-4 h-4" />
             </div>
             <h3 className="text-lg font-semibold text-slate-800">Compétences</h3>
          </div>
          <button 
            onClick={handleGenerateSkills}
            disabled={isGeneratingSkills}
            className="flex items-center justify-center px-3 py-1.5 bg-blue-50 text-[#1062FE] hover:bg-blue-100/80 rounded-xl font-bold text-xs transition-all border border-blue-100 disabled:opacity-50 disabled:cursor-not-allowed group shrink-0"
          >
            {isGeneratingSkills ? (
              <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 mr-1.5 group-hover:text-amber-500 transition-colors" />
            )}
            Rédiger par l&apos;IA <span className="ml-1 opacity-70 font-normal">(5 💎)</span>
          </button>
        </div>
        <div className="p-[2px] rounded-2xl bg-gradient-to-br from-slate-200 to-slate-100 focus-within:from-[#1062FE] focus-within:to-indigo-400 transition-colors shadow-sm">
          <textarea
            value={resumeData.skills}
            onChange={(e) => updateSkills(e.target.value)}
            placeholder="Ex:&#10;• Maîtrise des outils Adobe&#10;• Gestion de projets Agile&#10;• Développement web..."
            className="w-full h-40 p-4 sm:p-5 bg-white rounded-[14px] border-none resize-none focus:outline-none focus:ring-0 text-sm text-slate-700 leading-relaxed"
          />
        </div>
        <p className="mt-2 text-xs text-slate-400">Astuce : Sautez une ligne pour séparer chaque compétence.</p>
      </div>

      {/* SECTION: LANGUAGES */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
          <div className="flex items-center">
             <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mr-3">
               <Globe className="w-4 h-4" />
             </div>
             <h3 className="text-lg font-semibold text-slate-800">Langues et Niveaux</h3>
          </div>
          <button 
            onClick={handleGenerateLanguages}
            disabled={isGeneratingLanguages}
            className="flex items-center justify-center px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100/80 rounded-xl font-bold text-xs transition-all border border-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed group shrink-0"
          >
            {isGeneratingLanguages ? (
              <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 mr-1.5 group-hover:text-amber-500 transition-colors" />
            )}
            Suggérer par l&apos;IA <span className="ml-1 opacity-70 font-normal">(5 💎)</span>
          </button>
        </div>

        <div className="space-y-4">
          {resumeData.languages?.map((lang) => (
            <div key={lang.id} className="p-4 bg-slate-50/60 border border-slate-100 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-4 relative group">
              <input
                type="text"
                value={lang.name}
                onChange={(e) => updateLanguage(lang.id, 'name', e.target.value)}
                placeholder="Ex: Français, Anglais..."
                className="w-full sm:w-1/3 px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1062FE]/30 focus:border-[#1062FE]"
              />
              <div className="flex-1 w-full flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={lang.level}
                  onChange={(e) => updateLanguage(lang.id, 'level', parseInt(e.target.value))}
                  className="flex-1 accent-[#1062FE] cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
                />
                <span className="text-xs font-semibold text-slate-500 min-w-[120px] text-right">
                  {getLanguageLevelLabel(lang.level)}
                </span>
              </div>
              <button
                onClick={() => removeLanguage(lang.id)}
                className="absolute sm:static -top-2 -right-2 bg-red-100 hover:bg-red-200 text-red-600 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-colors shadow-sm sm:shadow-none"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          
          <button
            onClick={() => addLanguage({ id: Date.now().toString(), name: '', level: 80 })}
            className="w-full py-3 bg-white border border-dashed border-slate-200 hover:border-slate-300 rounded-2xl text-sm font-semibold text-slate-500 hover:text-[#1062FE] hover:border-[#1062FE]/40 transition-colors flex items-center justify-center gap-2"
          >
            + Ajouter une langue
          </button>
        </div>
      </div>

      {/* SECTION: HOBBIES */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
          <div className="flex items-center">
             <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-500 flex items-center justify-center mr-3">
               <Heart className="w-4 h-4" />
             </div>
             <h3 className="text-lg font-semibold text-slate-800">Hobbies et Loisirs</h3>
          </div>
          <button 
            onClick={handleGenerateHobbies}
            disabled={isGeneratingHobbies}
            className="flex items-center justify-center px-3 py-1.5 bg-pink-50 text-pink-600 hover:bg-pink-100/80 rounded-xl font-bold text-xs transition-all border border-pink-100 disabled:opacity-50 disabled:cursor-not-allowed group shrink-0"
          >
            {isGeneratingHobbies ? (
              <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 mr-1.5 group-hover:text-amber-500 transition-colors" />
            )}
            Rédiger par l&apos;IA <span className="ml-1 opacity-70 font-normal">(5 💎)</span>
          </button>
        </div>
        <div className="p-[2px] rounded-2xl bg-gradient-to-br from-slate-200 to-slate-100 focus-within:from-pink-400 focus-within:to-rose-300 transition-colors shadow-sm">
          <textarea
            value={resumeData.hobbies}
            onChange={(e) => updateHobbies(e.target.value)}
            placeholder="Ex:&#10;• Course à pied&#10;• Lecture&#10;• Voyage..."
            className="w-full h-32 p-4 sm:p-5 bg-white rounded-[14px] border-none resize-none focus:outline-none focus:ring-0 text-sm text-slate-700 leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
}
