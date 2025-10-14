import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { CheckCircle } from 'lucide-react-native';
import { ONBOARDING_CONTENT } from '@/src/constants/onboarding';
import { tokens } from '@/src/theme/tokens';
import { useFadeInDelayed } from '@/src/animations';

export const HeroSection = () => {
  const badgeAnim = useFadeInDelayed({ delay: 0 });
  const titleAnim = useFadeInDelayed({ delay: 300 });
  const subtitleAnim = useFadeInDelayed({ delay: 600 });

  return (
    <View style={styles.container}>
      {/* Badge confiance */}
      <Animated.View style={[styles.badge, badgeAnim]}>
        <CheckCircle size={16} color={tokens.colors.primary} strokeWidth={2} />
        <Text style={styles.badgeText}>{ONBOARDING_CONTENT.hero.badge}</Text>
      </Animated.View>

      {/* Titre H1 */}
      <Animated.View style={titleAnim}>
        <Text style={styles.title}>{ONBOARDING_CONTENT.hero.title}</Text>
      </Animated.View>

      {/* Sous-texte */}
      <Animated.View style={subtitleAnim}>
        <Text style={styles.subtitle}>
          {ONBOARDING_CONTENT.hero.subtitle}{' '}
          <Text style={styles.highlight}>{ONBOARDING_CONTENT.hero.subtitleHighlight1}</Text>{' '}
          {ONBOARDING_CONTENT.hero.subtitleEnd}{' '}
          <Text style={styles.highlight}>{ONBOARDING_CONTENT.hero.subtitleHighlight2}</Text>.
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: tokens.spacing[6],
    paddingTop: tokens.spacing[12],
    paddingBottom: tokens.spacing[8],
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
    paddingHorizontal: tokens.spacing[4],
    paddingVertical: tokens.spacing[2],
    borderRadius: tokens.radius.full,
    gap: tokens.spacing[2],
    marginBottom: tokens.spacing[6],
  },
  badgeText: {
    fontSize: tokens.font.sizes.sm,
    fontWeight: tokens.font.weights.medium,
    color: tokens.colors.primary,
  },
  title: {
    fontSize: tokens.font.sizes.h2,
    fontWeight: tokens.font.weights.extrabold,
    color: tokens.colors.primaryForeground,
    lineHeight: tokens.font.lineHeights.tight * tokens.font.sizes.h2,
    marginBottom: tokens.spacing[4],
  },
  subtitle: {
    fontSize: tokens.font.sizes.md,
    fontWeight: tokens.font.weights.regular,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: tokens.font.lineHeights.normal * tokens.font.sizes.md,
  },
  highlight: {
    fontWeight: tokens.font.weights.bold,
    color: tokens.colors.primaryForeground,
  },
});

