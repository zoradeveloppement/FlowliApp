# Guide de Test - Refonte UX/UI Interface Web

## 🚀 Démarrage rapide

### 1. Lancer l'application en mode web

```bash
cd apps/mobile
npm run web
```

Ou si vous utilisez pnpm :

```bash
cd apps/mobile
pnpm web
```

L'application devrait s'ouvrir automatiquement dans votre navigateur à `http://localhost:8081` (ou un autre port si celui-ci est occupé).

---

## ✅ Checklist de test

### 1. Navigation latérale (Sidebar)

**À tester :**
- [ ] La sidebar s'affiche à gauche sur web
- [ ] Les 4 items de navigation sont présents :
  - [ ] **Projets** (icône 📁)
  - [ ] **Documents** (icône 📄)
  - [ ] **Facturation** (icône 💰)
  - [ ] **Profil** (icône 👤)
- [ ] L'item "Projets" est actif (fond lavande clair + bordure violette) quand vous êtes sur `/home`
- [ ] Le texte "Projets" est en violet (#7C3AED) quand actif
- [ ] Les autres items sont en gris quand non actifs
- [ ] Cliquer sur chaque item navigue vers la bonne page

**Comment tester :**
1. Connectez-vous à l'application
2. Vérifiez que vous êtes sur la page d'accueil (`/home`)
3. Observez la sidebar à gauche
4. Cliquez sur chaque item et vérifiez la navigation

---

### 2. Page d'accueil (Home) - Navigation vers détail projet

**À tester :**
- [ ] Les projets sont affichés dans la liste
- [ ] Sur **web** : cliquer sur un projet navigue vers `/projets/[id]`
- [ ] Sur **web** : l'icône à droite est un chevron vers la droite (→)
- [ ] Sur **mobile** : le comportement accordéon est conservé (icône chevron vers le bas)

**Comment tester :**
1. Sur la page d'accueil, identifiez un projet
2. Cliquez sur le projet
3. Vérifiez que vous êtes redirigé vers `/projets/[id]` avec l'ID du projet

---

### 3. Page de détail projet (`/projets/[id]`)

#### 3.1 En-tête supérieur (TopBar)

**À tester :**
- [ ] Le bouton "← Retour aux projets" est visible
- [ ] Le nom du projet s'affiche à côté du bouton retour
- [ ] Un badge d'état (violet clair) s'affiche avec le statut du projet :
  - [ ] "En cours" → badge violet
  - [ ] "Terminé" → badge vert
  - [ ] "En retard" → badge rouge
  - [ ] "À faire" → badge gris
- [ ] Cliquer sur "Retour aux projets" redirige vers `/home`

**Comment tester :**
1. Naviguez vers un projet depuis la page d'accueil
2. Vérifiez l'en-tête supérieur
3. Testez le bouton retour

---

#### 3.2 Section principale "Sprints & Tâches"

**À tester :**
- [ ] Le titre "Sprints & Tâches" est visible (grand, en gras)
- [ ] Le sous-titre "Suivez l'avancement de votre projet" est visible (gris)
- [ ] Les deux éléments sont bien espacés

---

#### 3.3 Filtres horizontaux

**À tester :**
- [ ] Le label "Statut" est visible
- [ ] Les boutons de filtre sont affichés horizontalement :
  - [ ] "Tous"
  - [ ] "En cours"
  - [ ] "Terminé"
  - [ ] "À faire"
  - [ ] "En retard"
- [ ] Le bouton actif a un fond lavande clair et une bordure violette
- [ ] Le texte du bouton actif est en violet
- [ ] Changer de filtre met à jour la liste des sprints affichés

**Comment tester :**
1. Cliquez sur chaque filtre
2. Vérifiez que la liste des sprints change selon le filtre sélectionné
3. Vérifiez le style visuel du bouton actif

---

#### 3.4 Blocs de sprint (SprintCard)

**À tester :**
- [ ] Chaque sprint est affiché dans une carte blanche avec bordure légère
- [ ] Le header du sprint contient :
  - [ ] Titre du sprint (ex: "Cartographie & Normes", "Développement")
  - [ ] Date (si disponible)
  - [ ] Badge de statut à droite (violet clair pour "En cours", vert pour "Terminé", etc.)
- [ ] La métadonnée affiche :
  - [ ] Compteur de tâches (ex: "3 tâches")
  - [ ] Barre de progression horizontale
  - [ ] Pourcentage de progression (ex: "100%")
- [ ] Les tâches sont listées à l'intérieur du sprint

**Comment tester :**
1. Identifiez un sprint dans la liste
2. Vérifiez tous les éléments visuels mentionnés
3. Vérifiez que la barre de progression correspond au pourcentage affiché

---

#### 3.5 Cartes de tâches (TaskCard)

**À tester :**
- [ ] Chaque tâche est dans une carte avec fond gris clair (#F9FAFB)
- [ ] Les tâches terminées ont une icône ✅ verte à gauche
- [ ] Le titre de la tâche est en gras et visible
- [ ] La description (si présente) est en gris sous le titre
- [ ] La ligne d'infos affiche (si disponibles) :
  - [ ] 👤 Assigné à (nom)
  - [ ] 📅 Date relative (ex: "dans 2 jours")
  - [ ] 🛡️ Priorité
  - [ ] 📄 Nombre de fichiers
  - [ ] ✉️ Nombre de commentaires
- [ ] Le tag de statut est à droite (badge coloré)
- [ ] Si la tâche a une progression, une barre de progression s'affiche en bas
- [ ] Cliquer sur une tâche ouvre le modal de détail

**Comment tester :**
1. Identifiez une tâche dans un sprint
2. Vérifiez tous les éléments visuels
3. Cliquez sur la tâche pour ouvrir le modal
4. Vérifiez que les dates en retard sont en rouge

---

### 4. Page Documents

**À tester :**
- [ ] La page Documents est accessible depuis la sidebar
- [ ] La page s'affiche (même si c'est un placeholder pour l'instant)

---

### 5. Responsive et comportement

**À tester :**
- [ ] Sur **web** : la sidebar est toujours visible à gauche
- [ ] Sur **web** : le contenu principal est à droite de la sidebar
- [ ] Sur **mobile** : la sidebar n'est pas visible (comportement normal)
- [ ] Les styles s'adaptent correctement à différentes tailles d'écran

---

## 🐛 Points à vérifier en cas de problème

### Si la navigation ne fonctionne pas :
1. Vérifiez que vous êtes bien connecté (session Supabase valide)
2. Vérifiez la console du navigateur pour les erreurs
3. Vérifiez que les routes sont bien définies dans `_layout.tsx`

### Si les projets ne s'affichent pas :
1. Vérifiez que l'API `/api/me/projects` fonctionne
2. Vérifiez la console pour les erreurs de fetch
3. Vérifiez que vous avez des projets dans Airtable liés à votre contact

### Si les tâches ne s'affichent pas dans le détail projet :
1. Vérifiez que l'API `/api/me/tasks?projectId=...` fonctionne
2. Vérifiez que les tâches ont bien un `projectId` dans Airtable
3. Vérifiez la console pour les erreurs

### Si les styles ne s'appliquent pas :
1. Vérifiez que NativeWind est bien configuré
2. Vérifiez que `global.css` est importé
3. Redémarrez le serveur de développement

---

## 📝 Notes de test

- **Navigateur recommandé** : Chrome ou Firefox (dernières versions)
- **Résolution de test** : 1920x1080 pour desktop, testez aussi en responsive
- **Données de test** : Assurez-vous d'avoir au moins :
  - 1 projet avec plusieurs tâches
  - Des tâches avec différents statuts (En cours, Terminé, À faire)
  - Des tâches avec dates d'échéance

---

## ✅ Validation finale

Une fois tous les tests passés, l'interface devrait :
- ✅ Avoir une navigation latérale claire avec "Projets" actif en violet
- ✅ Permettre de naviguer vers le détail d'un projet depuis la liste
- ✅ Afficher un en-tête contextuel avec retour, nom du projet et badge d'état
- ✅ Présenter les sprints et tâches de manière organisée
- ✅ Permettre de filtrer les tâches par statut
- ✅ Afficher toutes les informations des tâches de manière claire

---

## 🎨 Vérification du design

Assurez-vous que les couleurs respectent la charte Flowli :
- **Violet principal** : `#7C3AED`
- **Violet clair** : `#8B5CF6`
- **Fond lavande** : `rgba(124, 58, 237, 0.1)`
- **Bordures légères** : `#F3F4F6` ou `#E5E7EB`
- **Texte principal** : `#111827`
- **Texte secondaire** : `#6B7280`

