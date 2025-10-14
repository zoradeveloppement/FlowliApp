/**
 * Design System Showcase - Flowli
 * Comprehensive demonstration of all design components
 */
import React from 'react';
import { ScrollView, View, Text, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../src/ui/theme/ThemeProvider';
import { tokens } from '../../src/theme/tokens';
import { getHeroGradient } from '../../src/theme/gradients';
import { Button } from '../../src/components/ui/Button';
import { Input, Textarea } from '../../src/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../src/components/ui/Card';
import { Badge } from '../../src/components/ui/Badge';
import { AppIcon, IconName } from '../../src/components/ui/AppIcon';
import { Ping } from '../../src/animations/Ping';
import { FadeInDelayed } from '../../src/animations/FadeInDelayed';
import { ScrollMarquee } from '../../src/animations/ScrollMarquee';
import { resetOnboarding, markOnboardingAsSeen, hasSeenOnboarding } from '../../src/lib/onboarding';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import { TestComponents } from '../../src/ui/components/mobile/TestComponents';

const { width } = Dimensions.get('window');

export default function ShowcaseScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const allIcons: IconName[] = [
    'calendar', 'check', 'checkCircle', 'clock', 
    'trendingUp', 'shield', 'zap', 'menu', 
    'x', 'chevronDown', 'user', 'search'
  ];

  const handleResetOnboarding = async () => {
    await resetOnboarding();
    Alert.alert(
      'Onboarding réinitialisé',
      "L'onboarding sera affiché au prochain démarrage de l'app.",
      [
        {
          text: 'OK',
          style: 'default',
        },
        {
          text: 'Voir maintenant',
          onPress: () => router.push('/(public)/onboarding'),
        },
      ]
    );
  };

  const handleCheckOnboardingStatus = async () => {
    const hasSeen = await hasSeenOnboarding();
    Alert.alert(
      'Statut Onboarding',
      hasSeen
        ? "✅ L'onboarding a déjà été vu"
        : "❌ L'onboarding n'a pas encore été vu"
    );
  };

  const handleMarkAsSeenOnboarding = async () => {
    await markOnboardingAsSeen();
    Alert.alert('Onboarding marqué', "L'onboarding a été marqué comme vu.");
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: tokens.spacing[16] }}
    >
      {/* Hero Section */}
      <LinearGradient
        {...getHeroGradient()}
        style={{
          padding: tokens.spacing[8],
          alignItems: 'center',
          marginBottom: tokens.spacing[8],
        }}
      >
        <Text
          style={{
            fontSize: width < 768 ? tokens.font.sizes.heroMobile : tokens.font.sizes.h2,
            fontWeight: tokens.font.weights.extrabold,
            color: '#FFFFFF',
            textAlign: 'center',
            marginBottom: tokens.spacing[4],
            lineHeight: width < 768 ? 32 : 42,
          }}
        >
          Flowli Design System
        </Text>
        <Text
          style={{
            fontSize: tokens.font.sizes.md,
            color: '#FFFFFF',
            opacity: 0.9,
            textAlign: 'center',
            marginBottom: tokens.spacing[6],
          }}
        >
          Une identité visuelle moderne et cohérente
        </Text>
        <Button variant="cta" onPress={() => console.log('CTA pressed')}>
          Réserver un appel
        </Button>
      </LinearGradient>

      {/* Section: Buttons */}
      <Section title="Buttons" colors={colors}>
        <Text style={sectionSubtitle(colors)}>Variants</Text>
        <View style={{ gap: tokens.spacing[3] }}>
          <Button variant="default" onPress={() => {}}>Default Button</Button>
          <Button variant="hero" onPress={() => {}}>Hero Button</Button>
          <Button variant="cta" onPress={() => {}}>CTA Button</Button>
          <Button variant="outline" onPress={() => {}}>Outline Button</Button>
          <Button variant="ghost" onPress={() => {}}>Ghost Button</Button>
          <Button variant="destructive" onPress={() => {}}>Destructive</Button>
        </View>

        <Text style={[sectionSubtitle(colors), { marginTop: tokens.spacing[6] }]}>Sizes</Text>
        <View style={{ gap: tokens.spacing[3] }}>
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="xl">Extra Large</Button>
          <Button size="icon">
            <AppIcon name="search" color="#FFFFFF" />
          </Button>
        </View>

        <Text style={[sectionSubtitle(colors), { marginTop: tokens.spacing[6] }]}>States</Text>
        <View style={{ gap: tokens.spacing[3] }}>
          <Button disabled>Disabled Button</Button>
        </View>
      </Section>

      {/* Section: Cards */}
      <Section title="Cards" colors={colors}>
        <View style={{ gap: tokens.spacing[4] }}>
          {/* Default Card */}
          <Card variant="default">
            <CardHeader>
              <CardTitle>Default Card</CardTitle>
              <CardDescription>Standard card with border and shadow</CardDescription>
            </CardHeader>
            <CardContent>
              <Text style={{ color: colors.foreground }}>
                This is the default card variant used throughout the app.
              </Text>
            </CardContent>
            <CardFooter>
              <Badge variant="primary" icon="check">
                Standard
              </Badge>
            </CardFooter>
          </Card>

          {/* Violet Card */}
          <Card variant="violet" onPress={() => console.log('Violet card pressed')}>
            <CardHeader>
              <CardTitle>Violet Card</CardTitle>
              <CardDescription>Interactive card with primary border</CardDescription>
            </CardHeader>
            <CardContent>
              <Text style={{ color: colors.foreground }}>
                Press me to see the shadow animation effect.
              </Text>
            </CardContent>
            <CardFooter>
              <Badge variant="primary" icon="zap">
                Interactive
              </Badge>
            </CardFooter>
          </Card>

          {/* Premium Card */}
          <Card variant="premium">
            <CardHeader>
              <CardTitle>Premium Card</CardTitle>
              <CardDescription>Gradient background with premium styling</CardDescription>
            </CardHeader>
            <CardContent>
              <Text style={{ color: colors.foreground }}>
                Premium card with gradient background from the charter.
              </Text>
            </CardContent>
            <CardFooter>
              <Badge variant="success" icon="shield">
                Premium
              </Badge>
            </CardFooter>
          </Card>
        </View>
      </Section>

      {/* Section: Forms */}
      <Section title="Form Inputs" colors={colors}>
        <View style={{ gap: tokens.spacing[4] }}>
          <Input
            label="Email"
            placeholder="votre@email.com"
            helperText="Nous ne partagerons jamais votre email"
          />
          
          <Input
            label="Password"
            placeholder="••••••••"
            secureTextEntry
            error
            errorText="Le mot de passe doit contenir au moins 8 caractères"
          />

          <Textarea
            label="Message"
            placeholder="Votre message..."
            helperText="Décrivez votre projet en quelques mots"
          />
        </View>
      </Section>

      {/* Section: Badges */}
      <Section title="Badges" colors={colors}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: tokens.spacing[3] }}>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="primary" icon="check">With Icon</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="success" icon="checkCircle">+50 entreprises</Badge>
        </View>
      </Section>

      {/* Section: Icons */}
      <Section title="Icons" colors={colors}>
        <Text style={sectionSubtitle(colors)}>Size: 20px</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: tokens.spacing[4], marginBottom: tokens.spacing[6] }}>
          {allIcons.map((icon) => (
            <View key={`${icon}-20`} style={{ alignItems: 'center', width: 60 }}>
              <AppIcon name={icon} size={20} />
              <Text style={{ fontSize: 10, color: colors.mutedForeground, marginTop: 4 }}>{icon}</Text>
            </View>
          ))}
        </View>

        <Text style={sectionSubtitle(colors)}>Size: 24px</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: tokens.spacing[4], marginBottom: tokens.spacing[6] }}>
          {allIcons.map((icon) => (
            <View key={`${icon}-24`} style={{ alignItems: 'center', width: 60 }}>
              <AppIcon name={icon} size={24} />
            </View>
          ))}
        </View>

        <Text style={sectionSubtitle(colors)}>Size: 32px</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: tokens.spacing[4] }}>
          {allIcons.slice(0, 6).map((icon) => (
            <View key={`${icon}-32`} style={{ alignItems: 'center', width: 80 }}>
              <AppIcon name={icon} size={32} />
            </View>
          ))}
        </View>
      </Section>

      {/* Section: Animations */}
      <Section title="Animations" colors={colors}>
        <Text style={sectionSubtitle(colors)}>Ping Effect</Text>
        <View style={{ flexDirection: 'row', gap: tokens.spacing[6], marginBottom: tokens.spacing[8] }}>
          <Ping color={colors.success} size={40} />
          <Ping color={colors.primary} size={40} />
        </View>

        <Text style={sectionSubtitle(colors)}>Fade In Delayed</Text>
        <FadeInDelayed delay={300} duration={600}>
          <Card variant="violet">
            <CardContent>
              <Text style={{ color: colors.foreground, textAlign: 'center' }}>
                This card faded in with animation
              </Text>
            </CardContent>
          </Card>
        </FadeInDelayed>

        <Text style={[sectionSubtitle(colors), { marginTop: tokens.spacing[8] }]}>Scroll Marquee</Text>
        <ScrollMarquee speedMs={10000} pauseOnPress>
          <View style={{ flexDirection: 'row', gap: tokens.spacing[8], paddingVertical: tokens.spacing[4] }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <View
                key={i}
                style={{
                  width: 100,
                  height: 60,
                  backgroundColor: colors.muted,
                  borderRadius: tokens.radius.lg,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: colors.mutedForeground }}>Logo {i}</Text>
              </View>
            ))}
          </View>
        </ScrollMarquee>
      </Section>

      {/* Section: Onboarding Debug */}
      <Section title="Onboarding Debug" colors={colors}>
        <Text style={[sectionSubtitle(colors), { marginBottom: tokens.spacing[2] }]}>
          Outils de développement
        </Text>
        <View style={{ gap: tokens.spacing[3] }}>
          <Button
            variant="cta"
            onPress={() => router.push('/(public)/onboarding')}
          >
            Afficher l'onboarding
          </Button>
          <Button
            variant="default"
            onPress={handleCheckOnboardingStatus}
          >
            Vérifier le statut
          </Button>
          <Button
            variant="outline"
            onPress={handleMarkAsSeenOnboarding}
          >
            Marquer comme vu
          </Button>
          <Button
            variant="destructive"
            onPress={handleResetOnboarding}
          >
            Réinitialiser l'onboarding
          </Button>
        </View>
        <Text
          style={{
            fontSize: tokens.font.sizes.sm,
            color: colors.mutedForeground,
            marginTop: tokens.spacing[4],
            fontStyle: 'italic',
          }}
        >
          💡 Astuce : Réinitialisez l'onboarding pour le revoir comme si c'était la première visite.
        </Text>
      </Section>

      {/* Section: Colors */}
      <Section title="Color Palette" colors={colors}>
        <ColorSwatch label="Primary" color={colors.primary} />
        <ColorSwatch label="Primary Light" color={colors.primaryLight} />
        <ColorSwatch label="Primary Glow" color={colors.primaryGlow} />
        <ColorSwatch label="Success" color={colors.success} />
        <ColorSwatch label="Destructive" color={colors.destructive} />
        <ColorSwatch label="Foreground" color={colors.foreground} />
        <ColorSwatch label="Muted Foreground" color={colors.mutedForeground} />
      </Section>

      <Section title="Test Composants Mobile" colors={colors}>
        <TestComponents />
      </Section>
    </ScrollView>
  );
}

