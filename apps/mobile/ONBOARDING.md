# 📱 Onboarding Flowli - Documentation

## 🎯 Vue d'ensemble

L'écran d'onboarding est la première interface que voit un utilisateur lorsqu'il ouvre l'application Flowli pour la première fois. Il présente l'offre Flowli, les bénéfices clés, et permet à l'utilisateur de :
- Réserver un appel sur Calendly
- Contacter l'équipe via WhatsApp
- Se connecter s'il est déjà client

## 🏗️ Architecture

### Structure des fichiers

```
apps/mobile/
├── app/
│   ├── (public)/
│   │   ├── _layout.tsx              # Layout public (onboarding)
│   │   └── onboarding.tsx           # Écran principal d'onboarding
│   ├── _layout.tsx                  # Root layout (ajout de la route (public))
│   └── index.tsx                    # Gestion du flow onboarding → auth → app
├── src/
│   ├── components/onboarding/
│   │   ├── HeroSection.tsx          # Section hero avec gradient
│   │   ├── PrimaryCTA.tsx           # Boutons CTA (Calendly, WhatsApp)
│   │   ├── ArgumentsBadges.tsx      # Pills "Intuitive", "Retours illimités", etc.
│   │   ├── FeatureCard.tsx          # Cards des bénéfices (4 cards)
│   │   ├── FeaturesList.tsx         # Liste des features avec checkmarks
│   │   ├── ClientLogos.tsx          # Marquee des logos clients
│   │   ├── WhatsAppFAB.tsx          # Bouton flottant WhatsApp avec ping
│   │   ├── LoginPrompt.tsx          # "Déjà client ? Se connecter"
│   │   └── index.ts                 # Barrel export
│   ├── animations/
│   │   ├── useFadeInDelayed.ts      # Hook fade-in avec delay
│   │   └── usePingAnimation.ts      # Hook ping pour le FAB WhatsApp
│   ├── constants/
│   │   └── onboarding.ts            # Contenus textuels & URLs
│   └── lib/
│       └── onboarding.ts            # Helpers AsyncStorage pour l'état onboarding
```

## 🎨 Design & Animations

### Couleurs principales
- **Violet primaire** : `#7C3AED` (tokens.colors.primary)
- **Gradient hero** : `#7C3AED` → `#B57CFF`
- **Vert WhatsApp** : `#25D366` (tokens.colors.success)

### Animations
1. **Fade-in delayed** : Badge → Titre → Sous-texte → CTA (délais 0/300/600/900ms)
2. **Cards stagger** : Bénéfices avec décalage de 100ms par card
3. **Ping WhatsApp** : Halo pulsant infini sur le bouton flottant
4. **Marquee logos** : Défilement horizontal automatique des logos clients
5. **Press feedback** : Scale 0.98 sur les CTA au touch

## 🔧 Configuration

### URLs modifiables

Toutes les URLs sont centralisées dans `src/constants/onboarding.ts` :

```typescript
export const ONBOARDING_LINKS = {
  calendly: 'https://cal.com/erwan-dehu/30min',
  whatsapp: 'https://wa.me/33698446548?text=Salut%2C%20je%20veux%20parler%20de%20mon%20app%20!',
  email: 'mailto:contact@flowli.fr',
  phone: 'tel:+33698446548',
}
```

### Contenus textuels

Tous les textes sont modifiables dans `src/constants/onboarding.ts` :

```typescript
export const ONBOARDING_CONTENT = {
  hero: {
    badge: '+50 entreprises nous ont fait confiance',
    title: "On crée l'application sur-mesure pour ton entreprise en 14 jours.",
    // ...
  },
  benefits: [...],
  features: {...},
  // ...
}
```

## 🚀 Flow utilisateur

### Première visite

1. L'utilisateur ouvre l'app
2. `app/index.tsx` vérifie dans AsyncStorage si l'onboarding a été vu
3. Si non : redirection vers `/(public)/onboarding`
4. L'utilisateur voit l'onboarding complet
5. Quand il clique sur un CTA ou "Se connecter" :
   - L'état `@flowli_onboarding_seen` est sauvegardé dans AsyncStorage
   - Il est redirigé (vers Calendly/WhatsApp ou vers login)

### Visites suivantes

1. L'utilisateur ouvre l'app
2. `app/index.tsx` détecte que l'onboarding a déjà été vu
3. Redirection automatique selon l'état d'authentification :
   - **Non connecté** → `/(auth)/login`
   - **Connecté** → `/(app)/home`

## 🧪 Tests & Debug

### Tester l'onboarding

```bash
# Démarrer l'app
cd apps/mobile
npx expo start
```

Appuyez sur `i` (iOS) ou `a` (Android) pour ouvrir l'app.

### Réinitialiser l'onboarding

Pour revoir l'onboarding après l'avoir marqué comme vu :

1. **Option 1 : Via le code** (temporaire, pour debug)
   ```typescript
   import { resetOnboarding } from '@/src/lib/onboarding';
   
   // Dans un composant ou au démarrage
   await resetOnboarding();
   ```

2. **Option 2 : Via Expo DevTools**
   - Ouvrir l'app
   - Shake (iOS) ou Cmd+M / Ctrl+M (Android)
   - "Settings" → "Clear AsyncStorage"
   - Reload l'app

3. **Option 3 : Via le terminal**
   ```bash
   # iOS Simulator
   xcrun simctl get_app_container booted com.flowli.app data
   # Puis supprimer le fichier AsyncStorage
   
   # Android Emulator
   adb shell run-as com.flowli.app
   rm -rf shared_prefs/
   ```

### Vérifier les animations

