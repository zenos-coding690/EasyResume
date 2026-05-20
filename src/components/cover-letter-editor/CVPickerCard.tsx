'use client';

import React, { useState, useEffect } from 'react';
import { useCoverLetter, SavedResume } from '@/context/CoverLetterContext';
import { useLanguage } from '@/context/LanguageContext';
import { FileText, CheckCircle2, ChevronDown, ChevronUp, Clock, Layers } from 'lucide-react';

export function CVPickerCard() {
  const { selectedResume, setSelectedResume } = useCoverLetter();
  const { t } = useLanguage();
  const [savedResumes, setSavedResumes] = useState<SavedResume[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Lecture du localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('my_easy_resumes');
      if (raw) {
        const parsed = JSON.parse(raw) as SavedResume[];
        setSavedResumes(parsed);
      }
    } catch {
      setSavedResumes([]);
    }
  }, []);

  const handleSelect = (resume: SavedResume) => {
    setSelectedResume(resume);
    setIsOpen(false);
  };

  const handleDeselect = () => {
    setSelectedResume(null);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between bg-gradient-to-r from-slate-50 to-blue-50/30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#1062FE]/10 flex items-center justify-center">
            <Layers className="w-4 h-4 text-[#1062FE]" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">{t('clPickCv')}</p>
            <p className="text-xs text-slate-400 font-medium">{t('clPickCvHint')}</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(v => !v)}
          className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-400"
        >
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* CV sélectionné (toujours visible) */}
      {selectedResume && (
        <div className="px-5 py-3 bg-emerald-50 border-t border-emerald-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-bold text-emerald-800 truncate">{t('clPickCvActive')} : {selectedResume.title}</p>
              <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                <Clock className="w-3 h-3" /> {t('clPickCvEdited')} {selectedResume.lastEdited}
              </p>
            </div>
          </div>
          <button
            onClick={handleDeselect}
            className="text-xs font-semibold text-emerald-700 hover:text-red-500 transition-colors shrink-0"
          >
            ✕
          </button>
        </div>
      )}

      {/* Liste déroulante des CVs */}
      {isOpen && (
        <div className="border-t border-slate-100">
          {savedResumes.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <FileText className="w-8 h-8 text-slate-200 mx-auto mb-2" />
              <p className="text-xs text-slate-400 font-medium">{t('clPickCvNone')}</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50 max-h-72 overflow-y-auto">
              {savedResumes.map((resume) => {
                const isSelected = selectedResume?.id === resume.id;
                return (
                  <div
                    key={resume.id}
                    className={`flex items-center gap-4 px-5 py-4 transition-all cursor-pointer group
                      ${isSelected
                        ? 'bg-blue-50/80 border-l-2 border-[#1062FE]'
                        : 'hover:bg-slate-50 border-l-2 border-transparent'
                      }`}
                    onClick={() => handleSelect(resume)}
                  >
                    {/* Miniature ou icône */}
                    <div className="w-12 h-16 rounded-lg overflow-hidden bg-gradient-to-b from-slate-100 to-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                      {resume.thumbnail && !resume.thumbnail.includes('unsplash') ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={resume.thumbnail} alt={resume.title} className="w-full h-full object-cover" />
                      ) : (
                        <FileText className="w-5 h-5 text-slate-400" />
                      )}
                    </div>

                    {/* Infos */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold truncate ${isSelected ? 'text-[#1062FE]' : 'text-slate-800 group-hover:text-slate-900'}`}>
                        {resume.title || 'CV Sans Titre'}
                      </p>
                      {resume.data?.personalInfo && (
                        <p className="text-xs text-slate-400 font-medium truncate mt-0.5">
                          {[resume.data.personalInfo.firstName, resume.data.personalInfo.lastName].filter(Boolean).join(' ')}
                          {resume.data.experiences?.length > 0 && ` · ${resume.data.experiences.length} exp.`}
                          {resume.data.skills && ` · compétences`}
                        </p>
                      )}
                      <p className="text-xs text-slate-300 font-medium mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {t('clPickCvEdited')} {resume.lastEdited}
                      </p>
                    </div>

                    {/* Bouton sélection */}
                    <div className="shrink-0">
                      {isSelected ? (
                        <div className="w-6 h-6 rounded-full bg-[#1062FE] flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-[#1062FE] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {t('clPickCvSelect')} →
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
