'use client';
import React from 'react';
import { useResume } from '@/context/ResumeContext';

export function CanadianTemplate2() {
  const { resumeData } = useResume();
  const { personalInfo, professionalSummary, experiences, educations, skills, languages } = resumeData;
  const skillsList = skills.split('\n').filter(s => s.trim() !== '');

  const getCanadianLangLevelLabel = (level: number) => {
    if (level < 30) return 'Beginner';
    if (level < 50) return 'Intermediate A2';
    if (level < 75) return 'Intermediate B2';
    if (level < 95) return 'Fluent / C1';
    return 'Bilingual / C2';
  };

  return (
    <div id="resume-print-area" className="w-full h-full bg-white text-slate-900 p-12 flex flex-col font-sans" style={{ minHeight: '29.7cm' }}>
      
      {/* Header - Modern Left Aligned */}
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-slate-900 tracking-tight mb-1">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <h2 className="text-xl font-medium text-blue-700 tracking-wide mb-4">
          {personalInfo.jobTitle}
        </h2>
        
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.city && <span>{personalInfo.city}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
        </div>
      </div>

      <div className="w-full h-0.5 bg-slate-900 mb-8" />

      {/* Summary */}
      {professionalSummary && (
        <div className="mb-8 break-inside-avoid">
          <h3 className="text-lg font-bold text-slate-900 uppercase tracking-widest mb-3">Profile</h3>
          <p className="text-sm text-slate-700 leading-relaxed text-justify">
            {professionalSummary}
          </p>
        </div>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-bold text-slate-900 uppercase tracking-widest mb-4 border-b border-slate-300 pb-2">Experience</h3>
          <div className="space-y-6">
            {experiences.map((exp, index) => (
              <div key={index} className="break-inside-avoid">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="text-base font-bold text-slate-900">{exp.jobTitle}</h4>
                  <span className="text-sm font-semibold text-blue-700">
                    {exp.startDate} – {exp.endDate || 'Present'}
                  </span>
                </div>
                <div className="text-sm font-medium text-slate-700 mb-3">
                  {exp.company} {exp.city ? `| ${exp.city}` : ''}
                </div>
                {exp.tasks && (
                  <ul className="text-sm text-slate-700 leading-relaxed space-y-1.5 pl-5 list-disc marker:text-slate-400">
                    {exp.tasks.split('\n').map((task, i) => (
                      <li key={i}>{task.replace(/^[•\-\*]\s*/, '')}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skillsList.length > 0 && (
        <div className="mb-8 break-inside-avoid">
          <h3 className="text-lg font-bold text-slate-900 uppercase tracking-widest mb-4 border-b border-slate-300 pb-2">Skills & Expertise</h3>
          <div className="flex flex-wrap gap-2">
            {skillsList.map((skill, i) => (
              <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 text-sm font-medium rounded-md">
                {skill.replace(/^[•\-\*]\s*/, '')}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {educations.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-bold text-slate-900 uppercase tracking-widest mb-4 border-b border-slate-300 pb-2">Education</h3>
          <div className="space-y-4">
            {educations.map((edu, index) => (
              <div key={index} className="break-inside-avoid flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    {edu.degree} {edu.specialty && `- ${edu.specialty}`}
                  </h4>
                  <div className="text-sm text-slate-600">
                    {edu.school} {edu.city ? `, ${edu.city}` : ''}
                  </div>
                </div>
                <span className="text-sm font-semibold text-blue-700 mt-1 sm:mt-0">
                  {edu.startDate} – {edu.endDate || 'Present'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {languages && languages.length > 0 && (
        <div className="mb-8 break-inside-avoid">
          <h3 className="text-lg font-bold text-slate-900 uppercase tracking-widest mb-4 border-b border-slate-300 pb-2">Languages</h3>
          <div className="flex flex-wrap gap-6">
            {languages.map((lang) => (
              <div key={lang.id} className="text-sm text-slate-700 font-medium">
                <span className="font-bold text-slate-900">{lang.name}</span> — {getCanadianLangLevelLabel(lang.level)}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
