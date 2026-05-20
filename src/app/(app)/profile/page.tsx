'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  Briefcase,
  MapPin,
  Calendar,
  Heart,
  Mail,
  Phone,
  Globe,
  Plus,
  Edit2,
  Check,
  Save,
  X,
  Trash2,
  AlertTriangle,
  FileText,
  Camera
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { useRouter } from 'next/navigation';
import { useResume } from '@/context/ResumeContext';

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

interface SavedResume {
  id: number;
  title: string;
  lastEdited: string;
  thumbnail: string;
  data: any;
}

interface ProfileData {
  id: number;
  nom: string;
  prenom: string;
  profession: string;
  adresse: string;
  birthDate: string;
  maritalStatus: string;
  email: string;
  phone: string;
  linkedin: string;
  website: string;
  photo?: string;
}

export default function ProfilePage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { setResumeData } = useResume();
  const photoInputRef = useRef<HTMLInputElement>(null);
  const isFr = t('copiedSuccess') === 'Copié !';

  const [profiles, setProfiles] = useState<ProfileData[]>([
    {
      id: 1,
      nom: "GBETNKOM",
      prenom: "AMADOU MOUSTAPHA",
      profession: "informaticien",
      adresse: "BAFOUSSAM",
      birthDate: "13/01/1994",
      maritalStatus: "Celibataire",
      email: "moustaphagbetnkom@gmail.com",
      phone: "691232402",
      linkedin: "dsddss",
      website: "wwwwddc"
    },
    {
      id: 2,
      nom: "SOW",
      prenom: "ALIOU BEN",
      profession: "Comptable Agréé",
      adresse: "MONTREAL",
      birthDate: "05/09/1990",
      maritalStatus: "Marié",
      email: "aliou.ben@myeasyresume.ca",
      phone: "5149876543",
      linkedin: "aliou-ben-sow",
      website: "sowfinance.com"
    }
  ]);

  const [activeProfileId, setActiveProfileId] = useState<number>(1);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [savedResumes, setSavedResumes] = useState<SavedResume[]>([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(false);

  useEffect(() => {
    const raw = localStorage.getItem('my_easy_resumes');
    if (raw) setSavedResumes(JSON.parse(raw));
  }, []);

  const activeProfile = profiles.find(p => p.id === activeProfileId) || profiles[0];
  const [formData, setFormData] = useState<ProfileData>({ ...activeProfile });

  useEffect(() => {
    setFormData({ ...activeProfile });
    setIsEditing(false);
  }, [activeProfileId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setProfiles(prev => prev.map(p => p.id === activeProfile.id ? { ...formData } : p));
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (profiles.length <= 1) return;
    const remaining = profiles.filter(p => p.id !== activeProfileId);
    setProfiles(remaining);
    setActiveProfileId(remaining[0].id);
    setDeleteConfirmOpen(false);
  };

  const handleCreateNew = () => {
    const newProfile: ProfileData = {
      id: Date.now(),
      nom: "NOUVEAU",
      prenom: "PROFIL",
      profession: "Profession",
      adresse: "Ville, Pays",
      birthDate: "JJ/MM/AAAA",
      maritalStatus: "Célibataire",
      email: "email@example.com",
      phone: "000000000",
      linkedin: "linkedin-id",
      website: "website.com"
    };
    setProfiles(prev => [...prev, newProfile]);
    setActiveProfileId(newProfile.id);
    setIsEditing(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://myeasyresume.ca/ref?id=zenos690");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePhotoClick = () => {
    photoInputRef.current?.click();
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target?.result as string;
      const updated = { ...activeProfile, photo: base64 };
      setProfiles(prev => prev.map(p => p.id === activeProfileId ? updated : p));
      if (isEditing) setFormData(prev => ({ ...prev, photo: base64 }));
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleOpenResume = (resume: SavedResume) => {
    setResumeData(resume.data);
    router.push(`/editor?resume=${resume.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 select-none">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* ============================================================== */}
        {/* COLUMN 1: PROFILES LIST                                        */}
        {/* ============================================================== */}
        <div className="col-span-1 lg:col-span-3 space-y-6">
          <ScrollReveal delay={100} duration={500} direction="up">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800 tracking-tight">{t('profilesTitle')}</h2>
              <Button
                onClick={handleCreateNew}
                className="bg-[#1062FE] hover:bg-blue-700 text-white rounded-full px-4 py-1.5 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all duration-300 hover:scale-[1.03]"
              >
                <Plus className="w-3.5 h-3.5" />
                {t('newProfileBtn')}
              </Button>
            </div>
          </ScrollReveal>

          <div className="space-y-3">
            {profiles.map((profile, index) => {
              const isActive = profile.id === activeProfileId;
              const linkedResumes = savedResumes.filter(r =>
                r.data?.personalInfo?.lastName?.toLowerCase() === profile.nom.toLowerCase() ||
                r.data?.personalInfo?.firstName?.toLowerCase() === profile.prenom.toLowerCase()
              );
              return (
                <ScrollReveal key={profile.id} delay={150 + index * 50} duration={400} direction="up">
                  <div
                    onClick={() => setActiveProfileId(profile.id)}
                    className={cn(
                      "rounded-2xl p-4 cursor-pointer transition-all duration-300 border flex flex-col space-y-3 select-none relative overflow-hidden",
                      isActive
                        ? "bg-[#1062FE] text-white border-[#1062FE] shadow-lg shadow-blue-500/25 scale-[1.02]"
                        : "bg-white text-slate-700 border-slate-100 hover:border-blue-200 hover:scale-[1.01] hover:shadow-sm"
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      {profile.photo ? (
                        <img
                          src={profile.photo}
                          alt={profile.prenom}
                          className="w-10 h-10 rounded-full object-cover border-2 border-white/40"
                        />
                      ) : (
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm",
                          isActive ? "bg-white/20 border-2 border-white" : "bg-blue-50 text-[#1062FE] border border-blue-100"
                        )}>
                          {profile.prenom.charAt(0)}{profile.nom.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className={cn("font-bold text-sm truncate", isActive ? "text-white" : "text-slate-800")}>
                          {profile.nom} {profile.prenom}
                        </h4>
                        <p className={cn("text-xs truncate mt-0.5", isActive ? "text-blue-100" : "text-slate-500 font-medium")}>
                          {profile.profession}
                        </p>
                      </div>
                      {isActive && (
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                      )}
                    </div>

                    {/* CV liés */}
                    {linkedResumes.length > 0 && (
                      <div className="space-y-1.5" onClick={e => e.stopPropagation()}>
                        {linkedResumes.slice(0, 2).map(r => (
                          <div
                            key={r.id}
                            onClick={() => handleOpenResume(r)}
                            className={cn(
                              "flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-[10px] font-semibold cursor-pointer transition-all",
                              isActive ? "bg-white/15 hover:bg-white/25 text-white" : "bg-blue-50/60 hover:bg-blue-100 text-slate-600 border border-blue-100/50"
                            )}
                          >
                            <FileText className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{r.title}</span>
                          </div>
                        ))}
                        {linkedResumes.length > 2 && (
                          <p className={cn("text-[9px] font-bold text-center", isActive ? "text-blue-200" : "text-slate-400")}>
                            +{linkedResumes.length - 2} {isFr ? 'autre(s)' : 'more'}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>

        {/* ============================================================== */}
        {/* COLUMN 2: DETAILS OF SELECTED PROFILE                          */}
        {/* ============================================================== */}
        <div className="col-span-1 lg:col-span-6 space-y-6">
          <ScrollReveal delay={150} duration={500} direction="up">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800 tracking-tight">{t('profileDetailsTitle')}</h2>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <Button
                      onClick={() => { setFormData({ ...activeProfile }); setIsEditing(false); }}
                      className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl px-4 py-2 text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <X className="w-3.5 h-3.5" />
                      {isFr ? 'Annuler' : 'Cancel'}
                    </Button>
                    <Button
                      onClick={handleSave}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-4 py-2 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <Save className="w-3.5 h-3.5" />
                      {isFr ? 'Enregistrer' : 'Save'}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="bg-white hover:bg-slate-950 hover:text-white border border-slate-200 text-slate-700 rounded-xl px-4 py-2 text-xs font-bold transition-all duration-300 flex items-center gap-1.5 shadow-sm"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      {t('editBtn')}
                    </Button>
                    <Button
                      onClick={() => setDeleteConfirmOpen(true)}
                      disabled={profiles.length <= 1}
                      className="bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-200 border border-slate-200 text-slate-500 rounded-xl px-4 py-2 text-xs font-bold transition-all duration-300 flex items-center gap-1.5 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      {isFr ? 'Supprimer' : 'Delete'}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200} duration={600} direction="up">
            <div className="bg-white rounded-[1.5rem] border border-slate-100 p-6 sm:p-8 space-y-8 shadow-sm">
              {/* Avatar + Nom du propriétaire */}
              <div className="flex items-center space-x-6 pb-6 border-b border-slate-100">
                <div className="relative group">
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                  {activeProfile.photo ? (
                    <img
                      src={activeProfile.photo}
                      alt={activeProfile.prenom}
                      className="w-20 h-20 rounded-full object-cover border-2 border-slate-200/60 shadow-inner"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-slate-50 border border-slate-200/60 flex items-center justify-center font-bold text-2xl text-[#1062FE] shadow-inner">
                      {activeProfile.prenom.charAt(0)}{activeProfile.nom.charAt(0)}
                    </div>
                  )}
                  <button
                    onClick={handlePhotoClick}
                    className="absolute inset-0 bg-slate-900/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer duration-300"
                  >
                    <Camera className="w-5 h-5 text-white" />
                  </button>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 tracking-tight">
                    {activeProfile.prenom} {activeProfile.nom}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold mt-1 capitalize">{activeProfile.profession}</p>
                </div>
              </div>

              {/* READ-ONLY */}
              {!isEditing && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                  {[
                    { icon: <User className="w-4 h-4" />, label: t('fieldNom'), value: activeProfile.nom },
                    { icon: <User className="w-4 h-4" />, label: t('fieldPrenom'), value: activeProfile.prenom },
                    { icon: <Briefcase className="w-4 h-4" />, label: t('fieldProfession'), value: activeProfile.profession, capitalize: true },
                    { icon: <MapPin className="w-4 h-4" />, label: t('fieldAddress'), value: activeProfile.adresse },
                    { icon: <Calendar className="w-4 h-4" />, label: t('fieldBirthDate'), value: activeProfile.birthDate },
                    { icon: <Heart className="w-4 h-4" />, label: t('fieldMaritalStatus'), value: activeProfile.maritalStatus },
                    { icon: <Mail className="w-4 h-4" />, label: t('fieldEmail'), value: activeProfile.email, truncate: true },
                    { icon: <Phone className="w-4 h-4" />, label: t('fieldPhone'), value: activeProfile.phone },
                    { icon: <LinkedinIcon className="w-4 h-4" />, label: 'LinkedIn', value: activeProfile.linkedin },
                    { icon: <Globe className="w-4 h-4" />, label: t('fieldWebsite'), value: activeProfile.website },
                  ].map(({ icon, label, value, capitalize, truncate }) => (
                    <div key={label} className="flex items-start space-x-3.5">
                      <div className="p-2 bg-blue-50/50 rounded-xl border border-blue-100/40 text-[#1062FE]">{icon}</div>
                      <div className={truncate ? "min-w-0 flex-1" : ""}>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{label}</p>
                        <p className={cn("text-[15px] font-semibold text-slate-800 mt-1", capitalize && "capitalize", truncate && "truncate")}>{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* EDITING */}
              {isEditing && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                  {[
                    { name: 'nom', label: t('fieldNom'), type: 'text' },
                    { name: 'prenom', label: t('fieldPrenom'), type: 'text' },
                    { name: 'profession', label: t('fieldProfession'), type: 'text' },
                    { name: 'adresse', label: t('fieldAddress'), type: 'text' },
                    { name: 'birthDate', label: t('fieldBirthDate'), type: 'text' },
                    { name: 'maritalStatus', label: t('fieldMaritalStatus'), type: 'text' },
                    { name: 'email', label: t('fieldEmail'), type: 'email' },
                    { name: 'phone', label: t('fieldPhone'), type: 'text' },
                    { name: 'linkedin', label: 'LinkedIn', type: 'text' },
                    { name: 'website', label: t('fieldWebsite'), type: 'text' },
                  ].map(({ name, label, type }) => (
                    <div key={name}>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</label>
                      <input
                        type={type}
                        name={name}
                        value={(formData as any)[name]}
                        onChange={handleInputChange}
                        className="w-full mt-1.5 px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1062FE]/20 focus:border-[#1062FE] transition-all"
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-center space-x-1.5 pt-4">
                <span className="w-6 h-1.5 rounded-full bg-[#1062FE]" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* ============================================================== */}
        {/* COLUMN 3: ACCOUNT & SUBSCRIPTION INFO                          */}
        {/* ============================================================== */}
        <div className="col-span-1 lg:col-span-3 space-y-6">
          <ScrollReveal delay={200} duration={500} direction="up">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">{t('accountInfoTitle')}</h2>
          </ScrollReveal>

          <ScrollReveal delay={250} duration={600} direction="up">
            <div className="bg-white rounded-[1.5rem] border border-slate-100 p-6 space-y-6 shadow-sm">
              <div className="space-y-4">
                <div>
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{t('usernameLabel')}</p>
                  <p className="text-sm font-semibold text-slate-700 mt-1">zenos690</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{t('emailLabel')}</p>
                  <p className="text-sm font-semibold text-slate-700 mt-1 truncate">moustaphagbetnkom@gmail.com</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{t('phoneLabel')}</p>
                  <p className="text-sm font-semibold text-slate-700 mt-1">691232402</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{t('downloadedResumesLabel')}</p>
                  <p className="text-sm font-bold text-slate-700 mt-1">0</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border border-blue-100/60 rounded-2xl p-4 space-y-3 relative overflow-hidden">
                <p className="text-xs font-semibold text-slate-600 leading-relaxed">{t('copyAffiliateLink')}</p>
                <div
                  onClick={handleCopyLink}
                  className="bg-white border border-slate-200/80 rounded-xl px-3 py-2 flex items-center justify-between cursor-pointer hover:border-[#1062FE] hover:shadow-sm active:scale-[0.98] transition-all select-none group"
                >
                  <span className="text-[11px] font-bold text-slate-500 truncate mr-2">https://myeasyresume.ca/ref?id=zenos690</span>
                  {copied ? (
                    <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      {t('copiedSuccess')}
                    </span>
                  ) : (
                    <svg className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1062FE] transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  )}
                </div>
              </div>

              <Button className="w-full bg-[#1062FE] hover:bg-blue-700 text-white rounded-xl py-3.5 font-bold transition-all text-xs tracking-wide shadow-md shadow-blue-500/10">
                {t('downloadAvailableStatus')}
              </Button>
            </div>
          </ScrollReveal>
        </div>

      </div>

      {/* ============================================================== */}
      {/* DELETE CONFIRM MODAL                                            */}
      {/* ============================================================== */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm select-none animate-fadeIn">
          <div className="bg-white rounded-[1.5rem] border border-slate-100 p-8 max-w-sm w-full mx-4 shadow-2xl relative overflow-hidden animate-slideUp">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-14 h-14 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center mb-5">
                <AlertTriangle className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">
                {isFr ? 'Supprimer ce profil ?' : 'Delete this profile?'}
              </h3>
              <p className="text-sm text-slate-500 font-medium mt-2 leading-relaxed">
                {isFr
                  ? `Le profil "${activeProfile.prenom} ${activeProfile.nom}" sera supprimé définitivement.`
                  : `Profile "${activeProfile.prenom} ${activeProfile.nom}" will be permanently deleted.`}
              </p>
            </div>
            <div className="flex gap-3 mt-7 relative z-10">
              <button
                onClick={() => setDeleteConfirmOpen(false)}
                className="flex-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl py-3 text-sm font-bold transition-all"
              >
                {isFr ? 'Annuler' : 'Cancel'}
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-500 hover:bg-red-600 active:scale-[0.98] text-white rounded-xl py-3 text-sm font-bold transition-all shadow-md shadow-red-500/20"
              >
                {isFr ? 'Supprimer' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
