# 🎨 CHARTE GRAPHIQUE FLOWLI
## Design System & Identité Visuelle Complète

**Version** : 1.0  
**Date** : Octobre 2025  
**Objectif** : Document de référence unique pour reproduire l'identité visuelle Flowli

---

## 📋 TABLE DES MATIÈRES

1. [Identité de Marque](#identité-de-marque)
2. [Palette de Couleurs](#palette-de-couleurs)
3. [Typographie](#typographie)
4. [Espacements & Structure](#espacements--structure)
5. [Effets Visuels](#effets-visuels)
6. [Composants UI](#composants-ui)
7. [Iconographie](#iconographie)
8. [Animations & Interactions](#animations--interactions)
9. [Responsive Design](#responsive-design)
10. [Guidelines d'Usage](#guidelines-dusage)

---

# 1. IDENTITÉ DE MARQUE

## 🎯 Positionnement

**Flowli** est une agence de développement d'applications sur-mesure positionnée sur :
- La **rapidité** (livraison 14 jours)
- La **qualité** (retours illimités)
- L'**innovation** (automatisation, LTV)

## 🎨 Personnalité de Marque

- **Moderne** : Design épuré, gradients tech
- **Premium** : Violet royal, ombres subtiles
- **Professionnelle** : Typographie claire, hiérarchie forte
- **Accessible** : Contraste AA/AAA, dark mode

## 💜 Couleur Signature

**Violet Flowli** : `#7C3AED`
- Représente l'innovation et la technologie
- Décliné en 3 nuances (default, light, glow)
- Utilisé pour tous les CTA et éléments interactifs

---

# 2. PALETTE DE COULEURS

## 🎨 Couleurs Primaires

### Violet Flowli (Primary)

```css
/* Light Mode */
--primary:           #7C3AED    hsl(263 70% 55%)     /* Violet principal */
--primary-light:     #A78BFA    hsl(263 85% 70%)     /* Violet clair hover */
--primary-glow:      #DDD6FE    hsl(263 85% 85%)     /* Violet très clair */
--primary-foreground: #FFFFFF   hsl(0 0% 100%)       /* Texte sur violet */

/* Dark Mode */
--primary:           #A78BFA    hsl(263 85% 70%)     /* Plus clair en dark */
--primary-light:     #C4B5FD    hsl(263 85% 80%)
--primary-glow:      #E9D5FF    hsl(263 85% 90%)
```

**Utilisation** :
- Boutons CTA principaux
- Liens et éléments interactifs
- Accents et highlights
- Bordures de focus

## 🖤 Couleurs Neutres

### Light Mode

```css
--background:        #FFFFFF    hsl(0 0% 100%)       /* Fond principal */
--foreground:        #181C25    hsl(220 14% 11%)     /* Texte principal */
--muted:             #F4F5F6    hsl(220 14% 96%)     /* Fond secondaire */
--muted-foreground:  #6B7280    hsl(220 8.9% 46.1%)  /* Texte secondaire */
--border:            #E5E7EB    hsl(220 13% 91%)     /* Bordures */
--input:             #E5E7EB    hsl(220 13% 91%)     /* Input border */
```

### Dark Mode

```css
--background:        #181C25    hsl(220 14% 11%)     /* Fond sombre */
--foreground:        #FFFFFF    hsl(0 0% 100%)       /* Texte blanc */
--muted:             #23272F    hsl(220 14% 16%)     /* Fond secondaire sombre */
--muted-foreground:  #9CA3AF    hsl(220 14% 63%)     /* Texte gris clair */
--border:            #23272F    hsl(220 14% 16%)     /* Bordures sombres */
```

## 🎨 Couleurs Sémantiques

### Destructive (Rouge)

```css
/* Light */
--destructive:       #F87171    hsl(0 84.2% 60.2%)
--destructive-foreground: #FFFFFF

/* Dark */
--destructive:       #DC2626    hsl(0 62.8% 50%)
```

**Utilisation** : Erreurs, suppressions, alertes

### Success (Vert WhatsApp)

```css
--success:           #25D366    /* WhatsApp green */
```

**Utilisation** : Validations, succès, bouton WhatsApp

## 🌈 Gradients

### Gradient Hero (Principal)

```css
background: linear-gradient(135deg, hsl(263 70% 55%), hsl(280 85% 65%));
```

**Usage** : Hero sections, headers premium

### Gradient Card

```css
background: linear-gradient(145deg, hsl(0 0% 100%), hsl(220 14% 98%));
```

**Usage** : Cartes légères, backgrounds subtils

### Gradient Premium

```css
background: linear-gradient(145deg, hsl(0 0% 100%), hsl(263 50% 98%));
```

**Usage** : Cartes premium, sections VIP

## ♿ Accessibilité des Couleurs

| Combinaison | Ratio | Niveau |
|-------------|-------|--------|
| Primary (#7C3AED) sur blanc | 4.8:1 | AA (grand texte) |
| Foreground (#181C25) sur blanc | 14.5:1 | AAA |
| Muted-foreground (#6B7280) sur blanc | 4.6:1 | AA |
| Primary sur primary-glow | 7.2:1 | AAA |

---

# 3. TYPOGRAPHIE

## 📝 Famille de Police

### Police Système (Actuelle)

```css
font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 
  "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
```

### Recommandation Google Fonts

Pour renforcer l'identité :
- **Inter** - Moderne, lisible, professionnelle
- **Manrope** - Arrondie, friendly
- **Plus Jakarta Sans** - Tech, startup

## 📐 Hiérarchie Typographique

### Titres

| Niveau | Desktop | Mobile | Weight | Line Height | Usage |
|--------|---------|--------|--------|-------------|-------|
| **H1 Hero** | `clamp(24px, 6.2vw, 72px)` | 24px | 800 | 1.06 | Titre principal homepage |
| **H1** | 3.75rem (60px) | 2.25rem (36px) | 800 | 1.1 | Titres de page |
| **H2** | 2.25rem (36px) | 1.875rem (30px) | 700 | 1.2 | Titres de section |
| **H3** | 1.5rem (24px) | 1.25rem (20px) | 600 | 1.3 | Sous-titres |
| **H4** | 1.125rem (18px) | 1rem (16px) | 600 | 1.4 | Titres de card |

### Corps de Texte

| Type | Taille | Weight | Line Height | Usage |
|------|--------|--------|-------------|-------|
| **Body XL** | 1.25rem (20px) | 400 | 1.7 | Sous-titres hero |
| **Body** | 1rem (16px) | 400 | 1.6 | Texte standard |
| **Small** | 0.875rem (14px) | 400 | 1.5 | Labels, helpers |
| **XSmall** | 0.75rem (12px) | 400 | 1.4 | Footer, notes |

### Graisses (Font Weights)

```css
--font-regular:   400
--font-medium:    500
--font-semibold:  600
--font-bold:      700
--font-extrabold: 800
```

### Espacements Typographiques

```css
/* Letter Spacing */
--tracking-tight:   -0.02em  /* Grands titres */
--tracking-normal:   0       /* Texte standard */
--tracking-wide:     0.01em  /* Petits textes */

/* Line Height */
--leading-none:     1        /* Titres compacts */
--leading-tight:    1.25     /* Titres */
--leading-normal:   1.5      /* Corps */
--leading-relaxed:  1.75     /* Texte aéré */
```

## 📝 Exemples de Texte

### Hero Title

```css
font-size: clamp(24px, 6.2vw, 72px);
font-weight: 800;
line-height: 1.06;
letter-spacing: -0.01em;
color: hsl(var(--foreground));
```

### Section Title

```css
font-size: 2.25rem;  /* 36px */
font-weight: 700;
line-height: 1.2;
color: hsl(var(--foreground));
```

### Body Text

```css
font-size: 1rem;  /* 16px */
font-weight: 400;
line-height: 1.6;
color: hsl(var(--foreground));
```

### Muted Text

```css
font-size: 0.875rem;  /* 14px */
font-weight: 400;
line-height: 1.5;
color: hsl(var(--muted-foreground));
```

---

# 4. ESPACEMENTS & STRUCTURE

## 📏 Échelle d'Espacement

**Base** : 4px (0.25rem)

| Token | Valeur | Pixels | Usage |
|-------|--------|--------|-------|
| `0` | 0 | 0px | Aucun |
| `1` | 0.25rem | 4px | Micro-espacements |
| `2` | 0.5rem | 8px | Très petit |
| `3` | 0.75rem | 12px | Petit |
| `4` | 1rem | 16px | **Standard** |
| `6` | 1.5rem | 24px | Moyen |
| `8` | 2rem | 32px | Grand |
| `12` | 3rem | 48px | Très grand |
| `16` | 4rem | 64px | Section |
| `20` | 5rem | 80px | Grande section |
| `24` | 6rem | 96px | Hero section |
| `32` | 8rem | 128px | Extra large |

## 🔲 Border Radius

**Base** : 8px (0.5rem)

| Token | Valeur | Usage |
|-------|--------|-------|
| `none` | 0 | Rectangulaire |
| `sm` | 4px | Petits éléments |
| `md` | 6px | Éléments moyens |
| `lg` | **8px** | **Standard** (cards, inputs) |
| `xl` | 12px | Grands boutons |
| `2xl` | 16px | Grandes cards |
| `3xl` | 24px | Sections premium |
| `full` | 9999px | Pills, badges circulaires |

## 📐 Grille & Container

### Container

```css
max-width: 1400px;
margin: 0 auto;
padding: 0 2rem;
```

### Grid Responsive

```css
/* Mobile */
grid-template-columns: 1fr;

/* Tablet (768px+) */
grid-template-columns: repeat(2, 1fr);

/* Desktop (1024px+) */
grid-template-columns: repeat(4, 1fr);

/* Gap */
gap: 1.5rem;  /* 24px */
```

---

# 5. EFFETS VISUELS

## 💫 Ombres (Box Shadows)

### Shadow Primary (Violet)

```css
box-shadow: 0 10px 30px -10px hsl(263 70% 55% / 0.3);
```

**Usage** : Boutons CTA, éléments principaux

### Shadow Card

```css
box-shadow: 
  0 4px 6px -1px hsl(220 13% 91% / 0.1), 
  0 2px 4px -1px hsl(220 13% 91% / 0.06);
```

**Usage** : Cartes au repos

### Shadow Hover

```css
box-shadow: 0 20px 40px -12px hsl(263 70% 55% / 0.25);
```

**Usage** : État hover des boutons et cards

### Shadow Premium

```css
box-shadow: 
  0 8px 25px -5px hsl(263 70% 55% / 0.15), 
  0 0 0 1px hsl(263 70% 55% / 0.05);
```

**Usage** : Cards premium, sections VIP

### Shadow Premium Hover

```css
box-shadow: 
  0 15px 35px -8px hsl(263 70% 55% / 0.25), 
  0 0 0 1px hsl(263 70% 55% / 0.1);
```

**Usage** : Hover sur cards premium

## 🎨 Effets Spéciaux

### Card Violet (Signature Flowli)

```css
.card-violet {
  border: 2px solid hsl(var(--primary) / 0.1);
  background: hsl(var(--card));
  transition: all 0.3s ease;
}

.card-violet:hover {
  border-color: hsl(var(--primary) / 0.2);
  box-shadow: 0 10px 30px -10px hsl(var(--primary) / 0.3);
}
```

### Logo Grayscale

```css
.logo-dark {
  filter: grayscale(1) brightness(0.35) contrast(1.1);
  opacity: 0.95;
}
```

**Usage** : Logos clients en grayscale uniforme

### Glow Effect (WhatsApp)

```css
/* Halo animé */
.glow-ping {
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  background: #25D366;
  opacity: 0.75;
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}

/* Blur glow */
.glow-blur {
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  background: #25D366;
  opacity: 0.5;
  filter: blur(8px);
}
```

---

# 6. COMPOSANTS UI

## 🔘 Buttons

### Variantes

#### Default (Principal)

```css
background: hsl(var(--primary));
color: hsl(var(--primary-foreground));
box-shadow: var(--shadow-primary);
transition: all 0.3s ease;

&:hover {
  background: hsl(var(--primary) / 0.9);
  box-shadow: var(--shadow-hover);
  transform: scale(1.05);
}
```

#### Hero (Gradient)

```css
background: var(--gradient-hero);
color: white;
font-weight: 600;
box-shadow: var(--shadow-primary);

&:hover {
  box-shadow: var(--shadow-hover);
  transform: scale(1.05);
}
```

#### CTA (Call-to-Action)

```css
background: hsl(var(--primary));
color: white;
font-size: 1.125rem;
font-weight: 700;
padding: 1rem 3rem;
box-shadow: var(--shadow-primary);

&:hover {
  background: hsl(var(--primary-light));
  box-shadow: var(--shadow-hover);
  transform: scale(1.05);
}
```

#### Outline

```css
background: transparent;
border: 1px solid hsl(var(--input));
color: hsl(var(--foreground));

&:hover {
  background: hsl(var(--accent));
  color: hsl(var(--accent-foreground));
}
```

#### Ghost

```css
background: transparent;
border: none;

&:hover {
  background: hsl(var(--accent));
  color: hsl(var(--accent-foreground));
}
```

### Tailles

| Size | Height | Padding | Border Radius |
|------|--------|---------|---------------|
| `sm` | 36px | 12px 16px | 6px (md) |
| `default` | 40px | 16px 20px | 6px (md) |
| `lg` | 44px | 20px 32px | 6px (md) |
| `xl` | 56px | 16px 48px | 8px (lg) |
| `icon` | 40px × 40px | - | 6px (md) |

### États

```css
/* Focus */
&:focus-visible {
  outline: none;
  ring: 2px solid hsl(var(--ring));
  ring-offset: 2px;
}

/* Disabled */
&:disabled {
  pointer-events: none;
  opacity: 0.5;
}
```

## 📝 Inputs

### Style Standard

```css
height: 40px;
width: 100%;
border-radius: 6px;
border: 1px solid hsl(var(--input));
background: hsl(var(--background));
padding: 8px 12px;
font-size: 1rem;
color: hsl(var(--foreground));

&::placeholder {
  color: hsl(var(--muted-foreground));
}

&:focus-visible {
  outline: none;
  ring: 2px solid hsl(var(--ring));
  ring-offset: 2px;
}

&:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
```

### État Error

```css
border-color: hsl(var(--destructive));

&:focus-visible {
  ring-color: hsl(var(--destructive));
}
```

### Label & Helper Text

```css
/* Label */
label {
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: hsl(var(--foreground));
}

/* Helper Text */
.helper-text {
  font-size: 0.875rem;
  margin-top: 0.5rem;
  color: hsl(var(--muted-foreground));
}

/* Error Text */
.error-text {
  font-size: 0.875rem;
  margin-top: 0.5rem;
  color: hsl(var(--destructive));
}
```

## 🃏 Cards

### Card Default

```css
border-radius: 8px;
border: 1px solid hsl(var(--border));
background: hsl(var(--card));
box-shadow: var(--shadow-card);
```

### Card Violet (Signature)

```css
border-radius: 8px;
border: 2px solid hsl(var(--primary) / 0.1);
background: hsl(var(--card));
transition: all 0.3s ease;

&:hover {
  border-color: hsl(var(--primary) / 0.2);
  box-shadow: 0 10px 30px -10px hsl(var(--primary) / 0.3);
}
```

### Card Premium

```css
border-radius: 8px;
background: var(--gradient-premium);
border: 1px solid hsl(var(--primary) / 0.1);
box-shadow: var(--shadow-premium);

&:hover {
  box-shadow: var(--shadow-premium-hover);
}
```

### Structure Interne

```css
/* Header */
.card-header {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

/* Title */
.card-title {
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1;
  letter-spacing: -0.01em;
}

/* Description */
.card-description {
  font-size: 0.875rem;
  color: hsl(var(--muted-foreground));
}

/* Content */
.card-content {
  padding: 0 1.5rem 1.5rem;
}

/* Footer */
.card-footer {
  padding: 0 1.5rem 1.5rem;
  display: flex;
  align-items: center;
}
```

## 🏷️ Badges

### Badge Primary

```css
display: inline-flex;
align-items: center;
gap: 0.375rem;
border-radius: 9999px;
background: hsl(var(--primary) / 0.1);
color: hsl(var(--primary));
padding: 0.5rem 1rem;
font-size: 0.875rem;
font-weight: 500;
```

### Badge Success

```css
background: #25D366 / 0.1;
color: #25D366;
```

### Badge avec Icône

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
}

.badge-icon {
  width: 1rem;
  height: 1rem;
}
```

---

# 7. ICONOGRAPHIE

## 🎯 Librairie d'Icônes

**Lucide React** v0.462.0

https://lucide.dev

## 📋 Icônes Utilisées

| Icône | Nom | Usage |
|-------|-----|-------|
| 📅 | `Calendar` | Prise de RDV |
| ✓ | `Check` | Validations, checkmarks |
| ✓○ | `CheckCircle` | Succès, confirmation |
| 🕐 | `Clock` | Rapidité, délai |
| 📈 | `TrendingUp` | Croissance, performance |
| 🛡️ | `Shield` | Sécurité, confiance |
| ⚡ | `Zap` | Vitesse, automatisation |
| ☰ | `Menu` | Menu mobile |
| × | `X` | Fermer |
| ⌄ | `ChevronDown` | Accordéon, dropdown |
| 👤 | `User` | Profil utilisateur |
| 🔍 | `Search` | Recherche |

## 📐 Tailles Standard

| Context | Size | Usage |
|---------|------|-------|
| **Button** | 16-20px | Icônes dans boutons |
| **Badge** | 16px | Icônes dans badges |
| **Card** | 32-40px | Icônes features/benefits |
| **Hero** | 24px | Icônes CTA hero |
| **Input** | 20px | Icônes dans inputs |

## 🎨 Couleurs d'Icônes

```css
/* Primary */
.icon-primary {
  color: hsl(var(--primary));
}

/* Muted */
.icon-muted {
  color: hsl(var(--muted-foreground));
}

/* On Primary */
.icon-on-primary {
  color: hsl(var(--primary-foreground));
}
```

## 💡 Utilisation

### Icône simple

```tsx
<Icon className="h-5 w-5 text-primary" />
```

### Icône dans bouton

```tsx
<button>
  <CalendarIcon className="mr-2 h-5 w-5" />
  Réserver
</button>
```

### Icône dans badge

```tsx
<div className="badge">
  <CheckCircleIcon className="h-4 w-4" />
  +50 entreprises
</div>
```

---

# 8. ANIMATIONS & INTERACTIONS

## ⏱️ Durées de Transition

```css
--duration-fast:   150ms    /* Micro-interactions */
--duration-normal: 200ms    /* Accordéons */
--duration-smooth: 300ms    /* Standard (défaut) */
--duration-slow:   600ms    /* Animations entrée */
--duration-typing: 800ms    /* Effet typing */
```

## 🎭 Timing Functions

```css
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1)     /* Défaut */
--ease-in:     cubic-bezier(0.4, 0, 1, 1)
--ease-out:    cubic-bezier(0, 0, 0.2, 1)
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)
```

## 🔄 Animations Keyframes

### Scroll (Logos défilants)

```css
@keyframes scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.animate-scroll {
  animation: scroll 40s linear infinite;
}
```

### Scroll Reverse

```css
@keyframes scroll-reverse {
  0% { transform: translateX(-50%); }
  100% { transform: translateX(0); }
}

.animate-scroll-reverse {
  animation: scroll-reverse 22s linear infinite;
}
```

### Fade In Delayed

```css
@keyframes fade-in-delayed {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-delayed {
  opacity: 0;
  transform: translateY(20px);
  animation: fade-in-delayed 0.6s ease-out 0.8s forwards;
}
```

### Typing Effect

```css
@keyframes typing {
  from { width: 0; }
  to { width: 100%; }
}

.typing-animation {
  overflow: hidden;
  white-space: nowrap;
  animation: typing 0.8s steps(60, end) 0.3s both;
}
```

### Ping (WhatsApp glow)

```css
@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}

.animate-ping {
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}
```

## 🖱️ Effets Hover

### Bouton CTA

```css
.button-cta {
  transition: all 0.3s ease;
}

.button-cta:hover {
  transform: scale(1.05);
  box-shadow: var(--shadow-hover);
}
```

### Card Violet

```css
.card-violet {
  transition: all 0.3s ease;
}

.card-violet:hover {
  border-color: hsl(var(--primary) / 0.2);
  box-shadow: 0 10px 30px -10px hsl(var(--primary) / 0.3);
}
```

### Logo Client

```css
.logo {
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.logo:hover {
  opacity: 1;
}
```

## ⏸️ Pause Animation on Hover

```css
.hover\:pause-animation:hover {
  animation-play-state: paused;
}
```

**Usage** : Arrêter le défilement des logos au survol

---

# 9. RESPONSIVE DESIGN

## 📱 Breakpoints

| Breakpoint | Min Width | Device | Usage |
|------------|-----------|--------|-------|
| `sm` | 640px | Mobile L | Ajustements mobile |
| `md` | 768px | Tablette | Layout tablette |
| `lg` | 1024px | Desktop | Layout desktop |
| `xl` | 1280px | Desktop L | Grands écrans |
| `2xl` | 1400px | Desktop XL | Container max |

## 📐 Stratégie Mobile-First

```css
/* Mobile (défaut) */
.element {
  font-size: 1rem;
  padding: 1rem;
}

/* Tablet (768px+) */
@media (min-width: 768px) {
  .element {
    font-size: 1.125rem;
    padding: 1.5rem;
  }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .element {
    font-size: 1.25rem;
    padding: 2rem;
  }
}
```

## 📱 Patterns Responsive

### Texte Responsive (clamp)

```css
/* Hero title */
font-size: clamp(24px, 6.2vw, 72px);

/* Section title */
font-size: clamp(28px, 4vw, 48px);

/* Body text */
font-size: clamp(14px, 2vw, 16px);
```

### Grid Responsive

```css
/* Mobile */
.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

/* Tablet */
@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
  }
}
```

### Espacements Responsive

```css
/* Padding responsive */
padding: 1rem;              /* Mobile */
padding: 1.5rem;            /* sm: */
padding: 2rem;              /* lg: */

/* Section padding */
padding-top: 4rem;          /* Mobile */
padding-top: 6rem;          /* lg: */
```

## 📏 Container Responsive

```css
.container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;          /* Mobile */
}

@media (min-width: 640px) {
  .container {
    padding: 0 1.5rem;      /* sm */
  }
}

@media (min-width: 1024px) {
  .container {
    padding: 0 2rem;        /* lg */
  }
}
```

---

# 10. GUIDELINES D'USAGE

## ✅ Do's (À faire)

### Couleurs

✅ **Toujours utiliser le violet #7C3AED pour les CTA**
```css
background: hsl(var(--primary));
```

✅ **Appliquer les ombres violettes sur les interactions**
```css
box-shadow: var(--shadow-primary);
```

✅ **Respecter les contrastes AA minimum**
- Texte standard : ratio 4.5:1
- Texte large : ratio 3:1

✅ **Utiliser les variables CSS pour la cohérence**
```css
color: hsl(var(--foreground));
```

### Typographie

✅ **Respecter la hiérarchie H1 → H2 → H3**

✅ **Utiliser clamp() pour le responsive**
```css
font-size: clamp(24px, 6.2vw, 72px);
```

✅ **Appliquer les graisses cohérentes**
- Titres : 600-800
- Corps : 400
- Emphasis : 500-600

### Espacements

✅ **Utiliser l'échelle 4px**
- Petits : 4, 8, 12px
- Moyens : 16, 24, 32px
- Grands : 48, 64, 96px

✅ **Respecter les paddings de section**
- Mobile : 4rem (64px)
- Desktop : 6rem (96px)

### Interactions

✅ **Ajouter scale(1.05) sur les hover CTA**
```css
transform: scale(1.05);
```

✅ **Transition 300ms par défaut**
```css
transition: all 0.3s ease;
```

✅ **Focus ring visible**
```css
ring: 2px solid hsl(var(--ring));
```

## ❌ Don'ts (À éviter)

### Couleurs

❌ **Ne jamais utiliser d'autres violets**
- Pas de #9333EA, #A855F7, etc.
- Uniquement #7C3AED et ses variantes

❌ **Ne pas mélanger les systèmes de couleurs**
- Pas de codes HEX hardcodés
- Toujours utiliser les variables CSS

❌ **Éviter les mauvais contrastes**
- Pas de gris clair sur blanc
- Vérifier avec un outil de contraste

### Typographie

❌ **Ne pas sauter de niveaux de hiérarchie**
- Pas de H1 → H3
- Toujours H1 → H2 → H3

❌ **Éviter les tailles fixes sur mobile**
- Pas de `font-size: 48px;` sans responsive
- Utiliser clamp() ou media queries

❌ **Ne pas abuser des graisses**
- Pas de 900 ou 950
- Maximum 800 (extrabold)

### Espacements

❌ **Ne pas utiliser de valeurs arbitraires**
- Pas de `padding: 13px;` ou `margin: 27px;`
- Respecter l'échelle 4px

❌ **Éviter les espacements incohérents**
- Garder les mêmes gaps dans les grids
- Uniformiser les paddings de cards

### Interactions

❌ **Ne pas oublier les états**
- Toujours définir :hover, :focus, :disabled

❌ **Éviter les transitions trop longues**
- Pas de `transition: 1s`
- Maximum 600ms pour les animations

❌ **Ne pas négliger l'accessibilité**
- Toujours un focus visible
- Conserver les ring-offset

## 🎯 Checklist Qualité

### Pour chaque page

- [ ] Violet #7C3AED utilisé pour tous les CTA
- [ ] Ombres violettes sur boutons et cards
- [ ] Border radius 8px par défaut
- [ ] Transitions 300ms smooth
- [ ] Hover scale 1.05 sur CTA
- [ ] Texte responsive avec clamp()
- [ ] Grid responsive (1 → 2 → 4 colonnes)
- [ ] Dark mode fonctionnel
- [ ] Accessibilité AA minimum
- [ ] Icons Lucide cohérents (20-24px)
- [ ] Focus visible sur tous les interactifs
- [ ] Mobile-first responsive

### Pour chaque composant

- [ ] Variables CSS utilisées
- [ ] États hover/focus/disabled définis
- [ ] Animations avec timing approprié
- [ ] Espacements échelle 4px
- [ ] Contraste validé (AA/AAA)
- [ ] Support dark mode
- [ ] Responsive mobile/tablet/desktop

---

## 📦 Ressources & Outils

### Design Tokens

**Fichier** : `tokens.json`

Contient tous les tokens en format JSON pour import dans votre app.

### Configuration Tailwind

**Fichier** : `tailwind.config.example.ts`

Configuration complète à copier dans votre projet.

### CSS Variables

**Fichier** : `globals.css`

Toutes les variables CSS et styles globaux.

### Composants React

**Dossier** : `components/`

- `Button.tsx` - 8 variantes
- `Input.tsx` - Input + Textarea
- `Card.tsx` - 3 variantes + Badge
- `AppIcon.tsx` - Gestion icônes

### Exemples

**Dossier** : `examples/`

- `App.example.tsx` - App complète
- `ComponentShowcase.tsx` - Tous les composants

---

## 🎨 Exemples de Code

### Hero Section

```tsx
<section className="py-20 lg:py-32 bg-gradient-hero text-white">
  <div className="container mx-auto px-4 text-center">
    <h1 
      className="font-extrabold mb-6"
      style={{ fontSize: 'clamp(24px, 6.2vw, 72px)', lineHeight: '1.06' }}
    >
      On crée l'application sur-mesure pour ton entreprise en 14 jours.
    </h1>
    
    <p className="text-xl opacity-90 mb-8">
      Notre mission : créer une app qui convertit...
    </p>
    
    <button className="bg-white text-primary px-12 py-4 rounded-lg font-bold text-lg shadow-primary hover:shadow-hover hover:scale-105 transition-all duration-300">
      Réserver un appel
    </button>
  </div>
</section>
```

### Card Bénéfice

```tsx
<div className="card-violet p-6 text-center rounded-lg">
  <div className="flex justify-center mb-3">
    <ClockIcon className="h-9 w-9 text-primary" />
  </div>
  <h3 className="font-semibold text-base mb-1">
    Livré en 14j
  </h3>
  <p className="text-sm text-muted-foreground">
    Rapidité garantie
  </p>
</div>
```

### Formulaire

```tsx
<form className="space-y-6">
  <div>
    <label className="text-sm font-medium mb-2 block">
      Email
    </label>
    <input 
      type="email"
      className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      placeholder="votre@email.com"
    />
    <p className="text-sm text-muted-foreground mt-2">
      Nous ne partagerons jamais votre email
    </p>
  </div>
  
  <button className="bg-primary text-white px-4 py-2 rounded-md font-medium shadow-primary hover:shadow-hover hover:scale-105 transition-all duration-300">
    Envoyer
  </button>
</form>
```

### Badge avec Icône

```tsx
<div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-2 text-sm font-medium">
  <CheckCircleIcon className="h-4 w-4" />
  <span>+50 entreprises</span>
</div>
```

---

## 📄 Variables CSS Complètes

```css
:root {
  /* Colors */
  --background: 0 0% 100%;
  --foreground: 220 14% 11%;
  --card: 0 0% 100%;
  --card-foreground: 220 14% 11%;
  --popover: 0 0% 100%;
  --popover-foreground: 220 14% 11%;
  --primary: 263 70% 55%;
  --primary-foreground: 0 0% 100%;
  --primary-light: 263 85% 70%;
  --primary-glow: 263 85% 85%;
  --secondary: 220 14% 96%;
  --secondary-foreground: 220 14% 11%;
  --muted: 220 14% 96%;
  --muted-foreground: 220 8.9% 46.1%;
  --accent: 263 70% 55%;
  --accent-foreground: 0 0% 100%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 0 0% 100%;
  --border: 220 13% 91%;
  --input: 220 13% 91%;
  --ring: 263 70% 55%;
  
  /* Gradients */
  --gradient-hero: linear-gradient(135deg, hsl(263 70% 55%), hsl(280 85% 65%));
  --gradient-card: linear-gradient(145deg, hsl(0 0% 100%), hsl(220 14% 98%));
  --gradient-premium: linear-gradient(145deg, hsl(0 0% 100%), hsl(263 50% 98%));
  
  /* Shadows */
  --shadow-primary: 0 10px 30px -10px hsl(263 70% 55% / 0.3);
  --shadow-card: 0 4px 6px -1px hsl(220 13% 91% / 0.1), 0 2px 4px -1px hsl(220 13% 91% / 0.06);
  --shadow-hover: 0 20px 40px -12px hsl(263 70% 55% / 0.25);
  --shadow-premium: 0 8px 25px -5px hsl(263 70% 55% / 0.15), 0 0 0 1px hsl(263 70% 55% / 0.05);
  --shadow-premium-hover: 0 15px 35px -8px hsl(263 70% 55% / 0.25), 0 0 0 1px hsl(263 70% 55% / 0.1);
  
  /* Transitions */
  --transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  /* Border Radius */
  --radius: 0.5rem;
}

.dark {
  --background: 220 14% 11%;
  --foreground: 0 0% 100%;
  --card: 220 14% 11%;
  --card-foreground: 0 0% 100%;
  --primary: 263 85% 70%;
  --primary-foreground: 220 14% 11%;
  --muted: 220 14% 16%;
  --muted-foreground: 220 14% 63%;
  --border: 220 14% 16%;
  --destructive: 0 62.8% 50%;
}
```

---

## 🎯 RÉCAPITULATIF RAPIDE

### Couleur Signature
**#7C3AED** - Violet Flowli (tous les CTA)

### Typographie
**Système** - Police par défaut  
**Clamp** - Responsive avec clamp()  
**Graisses** - 400 (body) à 800 (hero)

### Espacements
**Base 4px** - Échelle 0 → 32  
**Border Radius** - 8px par défaut  
**Container** - Max 1400px

### Effets
**Ombres violettes** - shadow-primary  
**Hover scale** - 1.05  
**Transition** - 300ms smooth

### Responsive
**Mobile-first** - Base mobile → Desktop  
**Breakpoints** - sm:640px, md:768px, lg:1024px  
**Grid** - 1 → 2 → 4 colonnes

### Accessibilité
**Contraste** - AA minimum (4.5:1)  
**Focus** - Ring visible  
**Dark mode** - Support complet

---

**🎨 FLOWLI DESIGN SYSTEM v1.0**

*Document de référence unique pour garantir une identité visuelle cohérente et une parité totale entre le site web et les applications.*

**Créé le** : Octobre 2025  
**Dernière mise à jour** : Octobre 2025  
**Maintenu par** : Équipe Flowli

