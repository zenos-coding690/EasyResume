'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useCoverLetter } from '@/context/CoverLetterContext';
import { useLanguage } from '@/context/LanguageContext';
import { useTokens } from '@/context/TokenContext';
import { useResume } from '@/context/ResumeContext';
import { ResumeData } from '@/context/ResumeContext';
import { Sparkles, Loader2, Eraser, PenTool, ChevronDown, CheckCircle2, Wand2 } from 'lucide-react';

// ── Helpers ────────────────────────────────────────────────────────────────────

function buildContextSummary(
  resumeData: ResumeData,
  aiBrief: string
): string {
  const parts: string[] = [];

  // 1. Brief libre du candidat (priorité maximale)
  if (aiBrief.trim()) {
    parts.push(`Brief du candidat : "${aiBrief.trim()}"`);
  }

  // 2. Résumé professionnel du CV
  if (resumeData.professionalSummary.trim()) {
    parts.push(`Résumé professionnel : ${resumeData.professionalSummary.trim()}`);
  }

  // 3. Expériences (jusqu'à 3)
  if (resumeData.experiences.length > 0) {
    const expList = resumeData.experiences
      .slice(0, 3)
      .map(exp => `${exp.jobTitle} chez ${exp.company} (${exp.startDate}–${exp.endDate || 'présent'})`)
      .join(', ');
    parts.push(`Expériences professionnelles : ${expList}`);
  }

  // 4. Formations (jusqu'à 2)
  if (resumeData.educations.length > 0) {
    const eduList = resumeData.educations
      .slice(0, 2)
      .map(edu => `${edu.degree} en ${edu.specialty} — ${edu.school}`)
      .join(', ');
    parts.push(`Formation : ${eduList}`);
  }

  // 5. Compétences
  if (resumeData.skills.trim()) {
    const skillsPreview = resumeData.skills.trim().split(/[\n,]/).slice(0, 6).join(', ');
    parts.push(`Compétences clés : ${skillsPreview}`);
  }

  // 6. Langues
  if (resumeData.languages.length > 0) {
    const langList = resumeData.languages.map(l => l.name).join(', ');
    parts.push(`Langues : ${langList}`);
  }

  return parts.join('\n');
}

