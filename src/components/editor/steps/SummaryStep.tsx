'use client';
import { useLanguage } from '@/context/LanguageContext';
import { useResume } from '@/context/ResumeContext';
import { Sparkles, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useTokens } from '@/context/TokenContext';
import { useAuth } from '@/context/AuthContext';

export function SummaryStep() {
  const { t } = useLanguage();
  const { resumeData, updateSummary } = useResume();
  const { consumeToken } = useTokens();
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    // Vérification de la présence de la profession
    if (!resumeData.personalInfo.jobTitle) {
      alert("💡 Astuce : Veuillez d'abord renseigner votre Profession ciblée (dans l'étape Informations Personnelles) pour que l'IA puisse générer un texte pertinent !");
      return;
    }

    // Consommation de 5 jetons
    const success = consumeToken(5);
    if (!success) return; // Si pas assez de jetons, la modale de recharge s'est ouverte automatiquement

    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt_type: 'summary',
          context: { jobTitle: resumeData.personalInfo.jobTitle },
          userId: user?.id || 'guest',
        }),
      });

      if (!response.ok) throw new Error('Erreur API');

      const data = await response.json();
      if (data.text) {
        updateSummary(data.text);
      }
    } catch (error) {
      console.error(error);
      alert('Une erreur est survenue lors de la génération IA.');
      // Optionnel : on pourrait re-créditer les jetons ici si ça échoue
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">{t('editorStepSummary')}</h2>
        
        <button 
          onClick={handleGenerate}
          disabled={isGenerating}
          className="flex items-center justify-center px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl font-semibold text-sm transition-all shadow-sm border border-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {isGenerating ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4 mr-2 group-hover:text-amber-500 transition-colors" />
          )}
          {t('btnGenerateProfile')} <span className="ml-1 opacity-70 font-normal">(5 💎)</span>
        </button>
      </div>

      <div className="p-[2px] rounded-2xl bg-gradient-to-br from-slate-200 to-slate-100 focus-within:from-[#1062FE] focus-within:to-indigo-400 transition-colors shadow-sm">
        <textarea
          value={resumeData.professionalSummary}
          onChange={(e) => updateSummary(e.target.value)}
          placeholder="Rédigez un résumé accrocheur qui met en valeur vos compétences principales, ou laissez notre IA l'écrire pour vous..."
          className="w-full h-64 p-4 sm:p-6 bg-white rounded-[14px] border-none resize-none focus:outline-none focus:ring-0 text-slate-700 leading-relaxed"
        />
      </div>
      <p className="mt-3 text-xs font-medium text-slate-400 text-right">Environ 3 à 5 phrases recommandées.</p>
    </div>
  );
}
