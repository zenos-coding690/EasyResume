'use client';
import React from 'react';
import { useResume } from '@/context/ResumeContext';
import { MapPin, Phone, Mail, Globe, Link } from 'lucide-react';

export function CanadianTemplate1() {
  const { resumeData } = useResume();
  const { personalInfo, professionalSummary, experiences, educations, skills, languages, references } = resumeData;

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
      
      {/* Header (No Photo, No DOB) */}
      <div className="text-center mb-8 pb-6 border-b-2 border-slate-200">
        <h1 className="text-4xl font-extrabold uppercase tracking-widest text-slate-900 mb-2">
          {personalInfo.firstName || 'First'} {personalInfo.lastName || 'Last'}
        </h1>
        <h2 className="text-lg font-semibold text-slate-500 uppercase tracking-wide mb-4">
          {personalInfo.jobTitle || 'Job Title'}
        </h2>
        
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-600">
          {personalInfo.city && (
            <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" /> {personalInfo.city}</span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center"><Phone className="w-3.5 h-3.5 mr-1 text-slate-400" /> {personalInfo.phone}</span>
          )}
          {personalInfo.email && (
            <span className="flex items-center"><Mail className="w-3.5 h-3.5 mr-1 text-slate-400" /> {personalInfo.email}</span>
          )}
          {personalInfo.linkedin && (
            <span className="flex items-center"><Link className="w-3.5 h-3.5 mr-1 text-slate-400" /> {personalInfo.linkedin}</span>
          )}
          {personalInfo.website && (
            <span className="flex items-center"><Globe className="w-3.5 h-3.5 mr-1 text-slate-400" /> {personalInfo.website}</span>
          )}
        </div>
      </div>

      {/* Summary */}
      {professionalSummary && (
        <div className="mb-8 break-inside-avoid">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-3 border-b border-slate-200 pb-1">
            Professional Summary
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed text-justify">
            {professionalSummary}
          </p>
        </div>
      )}

      {/* Core Competencies (Skills) - Very important in Canadian Resumes */}
      {skillsList.length > 0 && (
        <div className="mb-8 break-inside-avoid">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-3 border-b border-slate-200 pb-1">
            Core Competencies
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {skillsList.map((skill, i) => (
              <div key={i} className="flex items-start text-sm text-slate-700">
                <span className="mr-2 font-bold text-slate-400">•</span>
                {skill.replace(/^[•\-\*]\s*/, '')}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Professional Experience */}
      {experiences.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-4 border-b border-slate-200 pb-1">
            Professional Experience
          </h3>
          <div className="space-y-6">
            {experiences.map((exp, index) => (
              <div key={index} className="break-inside-avoid">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="text-sm font-bold text-slate-900">{exp.jobTitle}</h4>
                  <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                    {exp.startDate} – {exp.endDate || 'Present'}
                  </span>
                </div>
                <div className="text-sm font-semibold text-slate-600 mb-2 italic">
                  {exp.company}{exp.city ? `, ${exp.city}` : ''}
                </div>
                {exp.tasks && (
                  <ul className="text-sm text-slate-700 leading-relaxed space-y-1.5 pl-4 list-disc marker:text-slate-400">
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

      {/* Education */}
      {educations.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-4 border-b border-slate-200 pb-1">
            Education
          </h3>
          <div className="space-y-4">
            {educations.map((edu, index) => (
              <div key={index} className="break-inside-avoid flex justify-between items-baseline">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {edu.degree} {edu.specialty && `in ${edu.specialty}`}
                  </h4>
                  <div className="text-sm text-slate-600 italic">
                    {edu.school}{edu.city ? `, ${edu.city}` : ''}
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                  {edu.startDate} – {edu.endDate || 'Present'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

        {/* Langues */}
        {languages && languages.length > 0 && (
          <div className="mb-6 break-inside-avoid">
            <h3 className="text-sm font-bold uppercase tracking-widest border-b border-slate-300 pb-1 mb-3 text-slate-800">
              Langues
            </h3>
            <ul className="space-y-1 text-xs text-slate-700">
              {languages.map((lang) => (
                <li key={lang.id}>
                  <span className="font-semibold">{lang.name}</span> : <span className="text-slate-500">{lang.level}%</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* References */}
        {references && references.length > 0 && (
          <div className="mb-6 break-inside-avoid">
            <h3 className="text-sm font-bold uppercase tracking-widest border-b border-slate-300 pb-1 mb-3 text-slate-800">
              Références
            </h3>
            <div className="space-y-3 text-xs">
              {references.map(ref => (
                <div key={ref.id} className="break-inside-avoid">
                  <div className="font-bold text-slate-900">{ref.name}</div>
                  <div className="text-slate-600 font-medium">{ref.position} — {ref.company}</div>
                  <div className="text-slate-500 mt-0.5">{ref.email} {ref.phone && `• ${ref.phone}`}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
}
