'use client';

import React from 'react';
import { useCoverLetter } from '@/context/CoverLetterContext';

export function JobApplicationTemplate() {
  const { letterData } = useCoverLetter();

  const bodyParagraphs = letterData.body.split('\n').filter(p => p.trim() !== '');

  return (
    <div id="cover-letter-print-area" className="w-full h-full bg-white text-slate-800 flex flex-col font-sans" style={{ minHeight: '29.7cm' }}>
      
      {/* Header Band — Noir signature */}
      <div className="bg-slate-900 text-white px-12 py-8">
        <h1 className="text-2xl font-extrabold uppercase tracking-wider mb-1">
          Demande d&apos;Emploi
        </h1>
        {letterData.subject && (
          <p className="text-sm text-slate-300 font-medium">{letterData.subject}</p>
        )}
      </div>

      <div className="flex-1 p-12 flex flex-col">
        {/* Top info grid: Sender left, Recipient right */}
        <div className="flex justify-between items-start mb-10">
          {/* Sender */}
          <div className="space-y-0.5 text-sm text-slate-700">
            {letterData.senderFullName && (
              <p className="font-bold text-base text-slate-900">{letterData.senderFullName}</p>
            )}
            {letterData.senderAddress && <p>{letterData.senderAddress}</p>}
            {letterData.senderCity && <p>{letterData.senderCity}</p>}
            {letterData.senderPhone && <p>{letterData.senderPhone}</p>}
            {letterData.senderEmail && <p>{letterData.senderEmail}</p>}
          </div>

          {/* Recipient */}
          <div className="text-right space-y-0.5 text-sm text-slate-700">
            {letterData.recipientName && <p className="font-semibold text-slate-900">{letterData.recipientName}</p>}
            {letterData.recipientTitle && <p className="italic text-slate-500">{letterData.recipientTitle}</p>}
            {letterData.companyName && <p className="font-semibold">{letterData.companyName}</p>}
            {letterData.companyAddress && <p>{letterData.companyAddress}</p>}
            {letterData.companyCity && <p>{letterData.companyCity}</p>}
          </div>
        </div>

        {/* Date */}
        <div className="mb-8 text-sm text-slate-500 font-medium">
          <p>{letterData.senderCity ? letterData.senderCity.split(',')[0] + ', le ' : ''}{letterData.date || 'Date'}</p>
        </div>

        {/* Séparateur noir */}
        <div className="w-12 h-[3px] bg-slate-900 mb-8" />

        {/* Body */}
        <div className="flex-1 space-y-4 text-sm text-slate-700 leading-relaxed text-justify">
          {bodyParagraphs.length > 0 ? (
            bodyParagraphs.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))
          ) : (
            <p className="text-slate-300 italic">Le contenu de votre demande apparaîtra ici...</p>
          )}
        </div>

        {/* Closing */}
        {letterData.closingFormula && (
          <div className="mt-8 text-sm text-slate-700">
            <p>{letterData.closingFormula}</p>
          </div>
        )}

        {/* Signature */}
        <div className="mt-8 flex flex-col items-end">
          {letterData.signatureDataUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={letterData.signatureDataUrl} 
              alt="Signature" 
              className="h-16 w-auto object-contain mb-1"
            />
          )}
          {letterData.senderFullName && (
            <p className="text-sm font-bold text-slate-900">{letterData.senderFullName}</p>
          )}
        </div>
      </div>
    </div>
  );
}
