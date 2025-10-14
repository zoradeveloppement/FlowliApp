# Flowli Design System - Installation & Usage Guide

## 📦 Installation

### Required Dependencies

The following packages need to be installed:

```bash
# Install missing dependencies
cd apps/mobile
npm install clsx tailwind-merge tailwindcss-animate

# Already installed (verify):
# - nativewind@4.2.1
# - tailwindcss@3.4.18
# - lucide-react-native
# - expo-linear-gradient
# - react-native-svg
# - @react-native-async-storage/async-storage
```

### Configuration

#### 1. Babel Configuration ✅

Already configured in `babel.config.js`:
```js
presets: [
  ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
  'nativewind/babel',
]
```

#### 2. Tailwind Configuration ✅

Updated in `tailwind.config.js` with Flowli charter values:
- Primary color: `#7C3AED`
- Border radius: sm(4), md(6), lg(8), xl(12), 2xl(16), 3xl(24), full
- Spacing: 4px scale (0-32)
- Shadows: card, primary, hover, premium, premiumHover
- Animations: ping, fadeInDelayed, scroll

#### 3. Theme Provider ✅

The app is wrapped with `ThemeProvider` in `app/_layout.tsx`:
```tsx
import { ThemeProvider } from '../src/ui/theme/ThemeProvider';

<ThemeProvider>
  {/* Your app */}
</ThemeProvider>
```

## 🎨 Design System Structure

```
apps/mobile/
├── src/
│   ├── theme/
│   │   ├── tokens.ts              # Design tokens (colors, spacing, typography)
│   │   ├── gradients.ts           # Gradient helpers for LinearGradient
│   │   ├── motion.ts              # Animation durations and easing
│   │   ├── getShadow.ts           # Platform-specific shadow resolver
│   │   └── globals.nativewind.css # NativeWind class reference
│   ├── ui/
│   │   └── theme/
│   │       └── ThemeProvider.tsx  # Theme context & dark mode
│   ├── components/
│   │   └── ui/
│   │       ├── AppIcon.tsx        # Icon mapping (12 Lucide icons)
│   │       ├── Button.tsx         # 6 variants, 5 sizes
│   │       ├── Input.tsx          # Input + Textarea
│   │       ├── Card.tsx           # 3 variants + slots
│   │       └── Badge.tsx          # 2 variants
│   └── animations/
│       ├── Ping.tsx               # Pulsing glow effect
│       ├── FadeInDelayed.tsx      # Fade in with slide up
│       └── ScrollMarquee.tsx      # Horizontal scroll loop
└── app/
    └── (design)/
        ├── _layout.tsx
        └── showcase.tsx           # Full component showcase
```

## 🚀 Usage

### Accessing the Showcase

Navigate to the design showcase screen:

```tsx
import { router } from 'expo-router';

// In your component
router.push('/(design)/showcase');
```

Or add a button in your app:
```tsx
<Button onPress={() => router.push('/(design)/showcase')}>
  View Design System
</Button>
```

### Using Components

```tsx
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { AppIcon } from '@/components/ui/AppIcon';
import { useTheme } from '@/ui/theme/ThemeProvider';

function MyScreen() {
  const { colors } = useTheme();

  return (
    <View style={{ backgroundColor: colors.background }}>
      <Card variant="violet">
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
        </CardHeader>
        <CardContent>
          <Input label="Email" placeholder="you@example.com" />
          <Button variant="cta" onPress={() => {}}>
            Submit
          </Button>
        </CardContent>
      </Card>

      <Badge variant="primary" icon="check">
        Active
      </Badge>

      <AppIcon name="calendar" size={24} color={colors.primary} />
    </View>
  );
}
```

### Theme & Dark Mode

```tsx
import { useTheme, ThemeToggle } from '@/ui/theme/ThemeProvider';

function MyComponent() {
  const { mode, setMode, colors, resolvedTheme } = useTheme();

  return (
    <View>
      {/* Current theme info */}
      <Text>Mode: {mode}</Text>
      <Text>Resolved: {resolvedTheme}</Text>

      {/* Manual theme control */}
      <Button onPress={() => setMode('dark')}>Dark</Button>
      <Button onPress={() => setMode('light')}>Light</Button>
      <Button onPress={() => setMode('system')}>System</Button>

      {/* Or use the toggle component */}
      <ThemeToggle />
    </View>
  );
}
```

### Using Animations

```tsx
import { Ping } from '@/animations/Ping';
import { FadeInDelayed } from '@/animations/FadeInDelayed';
import { ScrollMarquee } from '@/animations/ScrollMarquee';

function AnimatedScreen() {
  return (
    <View>
      {/* Ping effect (WhatsApp style) */}
      <Ping color="#25D366" size={40} />

      {/* Fade in with delay */}
      <FadeInDelayed delay={500} duration={600}>
        <Card>
          <CardContent>
            <Text>This fades in smoothly</Text>
          </CardContent>
        </Card>
      </FadeInDelayed>

      {/* Scrolling marquee */}
      <ScrollMarquee speedMs={30000} pauseOnPress>
        <View style={{ flexDirection: 'row', gap: 16 }}>
          {logos.map(logo => <Image key={logo.id} source={logo.src} />)}
        </View>
      </ScrollMarquee>
    </View>
  );
}
```

