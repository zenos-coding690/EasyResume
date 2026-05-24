'use client';

import React, { useState } from 'react';
import { 
  Check, 
  Sparkles, 
  ChevronRight, 
  Zap, 
  Award, 
  ArrowRight,
  TrendingUp,
  X
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { useLanguage } from "@/context/LanguageContext";
import { useTokens } from "@/context/TokenContext";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

export default function SubscribePage() {
  const { t } = useLanguage();
  const { openModal } = useTokens();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [purchasingPlan, setPurchasingPlan] = useState<number | null>(null);

  const handleBuyPlan = async (packId: number, priceStr: string, features: { tokens: number, downloads: number }) => {
    setPurchasingPlan(packId);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        alert("Veuillez vous connecter pour acheter un forfait.");
        setPurchasingPlan(null);
        return;
      }

      const res = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packId: packId + 200, // Offset pour les forfaits complets
          amount: priceStr,
          tokens: features.tokens,
          downloadCredits: features.downloads,
          type: 'forfait',
          email: session.user.email
        })
      });

      const data = await res.json();
      
      if (res.ok && data.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        alert("Erreur: " + (data.error || 'Inconnue'));
        setPurchasingPlan(null);
      }
    } catch (err) {
      alert("Erreur de connexion.");
      setPurchasingPlan(null);
    }
  };

  const plans = [
    {
      id: 1,
      name: t('plan1Name'),
      price: t('plan1Price'),
      popular: false,
      icon: Zap,
      features: [
        { text: t('plan1FeatDownload'), available: true, tokens: 0, downloads: 1 },
        { text: t('plan1FeatAI'), available: false },
        { text: t('featPreviews'), available: true },
        { text: t('featSupport'), available: false },
        { text: t('featNoExpiry'), available: false }
      ],
      color: "from-blue-50/50 to-indigo-50/50",
      btnClass: "bg-white text-slate-800 border-slate-200 hover:bg-slate-950 hover:text-white"
    },
    {
      id: 2,
      name: t('plan2Name'),
      price: t('plan2Price'),
      popular: true,
      icon: Sparkles,
      features: [
        { text: t('plan2FeatDownload'), available: true, tokens: 0, downloads: 3 },
        { text: t('plan2FeatAI'), available: false },
        { text: t('featPreviews'), available: true },
        { text: t('featSupport'), available: false },
        { text: t('featNoExpiry'), available: false }
      ],
      color: "from-[#1062FE] to-indigo-700",
      btnClass: "bg-white text-[#1062FE] border-transparent hover:bg-slate-950 hover:text-white hover:shadow-lg"
    },
    {
      id: 3,
      name: t('plan3Name'),
      price: t('plan3Price'),
      popular: false,
      icon: Award,
      features: [
        { text: t('plan3FeatDownload'), available: true, tokens: 0, downloads: 10 },
        { text: t('plan3FeatAI'), available: false },
        { text: t('featPreviews'), available: true },
        { text: t('featSupport'), available: false },
        { text: t('featNoExpiry'), available: false }
      ],
      color: "from-blue-50/50 to-indigo-50/50",
      btnClass: "bg-white text-slate-800 border-slate-200 hover:bg-slate-950 hover:text-white"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12 select-none">
      
      {/* Cinematic Header Section */}
      <ScrollReveal delay={100} duration={600} direction="up">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-100 rounded-full px-4.5 py-1 text-xs font-bold text-[#1062FE] animate-pulse">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Offres Premium 2026</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight leading-tight">
            {t('pricingTitle')}
          </h1>
          <p className="text-slate-500 text-sm sm:text-base font-medium leading-relaxed max-w-2xl mx-auto">
            {t('pricingSubtitle')}
          </p>
        </div>
      </ScrollReveal>

      {/* Cinematic Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-4">
        {plans.map((plan, idx) => {
          const Icon = plan.icon;
          const isHovered = hoveredIndex === idx;
          const isSelected = selectedPlan === plan.id;

          return (
            <ScrollReveal 
              key={plan.id} 
              delay={200 + idx * 100} 
              duration={600} 
              direction="up"
              className="h-full"
            >
              <div
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => setSelectedPlan(plan.id)}
                className={cn(
                  "rounded-[1.5rem] p-8 h-full flex flex-col justify-between transition-all duration-500 ease-out cursor-pointer relative select-none border overflow-hidden",
                  plan.popular 
                    ? "bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white border-indigo-500/30 shadow-xl shadow-indigo-950/20 scale-[1.03]" 
                    : "bg-white text-slate-800 border-slate-100 shadow-sm hover:border-blue-200",
                  isHovered && !plan.popular && "scale-[1.02] shadow-md",
                  plan.popular && isHovered && "scale-[1.04] shadow-2xl shadow-indigo-950/30",
                  isSelected && "ring-2 ring-[#1062FE] ring-offset-2"
                )}
              >
                {plan.popular && (
                  <>
                    <div className="absolute top-0 right-0 transform translate-x-12 -translate-y-8 w-44 h-44 bg-blue-500/10 rounded-full blur-xl animate-pulse" />
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-blue-400/20 shadow-md z-20">
                      {t('popularBadge')}
                    </div>
                  </>
                )}

                {/* Card Top: Plan Name & Price */}
                <div className="space-y-6">
                  <div className={cn("flex items-center space-x-3.5 relative z-10", plan.popular && "pr-24")}>
                    <div className={cn(
                      "p-3 rounded-2xl border flex items-center justify-center transition-colors",
                      plan.popular 
                        ? "bg-white/10 text-blue-400 border-white/5" 
                        : "bg-blue-50 text-[#1062FE] border-blue-100"
                    )}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-[15px] tracking-tight">{plan.name}</h3>
                      <p className={cn("text-[10px] font-semibold uppercase tracking-wider mt-0.5", plan.popular ? "text-slate-400" : "text-slate-400")}>
                        Plan Individuel
                      </p>
                    </div>
                  </div>

                  <div className="flex items-baseline space-x-1 pb-6 border-b border-slate-100/50">
                    <span className="text-3xl font-extrabold tracking-tight">{plan.price}</span>
                    <span className={cn("text-[11px] font-bold tracking-wider uppercase", plan.popular ? "text-slate-400" : "text-slate-400")}>
                      / forfait
                    </span>
                  </div>

                  {/* Checklist features */}
                  <ul className="space-y-4 pt-2">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className={cn("flex items-center text-sm font-semibold tracking-tight", !feature.available && "opacity-60")}>
                        <div className={cn(
                          "w-5 h-5 rounded-full flex items-center justify-center mr-3.5 flex-shrink-0 border",
                          feature.available
                            ? (plan.popular ? "bg-white/10 border-white/5 text-blue-400" : "bg-blue-50 border-blue-100 text-[#1062FE]")
                            : (plan.popular ? "bg-red-500/20 border-red-500/10 text-red-400" : "bg-red-50 border-red-100 text-red-500")
                        )}>
                          {feature.available ? <Check className="w-3 h-3" strokeWidth={3} /> : <X className="w-3 h-3" strokeWidth={3} />}
                        </div>
                        <span className={cn(
                          plan.popular 
                            ? (feature.available ? "text-slate-200" : "text-slate-400") 
                            : (feature.available ? "text-slate-700" : "text-slate-500 line-through")
                        )}>{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Plan Action CTA Button */}
                <div className="pt-8">
                  <Button 
                    disabled={purchasingPlan !== null}
                    onClick={() => handleBuyPlan(plan.id, plan.price, { tokens: plan.features[0].tokens as number, downloads: plan.features[0].downloads as number })}
                    className={cn(
                    "w-full rounded-xl py-3.5 text-xs font-extrabold uppercase tracking-widest border transition-all duration-300 flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98]",
                    plan.btnClass
                  )}>
                    {purchasingPlan === plan.id ? (
                      <span>Patientez...</span>
                    ) : (
                      <>
                        <span>{t('choosePlanBtn')}</span>
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>

              </div>
            </ScrollReveal>
          );
        })}
      </div>

      {/* Cinematic Additional Prompts Box */}
      <ScrollReveal delay={500} duration={600} direction="up">
        <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border border-blue-100/40 rounded-[1.5rem] p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm hover:scale-[1.01] transition-transform duration-300">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-2xl bg-white border border-blue-100/60 text-[#1062FE] shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="text-center sm:text-left space-y-1">
              <h4 className="font-extrabold text-[15px] text-slate-800 tracking-tight">{t('needMorePrompts')}</h4>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Achat ponctuel • Jetons IA additionnels</p>
            </div>
          </div>
          <Button 
            onClick={openModal}
            className="bg-[#1062FE] hover:bg-blue-700 text-white rounded-xl px-6 py-3 text-xs font-bold tracking-wide transition-all shadow-md shadow-blue-500/10 flex items-center gap-1.5 hover:scale-[1.03]"
          >
            <span>{t('buyHereBtn')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </ScrollReveal>

    </div>
  );
}
