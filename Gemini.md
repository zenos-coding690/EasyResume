# 🧠 myeasyresume - Contexte et Directives IA (Gemini.md)

> **IMPORTANT POUR L'IA (Maintien de Contexte)** : Ce fichier est la source de vérité absolue (Source of Truth) de l'architecture, du design et de l'état actuel de l'application **myeasyresume**. Toute IA qui reprend ce projet **doit lire ce fichier en premier** avant d'apporter des modifications afin de garantir la cohérence absolue du code et de l'expérience utilisateur.

---

## 🎯 1. Description du Projet
**myeasyresume** est une plateforme SaaS ultra-premium permettant aux utilisateurs de créer, gérer et exporter des CV et des lettres de motivation de très haute qualité (standards internationaux et canadiens). La plateforme inclut un **Assistant IA interactif** qui consomme des "jetons IA" pour aider à la rédaction de contenu, et propose une expérience bilingue (Français/Anglais) en temps réel.

---

## 🛠️ 2. Technologies Utilisées
- **Framework Core** : Next.js 14+ (App Router)
- **Langage** : TypeScript, React
- **Styling** : Tailwind CSS (pur, sans librairies externes contraignantes, sauf utilitaires shadcn/ui isolés)
- **Typographie** : Plus Jakarta Sans (Google Fonts)
- **Icônes** : Lucide React
- **Animations** : CSS natif (Transitions, Hover, Active) + Composant sur-mesure `ScrollReveal` (IntersectionObserver).
- **Gestion d'État Globale** : Context API natif de React (`LanguageContext`, `TokenContext`).

---

## 💎 3. Règles et Décisions de Design (Design System)
L'application doit absolument conserver un aspect **SaaS Premium**. Aucune déviation de ces règles n'est autorisée.
- **Couleurs Principales** :
  - **Bleu Signature** : `#1062FE` (Boutons actifs, indicateurs d'étape, barres de progression).
  - **Fond Navigation** : `#E0EFFF` (Gris-bleu glacier).
  - **Gris (Slate)** : `slate-950` pour les contrastes forts, `slate-800` pour les textes, `slate-100` pour les bordures.
- **Géométrie** :
  - **Cartes** : Strictement `rounded-[1.5rem]` (ou `rounded-2xl`).
  - **Bordures** : Subtiles (`border border-slate-100`), jamais de bordures noires épaisses.
  - **Clipping** : Toujours utiliser `overflow-hidden` pour que les éléments enfants respectent l'arrondi du parent.
- **Micro-animations (Règle d'or)** :
  - **Survol (Hover)** : `transition-all duration-300`, élévation douce `hover:-translate-y-1` ou `hover:scale-[1.03]`, ombre portée bleue subtile.
  - **Clic (Active)** : Effet d'enfoncement physique `active:scale-[0.98]`.
- **Responsive** :
  - La version mobile utilise généralement des grilles à 2 colonnes (`grid-cols-2`) pour les galeries, avec des paddings et textes réduits (`sm:`) pour tout faire tenir élégamment sans casser.

---

## ✅ 4. Fonctionnalités Déjà Implémentées

### A. Core & Layout
- [x] **Traduction Temps Réel** : Bascule FR/EN via `LanguageContext` dans toute l'app.
- [x] **Barre Latérale (Sidebar)** : Menu fluide incluant un **Tracker de Jetons IA réactif** en bas.
- [x] **Système de Jetons IA** : `TokenContext` gère le solde. Possède une modale de recharge avec simulateurs de paiements locaux (Orange Money, MTN, Wave).

### B. Pages Utilisateur
- [x] **`/profile` (Mon Profil)** : Layout à 3 colonnes. Liste de profils, formulaire d'édition inline dynamique, encadré d'affiliation avec copie-presse-papier animée.
- [x] **`/settings` (Paramètres)** : 4 onglets interactifs. Inclut un **Indicateur de force de mot de passe dynamique** et une carte bancaire virtuelle (Subscription).
- [x] **`/subscribe` (S'abonner)** : Grille de tarification cinématique à 3 cartes. La carte recommandée (Silver) est stylisée en thème sombre (slate-950) avec une bordure lumineuse et des badges.
- [x] **`/templates` (Modèles de CV)** : Grille CSS responsives (4 colonnes sur PC, 2 sur mobile). Présente 12 CV professionnels et 3 CV Canadiens sous forme de fausses miniatures générées en CSS Art interactif, avec **système de chargement d'image dynamique** et fallback automatique.
- [x] **`/cover-letter` (Lettres de motivation)** : Grille CSS. Présente exactement 2 Lettres de motivation (1 Standard, 1 Canada) et 1 Lettre de demande d'emploi, avec **système de chargement d'image dynamique** et fallback automatique.

---

## 📂 5. Structure des Fichiers Clés
```text
/public
 └── /images
      └── /templates                # Reçoit les images réelles des CV (pro-1.png à pro-12.png, can-1.png à can-3.png) et Lettres (cl-1.png, cl-2.png, ja-1.png)
/src
 ├── /app
 │    ├── /layout.tsx               # Enveloppé avec LanguageProvider et TokenProvider
 │    ├── /(app)
 │    │    ├── /profile/page.tsx    # Workspace du Profil utilisateur
 │    │    ├── /settings/page.tsx   # Paramètres & Sécurité
 │    │    ├── /subscribe/page.tsx  # Tarification
 │    │    ├── /templates/page.tsx  # Galerie de CV
 │    │    └── /cover-letter/page.tsx # Galerie de Lettres
 ├── /components
 │    ├── /layout
 │    │    ├── /Sidebar.tsx         # Contient la navigation et le Tracker IA
 │    │    └── /Header.tsx          # Toggle Langue et Avatar
 │    ├── /ui
 │    │    └── /ScrollReveal.tsx    # Composant gérant les animations d'entrée en cascade
 ├── /context
 │    ├── /LanguageContext.tsx      # Dictionnaire Bilingue global
 │    └── /TokenContext.tsx         # Gestionnaire des jetons IA et Pop-up de recharge
```

---

## 🤖 6. Instructions pour les Futures IA (Next Steps)

### A. Reprise du contexte
1. Relire attentivement ce fichier avant chaque session.
2. Toujours vérifier les balises de traduction dans `LanguageContext` avant d'ajouter du texte statique.
3. Conserver le même niveau de perfectionnement CSS Tailwind (les miniatures CSS Art, les effets de survol, etc.). Ne jamais régresser vers un style basique.

### B. Feuille de route (Roadmap)
Les prochaines étapes à développer sont :
1. **L'Éditeur de Conception Assistée (Resume Builder / Editor)** :
   - Mettre en place un système de double volet : Formulaire à gauche, Aperçu de Rendu Dynamique à droite.
   - Les modèles de CV doivent être de purs composants React lisant un contexte de formulaire global.
2. **Le Dashboard (Tableau de Bord)** :
   - Remplir la page `/dashboard` avec des métriques réelles (jetons restants, CV récents, etc.).
3. **Le Backend / Base de Données** :
   - Connecter ces magnifiques interfaces à Supabase / PostgreSQL.
   - Migrer les états globaux React actuels vers la DB pour de la persistance réelle.
