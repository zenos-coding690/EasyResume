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
import { Button } from '@/components/ui/button';
import { Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useResume } from '@/context/ResumeContext';
import { useSearchParams } from 'next/navigation';

function EditorContent() {
  const { t } = useLanguage();
  const { resumeData, saveResume, setTemplateId } = useResume();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const searchParams = useSearchParams();

  // Écoute dynamique du modèle choisi dans l'URL (avec garde anti-boucle)
  useEffect(() => {
    const templateParam = searchParams.get('template');
    if (templateParam && resumeData.templateId !== templateParam) {
      setTemplateId(templateParam);
    }
  }, [searchParams, setTemplateId, resumeData.templateId]);

  const steps = [
    { title: t('editorStepPersonal'), component: <PersonalInfoStep /> },
    { title: t('editorStepSummary'), component: <SummaryStep /> },
    { title: t('editorStepExperience'), component: <ExperienceStep /> },
    { title: t('editorStepEducation'), component: <EducationStep /> },
    { title: t('editorStepSkills'), component: <SkillsStep /> },
  ];

  const nextStep = () => setCurrentStepIndex(i => Math.min(i + 1, steps.length - 1));
  const prevStep = () => setCurrentStepIndex(i => Math.max(i - 1, 0));

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#E0EFFF]/30">
      
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
               onClick={() => window.print()}
               className="hidden lg:flex px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors shadow-[0_2px_10px_rgba(0,0,0,0.1)]"
             >
               Exporter PDF
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
              onClick={() => {
                saveResume();
                window.location.href = '/dashboard';
              }} 
              className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md transition-all px-6"
            >
               <span className="hidden sm:inline">Terminer & Sauvegarder</span> <ChevronRight className="w-4 h-4 ml-2" />
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
