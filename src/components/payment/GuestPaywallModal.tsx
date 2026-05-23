import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Check, ShieldCheck, CreditCard, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface GuestPaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  documentType?: 'CV' | 'Lettre de motivation';
}

export function GuestPaywallModal({ isOpen, onClose, onSuccess, documentType = 'CV' }: GuestPaywallModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'orange' | 'mtn' | 'wave' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handlePayment = () => {
    if (!paymentMethod) return;
    
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="bg-slate-950 p-6 text-center relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            ✕
          </button>
          <div className="w-16 h-16 bg-[#1062FE] rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-blue-500/50">
            <Download className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Télécharger votre {documentType}</h2>
          <p className="text-slate-400 text-sm">
            Vous utilisez la création sans compte. Un paiement unique est requis pour l'export.
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <div>
              <span className="block text-sm text-slate-500 font-medium mb-1">Montant à payer</span>
              <span className="block text-2xl font-extrabold text-slate-900">1000 FCFA</span>
            </div>
            <ShieldCheck className="w-8 h-8 text-[#1062FE]" />
          </div>

          <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-slate-500" />
            Choisissez votre moyen de paiement
          </h3>

          <div className="grid grid-cols-3 gap-3 mb-8">
            <button
              onClick={() => setPaymentMethod('orange')}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 ${paymentMethod === 'orange' ? 'border-[#FF7900] bg-orange-50' : 'border-slate-100 hover:border-slate-200'}`}
            >
              <div className="w-10 h-10 bg-orange-100 rounded-full mb-2"></div>
              <span className="text-xs font-medium text-slate-700">Orange</span>
            </button>
            <button
              onClick={() => setPaymentMethod('mtn')}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 ${paymentMethod === 'mtn' ? 'border-[#FFCC00] bg-yellow-50' : 'border-slate-100 hover:border-slate-200'}`}
            >
              <div className="w-10 h-10 bg-yellow-100 rounded-full mb-2"></div>
              <span className="text-xs font-medium text-slate-700">MTN</span>
            </button>
            <button
              onClick={() => setPaymentMethod('wave')}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 ${paymentMethod === 'wave' ? 'border-[#14B2E6] bg-cyan-50' : 'border-slate-100 hover:border-slate-200'}`}
            >
              <div className="w-10 h-10 bg-cyan-100 rounded-full mb-2"></div>
              <span className="text-xs font-medium text-slate-700">Wave</span>
            </button>
          </div>

          <Button 
            onClick={handlePayment}
            disabled={!paymentMethod || isProcessing}
            className="w-full h-14 rounded-xl text-lg font-bold bg-[#1062FE] hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 transition-all"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Traitement en cours...
              </>
            ) : (
              <>Payer et Télécharger <Check className="w-5 h-5 ml-2" /></>
            )}
          </Button>
          
          <p className="text-center text-xs text-slate-400 mt-4">
            Paiement sécurisé. Aucun compte requis.
          </p>
        </div>
      </div>
    </div>
  );
}
