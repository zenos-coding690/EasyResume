"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FileText, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Optionally check if we are in a recovery session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setError("Lien invalide ou expiré. Veuillez refaire une demande de réinitialisation.");
      }
    });
  }, []);

  const validatePassword = (pass: string) => {
    // 10 chars, 1 uppercase, 1 lowercase, 1 number
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{10,}$/;
    return regex.test(pass);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validatePassword(password)) {
      setError('Le mot de passe doit contenir au moins 10 caractères, une majuscule, une minuscule et un chiffre.');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push('/templates');
        }, 3000);
      }
    } catch (err: any) {
      setError(err.message || "Une erreur inattendue s'est produite.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-[2rem] shadow-2xl shadow-blue-900/5 border border-slate-100">
        
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
            <FileText className="w-6 h-6 text-[#1062FE]" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Nouveau mot de passe
          </h2>
          <p className="text-slate-500 text-sm">
            Veuillez entrer votre nouveau mot de passe sécurisé.
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
              <h3 className="font-bold text-lg mb-1">Mot de passe modifié !</h3>
              <p className="text-sm">Redirection en cours vers votre espace...</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Nouveau mot de passe</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1062FE]/20 focus:border-[#1062FE] outline-none transition-all"
                placeholder="••••••••••"
              />
              <p className="text-xs text-slate-500 mt-2">
                Min. 10 caractères, 1 majuscule, 1 minuscule, 1 chiffre.
              </p>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-12 rounded-xl bg-[#1062FE] hover:bg-blue-700 text-white font-bold text-base shadow-lg shadow-blue-500/25 transition-all mt-6"
            >
              {isLoading ? 'Enregistrement...' : 'Enregistrer'}
              {!isLoading && <ArrowRight className="w-5 h-5 ml-2" />}
            </Button>
          </form>
        )}
        
      </div>
    </div>
  );
}
