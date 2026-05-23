'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { EditorStepper } from '@/components/editor/EditorStepper';
import { LivePreview } from '@/components/editor/LivePreview';
import { PersonalInfoStep } from '@/components/editor/steps/PersonalInfoStep';
import { SummaryStep } from '@/components/editor/steps/SummaryStep';
import { ExperienceStep } from '@/components/editor/steps/ExperienceStep';
import { EducationStep } from '@/components/editor/steps/EducationStep';
import { SkillsStep } from '@/components/editor/steps/SkillsStep';
import { ReferenceStep } from '@/components/editor/steps/ReferenceStep';
import { Button } from '@/components/ui/button';
import { Eye, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useResume } from '@/context/ResumeContext';
import { useTokens } from '@/context/TokenContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

function EditorContent() {
  const { t } = useLanguage();
  const { resumeData, saveResume, setTemplateId } = useResume();
  const { downloadCredits, consumeDownloadCredit, openDownloadModal } = useTokens();
  const router = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isProcessingDownload, setIsProcessingDownload] = useState(false);
  const searchParams = useSearchParams();
  const resumeId = searchParams.get('resume');

  // Écoute dynamique du modèle choisi dans l'URL (avec garde anti-boucle)
  useEffect(() => {
    const templateParam = searchParams.get('template');
    if (templateParam && resumeData.templateId !== templateParam) {
      setTemplateId(templateParam);
    }
  }, [searchParams, setTemplateId, resumeData.templateId]);

  // Vérification de l'état du déblocage (Délai de grâce)
  useEffect(() => {
    const checkUnlockStatus = async () => {
      if (!resumeId) return;
      const { data } = await supabase.from('resumes').select('unlocked_until').eq('id', resumeId).single();
      if (data && data.unlocked_until) {
        const unlockDate = new Date(data.unlocked_until);
        if (unlockDate > new Date()) {
          setIsUnlocked(true);
        } else {
          setIsUnlocked(false);
        }
      }
    };
    checkUnlockStatus();
  }, [resumeId]);

  // Déclenchement automatique de l'impression si le paramètre "print=1" est présent
  useEffect(() => {
    if (searchParams.get('print') === '1') {
      // On déclenche la logique de téléchargement premium
      handlePremiumDownload();
    }
  }, [searchParams]); // On ne l'exécute qu'une fois grâce au check URL param

  const triggerPrint = () => {
    setIsUnlocked(true);
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const handlePremiumDownload = async () => {
    if (!resumeId) {
      alert("Veuillez d'abord 'Terminer & Sauvegarder' votre CV pour le télécharger.");
      return;
    }

    if (isProcessingDownload) return;
    setIsProcessingDownload(true);

    try {
      // Re-vérifier l'état en BDD pour être sûr
      const { data } = await supabase.from('resumes').select('unlocked_until').eq('id', resumeId).single();
      let hasGracePeriod = false;
      if (data && data.unlocked_until) {
        if (new Date(data.unlocked_until) > new Date()) hasGracePeriod = true;
      }

      if (hasGracePeriod) {
        // Déjà débloqué, on imprime direct
        triggerPrint();
      } else {
        // Pas de délai de grâce, il faut payer
        if (downloadCredits > 0) {
          const confirmUnlock = window.confirm(
            "Télécharger ce CV en Haute Qualité (sans filigrane) coûte 1 crédit de téléchargement.\n\n" +
            "Ce document restera déverrouillé pendant 15 minutes pour vous permettre d'apporter des corrections gratuitement.\n\n" +
            `Solde actuel : ${downloadCredits} crédits.\n\nConfirmer ?`
          );

          if (confirmUnlock) {
            const success = await consumeDownloadCredit(resumeId, 'resume');
            if (success) {
              triggerPrint();
            } else {
              alert("Erreur lors de l'utilisation du crédit.");
            }
          }
        } else {
          // Solde = 0
          openDownloadModal();
        }
      }
    } catch (e) {
      console.error(e);
      alert("Une erreur est survenue.");
    } finally {
      setIsProcessingDownload(false);
    }
  };

  const steps = [
    { title: t('editorStepPersonal'), component: <PersonalInfoStep /> },
    { title: t('editorStepSummary'), component: <SummaryStep /> },
    { title: t('editorStepExperience'), component: <ExperienceStep /> },
    { title: t('editorStepEducation'), component: <EducationStep /> },
    { title: t('editorStepSkills'), component: <SkillsStep /> },
    { title: t('copiedSuccess') === 'Copié !' ? 'Références' : 'References', component: <ReferenceStep /> },
  ];

  const nextStep = () => setCurrentStepIndex(i => Math.min(i + 1, steps.length - 1));
  const prevStep = () => setCurrentStepIndex(i => Math.max(i - 1, 0));

  return (
    <div className={`flex h-screen w-full overflow-hidden bg-[#E0EFFF]/30 ${isUnlocked ? 'unlocked-print' : ''}`}>
      
      {/* LEFT PANE: Form Wizard */}
      <div className={`w-full lg:w-[45%] xl:w-[40%] flex flex-col h-full bg-white border-r border-slate-100 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 ${showMobilePreview ? 'hidden lg:flex' : 'flex'} print:hidden`}>
        
        {/* Top Bar / Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
           <Link href="/templates" className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors">
              &larr; Quitter
           </Link>
           <div className="flex items-center space-x-2">
             <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">Étape {currentStepIndex + 1}/{steps.length}</span>
           </div>
           <div>
             <button 
               onClick={handlePremiumDownload}
               disabled={isProcessingDownload}
               className={`hidden lg:flex px-4 py-2 text-white rounded-xl text-xs font-bold transition-colors shadow-[0_2px_10px_rgba(0,0,0,0.1)] ${isProcessingDownload ? 'bg-slate-400' : 'bg-slate-900 hover:bg-slate-800'}`}
             >
               {isProcessingDownload ? 'Vérification...' : 'Exporter PDF'}
             </button>
           </div>
        </div>

        {/* Stepper Navigation */}
        <div className="px-4 py-2 shrink-0">
           <EditorStepper 
             currentStep={currentStepIndex} 
             totalSteps={steps.length} 
             titles={steps.map(s => s.title)} 
           />
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto px-6 py-8">
           {steps[currentStepIndex].component}
        </div>

        {/* Bottom Navigation Actions */}
        <div className="p-4 sm:p-6 border-t border-slate-100 flex items-center justify-between bg-white shrink-0">
          <Button 
            variant="outline" 
            onClick={prevStep} 
            disabled={currentStepIndex === 0} 
            className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
          >
             <ChevronLeft className="w-4 h-4 mr-2" /> <span className="hidden sm:inline">{t('btnPrevious')}</span>
          </Button>
          
          {currentStepIndex === steps.length - 1 ? (
            <Button 
              onClick={async () => {
                setSaved(true);
                await saveResume();
                setTimeout(() => router.push('/dashboard'), 500);
              }} 
              disabled={saved}
              className={`rounded-xl text-white shadow-sm hover:shadow-md transition-all px-6 ${
                saved ? 'bg-emerald-500 cursor-default' : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
               {saved ? (
                 <><CheckCircle2 className="w-4 h-4 mr-2" /><span className="hidden sm:inline">Sauvegardé !</span></>
               ) : (
                 <><span className="hidden sm:inline">Terminer & Sauvegarder</span> <ChevronRight className="w-4 h-4 ml-2" /></>
               )}
            </Button>
          ) : (
            <Button 
              onClick={nextStep} 
              className="rounded-xl bg-[#1062FE] hover:bg-blue-700 text-white shadow-sm hover:shadow-md transition-all px-6"
            >
               <span className="hidden sm:inline">{t('btnNext')}</span> <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>

      {/* RIGHT PANE: Live Preview */}
      <div className={`w-full lg:w-[55%] xl:w-[60%] relative h-full flex flex-col ${!showMobilePreview ? 'hidden lg:flex' : 'flex'} print:!flex print:!w-full print:!absolute print:!inset-0 print:!h-auto print:!overflow-visible`}>
         
         {/* Mobile Header for Preview */}
         <div className="lg:hidden p-4 bg-white border-b border-slate-100 shrink-0 flex justify-between items-center shadow-sm z-10">
            <h2 className="font-semibold text-slate-800">Aperçu en direct</h2>
            <Button variant="ghost" size="sm" onClick={() => setShowMobilePreview(false)} className="rounded-lg text-[#1062FE]">
               Retour au formulaire
            </Button>
         </div>
         
         {/* Canvas Area */}
         <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center items-start">
            <LivePreview />
         </div>
      </div>

      {/* Mobile Floating Preview Button */}
      {!showMobilePreview && (
        <button 
          onClick={() => setShowMobilePreview(true)}
          className="lg:hidden fixed bottom-24 right-6 w-14 h-14 bg-slate-950 text-white rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-20 group"
        >
          <Eye className="w-6 h-6 group-hover:text-blue-400 transition-colors" />
        </button>
      )}

    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-full items-center justify-center bg-[#E0EFFF]/30">
        <div className="text-slate-500 font-semibold animate-pulse text-sm">Chargement de votre éditeur premium...</div>
      </div>
    }>
      <EditorContent />
    </Suspense>
  );
}
