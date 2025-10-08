# 🚀 Guide de Développement FlowliApp

## 🏗️ Architecture

### Structure du projet

```
apps/mobile/
├── app/                    # Expo Router
│   ├── (auth)/            # Écrans d'authentification
│   ├── (app)/             # Écrans principaux
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
│   │   ├── dossier/       # Gestion des tâches
│   │   ├── factures/      # Gestion des factures
│   │   └── contact/       # Contact et support
│   └── lib/               # Bibliothèques externes
└── assets/                # Images et ressources
```

## 🎨 Design System

### Ajouter un nouveau composant

1. **Créer le composant** dans `src/ui/components/`

```tsx
// src/ui/components/MyComponent.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { BaseComponentProps } from '../types';

interface MyComponentProps extends BaseComponentProps {
  title: string;
  onPress?: () => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({
  title,
  onPress,
  className = '',
}) => {
  return (
    <View className={`p-4 bg-white rounded-lg ${className}`}>
      <Text className="text-body text-textMain">{title}</Text>
    </View>
  );
};
```

2. **Exporter le composant** dans `src/ui/components/index.ts`

```tsx
export { MyComponent } from './MyComponent';
```

3. **Ajouter les types** dans `src/ui/types.ts`

```tsx
export interface MyComponentProps {
  title: string;
  onPress?: () => void;
}
```

### Utiliser un composant

```tsx
import { MyComponent } from '@/src/ui/components';

<MyComponent
  title="Mon titre"
  onPress={() => console.log('Clic')}
  className="mb-4"
/>
```

## 🎣 Hooks

### Créer un hook personnalisé

```tsx
// src/ui/hooks/useMyHook.ts
import { useState, useEffect } from 'react';

export const useMyHook = (initialValue: string) => {
  const [value, setValue] = useState(initialValue);
  
  useEffect(() => {
    // Logique du hook
  }, [value]);
  
  return { value, setValue };
};
```

### Utiliser un hook

```tsx
import { useMyHook } from '@/src/ui/hooks';

const { value, setValue } = useMyHook('initial');
```

## 📱 Écrans

### Créer un nouvel écran

1. **Créer le composant** dans `src/features/`

```tsx
// src/features/my-feature/MyScreen.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { Screen, AppLayout } from '../../ui/layout';
import { Card } from '../../ui/components';

export const MyScreen: React.FC = () => {
  return (
    <AppLayout>
      <Screen>
        <Card>
          <Text className="text-h1 text-textMain">Mon écran</Text>
        </Card>
      </Screen>
    </AppLayout>
  );
};
```

2. **Créer la page** dans `app/`

```tsx
// app/(app)/my-screen.tsx
import React from 'react';
import { MyScreen } from '../../src/features/my-feature/MyScreen';

export default function MyScreenPage() {
  return <MyScreen />;
}
```

## 🎨 Styling

### Classes Tailwind

```tsx
// Couleurs
<View className="bg-primary text-white" />
<View className="bg-bgGray text-textMuted" />

// Typographie
<Text className="text-h1 text-textMain" />
<Text className="text-body text-textMuted" />

// Espacement
<View className="p-4 m-2" />
<View className="px-6 py-3" />

// Layout
<View className="flex-row items-center justify-between" />
<View className="space-y-4" />
```

### Styles responsifs

```tsx
import { useResponsive } from '@/src/ui/hooks';

const { getResponsiveClassName } = useResponsive();

<View className={getResponsiveClassName({
  mobile: 'flex-col',
  tablet: 'flex-row',
  desktop: 'grid grid-cols-3',
})}>
```

## ♿ Accessibilité

### Props d'accessibilité

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

### Labels et rôles

```tsx
<View accessibilityRole="button">
  <Text accessibilityLabel="Élément cliquable">
    Contenu
  </Text>
</View>
```

## 🔔 Notifications

### Store de notifications

```tsx
import { useNotificationStore } from '@/src/ui/store/notificationStore';

const { hasNewTasks, setHasNewTasks } = useNotificationStore();

// Marquer comme lu
setHasNewTasks(true);
```

### Badges de notification

```tsx
import { NotificationBadge } from '@/src/ui/components';

<View className="relative">
  <Text>Icon</Text>
  <NotificationBadge count={5} />
</View>
```

## 🧪 Tests

### Tester un composant

```tsx
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '@/src/ui/components';

test('Button renders correctly', () => {
  const { getByText } = render(
    <Button title="Test" onPress={() => {}} />
  );
  
  expect(getByText('Test')).toBeTruthy();
});
```

### Tester l'accessibilité

```tsx
import { AccessibilityTest } from '@/src/ui/components';

<AccessibilityTest />
```

## 🚀 Déploiement

### Build

```bash
# Development
npm run start

# Production
npm run build

# EAS Build
eas build --platform all
```

### Variables d'environnement

```bash
# .env
EXPO_PUBLIC_SUPABASE_URL=your_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_key
```

## 📚 Ressources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native](https://reactnative.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [NativeWind](https://www.nativewind.dev/)

## 🐛 Debugging

### Logs

```tsx
import { Platform } from 'react-native';

if (__DEV__) {
  console.log('Debug info:', data);
}
```

### Erreurs

```tsx
import { ErrorState } from '@/src/ui/components';

<ErrorState
  message="Erreur de chargement"
  onRetry={() => refetch()}
/>
```

## 🤝 Contribution

1. **Fork** le projet
2. **Créer** une branche feature
3. **Commit** vos changements
4. **Push** vers la branche
5. **Ouvrir** une Pull Request

### Conventions

- **Nommage** : camelCase pour variables, PascalCase pour composants
- **Commits** : Conventional commits (feat:, fix:, docs:, etc.)
- **Code** : ESLint + Prettier
- **Tests** : Tests unitaires pour les composants
