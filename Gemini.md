# 🧠 myeasyresume - Contexte et Directives IA (Gemini.md)

> **IMPORTANT POUR L'IA (Maintien de Contexte)** : Ce fichier est la source de vérité absolue (Source of Truth) de l'architecture, du design et de l'état actuel de l'application **myeasyresume**. Toute IA qui reprend ce projet **doit lire ce fichier en premier** avant d'apporter des modifications afin de garantir la cohérence absolue du code et de l'expérience utilisateur.

---

## 🎯 1. Description du Projet
**myeasyresume** est une plateforme SaaS ultra-premium permettant aux utilisateurs de créer, gérer et exporter des CV et des lettres de motivation de très haute qualité (standards internationaux et canadiens). La plateforme inclut un **Assistant IA interactif** qui consomme des "jetons IA" pour aider à la rédaction de contenu, et propose une expérience bilingue (Français/Anglais) en temps réel. **L'accès à l'édition est strictement réservé aux utilisateurs inscrits.**

---

## 🛠️ 2. Technologies Utilisées
- **Framework Core** : Next.js 14+ (App Router)
- **Langage** : TypeScript, React
- **Styling** : Tailwind CSS (pur, sans librairies externes contraignantes, sauf utilitaires shadcn/ui isolés)
- **Typographie** : Plus Jakarta Sans (Google Fonts)
- **Icônes** : Lucide React
- **Animations** : CSS natif (Transitions, Hover, Active) + Composant sur-mesure `ScrollReveal` (IntersectionObserver).
- **Gestion d'État Globale** : Context API natif de React (`LanguageContext`, `TokenContext`, `AuthContext`, `ResumeContext`, `CoverLetterContext`).

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

### A. Core, Sécurité & Layout
- [x] **Système d'Authentification (`AuthContext`)** : Gestion de session simulée avec redirection sécurisée (`ProtectedRoute`). Les espaces d'édition et le dashboard sont inaccessibles sans compte.
- [x] **Traduction Temps Réel** : Bascule FR/EN via `LanguageContext` dans toute l'app.
- [x] **Barre Latérale (Sidebar)** : Menu fluide incluant un **Tracker de Jetons IA réactif** en bas.
- [x] **Système de Jetons IA** : `TokenContext` gère le solde. Possède une modale de recharge avec simulateurs de paiements locaux (Orange Money, MTN, Wave).

### B. Pages Publiques (Guest)
- [x] **`/` (Landing Page)** : Vitrine magique et animée avec Sections Hero, "Comment ça marche", Services (Cartes interactives), FAQ, et Newsletter. Les Call-to-action s'adaptent intelligemment (Redirection vers `Login` ou `Dashboard`).
- [x] **`/login` (Connexion/Inscription)** : Page de split-screen luxueuse. Validation rigoureuse du mot de passe (10 car. min, 1 maj, 1 min, 1 chiffre) et gestion de création de compte.

### C. Pages Utilisateur Connecté (App)
- [x] **`/dashboard`** : Tableau de bord principal (en attente de statistiques réelles).
- [x] **`/profile` (Mon Profil)** : Layout à 3 colonnes. Formulaire d'édition inline dynamique, encadré d'affiliation avec copie-presse-papier animée.
- [x] **`/settings` (Paramètres)** : 4 onglets interactifs. Inclut un **Indicateur de force de mot de passe dynamique** et une carte bancaire virtuelle (Subscription).
- [x] **`/subscribe` (S'abonner)** : Grille de tarification cinématique à 3 cartes.
- [x] **`/templates` (Modèles de CV)** : Galerie présentant 12 CV professionnels et 3 CV Canadiens (système de miniature dynamique).
- [x] **`/cover-letter` (Lettres de motivation)** : Galerie de Lettres (1 Standard, 1 Canada, 1 Demande d'emploi).
- [x] **`/editor` (Éditeur de CV)** : Interface à double volet (Formulaire interactif / Rendu en direct dynamique).
- [x] **`/cover-letter-editor` (Éditeur de Lettres)** : Interface à double volet (Formulaire / Rendu en direct).

---

## 📂 5. Structure des Fichiers Clés
```text
/public
 └── /images/templates              # Images réelles des CV et Lettres
/src
 ├── /app
 │    ├── /layout.tsx               # Enveloppé avec AuthProvider, Language, Token, Resume, CoverLetter
 │    ├── /page.tsx                 # Landing Page magique
 │    ├── /(auth)
 │    │    └── /login/page.tsx      # Page d'authentification (split-screen)
 │    └── /(app)
 │         ├── /layout.tsx          # Enveloppé avec ProtectedRoute, Header et Sidebar
 │         ├── /editor/page.tsx     # Workspace CV
 │         ├── /cover-letter-editor/page.tsx
 │         └── ... (dashboard, profile, settings, templates)
 ├── /components
 │    ├── /landing                  # Navbar, HeroSection, HowItWorks, FeatureCards, FAQ, Footer...
 │    ├── /auth                     # ProtectedRoute
 │    ├── /layout                   # Sidebar, Header dynamique avec profil utilisateur
 │    └── /ui                       # Composants réutilisables (ScrollReveal, etc.)
 ├── /context
 │    ├── /AuthContext.tsx          # Gestionnaire de session et profil
 │    ├── /LanguageContext.tsx      # Dictionnaire Bilingue global
 │    ├── /TokenContext.tsx         # Gestionnaire des jetons IA
 │    ├── /ResumeContext.tsx        # État global du CV en cours
 │    └── /CoverLetterContext.tsx   # État global de la lettre en cours
```

---

## 🤖 6. Instructions pour les Futures IA (Next Steps)

### A. Reprise du contexte
1. Relire attentivement ce fichier avant chaque session.
2. Comprendre que **l'authentification est requise** pour toute création de document (`ProtectedRoute`).
3. Conserver le même niveau de perfectionnement CSS Tailwind (effets de survol, transitions, `ScrollReveal`). Ne jamais régresser vers un style basique.

### B. Feuille de route (Roadmap)
Les prochaines étapes à développer sont :
1. **L'Éditeur de Conception Assistée (Polishing)** :
   - Terminer la liaison entre les formulaires des éditeurs et le rendu dynamique en temps réel si des ajustements sont nécessaires.
2. **Le Dashboard (Tableau de Bord)** :
   - Remplir la page `/dashboard` avec des métriques réelles depuis l'historique utilisateur (jetons restants, CV récents, taux de complétion).
3. **Le Backend / Base de Données** :
   - Connecter ces interfaces à Supabase / PostgreSQL.
   - Remplacer la logique simulée de `AuthContext.tsx` par l'authentification Supabase.
   - Migrer les états globaux React (`ResumeContext`, etc.) vers la base de données pour une sauvegarde persistante dans le cloud.
