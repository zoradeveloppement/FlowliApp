# 🪄 FlowliApp - Portail Client

> Application de suivi de projet client avec design system moderne et accessibilité complète.

## 🎯 Vue d'ensemble

FlowliApp permet aux clients de suivre l'avancement de leurs projets, gérer leurs tâches et consulter leurs factures. L'application est développée avec React Native + Expo pour une compatibilité web et mobile.

## ✨ Fonctionnalités

### 🔐 Authentification
- Connexion par email avec code OTP
- Gestion des sessions sécurisées
- Interface responsive et accessible

### 📊 Suivi de projet
- Vue d'ensemble de la progression
- Barres de progression avec dégradé violet
- Statistiques en temps réel

### 📋 Gestion des tâches
- Liste des tâches avec filtres avancés
- Statuts visuels (terminé, en cours, à venir, action requise)
- Recherche et filtrage par projet

### 💰 Factures
- Consultation des factures
- Téléchargement des PDF
- Statuts de paiement

### 📞 Contact
- Informations de contact
- Formulaire de contact
- Support technique

### 🔔 Notifications
- Badges de notification sur les onglets
- Notifications push (mobile)
- Notifications in-app

## 🏗️ Architecture

### Stack technique
- **Frontend** : React Native + Expo
- **Styling** : NativeWind (Tailwind CSS)
- **Navigation** : Expo Router
- **État** : Zustand
- **Auth** : Supabase Auth
- **Backend** : Vercel Functions
- **Base de données** : Supabase + Airtable

### Structure du projet
```
apps/mobile/
├── app/                    # Expo Router
│   ├── (auth)/            # Authentification
│   ├── (app)/             # Application principale
│   └── _layout.tsx        # Layout racine
├── src/
│   ├── ui/                # Design System
│   │   ├── components/    # Composants réutilisables
│   │   ├── layout/        # Layouts
│   │   ├── theme/         # Thème et tokens
│   │   ├── hooks/         # Hooks personnalisés
│   │   ├── store/         # État global
│   │   └── utils/         # Utilitaires
│   ├── features/          # Fonctionnalités métier
│   └── lib/               # Bibliothèques externes
└── assets/                # Ressources
```

## 🚀 Démarrage rapide

### Prérequis
- Node.js 18+
- npm ou yarn
- Expo CLI
- Compte Expo

### Installation
```bash
# Cloner le projet
git clone <repository-url>
cd FlowliApp/apps/mobile

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run start
```

### Variables d'environnement
Créer un fichier `.env` :
```bash
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🎨 Design System

### Couleurs
- **Primaire** : #6C63FF (Violet Flowli)
- **Secondaire** : #B3B0FF (Violet clair)
- **Succès** : #4CAF50
- **Alerte** : #FF9800
- **Erreur** : #F44336

### Composants
- **Button** : Variants et tailles
- **Input** : Champs avec validation
- **Card** : Conteneurs avec ombre
- **Badge** : Statuts avec icônes
- **Progress** : Barres de progression
- **Snackbar** : Notifications toast

### Utilisation
```tsx
import { Button, Card, Badge } from '@/src/ui/components';

<Card>
  <Button variant="primary" title="Cliquer" />
  <Badge status="en cours" />
</Card>
```

## 📱 Responsivité

### Breakpoints
- **Mobile** : < 768px (Bottom tabs)
- **Tablet** : 768px - 1024px (Layout hybride)
- **Desktop** : > 1024px (Sidebar)

### Navigation
- **Mobile** : Bottom tabs avec badges
- **Web** : Sidebar avec navigation

## ♿ Accessibilité

### Standards
- **WCAG 2.1 AA** : Contraste minimum 4.5:1
- **Tailles tactiles** : Minimum 44px
- **Navigation clavier** : Support complet
- **Lecteur d'écran** : Labels et rôles appropriés

### Utilisation
```tsx
import { useAccessibility } from '@/src/ui/hooks';

const { createButtonProps } = useAccessibility();

<Button
  {...createButtonProps({
    label: 'Bouton accessible',
    hint: 'Description du bouton',
  })}
/>
```

## 🧪 Tests

### Composants
```bash
# Tests unitaires
npm run test

# Tests d'accessibilité
npm run test:a11y
```

### QA
Voir [QA_CHECKLIST.md](./QA_CHECKLIST.md) pour la checklist complète.

## 📚 Documentation

- [Design System](./DESIGN_SYSTEM.md) - Guide du design system
- [Guide de développement](./DEVELOPMENT_GUIDE.md) - Guide pour les développeurs
- [Checklist QA](./QA_CHECKLIST.md) - Checklist de qualité

## 🚀 Déploiement

### Development
```bash
npm run start
```

### Production
```bash
# Build
npm run build

# EAS Build
eas build --platform all

# Deploy
eas submit
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature
3. Commit vos changements
4. Push vers la branche
5. Ouvrir une Pull Request

### Conventions
- **Commits** : Conventional commits
- **Code** : ESLint + Prettier
- **Tests** : Tests unitaires
- **Documentation** : Mise à jour des docs

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](./LICENSE) pour plus de détails.

## 🆘 Support

Pour toute question ou problème :
- **Issues** : [GitHub Issues](https://github.com/your-repo/issues)
- **Documentation** : [Wiki](https://github.com/your-repo/wiki)
- **Contact** : support@flowli.com

---

**Développé avec ❤️ par l'équipe Flowli**