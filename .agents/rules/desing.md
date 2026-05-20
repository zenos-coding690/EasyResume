---
trigger: always_on
---

# Règle de Design & Directives du Système de Design (myeasyresume)

Ce document établit les règles strictes d'ingénierie visuelle et de design pour toutes les futures pages et composants créés au sein de l'application **myeasyresume**. Tout nouveau code devra rigoureusement s'aligner sur ces standards pour préserver l'aspect ultra-premium, fluide et réactif de la plateforme.

---

## 1. Principes Fondamentaux de l'Interface
L'application repose sur un style **Modern SaaS Premium** (typographie aérée, géométries adoucies, micro-animations ultra-fluides, contrastes subtils). 

---

## 2. Typographie Premium
- **Police Unique** : Google Font **`Plus Jakarta Sans`** (chargée à l'échelle globale de l'application).
- **Règles d'intégration** :
  - Utiliser la classe Tailwind `font-sans` combinée avec `antialiased` sur le conteneur principal pour un lissage optimal des textes.
  - **Graisses standardisées** :
    - Textes secondaires / légendes : `font-medium` (500)
    - Titres de cartes et menus : `font-semibold` (600)
    - Grands titres de section et métriques : `font-bold` (700) ou `font-extrabold` (800)

---

## 3. Charte Graphique & Palette de Couleurs

### A. Les Couleurs Dominantes
- **Bleu Signature (Primary)** : `#1062FE` (Utilisé pour les boutons actifs, les indicateurs d'étapes validées, les textes actifs et les barres de progression).
- **Fond de Navigation (Sidebar)** : `#E0EFFF` (Un bleu glacier clair, frais et reposant).
- **Gradients de Contenu** : `bg-gradient-to-r from-blue-50 to-indigo-50/50` (Idéal pour les bannières d'accroche et les encadrés Premium).

### B. Palette de Gris Neutres (Skins)
- **slate-950** : Boutons d'action sombres, états de survol Premium.
- **slate-800 / slate-700** : Titres principaux et textes contrastés.
- **slate-500 / slate-600** : Descriptions secondaires et paragraphes.
- **slate-400** : Textes inactifs ou désactivés (ex: langue non active, boutons désactivés).
- **slate-100 / border-slate-100** : Bordures de cartes standards pour un effet invisible mais structurant.

---

## 4. Géométrie & Bordures (Layout Cards)
- **Angles de Cartes principaux** : Utiliser **`rounded-[1.5rem]`** (ou `rounded-2xl` sous Tailwind) pour toutes les cartes de tableau de bord (CV, progression, formulaires).
- **Bordures Subtiles** : Pas de bordures foncées. Toujours privilégier `border border-slate-100` ou `border-blue-100/60` pour un aspect aéré et premium.
- **Clipping des Enfants (Règle d'Or)** : 
  > [!IMPORTANT]
  > Pour éviter que les images ou arrière-plans ne dépassent des cartes arrondies (bug classique de WebKit/Chrome sur mobile), toujours spécifier les arrondis sur les enfants (ex: `rounded-t-[x]` sur le conteneur de l'image et `rounded-b-[x]` sur le pied de la carte) en plus du `overflow-hidden` du parent.

---

## 5. Micro-interactions & Animations Dynamiques (Hover/Active)
- **Survol de Cartes d'Action** :
  - **Transition** : `transition-all duration-300 ease-out`
  - **Hover (Survol)** : Légère élévation (`hover:scale-[1.03]`), renforcement de la bordure (`hover:border-blue-200`) et ombre douce (`hover:shadow-md`).
  - **Active (Clic)** : Effet tactile d'enfoncement (`active:scale-[0.98]`).
- **Bouton Premium (Inversion de couleur)** :
  - Fond blanc avec bordure subtile, texte noir.
  - Au survol : Transition instantanée vers fond noir (`bg-slate-950`), texte blanc (`text-white`) et décalage de la flèche indicatrice de 4px vers la droite (`group-hover:translate-x-1`).
- **Sélecteur de Langue (Switch)** :
  - Pille arrondie (`rounded-full`), avec slider blanc flottant se déplaçant horizontalement via `transition-transform duration-300 ease-out`.

---

## 6. Chargement et Défilement Tactile (Scroll & Entrance Anims)
- **Composant `ScrollReveal`** : 
  - Toujours encapsuler les grandes sections et les listes de cartes dans le composant `ScrollReveal`.
  - **Cascades Staggered** : Appliquer des délais incrémentaux (ex: `delay={100}`, `delay={200}`, etc.) pour que les cartes apparaissent les unes après les autres avec un effet cascade fluide.
- **Progress Ring (Compteur de progression)** :
  - À chaque chargement de composant de progression, le pourcentage doit compter en temps réel de 0 à la valeur cible sur une durée de 1 seconde avec un intervalle linéaire dynamique.

---

## 7. Responsivité et Grilles Mobile
- **Grille de CV/Modèles** :
  - Sur mobile, afficher **strictement 2 modèles par ligne** (`grid-cols-2`), en réduisant la taille des polices et le rembourrage interne pour éviter tout dépassement.
  - Sur tablette/ordinateur, passer à 3 ou 4 colonnes.
- **Texte en une seule ligne (No Wrap)** :
  - Les cartes de petite taille (ex: boutons d'action rapide) doivent forcer le texte à rester sur une seule ligne via `whitespace-nowrap` pour éviter l'effet "texte morcelé" amateur.
- **Barre latérale (Sidebar)** :
  - Masquée sur les appareils de taille inférieure à `lg` (`1024px`), et remplacée par un menu tiroir fluide (`Sheet` coulissant) déclenché par un menu hamburger accessible.
