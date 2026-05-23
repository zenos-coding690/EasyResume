import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { amount, tokens, downloadCredits, type, packId, email } = await req.json();

    const notchPayPublicKey = process.env.NOTCHPAY_PUBLIC_KEY;
    if (!notchPayPublicKey) {
      return NextResponse.json({ error: 'Clé publique Notch Pay manquante.' }, { status: 500 });
    }

    // Le format du montant (Notch Pay utilise un nombre)
    const amountNumber = parseInt(amount.replace(/[^0-9]/g, ''), 10);
    // Format de référence: pack_{packId}_{timestamp}_{tokens}_{downloadCredits}
    const reference = `pack_${packId}_${Date.now()}_${tokens || 0}_${downloadCredits || 0}`; 

    const desc = type === 'download' 
      ? `Achat Pack ${downloadCredits} Téléchargements - MyEasyResume`
      : `Achat Pack ${tokens} Jetons IA - MyEasyResume`;

    const payload = {
      email: email || 'user@myeasyresume.ca',
      amount: amountNumber,
      currency: 'XAF',
      reference: reference,
      description: desc,
    };

    const response = await fetch('https://api.notchpay.co/payments/initialize', {
      method: 'POST',
      headers: {
        'Authorization': notchPayPublicKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    
    if (data && data.authorization_url) {
      return NextResponse.json({ 
        authorization_url: data.authorization_url, 
        reference: data.transaction?.reference || reference 
      });
    } else {
      console.error('Erreur Notch Pay Init:', data);
      return NextResponse.json({ error: 'Échec de l\'initialisation', details: data }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Erreur Catch Init:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
