'use client';

import React, { useRef, useEffect, useState } from 'react';
import { CoverLetterRenderer } from './CoverLetterRenderer';

export function CoverLetterPreview() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        const containerWidth = entries[0].contentRect.width;
        const baseWidth = 794;
        let newScale = containerWidth / baseWidth;
        if (newScale > 1) newScale = 1;
        setScale(newScale);
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const baseWidth = 794;
  const baseHeight = 1123;
  const scaledHeight = baseHeight * scale;

  return (
    <div 
      ref={containerRef} 
      className="w-full flex justify-center overflow-hidden print:!overflow-visible print:!h-auto transition-all duration-300" 
      style={{ height: `${scaledHeight}px` }}
    >
      <div 
        className="shrink-0 bg-white shadow-[0_0_25px_rgba(0,0,0,0.05)] border border-slate-200 origin-top print:!transform-none print:!w-full print:!h-auto print:shadow-none print:border-none"
        style={{
          width: `${baseWidth}px`,
          height: `${baseHeight}px`,
          transform: `scale(${scale})`,
        }}
      >
        <div className="w-full h-full relative overflow-y-auto overflow-x-hidden custom-scrollbar print:!overflow-visible">
          <div className="hidden print:flex fixed inset-0 z-[9999] pointer-events-none items-center justify-center opacity-10 watermark-overlay">
            <h1 className="text-[100px] sm:text-[140px] font-black text-slate-900 rotate-[-45deg] select-none whitespace-nowrap tracking-widest uppercase">
              MyEasyResume
            </h1>
          </div>
          <CoverLetterRenderer />
        </div>
      </div>
    </div>
  );
}
