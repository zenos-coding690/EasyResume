"use client";

import React, { useState } from 'react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "Dois-je créer un compte pour faire mon CV ?",
    answer: "Non, pas du tout ! Vous pouvez créer votre CV de A à Z sans inscription. Vous ne paierez que 1000 FCFA à la fin, au moment de télécharger votre PDF prêt à l'emploi."
  },
  {
    question: "Comment puis-je payer ?",
    answer: "Nous acceptons les paiements mobiles locaux (Orange Money, MTN Mobile Money, Wave) pour un processus simple et rapide, sans carte bancaire."
  },
  {
    question: "Mes données sont-elles conservées si je ne m'inscris pas ?",
    answer: "Pour protéger votre vie privée, si vous utilisez la création sans compte, vos données sont conservées uniquement sur votre navigateur actuel. Si vous videz votre cache, elles seront perdues. Pour sauvegarder vos CV, nous vous conseillons de créer un compte gratuit."
  },
  {
    question: "Les modèles sont-ils compatibles avec les logiciels ATS des recruteurs ?",
    answer: "Absolument. Nos modèles, particulièrement les modèles classiques et canadiens, sont conçus avec une structure propre pour être parfaitement lisibles par les systèmes de suivi des candidatures (ATS)."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Questions fréquentes
            </h2>
            <p className="text-lg text-slate-600">
              Tout ce que vous devez savoir pour bien démarrer avec MyEasyResume.
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <ScrollReveal key={index} delay={index * 100}>
              <div 
                className={`border rounded-2xl overflow-hidden transition-all duration-300 ${openIndex === index ? 'border-blue-200 bg-white shadow-md' : 'border-slate-200 bg-white hover:border-blue-100'}`}
              >
                <button 
                  className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
                  onClick={() => toggleFAQ(index)}
                >
                  <span className={`font-semibold text-lg ${openIndex === index ? 'text-[#1062FE]' : 'text-slate-900'}`}>
                    {faq.question}
                  </span>
                  <ChevronDown 
                    className={`w-5 h-5 transition-transform duration-300 flex-shrink-0 ${openIndex === index ? 'transform rotate-180 text-[#1062FE]' : 'text-slate-400'}`} 
                  />
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <p className="px-6 pb-6 text-slate-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