function generatePersonalizedLetter(
  templateId: string,
  company: string,
  job: string,
  candidateName: string,
  contextSummary: string,
  hasRealContext: boolean
): string {
  const isJobApp = templateId === 'ja-1';
  const isCanadian = templateId === 'cl-2';

  // ── DEMANDE D'EMPLOI ─────────────────────────────────────────────────────
  if (isJobApp) {
    if (hasRealContext) {
      return `Madame, Monsieur,

Par la présente, j'ai l'honneur de solliciter un emploi au sein de ${company}, et plus particulièrement pour le poste de ${job}.

${contextSummary.includes('Brief du candidat') ? contextSummary.split('\n')[0].replace('Brief du candidat : "', '').replace('"', '') + '\n\nC' : 'C'}onfiant(e) dans les atouts que j'ai développés au cours de mon parcours professionnel, je suis convaincu(e) que mon profil correspond aux exigences de votre structure. ${contextSummary.includes('Expériences professionnelles') ? 'En tant que ' + contextSummary.split('Expériences professionnelles : ')[1]?.split(',')[0]?.trim() + ', j\'ai acquis une expertise directement transférable au poste proposé.' : 'Mon expérience m\'a permis de développer des compétences solides dans ce domaine.'}

${contextSummary.includes('Compétences clés') ? 'Parmi mes compétences : ' + contextSummary.split('Compétences clés : ')[1]?.split('\n')[0] + '.' : 'Doté(e) d\'une solide expérience technique et relationnelle,'} je suis animé(e) par un grand sens du professionnalisme et une capacité avérée d'adaptation aux environnements exigeants.

Désireux(se) de mettre mes compétences au service de ${company}, je serais honoré(e) de vous rencontrer afin de vous exposer plus en détail mon parcours et mes ambitions. Je reste disponible pour un entretien à votre convenance.

Dans l'attente de votre réponse favorable, je vous prie d'agréer, Madame, Monsieur, l'expression de mes respectueuses salutations.`;
    }

    return `Madame, Monsieur,

Par la présente, j'ai l'honneur de solliciter un emploi au sein de ${company}, et plus particulièrement pour le poste de ${job}.

Titulaire d'une formation solide et doté(e) d'une expérience professionnelle significative dans ce domaine, je suis convaincu(e) que mon profil correspond aux exigences de votre structure. Au cours de mes précédentes fonctions, j'ai développé des compétences avérées en gestion de projets, en travail collaboratif et en résolution de problèmes complexes.

Animé(e) par une grande motivation et un sens aigu du professionnalisme, je serais honoré(e) de mettre mes compétences au service de ${company}. Je suis disponible pour un entretien à votre convenance afin de vous exposer plus en détail mon parcours et mes ambitions.

Dans l'attente de votre réponse favorable, je reste à votre entière disposition pour tout complément d'information.`;
  }

  // ── FORMAT CANADIEN (anglais) ─────────────────────────────────────────────
  if (isCanadian) {
    const firstExp = contextSummary.includes('Expériences professionnelles')
      ? contextSummary.split('Expériences professionnelles : ')[1]?.split(',')[0]?.trim()
      : null;

    const skills = contextSummary.includes('Compétences clés')
      ? contextSummary.split('Compétences clés : ')[1]?.split('\n')[0]
      : null;

    const briefLine = contextSummary.includes('Brief du candidat')
      ? contextSummary.split('Brief du candidat : "')[1]?.replace('"', '').split('\n')[0]
      : null;

    return `Dear Hiring Manager,

I am writing to express my strong interest in the ${job} position at ${company}.${briefLine ? ' ' + briefLine : ''}

${firstExp ? `As a ${firstExp}, I have built a solid track record of delivering impactful results. ` : ''}${skills ? `My key competencies include: ${skills}.` : 'Throughout my career, I have consistently demonstrated the ability to adapt quickly and drive projects to successful completion.'}

I am particularly drawn to ${company}'s reputation and its commitment to excellence in the industry. I am confident that my background makes me a strong fit for this role, and I am eager to contribute to your team's continued success.

I would welcome the opportunity to discuss how my experience aligns with your needs. Thank you for considering my application.`;
  }

  // ── LETTRE STANDARD (français) ────────────────────────────────────────────
  const firstExpTitle = contextSummary.includes('Expériences professionnelles')
    ? contextSummary.split('Expériences professionnelles : ')[1]?.split(' chez ')[0]?.trim()
    : null;

  const firstExpCompany = contextSummary.includes('Expériences professionnelles')
    ? contextSummary.split(' chez ')[1]?.split(' (')[0]?.trim()
    : null;

  const skills = contextSummary.includes('Compétences clés')
    ? contextSummary.split('Compétences clés : ')[1]?.split('\n')[0]
    : null;

  const brief = contextSummary.includes('Brief du candidat')
    ? contextSummary.split('Brief du candidat : "')[1]?.replace('"', '').split('\n')[0]
    : null;

  const edu = contextSummary.includes('Formation')
    ? contextSummary.split('Formation : ')[1]?.split('\n')[0]
    : null;

  if (hasRealContext) {
    return `Madame, Monsieur,

${brief ? brief + '\n\nC' : 'C'}'est avec un vif intérêt que je me permets de vous soumettre ma candidature pour le poste de ${job} au sein de ${company}.

${firstExpTitle ? `En tant que ${firstExpTitle}${firstExpCompany ? ' chez ' + firstExpCompany : ''}, j'ai développé une expertise concrète et des résultats mesurables dans mon domaine. ` : ''}${edu ? `Titulaire d'un(e) ${edu}, j'allie des bases théoriques solides à une expérience terrain reconnue. ` : ''}${skills ? `Mes compétences principales incluent : ${skills}. ` : ''}Cette combinaison fait de moi un profil capable de s'intégrer rapidement et d'apporter une contribution immédiate à vos équipes.

Votre entreprise ${company} m'attire particulièrement pour son dynamisme et les opportunités de croissance qu'elle offre. Je suis convaincu(e) que rejoindre vos équipes me permettrait de mettre à profit mon expérience tout en continuant à me développer professionnellement.

Je reste à votre entière disposition pour un entretien et vous remercie de l'attention portée à ma candidature.`;
  }

  // Fallback générique
  return `Madame, Monsieur,

Vivement intéressé(e) par le poste de ${job} au sein de ${company}, je me permets de vous soumettre ma candidature. Votre entreprise, reconnue pour son excellence et son engagement envers l'innovation, représente pour moi l'opportunité idéale de mettre en valeur mes compétences professionnelles.

Fort(e) d'une expérience significative dans ce domaine, j'ai développé une expertise solide en gestion de projets, en communication stratégique et en résolution de problèmes complexes. Mon parcours m'a permis de cultiver un sens aigu de l'organisation et une capacité d'adaptation qui me permettent de m'intégrer rapidement dans des environnements exigeants et dynamiques.

Je suis convaincu(e) que ma motivation, mon professionnalisme et mes compétences techniques constituent des atouts précieux pour contribuer activement au succès de ${company}. Je serais ravi(e) de pouvoir vous rencontrer afin de vous exposer de vive voix les raisons pour lesquelles je souhaite rejoindre votre équipe.

Je me tiens à votre entière disposition pour un entretien à votre convenance et vous remercie de l'attention que vous porterez à ma candidature.`;
}

