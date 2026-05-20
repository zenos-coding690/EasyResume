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

interface TokenContextType {
  tokens: number;
  maxTokens: number;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  consumeToken: () => boolean;
  addTokens: (amount: number) => void;
}

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export function TokenProvider({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage();
  const [tokens, setTokens] = useState<number>(45);
  const [maxTokens, setMaxTokens] = useState<number>(75);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState<boolean>(false);
  const [purchasingPack, setPurchasingPack] = useState<number | null>(null);
  const [successPack, setSuccessPack] = useState<number | null>(null);

  // Sync token state with local storage on load + first-visit welcome
  useEffect(() => {
    const savedTokens = localStorage.getItem('ai_tokens');
    if (savedTokens) {
      setTokens(parseInt(savedTokens, 10));
    }
    if (!localStorage.getItem('has_welcomed')) {
      const welcomeTokens = (savedTokens ? parseInt(savedTokens, 10) : 45) + 20;
      setTokens(welcomeTokens);
      localStorage.setItem('ai_tokens', welcomeTokens.toString());
      localStorage.setItem('has_welcomed', '1');
      setIsWelcomeOpen(true);
    }
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    if (!purchasingPack) {
      setIsModalOpen(false);
    }
  };

  const consumeToken = () => {
    if (tokens > 0) {
      const nextTokens = tokens - 1;
      setTokens(nextTokens);
      localStorage.setItem('ai_tokens', nextTokens.toString());
      return true;
    }
    openModal();
    return false;
  };

  const addTokens = (amount: number) => {
    const nextTokens = tokens + amount;
    setTokens(nextTokens);
    localStorage.setItem('ai_tokens', nextTokens.toString());
    
    // Auto-update maxTokens if tokens exceed it
    if (nextTokens > maxTokens) {
      setMaxTokens(nextTokens);
    }
  };

  // Simulated Payment purchase flow
  const handleBuyPack = (packId: number, amount: number, _price: string) => {
    console.log("Simulating payment of:", _price);
    setPurchasingPack(packId);
    
    // Simulate mobile money payment gateway delay
    setTimeout(() => {
      setPurchasingPack(null);
      setSuccessPack(packId);
      addTokens(amount);
      
      // Auto close after showing checkmark
      setTimeout(() => {
        setSuccessPack(null);
        setIsModalOpen(false);
      }, 1500);
    }, 2000);
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

  return (
    <TokenContext.Provider value={{ tokens, maxTokens, isModalOpen, openModal, closeModal, consumeToken, addTokens }}>
      {children}

      {/* ============================================================== */}
      {/* WELCOME POPUP — FIRST VISIT ONLY                               */}
      {/* ============================================================== */}
      {isWelcomeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm select-none animate-fadeIn">
          <div className="bg-white rounded-[1.5rem] border border-slate-100 p-8 max-w-md w-full mx-4 shadow-2xl relative overflow-hidden animate-slideUp">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm select-none animate-fadeIn">
          
          <div className="bg-white rounded-[1.5rem] border border-slate-100 p-6 sm:p-8 max-w-2xl w-full mx-4 shadow-2xl relative overflow-hidden animate-slideUp">
            
            {/* Background design elements */}
            <div className="absolute top-0 right-0 transform translate-x-20 -translate-y-12 w-64 h-64 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
            
            {/* Close Button */}
            <button 
              onClick={closeModal}
              disabled={purchasingPack !== null}
              className="absolute top-5 right-5 p-1.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 text-slate-400 hover:text-slate-700 transition-all active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-start space-x-4 mb-6">
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-2xl text-[#1062FE]">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-800 tracking-tight">
                  {t('copiedSuccess') === 'Copié !' ? "Recharger mes jetons IA" : "Refill AI Tokens"}
                </h3>
                <p className="text-slate-400 text-xs font-semibold uppercase mt-0.5 tracking-wider">
                  {t('copiedSuccess') === 'Copié !' ? "Boostez vos rédactions assistées par l'IA" : "Boost your AI assistant writing power"}
                </p>
              </div>
            </div>

            {/* Packs Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {packs.map((pack) => {
                const Icon = pack.icon;
                const isPurchasing = purchasingPack === pack.id;
                const isSuccess = successPack === pack.id;

                return (
                  <div
                    key={pack.id}
                    className={`rounded-2xl p-4 border transition-all duration-300 relative flex flex-col justify-between ${
                      pack.popular 
                        ? 'border-[#1062FE] bg-blue-50/10 shadow-md scale-[1.01]' 
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
            <div className="bg-slate-50 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-100">
              <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
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
