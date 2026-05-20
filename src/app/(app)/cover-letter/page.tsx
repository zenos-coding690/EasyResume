'use client';

import React, { useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { ChevronLeft, ChevronRight, Eye, MousePointerClick, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// --- Mock Data ---
const COVER_LETTERS = [
  { id: 'cl-1', name: 'Lettre Premium 1', category: 'Standard', color: 'bg-slate-800', image: '/images/templates/cl-1.jpg' },
  { id: 'cl-2', name: 'Lettre Premium 2', category: 'Canada', color: 'bg-red-600', image: '/images/templates/cl-2.jpg' }
];

const JOB_APP_LETTERS = [
  { id: 'ja-1', name: 'Demande Spontanée', category: 'Demande d\'emploi', color: 'bg-[#1062FE]', image: '/images/templates/ja-1.jpg' }
];

// --- Helper Component for the Grid ---
function LetterGrid({ 
  title, 
  templates, 
  delay 
}: { 
  title: string, 
  templates: typeof COVER_LETTERS, 
  delay: number 
}) {
  const { t } = useLanguage();

  return (
    <ScrollReveal delay={delay} duration={700} direction="up" className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
          {title}
        </h2>
      </div>

      {/* Grid Container: 2 items on mobile, 4 items on large screens */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 pt-2">
        {templates.map((tpl) => (
          <div 
            key={tpl.id} 
            className="w-full group"
          >
            {/* The Document Thumbnail */}
            <div className="aspect-[1/1.4] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-3 sm:p-5 relative overflow-hidden transition-all duration-500 group-hover:shadow-[0_20px_40px_rgb(16,98,254,0.12)] group-hover:-translate-y-2">
              
              {/* Real Image Render with Auto-fallback to CSS Art on Error */}
              {tpl.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={tpl.image} 
                  alt={tpl.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300 z-0"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              )}

              {/* CSS Art: Simulated Cover Letter Layout (Fallback) */}
              <div className="flex flex-col h-full opacity-60 group-hover:opacity-100 transition-opacity duration-300 relative z-0">
                {/* Header info (right aligned for date/address) */}
                <div className="flex justify-end mb-4 sm:mb-5">
                  <div className="space-y-1 sm:space-y-1.5 w-1/3">
                    <div className="h-1 sm:h-1.5 bg-slate-200 rounded w-full" />
                    <div className="h-1 sm:h-1.5 bg-slate-100 rounded w-5/6" />
                    <div className="h-1 sm:h-1.5 bg-slate-100 rounded w-full" />
                  </div>
                </div>
                
                {/* Object / To */}
                <div className="mb-4 sm:mb-5 space-y-1 sm:space-y-1.5">
                  <div className="h-1.5 sm:h-2 bg-slate-300 rounded w-1/2 mb-1.5 sm:mb-2" />
                  <div className="h-1 sm:h-1.5 bg-slate-200 rounded w-1/3" />
                </div>

                {/* Body paragraphs */}
                <div className="space-y-1.5 sm:space-y-2.5 flex-1">
                  <div className="h-1 sm:h-1.5 bg-slate-100 rounded w-full" />
                  <div className="h-1 sm:h-1.5 bg-slate-100 rounded w-full" />
                  <div className="h-1 sm:h-1.5 bg-slate-100 rounded w-11/12" />
                  
                  <div className="h-1 sm:h-1.5 bg-slate-100 rounded w-full mt-2 sm:mt-3" />
                  <div className="h-1 sm:h-1.5 bg-slate-100 rounded w-full" />
                  <div className="h-1 sm:h-1.5 bg-slate-100 rounded w-10/12" />
                  
                  <div className="h-1 sm:h-1.5 bg-slate-100 rounded w-1/2 mt-2 sm:mt-3" />
                </div>

                {/* Signature */}
                <div className="mt-auto space-y-1 sm:space-y-1.5 w-1/3">
                  <div className="h-1 sm:h-1.5 bg-slate-200 rounded w-full" />
                  <div className="h-1 sm:h-1.5 bg-slate-100 rounded w-3/4" />
                </div>
              </div>

              {/* Hover Action Overlay */}
              <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-2 sm:p-4 space-y-2 sm:space-y-3 z-10">
                <Link href={`/cover-letter-editor?template=${tpl.id}`} className="w-full">
                  <Button className="w-full bg-[#1062FE] hover:bg-blue-600 text-white rounded-lg sm:rounded-xl shadow-lg border-none flex items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs py-1.5 sm:py-2 px-1 sm:px-3 h-auto">
                    <MousePointerClick className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                    <span className="truncate whitespace-nowrap">{t('useTemplateBtn')}</span>
                  </Button>
                </Link>
                <Button className="w-full bg-white text-slate-800 hover:bg-slate-50 rounded-lg sm:rounded-xl shadow border-none flex items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs py-1.5 sm:py-2 px-1 sm:px-3 h-auto">
                  <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate whitespace-nowrap">{t('previewBtn')}</span>
                </Button>
              </div>

              {/* Badge for Canadian format */}
              {tpl.category === 'Canada' && (
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm border border-red-100 px-2 py-0.5 rounded-full shadow-sm flex items-center space-x-1 z-10">
                  <span className="text-[9px] font-bold text-red-600">🍁 CAN</span>
                </div>
              )}
              {tpl.category !== 'Canada' && (
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm border border-slate-100 px-2 py-0.5 rounded-full shadow-sm flex items-center space-x-1 z-10">
                  <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                  <span className="text-[9px] font-bold text-slate-700">PRO</span>
                </div>
              )}
            </div>

            {/* Template Info */}
            <div className="mt-3 text-center">
              <h3 className="font-bold text-slate-800 tracking-tight text-sm">{tpl.name}</h3>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">{tpl.category}</p>
            </div>
          </div>
        ))}
      </div>
    </ScrollReveal>
  );
}

export default function CoverLetterPage() {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto space-y-12 select-none pb-12">
      
      {/* Header */}
      <ScrollReveal delay={100} duration={600} direction="up">
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
            {t('coverLetterTitle')}
          </h1>
          <p className="text-slate-500 text-sm sm:text-base font-medium leading-relaxed max-w-2xl">
            {t('coverLetterSubtitle')}
          </p>
        </div>
      </ScrollReveal>

      {/* Grids */}
      <div className="space-y-16">
        <LetterGrid 
          title={t('sectionCoverLetter')} 
          templates={COVER_LETTERS} 
          delay={200} 
        />
        
        <LetterGrid 
          title={t('sectionJobApp')} 
          templates={JOB_APP_LETTERS} 
          delay={300} 
        />
      </div>

    </div>
  );
}
