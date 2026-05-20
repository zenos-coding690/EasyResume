'use client';

import React from 'react';
import { useResume } from '@/context/ResumeContext';
import { ProTemplateSidebar, SidebarTheme } from './templates/ProTemplateSidebar';
import { ProTemplateClassic, ClassicTheme } from './templates/ProTemplateClassic';
import { ProTemplateHeader, HeaderTheme } from './templates/ProTemplateHeader';
import { CanadianTemplate1 } from './templates/CanadianTemplate1';
import { CanadianTemplate2 } from './templates/CanadianTemplate2';
import { CanadianTemplate3 } from './templates/CanadianTemplate3';

// =========================================================================
// PALETTE DE COULEURS PAR MODÈLE (inspirée des miniatures réelles)
// =========================================================================

const sidebarThemes: Record<string, SidebarTheme> = {
  // pro-1: Teal/Turquoise sidebar (comme la miniature)
  'pro-1': {
    sidebarBg: '#0097a7', sidebarText: '#ffffff', sidebarHeading: '#b2ebf2',
    sidebarAccent: '#e0f7fa', headerAccent: '#0097a7', dateColor: '#0097a7',
    dateBg: '#e0f7fa', dotColor: '#0097a7', borderColor: '#e0e0e0', mainBg: '#fafafa',
  },
  // pro-2: Magenta/Violet sidebar
  'pro-2': {
    sidebarBg: '#ffffff', sidebarText: '#333333', sidebarHeading: '#880e4f',
    sidebarAccent: '#ad1457', headerAccent: '#ad1457', dateColor: '#ad1457',
    dateBg: '#fce4ec', dotColor: '#ad1457', borderColor: '#f8bbd0', mainBg: '#ffffff',
  },
  // pro-3: Bleu royal / Indigo sidebar
  'pro-3': {
    sidebarBg: '#1a237e', sidebarText: '#ffffff', sidebarHeading: '#c5cae9',
    sidebarAccent: '#7986cb', headerAccent: '#1a237e', dateColor: '#1a237e',
    dateBg: '#e8eaf6', dotColor: '#1a237e', borderColor: '#c5cae9', mainBg: '#fafafa',
  },
  // pro-4: Dark Navy + Teal accents
  'pro-4': {
    sidebarBg: '#1c2331', sidebarText: '#ffffff', sidebarHeading: '#80deea',
    sidebarAccent: '#26c6da', headerAccent: '#00acc1', dateColor: '#00acc1',
    dateBg: '#e0f7fa', dotColor: '#00acc1', borderColor: '#b2ebf2', mainBg: '#fafafa',
  },
  // pro-5: Dark charcoal + Amber/Gold
  'pro-5': {
    sidebarBg: '#263238', sidebarText: '#ffffff', sidebarHeading: '#ffcc80',
    sidebarAccent: '#ffb74d', headerAccent: '#ef6c00', dateColor: '#ef6c00',
    dateBg: '#fff3e0', dotColor: '#ef6c00', borderColor: '#ffe0b2', mainBg: '#fffde7',
  },
  // pro-6: Bordeaux / Magenta sidebar
  'pro-6': {
    sidebarBg: '#880e4f', sidebarText: '#ffffff', sidebarHeading: '#f8bbd0',
    sidebarAccent: '#f48fb1', headerAccent: '#c2185b', dateColor: '#c2185b',
    dateBg: '#fce4ec', dotColor: '#c2185b', borderColor: '#f8bbd0', mainBg: '#ffffff',
  },
};

const classicThemes: Record<string, ClassicTheme> = {
  // pro-7: Teal/Green classic
  'pro-7': {
    accentColor: '#00897b', headingBorder: '#b2dfdb',
    dateBadgeBg: '#e0f2f1', dateBadgeText: '#00695c',
  },
  // pro-9: Green / Vert foncé
  'pro-9': {
    accentColor: '#2e7d32', headingBorder: '#c8e6c9',
    dateBadgeBg: '#e8f5e9', dateBadgeText: '#1b5e20',
  },
};

const headerThemes: Record<string, HeaderTheme> = {
  // pro-8: Cyan/Light blue header
  'pro-8': {
    headerBg: '#00acc1', headerText: '#ffffff', accentColor: '#00838f',
    sectionLabelBg: '#e0f7fa', sectionLabelText: '#006064',
  },
  // pro-10: Navy Blue header
  'pro-10': {
    headerBg: '#0d47a1', headerText: '#ffffff', accentColor: '#1565c0',
    sectionLabelBg: '#e3f2fd', sectionLabelText: '#0d47a1',
  },
  // pro-11: Dark Blue + white text
  'pro-11': {
    headerBg: '#1a237e', headerText: '#ffffff', accentColor: '#283593',
    sectionLabelBg: '#e8eaf6', sectionLabelText: '#1a237e',
  },
  // pro-12: Blue/Navy corporate
  'pro-12': {
    headerBg: '#0d3b66', headerText: '#ffffff', accentColor: '#1565c0',
    sectionLabelBg: '#e3f2fd', sectionLabelText: '#0d3b66',
  },
};

export function TemplateRenderer() {
  const { resumeData } = useResume();
  const id = resumeData.templateId;

  // Canadian Templates
  if (id === 'can-1') return <CanadianTemplate1 />;
  if (id === 'can-2') return <CanadianTemplate2 />;
  if (id === 'can-3') return <CanadianTemplate3 />;

  // Pro Templates — Type A: Sidebar
  if (sidebarThemes[id]) return <ProTemplateSidebar theme={sidebarThemes[id]} />;

  // Pro Templates — Type C: Classic
  if (classicThemes[id]) return <ProTemplateClassic theme={classicThemes[id]} />;

  // Pro Templates — Type D: Header
  if (headerThemes[id]) return <ProTemplateHeader theme={headerThemes[id]} />;

  // Fallback: pro-1 style
  return <ProTemplateSidebar theme={sidebarThemes['pro-1']} />;
}
