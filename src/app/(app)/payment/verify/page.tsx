'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { useTokens } from '@/context/TokenContext';
import { supabase } from '@/lib/supabase';

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addTokens } = useTokens();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Vérification de votre paiement...');

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams.get('reference') || searchParams.get('trxref');
      
      if (!reference) {
        setStatus('error');
        setMessage('Référence de paiement introuvable.');
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          setStatus('error');
          setMessage('Vous devez être connecté.');
          return;
        }

        const res = await fetch('/api/payments/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            reference, 
            userId: session.user.id 
          })
        });

        const data = await res.json();

        if (res.ok && data.success) {
          setStatus('success');
          setMessage('Paiement validé avec succès !');
          
          if (data.tokens) {
            // Mise à jour de l'état local des jetons
            addTokens(data.tokens);
          }

          // Redirection après succès
          setTimeout(() => {
            router.push('/dashboard');
          }, 2000);
        } else {
          setStatus('error');
          setMessage(data.error || 'Erreur lors de la validation du paiement.');
        }
      } catch (err: any) {
        setStatus('error');
        setMessage('Une erreur réseau est survenue.');
      }
    };

    verifyPayment();
  }, [searchParams, router, addTokens]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <div className="bg-white p-8 rounded-3xl shadow-xl shadow-blue-900/5 max-w-sm w-full text-center border border-slate-100 animate-slideUp">
        {status === 'loading' && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-50 text-[#1062FE] rounded-2xl flex items-center justify-center mb-6">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Un instant...</h2>
            <p className="text-sm text-slate-500 mt-2">{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mb-6">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Merci !</h2>
            <p className="text-sm text-slate-500 mt-2">{message}</p>
            <p className="text-xs text-slate-400 mt-4">Redirection vers votre tableau de bord...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6">
              <XCircle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Oups</h2>
            <p className="text-sm text-slate-500 mt-2">{message}</p>
            <button 
              onClick={() => router.push('/dashboard')}
              className="mt-6 w-full py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors"
            >
              Retourner au Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50">Chargement...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
