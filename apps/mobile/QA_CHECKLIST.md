# ✅ Checklist QA - FlowliApp

## 🎨 Design System

### Composants de base
- [ ] **Button** : Tous les variants (primary, secondary, ghost, disabled)
- [ ] **Input** : Label, placeholder, erreur, helper text
- [ ] **Card** : Padding, ombre, bordure
- [ ] **Badge** : Tous les statuts avec icônes
- [ ] **Progress** : Barre avec dégradé, pourcentage
- [ ] **Snackbar** : Types (success, error, info), auto-hide
- [ ] **Skeleton** : Animation de chargement
- [ ] **EmptyState** : États vides avec illustrations
- [ ] **ErrorState** : États d'erreur avec retry
- [ ] **LoadingState** : États de chargement

### Layouts
- [ ] **Screen** : Padding responsive (16px mobile, 24px web)
- [ ] **AppLayout** : Navigation adaptée (tabs mobile, sidebar web)
- [ ] **TopBar** : Logo, profil, logout (web uniquement)
- [ ] **Sidebar** : Navigation, badges, logout (web uniquement)
- [ ] **BottomTabs** : 4 onglets, badges de notification (mobile uniquement)

## 📱 Responsivité

### Breakpoints
- [ ] **Mobile** (< 768px) : Layout vertical, bottom tabs
- [ ] **Tablet** (768px - 1024px) : Layout hybride
- [ ] **Desktop** (> 1024px) : Layout horizontal, sidebar

### Navigation
- [ ] **Mobile** : Bottom tabs visibles
- [ ] **Web** : Sidebar visible, bottom tabs masqués
- [ ] **Transitions** : Animations fluides entre breakpoints

## ♿ Accessibilité

### Contraste
- [ ] **Texte principal** : Contraste AA (4.5:1) sur fond blanc
- [ ] **Texte secondaire** : Contraste AA sur fond gris
- [ ] **Boutons** : Contraste AA sur fond coloré
- [ ] **Liens** : Contraste AA, soulignement au focus

### Navigation clavier
- [ ] **Tab** : Navigation séquentielle
- [ ] **Enter/Space** : Activation des boutons
- [ ] **Escape** : Fermeture des modales
- [ ] **Flèches** : Navigation dans les listes

### Lecteur d'écran
- [ ] **Labels** : Tous les éléments ont des labels
- [ ] **Rôles** : Rôles ARIA appropriés
- [ ] **États** : États sélectionnés, désactivés
- [ ] **Annonces** : Changements d'état annoncés

### Tailles tactiles
- [ ] **Boutons** : Minimum 44px de hauteur
- [ ] **Liens** : Zone de touch suffisante
- [ ] **Inputs** : Zones de saisie accessibles

## 🔔 Notifications

### Badges
- [ ] **Dossier** : Badge orange si nouvelles tâches
- [ ] **Factures** : Badge orange si nouvelles factures
- [ ] **Contact** : Badge orange si nouveaux messages
- [ ] **Compteur** : Affichage du nombre (max 9+)

### Store
- [ ] **État** : Persistance des notifications
- [ ] **Reset** : Marquer comme lu fonctionne
- [ ] **Types** : Différenciation par type de notification

## 🎯 Écrans

### Authentification
- [ ] **Login** : Champ email, validation, messages d'erreur
- [ ] **OTP** : Code 6 chiffres, timer, renvoyer
- [ ] **Callback** : Chargement, succès, erreur
- [ ] **Logout** : Déconnexion propre

### Accueil
- [ ] **Progression** : Barre avec dégradé violet
- [ ] **Stats** : Cartes avec chiffres
- [ ] **Tâches récentes** : Liste avec badges
- [ ] **Actions rapides** : Boutons de navigation

### Dossier
- [ ] **Filtres** : Recherche, projet, inclure terminées
- [ ] **Liste** : Cartes de tâches avec progression
- [ ] **États** : Loading, empty, error
- [ ] **Reset** : Bouton de réinitialisation

### Factures
- [ ] **Liste** : Cartes avec statut et montant
- [ ] **Actions** : Voir PDF, télécharger
- [ ] **États** : Loading, empty, error
- [ ] **Téléchargement** : Gestion des erreurs

