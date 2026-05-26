'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'fr' | 'en';

export const translations = {
  fr: {
    // Sidebar
    dashboard: "Tableau de bord",
    profile: "Mon Profil",
    templates: "Modèles de CV",
    coverLetter: "Lettre de motivation",
    subscribe: "S'abonner",
    settings: "Paramètres",
    logout: "Se déconnecter",
    // Dashboard
    premiumTitle: "Boostez votre carrière avec le Premium",
    premiumDesc: "Obtenez 3 crédits de téléchargement PDF pour exporter vos documents en haute qualité.",
    premiumPrice: "2 500 FCFA",
    premiumPeriod: " / pack",
    premiumBtn: "Acheter un Pack",
    addTemplate: "Ajouter un modèle",
    createResume: "Créer un CV",
    createCoverLetter: "Lettre de motivation",
    download: "Téléchargements",
    resumesHeader: "Mes CV",
    coverLettersHeader: "Mes Lettres de Motivation",
    sampleResumeTitle: "Mon CV Professionnel",
    sampleCoverTitle: "Ma Lettre de Motivation",
    editedDays: "il y a 2 jours",
    // Profile Progress
    progressTitle: "Progression du profil",
    progressCompleted: "Complété",
    stepDetails: "Coordonnées",
    stepAcademic: "Formations & Diplômes",
    stepExperience: "Expériences Professionnelles",
    stepSkills: "Compétences",
    stepCareer: "Objectif Professionnel",
    viewProfile: "Voir le profil",
    editProfile: "Modifier",
    // Profile Page
    profilesTitle: "Profils",
    newProfileBtn: "Nouveau profil",
    profileDetailsTitle: "Détails du profil",
    editBtn: "Modifier",
    duplicateBtn: "Dupliquer",
    downloadBtn: "Télécharger",
    personalInfoSection: "Informations Personnelles",
    accountInfoTitle: "Informations du compte",
    usernameLabel: "Nom d'utilisateur",
    emailLabel: "Adresse e-mail",
    phoneLabel: "Numéro de téléphone",
    downloadedResumesLabel: "CV Téléchargés",
    copyAffiliateLink: "Copier le lien d'affiliation",
    downloadAvailableStatus: "Téléchargement disponible : 0",
    copiedSuccess: "Copié !",
    // fields
    fieldNom: "Nom",
    fieldPrenom: "Prénom",
    fieldProfession: "Profession",
    fieldAddress: "Adresse",
    fieldBirthDate: "Date de naissance",
    fieldMaritalStatus: "Statut matrimonial",
    fieldEmail: "E-mail",
    fieldPhone: "Téléphone",
    fieldWebsite: "Site web",
    // Settings Page
    settingsTitle: "Paramètres",
    settingsSubtitle: "Gérez votre sécurité, vos préférences de mise en page et vos informations de facturation.",
    tabSecurity: "Sécurité & Mot de passe",
    tabBilling: "Abonnement & Facturation",
    tabPreferences: "Préférences d'impression",
    tabNotifications: "Alertes e-mails",
    changePasswordTitle: "Changer le mot de passe",
    changePasswordDesc: "Assurez la sécurité de votre compte avec un mot de passe fort.",
    currentPasswordLabel: "Mot de passe actuel",
    newPasswordLabel: "Nouveau mot de passe",
    confirmPasswordLabel: "Confirmer le nouveau mot de passe",
    saveSettingsBtn: "Enregistrer les modifications",
    billingTitle: "Mon Abonnement",
    billingDesc: "Consultez vos détails d'abonnement et l'historique des reçus.",
    currentPlanLabel: "Plan actuel",
    planPremiumPrice: "Premium - 2 500 FCFA/mois",
    invoiceDate: "Date de facturation",
    invoiceAmount: "Montant",
    invoiceStatus: "Statut",
    prefTitle: "Préférences de mise en page",
    prefDesc: "Définissez les options par défaut pour la création et l'impression de vos documents.",
    paperFormatLabel: "Format de page par défaut",
    defaultLangLabel: "Langue par défaut des CV",
    notifyTitle: "Alertes par courriel",
    notifyDesc: "Choisissez les courriels d'alertes et de notifications que vous souhaitez recevoir.",
    notifyDownloads: "M'alerter lorsqu'un CV est téléchargé",
    notifyTemplates: "M'avertir de l'ajout de nouveaux modèles Premium",
    // Pricing Page
    pricingTitle: "Choisissez le plan qui vous convient le mieux !",
    pricingSubtitle: "Des crédits de téléchargement pour finaliser et exporter vos documents.",
    plan1Name: "Démarrage rapide",
    plan2Name: "Chasseur d'emploi",
    plan3Name: "Boosteur de carrière",
    plan1Price: "800 XAF",
    plan2Price: "2 500 XAF",
    plan3Price: "4 500 XAF",
    plan1FeatDownload: "01 Téléchargement",
    plan2FeatDownload: "03 Téléchargements",
    plan3FeatDownload: "10 Téléchargements",
    plan1FeatAI: "0 Interactions avec l'assistant",
    plan2FeatAI: "0 Interactions avec l'assistant",
    plan3FeatAI: "0 Interactions avec l'assistant",
    featPreviews: "Prévisualisations illimitées",
    featSupport: "Support gratuit inclus",
    featNoExpiry: "Pas d'expiration de téléchargements",
    popularBadge: "Recommandé",
    choosePlanBtn: "Choisir ce plan",
    needMorePrompts: "Besoin de prompts IA supplémentaires ?",
    buyHereBtn: "Acheter ici",
    // Templates Page
    templatesTitle: "Modèles de CV Premium",
    templatesSubtitle: "Découvrez notre collection de modèles conçus par des experts pour propulser votre carrière.",
    sectionProCV: "CV Professionnels",
    sectionCanadianCV: "CV Format Canadien",
    useTemplateBtn: "Utiliser ce modèle",
    previewBtn: "Aperçu",
    // Cover Letter Page
    coverLetterTitle: "Modèles de Lettres",
    coverLetterSubtitle: "Des modèles de lettres percutants, adaptés aux standards internationaux et canadiens.",
    sectionCoverLetter: "Lettres de motivation",
    sectionJobApp: "Lettres de demande d'emploi",
    // Editor
    editorStepPersonal: "Informations Personnelles",
    editorStepSummary: "Profil Professionnel",
    editorStepExperience: "Expériences Professionnelles",
    editorStepEducation: "Éducation",
    editorStepSkills: "Compétences, Loisirs et Intérêts",
    btnPrevious: "Précédent",
    btnNext: "Suivant",
    btnGenerateProfile: "Générer le profil ✨",
    btnGenerateTasks: "Générer les tâches ✨",
    btnAddExperience: "Ajouter une expérience",
    btnAddEducation: "Ajouter une éducation",
    fieldCompany: "Nom de l'entreprise",
    fieldPosition: "Poste",
    fieldSchool: "Nom de l'école",
    fieldDegree: "Diplôme",
    fieldSpecialty: "Spécialité",
    fieldStartMonth: "Mois Début",
    fieldStartYear: "Année Début",
    fieldEndMonth: "Mois Fin",
    fieldEndYear: "Année Fin",
    fieldTasksDesc: "Saisissez une description des tâches effectuées...",
    uploadPhoto: "Télécharger une photo",
    addMoreInfo: "Ajouter des informations supplémentaires",
    // Cover Letter Editor
    clEditorTitle: "Éditeur de Lettre",
    clStepSender: "Vos Informations",
    clStepRecipient: "Entreprise & Objet",
    clStepContent: "Contenu & Signature",
    clSenderName: "Nom complet",
    clSenderAddress: "Adresse postale",
    clSenderCity: "Ville, Code postal",
    clSenderPhone: "Téléphone",
    clSenderEmail: "Adresse e-mail",
    clRecipientName: "Nom du destinataire",
    clRecipientTitle: "Fonction du destinataire",
    clCompanyName: "Nom de l'entreprise",
    clCompanyAddress: "Adresse de l'entreprise",
    clCompanyCity: "Ville de l'entreprise",
    clDate: "Date",
    clSubject: "Objet de la lettre",
    clJobTitle: "Poste visé",
    clBodyPlaceholder: "Rédigez votre lettre ici ou laissez l'IA la rédiger pour vous...",
    clClosingFormula: "Formule de politesse",
    clSignatureTitle: "Signature Numérique",
    clSignatureDesc: "Dessinez votre signature ci-dessous avec la souris ou le doigt.",
    clClearSignature: "Effacer la signature",
    clBtnGenerateLetter: "Rédiger par l'IA ✨",
    clBtnExportPdf: "Exporter PDF",
    clBtnQuit: "← Quitter",
    clBtnFinish: "Terminer & Sauvegarder",
    clFormulaOption1: "Veuillez agréer, Madame, Monsieur, l'expression de mes salutations distinguées.",
    clFormulaOption2: "Je vous prie d'agréer l'expression de mes sentiments respectueux.",
    clFormulaOption3: "Cordialement,",
    clFormulaCustom: "Formule personnalisée...",
    clRecipientPlaceholder: "Ex: Directeur des Ressources Humaines",
    clSubjectPlaceholder: "Ex: Candidature au poste de Développeur Web",
    clAiBrief: "Brief pour l'IA ✨",
    clAiBriefPlaceholder: "Décrivez votre profil en 2-3 phrases : vos années d'expérience, vos points forts, pourquoi vous voulez rejoindre cette entreprise... L'IA s'en servira pour personnaliser votre lettre.",
    clAiBriefHint: "Plus votre brief est précis, plus votre lettre sera percutante.",
    clProfileDetected: "Profil CV détecté — l'IA utilisera vos expériences et compétences automatiquement.",
    clProfileEmpty: "Aucun CV rempli. Ajoutez un brief ci-dessous pour guider l'IA.",
    clPickCv: "Choisir un CV source",
    clPickCvHint: "L'IA utilisera les données de ce CV pour rédiger votre lettre.",
    clPickCvNone: "Aucun CV sauvegardé trouvé. Créez d'abord un CV dans l'éditeur.",
    clPickCvActive: "CV sélectionné",
    clPickCvChange: "Changer de CV",
    clPickCvSelect: "Utiliser ce CV",
    clPickCvEdited: "Modifié le",
  },
  en: {
    // Sidebar
    dashboard: "Dashboard",
    profile: "Manage Profile",
    templates: "CV Templates",
    coverLetter: "Cover Letter",
    subscribe: "Subscribe",
    settings: "Settings",
    logout: "Log Out",
    // Dashboard
    premiumTitle: "More with Premium",
    premiumDesc: "Get 3 PDF download credits to export your documents in high quality.",
    premiumPrice: "2 500 FCFA",
    premiumPeriod: " / pack",
    premiumBtn: "Buy a Pack",
    addTemplate: "Add Template",
    createResume: "Create Resume",
    createCoverLetter: "Cover Letter",
    download: "Download",
    resumesHeader: "Resume",
    coverLettersHeader: "Cover Letter",
    sampleResumeTitle: "My Resume",
    sampleCoverTitle: "My Cover Letter",
    editedDays: "2 days ago",
    // Profile Progress
    progressTitle: "Your Profile Progress",
    progressCompleted: "Completed",
    stepDetails: "Personal Details",
    stepAcademic: "Academic Qualification",
    stepExperience: "Work Experience",
    stepSkills: "Skills",
    stepCareer: "Career Object",
    viewProfile: "View Profile",
    editProfile: "Edit Profile",
    // Profile Page
    profilesTitle: "Profiles",
    newProfileBtn: "New Profile",
    profileDetailsTitle: "Profile Details",
    editBtn: "Edit",
    duplicateBtn: "Duplicate",
    downloadBtn: "Download",
    personalInfoSection: "Personal Information",
    accountInfoTitle: "Account Information",
    usernameLabel: "Username",
    emailLabel: "E-mail Address",
    phoneLabel: "Phone Number",
    downloadedResumesLabel: "Downloaded CVs",
    copyAffiliateLink: "Copy Affiliate Link",
    downloadAvailableStatus: "Download available: 0",
    copiedSuccess: "Copied!",
    // fields
    fieldNom: "Last Name",
    fieldPrenom: "First Name",
    fieldProfession: "Profession",
    fieldAddress: "Address",
    fieldBirthDate: "Birth Date",
    fieldMaritalStatus: "Marital Status",
    fieldEmail: "E-mail",
    fieldPhone: "Phone",
    fieldWebsite: "Website",
    // Settings Page
    settingsTitle: "Settings",
    settingsSubtitle: "Manage your security, page layouts preferences and billing information.",
    tabSecurity: "Security & Password",
    tabBilling: "Subscription & Billing",
    tabPreferences: "Print Preferences",
    tabNotifications: "Email Alerts",
    changePasswordTitle: "Change Password",
    changePasswordDesc: "Ensure your account security with a strong password.",
    currentPasswordLabel: "Current Password",
    newPasswordLabel: "New Password",
    confirmPasswordLabel: "Confirm New Password",
    saveSettingsBtn: "Save Changes",
    billingTitle: "My Subscription",
    billingDesc: "View your subscription details and invoice history.",
    currentPlanLabel: "Current Plan",
    planPremiumPrice: "Premium - 2 500 FCFA/month",
    invoiceDate: "Billing Date",
    invoiceAmount: "Amount",
    invoiceStatus: "Status",
    prefTitle: "Page Layout Preferences",
    prefDesc: "Set default options for document creation and printing.",
    paperFormatLabel: "Default Paper Size",
    defaultLangLabel: "Default Resume Language",
    notifyTitle: "Email Alerts",
    notifyDesc: "Select the email alerts and notifications you want to receive.",
    notifyDownloads: "Alert me when a resume is downloaded",
    notifyTemplates: "Notify me about new Premium templates",
    // Pricing Page
    pricingTitle: "Choose the plan that suits you best!",
    pricingSubtitle: "Download credits to finalize and export your documents.",
    plan1Name: "Quick Start",
    plan2Name: "Job Hunter",
    plan3Name: "Career Booster",
    plan1Price: "800 XAF",
    plan2Price: "2 500 XAF",
    plan3Price: "4 500 XAF",
    plan1FeatDownload: "01 Download",
    plan2FeatDownload: "03 Downloads",
    plan3FeatDownload: "10 Downloads",
    plan1FeatAI: "0 Assistant interactions",
    plan2FeatAI: "0 Assistant interactions",
    plan3FeatAI: "0 Assistant interactions",
    featPreviews: "Unlimited previews",
    featSupport: "Free support included",
    featNoExpiry: "Downloads never expire",
    popularBadge: "Recommended",
    choosePlanBtn: "Choose Plan",
    needMorePrompts: "Need extra AI prompts?",
    buyHereBtn: "Buy here",
    // Templates Page
    templatesTitle: "Premium CV Templates",
    templatesSubtitle: "Discover our collection of expertly designed templates to boost your career.",
    sectionProCV: "Professional Resumes",
    sectionCanadianCV: "Canadian Format Resumes",
    useTemplateBtn: "Use Template",
    previewBtn: "Preview",
    // Cover Letter Page
    coverLetterTitle: "Cover Letter Templates",
    coverLetterSubtitle: "Impactful letter templates adapted to international and Canadian standards.",
    sectionCoverLetter: "Cover Letters",
    sectionJobApp: "Job Application Letters",
    // Editor
    editorStepPersonal: "Personal Information",
    editorStepSummary: "Professional Profile",
    editorStepExperience: "Professional Experience",
    editorStepEducation: "Education",
    editorStepSkills: "Skills, Hobbies & Interests",
    btnPrevious: "Previous",
    btnNext: "Next",
    btnGenerateProfile: "Generate profile ✨",
    btnGenerateTasks: "Generate tasks ✨",
    btnAddExperience: "Add an experience",
    btnAddEducation: "Add an education",
    fieldCompany: "Company Name",
    fieldPosition: "Position",
    fieldSchool: "School Name",
    fieldDegree: "Degree",
    fieldSpecialty: "Specialty",
    fieldStartMonth: "Start Month",
    fieldStartYear: "Start Year",
    fieldEndMonth: "End Month",
    fieldEndYear: "End Year",
    fieldTasksDesc: "Enter a description of the tasks performed...",
    uploadPhoto: "Upload a photo",
    addMoreInfo: "Add extra information",
    // Cover Letter Editor
    clEditorTitle: "Letter Editor",
    clStepSender: "Your Information",
    clStepRecipient: "Company & Subject",
    clStepContent: "Content & Signature",
    clSenderName: "Full name",
    clSenderAddress: "Postal address",
    clSenderCity: "City, Postal code",
    clSenderPhone: "Phone",
    clSenderEmail: "Email address",
    clRecipientName: "Recipient name",
    clRecipientTitle: "Recipient title",
    clCompanyName: "Company name",
    clCompanyAddress: "Company address",
    clCompanyCity: "Company city",
    clDate: "Date",
    clSubject: "Letter subject",
    clJobTitle: "Target position",
    clBodyPlaceholder: "Write your letter here or let AI write it for you...",
    clClosingFormula: "Closing formula",
    clSignatureTitle: "Digital Signature",
    clSignatureDesc: "Draw your signature below using mouse or finger.",
    clClearSignature: "Clear signature",
    clBtnGenerateLetter: "Write with AI ✨",
    clBtnExportPdf: "Export PDF",
    clBtnQuit: "← Back",
    clBtnFinish: "Finish & Save",
    clFormulaOption1: "Yours sincerely,",
    clFormulaOption2: "With kind regards,",
    clFormulaOption3: "Best regards,",
    clFormulaCustom: "Custom formula...",
    clRecipientPlaceholder: "E.g.: Director of Human Resources",
    clSubjectPlaceholder: "E.g.: Application for Web Developer position",
    clAiBrief: "AI Brief ✨",
    clAiBriefPlaceholder: "Describe your profile in 2-3 sentences: years of experience, key strengths, why you want to join this company... The AI will use this to personalize your letter.",
    clAiBriefHint: "The more precise your brief, the more impactful your letter will be.",
    clProfileDetected: "CV profile detected — the AI will automatically use your experiences and skills.",
    clProfileEmpty: "No CV filled in. Add a brief below to guide the AI.",
    clPickCv: "Choose a source CV",
    clPickCvHint: "The AI will use this CV's data to write your letter.",
    clPickCvNone: "No saved CV found. Create one in the editor first.",
    clPickCvActive: "Selected CV",
    clPickCvChange: "Change CV",
    clPickCvSelect: "Use this CV",
    clPickCvEdited: "Last edited",
  }
};

interface LanguageContextType {
  language: Language;
  t: (key: keyof typeof translations.fr) => string;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('fr');

  useEffect(() => {
    // Retrieve language from localStorage if available
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang === 'fr' || savedLang === 'en') {
      setLanguageState(savedLang);
    } else if (typeof navigator !== 'undefined') {
      // Auto-detect browser language
      const browserLang = navigator.language || (navigator.languages && navigator.languages[0]);
      if (browserLang && browserLang.toLowerCase().startsWith('en')) {
        setLanguageState('en');
      } else {
        setLanguageState('fr');
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'fr' ? 'en' : 'fr');
  };

  const t = (key: keyof typeof translations.fr): string => {
    return translations[language][key] || translations.fr[key] || '';
  };

  return (
    <LanguageContext.Provider value={{ language, t, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
