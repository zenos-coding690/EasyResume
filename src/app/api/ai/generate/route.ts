import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '@/lib/supabase';



export async function POST(req: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Clé API Gemini non configurée.' }, { status: 500 });
    }

    const { prompt_type, context, userId } = await req.json();

    if (!prompt_type) {
      return NextResponse.json({ error: 'Paramètres manquants.' }, { status: 400 });
    }

    // Sécurisation critique : Vérifier que l'utilisateur est bien connecté via son token JWT
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Non autorisé. Jeton manquant.' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Non autorisé. Session invalide.' }, { status: 401 });
    }

    // Ensure API key is available
    const apiKey = process.env.GEMINI_API_KEY;
    
    let prompt = '';

    // Définir le prompt en fonction du type de requête
    switch (prompt_type) {
      case 'summary':
        prompt = `Rédige un profil professionnel très percutant pour un CV de ${context.jobTitle}. 
        Ne mets pas de titre, écris directement le paragraphe. Il doit être écrit à la première personne et mettre en avant dynamisme et compétences.
        IMPORTANT : Le résumé doit être concis et faire un MAXIMUM STRICT de 65 mots.`;
        break;

      case 'experience':
        prompt = `Rédige 3 à 4 puces (bullet points) percutantes décrivant les tâches et réalisations pour le poste de ${context.jobTitle} chez ${context.company}. 
        Ne retourne QUE les bullet points (sans tirets au début, chaque point séparé par un saut de ligne).`;
        break;

      case 'skills':
        prompt = `Liste 8 à 10 compétences clés (techniques et interpersonnelles) séparées par des virgules pour le métier de ${context.jobTitle}. 
        Ne mets aucun autre texte, juste les compétences séparées par des virgules.`;
        break;

      case 'hobbies':
        prompt = `Suggère 4 centres d'intérêt ou loisirs qui valoriseraient un CV pour le métier de ${context.jobTitle}. 
        Réponds uniquement sous forme de liste à puces (bullet points), sans titre ni introduction.`;
        break;
        
      default:
        return NextResponse.json({ error: 'Type de prompt non supporté.' }, { status: 400 });
    }

    // Call Gemini via REST API to avoid Next.js Undici fetch issues with the SDK
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Gemini API Error:", errorData);
      throw new Error(`API Error: ${response.status}`);
    }

    const result = await response.json();
    const responseText = result.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return NextResponse.json({ text: responseText.trim() });

  } catch (error: any) {
    console.error('Erreur API Gemini:', error);
    if (error.cause) console.error('Cause:', error.cause);
    return NextResponse.json({ error: 'Erreur lors de la génération avec l\'IA.' }, { status: 500 });
  }
}
