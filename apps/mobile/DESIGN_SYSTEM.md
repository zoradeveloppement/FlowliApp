# 🎨 FlowliApp Design System

## Vue d'ensemble

Ce design system a été créé pour FlowliApp, une application de suivi de projet client. Il suit les principes de design moderne, d'accessibilité et de responsivité.

## 🎯 Objectifs

- **Cohérence** : Interface unifiée sur toutes les plateformes
- **Accessibilité** : Conforme aux standards WCAG 2.1 AA
- **Performance** : Composants optimisés et légers
- **Maintenabilité** : Code propre et documenté

## 🎨 Identité visuelle

### Couleurs

```typescript
const colors = {
  primary: '#6C63FF',        // Violet Flowli
  primaryLight: '#B3B0FF',   // Violet clair
  bgLight: '#FFFFFF',        // Fond blanc
  bgGray: '#F7F8FA',         // Fond gris clair
  textMain: '#1A1A1A',       // Texte principal
  textMuted: '#6E6E6E',      // Texte secondaire
  success: '#4CAF50',        // Succès
  warn: '#FF9800',           // Alerte
  danger: '#F44336',         // Erreur
};
```

### Typographie

```typescript
const typography = {
  h1: { fontSize: 24, fontWeight: '600', lineHeight: 36 },
  h2: { fontSize: 20, fontWeight: '500', lineHeight: 30 },
  body: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
  secondary: { fontSize: 14, fontWeight: '400', lineHeight: 21 },
  button: { fontSize: 15, fontWeight: '500', lineHeight: 22 },
};
```

## 🧩 Composants

### Button

Bouton avec variants et tailles.

```tsx
import { Button } from '@/src/ui/components';

<Button
  title="Cliquer"
  variant="primary"
  size="md"
  onPress={() => {}}
/>
```

**Props :**
- `variant`: 'primary' | 'secondary' | 'ghost' | 'disabled'
- `size`: 'sm' | 'md' | 'lg'
- `disabled`: boolean
- `onPress`: () => void

### Input

Champ de saisie avec label et gestion d'erreur.

```tsx
import { Input } from '@/src/ui/components';

<Input
  label="Email"
  placeholder="votre@email.com"
  value={email}
  onChangeText={setEmail}
  error={error}
/>
```

### Card

Conteneur avec ombre et bordure arrondie.

```tsx
import { Card } from '@/src/ui/components';

<Card padding="md" shadow>
  <Text>Contenu</Text>
</Card>
```

### Badge

Badge de statut avec icônes.

```tsx
import { Badge } from '@/src/ui/components';

<Badge status="en cours" size="md" />
```

**Status :**
- `terminé` : Vert avec ✅
- `en cours` : Violet avec 🔄
- `à venir` : Gris avec ⏳
- `action requise` : Orange avec ⚠️

### Progress

Barre de progression avec dégradé.

```tsx
import { Progress } from '@/src/ui/components';

<Progress value={75} showPercentage />
```

### Snackbar

Notification toast.

```tsx
import { Snackbar } from '@/src/ui/components';

<Snackbar
  type="success"
  message="Action réussie"
  visible={true}
  onHide={() => {}}
/>
```

## 🎛️ Layouts

### Screen

Conteneur de base avec padding responsive.

```tsx
import { Screen } from '@/src/ui/layout';

<Screen>
  <Text>Contenu</Text>
</Screen>
```

### AppLayout

Layout principal avec navigation.

```tsx
import { AppLayout } from '@/src/ui/layout';

<AppLayout hasNewTasks={true}>
  <Text>Contenu</Text>
</AppLayout>
```

## 🎣 Hooks

### useToast

Gestion des notifications toast.

```tsx
import { useToast } from '@/src/ui/hooks';

const { showSuccess, showError, showInfo } = useToast();

showSuccess('Opération réussie');
```

### useLoading

Gestion des états de chargement.

```tsx
import { useLoading } from '@/src/ui/hooks';

const { loading, withLoading } = useLoading();

const handleAction = () => {
  withLoading(async () => {
    await apiCall();
  });
};
```

### useResponsive

Gestion de la responsivité.

```tsx
import { useResponsive } from '@/src/ui/hooks';

const { deviceType, isMobile, isTablet, isDesktop } = useResponsive();
```

### useAccessibility

Gestion de l'accessibilité.

```tsx
import { useAccessibility } from '@/src/ui/hooks';

const { createButtonProps, announceToScreenReader } = useAccessibility();

<Button
  {...createButtonProps({
    label: 'Bouton accessible',
    hint: 'Description du bouton',
  })}
/>
```

## 📱 Responsivité

### Breakpoints

- **Mobile** : < 768px
- **Tablet** : 768px - 1024px
- **Desktop** : > 1024px

### Classes responsive

```tsx
const { getResponsiveClassName } = useResponsive();

<View className={getResponsiveClassName({
  mobile: 'flex-col',
  tablet: 'flex-row',
  desktop: 'grid grid-cols-3',
})}>
```

## ♿ Accessibilité

### Standards

- **WCAG 2.1 AA** : Contraste minimum 4.5:1
- **Tailles tactiles** : Minimum 44px
- **Navigation clavier** : Support complet
- **Lecteur d'écran** : Labels et rôles appropriés

### Bonnes pratiques

```tsx
// Labels d'accessibilité
<Button
  accessibilityLabel="Bouton de connexion"
  accessibilityHint="Cliquez pour vous connecter"
/>

// Rôles ARIA
<View accessibilityRole="button">
  <Text>Élément cliquable</Text>
</View>
```

## 🎨 Thème

### Configuration

Le thème est configuré dans `tailwind.config.js` :

```javascript
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#6C63FF",
        // ... autres couleurs
      },
    },
  },
};
```

### Utilisation

```tsx
// Classes Tailwind
<View className="bg-primary text-white p-4 rounded-lg">
  <Text className="text-h1">Titre</Text>
</View>
```

## 🧪 Tests

### Composants

Chaque composant peut être testé individuellement :

```tsx
import { Button } from '@/src/ui/components';

// Test des variants
<Button variant="primary" title="Primaire" />
<Button variant="secondary" title="Secondaire" />
<Button variant="ghost" title="Ghost" />
```

### Accessibilité

Utilisez les composants de test :

```tsx
import { AccessibilityTest } from '@/src/ui/components';

<AccessibilityTest />
```

### Responsivité

```tsx
import { ResponsiveTest } from '@/src/ui/components';

<ResponsiveTest />
```

## 📚 Ressources

- [Tailwind CSS](https://tailwindcss.com/)
- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)

## 🤝 Contribution

1. Suivez les conventions de nommage
2. Documentez les nouveaux composants
3. Testez l'accessibilité
4. Vérifiez la responsivité
5. Mettez à jour cette documentation
