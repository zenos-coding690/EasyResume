'use client';

import React from 'react';
import { useCoverLetter } from '@/context/CoverLetterContext';
import { CoverLetterTemplate1 } from './templates/CoverLetterTemplate1';
import { CoverLetterTemplate2 } from './templates/CoverLetterTemplate2';
import { JobApplicationTemplate } from './templates/JobApplicationTemplate';

export function CoverLetterRenderer() {
  const { letterData } = useCoverLetter();
  const id = letterData.templateId;

  if (id === 'cl-2') return <CoverLetterTemplate2 />;
  if (id === 'ja-1') return <JobApplicationTemplate />;

  // Default: cl-1 (Standard)
  return <CoverLetterTemplate1 />;
}
