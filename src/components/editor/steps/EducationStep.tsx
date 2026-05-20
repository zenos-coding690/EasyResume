'use client';
import { useLanguage } from '@/context/LanguageContext';
import { useResume } from '@/context/ResumeContext';
import { Plus, Trash2, GraduationCap, MapPin, Building, Calendar, BookOpen } from 'lucide-react';
import React from 'react';

export function EducationStep() {
  const { t } = useLanguage();
  const { resumeData, addEducation, updateEducation, removeEducation } = useResume();

  const handleAdd = () => {
    addEducation({
      id: Date.now().toString(),
      degree: '',
      specialty: '',
      school: '',
      city: '',
      startDate: '',
      endDate: ''
    });
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-slate-800">{t('editorStepEducation')}</h2>
      
      {resumeData.educations.length === 0 ? (
        <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-500">
           <GraduationCap className="w-12 h-12 text-slate-300 mb-3" />
           <p className="mb-4 text-sm font-medium">Aucune formation ajoutée pour le moment.</p>
           <button onClick={handleAdd} className="px-6 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 shadow-sm hover:shadow-md hover:border-[#1062FE] hover:text-[#1062FE] transition-all flex items-center">
             <Plus className="w-4 h-4 mr-2" /> {t('btnAddEducation')}
           </button>
        </div>
      ) : (
        <div className="space-y-8">
          {resumeData.educations.map((edu, index) => (
            <div key={edu.id} className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-[0_2px_12px_rgba(0,0,0,0.03)] relative group hover:border-slate-300 transition-colors">
               <div className="absolute -top-3 -left-3 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                 {index + 1}
               </div>
               <button onClick={() => removeEducation(edu.id)} className="absolute -top-3 -right-3 p-2 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white border border-red-100 rounded-full shadow-md transition-all" title="Supprimer">
                 <Trash2 className="w-4 h-4" />
               </button>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                 <InputField icon={<GraduationCap />} value={edu.degree} onChange={(e: any) => updateEducation(edu.id, 'degree', e.target.value)} placeholder={t('fieldDegree')} />
                 <InputField icon={<BookOpen />} value={edu.specialty} onChange={(e: any) => updateEducation(edu.id, 'specialty', e.target.value)} placeholder={t('fieldSpecialty')} />
                 <InputField icon={<Building />} value={edu.school} onChange={(e: any) => updateEducation(edu.id, 'school', e.target.value)} placeholder={t('fieldSchool')} className="sm:col-span-2" />
                 <InputField icon={<MapPin />} value={edu.city} onChange={(e: any) => updateEducation(edu.id, 'city', e.target.value)} placeholder="Ville" className="sm:col-span-2" />
                 <InputField icon={<Calendar />} value={edu.startDate} onChange={(e: any) => updateEducation(edu.id, 'startDate', e.target.value)} placeholder={t('fieldStartMonth') + ' / ' + t('fieldStartYear')} type="month" className="sm:col-span-1" />
                 <InputField icon={<Calendar />} value={edu.endDate} onChange={(e: any) => updateEducation(edu.id, 'endDate', e.target.value)} placeholder={t('fieldEndMonth') + ' / ' + t('fieldEndYear')} type="month" className="sm:col-span-1" />
               </div>
            </div>
          ))}
          
          <button onClick={handleAdd} className="w-full py-4 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl text-sm font-semibold text-slate-500 hover:text-[#1062FE] hover:bg-blue-50 hover:border-blue-200 transition-all flex items-center justify-center">
            <Plus className="w-5 h-5 mr-2" /> {t('btnAddEducation')}
          </button>
        </div>
      )}
    </div>
  );
}

function InputField({ icon, value, onChange, placeholder, type = "text", className = "" }: any) {
  return (
    <div className={`relative group ${className}`}>
       <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1062FE] transition-colors">
          {React.cloneElement(icon, { className: "w-4 h-4" })}
       </div>
       <input 
         type={type}
         value={value}
         onChange={onChange}
         placeholder={placeholder}
         className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1062FE] transition-all"
       />
    </div>
  );
}
