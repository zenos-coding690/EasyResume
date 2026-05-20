'use client';

import React from 'react';
import { useCoverLetter } from '@/context/CoverLetterContext';

export function CoverLetterTemplate1() {
  const { letterData } = useCoverLetter();

  const bodyParagraphs = letterData.body.split('\n').filter(p => p.trim() !== '');

  return (
    <div id="cover-letter-print-area" className="w-full h-full bg-white text-slate-800 p-12 flex flex-col font-sans" style={{ minHeight: '29.7cm' }}>
      
      {/* En-tête : Expéditeur à gauche, Date à droite */}
      <div className="flex justify-between items-start mb-10">
        {/* Expéditeur */}
        <div className="space-y-0.5 text-sm text-slate-700">
          {letterData.senderFullName && (
            <p className="font-bold text-base text-slate-900">{letterData.senderFullName}</p>
          )}
          {letterData.senderAddress && <p>{letterData.senderAddress}</p>}
          {letterData.senderCity && <p>{letterData.senderCity}</p>}
          {letterData.senderPhone && <p>{letterData.senderPhone}</p>}
          {letterData.senderEmail && <p>{letterData.senderEmail}</p>}
        </div>

        {/* Date */}
        <div className="text-sm text-slate-500 font-medium text-right">
          {letterData.senderCity && <p>{letterData.senderCity.split(',')[0]},</p>}
          <p>{letterData.date || 'Date'}</p>
        </div>
      </div>

      {/* Destinataire */}
      <div className="mb-8 space-y-0.5 text-sm text-slate-700">
        {letterData.recipientName && <p className="font-semibold text-slate-900">{letterData.recipientName}</p>}
        {letterData.recipientTitle && <p className="italic text-slate-500">{letterData.recipientTitle}</p>}
        {letterData.companyName && <p className="font-semibold">{letterData.companyName}</p>}
        {letterData.companyAddress && <p>{letterData.companyAddress}</p>}
        {letterData.companyCity && <p>{letterData.companyCity}</p>}
      </div>

      {/* Objet */}
      {letterData.subject && (
        <div className="mb-8">
          <p className="text-sm text-slate-800">
            <span className="font-bold">Objet :</span> {letterData.subject}
          </p>
        </div>
      )}

      {/* Ligne de séparation subtile */}
      <div className="w-16 h-[2px] bg-slate-300 mb-8" />

      {/* Corps de la lettre */}
      <div className="flex-1 space-y-4 text-sm text-slate-700 leading-relaxed text-justify">
        {bodyParagraphs.length > 0 ? (
          bodyParagraphs.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))
        ) : (
          <p className="text-slate-300 italic">Le contenu de votre lettre apparaîtra ici...</p>
        )}
      </div>

      {/* Formule de politesse */}
      {letterData.closingFormula && (
        <div className="mt-8 text-sm text-slate-700">
          <p>{letterData.closingFormula}</p>
        </div>
      )}

      {/* Signature + Nom */}
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
  );
}
