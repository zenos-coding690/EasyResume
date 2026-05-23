import React from 'react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { FileText, FileSignature, Globe2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    title: "Création de CV",
    description: "Démarquez-vous avec un CV rédigé de manière professionnelle, optimisé pour les systèmes ATS, qui passe les filtres de sélection et atterrit entre les mains des recruteurs.",
    icon: <FileText className="w-6 h-6" />,
    link: "/editor",
    color: "text-[#1062FE]",
    bg: "bg-blue-50",
    theme: "light"
  },
  {
    title: "Lettres de Motivation",
    description: "Des lettres de motivation personnalisées qui incitent les recruteurs à dire « Oui ! » et qui complètent parfaitement votre CV.",
    icon: <FileSignature className="w-6 h-6" />,
    link: "/cover-letter",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    theme: "light"
  },
  {
    title: "Standards Canadiens",
    description: "Des modèles de CV et lettres spécialement conçus pour répondre aux normes et attentes du marché du travail canadien et international.",
    icon: <Globe2 className="w-6 h-6 text-white" />,
    link: "/templates",
    color: "text-white",
    bg: "bg-[#1062FE]",
    theme: "dark"
  }
];

export default function FeatureCards() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <ScrollReveal>
          <div className="mb-16">
            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium text-slate-600 bg-slate-100 mb-4">
              ✨ Nos Services
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Nos services principaux
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl">
              Tout ce dont vous avez besoin pour accélérer votre recherche d'emploi et décrocher plus d'entretiens.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <ScrollReveal key={index} delay={index * 150} className="h-full">
              <Link href={feature.link} className="block h-full group">
                <div className={`h-full rounded-[1.5rem] p-8 flex flex-col transition-all duration-300 ease-out 
                  ${feature.theme === 'dark' 
                    ? 'bg-[#1062FE] text-white hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-900/20 hover:-translate-y-1' 
                    : 'bg-white border border-slate-100 hover:border-blue-200 hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-1'}`}>
                  
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${feature.bg} ${feature.color}`}>
                    {feature.icon}
                  </div>
                  
                  <h3 className={`text-xl font-bold mb-4 ${feature.theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    {feature.title}
                  </h3>
                  
                  <p className={`flex-grow leading-relaxed mb-8 ${feature.theme === 'dark' ? 'text-blue-100' : 'text-slate-600'}`}>
                    {feature.description}
                  </p>
                  
                  <div className={`flex items-center font-medium mt-auto transition-transform duration-300 group-hover:translate-x-2 
                    ${feature.theme === 'dark' ? 'text-white' : 'text-[#1062FE]'}`}>
                    En savoir plus <ArrowRight className="ml-2 w-4 h-4" />
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
