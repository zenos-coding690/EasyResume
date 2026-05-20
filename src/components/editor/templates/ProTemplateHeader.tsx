'use client';
import React from 'react';
import { useResume } from '@/context/ResumeContext';
import { MapPin, Phone, Mail } from 'lucide-react';

export interface HeaderTheme {
  headerBg: string;
  headerText: string;
  accentColor: string;
  sectionLabelBg: string;
  sectionLabelText: string;
}

export function ProTemplateHeader({ theme }: { theme: HeaderTheme }) {
  const { resumeData } = useResume();
  const { personalInfo, professionalSummary, experiences, educations, skills, hobbies, languages } = resumeData;
  const skillsList = skills.split('\n').filter(s => s.trim() !== '');
  const hobbiesList = hobbies.split('\n').filter(h => h.trim() !== '');

  return (
    <div id="resume-print-area" className="w-full h-full bg-white text-slate-800 flex flex-col" style={{ minHeight: '29.7cm' }}>
      {/* Big Header */}
      <div className="p-8 flex items-center gap-6" style={{ backgroundColor: theme.headerBg, color: theme.headerText }}>
        {personalInfo.photoUrl && (
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white/30 shrink-0">
            <img src={personalInfo.photoUrl} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <div>
          <h1 className="text-3xl font-extrabold uppercase tracking-wide">{personalInfo.firstName} {personalInfo.lastName}</h1>
          <h2 className="text-base font-medium uppercase tracking-widest opacity-80 mt-1">{personalInfo.jobTitle}</h2>
          <div className="flex flex-wrap gap-4 text-xs mt-3 opacity-90">
            {personalInfo.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{personalInfo.phone}</span>}
            {personalInfo.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{personalInfo.email}</span>}
            {personalInfo.city && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{personalInfo.city}</span>}
          </div>
        </div>
      </div>

      {/* Two Columns */}
      <div className="flex flex-1">
        {/* Left */}
        <div className="w-[35%] p-6 bg-slate-50 border-r border-slate-200 text-xs space-y-6">
          {professionalSummary && (
            <div className="break-inside-avoid">
              <h3 className="font-bold uppercase tracking-widest text-xs mb-2 px-2 py-1 rounded" style={{ backgroundColor: theme.sectionLabelBg, color: theme.sectionLabelText }}>Profil</h3>
              <p className="text-slate-600 leading-relaxed">{professionalSummary}</p>
            </div>
          )}
          {skillsList.length > 0 && (
            <div className="break-inside-avoid">
              <h3 className="font-bold uppercase tracking-widest text-xs mb-2 px-2 py-1 rounded" style={{ backgroundColor: theme.sectionLabelBg, color: theme.sectionLabelText }}>Compétences</h3>
              <ul className="space-y-1 text-slate-700">{skillsList.map((s, i) => <li key={i}>• {s.replace(/^[•\-\*]\s*/, '')}</li>)}</ul>
            </div>
          )}
          {languages && languages.length > 0 && (
            <div className="break-inside-avoid">
              <h3 className="font-bold uppercase tracking-widest text-xs mb-2 px-2 py-1 rounded" style={{ backgroundColor: theme.sectionLabelBg, color: theme.sectionLabelText }}>Langues</h3>
              <div className="space-y-2 px-1 text-slate-700">
                {languages.map((lang) => (
                  <div key={lang.id} className="space-y-0.5">
                    <div className="flex justify-between font-semibold text-[10px]">
                      <span>{lang.name}</span>
                      <span className="opacity-80">{lang.level}%</span>
                    </div>
                    <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${lang.level}%`, backgroundColor: theme.accentColor }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {hobbiesList.length > 0 && (
            <div className="break-inside-avoid">
              <h3 className="font-bold uppercase tracking-widest text-xs mb-2 px-2 py-1 rounded" style={{ backgroundColor: theme.sectionLabelBg, color: theme.sectionLabelText }}>Loisirs</h3>
              <ul className="space-y-1 text-slate-700">{hobbiesList.map((h, i) => <li key={i}>■ {h.replace(/^[•\-\*]\s*/, '')}</li>)}</ul>
            </div>
          )}
        </div>
        {/* Right */}
        <div className="flex-1 p-6 text-xs space-y-6">
          {experiences.length > 0 && (
            <div>
              <h3 className="font-bold uppercase tracking-widest text-xs mb-3 px-2 py-1 rounded" style={{ backgroundColor: theme.sectionLabelBg, color: theme.sectionLabelText }}>Expérience</h3>
              <div className="space-y-5">
                {experiences.map(exp => (
                  <div key={exp.id} className="break-inside-avoid">
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-bold text-sm text-slate-900">{exp.jobTitle}</h4>
                      <span className="font-semibold whitespace-nowrap" style={{ color: theme.accentColor }}>{exp.startDate} - {exp.endDate || 'Présent'}</span>
                    </div>
                    <div className="text-slate-500 mb-1 italic">{exp.company}{exp.city ? `, ${exp.city}` : ''}</div>
                    {exp.tasks && <ul className="text-slate-600 space-y-1 pl-4 list-disc">{exp.tasks.split('\n').map((t, i) => <li key={i}>{t.replace(/^[•\-\*]\s*/, '')}</li>)}</ul>}
                  </div>
                ))}
              </div>
            </div>
          )}
          {educations.length > 0 && (
            <div>
              <h3 className="font-bold uppercase tracking-widest text-xs mb-3 px-2 py-1 rounded" style={{ backgroundColor: theme.sectionLabelBg, color: theme.sectionLabelText }}>Formation</h3>
              {educations.map(edu => (
                <div key={edu.id} className="break-inside-avoid mb-3">
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-bold text-slate-900">{edu.degree}</h4>
                    <span className="text-slate-500">{edu.startDate} - {edu.endDate || 'Présent'}</span>
                  </div>
                  <div className="text-slate-500">{edu.school}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
