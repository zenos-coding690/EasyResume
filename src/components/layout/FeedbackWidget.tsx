'use client';

import React, { useState } from 'react';
import { MessageSquare, X, Send, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    setIsSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        alert("Vous devez être connecté pour envoyer un message.");
        return;
      }

      const { error } = await supabase
        .from('user_feedbacks')
        .insert([{ user_id: session.user.id, message: message.trim() }]);

      if (error) throw error;
      
      setIsSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setMessage('');
        setIsSuccess(false);
      }, 3000);
    } catch (error) {
      console.error(error);
      alert("Une erreur s'est produite lors de l'envoi du message.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-slate-900 text-white rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.15)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-30 group ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
        aria-label="Envoyer un message"
      >
        <MessageSquare className="w-6 h-6 group-hover:text-blue-400 transition-colors" />
      </button>

      {/* Feedback Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative animate-slideUp">
            
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-[#E0EFFF]/30">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-slate-800">Envoyer un message</h3>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5">
              {isSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-800 mb-2">Message envoyé !</h4>
                  <p className="text-sm text-slate-500">Merci pour votre retour. L'administrateur a bien reçu votre message.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <p className="text-sm text-slate-600 mb-4">
                    Une idée, un bug ou une remarque ? Laissez un message directement à l'administrateur de myeasyresume.
                  </p>
                  
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Écrivez votre message ici..."
                    className="w-full h-32 p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm text-slate-800 placeholder:text-slate-400 mb-4"
                    required
                    maxLength={1000}
                  />

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !message.trim()}
                      className="flex items-center px-4 py-2 text-sm font-medium text-white bg-[#1062FE] hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-lg transition-colors shadow-sm"
                    >
                      {isSubmitting ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Envoi...</>
                      ) : (
                        <><Send className="w-4 h-4 mr-2" /> Envoyer</>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
