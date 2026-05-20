'use client';
import React from 'react';
import { useResume } from '@/context/ResumeContext';
import { MapPin, Phone, Mail } from 'lucide-react';

export interface ClassicTheme {
  accentColor: string;
  headingBorder: string;
  dateBadgeBg: string;
  dateBadgeText: string;
}

export function ProTemplateClassic({ theme }: { theme: ClassicTheme }) {
  const { resumeData } = useResume();
  const { personalInfo, professionalSummary, experiences, educations, skills, hobbies, languages } = resumeData;
  const skillsList = skills.split('\n').filter(s => s.trim() !== '');
  const hobbiesList = hobbies.split('\n').filter(h => h.trim() !== '');

  return (
    <div id="resume-print-area" className="w-full h-full bg-white text-slate-800 p-12 flex flex-col" style={{ minHeight: '29.7cm' }}>
      <div className="mb-6 pb-4" style={{ borderBottom: `3px solid ${theme.accentColor}` }}>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900">{personalInfo.firstName} {personalInfo.lastName}</h1>
            <h2 className="text-lg font-medium mt-1" style={{ color: theme.accentColor }}>{personalInfo.jobTitle}</h2>
          </div>
          {personalInfo.photoUrl && (
            <div className="w-20 h-20 rounded-lg overflow-hidden border-2 shrink-0 ml-4" style={{ borderColor: theme.accentColor }}>
              <img src={personalInfo.photoUrl} alt="" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-600 mt-3">
          {personalInfo.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{personalInfo.email}</span>}
          {personalInfo.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{personalInfo.phone}</span>}
          {personalInfo.city && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{personalInfo.city}</span>}
        </div>
      </div>

      {professionalSummary && (
        <div className="mb-6 break-inside-avoid">
          <h3 className="text-sm font-bold uppercase tracking-widest mb-2 pb-1" style={{ color: theme.accentColor, borderBottom: `1px solid ${theme.headingBorder}` }}>Profil</h3>
          <p className="text-sm text-slate-600 leading-relaxed text-justify">{professionalSummary}</p>
        </div>
      )}

      {experiences.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-bold uppercase tracking-widest mb-3 pb-1" style={{ color: theme.accentColor, borderBottom: `1px solid ${theme.headingBorder}` }}>Expérience</h3>
          <div className="space-y-5">
            {experiences.map(exp => (
              <div key={exp.id} className="break-inside-avoid">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-sm font-bold text-slate-800">{exp.jobTitle} <span className="font-normal text-slate-500">— {exp.company}</span></span>
                  <span className="text-xs font-semibold whitespace-nowrap px-2 py-0.5 rounded" style={{ color: theme.dateBadgeText, backgroundColor: theme.dateBadgeBg }}>{exp.startDate} - {exp.endDate || 'Présent'}</span>
                </div>
                {exp.tasks && <ul className="text-xs text-slate-600 space-y-1 pl-4 list-disc mt-1">{exp.tasks.split('\n').map((t, i) => <li key={i}>{t.replace(/^[•\-\*]\s*/, '')}</li>)}</ul>}
              </div>
            ))}
          </div>
        </div>
      )}

      {educations.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-bold uppercase tracking-widest mb-3 pb-1" style={{ color: theme.accentColor, borderBottom: `1px solid ${theme.headingBorder}` }}>Formation</h3>
          {educations.map(edu => (
            <div key={edu.id} className="break-inside-avoid flex justify-between items-baseline mb-2">
              <div><h4 className="text-sm font-bold text-slate-800">{edu.degree}</h4><div className="text-xs text-slate-500">{edu.school}</div></div>
              <span className="text-xs text-slate-500">{edu.startDate} - {edu.endDate || 'Présent'}</span>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 break-inside-avoid">
        {skillsList.length > 0 && (
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-2 pb-1" style={{ color: theme.accentColor, borderBottom: `1px solid ${theme.headingBorder}` }}>Compétences</h3>
            <div className="flex flex-wrap gap-2">{skillsList.map((s, i) => <span key={i} className="px-2 py-1 bg-slate-100 text-xs text-slate-700 rounded">{s.replace(/^[•\-\*]\s*/, '')}</span>)}</div>
          </div>
        )}

        {languages && languages.length > 0 && (
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-2 pb-1" style={{ color: theme.accentColor, borderBottom: `1px solid ${theme.headingBorder}` }}>Langues</h3>
            <div className="space-y-2">
              {languages.map((lang) => (
                <div key={lang.id} className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">{lang.name}</span>
                  <div className="w-1/2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${lang.level}%`, backgroundColor: theme.accentColor }} />
                    </div>
                    <span className="text-slate-500 whitespace-nowrap text-[10px]">{lang.level}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {hobbiesList.length > 0 && (
        <div className="mt-6 break-inside-avoid">
          <h3 className="text-sm font-bold uppercase tracking-widest mb-2 pb-1" style={{ color: theme.accentColor, borderBottom: `1px solid ${theme.headingBorder}` }}>Centres d&apos;intérêt</h3>
          <div className="flex flex-wrap gap-2">{hobbiesList.map((h, i) => <span key={i} className="px-2 py-1 bg-slate-50 text-xs text-slate-600 rounded border border-slate-100">{h.replace(/^[•\-\*]\s*/, '')}</span>)}</div>
        </div>
      )}
    </div>
  );
}
