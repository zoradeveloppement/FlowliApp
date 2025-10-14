import React from 'react';
import { ScrollView, View, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, Clock, CheckCircle, TrendingUp, Zap } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

// Components
import {
  HeroSection,
  PrimaryCTA,
  ArgumentsBadges,
  FeatureCard,
  FeaturesList,
  ClientLogos,
  WhatsAppFAB,
  LoginPrompt,
} from '@/src/components/onboarding';

// Constants
import { tokens } from '@/src/theme/tokens';
import { ONBOARDING_CONTENT, ONBOARDING_LINKS } from '@/src/constants/onboarding';
import { useFadeInDelayed } from '@/src/animations';
import { Animated } from 'react-native';

const ICON_MAP = {
  Clock,
  CheckCircle,
  TrendingUp,
  Zap,
};

export default function OnboardingScreen() {
  // Animations pour les CTA et badges
  const ctaAnim = useFadeInDelayed({ delay: 900 });
  const badgesAnim = useFadeInDelayed({ delay: 1200 });

  return (
    <>
      <StatusBar style="light" />
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          bounces={true}
        >
          {/* Hero Section avec gradient violet */}
          <LinearGradient
            colors={tokens.gradients.hero}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroWrapper}
          >
            <HeroSection />

            {/* CTA Buttons */}
            <Animated.View style={[styles.ctaContainer, ctaAnim]}>
              <PrimaryCTA
                label={ONBOARDING_CONTENT.cta.primary}
                url={ONBOARDING_LINKS.calendly}
                variant="primary"
                icon={Calendar}
                accessibilityLabel="Réserver un appel gratuit"
                accessibilityHint="Ouvre la page de réservation Cal.com"
              />
              <PrimaryCTA
                label={ONBOARDING_CONTENT.cta.secondary}
                url={ONBOARDING_LINKS.whatsapp}
                variant="secondary"
                accessibilityLabel="Nous contacter sur WhatsApp"
                accessibilityHint="Ouvre WhatsApp pour discuter de votre projet"
              />
            </Animated.View>

            {/* Arguments badges */}
            <Animated.View style={badgesAnim}>
              <ArgumentsBadges />
            </Animated.View>
          </LinearGradient>

          {/* Bénéfices clés (grid 2x2) */}
          <View style={styles.section}>
            <View style={styles.benefitsGrid}>
              {ONBOARDING_CONTENT.benefits.map((benefit, index) => {
                const IconComponent = ICON_MAP[benefit.icon as keyof typeof ICON_MAP];
                return (
                  <View key={index} style={styles.benefitCardWrapper}>
                    <FeatureCard
                      icon={IconComponent}
                      title={benefit.title}
                      description={benefit.description}
                      index={index}
                    />
                  </View>
                );
              })}
            </View>
          </View>

          {/* Features détaillées */}
          <View style={styles.section}>
            <FeaturesList />
          </View>

          {/* Preuve sociale - Logos clients */}
          <View style={[styles.section, styles.socialSection]}>
            <ClientLogos />
          </View>

          {/* Login prompt */}
          <View style={styles.section}>
            <LoginPrompt />
          </View>

          {/* Spacer pour le FAB */}
          <View style={{ height: 80 }} />
        </ScrollView>

        {/* WhatsApp FAB flottant */}
        <WhatsAppFAB />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.backgroundLight,
  },
  scrollContent: {
    flexGrow: 1,
  },
  heroWrapper: {
    paddingBottom: 0,
  },
  ctaContainer: {
    paddingHorizontal: tokens.spacing[6],
    paddingVertical: tokens.spacing[6],
    gap: tokens.spacing[3],
  },
  section: {
    backgroundColor: tokens.colors.backgroundLight,
  },
  benefitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: tokens.spacing[6],
    paddingTop: tokens.spacing[8],
    paddingBottom: tokens.spacing[4],
    gap: tokens.spacing[4],
  },
  benefitCardWrapper: {
    width: Platform.OS === 'web' ? 'calc(50% - 8px)' : '47%',
  },
  socialSection: {
    paddingVertical: tokens.spacing[4],
  },
});

