'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useCoverLetter } from '@/context/CoverLetterContext';
import { EditorStepper } from '@/components/editor/EditorStepper';
import { CoverLetterPreview } from '@/components/cover-letter-editor/CoverLetterPreview';
import { SenderInfoStep } from '@/components/cover-letter-editor/steps/SenderInfoStep';
import { RecipientStep } from '@/components/cover-letter-editor/steps/RecipientStep';
import { ContentStep } from '@/components/cover-letter-editor/steps/ContentStep';
import { Button } from '@/components/ui/button';
import { Eye, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useTokens } from '@/context/TokenContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

function CoverLetterEditorContent() {
  const { t } = useLanguage();
  const { letterData, setTemplateId, saveLetter } = useCoverLetter();
  const { downloadCredits, consumeDownloadCredit, openDownloadModal } = useTokens();
  const router = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isProcessingDownload, setIsProcessingDownload] = useState(false);
  const searchParams = useSearchParams();
  const letterId = searchParams.get('letter');

  // Écoute dynamique du modèle choisi dans l'URL (avec garde anti-boucle)
  useEffect(() => {
    const templateParam = searchParams.get('template');
    if (templateParam && letterData.templateId !== templateParam) {
      setTemplateId(templateParam);
    }
  }, [searchParams, setTemplateId, letterData.templateId]);

  // Vérification de l'état du déblocage
  useEffect(() => {
    const checkUnlockStatus = async () => {
      if (!letterId) return;
      const { data } = await supabase.from('cover_letters').select('unlocked_until').eq('id', letterId).single();
      if (data && data.unlocked_until) {
        if (new Date(data.unlocked_until) > new Date()) setIsUnlocked(true);
      }
    };
    checkUnlockStatus();
  }, [letterId]);

  useEffect(() => {
    if (searchParams.get('print') === '1') {
      handlePremiumDownload();
    }
  }, [searchParams]);

  const triggerPrint = () => {
    setIsUnlocked(true);
    setTimeout(() => window.print(), 500);
  };

  const handlePremiumDownload = async () => {
    if (!letterId) {
      alert("Veuillez d'abord 'Terminer & Sauvegarder' votre lettre avant de la télécharger.");
      return;
    }

    if (isProcessingDownload) return;
    setIsProcessingDownload(true);

    try {
      const { data } = await supabase.from('cover_letters').select('unlocked_until').eq('id', letterId).single();
      let hasGracePeriod = false;
      if (data && data.unlocked_until) {
        if (new Date(data.unlocked_until) > new Date()) hasGracePeriod = true;
      }

      if (hasGracePeriod) {
        triggerPrint();
      } else {
        if (downloadCredits > 0) {
          const confirmUnlock = window.confirm(
            "Télécharger cette lettre (sans filigrane) coûte 1 crédit de téléchargement.\n\n" +
            "Ce document restera déverrouillé pendant 15 minutes.\n\n" +
            `Solde actuel : ${downloadCredits} crédits.\n\nConfirmer ?`
          );
          if (confirmUnlock) {
            const success = await consumeDownloadCredit(letterId, 'cover_letter');
            if (success) triggerPrint();
            else alert("Erreur lors de l'utilisation du crédit.");
          }
        } else {
          openDownloadModal();
        }
      }
    } catch (e) {
      alert("Une erreur est survenue.");
    } finally {
      setIsProcessingDownload(false);
    }
  };

  const steps = [
    { title: t('clStepSender'), component: <SenderInfoStep /> },
    { title: t('clStepRecipient'), component: <RecipientStep /> },
    { title: t('clStepContent'), component: <ContentStep /> },
  ];

  const nextStep = () => setCurrentStepIndex(i => Math.min(i + 1, steps.length - 1));
  const prevStep = () => setCurrentStepIndex(i => Math.max(i - 1, 0));

  return (
    <div className={`fixed inset-0 z-50 flex overflow-hidden bg-[#E0EFFF]/30 ${isUnlocked ? 'unlocked-print' : ''}`}>
      
      {/* LEFT PANE: Form Wizard */}
      <div className={`w-full lg:w-[45%] xl:w-[40%] flex flex-col h-full bg-white border-r border-slate-100 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 ${showMobilePreview ? 'hidden lg:flex' : 'flex'} print:hidden`}>
        
        {/* Top Bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <Link href="/cover-letter" className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors">
            {t('clBtnQuit')}
          </Link>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">
              {t('clEditorTitle')} — Étape {currentStepIndex + 1}/{steps.length}
            </span>
          </div>
          <div>
            <button 
              onClick={handlePremiumDownload}
              disabled={isProcessingDownload}
              className={`hidden lg:flex px-4 py-2 text-white rounded-xl text-xs font-bold transition-colors shadow-[0_2px_10px_rgba(0,0,0,0.1)] ${isProcessingDownload ? 'bg-slate-400' : 'bg-slate-900 hover:bg-slate-800'}`}
            >
              {isProcessingDownload ? 'Vérification...' : t('clBtnExportPdf')}
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

        {/* Bottom Navigation */}
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
                await saveLetter();
                // Navigation douce via Next.js router (pas de hard reload)
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
                <><span className="hidden sm:inline">{t('clBtnFinish')}</span><ChevronRight className="w-4 h-4 ml-2" /></>
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
          <CoverLetterPreview />
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

export default function CoverLetterEditorPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-full items-center justify-center bg-[#E0EFFF]/30">
        <div className="text-slate-500 font-semibold animate-pulse text-sm">Chargement de votre éditeur premium...</div>
      </div>
    }>
      <CoverLetterEditorContent />
    </Suspense>
  );
}
