'use client';
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useResume } from '@/context/ResumeContext';
import { User, Mail, Phone, MapPin, Briefcase, Calendar, Link, Globe, Image as ImageIcon, X, Check } from 'lucide-react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '@/lib/cropImage';

export function PersonalInfoStep() {
  const { t } = useLanguage();
  const { resumeData, updatePersonalInfo } = useResume();
  const info = resumeData.personalInfo;
  
  // Crop state
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updatePersonalInfo(e.target.name as any, e.target.value);
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setImageSrc(reader.result?.toString() || null));
      reader.readAsDataURL(e.target.files[0]);
      e.target.value = '';
    }
  };

  const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropImage = async () => {
    try {
      if (!imageSrc || !croppedAreaPixels) return;
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (croppedImage) {
         updatePersonalInfo('photoUrl', croppedImage);
         setImageSrc(null); // Fermer la modale
      }
    } catch (e) {
      console.error("Crop error:", e);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-6">{t('editorStepPersonal')}</h2>
      
      {/* Modale de rognage (Crop Modal Overlay) */}
      {imageSrc && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 p-4 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
             <div className="p-4 border-b border-slate-100 flex items-center justify-between">
               <h3 className="font-bold text-slate-800">Recadrer la photo</h3>
               <button onClick={() => setImageSrc(null)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
                 <X className="w-5 h-5" />
               </button>
             </div>
             
             <div className="relative w-full h-[300px] bg-slate-900">
               <Cropper
                 image={imageSrc}
                 crop={crop}
                 zoom={zoom}
                 aspect={1} // Format carré (1:1)
                 cropShape="round" // Affiche un cercle pour prévisualiser le rendu final
                 onCropChange={setCrop}
                 onCropComplete={onCropComplete}
                 onZoomChange={setZoom}
                 showGrid={false}
               />
             </div>
             
             <div className="p-6 bg-white">
               <div className="mb-6">
                 <div className="flex justify-between mb-2">
                   <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Zoom</label>
                   <span className="text-xs font-bold text-blue-600">{Math.round(zoom * 100)}%</span>
                 </div>
                 <input
                   type="range"
                   value={zoom}
                   min={1}
                   max={3}
                   step={0.1}
                   aria-labelledby="Zoom"
                   onChange={(e) => setZoom(Number(e.target.value))}
                   className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#1062FE]"
                 />
               </div>
               
               <div className="flex gap-3">
                 <button onClick={() => setImageSrc(null)} className="flex-1 py-2.5 bg-slate-50 text-slate-600 rounded-xl font-semibold text-sm hover:bg-slate-100 transition-colors">
                   Annuler
                 </button>
                 <button onClick={handleCropImage} className="flex-1 py-2.5 bg-[#1062FE] text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center">
                   <Check className="w-4 h-4 mr-2" /> Valider
                 </button>
               </div>
             </div>
          </div>
        </div>
      )}

      {/* Zone d'Upload de la photo */}
      <div className="flex items-center space-x-6 mb-8 bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-100">
         <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center overflow-hidden relative group shrink-0 transition-all hover:shadow-lg">
            {info.photoUrl ? (
              <img src={info.photoUrl} alt="Profil" className="w-full h-full object-cover" />
            ) : (
              <ImageIcon className="w-8 h-8 text-slate-300 group-hover:scale-110 transition-transform" />
            )}
            <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
               <span className="text-white text-xs font-semibold px-2 text-center">{t('uploadPhoto')}</span>
               <input type="file" accept="image/*" onChange={handlePhotoSelect} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
         </div>
         <div className="flex-1">
            <h3 className="font-semibold text-slate-800 mb-1">Photo de profil</h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-3">Une photo cadrée et professionnelle aide les recruteurs à se souvenir de vous.</p>
            <div className="relative inline-block">
               <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
                 {info.photoUrl ? 'Modifier la photo' : t('uploadPhoto')}
               </button>
               <input type="file" accept="image/*" onChange={handlePhotoSelect} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <InputField icon={<User />} name="firstName" value={info.firstName} onChange={handleChange} placeholder="Prénom" />
        <InputField icon={<User />} name="lastName" value={info.lastName} onChange={handleChange} placeholder="Nom" />
        <InputField icon={<Briefcase />} name="jobTitle" value={info.jobTitle} onChange={handleChange} placeholder="Profession ciblée" className="sm:col-span-2" />
        <InputField icon={<Mail />} name="email" value={info.email} onChange={handleChange} placeholder="Adresse e-mail" type="email" />
        <InputField icon={<Phone />} name="phone" value={info.phone} onChange={handleChange} placeholder="Téléphone" />
        <InputField icon={<MapPin />} name="city" value={info.city} onChange={handleChange} placeholder="Ville, Pays" />
        <InputField icon={<Calendar />} name="dob" value={info.dob} onChange={handleChange} placeholder="Date de naissance (optionnel)" type="date" />
        <InputField icon={<Link />} name="linkedin" value={info.linkedin} onChange={handleChange} placeholder="Lien LinkedIn" />
        <InputField icon={<Globe />} name="website" value={info.website} onChange={handleChange} placeholder="Site Web / Portfolio" />
      </div>
    </div>
  );
}

function InputField({ icon, name, value, onChange, placeholder, type = "text", className = "" }: any) {
  return (
    <div className={`relative group ${className}`}>
       <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1062FE] transition-colors">
          {React.cloneElement(icon, { className: "w-5 h-5" })}
       </div>
       <input 
         type={type}
         name={name}
         value={value}
         onChange={onChange}
         placeholder={placeholder}
         className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1062FE] transition-all shadow-sm hover:border-slate-300"
       />
    </div>
  );
}
