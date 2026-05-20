'use client';

import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
  Download, Edit2, Copy, Trash2, Share2,
  AlertTriangle, Check, X, Mail, MessageCircle, Link2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useResume } from "@/context/ResumeContext";
import { useCoverLetter } from "@/context/CoverLetterContext";

interface ResumeCardProps {
  id: number | string;
  title: string;
  lastEdited: string;
  thumbnailUrl?: string;
  type: 'resume' | 'letter';
  data?: any;
  company?: string;
  onDelete?: (id: number | string) => void;
  onDuplicate?: (id: number | string) => void;
}

function CSSArtThumbnail({ title, type }: { title: string; type: 'resume' | 'letter' }) {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col p-3 gap-1.5">
      <div className="h-2 w-3/4 bg-slate-200 rounded-full" />
      <div className="h-1.5 w-1/2 bg-blue-200 rounded-full" />
      <div className="mt-1 space-y-1">
        <div className="h-1 w-full bg-slate-100 rounded-full" />
        <div className="h-1 w-5/6 bg-slate-100 rounded-full" />
        <div className="h-1 w-4/6 bg-slate-100 rounded-full" />
      </div>
      <div className="mt-1.5 space-y-1">
        <div className="h-1 w-full bg-slate-100 rounded-full" />
        <div className="h-1 w-3/4 bg-slate-100 rounded-full" />
      </div>
      {type === 'resume' && (
        <div className="mt-auto flex gap-1">
          <div className="h-4 w-8 bg-blue-100 rounded" />
          <div className="h-4 w-10 bg-blue-100 rounded" />
        </div>
      )}
    </div>
  );
}

export function ResumeCard({
  id,
  title,
  lastEdited,
  thumbnailUrl,
  type,
  data,
  company,
  onDelete,
  onDuplicate,
}: ResumeCardProps) {
  const router = useRouter();
  const { setResumeData } = useResume();
  const { updateField } = useCoverLetter();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (shareRef.current && !shareRef.current.contains(e.target as Node)) {
        setShareOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEdit = () => {
    if (type === 'resume' && data) {
      setResumeData(data);
      router.push(`/editor?resume=${id}`);
    } else if (type === 'letter' && data) {
      router.push(`/cover-letter-editor?letter=${id}`);
    }
  };

  const handleDownload = () => {
    if (type === 'resume' && data) {
      setResumeData(data);
      router.push(`/editor?resume=${id}&print=1`);
    } else if (type === 'letter' && data) {
      router.push(`/cover-letter-editor?letter=${id}&print=1`);
    }
  };

  const handleDuplicate = () => {
    onDuplicate?.(id);
  };

  const handleShareOption = (option: 'whatsapp' | 'email' | 'copy') => {
    const fakeUrl = `https://myeasyresume.ca/share/${id}`;
    if (option === 'copy') {
      navigator.clipboard.writeText(fakeUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else if (option === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(`${title} — ${fakeUrl}`)}`, '_blank');
    } else {
      window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(fakeUrl)}`, '_blank');
    }
    setShareOpen(false);
  };

  return (
    <>
      <Card className="overflow-hidden border border-slate-200/60 rounded-[1.5rem] shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 group flex flex-col h-full bg-white relative">
        {/* Thumbnail */}
        <div className="relative w-full aspect-[1/1.4] bg-slate-50 overflow-hidden rounded-t-[1.4rem]">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={title}
              className="object-cover w-full h-full object-top group-hover:scale-[1.02] transition-transform duration-500 ease-out"
            />
          ) : (
            <CSSArtThumbnail title={title} type={type} />
          )}
          <div className="absolute inset-0 border border-slate-900/5 z-20 pointer-events-none rounded-t-[1.4rem]" />
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-950 text-white p-3.5 sm:p-5 flex flex-col justify-between flex-1 relative overflow-hidden rounded-b-[1.4rem]">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-20 pointer-events-none" />

          <div className="relative z-10">
            <h4 className="font-semibold text-sm sm:text-base md:text-lg tracking-tight text-slate-50 truncate">{title}</h4>
            {company && (
              <p className="text-blue-300 text-[10px] sm:text-xs font-semibold mt-0.5 truncate">{company}</p>
            )}
            <p className="text-slate-400 text-[10px] sm:text-xs mt-0.5 sm:mt-1 font-medium truncate">
              {lastEdited}
            </p>
          </div>

          <div className="flex items-center justify-between mt-3 sm:mt-6 relative z-10">
            {/* Download */}
            <button
              onClick={handleDownload}
              className="p-1.5 sm:p-2 -ml-1 sm:-ml-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all"
              title="Télécharger"
            >
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            <div className="flex items-center space-x-0.5 sm:space-x-1">
              {/* Edit */}
              <button
                onClick={handleEdit}
                className="p-1.5 sm:p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all"
                title="Modifier"
              >
                <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              {/* Duplicate */}
              <button
                onClick={handleDuplicate}
                className="p-1.5 sm:p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all"
                title="Dupliquer"
              >
                <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              {/* Delete */}
              <button
                onClick={() => setDeleteOpen(true)}
                className="p-1.5 sm:p-2 rounded-lg text-slate-300 hover:text-red-400 hover:bg-white/10 transition-all"
                title="Supprimer"
              >
                <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              {/* Share */}
              <div ref={shareRef} className="relative">
                <button
                  onClick={() => setShareOpen(prev => !prev)}
                  className="p-1.5 sm:p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all"
                  title="Partager"
                >
                  <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>

                {shareOpen && (
                  <div className="absolute bottom-full right-0 mb-2 w-44 bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden z-30 animate-fadeIn">
                    <button
                      onClick={() => handleShareOption('whatsapp')}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-green-500" />
                      WhatsApp
                    </button>
                    <button
                      onClick={() => handleShareOption('email')}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5 text-blue-500" />
                      E-mail
                    </button>
                    <button
                      onClick={() => handleShareOption('copy')}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      {copied
                        ? <Check className="w-3.5 h-3.5 text-emerald-500" />
                        : <Link2 className="w-3.5 h-3.5 text-slate-400" />}
                      {copied ? 'Copié !' : 'Copier le lien'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* ============================================================== */}
      {/* DELETE CONFIRM MODAL                                            */}
      {/* ============================================================== */}
      {deleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm select-none animate-fadeIn">
          <div className="bg-white rounded-[1.5rem] border border-slate-100 p-8 max-w-sm w-full mx-4 shadow-2xl relative overflow-hidden animate-slideUp">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-500/5 rounded-full blur-2xl pointer-events-none" />
            <button
              onClick={() => setDeleteOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 text-slate-400 hover:text-slate-700 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-14 h-14 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center mb-5">
                <AlertTriangle className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">
                Supprimer ce document ?
              </h3>
              <p className="text-sm text-slate-500 font-medium mt-2 leading-relaxed">
                « {title} » sera supprimé définitivement. Cette action est irréversible.
              </p>
            </div>
            <div className="flex gap-3 mt-7 relative z-10">
              <button
                onClick={() => setDeleteOpen(false)}
                className="flex-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl py-3 text-sm font-bold transition-all"
              >
                Annuler
              </button>
              <button
                onClick={() => { onDelete?.(id); setDeleteOpen(false); }}
                className="flex-1 bg-red-500 hover:bg-red-600 active:scale-[0.98] text-white rounded-xl py-3 text-sm font-bold transition-all shadow-md shadow-red-500/20"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
