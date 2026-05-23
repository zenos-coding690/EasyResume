"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FileText, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();
  const { login } = useAuth();
  
  // States for Signup
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validatePassword = (pass: string) => {
    // 10 chars, 1 uppercase, 1 lowercase, 1 number
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{10,}$/;
    return regex.test(pass);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!isLogin) {
      if (!firstName || !lastName || !email || !password) {
        setError('Veuillez remplir tous les champs.');
        return;
      }
      if (!validatePassword(password)) {
        setError('Le mot de passe doit contenir au moins 10 caractères, une majuscule, une minuscule et un chiffre.');
        return;
      }
    } else {
      if (!email || !password) {
        setError('Veuillez saisir votre email et votre mot de passe.');
        return;
      }
    }

    setIsLoading(true);

    setIsLoading(true);

    try {
      if (isLogin) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          setError(signInError.message === 'Invalid login credentials' ? 'Email ou mot de passe incorrect.' : signInError.message);
          setIsLoading(false);
          return;
        }
        
        router.push('/dashboard');
      } else {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              firstName,
              lastName,
            }
          }
        });

        if (signUpError) {
          setError(signUpError.message);
          setIsLoading(false);
          return;
        }
        
        // Since email confirmation is disabled, user is logged in automatically
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || "Une erreur inattendue s'est produite.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex w-1/2 bg-[#1062FE] flex-col justify-between p-12 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 bg-blue-900/50 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
              <FileText className="w-6 h-6 text-[#1062FE]" />
            </div>
            <span className="font-bold text-2xl text-white tracking-tight">
              MyEasyResume
            </span>
          </Link>
        </div>

        <div className="relative z-10 mb-20">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Votre carrière mérite <br /> le meilleur.
          </h1>
          <p className="text-blue-100 text-lg max-w-md">
            Rejoignez des milliers de professionnels qui utilisent nos modèles ultra-premium pour décrocher leurs entretiens.
          </p>
          
          <div className="mt-12 space-y-4">
            <div className="flex items-center gap-3 text-blue-50">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Modèles testés et approuvés ATS</span>
            </div>
            <div className="flex items-center gap-3 text-blue-50">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Création ultra-rapide</span>
            </div>
            <div className="flex items-center gap-3 text-blue-50">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Standards Canadiens & Internationaux</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <Link href="/" className="lg:hidden absolute top-6 left-6 flex items-center gap-2">
           <div className="w-8 h-8 rounded-lg bg-[#1062FE] flex items-center justify-center">
             <FileText className="w-4 h-4 text-white" />
           </div>
        </Link>

        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-[2rem] shadow-2xl shadow-blue-900/5 border border-slate-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              {isLogin ? 'Bon retour !' : 'Créer un compte'}
            </h2>
            <p className="text-slate-500">
              {isLogin ? 'Connectez-vous pour continuer vers votre espace.' : 'Commencez à créer votre CV parfait dès maintenant.'}
            </p>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl mb-8">
            <button 
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${isLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              onClick={() => { setIsLogin(true); setError(''); }}
            >
              Se connecter
            </button>
            <button 
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${!isLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              onClick={() => { setIsLogin(false); setError(''); }}
            >
              S'inscrire
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-start gap-3 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Prénom</label>
                  <input 
                    type="text" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1062FE]/20 focus:border-[#1062FE] outline-none transition-all"
                    placeholder="Jean"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Nom</label>
                  <input 
                    type="text" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1062FE]/20 focus:border-[#1062FE] outline-none transition-all"
                    placeholder="Dupont"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Adresse email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1062FE]/20 focus:border-[#1062FE] outline-none transition-all"
                placeholder="jean.dupont@exemple.com"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Mot de passe</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1062FE]/20 focus:border-[#1062FE] outline-none transition-all"
                placeholder="••••••••••"
              />
              {!isLogin && (
                <p className="text-xs text-slate-500 mt-2">
                  Min. 10 caractères, 1 majuscule, 1 minuscule, 1 chiffre.
                </p>
              )}
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <a href="#" className="text-sm font-medium text-[#1062FE] hover:underline">
                  Mot de passe oublié ?
                </a>
              </div>
            )}

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-12 rounded-xl bg-[#1062FE] hover:bg-blue-700 text-white font-bold text-base shadow-lg shadow-blue-500/25 transition-all mt-4"
            >
              {isLoading ? 'Patientez...' : (isLogin ? 'Se connecter' : 'Créer mon compte')}
              {!isLoading && <ArrowRight className="w-5 h-5 ml-2" />}
            </Button>
          </form>
          
        </div>
      </div>
    </div>
  );
}
