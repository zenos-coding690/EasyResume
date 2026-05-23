"use client";

import React from 'react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

export default function Newsletter() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-blue-50 rounded-full blur-3xl opacity-60"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-emerald-50 rounded-full blur-3xl opacity-60"></div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal>
          <div className="bg-slate-950 rounded-[2rem] p-8 md:p-12 text-center shadow-2xl relative overflow-hidden">
            
            <div className="absolute inset-0 bg-gradient-to-br from-[#1062FE]/20 to-transparent opacity-50"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm border border-white/10">
                <Mail className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Boostez votre carrière
              </h2>
              
              <p className="text-slate-300 text-lg mb-8 max-w-2xl">
                Recevez chaque semaine nos meilleurs conseils pour réussir vos entretiens, optimiser votre profil LinkedIn et décrocher de nouvelles opportunités.
              </p>
              
              <form className="w-full max-w-md flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Votre adresse email" 
                  className="flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1062FE] focus:border-transparent transition-all"
                  required
                />
                <Button type="submit" className="bg-[#1062FE] hover:bg-blue-600 text-white rounded-xl px-6 py-3 font-semibold h-auto">
                  S'inscrire
                </Button>
              </form>
              <p className="text-xs text-slate-500 mt-4">
                Pas de spam, désinscription en un clic.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
