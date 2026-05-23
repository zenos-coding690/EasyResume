"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { Download, Users, FileText, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function HeroSection() {
  const { user } = useAuth();
  const router = useRouter();

  const handleCreateClick = () => {
    if (user) {
      router.push('/editor');
    } else {
      router.push('/login');
    }
  };
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#E0EFFF]/40 to-white pt-24 pb-16 sm:pt-32 sm:pb-24 lg:pb-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
          
          <div className="lg:col-span-6 text-center lg:text-left mb-16 lg:mb-0">
            <ScrollReveal>
              <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 ring-1 ring-inset ring-blue-100 mb-6">
                <span className="flex-shrink-0 w-2 h-2 rounded-full bg-[#1062FE] animate-pulse mr-2"></span>
                Plateforme n°1 de création de CV
              </div>
            </ScrollReveal>
            
            <ScrollReveal delay={100}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
                Décrochez le job de vos rêves avec un <span className="text-[#1062FE]">CV Parfait</span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <p className="mt-4 text-lg sm:text-xl text-slate-600 mb-8 max-w-2xl mx-auto lg:mx-0">
                Transformer l'histoire de votre carrière en un CV convaincant que les recruteurs ne pourront pas ignorer. Conçu pour les standards internationaux.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center pt-8">
                <Button 
                  onClick={handleCreateClick}
                  className="w-full sm:w-auto h-14 rounded-full bg-[#1062FE] hover:bg-blue-700 text-white font-bold text-base px-8 shadow-xl shadow-blue-500/30 transition-all hover:scale-105 active:scale-95 group"
                >
                  Créer un CV rapidement
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Link href="/templates">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-full h-14 px-8 text-lg font-semibold border-slate-200 text-slate-700 hover:bg-slate-50 transition-all duration-300 hover:scale-[1.03]">
                    Parcourir les modèles
                  </Button>
                </Link>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={400}>
              <div className="mt-10 flex items-center justify-center lg:justify-start gap-x-8 gap-y-4 flex-wrap border-t border-slate-100 pt-8">
                <div className="flex flex-col items-center lg:items-start">
                  <div className="flex items-center text-slate-900 font-bold text-2xl">
                    <Download className="w-5 h-5 text-[#1062FE] mr-2" />
                    10k+
                  </div>
                  <span className="text-sm text-slate-500 font-medium mt-1">CV Téléchargés</span>
                </div>
                <div className="hidden sm:block w-px h-8 bg-slate-200"></div>
                <div className="flex flex-col items-center lg:items-start">
                  <div className="flex items-center text-slate-900 font-bold text-2xl">
                    <FileText className="w-5 h-5 text-[#1062FE] mr-2" />
                    25+
                  </div>
                  <span className="text-sm text-slate-500 font-medium mt-1">Modèles Premium</span>
                </div>
                <div className="hidden sm:block w-px h-8 bg-slate-200"></div>
                <div className="flex flex-col items-center lg:items-start">
                  <div className="flex items-center text-slate-900 font-bold text-2xl">
                    <Users className="w-5 h-5 text-[#1062FE] mr-2" />
                    98%
                  </div>
                  <span className="text-sm text-slate-500 font-medium mt-1">Clients Satisfaits</span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          <div className="lg:col-span-6 relative mt-16 lg:mt-0">
            <ScrollReveal delay={300} className="relative z-10">
              <div className="relative w-full max-w-lg mx-auto aspect-[3/4] rounded-2xl bg-white shadow-2xl shadow-blue-900/10 border border-slate-100 overflow-hidden transform -rotate-2 hover:rotate-0 transition-transform duration-500 hover:scale-[1.02]">
                {/* Fallback image if actual template is not loaded */}
                <div className="absolute inset-0 bg-slate-50 flex flex-col p-6">
                  <div className="w-full h-8 bg-slate-200 rounded-md mb-4 animate-pulse"></div>
                  <div className="w-3/4 h-4 bg-slate-200 rounded-md mb-8 animate-pulse"></div>
                  <div className="flex gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-slate-200 animate-pulse"></div>
                    <div className="flex-1">
                      <div className="w-full h-3 bg-slate-200 rounded-sm mb-2 animate-pulse"></div>
                      <div className="w-5/6 h-3 bg-slate-200 rounded-sm mb-2 animate-pulse"></div>
                      <div className="w-4/6 h-3 bg-slate-200 rounded-sm animate-pulse"></div>
                    </div>
                  </div>
                  <div className="w-full h-3 bg-slate-200 rounded-sm mb-2 animate-pulse"></div>
                  <div className="w-full h-3 bg-slate-200 rounded-sm mb-2 animate-pulse"></div>
                  <div className="w-full h-3 bg-slate-200 rounded-sm mb-2 animate-pulse"></div>
                  <div className="w-3/4 h-3 bg-slate-200 rounded-sm animate-pulse"></div>
                </div>
                <Image 
                  src="/images/templates/pro-1.png" 
                  alt="CV Template Preview" 
                  fill
                  className="object-cover relative z-10"
                />
              </div>
            </ScrollReveal>
            
            <ScrollReveal delay={500} className="absolute -bottom-12 -left-12 z-20 hidden md:block">
              <div className="relative w-48 aspect-[3/4] rounded-xl bg-white shadow-xl shadow-blue-900/15 border border-slate-100 overflow-hidden transform rotate-6 hover:rotate-0 transition-transform duration-500">
                <Image 
                  src="/images/templates/can-1.jpg" 
                  alt="CV Template Canadian" 
                  fill
                  className="object-cover"
                />
              </div>
            </ScrollReveal>
            
            <ScrollReveal delay={600} className="absolute -top-8 -right-8 z-0 hidden md:block">
              <div className="relative w-40 aspect-[3/4] rounded-xl bg-white shadow-lg shadow-blue-900/5 border border-slate-100 overflow-hidden transform rotate-12 opacity-80 blur-[1px]">
                 <Image 
                  src="/images/templates/pro-2.png" 
                  alt="CV Template Pro" 
                  fill
                  className="object-cover"
                />
              </div>
            </ScrollReveal>
            
            {/* Décorations d'arrière-plan */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-[#1062FE]/20 to-transparent rounded-full blur-3xl -z-10 opacity-60"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
