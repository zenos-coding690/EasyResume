'use client';
import React from 'react';
import { useResume } from '@/context/ResumeContext';

export function CanadianTemplate3() {
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
    <div id="resume-print-area" className="w-full h-full bg-white text-slate-800 flex shadow-sm relative" style={{ minHeight: '29.7cm' }}>
      
      {/* Sidebar (Left) - Fixed for multi-page print */}
      <div className="w-[30%] bg-slate-100 p-8 flex flex-col border-r border-slate-200 print:fixed print:left-0 print:top-0 print:bottom-0 print:h-screen">
        
        {/* Name in Sidebar */}
        <div className="mb-10 text-right">
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-2">
            {personalInfo.firstName}<br/><span className="text-indigo-600">{personalInfo.lastName}</span>
          </h1>
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-4">
            {personalInfo.jobTitle}
          </h2>
        </div>

        {/* Contact */}
        <div className="mb-10 text-right space-y-2 text-xs font-medium text-slate-600">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Contact</h3>
          {personalInfo.city && <p>{personalInfo.city}</p>}
          {personalInfo.phone && <p>{personalInfo.phone}</p>}
          {personalInfo.email && <p className="break-all">{personalInfo.email}</p>}
          {personalInfo.linkedin && <p className="break-all">{personalInfo.linkedin}</p>}
        </div>

        {/* Skills */}
        {skillsList.length > 0 && (
          <div className="mb-10 text-right">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Competencies</h3>
            <ul className="space-y-2 text-xs font-semibold text-slate-700">
              {skillsList.map((skill, i) => (
                <li key={i}>{skill.replace(/^[•\-\*]\s*/, '')}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Languages */}
        {languages && languages.length > 0 && (
          <div className="text-right">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Languages</h3>
            <ul className="space-y-2 text-xs font-semibold text-slate-700">
              {languages.map((lang) => (
                <li key={lang.id}>
                  {lang.name} <span className="text-[10px] font-normal text-slate-500">({getCanadianLangLevelLabel(lang.level)})</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* References */}
        {references && references.length > 0 && (
          <div className="text-right mt-10">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">References</h3>
            <div className="space-y-4 text-xs font-semibold text-slate-700">
              {references.map((ref) => (
                <div key={ref.id}>
                  <div className="font-bold text-slate-900">{ref.name}</div>
                  <div className="text-[10px] text-slate-500 font-medium">{ref.position} — {ref.company}</div>
                  <div className="text-[10px] text-slate-500">{ref.email}</div>
                  {ref.phone && <div className="text-[10px] text-slate-500">{ref.phone}</div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content (Right) - Offset margin for multi-page print */}
      <div className="flex-1 p-10 flex flex-col print:ml-[30%]">
         
         {/* Summary */}
         {professionalSummary && (
           <div className="mb-8">
             <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-widest border-b-2 border-indigo-600 pb-1 mb-4 inline-block">Profile</h3>
             <p className="text-sm text-slate-700 leading-relaxed text-justify font-medium">
               {professionalSummary}
             </p>
           </div>
         )}

         {/* Experience */}
         {experiences.length > 0 && (
           <div className="mb-8">
             <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-widest border-b-2 border-indigo-600 pb-1 mb-6 inline-block">Professional Experience</h3>
             <div className="space-y-8">
               {experiences.map((exp, index) => (
                 <div key={index} className="break-inside-avoid">
                   <div className="flex justify-between items-baseline mb-1">
                     <h4 className="text-base font-bold text-slate-900">{exp.jobTitle}</h4>
                     <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                       {exp.startDate} – {exp.endDate || 'Present'}
                     </span>
                   </div>
                   <div className="text-sm font-bold text-slate-500 mb-3 uppercase tracking-wider">
                     {exp.company} {exp.city ? `• ${exp.city}` : ''}
                   </div>
                   {exp.tasks && (
                     <ul className="text-sm text-slate-700 leading-relaxed space-y-2 pl-4 border-l-2 border-slate-200">
                       {exp.tasks.split('\n').map((task, i) => (
                         <li key={i} className="pl-2">{task.replace(/^[•\-\*]\s*/, '')}</li>
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
             <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-widest border-b-2 border-indigo-600 pb-1 mb-6 inline-block">Education</h3>
             <div className="space-y-6">
               {educations.map((edu, index) => (
                 <div key={index} className="break-inside-avoid flex justify-between items-start">
                   <div>
                     <h4 className="text-sm font-bold text-slate-900">
                       {edu.degree} {edu.specialty && <span className="text-slate-500 font-medium">({edu.specialty})</span>}
                     </h4>
                     <div className="text-sm font-medium text-slate-600 mt-1">
                       {edu.school} {edu.city ? `• ${edu.city}` : ''}
                     </div>
                   </div>
                   <span className="text-xs font-bold text-slate-500 whitespace-nowrap">
                     {edu.startDate} – {edu.endDate || 'Present'}
                   </span>
                 </div>
               ))}
             </div>
           </div>
         )}
         
      </div>
    </div>
  );
}