// Helper Components
const Section: React.FC<{ title: string; children: React.ReactNode; colors: any }> = ({ title, children, colors }) => (
  <View style={{ paddingHorizontal: tokens.spacing[4], marginBottom: tokens.spacing[8] }}>
    <Text
      style={{
        fontSize: tokens.font.sizes.h3,
        fontWeight: tokens.font.weights.bold,
        color: colors.foreground,
        marginBottom: tokens.spacing[4],
      }}
    >
      {title}
    </Text>
    {children}
  </View>
);

const sectionSubtitle = (colors: any) => ({
  fontSize: tokens.font.sizes.md,
  fontWeight: tokens.font.weights.semibold,
  color: colors.foreground,
  marginBottom: tokens.spacing[3],
});

const ColorSwatch: React.FC<{ label: string; color: string }> = ({ label, color }) => {
  const { colors } = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: tokens.spacing[3],
        gap: tokens.spacing[4],
      }}
    >
      <View
        style={{
          width: 50,
          height: 50,
          backgroundColor: color,
          borderRadius: tokens.radius.md,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      />
      <View>
        <Text style={{ fontSize: tokens.font.sizes.md, fontWeight: tokens.font.weights.medium, color: colors.foreground }}>
          {label}
        </Text>
        <Text style={{ fontSize: tokens.font.sizes.sm, color: colors.mutedForeground }}>
          {color}
        </Text>
      </View>
    </View>
  );
};

