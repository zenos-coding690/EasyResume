'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Check, 
  CreditCard, 
  Zap, 
  Award,
  Loader2
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useLanguage } from './LanguageContext';
import { supabase } from '@/lib/supabase';

interface TokenContextType {
  tokens: number;
  maxTokens: number;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  consumeToken: () => boolean;
  addTokens: (amount: number) => void;
  downloadCredits: number;
  consumeDownloadCredit: (docId: string, docType: 'resume' | 'cover_letter') => Promise<boolean>;
  isDownloadModalOpen: boolean;
  openDownloadModal: () => void;
  closeDownloadModal: () => void;
  handleBuyDownloadPack: (packId: number, credits: number, priceStr: string) => Promise<void>;
}

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export function TokenProvider({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage();
  const [tokens, setTokens] = useState<number>(20);
  const [maxTokens, setMaxTokens] = useState<number>(20);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState<boolean>(false);
  const [purchasingPack, setPurchasingPack] = useState<number | null>(null);
  const [successPack, setSuccessPack] = useState<number | null>(null);
  const [downloadCredits, setDownloadCredits] = useState<number>(0);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState<boolean>(false);

  // Sync token state with Supabase on load
  useEffect(() => {
    const fetchTokens = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { data, error } = await supabase
        .from('user_tokens')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (!error && data) {
        setTokens(data.balance);
        setDownloadCredits(data.download_credits || 0);
        if (data.balance > maxTokens) {
          setMaxTokens(data.balance);
        }
      } else if (error?.code === 'PGRST116') {
        // Si l'utilisateur a été créé avant l'ajout du trigger DB, on initialise sa ligne manuellement
        await supabase.from('user_tokens').insert({ id: session.user.id, balance: 20 });
        setTokens(20);
      }

      if (!localStorage.getItem('has_welcomed')) {
        localStorage.setItem('has_welcomed', '1');
        setIsWelcomeOpen(true);
      }
    };
    fetchTokens();
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    if (!purchasingPack) {
      setIsModalOpen(false);
    }
  };

  const consumeToken = () => {
    if (tokens >= 4) {
      const nextTokens = tokens - 4;
      setTokens(nextTokens);
      
      // Fire and forget secure RPC
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          supabase.rpc('consume_ai_token', { p_user_id: session.user.id }).then();
        }
      });
      
      return true;
    }
    openModal();
    return false;
  };

  const addTokens = async (amount: number) => {
    const nextTokens = tokens + amount;
    setTokens(nextTokens);
    
    // Auto-update maxTokens if tokens exceed it
    if (nextTokens > maxTokens) {
      setMaxTokens(nextTokens);
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await supabase.from('user_tokens')
        .update({ balance: nextTokens })
        .eq('id', session.user.id);
    }
  };

  // Real Notch Pay Flow
  const handleBuyPack = async (packId: number, amount: number, priceStr: string) => {
    setPurchasingPack(packId);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        alert("Veuillez vous connecter pour acheter des jetons.");
        setPurchasingPack(null);
        return;
      }

      const res = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packId,
          amount: priceStr,
          tokens: amount,
          email: session.user.email
        })
      });

      const data = await res.json();
      
      if (res.ok && data.authorization_url) {
        // Redirection vers l'interface sécurisée de Notch Pay
        window.location.href = data.authorization_url;
      } else {
        alert("Erreur lors de l'initialisation du paiement: " + (data.error || 'Inconnue'));
        setPurchasingPack(null);
      }
    } catch (err) {
      alert("Une erreur de connexion est survenue.");
      setPurchasingPack(null);
    }
  };

  const handleBuyDownloadPack = async (packId: number, credits: number, priceStr: string) => {
    setPurchasingPack(packId + 100); // Offset to distinguish packs visually
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        alert("Veuillez vous connecter pour acheter des téléchargements.");
        setPurchasingPack(null);
        return;
      }

      const res = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packId: packId + 100, // Offset for download packs
          amount: priceStr,
          tokens: 0,
          downloadCredits: credits,
          type: 'download',
          email: session.user.email
        })
      });

      const data = await res.json();
      
      if (res.ok && data.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        alert("Erreur: " + (data.error || 'Inconnue'));
        setPurchasingPack(null);
      }
    } catch (err) {
      alert("Erreur de connexion.");
      setPurchasingPack(null);
    }
  };

  const consumeDownloadCredit = async (docId: string, docType: 'resume' | 'cover_letter') => {
    if (downloadCredits > 0) {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return false;

      const { data, error } = await supabase.rpc('unlock_document', {
        p_user_id: session.user.id,
        p_doc_id: docId,
        p_doc_type: docType
      });

      if (!error && data === true) {
        setDownloadCredits(prev => prev - 1);
        return true;
      }
    }
    openDownloadModal();
    return false;
  };

  const openDownloadModal = () => setIsDownloadModalOpen(true);
  const closeDownloadModal = () => {
    if (!purchasingPack) setIsDownloadModalOpen(false);
  };

  const packs = [
    {
      id: 1,
      name: t('copiedSuccess') === 'Copié !' ? "Pack Bronze" : "Bronze Pack",
      tokens: 50,
      price: "500 XAF",
      desc: t('copiedSuccess') === 'Copié !' ? "Idéal pour tester l'assistant" : "Great for quick edits",
      icon: Zap,
      popular: false
    },
    {
      id: 2,
      name: t('copiedSuccess') === 'Copié !' ? "Pack Silver" : "Silver Pack",
      tokens: 120,
      price: "1 000 XAF",
      desc: t('copiedSuccess') === 'Copié !' ? "Recommandé pour rédiger un CV" : "Recommended for job seekers",
      icon: Sparkles,
      popular: true
    },
    {
      id: 3,
      name: t('copiedSuccess') === 'Copié !' ? "Pack Gold" : "Gold Pack",
      tokens: 300,
      price: "2 000 XAF",
      desc: t('copiedSuccess') === 'Copié !' ? "Idéal pour booster sa carrière" : "Unlimited power writing",
      icon: Award,
      popular: false
    }
  ];

  const downloadPacks = [
    {
      id: 1,
      name: "Pack Basique",
      credits: 1,
      price: "900 XAF",
      desc: "1 Téléchargement PDF",
      icon: Zap,
      popular: false
    },
    {
      id: 2,
      name: "Pack Standard",
      credits: 3,
      price: "2 500 XAF",
      desc: "3 Téléchargements PDF",
      icon: Sparkles,
      popular: true
    },
    {
      id: 3,
      name: "Pack Premium",
      credits: 10,
      price: "4 500 XAF",
      desc: "10 Téléchargements PDF",
      icon: Award,
      popular: false
    }
  ];

  return (
    <TokenContext.Provider value={{ tokens, maxTokens, isModalOpen, openModal, closeModal, consumeToken, addTokens, downloadCredits, consumeDownloadCredit, isDownloadModalOpen, openDownloadModal, closeDownloadModal, handleBuyDownloadPack }}>
      {children}

      {/* ============================================================== */}
      {/* WELCOME POPUP — FIRST VISIT ONLY                               */}
      {/* ============================================================== */}
      {isWelcomeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm select-none animate-fadeIn p-4">
          <div className="bg-white rounded-[1.5rem] border border-slate-100 p-6 sm:p-8 max-w-md w-full shadow-2xl relative animate-slideUp max-h-[90vh] overflow-y-auto overflow-x-hidden">
            {/* Background glow */}
            <div className="absolute -top-16 -right-16 w-56 h-56 bg-blue-500/8 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-indigo-500/6 rounded-full blur-2xl pointer-events-none" />

            {/* Emoji header */}
            <div className="flex flex-col items-center text-center mb-6 relative z-10">
              <div className="w-16 h-16 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
                <span className="text-3xl leading-none">🎉</span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-800 tracking-tight leading-snug">
                {t('copiedSuccess') === 'Copié !' ? 'Bienvenue sur myeasyresume !' : 'Welcome to myeasyresume!'}
              </h3>
              <p className="text-slate-500 text-sm font-medium mt-2">
                {t('copiedSuccess') === 'Copié !'
                  ? 'Votre compte est prêt. Voici vos avantages de démarrage :'
                  : 'Your account is ready. Here are your starter perks:'}
              </p>
            </div>

            {/* Feature list */}
            <div className="space-y-3 mb-7 relative z-10">
              {[
                t('copiedSuccess') === 'Copié !' ? '20 jetons IA offerts pour démarrer' : '20 free AI tokens to get started',
                t('copiedSuccess') === 'Copié !' ? 'Accès à tous les modèles premium' : 'Access to all premium templates',
                t('copiedSuccess') === 'Copié !' ? 'Prévisualisation illimitée' : 'Unlimited preview',
              ].map((feat) => (
                <div key={feat} className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-emerald-600" strokeWidth={3} />
                  </div>
                  <p className="text-sm font-semibold text-slate-700">{feat}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={() => setIsWelcomeOpen(false)}
              className="w-full bg-[#1062FE] hover:bg-blue-700 active:scale-[0.98] text-white rounded-xl py-3.5 font-bold text-sm transition-all duration-300 shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 relative z-10"
            >
              {t('copiedSuccess') === 'Copié !' ? 'Commencer maintenant' : 'Get started now'}
              <span className="text-base leading-none">→</span>
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* GLOBAL RECHARGE MODAL OVERLAY                                  */}
      {/* ============================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm select-none animate-fadeIn p-4">
          
          <div className="bg-white rounded-[1.5rem] border border-slate-100 p-4 sm:p-8 max-w-2xl w-full shadow-2xl relative animate-slideUp max-h-[95vh] overflow-y-auto overflow-x-hidden">
            
            {/* Background design elements */}
            <div className="absolute top-0 right-0 transform translate-x-20 -translate-y-12 w-64 h-64 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
            
            {/* Close Button */}
            <button 
              onClick={closeModal}
              disabled={purchasingPack !== null}
              className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 text-slate-400 hover:text-slate-700 transition-all active:scale-95 z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-start space-x-3 mb-5 pr-8">
              <div className="p-2 sm:p-3 bg-blue-50 border border-blue-100 rounded-xl sm:rounded-2xl text-[#1062FE]">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-800 tracking-tight leading-tight">
                  {t('copiedSuccess') === 'Copié !' ? "Recharger mes jetons IA" : "Refill AI Tokens"}
                </h3>
                <p className="text-slate-400 text-[10px] sm:text-xs font-semibold uppercase mt-0.5 tracking-wider">
                  {t('copiedSuccess') === 'Copié !' ? "Boostez vos rédactions assistées par l'IA" : "Boost your AI assistant writing power"}
                </p>
              </div>
            </div>

            {/* Packs Selection */}
            <div className="flex overflow-x-auto md:grid md:grid-cols-3 gap-3 sm:gap-4 mb-5 pb-2 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {packs.map((pack) => {
                const Icon = pack.icon;
                const isPurchasing = purchasingPack === pack.id;
                const isSuccess = successPack === pack.id;

                return (
                  <div
                    key={pack.id}
                    className={`rounded-2xl p-3.5 sm:p-4 border transition-all duration-300 relative flex flex-col justify-between flex-shrink-0 w-[80%] sm:w-[260px] md:w-auto snap-center ${
                      pack.popular 
                        ? 'border-[#1062FE] bg-blue-50/10 shadow-md scale-[1.02] md:scale-[1.01]' 
                        : 'border-slate-100 bg-white hover:border-slate-200'
                    }`}
                  >
                    {pack.popular && (
                      <span className="absolute top-2.5 right-2.5 bg-[#1062FE] text-white text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                        Popular
                      </span>
                    )}

                    <div className="space-y-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        pack.popular ? 'bg-[#1062FE] text-white' : 'bg-blue-50 text-[#1062FE]'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-800">{pack.name}</h4>
                        <p className="text-[10px] text-slate-400 font-medium leading-tight mt-1">{pack.desc}</p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-50 flex items-baseline justify-between">
                      <div>
                        <span className="text-xl font-extrabold text-slate-800">{pack.tokens}</span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider ml-1">jetons</span>
                      </div>
                      <span className="text-xs font-extrabold text-[#1062FE] bg-blue-50/50 px-2 py-1 rounded-lg">
                        {pack.price}
                      </span>
                    </div>

                    <Button
                      disabled={purchasingPack !== null}
                      onClick={() => handleBuyPack(pack.id, pack.tokens, pack.price)}
                      className={`w-full mt-4 rounded-xl py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        isSuccess 
                          ? 'bg-emerald-500 text-white' 
                          : pack.popular 
                            ? 'bg-[#1062FE] hover:bg-blue-700 text-white shadow-md shadow-blue-500/10' 
                            : 'bg-white hover:bg-slate-950 hover:text-white text-slate-700 border-slate-200'
                      }`}
                    >
                      {isPurchasing ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Paiement...</span>
                        </>
                      ) : isSuccess ? (
                        <>
                          <Check className="w-3.5 h-3.5" strokeWidth={3} />
                          <span>Crédité !</span>
                        </>
                      ) : (
                        <span>Acheter</span>
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>

            {/* Local Payment Gateways simulator */}
            <div className="bg-slate-50 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 border border-slate-100">
              <div className="flex items-center space-x-2 text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                <CreditCard className="w-4 h-4 text-slate-400" />
                <span>Modes de paiement sécurisés</span>
              </div>
              <div className="flex items-center space-x-3.5 opacity-70">
                {/* Simulated Orange Money, MTN MoMo, Wave logos */}
                <div className="text-[10px] font-extrabold text-orange-500 bg-white border border-slate-200/50 px-2 py-0.5 rounded shadow-sm">Orange Money</div>
                <div className="text-[10px] font-extrabold text-amber-500 bg-white border border-slate-200/50 px-2 py-0.5 rounded shadow-sm">MTN MoMo</div>
                <div className="text-[10px] font-extrabold text-blue-500 bg-white border border-slate-200/50 px-2 py-0.5 rounded shadow-sm">Wave</div>
                <div className="text-[10px] font-extrabold text-slate-600 bg-white border border-slate-200/50 px-2 py-0.5 rounded shadow-sm">Visa/MC</div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* DOWNLOAD MODAL OVERLAY                                         */}
      {/* ============================================================== */}
      {isDownloadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm select-none animate-fadeIn p-4">
          
          <div className="bg-white rounded-[1.5rem] border border-slate-100 p-4 sm:p-8 max-w-2xl w-full shadow-2xl relative animate-slideUp max-h-[95vh] overflow-y-auto overflow-x-hidden">
            
            <div className="absolute top-0 right-0 transform translate-x-20 -translate-y-12 w-64 h-64 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <button 
              onClick={closeDownloadModal}
              disabled={purchasingPack !== null}
              className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 text-slate-400 hover:text-slate-700 transition-all active:scale-95 z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start space-x-3 mb-5 pr-8">
              <div className="p-2 sm:p-3 bg-emerald-50 border border-emerald-100 rounded-xl sm:rounded-2xl text-emerald-500">
                <Check className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-800 tracking-tight leading-tight">
                  Acheter des Téléchargements
                </h3>
                <p className="text-slate-400 text-[10px] sm:text-xs font-semibold uppercase mt-0.5 tracking-wider">
                  Exportez votre CV sans filigrane (Délai de 15min)
                </p>
              </div>
            </div>

            <div className="flex overflow-x-auto md:grid md:grid-cols-3 gap-3 sm:gap-4 mb-5 pb-2 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {downloadPacks.map((pack) => {
                const Icon = pack.icon;
                const isPurchasing = purchasingPack === pack.id + 100;
                const isSuccess = successPack === pack.id + 100;

                return (
                  <div
                    key={pack.id}
                    className={`rounded-2xl p-3.5 sm:p-4 border transition-all duration-300 relative flex flex-col justify-between flex-shrink-0 w-[80%] sm:w-[260px] md:w-auto snap-center ${
                      pack.popular 
                        ? 'border-emerald-500 bg-emerald-50/10 shadow-md scale-[1.02] md:scale-[1.01]' 
                        : 'border-slate-100 bg-white hover:border-slate-200'
                    }`}
                  >
                    {pack.popular && (
                      <span className="absolute top-2.5 right-2.5 bg-emerald-500 text-white text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                        Popular
                      </span>
                    )}

                    <div className="space-y-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        pack.popular ? 'bg-emerald-500 text-white' : 'bg-emerald-50 text-emerald-500'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-800">{pack.name}</h4>
                        <p className="text-[10px] text-slate-400 font-medium leading-tight mt-1">{pack.desc}</p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-50 flex items-baseline justify-between">
                      <div>
                        <span className="text-xl font-extrabold text-slate-800">{pack.credits}</span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider ml-1">exports</span>
                      </div>
                      <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50/50 px-2 py-1 rounded-lg">
                        {pack.price}
                      </span>
                    </div>

                    <Button
                      disabled={purchasingPack !== null}
                      onClick={() => handleBuyDownloadPack(pack.id, pack.credits, pack.price)}
                      className={`w-full mt-4 rounded-xl py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        isSuccess 
                          ? 'bg-emerald-500 text-white' 
                          : pack.popular 
                            ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/10' 
                            : 'bg-white hover:bg-slate-950 hover:text-white text-slate-700 border-slate-200'
                      }`}
                    >
                      {isPurchasing ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Paiement...</span>
                        </>
                      ) : isSuccess ? (
                        <>
                          <Check className="w-3.5 h-3.5" strokeWidth={3} />
                          <span>Crédité !</span>
                        </>
                      ) : (
                        <span>Acheter</span>
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>

            <div className="bg-slate-50 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 border border-slate-100">
              <div className="flex items-center space-x-2 text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                <CreditCard className="w-4 h-4 text-slate-400" />
                <span>Paiements sécurisés (Notch Pay)</span>
              </div>
              <div className="flex items-center space-x-3.5 opacity-70">
                <div className="text-[10px] font-extrabold text-orange-500 bg-white border border-slate-200/50 px-2 py-0.5 rounded shadow-sm">Orange Money</div>
                <div className="text-[10px] font-extrabold text-amber-500 bg-white border border-slate-200/50 px-2 py-0.5 rounded shadow-sm">MTN MoMo</div>
                <div className="text-[10px] font-extrabold text-slate-600 bg-white border border-slate-200/50 px-2 py-0.5 rounded shadow-sm">Visa/MC</div>
              </div>
            </div>

          </div>
        </div>
      )}
    </TokenContext.Provider>
  );
}

export function useTokens() {
  const context = useContext(TokenContext);
  if (context === undefined) {
    throw new Error('useTokens must be used within a TokenProvider');
  }
  return context;
}
