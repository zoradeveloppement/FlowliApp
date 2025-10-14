# Flowli Design System - Component Reference

Quick reference guide for all available components in the Flowli Design System.

## 🎨 Import Paths

```tsx
// Components
import { Button, Card, Input, Badge, AppIcon } from '@/components/ui';

// Animations
import { Ping, FadeInDelayed, ScrollMarquee } from '@/animations';

// Theme
import { useTheme, ThemeToggle, ThemedView, ThemedText } from '@/ui/theme/ThemeProvider';
import { tokens, getShadow, getHeroGradient } from '@/theme';
```

## 🔘 Button

### Variants
- `default` - Primary violet background, white text, shadow
- `hero` - Gradient background (hero gradient)
- `cta` - Large CTA button (18px text, 48px padding)
- `outline` - Transparent with border
- `ghost` - Fully transparent
- `destructive` - Red background

### Sizes
- `sm` - 36px height
- `default` - 40px height
- `lg` - 44px height
- `xl` - 56px height
- `icon` - 40x40px square

### Examples

```tsx
// Basic usage
<Button variant="default" onPress={() => {}}>
  Click Me
</Button>

// CTA button
<Button variant="cta" size="xl" onPress={handleSubmit}>
  Réserver un appel
</Button>

// Icon button
<Button size="icon" variant="ghost">
  <AppIcon name="search" color="#FFF" />
</Button>

// Disabled state
<Button disabled>
  Disabled
</Button>
```

## 📝 Input

### Variants
- `input` - Single line text input
- `textarea` - Multi-line text area

### Props
- `label` - Label text above input
- `helperText` - Helper text below input
- `errorText` - Error message (shows in red)
- `error` - Boolean to show error state

### Examples

```tsx
// Basic input
<Input
  label="Email"
  placeholder="your@email.com"
  helperText="We'll never share your email"
/>

// Error state
<Input
  label="Password"
  error
  errorText="Password must be at least 8 characters"
/>

// Textarea
<Textarea
  label="Message"
  placeholder="Your message..."
  helperText="Describe your project"
/>
```

## 🃏 Card

### Variants
- `default` - White background, border, card shadow
- `violet` - Primary border (2px), interactive with hover shadow
- `premium` - Gradient background, premium shadow

### Slots
- `CardHeader` - Padding 24, flex column, gap 6
- `CardTitle` - 24px, semibold
- `CardDescription` - 14px, muted
- `CardContent` - Padding horizontal 24
- `CardFooter` - Padding 24, flex row

### Examples

```tsx
// Default card
<Card variant="default">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description text</CardDescription>
  </CardHeader>
  <CardContent>
    <Text>Your content here</Text>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>

// Interactive violet card
<Card variant="violet" onPress={() => console.log('Pressed')}>
  <CardContent>
    <Text>Press me!</Text>
  </CardContent>
</Card>

// Premium gradient card
<Card variant="premium">
  <CardContent>
    <Text>Premium content</Text>
  </CardContent>
</Card>
```

## 🏷️ Badge

### Variants
- `primary` - Violet background (10% opacity), violet text
- `success` - Green background (10% opacity), green text

### Props
- `icon` - Optional icon name from AppIcon
- `variant` - Badge variant
- `children` - Badge text content

### Examples

```tsx
// Primary badge
<Badge variant="primary">
  New
</Badge>

// With icon
<Badge variant="primary" icon="check">
  Verified
</Badge>

// Success badge
<Badge variant="success" icon="checkCircle">
  +50 entreprises
</Badge>
```

## 🎯 AppIcon

### Available Icons
`calendar`, `check`, `checkCircle`, `clock`, `trendingUp`, `shield`, `zap`, `menu`, `x`, `chevronDown`, `user`, `search`

### Props
- `name` - Icon name (IconName type)
- `size` - Icon size in pixels (default: 24)
- `color` - Icon color (default: theme foreground)
- `strokeWidth` - Stroke width (default: 2)

### Examples

```tsx
// Basic icon
<AppIcon name="calendar" />

// Custom size and color
<AppIcon name="check" size={32} color="#25D366" />

// In a button
<Button>
  <AppIcon name="search" color="#FFF" size={20} />
  <Text>Search</Text>
</Button>
```

## ✨ Animations

### Ping

Pulsing glow effect (infinite loop).

```tsx
<Ping color="#25D366" size={40} />

// Custom styling
<Ping 
  color={colors.primary} 
  size={60}
  style={{ marginVertical: 20 }}
/>
```

### FadeInDelayed

Fade in with upward slide animation.

```tsx
<FadeInDelayed delay={500} duration={600}>
  <Card>
    <CardContent>
      <Text>This fades in</Text>
    </CardContent>
  </Card>
</FadeInDelayed>

// Custom translation
<FadeInDelayed 
  delay={1000} 
  duration={800}
  translateY={40}
>
  <Text>Slides up more</Text>
</FadeInDelayed>
```

### ScrollMarquee

Horizontal scrolling loop for logos/content.

```tsx
<ScrollMarquee speedMs={30000} pauseOnPress>
  <View style={{ flexDirection: 'row', gap: 16 }}>
    {items.map(item => <ItemComponent key={item.id} {...item} />)}
  </View>
</ScrollMarquee>

// Reverse direction
<ScrollMarquee speedMs={20000} reverse>
  <View style={{ flexDirection: 'row', gap: 24 }}>
    {/* Your content */}
  </View>
</ScrollMarquee>
```

