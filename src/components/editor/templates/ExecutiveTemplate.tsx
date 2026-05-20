'use client';
import React from 'react';
import { useResume } from '@/context/ResumeContext';
import { MapPin, Phone, Mail, Globe, Link } from 'lucide-react';

export function ExecutiveTemplate() {
  const { resumeData } = useResume();
  const { personalInfo, professionalSummary, experiences, educations, skills, hobbies } = resumeData;

  // Séparation du texte en lignes pour les puces
  const skillsList = skills.split('\n').filter(s => s.trim() !== '');
  const hobbiesList = hobbies.split('\n').filter(h => h.trim() !== '');

  return (
    <div id="resume-print-area" className="w-full h-full bg-white text-slate-800 flex shadow-sm relative" style={{ minHeight: '29.7cm' }}>
      
      {/* Sidebar (Left) - Fixed for multi-page print */}
      <div className="w-[32%] bg-[#1c2331] text-white p-8 flex flex-col print:fixed print:left-0 print:top-0 print:bottom-0 print:h-screen">
        
        {/* Photo */}
        <div className="flex justify-center mb-8">
          <div className="w-32 h-32 rounded-full border-4 border-slate-600/50 overflow-hidden bg-slate-800">
             {personalInfo.photoUrl ? (
               <img src={personalInfo.photoUrl} alt="Profile" className="w-full h-full object-cover" />
             ) : (
               <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold text-2xl">
                 {personalInfo.firstName?.charAt(0) || ''}{personalInfo.lastName?.charAt(0) || ''}
               </div>
             )}
          </div>
        </div>

        {/* Contact Info */}
        <div className="mb-10 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest border-b border-slate-600 pb-2 mb-4">Contact</h3>
          
          {personalInfo.phone && (
            <div className="flex items-center space-x-3 text-slate-300">
               <Phone className="w-4 h-4 text-blue-400 shrink-0" />
               <span className="break-all">{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.email && (
            <div className="flex items-center space-x-3 text-slate-300">
               <Mail className="w-4 h-4 text-blue-400 shrink-0" />
               <span className="break-all">{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.city && (
            <div className="flex items-center space-x-3 text-slate-300">
               <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
               <span className="break-all">{personalInfo.city}</span>
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="flex items-center space-x-3 text-slate-300">
               <Link className="w-4 h-4 text-blue-400 shrink-0" />
               <span className="break-all">{personalInfo.linkedin}</span>
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-center space-x-3 text-slate-300">
               <Globe className="w-4 h-4 text-blue-400 shrink-0" />
               <span className="break-all">{personalInfo.website}</span>
            </div>
          )}
        </div>

        {/* Skills */}
        {skillsList.length > 0 && (
          <div className="mb-10 text-xs">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest border-b border-slate-600 pb-2 mb-4">Compétences</h3>
            <ul className="space-y-2">
              {skillsList.map((skill, i) => (
                <li key={i} className="flex items-start text-slate-300">
                  <span className="text-blue-400 mr-2">•</span> {skill.replace(/^[•\-\*]\s*/, '')}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Hobbies */}
        {hobbiesList.length > 0 && (
          <div className="text-xs">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest border-b border-slate-600 pb-2 mb-4">Loisirs</h3>
            <ul className="space-y-2">
              {hobbiesList.map((hobby, i) => (
                <li key={i} className="flex items-start text-slate-300">
                  <span className="text-blue-400 mr-2">•</span> {hobby.replace(/^[•\-\*]\s*/, '')}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Main Content (Right) - Offset margin for multi-page print */}
      <div className="flex-1 p-10 bg-slate-50/50 flex flex-col print:ml-[32%]">
         
         {/* Header */}
         <div className="mb-8">
            <h1 className="text-4xl font-extrabold text-slate-900 uppercase tracking-wide">
              {personalInfo.firstName || 'Votre'} <span className="text-[#1062FE]">{personalInfo.lastName || 'Nom'}</span>
            </h1>
            <h2 className="text-xl font-medium text-slate-500 mt-2 tracking-wide uppercase">
              {personalInfo.jobTitle || 'Profession Ciblée'}
            </h2>
         </div>

         {/* Summary */}
         {professionalSummary && (
           <div className="mb-8">
             <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wider border-b-2 border-slate-200 pb-1 mb-3">Profil</h3>
             <p className="text-sm text-slate-600 leading-relaxed text-justify">
               {professionalSummary}
             </p>
           </div>
         )}

         {/* Experience */}
         {experiences.length > 0 && (
           <div className="mb-8">
             <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wider border-b-2 border-slate-200 pb-1 mb-4">Expérience Professionnelle</h3>
             <div className="space-y-6">
               {experiences.map(exp => (
                 <div key={exp.id} className="relative pl-4 border-l-2 border-slate-200 break-inside-avoid mb-6">
                   <div className="absolute w-2 h-2 bg-[#1062FE] rounded-full -left-[5px] top-1.5" />
                   <div className="flex justify-between items-start mb-1">
                     <h4 className="text-sm font-bold text-slate-800">{exp.jobTitle}</h4>
                     <span className="text-xs font-semibold text-[#1062FE] whitespace-nowrap bg-blue-50 px-2 py-0.5 rounded">
                       {exp.startDate} - {exp.endDate || 'Présent'}
                     </span>
                   </div>
                   <div className="text-xs font-medium text-slate-500 mb-2">{exp.company} {exp.city ? `| ${exp.city}` : ''}</div>
                   {exp.tasks && (
                     <div className="text-xs text-slate-600 leading-relaxed space-y-1">
                       {exp.tasks.split('\n').map((task, i) => (
                         <p key={i} className="flex"><span className="mr-1.5 opacity-70">•</span> <span>{task.replace(/^[•\-\*]\s*/, '')}</span></p>
                       ))}
                     </div>
                   )}
                 </div>
               ))}
             </div>
           </div>
         )}

         {/* Education */}
         {educations.length > 0 && (
           <div className="mb-8">
             <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wider border-b-2 border-slate-200 pb-1 mb-4">Formation</h3>
             <div className="space-y-5">
               {educations.map(edu => (
                 <div key={edu.id} className="relative pl-4 border-l-2 border-slate-200 break-inside-avoid mb-5">
                   <div className="absolute w-2 h-2 bg-slate-400 rounded-full -left-[5px] top-1.5" />
                   <div className="flex justify-between items-start mb-1">
                     <h4 className="text-sm font-bold text-slate-800">{edu.degree} {edu.specialty && `- ${edu.specialty}`}</h4>
                     <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                       {edu.startDate} - {edu.endDate || 'Présent'}
                     </span>
                   </div>
                   <div className="text-xs text-slate-500">{edu.school} {edu.city ? `| ${edu.city}` : ''}</div>
                 </div>
               ))}
             </div>
           </div>
         )}
         
      </div>
    </div>
  );
}
