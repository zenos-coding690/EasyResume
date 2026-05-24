'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

// --- Interfaces pour la structure de données du CV ---

export interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  city: string;
  startDate: string;
  endDate: string;
  tasks: string; 
}

export interface Education {
  id: string;
  degree: string;
  specialty: string;
  school: string;
  city: string;
  startDate: string;
  endDate: string;
}

export interface Reference {
  id: string;
  name: string;
  position: string;
  company: string;
  email: string;
  phone: string;
}

export interface LanguageItem {
  id: string;
  name: string;
  level: number; // 0 to 100
}

export interface PersonalInfo {
  photoUrl: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  city: string;
  phone: string;
  email: string;
  dob: string;
  linkedin: string;
  website: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  professionalSummary: string;
  experiences: Experience[];
  educations: Education[];
  skills: string;
  hobbies: string;
  languages: LanguageItem[];
  references: Reference[];
  templateId: string;
}

// --- État initial vide ---
const initialResumeData: ResumeData = {
  personalInfo: {
    photoUrl: '',
    firstName: '',
    lastName: '',
    jobTitle: '',
    city: '',
    phone: '',
    email: '',
    dob: '',
    linkedin: '',
    website: ''
  },
  professionalSummary: '',
  experiences: [],
  educations: [],
  skills: '',
  hobbies: '',
  languages: [],
  references: [],
  templateId: 'pro-1'
};

// --- Type du Contexte ---
interface ResumeContextType {
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
  updatePersonalInfo: (field: keyof PersonalInfo, value: string) => void;
  updateSummary: (summary: string) => void;
  addExperience: (exp: Experience) => void;
  updateExperience: (id: string, field: keyof Experience, value: string) => void;
  removeExperience: (id: string) => void;
  updateEducation: (id: string, field: keyof Education, value: string) => void;
  removeEducation: (id: string) => void;
  updateSkills: (skills: string) => void;
  updateHobbies: (hobbies: string) => void;
  addLanguage: (lang: LanguageItem) => void;
  updateLanguage: (id: string, field: keyof LanguageItem, value: string | number) => void;
  removeLanguage: (id: string) => void;
  addReference: (ref: Reference) => void;
  updateReference: (id: string, field: keyof Reference, value: string) => void;
  removeReference: (id: string) => void;
  setTemplateId: (id: string) => void;
  saveResume: (resumeId?: string | null) => Promise<void>;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);

  // Méthodes utilitaires pour faciliter la mise à jour partielle
  const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
    setResumeData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, [field]: value } }));
  };

  const updateSummary = (summary: string) => {
    setResumeData(prev => ({ ...prev, professionalSummary: summary }));
  };

  const addExperience = (exp: Experience) => {
    setResumeData(prev => ({ ...prev, experiences: [...prev.experiences, exp] }));
  };

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
    }));
  };

  const removeExperience = (id: string) => {
    setResumeData(prev => ({ ...prev, experiences: prev.experiences.filter(exp => exp.id !== id) }));
  };

  const addEducation = (edu: Education) => {
    setResumeData(prev => ({ ...prev, educations: [...prev.educations, edu] }));
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setResumeData(prev => ({
      ...prev,
      educations: prev.educations.map(edu => edu.id === id ? { ...edu, [field]: value } : edu)
    }));
  };

  const removeEducation = (id: string) => {
    setResumeData(prev => ({ ...prev, educations: prev.educations.filter(edu => edu.id !== id) }));
  };

  const updateSkills = (skills: string) => {
    setResumeData(prev => ({ ...prev, skills }));
  };

  const updateHobbies = (hobbies: string) => {
    setResumeData(prev => ({ ...prev, hobbies }));
  };

  const addLanguage = (lang: LanguageItem) => {
    setResumeData(prev => ({ ...prev, languages: [...prev.languages, lang] }));
  };

  const updateLanguage = (id: string, field: keyof LanguageItem, value: string | number) => {
    setResumeData(prev => ({
      ...prev,
      languages: prev.languages.map(lang => lang.id === id ? { ...lang, [field]: value } : lang)
    }));
  };

  const removeLanguage = (id: string) => {
    setResumeData(prev => ({ ...prev, languages: prev.languages.filter(lang => lang.id !== id) }));
  };

  const addReference = (ref: Reference) => {
    setResumeData(prev => ({ ...prev, references: [...(prev.references || []), ref] }));
  };

  const updateReference = (id: string, field: keyof Reference, value: string) => {
    setResumeData(prev => ({
      ...prev,
      references: (prev.references || []).map(ref => ref.id === id ? { ...ref, [field]: value } : ref)
    }));
  };

  const removeReference = (id: string) => {
    setResumeData(prev => ({ ...prev, references: (prev.references || []).filter(ref => ref.id !== id) }));
  };

  const setTemplateId = (id: string) => {
    setResumeData(prev => ({ ...prev, templateId: id }));
  };

  const saveResume = async (resumeId?: string | null) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        console.error("User not logged in");
        return;
      }
      
      if (resumeId) {
        const { error } = await supabase.from('resumes').update({
          title: resumeData.personalInfo.jobTitle || 'CV Sans Titre',
          template_id: resumeData.templateId,
          data: resumeData,
          updated_at: new Date().toISOString()
        }).eq('id', resumeId).eq('user_id', session.user.id);
        
        if (error) console.error("Error updating resume:", error);
        else console.log("Resume updated successfully!");
      } else {
        const { error } = await supabase.from('resumes').insert({
          user_id: session.user.id,
          title: resumeData.personalInfo.jobTitle || 'CV Sans Titre',
          template_id: resumeData.templateId,
          data: resumeData
        });

        if (error) console.error("Error saving resume to Supabase:", error);
        else console.log("Resume saved successfully!");
      }
    } catch (e) {
      console.error("Error saving resume", e);
    }
  };

  return (
    <ResumeContext.Provider value={{
      resumeData, setResumeData,
      updatePersonalInfo, updateSummary,
      addExperience, updateExperience, removeExperience,
      addEducation, updateEducation, removeEducation,
      updateSkills, updateHobbies, 
      addLanguage, updateLanguage, removeLanguage,
      addReference, updateReference, removeReference,
      setTemplateId, saveResume
    }}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
}