- ✅ **Fade-in** : Badge → Titre → Sous-texte → CTA apparaissent progressivement
- ✅ **Cards stagger** : Les 4 cards de bénéfices apparaissent avec décalage
- ✅ **Ping WhatsApp** : Le halo du bouton WhatsApp pulse en continu
- ✅ **Press feedback** : Les CTA réagissent au touch (scale 0.98)

### Vérifier les liens

- ✅ **"Réserver un appel"** → Ouvre Cal.com dans le navigateur
- ✅ **"Nous contacter"** → Ouvre WhatsApp (ou propose d'installer si absent)
- ✅ **WhatsApp FAB** → Ouvre WhatsApp avec message pré-rempli
- ✅ **"Se connecter"** → Navigue vers `/(auth)/login`

## ♿ Accessibilité

- **Touch targets** : Tous les boutons respectent la taille minimale de 44×44 dp
- **Labels** : `accessibilityLabel` et `accessibilityHint` sur tous les éléments interactifs
- **Contrastes** : Respectent WCAG AA (4.5:1 minimum)
- **Screen reader** : Ordre de lecture logique

## 📱 Responsive

- **Mobile** : Grid 2×2 pour les bénéfices, scroll vertical
- **Tablet** : Même layout que mobile (optimisable plus tard)
- **Web** : Utilise `calc(50% - 8px)` pour les cards (fallback 47% sur mobile)

## 🎯 Personnalisation

### Changer les couleurs

Éditer `apps/mobile/src/theme/tokens.ts` :

```typescript
export const tokens = {
  colors: {
    primary: "#VOTRE_COULEUR",  // Changer le violet
    success: "#VOTRE_COULEUR",  // Changer le vert WhatsApp
  },
  gradients: {
    hero: ["#COLOR1", "#COLOR2"],  // Gradient hero
  },
}
```

### Ajouter/retirer des features

Éditer `src/constants/onboarding.ts` :

```typescript
export const ONBOARDING_CONTENT = {
  benefits: [
    { icon: 'Clock', title: 'Nouveau bénéfice', description: 'Description' },
    // ...
  ],
  features: {
    items: [
      'Nouvelle feature',
      // ...
    ],
  },
}
```

### Changer les logos clients

Éditer `src/constants/onboarding.ts` :

```typescript
export const CLIENT_LOGOS = [
  'Nom Client 1',
  'Nom Client 2',
  // Si vous avez des images :
  // require('@/assets/logos/client1.png'),
]
```

## 🐛 Dépannage

### L'onboarding ne s'affiche pas

**Cause** : Il a déjà été marqué comme vu.

**Solution** : Réinitialiser l'onboarding (voir section Tests & Debug ci-dessus).

---

### Le gradient ne s'affiche pas

**Cause** : `expo-linear-gradient` non installé ou non configuré.

**Solution** :
```bash
npx expo install expo-linear-gradient
npx expo start -c  # Clear cache
```

---

### Les animations sont saccadées

**Cause** : `useNativeDriver: true` non activé ou conflit avec d'autres animations.

**Solution** : Vérifier que tous les `Animated.timing` ont `useNativeDriver: true`.

---

### Les liens externes ne s'ouvrent pas

**Cause** : Permissions ou URL invalide.

**Solution iOS** : Vérifier `app.json` → `ios.infoPlist.LSApplicationQueriesSchemes` contient `["https", "whatsapp"]`.

**Solution Android** : Vérifier que l'URL commence par `https://` ou un scheme supporté.

---

### Le FAB WhatsApp n'apparaît pas

**Cause** : Position absolute mal configurée ou z-index insuffisant.

**Solution** : Vérifier que le parent direct du FAB est bien en position `relative` et que le FAB a un z-index élevé.

---

## 📊 Métriques

| Métrique | Valeur |
|----------|--------|
| **Fichiers créés** | 15 fichiers |
| **Composants** | 8 composants réutilisables |
| **Animations** | 5 types différents |
| **Lignes de code** | ~800 lignes TypeScript/TSX |
| **Temps d'intégration** | ~15-20 minutes |

## ✅ Checklist de validation

### Installation
- [x] Toutes les dépendances installées
- [x] Aucune erreur TypeScript
- [x] Aucune erreur de linting
- [x] L'app démarre sans erreur

### UI/UX
- [x] Hero avec gradient violet correct
- [x] Badge confiance visible
- [x] Titre et sous-texte lisibles
- [x] 2 CTA (Calendly, WhatsApp)
- [x] 3 badges d'arguments
- [x] 4 cards de bénéfices (grid 2×2)
- [x] 5 features avec checkmarks
- [x] Marquee logos clients
- [x] WhatsApp FAB flottant
- [x] Lien "Se connecter"

### Navigation
- [x] Onboarding s'affiche en premier
- [x] Marquage de l'onboarding comme vu fonctionne
- [x] Redirection vers login après "Se connecter"
- [x] Pas de ré-affichage de l'onboarding après visite

### Accessibilité
- [x] Touch targets ≥ 44×44 dp
- [x] Labels accessibilité présents
- [x] Contrastes suffisants

## 🚀 Prochaines étapes

1. **Tester sur device réel** (iOS + Android)
2. **Ajouter des images** pour les logos clients (optionnel)
3. **Optimiser les animations** pour les appareils low-end
4. **Ajouter un bouton "Skip"** (optionnel)
5. **Tracking analytics** (Firebase, Mixpanel, etc.)

---

**Créé le** : 13 octobre 2025  
**Version** : 1.0.0  
**Stack** : Expo SDK 54, React Native 0.81.4, TypeScript  
**Respecte** : Rules quality-conventions, ux-ui, charte-graphique, architecture-projet

**Bon développement ! 🚀**

