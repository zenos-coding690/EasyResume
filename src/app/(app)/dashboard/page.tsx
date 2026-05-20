'use client';

import { ActionCard } from "@/components/cards/ActionCard";
import { ResumeCard } from "@/components/cards/ResumeCard";
import { ProfileProgress } from "@/components/dashboard/ProfileProgress";
import { Plus, FileText, LayoutTemplate, DownloadCloud, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

interface SavedItem {
  id: number;
  title: string;
  lastEdited: string;
  thumbnail?: string;
  data?: any;
  company?: string;
}

export default function DashboardPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const addDropdownRef = useRef<HTMLDivElement>(null);

  const [savedResumes, setSavedResumes] = useState<SavedItem[]>([]);
  const [savedLetters, setSavedLetters] = useState<SavedItem[]>([]);
  const [downloadCount, setDownloadCount] = useState(0);
  const [addDropdownOpen, setAddDropdownOpen] = useState(false);

  useEffect(() => {
    const rawResumes = localStorage.getItem('my_easy_resumes');
    if (rawResumes) setSavedResumes(JSON.parse(rawResumes));

    const rawLetters = localStorage.getItem('my_easy_cover_letters');
    if (rawLetters) setSavedLetters(JSON.parse(rawLetters));

    const dl = localStorage.getItem('download_count');
    if (dl) setDownloadCount(parseInt(dl, 10));
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (addDropdownRef.current && !addDropdownRef.current.contains(e.target as Node)) {
        setAddDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDeleteResume = (id: number | string) => {
    const updated = savedResumes.filter(r => r.id !== id);
    setSavedResumes(updated);
    localStorage.setItem('my_easy_resumes', JSON.stringify(updated));
  };

  const handleDuplicateResume = (id: number | string) => {
    const original = savedResumes.find(r => r.id === id);
    if (!original) return;
    const dup = { ...original, id: Date.now(), title: `${original.title} (Copie)`, lastEdited: new Date().toLocaleDateString() };
    const updated = [dup, ...savedResumes];
    setSavedResumes(updated);
    localStorage.setItem('my_easy_resumes', JSON.stringify(updated));
  };

  const handleDeleteLetter = (id: number | string) => {
    const updated = savedLetters.filter(l => l.id !== id);
    setSavedLetters(updated);
    localStorage.setItem('my_easy_cover_letters', JSON.stringify(updated));
  };

  const handleDuplicateLetter = (id: number | string) => {
    const original = savedLetters.find(l => l.id === id);
    if (!original) return;
    const dup = { ...original, id: Date.now(), title: `${original.title} (Copie)`, lastEdited: new Date().toLocaleDateString() };
    const updated = [dup, ...savedLetters];
    setSavedLetters(updated);
    localStorage.setItem('my_easy_cover_letters', JSON.stringify(updated));
  };

  const resumesToDisplay = savedResumes;
  const lettersToDisplay = savedLetters;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Premium Banner */}
      <ScrollReveal delay={100} duration={600}>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50/50 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between border border-blue-100 gap-6">
          <div className="flex items-start sm:items-center space-x-4">
            <div className="w-12 h-12 bg-white shadow-sm rounded-full flex flex-shrink-0 items-center justify-center border border-orange-100">
              <span className="text-2xl leading-none">💎</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">{t('premiumTitle')}</h2>
              <p className="text-slate-600 mt-1 max-w-md text-sm sm:text-base">{t('premiumDesc')}</p>
            </div>
          </div>
          <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 sm:gap-2">
            <p className="text-lg sm:text-xl font-bold text-slate-800">
              {t('premiumPrice')}<span className="text-xs sm:text-sm text-slate-500 font-normal">{t('premiumPeriod')}</span>
            </p>
            <Button
              onClick={() => router.push('/subscribe')}
              className="bg-white hover:bg-slate-950 text-slate-950 hover:text-white border border-slate-200/80 hover:border-slate-950 shadow-sm rounded-xl px-6 sm:px-8 py-3.5 font-bold transition-all duration-300 group flex items-center gap-2 select-none"
            >
              {t('premiumBtn')}
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content */}
        <div className="col-span-1 lg:col-span-8 space-y-8">

          {/* Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">

            {/* Ajouter un modèle — avec dropdown */}
            <ScrollReveal delay={150} duration={500} className="h-full">
              <div ref={addDropdownRef} className="relative h-full">
                <ActionCard
                  title={t('addTemplate')}
                  icon={<Plus className="w-6 h-6" />}
                  iconClassName="bg-blue-50 text-blue-500"
                  onClick={() => setAddDropdownOpen(prev => !prev)}
                />
                {addDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-52 bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden z-30 animate-fadeIn">
                    <button
                      onClick={() => { router.push('/templates'); setAddDropdownOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#1062FE] transition-colors"
                    >
                      <FileText className="w-4 h-4 text-[#1062FE]" />
                      {t('copiedSuccess') === 'Copié !' ? 'Modèle de CV' : 'CV Template'}
                    </button>
                    <div className="h-px bg-slate-50" />
                    <button
                      onClick={() => { router.push('/cover-letter'); setAddDropdownOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#1062FE] transition-colors"
                    >
                      <LayoutTemplate className="w-4 h-4 text-[#1062FE]" />
                      {t('copiedSuccess') === 'Copié !' ? 'Lettre de motivation' : 'Cover Letter'}
                    </button>
                  </div>
                )}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={250} duration={500} className="h-full">
              <ActionCard
                title={t('createResume')}
                count={savedResumes.length}
                icon={<FileText className="w-6 h-6" />}
                iconClassName="bg-blue-50 text-blue-500"
                onClick={() => router.push('/editor')}
              />
            </ScrollReveal>

            <ScrollReveal delay={350} duration={500} className="h-full">
              <ActionCard
                title={t('createCoverLetter')}
                count={savedLetters.length}
                icon={<LayoutTemplate className="w-6 h-6" />}
                iconClassName="bg-blue-50 text-blue-500"
                onClick={() => router.push('/cover-letter-editor')}
              />
            </ScrollReveal>

            <ScrollReveal delay={450} duration={500} className="h-full">
              <ActionCard
                title={t('download')}
                count={downloadCount}
                icon={<DownloadCloud className="w-6 h-6" />}
                iconClassName="bg-blue-50 text-blue-500"
              />
            </ScrollReveal>
          </div>

          {/* Resumes List */}
          <ScrollReveal delay={200} duration={600} direction="up">
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">{t('resumesHeader')}</h3>
              {resumesToDisplay.length === 0 ? (
                <div
                  onClick={() => router.push('/editor')}
                  className="rounded-2xl border-2 border-dashed border-slate-200 p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#1062FE] hover:bg-blue-50/30 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
                    <Plus className="w-5 h-5 text-[#1062FE]" />
                  </div>
                  <p className="text-sm font-semibold text-slate-500 group-hover:text-slate-700 transition-colors">
                    {t('copiedSuccess') === 'Copié !' ? 'Créer mon premier CV' : 'Create my first resume'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
                  {resumesToDisplay.map((resume, idx) => (
                    <ScrollReveal key={resume.id} delay={idx * 100 + 100} duration={500} direction="up">
                      <ResumeCard
                        id={resume.id}
                        title={resume.title}
                        lastEdited={resume.lastEdited}
                        thumbnailUrl={resume.data?.personalInfo?.photoUrl || resume.thumbnail}
                        type="resume"
                        data={resume.data}
                        onDelete={handleDeleteResume}
                        onDuplicate={handleDuplicateResume}
                      />
                    </ScrollReveal>
                  ))}
                </div>
              )}
            </div>
          </ScrollReveal>

          {/* Cover Letters List */}
          <ScrollReveal delay={300} duration={600} direction="up">
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">{t('coverLettersHeader')}</h3>
              {lettersToDisplay.length === 0 ? (
                <div
                  onClick={() => router.push('/cover-letter-editor')}
                  className="rounded-2xl border-2 border-dashed border-slate-200 p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#1062FE] hover:bg-blue-50/30 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
                    <Plus className="w-5 h-5 text-[#1062FE]" />
                  </div>
                  <p className="text-sm font-semibold text-slate-500 group-hover:text-slate-700 transition-colors">
                    {t('copiedSuccess') === 'Copié !' ? 'Créer ma première lettre' : 'Create my first cover letter'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
                  {lettersToDisplay.map((letter, idx) => (
                    <ScrollReveal key={`cover-${letter.id}`} delay={idx * 100 + 100} duration={500} direction="up">
                      <ResumeCard
                        id={letter.id}
                        title={letter.title}
                        lastEdited={letter.lastEdited}
                        type="letter"
                        data={letter.data}
                        company={letter.company}
                        onDelete={handleDeleteLetter}
                        onDuplicate={handleDuplicateLetter}
                      />
                    </ScrollReveal>
                  ))}
                </div>
              )}
            </div>
          </ScrollReveal>

        </div>

        {/* Sidebar / Profile Progress */}
        <div className="col-span-1 lg:col-span-4">
          <ScrollReveal delay={200} duration={700} direction="left">
            <ProfileProgress percentage={70} />
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
