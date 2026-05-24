'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ResumeData } from '@/context/ResumeContext';
import { supabase } from '@/lib/supabase';

// --- Structure de données de la lettre de motivation ---

export interface CoverLetterData {
  // Expéditeur
  senderFullName: string;
  senderAddress: string;
  senderCity: string;
  senderPhone: string;
  senderEmail: string;

  // Destinataire
  recipientName: string;
  recipientTitle: string;
  companyName: string;
  companyAddress: string;
  companyCity: string;

  // Méta
  date: string;
  subject: string;
  jobTitle: string;

  // Contenu
  body: string;
  closingFormula: string;

  // Signature
  signatureDataUrl: string;

  // Brief IA
  aiBrief: string;

  // Template
  templateId: string;
}

// CV sauvegardé (entrée du localStorage)
export interface SavedResume {
  id: number;
  title: string;
  lastEdited: string;
  thumbnail: string;
  data: ResumeData;
}

const today = new Date();
const formattedDate = today.toLocaleDateString('fr-FR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const initialCoverLetterData: CoverLetterData = {
  senderFullName: '',
  senderAddress: '',
  senderCity: '',
  senderPhone: '',
  senderEmail: '',
  recipientName: '',
  recipientTitle: '',
  companyName: '',
  companyAddress: '',
  companyCity: '',
  date: formattedDate,
  subject: '',
  jobTitle: '',
  body: '',
  closingFormula: 'Veuillez agréer, Madame, Monsieur, l\'expression de mes salutations distinguées.',
  signatureDataUrl: '',
  aiBrief: '',
  templateId: 'cl-1',
};

// --- Type du Contexte ---
interface CoverLetterContextType {
  letterData: CoverLetterData;
  updateField: (field: keyof CoverLetterData, value: string) => void;
  setSignature: (dataUrl: string) => void;
  clearSignature: () => void;
  setTemplateId: (id: string) => void;
  saveLetter: (letterId?: string | null) => Promise<void>;
  // Sélecteur de CV
  selectedResume: SavedResume | null;
  setSelectedResume: (resume: SavedResume | null) => void;
}

const CoverLetterContext = createContext<CoverLetterContextType | undefined>(undefined);

export function CoverLetterProvider({ children }: { children: ReactNode }) {
  const [letterData, setLetterData] = useState<CoverLetterData>(initialCoverLetterData);
  const [selectedResume, setSelectedResume] = useState<SavedResume | null>(null);

  const updateField = (field: keyof CoverLetterData, value: string) => {
    setLetterData(prev => ({ ...prev, [field]: value }));
  };

  const setSignature = (dataUrl: string) => {
    setLetterData(prev => ({ ...prev, signatureDataUrl: dataUrl }));
  };

  const clearSignature = () => {
    setLetterData(prev => ({ ...prev, signatureDataUrl: '' }));
  };

  const setTemplateId = (id: string) => {
    setLetterData(prev => ({ ...prev, templateId: id }));
  };

  const saveLetter = async (letterId?: string | null) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        console.error("User not logged in");
        return;
      }

      if (letterId) {
        const { error } = await supabase.from('cover_letters').update({
          title: letterData.subject || 'Lettre Sans Titre',
          template_id: letterData.templateId,
          data: letterData,
          updated_at: new Date().toISOString()
        }).eq('id', letterId).eq('user_id', session.user.id);
        
        if (error) console.error('Error updating cover letter:', error);
        else console.log("Cover letter updated successfully!");
      } else {
        const { error } = await supabase.from('cover_letters').insert({
          user_id: session.user.id,
          title: letterData.subject || 'Lettre Sans Titre',
          template_id: letterData.templateId,
          data: letterData
        });

        if (error) console.error('Error saving cover letter to Supabase:', error);
        else console.log("Cover letter saved successfully!");
      }
    } catch (e) {
      console.error('Error saving cover letter', e);
    }
  };

  return (
    <CoverLetterContext.Provider value={{
      letterData,
      updateField,
      setSignature,
      clearSignature,
      setTemplateId,
      saveLetter,
      selectedResume,
      setSelectedResume,
    }}>
      {children}
    </CoverLetterContext.Provider>
  );
}

export function useCoverLetter() {
  const context = useContext(CoverLetterContext);
  if (context === undefined) {
    throw new Error('useCoverLetter must be used within a CoverLetterProvider');
  }
  return context;
}
