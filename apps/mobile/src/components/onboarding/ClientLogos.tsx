import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScrollMarquee } from '@/src/animations';
import { ONBOARDING_CONTENT, CLIENT_LOGOS } from '@/src/constants/onboarding';
import { tokens } from '@/src/theme/tokens';

export const ClientLogos = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{ONBOARDING_CONTENT.social.title}</Text>
      <ScrollMarquee speed={30} direction="left">
        <View style={styles.logosContainer}>
          {CLIENT_LOGOS.map((logo, index) => (
            <View key={index} style={styles.logoBox}>
              <Text style={styles.logoText}>{logo}</Text>
            </View>
          ))}
        </View>
      </ScrollMarquee>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: tokens.spacing[8],
  },
  title: {
    fontSize: tokens.font.sizes.xl,
    fontWeight: tokens.font.weights.semibold,
    color: tokens.colors.foregroundLight,
    textAlign: 'center',
    marginBottom: tokens.spacing[6],
  },
  logosContainer: {
    flexDirection: 'row',
    gap: tokens.spacing[6],
    paddingHorizontal: tokens.spacing[6],
  },
  logoBox: {
    backgroundColor: tokens.colors.mutedLight,
    borderRadius: tokens.radius.lg,
    paddingHorizontal: tokens.spacing[4],
    paddingVertical: tokens.spacing[3],
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: tokens.font.sizes.sm,
    fontWeight: tokens.font.weights.medium,
    color: tokens.colors.mutedForegroundLight,
    textAlign: 'center',
  },
});