### Contact
- [ ] **Informations** : Email, téléphone, horaires
- [ ] **Actions** : Email, appel, WhatsApp
- [ ] **Formulaire** : Nom, email, message
- [ ] **Envoi** : Validation, confirmation

## 🎨 Thème

### Couleurs
- [ ] **Primaire** : #6C63FF (violet Flowli)
- [ ] **Secondaire** : #B3B0FF (violet clair)
- [ ] **Fond** : #FFFFFF (blanc), #F7F8FA (gris clair)
- [ ] **Texte** : #1A1A1A (principal), #6E6E6E (secondaire)
- [ ] **États** : #4CAF50 (succès), #FF9800 (alerte), #F44336 (erreur)

### Typographie
- [ ] **H1** : 24px, 600, 36px line-height
- [ ] **H2** : 20px, 500, 30px line-height
- [ ] **Body** : 16px, 400, 24px line-height
- [ ] **Secondary** : 14px, 400, 21px line-height
- [ ] **Button** : 15px, 500, 22px line-height

### Espacement
- [ ] **Padding** : 16px mobile, 24px web
- [ ] **Marges** : 24px vertical entre sections
- [ ] **Grille** : 1 colonne mobile, 2 tablette, 3 desktop

## 🧪 Tests

### Composants
- [ ] **Rendu** : Tous les composants s'affichent
- [ ] **Props** : Toutes les props fonctionnent
- [ ] **États** : Loading, error, success
- [ ] **Interactions** : Clics, focus, hover

### Navigation
- [ ] **Routes** : Toutes les routes fonctionnent
- [ ] **Transitions** : Animations fluides
- [ ] **État** : Navigation state persiste
- [ ] **Retour** : Bouton retour fonctionne

### Données
- [ ] **Chargement** : Skeletons pendant fetch
- [ ] **Erreurs** : Messages d'erreur clairs
- [ ] **Vide** : États vides avec illustrations
- [ ] **Succès** : Confirmations d'action

## 🚀 Performance

### Chargement
- [ ] **Initial** : < 3s pour le premier rendu
- [ ] **Navigation** : < 1s entre les écrans
- [ ] **Images** : Optimisation et lazy loading
- [ ] **Bundle** : Taille minimale

### Mémoire
- [ ] **Leaks** : Pas de fuites mémoire
- [ ] **Cleanup** : Nettoyage des listeners
- [ ] **Re-renders** : Optimisation des re-renders
- [ ] **Animations** : Performance des animations

## 🔧 Configuration

### Environnement
- [ ] **Variables** : Toutes les env vars définies
- [ ] **Secrets** : Aucun secret dans le code client
- [ ] **API** : Endpoints configurés
- [ ] **Auth** : Supabase configuré

### Build
- [ ] **Development** : `npm run start` fonctionne
- [ ] **Production** : `npm run build` fonctionne
- [ ] **EAS** : Build EAS fonctionne
- [ ] **Deploy** : Déploiement Vercel fonctionne

## 📱 Plateformes

### Mobile (iOS/Android)
- [ ] **Navigation** : Bottom tabs
- [ ] **Gestures** : Swipe, pull-to-refresh
- [ ] **Keyboard** : Gestion du clavier
- [ ] **Status bar** : Couleur appropriée

### Web
- [ ] **Navigation** : Sidebar + top bar
- [ ] **Responsive** : Tous les breakpoints
- [ ] **Keyboard** : Navigation clavier
- [ ] **Browser** : Chrome, Firefox, Safari

## 🐛 Bugs connus

### À corriger
- [ ] Bug 1 : Description du bug
- [ ] Bug 2 : Description du bug

### Limitations
- [ ] Limitation 1 : Description
- [ ] Limitation 2 : Description

## ✅ Sign-off

### Design
- [ ] **UI/UX** : Conforme à la charte
- [ ] **Cohérence** : Tous les écrans cohérents
- [ ] **Accessibilité** : Standards respectés

### Technique
- [ ] **Code** : Qualité et maintenabilité
- [ ] **Performance** : Optimisations appliquées
- [ ] **Tests** : Couverture suffisante

### Fonctionnel
- [ ] **Features** : Toutes les fonctionnalités
- [ ] **Navigation** : Parcours utilisateur complet
- [ ] **États** : Tous les états gérés

---

**Date de validation** : ___________
**Validé par** : ___________
**Version** : ___________
