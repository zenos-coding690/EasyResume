'use client';

import React from 'react';
import { useResume } from '@/context/ResumeContext';
import { TemplateRenderer } from './TemplateRenderer';

export function LivePreview() {
  const { resumeData } = useResume();

  return (
    <div className="w-full max-w-[21cm] bg-white shadow-xl border border-slate-200 transition-all duration-300" style={{ aspectRatio: '1 / 1.414' }}>
      {/* 
        On utilise une technique CSS "transform scale" standard dans l'industrie 
        pour faire rentrer le format A4 (21cm x 29.7cm) de manière responsive dans le conteneur.
      */}
      <div className="w-full h-full origin-top-left overflow-y-auto overflow-x-hidden custom-scrollbar">
         <TemplateRenderer />
      </div>
    </div>
  );
}
