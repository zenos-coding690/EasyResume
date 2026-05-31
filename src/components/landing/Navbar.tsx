"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileText, Menu, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          <Link href={user ? "/templates" : "/"} className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-[#1062FE] flex items-center justify-center transition-transform group-hover:scale-105">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">
              MyEasy<span className="text-[#1062FE]">Resume</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/templates" className="text-sm font-medium text-slate-600 hover:text-[#1062FE] transition-colors">Modèles</Link>
            <Link href="/cover-letter" className="text-sm font-medium text-slate-600 hover:text-[#1062FE] transition-colors">Lettres</Link>
            <Link href="/subscribe" className="text-sm font-medium text-slate-600 hover:text-[#1062FE] transition-colors">Tarifs</Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {!user ? (
              <>
                <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-[#1062FE] transition-colors">
                  Connexion
                </Link>
                <Button 
                  onClick={() => router.push('/login')}
                  className="bg-[#1062FE] hover:bg-blue-700 text-white rounded-full px-6 font-semibold transition-transform hover:scale-105"
                >
                  S'inscrire
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => router.push('/templates')}
                className="bg-[#1062FE] hover:bg-blue-700 text-white rounded-full px-6 font-semibold transition-transform hover:scale-105"
              >
                Mon Espace
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-slate-600 hover:text-[#1062FE]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-slate-100 shadow-xl p-4 flex flex-col gap-4">
          <Link href="/templates" className="block p-3 rounded-lg text-slate-700 font-medium hover:bg-slate-50 hover:text-[#1062FE]">Modèles</Link>
          <Link href="/cover-letter" className="block p-3 rounded-lg text-slate-700 font-medium hover:bg-slate-50 hover:text-[#1062FE]">Lettres</Link>
          <Link href="/subscribe" className="block p-3 rounded-lg text-slate-700 font-medium hover:bg-slate-50 hover:text-[#1062FE]">Tarifs</Link>
          <div className="h-px bg-slate-100 my-2"></div>
          {!user ? (
            <>
              <Link href="/login" className="block w-full">
                <Button variant="outline" className="w-full justify-center">Se connecter</Button>
              </Link>
              <Link href="/login" className="block w-full">
                <Button className="w-full justify-center bg-[#1062FE] text-white">S'inscrire</Button>
              </Link>
            </>
          ) : (
            <Link href="/templates" className="block w-full">
              <Button className="w-full justify-center bg-[#1062FE] text-white">Mon Espace</Button>
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
