"use client";

import React, { useState, useEffect } from 'react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { LayoutTemplate, PencilLine, Download, ChevronRight, ChevronLeft } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: "1. Choisissez un modèle premium",
    description: "Parcourez notre galerie et sélectionnez le design qui correspond le mieux à votre secteur d'activité.",
    icon: <LayoutTemplate className="w-10 h-10 text-white" />,
    color: "bg-blue-500",
  },
  {
    id: 2,
    title: "2. Remplissez vos informations",
    description: "Utilisez notre éditeur assisté pour ajouter vos expériences, compétences et formations facilement.",
    icon: <PencilLine className="w-10 h-10 text-white" />,
    color: "bg-indigo-500",
  },
  {
    id: 3,
    title: "3. Téléchargez en PDF",
    description: "Exportez votre CV finalisé au format PDF haute qualité, prêt à être envoyé aux recruteurs.",
    icon: <Download className="w-10 h-10 text-white" />,
    color: "bg-emerald-500",
  }
];

export default function HowItWorks() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextStep = () => setCurrentStep((prev) => (prev + 1) % steps.length);
  const prevStep = () => setCurrentStep((prev) => (prev - 1 + steps.length) % steps.length);

  return (
    <section className="py-24 bg-slate-50 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Comment ça fonctionne ?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Créez un CV professionnel en quelques minutes grâce à notre processus simplifié en 3 étapes.
            </p>
          </ScrollReveal>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Timeline Line for Desktop */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0 rounded-full"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, index) => (
              <ScrollReveal key={step.id} delay={index * 150} className="h-full">
                <div 
                  className={`flex flex-col items-center text-center p-6 rounded-[1.5rem] bg-white border transition-all duration-500 h-full cursor-pointer
                  ${index === currentStep ? 'border-[#1062FE] shadow-xl shadow-blue-900/5 scale-[1.02]' : 'border-slate-100 shadow-sm hover:border-blue-200 hover:shadow-md'}`}
                  onClick={() => setCurrentStep(index)}
                >
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg ${step.color} transform transition-transform duration-300 ${index === currentStep ? 'scale-110' : 'scale-100'}`}>
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{step.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Carousel Controls for Mobile */}
          <div className="flex md:hidden justify-center items-center gap-4 mt-8">
            <button onClick={prevStep} className="p-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-[#1062FE]">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex gap-2">
              {steps.map((_, idx) => (
                <div key={idx} className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentStep ? 'w-6 bg-[#1062FE]' : 'bg-slate-300'}`} />
              ))}
            </div>
            <button onClick={nextStep} className="p-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-[#1062FE]">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
