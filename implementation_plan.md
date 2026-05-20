# Grosse mise à jour — Subscribe, Dashboard, Profile & Fonctionnalités

6 axes d'amélioration sur 3 pages + composants partagés.

---

## Axe 1 — Page Subscribe : Nouveaux prix

#### [MODIFY] [LanguageContext.tsx](file:///c:/Users/pc/Documents/EasyResume/src/context/LanguageContext.tsx)

Changer les prix des 3 forfaits (FR + EN) :

| Plan | Ancien prix | **Nouveau prix** |
|------|------------|------------------|
| Démarrage rapide | 600 XAF | **800 XAF** |
| Chasseur d'emploi | 1 400 XAF | **2 500 XAF** |
| Boosteur de carrière | 3 900 XAF | **4 500 XAF** |

---

## Axe 2 — Popup de bienvenue + 20 jetons offerts

#### [MODIFY] [TokenContext.tsx](file:///c:/Users/pc/Documents/EasyResume/src/context/TokenContext.tsx)

- Détecter si c'est la **première visite** (clé localStorage `has_welcomed`)
- Si première visite : **créditer automatiquement 20 jetons** + afficher un popup de félicitations
- Le popup montrera :
  - 🎉 « Félicitations, bienvenue sur myeasyresume ! »
  - ✅ « 20 jetons IA offerts pour démarrer »
  - ✅ « Accès à tous les modèles premium »
  - ✅ « Prévisualisation illimitée »
  - Bouton « Commencer maintenant → »

---

## Axe 3 — Page Profile : Refonte

#### [MODIFY] [profile/page.tsx](file:///c:/Users/pc/Documents/EasyResume/src/app/(app)/profile/page.tsx)

Changements :
1. **Supprimer les boutons "Dupliquer" et "Télécharger"** de la barre d'actions (garder seulement Modifier/Annuler/Enregistrer + un nouveau bouton **Supprimer**)
2. **Profils liés aux CV sauvegardés** : lire les CV depuis `localStorage('my_easy_resumes')` et les afficher en dessous de chaque profil (mini-cartes cliquables)
3. **Photo de profil modifiable** : quand on clique sur l'avatar, ouvrir un `<input type="file">` pour uploader une image (stockée en base64 dans le profil)
4. **Nom du propriétaire affiché à côté du profil** : remplacer "Informations Personnelles" par le vrai nom `Prénom NOM` à côté de l'avatar

---

## Axe 4 — Dashboard : Vraies données + Boutons fonctionnels

#### [MODIFY] [dashboard/page.tsx](file:///c:/Users/pc/Documents/EasyResume/src/app/(app)/dashboard/page.tsx)

1. **Lire les lettres de motivation** depuis `localStorage('my_easy_cover_letters')` (déjà fait pour les CV)
2. **Afficher les vrais compteurs** dans les ActionCards :
   - "Créer un CV" → nombre réel de CV sauvegardés
   - "Lettre de motivation" → nombre réel de lettres sauvegardées
   - "Téléchargements" → compteur réel
3. **"Ajouter un modèle"** → au clic, ouvrir un **mini-dropdown** avec 2 choix : "Modèle de CV" (→ `/templates`) ou "Lettre de motivation" (→ `/cover-letter`)

#### [MODIFY] [ResumeCard.tsx](file:///c:/Users/pc/Documents/EasyResume/src/components/cards/ResumeCard.tsx)

Rendre les boutons fonctionnels :
- **Télécharger** → ouvrir `window.print()` sur le CV (charger les données dans le ResumeContext puis naviguer vers l'éditeur en mode impression)
- **Modifier** → naviguer vers `/editor?resume=ID` pour ré-ouvrir le CV dans l'éditeur
- **Dupliquer** → dupliquer l'entrée dans localStorage + rafraîchir la liste
- **Supprimer** → supprimer du localStorage avec confirmation
- **Partager** → copier le lien dans le presse-papier (simulé)

Le composant recevra de nouvelles props : `id`, `type` (`'resume' | 'letter'`), et des callbacks `onDelete`, `onDuplicate`.

> [!IMPORTANT]
> Les couvertures/thumbnails des documents : actuellement le dashboard utilise des images Unsplash génériques. On passera aux données réelles :
> - Pour les CV : la photo de profil de l'utilisateur ou une miniature CSS art du template
> - Pour les lettres : un mini aperçu textuel stylisé avec le nom de l'entreprise et le poste

---

## Axe 5 — Téléchargement réel des CV et Lettres

Le système `window.print()` est déjà en place dans les éditeurs. Pour le dashboard :

1. Au clic "Télécharger" sur un CV → charger les données du CV dans `ResumeContext`, naviguer vers `/editor` et déclencher `window.print()` automatiquement
2. Au clic "Télécharger" sur une lettre → idem avec `/cover-letter-editor`

> [!WARNING]  
> Le mécanisme de téléchargement PDF repose sur `window.print()` du navigateur. Ce n'est pas un vrai export PDF programmatique. Pour l'instant c'est suffisant, mais ça pourrait être amélioré avec `html2pdf.js` ou `puppeteer` côté serveur à l'avenir.

---

## Axe 6 — Suppression des données

- Dashboard : bouton poubelle 🗑️ sur chaque carte → supprime du localStorage
- Profile : bouton "Supprimer le profil" en rouge (avec confirmation)

---

## Open Questions

> [!IMPORTANT]
> **Partage** : Quand l'utilisateur clique "Partager", voulez-vous simplement **copier un lien fictif** dans le presse-papier (pour l'instant), ou voulez-vous une fonctionnalité de partage plus élaborée (email, WhatsApp, etc.) ?

> [!IMPORTANT]
> **Confirmation de suppression** : Simple `confirm()` du navigateur ou un **popup premium** stylisé dans le design system ?

---

## Vérification

### Build
```bash
npm run build  # Doit passer Exit code: 0
```

### Tests Navigateur
- Vérifier les 3 prix mis à jour sur /subscribe
- Vérifier le popup de bienvenue (effacer localStorage et rafraîchir)
- Vérifier les boutons fonctionnels sur le dashboard
- Vérifier la photo de profil uploadable
- Vérifier le téléchargement PDF depuis le dashboard
