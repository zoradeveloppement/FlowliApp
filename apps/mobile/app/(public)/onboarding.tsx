import React from 'react';
import { ScrollView, View, StyleSheet, Platform, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, Clock, CheckCircle, TrendingUp, Zap, MessageCircle } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import StickyBottomActions from '../../components/StickyBottomActions';

// Components
import {
  HeroSection,
  PrimaryCTA,
  ArgumentsBadges,
  FeatureCard,
  FeaturesList,
  ClientLogos,
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
          contentContainerStyle={[styles.scrollContent, { paddingBottom: 96 }]}
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

          {/* WhatsApp button intégré */}
          <View style={styles.whatsappSection}>
            <TouchableOpacity
              style={styles.whatsappButton}
              onPress={async () => {
                try {
                  const { Linking } = await import('react-native');
                  const { ONBOARDING_LINKS } = await import('@/src/constants/onboarding');
                  const canOpen = await Linking.canOpenURL(ONBOARDING_LINKS.whatsapp);
                  if (canOpen) {
                    await Linking.openURL(ONBOARDING_LINKS.whatsapp);
                  }
                } catch (error) {
                  console.error('Error opening WhatsApp:', error);
                }
              }}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Contacter sur WhatsApp"
              accessibilityHint="Ouvre WhatsApp pour discuter de votre projet"
              activeOpacity={0.8}
            >
              <View style={styles.whatsappButtonContent}>
                <MessageCircle size={20} color="#FFFFFF" strokeWidth={2} />
                <Text style={styles.whatsappButtonText}>Discuter sur WhatsApp</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Spacer pour les boutons sticky */}
          <View style={{ height: 80 }} />
        </ScrollView>
        
        {/* Sticky Bottom Actions */}
        <StickyBottomActions
          items={[
            { key: "book",  label: "Prendre RDV", iconName: "CalendarClock", href: "/call", testID: "onboarding-book" },
            { key: "login", label: "Se connecter", iconName: "LogIn",         href: "/(auth)/login", testID: "onboarding-login" },
          ]}
          elevated
          hideWhenKeyboardShown
        />
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
  whatsappSection: {
    paddingHorizontal: tokens.spacing[6],
    paddingVertical: tokens.spacing[4],
    alignItems: 'center',
  },
  whatsappButton: {
    backgroundColor: tokens.colors.success,
    borderRadius: tokens.radius.full,
    paddingHorizontal: tokens.spacing[6],
    paddingVertical: tokens.spacing[4],
    shadowColor: tokens.colors.success,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  whatsappButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacing[3],
  },
  whatsappButtonText: {
    color: '#FFFFFF',
    fontSize: tokens.font.sizes.md,
    fontWeight: tokens.font.weights.semibold,
  },
});

