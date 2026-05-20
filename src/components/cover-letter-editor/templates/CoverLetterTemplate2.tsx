'use client';

import React from 'react';
import { useCoverLetter } from '@/context/CoverLetterContext';

export function CoverLetterTemplate2() {
  const { letterData } = useCoverLetter();

  const bodyParagraphs = letterData.body.split('\n').filter(p => p.trim() !== '');

  return (
    <div id="cover-letter-print-area" className="w-full h-full bg-white text-slate-800 p-12 flex flex-col font-sans" style={{ minHeight: '29.7cm' }}>
      
      {/* Canadian Format: Date first, then sender info */}
      <div className="mb-6 text-sm text-slate-600 font-medium">
        <p>{letterData.date || 'Date'}</p>
      </div>

      {/* Sender Block */}
      <div className="mb-8 space-y-0.5 text-sm text-slate-700">
        {letterData.senderFullName && (
          <p className="font-bold text-lg text-slate-900">{letterData.senderFullName}</p>
        )}
        {letterData.senderAddress && <p>{letterData.senderAddress}</p>}
        {letterData.senderCity && <p>{letterData.senderCity}</p>}
        {letterData.senderPhone && <p>{letterData.senderPhone}</p>}
        {letterData.senderEmail && (
          <p className="text-indigo-700 font-medium">{letterData.senderEmail}</p>
        )}
      </div>

      {/* Thin indigo line */}
      <div className="w-full h-[2px] bg-gradient-to-r from-indigo-600 to-indigo-300 mb-8" />

      {/* Recipient Block */}
      <div className="mb-8 space-y-0.5 text-sm text-slate-700">
        {letterData.recipientName && <p className="font-semibold text-slate-900">{letterData.recipientName}</p>}
        {letterData.recipientTitle && <p className="text-slate-500">{letterData.recipientTitle}</p>}
        {letterData.companyName && <p className="font-semibold">{letterData.companyName}</p>}
        {letterData.companyAddress && <p>{letterData.companyAddress}</p>}
        {letterData.companyCity && <p>{letterData.companyCity}</p>}
      </div>

      {/* Subject */}
      {letterData.subject && (
        <div className="mb-6 py-2 border-l-4 border-indigo-600 pl-4">
          <p className="text-sm font-bold text-slate-900">
            Re: {letterData.subject}
          </p>
        </div>
      )}

      {/* Body */}
      <div className="flex-1 space-y-4 text-sm text-slate-700 leading-relaxed text-justify">
        {bodyParagraphs.length > 0 ? (
          bodyParagraphs.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))
        ) : (
          <p className="text-slate-300 italic">Your letter content will appear here...</p>
        )}
      </div>

      {/* Closing */}
      {letterData.closingFormula && (
        <div className="mt-8 text-sm text-slate-700">
          <p>{letterData.closingFormula}</p>
        </div>
      )}

      {/* Signature */}
      <div className="mt-6 flex flex-col items-start">
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
  );
}
