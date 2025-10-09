# 📋 Règles de Développement FlowliApp

## 🎯 Vue d'ensemble

Ce dossier contient toutes les règles de développement pour le projet FlowliApp. Ces règles garantissent la cohérence, la qualité et la maintenabilité du code.

## 📁 Structure des règles

### **Architecture & Déploiement**
- `architecture-globale.mdc` - Architecture MVP du portail client
- `environnements-deploiement.mdc` - Configuration des environnements

### **Styling & UI (NOUVEAU)**
- `frontend-styling.mdc` - Règles de styling avec NativeWind + StyleSheet fallback
- `styling-checklist.mdc` - Checklist complète pour le styling
- `styling-migration-guide.mdc` - Guide de migration des composants

### **Qualité & Conventions**
- `quality-conventions.mdc` - Règles de qualité et conventions de code

## 🎨 Règles de Styling (CRITIQUE)

### **Problème résolu**
- **NativeWind ne fonctionne pas** toujours en mobile (Expo Go, certains devices)
- **Pages sans style** = mauvaise UX
- **Incohérence** entre login (qui fonctionne) et autres pages

### **Solution : Double système de styles**
```tsx
// ✅ BON - NativeWind + StyleSheet fallback
<View 
  className="bg-primary rounded-xl p-4"
  style={styles.card}
>
  <Text 
    className="text-white font-bold"
    style={styles.cardTitle}
  >
    Titre
  </Text>
</View>

// ❌ MAUVAIS - Seulement NativeWind
<View className="bg-primary rounded-xl p-4">
  <Text className="text-white font-bold">Titre</Text>
</View>
```

### **Règles obligatoires**
1. **Import StyleSheet** : `import { StyleSheet } from 'react-native'`
2. **Props style** : Toujours ajouter `style={styles.xxx}` aux éléments
3. **Styles de fallback** : Créer un objet `styles` avec StyleSheet.create()
4. **Commentaire** : Ajouter le commentaire explicatif
5. **Couleurs Flowli** : Utiliser la palette standardisée

## 🎯 Checklist de développement

### **Avant de commiter**
- [ ] Lint OK, build OK
- [ ] Tous les éléments ont des `style={styles.xxx}`
- [ ] Import `StyleSheet` ajouté
- [ ] Objet `styles` créé avec StyleSheet.create()
- [ ] Commentaire explicatif ajouté
- [ ] Couleurs Flowli utilisées
- [ ] Test sur device mobile

### **Tests obligatoires**
- [ ] **Expo Go** : Vérifier l'affichage sur mobile
- [ ] **Device physique** : Test sur iPhone/Android
- [ ] **Web** : Test sur navigateur (si applicable)
- [ ] **Cohérence** : Vérifier la palette Flowli

## 🎨 Palette de couleurs Flowli

### **Couleurs principales**
```tsx
const colors = {
  primary: '#6C63FF',        // Violet Flowli
  primaryLight: '#B3B0FF',   // Violet clair
  bgLight: '#FFFFFF',        // Blanc
  bgGray: '#F7F8FA',         // Gris clair
  textMain: '#1A1A1A',       // Noir texte
  textMuted: '#6E6E6E',      // Gris texte
  success: '#4CAF50',        // Vert
  warn: '#FF9800',          // Orange
  danger: '#F44336',         // Rouge
};
```

### **Typographie**
```tsx
const typography = {
  h1: { fontSize: 24, fontWeight: 'bold' },
  h2: { fontSize: 20, fontWeight: '600' },
  body: { fontSize: 16, fontWeight: '400' },
  secondary: { fontSize: 14, fontWeight: '400' },
  button: { fontSize: 15, fontWeight: '500' },
};
```

## 📱 Pages corrigées

### **✅ Pages avec styles de fallback**
- `app/(app)/home.tsx` - Page d'accueil
- `app/(app)/dossier.tsx` - Page dossier
- `app/(app)/factures.tsx` - Page factures
- `app/(app)/contact.tsx` - Page contact

### **✅ Composants avec styles de fallback**
- `src/ui/components/Button.tsx` - Boutons
- `src/ui/components/Input.tsx` - Champs de saisie
- `src/ui/components/Card.tsx` - Cartes
- `src/ui/components/TaskDetailModal.tsx` - Modal de détail

### **✅ Features avec styles de fallback**
- `src/features/dossier/DossierScreen.tsx` - Écran dossier
- `src/features/factures/FacturesScreen.tsx` - Écran factures
- `src/features/contact/ContactScreen.tsx` - Écran contact

## 🚀 Avantages de cette approche

### **1. Robustesse**
- Fonctionne même si NativeWind échoue
- Fallback garanti sur tous les devices
- Pas de pages "sans style"

### **2. Performance**
- StyleSheet optimisé par React Native
- Pas de re-calcul des styles
- Meilleure performance mobile

### **3. Maintenabilité**
- Code prévisible et cohérent
- Facile à déboguer
- Évolutif

### **4. UX**
- Interface toujours stylée
- Cohérence visuelle garantie
- Expérience utilisateur fluide

## 📋 Règle d'or

**Jamais de composant sans styles de fallback !**

Cette approche garantit :
- ✅ **Affichage correct** sur tous les devices
- ✅ **Cohérence visuelle** entre toutes les pages
- ✅ **Maintenabilité** du code
- ✅ **Performance** optimale
- ✅ **UX** fluide et professionnelle

## 🔗 Liens utiles

- [Guide de migration](./styling-migration-guide.mdc) - Comment migrer les composants
- [Checklist complète](./styling-checklist.mdc) - Vérifications obligatoires
- [Règles de styling](./frontend-styling.mdc) - Règles détaillées
- [Conventions de qualité](./quality-conventions.mdc) - Standards de code