### Accessing Design Tokens

```tsx
import { tokens } from '@/theme/tokens';
import { getHeroGradient } from '@/theme/gradients';
import { getShadow } from '@/theme/getShadow';

function CustomComponent() {
  const gradientProps = getHeroGradient();

  return (
    <View style={{
      padding: tokens.spacing[4],
      borderRadius: tokens.radius.lg,
      ...getShadow('primary'),
    }}>
      <LinearGradient {...gradientProps}>
        <Text style={{
          fontSize: tokens.font.sizes.h2,
          fontWeight: tokens.font.weights.bold,
        }}>
          Custom Component
        </Text>
      </LinearGradient>
    </View>
  );
}
```

## ✅ QA Checklist

Before deploying or merging design changes, verify:

### Visual Consistency
- [ ] Primary color is **#7C3AED** everywhere (not #6C63FF or other purple)
- [ ] Border radius default is **8px** (lg) for cards/buttons
- [ ] Violet shadows visible on CTA buttons and premium cards
- [ ] Gradients use correct charter colors (hero, card, premium)

### Interactions
- [ ] Button pressed states animate smoothly (~300ms)
- [ ] Scale animation on button press (0.98 scale)
- [ ] Card variants respond to press appropriately
- [ ] No janky or stuttering animations

### Accessibility
- [ ] Focus rings visible on inputs and buttons (TalkBack/VoiceOver)
- [ ] Text contrasts meet AA standards (foreground vs background)
- [ ] Interactive elements have minimum 44px touch target
- [ ] All icons have appropriate sizes (16/20/24/32)

### Functionality
- [ ] Dark mode toggles correctly (light/dark/system)
- [ ] Theme persists across app restarts (AsyncStorage)
- [ ] All icon names resolve correctly
- [ ] Animations run smoothly on physical devices

### Responsive
- [ ] Typography scales properly on different screen sizes
- [ ] Layouts adapt to mobile/tablet/web
- [ ] Cards and buttons remain usable on small screens
- [ ] Hero text uses responsive sizing (24-36px mobile)

### Platform-Specific
- [ ] **iOS**: Shadows display with violet tint
- [ ] **Android**: Elevation approximates shadows appropriately
- [ ] **Web**: All components render without errors
- [ ] Gradients work on all platforms

### Performance
- [ ] No performance warnings in console
- [ ] Animations use `useNativeDriver: true` where possible
- [ ] No unnecessary re-renders
- [ ] Theme loading doesn't cause flash

## 🎯 Design Tokens Reference

### Colors
```ts
Primary:           #7C3AED
Primary Light:     #A78BFA
Primary Glow:      #DDD6FE
Success:           #25D366
Destructive Light: #F87171
Destructive Dark:  #DC2626
```

### Typography
```ts
Font Sizes:  xs(12) sm(14) md(16) lg(20) xl(24) h3(24) h2(36) h1(60)
Weights:     regular(400) medium(500) semibold(600) bold(700) extrabold(800)
Line Heights: tight(1.25) normal(1.5) relaxed(1.75) hero(1.06)
```

### Spacing (4px scale)
```ts
0→32: 0, 4, 8, 12, 16, 24, 32, 48, 64, 80, 96, 128 (pixels)
```

### Border Radius
```ts
sm(4) md(6) lg(8) xl(12) 2xl(16) 3xl(24) full(9999)
```

### Shadows
```ts
card, primary, hover, premium, premiumHover
iOS: parsed shadowColor/shadowOpacity/shadowRadius/shadowOffset
Android: elevation 2/6/10/5/8
```

### Motion
```ts
Durations: fast(150) normal(200) smooth(300) slow(600) typing(800)
Easings:   smooth, in, out, inOut (cubic-bezier)
```

## 🔧 Troubleshooting

### Theme not loading
- Verify `ThemeProvider` wraps your app in `app/_layout.tsx`
- Check AsyncStorage permissions
- Clear app cache and restart

### Colors not updating in dark mode
- Use `colors` from `useTheme()` hook, not hardcoded values
- Ensure `resolvedTheme` is being used, not just `mode`

### Shadows not visible on Android
- Android uses `elevation` instead of shadow properties
- Check `getShadow()` implementation
- Elevation values: card(2), primary(6), hover(10)

### Icons not displaying
- Verify icon name matches `IconName` type
- Check `lucide-react-native` is installed
- Ensure correct import path

### Animations choppy
- Verify `useNativeDriver: true` is set (where supported)
- Test on physical device, not just simulator
- Check for unnecessary re-renders

## 📚 Additional Resources

- **Flowli Charter**: `/CHARTE-GRAPHIQUE.md` (1400+ lines)
- **Tokens Source**: `apps/mobile/src/theme/tokens.ts`
- **Component Examples**: `apps/mobile/app/(design)/showcase.tsx`
- **Lucide Icons**: https://lucide.dev

## 🎨 Next Steps

1. Review the showcase at `/(design)/showcase`
2. Test dark mode toggle
3. Verify all QA checklist items
4. Integrate components into your actual screens
5. Customize as needed while maintaining charter values

---

**Flowli Design System v1.0**  
*Cohérence visuelle garantie sur iOS, Android et Web*

