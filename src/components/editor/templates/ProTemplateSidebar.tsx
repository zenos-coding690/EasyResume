'use client';
import React from 'react';
import { useResume } from '@/context/ResumeContext';
import { MapPin, Phone, Mail, Globe, Link } from 'lucide-react';

export interface SidebarTheme {
  sidebarBg: string;
  sidebarText: string;
  sidebarHeading: string;
  sidebarAccent: string;
  headerAccent: string;
  dateColor: string;
  dateBg: string;
  dotColor: string;
  borderColor: string;
  mainBg: string;
}

// =========================================================================
// Type A: Sidebar colorée à gauche (pro-1, pro-2, pro-4, pro-5, pro-6)
// =========================================================================
export function ProTemplateSidebar({ theme }: { theme: SidebarTheme }) {
  const { resumeData } = useResume();
  const { personalInfo, professionalSummary, experiences, educations, skills, hobbies, languages } = resumeData;

  const skillsList = skills.split('\n').filter(s => s.trim() !== '');
  const hobbiesList = hobbies.split('\n').filter(h => h.trim() !== '');

  return (
    <div id="resume-print-area" className="w-full h-full bg-white text-slate-800 flex shadow-sm relative" style={{ minHeight: '29.7cm' }}>
      
      {/* ===== SIDEBAR (LEFT) ===== */}
      <div 
        className="w-[32%] p-8 flex flex-col print:fixed print:left-0 print:top-0 print:bottom-0 print:h-screen print:w-[32%]"
        style={{ backgroundColor: theme.sidebarBg, color: theme.sidebarText }}
      >
        {/* Photo */}
        <div className="flex justify-center mb-8">
          <div className="w-32 h-32 rounded-full border-4 overflow-hidden" style={{ borderColor: theme.sidebarAccent + '40', backgroundColor: theme.sidebarBg }}>
            {personalInfo.photoUrl ? (
              <img src={personalInfo.photoUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-2xl" style={{ color: theme.sidebarAccent }}>
                {personalInfo.firstName?.charAt(0) || ''}{personalInfo.lastName?.charAt(0) || ''}
              </div>
            )}
          </div>
        </div>

        {/* Contact */}
        <div className="mb-10 space-y-4 text-xs">
          <h3 className="text-sm font-bold uppercase tracking-widest pb-2 mb-4" style={{ color: theme.sidebarHeading, borderBottom: `1px solid ${theme.sidebarAccent}40` }}>
            Informations personnelles
          </h3>
          {personalInfo.phone && (
            <div className="flex items-center space-x-3">
              <Phone className="w-4 h-4 shrink-0" style={{ color: theme.sidebarAccent }} />
              <span className="break-all">{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.email && (
            <div className="flex items-center space-x-3">
              <Mail className="w-4 h-4 shrink-0" style={{ color: theme.sidebarAccent }} />
              <span className="break-all">{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.city && (
            <div className="flex items-center space-x-3">
              <MapPin className="w-4 h-4 shrink-0" style={{ color: theme.sidebarAccent }} />
              <span className="break-all">{personalInfo.city}</span>
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="flex items-center space-x-3">
              <Link className="w-4 h-4 shrink-0" style={{ color: theme.sidebarAccent }} />
              <span className="break-all">{personalInfo.linkedin}</span>
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-center space-x-3">
              <Globe className="w-4 h-4 shrink-0" style={{ color: theme.sidebarAccent }} />
              <span className="break-all">{personalInfo.website}</span>
            </div>
          )}
        </div>

        {/* Skills */}
        {skillsList.length > 0 && (
          <div className="mb-10 text-xs">
            <h3 className="text-sm font-bold uppercase tracking-widest pb-2 mb-4" style={{ color: theme.sidebarHeading, borderBottom: `1px solid ${theme.sidebarAccent}40` }}>
              Compétences
            </h3>
            <ul className="space-y-2">
              {skillsList.map((skill, i) => (
                <li key={i} className="flex items-start">
                  <span className="mr-2" style={{ color: theme.sidebarAccent }}>•</span>
                  {skill.replace(/^[•\-\*]\s*/, '')}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Languages */}
        {languages && languages.length > 0 && (
          <div className="mb-10 text-xs">
            <h3 className="text-sm font-bold uppercase tracking-widest pb-2 mb-4" style={{ color: theme.sidebarHeading, borderBottom: `1px solid ${theme.sidebarAccent}40` }}>
              Langues
            </h3>
            <div className="space-y-3">
              {languages.map((lang) => (
                <div key={lang.id} className="space-y-1">
                  <div className="flex justify-between font-medium">
                    <span>{lang.name}</span>
                    <span className="opacity-80">{lang.level}%</span>
                  </div>
                  <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500" 
                      style={{ width: `${lang.level}%`, backgroundColor: theme.sidebarAccent }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hobbies */}
        {hobbiesList.length > 0 && (
          <div className="text-xs">
            <h3 className="text-sm font-bold uppercase tracking-widest pb-2 mb-4" style={{ color: theme.sidebarHeading, borderBottom: `1px solid ${theme.sidebarAccent}40` }}>
              Centres d&apos;interest
            </h3>
            <ul className="space-y-2">
              {hobbiesList.map((hobby, i) => (
                <li key={i} className="flex items-start">
                  <span className="mr-2" style={{ color: theme.sidebarAccent }}>■</span>
                  {hobby.replace(/^[•\-\*]\s*/, '')}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* ===== MAIN CONTENT (RIGHT) ===== */}
      <div className="flex-1 p-10 flex flex-col print:ml-[32%]" style={{ backgroundColor: theme.mainBg }}>
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-slate-900 uppercase tracking-wide">
            {personalInfo.firstName || 'Votre'}{' '}
            <span style={{ color: theme.headerAccent }}>{personalInfo.lastName || 'Nom'}</span>
          </h1>
          <h2 className="text-xl font-medium text-slate-500 mt-2 tracking-wide uppercase">
            {personalInfo.jobTitle || 'Profession Ciblée'}
          </h2>
        </div>

        {/* Summary */}
        {professionalSummary && (
          <div className="mb-8 break-inside-avoid">
            <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wider pb-1 mb-3" style={{ borderBottom: `2px solid ${theme.borderColor}` }}>
              Profil
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed text-justify">
              {professionalSummary}
            </p>
          </div>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wider pb-1 mb-4" style={{ borderBottom: `2px solid ${theme.borderColor}` }}>
              Expérience Professionnelle
            </h3>
            <div className="space-y-6">
              {experiences.map(exp => (
                <div key={exp.id} className="relative pl-4 border-l-2 break-inside-avoid mb-6" style={{ borderColor: theme.borderColor }}>
                  <div className="absolute w-2 h-2 rounded-full -left-[5px] top-1.5" style={{ backgroundColor: theme.dotColor }} />
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-sm font-bold text-slate-800">{exp.jobTitle}</h4>
                    <span className="text-xs font-semibold whitespace-nowrap px-2 py-0.5 rounded" style={{ color: theme.dateColor, backgroundColor: theme.dateBg }}>
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
            <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wider pb-1 mb-4" style={{ borderBottom: `2px solid ${theme.borderColor}` }}>
              Formation
            </h3>
            <div className="space-y-5">
              {educations.map(edu => (
                <div key={edu.id} className="relative pl-4 border-l-2 break-inside-avoid mb-5" style={{ borderColor: theme.borderColor }}>
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
