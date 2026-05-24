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
- [x] **Système d'Authentification (`AuthContext` + Supabase)** : Gestion de session sécurisée. Les espaces d'édition, le dashboard et les paiements sont inaccessibles sans compte.
- [x] **Base de Données (PostgreSQL)** : Persistance des profils, CVs, Lettres, Jetons, Transactions et Feedbacks utilisateurs.
- [x] **Traduction Temps Réel** : Bascule FR/EN via `LanguageContext` dans toute l'app.
- [x] **Barre Latérale (Sidebar)** : Menu fluide incluant un **Tracker de Jetons IA réactif**.
- [x] **Système de Jetons IA et Paiements** : `TokenContext` synchronisé avec la BD. Intégration de l'API de paiement **Notch Pay** pour l'achat de recharges IA et de forfaits (Orange Money, MTN, Visa).

### B. Pages Publiques (Guest)
- [x] **`/` (Landing Page)** : Vitrine magique et animée (Hero, "Comment ça marche", Services, FAQ). Redirection intelligente selon la session.
- [x] **`/login` (Connexion/Inscription)** : Authentification via Supabase Auth. Validation rigoureuse et création de profil automatique dans la base de données.

### C. Pages Utilisateur Connecté (App)
- [x] **`/dashboard`** : Tableau de bord principal.
- [x] **`/profile` (Mon Profil)** : Édition du profil avec sauvegarde en temps réel sur Supabase.
- [x] **`/settings` (Paramètres)** : Sécurité, historique de facturation et préférences.
- [x] **`/subscribe` (S'abonner)** : Grille de tarification. Achat de forfaits (Téléchargements uniquement) ou recharges de jetons IA via Notch Pay.
- [x] **`/templates` & `/cover-letter`** : Galeries de modèles dynamiques.
- [x] **`/editor` & `/cover-letter-editor`** : Éditeurs interactifs avec sauvegarde Supabase. **Prévisualisation mobile parfaite** grâce à un système de mise à l'échelle automatique (Scale) conservant le ratio A4.
- [x] **Widget de Feedback** : Bouton flottant (mobile/desktop) permettant aux utilisateurs d'envoyer des retours ou signaler des bugs (sauvegardé en BD).

### D. Panel Administrateur
- [x] **Espace `/admin`** : Protégé par RLS (Row Level Security) réservé au rôle 'admin'.
- [x] **Gestion des utilisateurs** : Vue sur les utilisateurs et les jetons restants.
- [x] **`/admin/messages`** : Interface de consultation et de gestion des feedbacks utilisateurs.

---

## 📂 5. Structure des Fichiers Clés
```text
/public
 └── /images/templates              # Images des CV et Lettres
/src
 ├── /app
 │    ├── /layout.tsx               # Enveloppé avec AuthProvider, Language, Token, etc.
 │    ├── /api/payments             # Webhooks et initialisation Notch Pay
 │    ├── /(auth)/login/page.tsx    # Page d'authentification
 │    ├── /(admin)/admin/           # Dashboard Administrateur (Protégé)
 │    └── /(app)
 │         ├── /layout.tsx          # Enveloppé avec ProtectedRoute, inclut le FeedbackWidget
 │         ├── /editor/page.tsx     # Workspace CV
 │         └── ... (dashboard, profile, settings, subscribe)
 ├── /components
 │    ├── /admin                    # Composants de l'interface administrateur
 │    ├── /editor                   # Formulaires et LivePreview (A4 scaling)
 │    └── /layout                   # Sidebar, FeedbackWidget
 ├── /context
 │    ├── /AuthContext.tsx          # Connecté à Supabase Auth
 │    ├── /TokenContext.tsx         # Gestionnaire paiements et soldes (Supabase)
 │    └── /LanguageContext.tsx      # Traductions
/supabase
 └── /migrations                    # Scripts SQL (Auth, RLS, Fonctions RPC)
```

---

## 🤖 6. Instructions pour les Futures IA (Next Steps)

### A. Reprise du contexte
1. Relire attentivement ce fichier avant chaque session.
2. Comprendre que **l'authentification et Supabase sont au cœur du système**. Les données ne sont plus simulées, elles viennent de la base de données.
3. Toujours vérifier les permissions RLS (Row Level Security) avant d'ajouter de nouvelles requêtes.
4. Conserver le même niveau de perfectionnement CSS Tailwind (effets de survol, transitions, `ScrollReveal`).

### B. Feuille de route (Roadmap)
Les prochaines étapes à développer sont :
1. **L'Éditeur de Conception Assistée (Polishing)** :
   - Perfectionner la génération de contenu par l'IA (Prompts) en consommant les jetons.
2. **Le Dashboard Utilisateur** :
   - Afficher les vraies statistiques depuis l'historique utilisateur Supabase (CV récents, documents créés).
3. **Amélioration du Panel Admin** :
   - Ajouter des statistiques de revenus (Notch Pay).
   - Possibilité de répondre directement aux messages de feedback par email.
