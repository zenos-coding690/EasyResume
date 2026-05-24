import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; // Important: we use the frontend client, but we must manually pass auth headers if needed, OR we just let the RPC use the user id passed from frontend? Wait, API Routes in App Router don't share cookies unless we use `@supabase/ssr`. Since we can't easily read cookies without the helpers, we will trust the frontend's session ID and the Notch Pay verification status.

export async function POST(req: Request) {
  try {
    const { reference, userId } = await req.json();

    const notchPayPrivateKey = process.env.NOTCHPAY_PRIVATE_KEY;
    if (!notchPayPrivateKey) {
      return NextResponse.json({ error: 'Clé privée Notch Pay manquante.' }, { status: 500 });
    }

    if (!reference || !userId) {
      return NextResponse.json({ error: 'Référence ou UserId manquant.' }, { status: 400 });
    }

    // 1. Vérifier le statut du paiement auprès de Notch Pay
    const response = await fetch(`https://api.notchpay.co/payments/${reference}`, {
      method: 'GET',
      headers: {
        'Authorization': notchPayPrivateKey,
        'Accept': 'application/json',
      }
    });

    const data = await response.json();
    
    if (data && data.transaction && data.transaction.status === 'complete') {
      
      // On extrait les informations depuis la référence : pack_id_timestamp_tokens_downloadCredits
      const parts = reference.split('_');
      const tokensToAdd = parseInt(parts[3], 10) || 0; 
      const downloadsToAdd = parts.length > 4 ? parseInt(parts[4], 10) : 0;
      const amountPaid = data.transaction.amount;

      if (downloadsToAdd > 0 && tokensToAdd > 0) {
        // Forfait complet (créditer les téléchargements ET les jetons)
        const { data: dData, error: dError } = await supabase.rpc('credit_downloads', {
          p_user_id: userId, p_credits: downloadsToAdd, p_tx_ref: reference + '_dl', p_amount: amountPaid
        });
        const { data: tData, error: tError } = await supabase.rpc('credit_tokens', {
          p_user_id: userId, p_tokens: tokensToAdd, p_tx_ref: reference + '_tk', p_amount: 0
        });

        if (dError || tError) return NextResponse.json({ error: 'Erreur d\'attribution du forfait.' }, { status: 500 });
        if (dData === false || tData === false) return NextResponse.json({ success: true, message: 'Déjà traité' });

        return NextResponse.json({ success: true, tokens: tokensToAdd, downloadCredits: downloadsToAdd });
      } else if (downloadsToAdd > 0) {
        // Créditer uniquement les téléchargements
        const { data: rpcData, error: rpcError } = await supabase.rpc('credit_downloads', {
          p_user_id: userId,
          p_credits: downloadsToAdd,
          p_tx_ref: reference,
          p_amount: amountPaid
        });

        if (rpcError) return NextResponse.json({ error: 'Erreur d\'attribution des crédits.' }, { status: 500 });
        if (rpcData === false) return NextResponse.json({ success: true, message: 'Déjà traité' });

        return NextResponse.json({ success: true, downloadCredits: downloadsToAdd });
      } else {
        // Créditer uniquement les jetons IA
        const { data: rpcData, error: rpcError } = await supabase.rpc('credit_tokens', {
          p_user_id: userId,
          p_tokens: tokensToAdd,
          p_tx_ref: reference,
          p_amount: amountPaid
        });

        if (rpcError) return NextResponse.json({ error: 'Erreur d\'attribution des jetons.' }, { status: 500 });
        if (rpcData === false) return NextResponse.json({ success: true, message: 'Déjà traité' });

        return NextResponse.json({ success: true, tokens: tokensToAdd });
      }
    } else {
      return NextResponse.json({ error: 'Paiement non complété ou invalide.', status: data.transaction?.status }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Erreur Verify Catch:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
