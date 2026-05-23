import React from 'react';
import Link from 'next/link';
import { FileText } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-50 pt-16 pb-8 border-t border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6 group">
              <div className="w-8 h-8 rounded-lg bg-[#1062FE] flex items-center justify-center transition-transform group-hover:scale-105">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-900 tracking-tight">
                MyEasy<span className="text-[#1062FE]">Resume</span>
              </span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              La plateforme de création de CV ultra-premium conçue pour vous aider à décrocher le job de vos rêves rapidement.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 hover:bg-[#1062FE] hover:text-white transition-colors font-bold text-xs">
                FB
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 hover:bg-[#1062FE] hover:text-white transition-colors font-bold text-xs">
                TW
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 hover:bg-[#1062FE] hover:text-white transition-colors font-bold text-xs">
                IG
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 hover:bg-[#1062FE] hover:text-white transition-colors font-bold text-xs">
                IN
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Produit</h4>
            <ul className="space-y-4">
              <li><Link href="/templates" className="text-slate-500 hover:text-[#1062FE] text-sm transition-colors">Modèles de CV</Link></li>
              <li><Link href="/cover-letter" className="text-slate-500 hover:text-[#1062FE] text-sm transition-colors">Lettres de motivation</Link></li>
              <li><Link href="/editor" className="text-slate-500 hover:text-[#1062FE] text-sm transition-colors">Créateur de CV</Link></li>
              <li><Link href="/subscribe" className="text-slate-500 hover:text-[#1062FE] text-sm transition-colors">Tarifs</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Ressources</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-slate-500 hover:text-[#1062FE] text-sm transition-colors">Blog & Conseils</a></li>
              <li><a href="#" className="text-slate-500 hover:text-[#1062FE] text-sm transition-colors">Guides d'entretien</a></li>
              <li><a href="#" className="text-slate-500 hover:text-[#1062FE] text-sm transition-colors">Exemples par métier</a></li>
              <li><a href="#" className="text-slate-500 hover:text-[#1062FE] text-sm transition-colors">Centre d'aide</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Légal</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-slate-500 hover:text-[#1062FE] text-sm transition-colors">Conditions d'utilisation</a></li>
              <li><a href="#" className="text-slate-500 hover:text-[#1062FE] text-sm transition-colors">Politique de confidentialité</a></li>
              <li><a href="#" className="text-slate-500 hover:text-[#1062FE] text-sm transition-colors">Mentions légales</a></li>
              <li><a href="#" className="text-slate-500 hover:text-[#1062FE] text-sm transition-colors">Contact</a></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} MyEasyResume. Tous droits réservés.
          </p>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            Fait avec <span className="text-red-500">♥</span> pour votre carrière
          </div>
        </div>
      </div>
    </footer>
  );
}