## 🎨 Theme & Colors

### useTheme Hook

```tsx
import { useTheme } from '@/ui/theme/ThemeProvider';

function MyComponent() {
  const { mode, setMode, colors, resolvedTheme, tokens } = useTheme();

  return (
    <View style={{ backgroundColor: colors.background }}>
      <Text style={{ color: colors.foreground }}>
        Current theme: {resolvedTheme}
      </Text>
      
      <Button onPress={() => setMode('dark')}>
        Switch to Dark
      </Button>
    </View>
  );
}
```

### Available Colors

```tsx
colors.primary           // #7C3AED
colors.primaryLight      // #A78BFA
colors.primaryGlow       // #DDD6FE
colors.primaryForeground // #FFFFFF
colors.background        // Light/Dark adaptive
colors.foreground        // Light/Dark adaptive
colors.card              // Light/Dark adaptive
colors.muted             // Light/Dark adaptive
colors.mutedForeground   // Light/Dark adaptive
colors.border            // Light/Dark adaptive
colors.input             // Light/Dark adaptive
colors.destructive       // Light/Dark adaptive
colors.success           // #25D366
colors.ring              // #7C3AED
```

### ThemeToggle

Pre-built component for switching themes.

```tsx
// Default (shows "Light", "System", "Dark")
<ThemeToggle />

// Compact (shows "L", "S", "D")
<ThemeToggle compact />
```

### ThemedView & ThemedText

Components that automatically use theme colors.

```tsx
<ThemedView style={styles.container}>
  <ThemedText variant="default">
    Regular text
  </ThemedText>
  <ThemedText variant="muted">
    Muted text
  </ThemedText>
</ThemedView>
```

## 📐 Design Tokens

### Direct Token Access

```tsx
import { tokens } from '@/theme';

<View style={{
  padding: tokens.spacing[4],        // 16px
  borderRadius: tokens.radius.lg,    // 8px
  backgroundColor: tokens.colors.primary,
}}>
  <Text style={{
    fontSize: tokens.font.sizes.h2,      // 36px
    fontWeight: tokens.font.weights.bold, // 700
    lineHeight: tokens.font.sizes.h2 * tokens.font.lineHeights.tight,
  }}>
    Custom Component
  </Text>
</View>
```

### Shadows

```tsx
import { getShadow } from '@/theme';

<View style={{
  ...getShadow('primary'),  // Violet shadow
  borderRadius: 8,
  backgroundColor: '#FFF',
}}>
  {/* Content */}
</View>

// Available shadows:
// 'card', 'primary', 'hover', 'premium', 'premiumHover'
```

### Gradients

```tsx
import { LinearGradient } from 'expo-linear-gradient';
import { getHeroGradient } from '@/theme';

const gradientProps = getHeroGradient();

<LinearGradient
  colors={gradientProps.colors}
  start={gradientProps.start}
  end={gradientProps.end}
  style={{ padding: 32, borderRadius: 16 }}
>
  <Text style={{ color: '#FFF', fontSize: 24 }}>
    Hero Section
  </Text>
</LinearGradient>

// Available gradients:
// getHeroGradient(), getCardGradient(), getPremiumGradient()
```

## 📱 Responsive Patterns

### Screen Width Conditional

```tsx
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const isMobile = width < 768;

<Text style={{
  fontSize: isMobile ? tokens.font.sizes.heroMobile : tokens.font.sizes.h1,
}}>
  Responsive Text
</Text>
```

### Platform Specific

```tsx
import { Platform } from 'react-native';

<View style={{
  ...Platform.select({
    ios: getShadow('primary'),
    android: { elevation: 6 },
    web: { boxShadow: '0 10px 30px rgba(124,58,237,0.3)' },
  }),
}}>
  {/* Content */}
</View>
```

## 🎯 Common Patterns

### Form Layout

```tsx
<View style={{ gap: tokens.spacing[4], padding: tokens.spacing[4] }}>
  <Input
    label="Name"
    placeholder="Your name"
  />
  <Input
    label="Email"
    placeholder="your@email.com"
  />
  <Textarea
    label="Message"
    placeholder="Your message..."
  />
  <Button variant="cta" onPress={handleSubmit}>
    Submit
  </Button>
</View>
```

### Card Grid

```tsx
<View style={{
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: tokens.spacing[4],
  padding: tokens.spacing[4],
}}>
  {items.map(item => (
    <Card key={item.id} variant="violet" style={{ flex: 1, minWidth: 300 }}>
      <CardHeader>
        <CardTitle>{item.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Text>{item.description}</Text>
      </CardContent>
    </Card>
  ))}
</View>
```

### Hero Section

```tsx
<LinearGradient {...getHeroGradient()} style={{ padding: tokens.spacing[16] }}>
  <Text style={{
    fontSize: tokens.font.sizes.h1,
    fontWeight: tokens.font.weights.extrabold,
    color: '#FFFFFF',
    marginBottom: tokens.spacing[6],
    textAlign: 'center',
  }}>
    Welcome to Flowli
  </Text>
  
  <Button variant="cta" onPress={handleCTA}>
    Get Started
  </Button>
</LinearGradient>
```

---

**Flowli Design System**  
*All components follow the Flowli charter specifications for colors, spacing, typography, and interactions.*

