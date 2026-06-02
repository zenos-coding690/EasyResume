"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { FileText, ArrowRight, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Veuillez saisir votre adresse email.');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || "Une erreur inattendue s'est produite.");
    } finally {
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
            Récupérez l'accès à <br /> votre carrière.
          </h1>
          <p className="text-blue-100 text-lg max-w-md">
            Ne perdez pas vos données. Réinitialisez votre mot de passe pour retrouver vos CV et lettres de motivation.
          </p>
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
          
          <Link href="/login" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" /> Retour à la connexion
          </Link>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Mot de passe oublié
            </h2>
            <p className="text-slate-500">
              Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-start gap-3 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {success ? (
            <div className="mb-6 p-6 bg-emerald-50 text-emerald-700 rounded-xl flex flex-col items-center text-center gap-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              <div>
                <h3 className="font-bold text-lg mb-1">Email envoyé !</h3>
                <p className="text-sm">Vérifiez votre boîte de réception pour trouver le lien de réinitialisation.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
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

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-12 rounded-xl bg-[#1062FE] hover:bg-blue-700 text-white font-bold text-base shadow-lg shadow-blue-500/25 transition-all mt-4"
              >
                {isLoading ? 'Envoi en cours...' : 'Envoyer le lien'}
                {!isLoading && <ArrowRight className="w-5 h-5 ml-2" />}
              </Button>
            </form>
          )}
          
        </div>
      </div>
    </div>
  );
}