// ── Composant Principal ────────────────────────────────────────────────────────

export function ContentStep() {
  const { letterData, updateField, setSignature, clearSignature, selectedResume } = useCoverLetter();
  const { t } = useLanguage();
  const { consumeToken } = useTokens();
  const { resumeData: currentResumeData } = useResume();

  // Priorité : CV sélectionné manuellement > CV en cours d'édition
  const resumeData = selectedResume ? selectedResume.data : currentResumeData;
  const [isGenerating, setIsGenerating] = useState(false);
  const [showFormulaDropdown, setShowFormulaDropdown] = useState(false);
  const [generationDone, setGenerationDone] = useState(false);

  // --- Canvas Signature ---
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#1e293b';
    if (letterData.signatureDataUrl) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, rect.width, rect.height);
      img.src = letterData.signatureDataUrl;
      setHasDrawn(true);
    }
  }, [letterData.signatureDataUrl]);

  useEffect(() => {
    initCanvas();
    window.addEventListener('resize', initCanvas);
    return () => window.removeEventListener('resize', initCanvas);
  }, [initCanvas]);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: (e as React.MouseEvent).clientX - rect.left, y: (e as React.MouseEvent).clientY - rect.top };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    setIsDrawing(true);
    setHasDrawn(true);
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (canvasRef.current && hasDrawn) {
      setSignature(canvasRef.current.toDataURL('image/png'));
    }
  };

  const handleClearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    setHasDrawn(false);
    clearSignature();
  };

  // --- Génération IA enrichie ---
  const handleGenerateAI = async () => {
    const company = letterData.companyName || 'votre entreprise';
    const job = letterData.jobTitle || 'le poste proposé';

    const contextSummary = buildContextSummary(resumeData, letterData.aiBrief);
    const hasRealContext = contextSummary.trim().length > 0;

    const success = consumeToken(10);
    if (!success) return;

    setIsGenerating(true);
    setGenerationDone(false);

    // Simulation du délai de traitement IA (1.5–2.5s)
    await new Promise(r => setTimeout(r, 2000));

    const candidateName = letterData.senderFullName ||
      `${resumeData.personalInfo.firstName} ${resumeData.personalInfo.lastName}`.trim();

    const generatedBody = generatePersonalizedLetter(
      letterData.templateId,
      company,
      job,
      candidateName,
      contextSummary,
      hasRealContext
    );

    updateField('body', generatedBody);
    setIsGenerating(false);
    setGenerationDone(true);

    // Reset feedback après 3s
    setTimeout(() => setGenerationDone(false), 3000);
  };

  const formulaOptions = [
    t('clFormulaOption1'),
    t('clFormulaOption2'),
    t('clFormulaOption3'),
  ];

  // Calcul des sources disponibles pour affichage
  const sourceCount = [
    resumeData.experiences.length > 0,
    resumeData.skills.trim().length > 0,
    resumeData.educations.length > 0,
    letterData.aiBrief.trim().length > 0,
    selectedResume !== null,
  ].filter(Boolean).length;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto space-y-8">

      {/* Corps de la lettre */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">{t('clStepContent')}</h2>
            {sourceCount > 0 && (
              <p className="text-xs text-violet-600 font-semibold mt-1 flex items-center gap-1.5">
                <Wand2 className="w-3.5 h-3.5" />
                {sourceCount} source{sourceCount > 1 ? 's' : ''} contextuelle{sourceCount > 1 ? 's' : ''} disponible{sourceCount > 1 ? 's' : ''}
              </p>
            )}
          </div>
          <button
            onClick={handleGenerateAI}
            disabled={isGenerating}
            className={`flex items-center justify-center px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shrink-0
              ${generationDone
                ? 'bg-emerald-500 shadow-emerald-500/20 text-white'
                : 'bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-purple-500/20'
              }`}
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : generationDone ? (
              <CheckCircle2 className="w-4 h-4 mr-2" />
            ) : (
              <Sparkles className="w-4 h-4 mr-2" />
            )}
            {generationDone
              ? 'Lettre générée !'
              : isGenerating
              ? 'Rédaction en cours...'
              : `${t('clBtnGenerateLetter')} `}
            {!generationDone && !isGenerating && (
              <span className="ml-1.5 opacity-80 font-normal">(10 💎)</span>
            )}
          </button>
        </div>

        <div className="p-[2px] rounded-2xl bg-gradient-to-br from-slate-200 to-slate-100 focus-within:from-purple-400 focus-within:to-violet-400 transition-colors shadow-sm">
          <textarea
            value={letterData.body}
            onChange={(e) => updateField('body', e.target.value)}
            placeholder={t('clBodyPlaceholder')}
            className="w-full h-72 p-5 bg-white rounded-[14px] border-none resize-none focus:outline-none focus:ring-0 text-sm text-slate-700 leading-relaxed font-medium"
          />
        </div>
      </div>

      {/* Formule de politesse */}
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t('clClosingFormula')}</label>
        <div className="relative">
          <button
            onClick={() => setShowFormulaDropdown(!showFormulaDropdown)}
            className="w-full flex items-center justify-between px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 font-medium hover:border-slate-300 transition-colors text-left"
          >
            <span className="truncate pr-4">{letterData.closingFormula || t('clFormulaCustom')}</span>
            <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${showFormulaDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showFormulaDropdown && (
            <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
              {formulaOptions.map((formula, i) => (
                <button
                  key={i}
                  onClick={() => { updateField('closingFormula', formula); setShowFormulaDropdown(false); }}
                  className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-blue-50 hover:text-[#1062FE] transition-colors border-b border-slate-50 last:border-b-0 font-medium"
                >
                  {formula}
                </button>
              ))}
              <div className="p-3 border-t border-slate-100">
                <input
                  type="text"
                  placeholder={t('clFormulaCustom')}
                  value={!formulaOptions.includes(letterData.closingFormula) ? letterData.closingFormula : ''}
                  onChange={(e) => updateField('closingFormula', e.target.value)}
                  onFocus={() => { if (formulaOptions.includes(letterData.closingFormula)) updateField('closingFormula', ''); }}
                  className="w-full px-3 py-2 bg-slate-50 rounded-lg text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#1062FE]/30 border border-slate-200"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Signature Numérique */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <PenTool className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-bold text-slate-700">{t('clSignatureTitle')}</h3>
          </div>
          {hasDrawn && (
            <button
              onClick={handleClearSignature}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            >
              <Eraser className="w-3.5 h-3.5" />
              {t('clClearSignature')}
            </button>
          )}
        </div>
        <p className="text-xs text-slate-400 font-medium mb-3">{t('clSignatureDesc')}</p>
        <div className="relative rounded-2xl border-2 border-dashed border-slate-200 hover:border-slate-300 bg-white overflow-hidden transition-colors">
          <div className="absolute bottom-[30%] left-6 right-6 border-b border-slate-100 pointer-events-none" />
          {!hasDrawn && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-sm text-slate-200 font-semibold italic select-none">Signez ici</span>
            </div>
          )}
          <canvas
            ref={canvasRef}
            className="w-full cursor-crosshair touch-none"
            style={{ height: '140px' }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
        </div>
      </div>
    </div>
  );
}
