'use client';

import React from 'react';
import { CoverLetterRenderer } from './CoverLetterRenderer';

export function CoverLetterPreview() {
  return (
    <div className="w-full max-w-[21cm] bg-white shadow-xl border border-slate-200 transition-all duration-300" style={{ aspectRatio: '1 / 1.414' }}>
      <div className="w-full h-full origin-top-left overflow-y-auto overflow-x-hidden custom-scrollbar">
        <CoverLetterRenderer />
      </div>
    </div>
  );
}
