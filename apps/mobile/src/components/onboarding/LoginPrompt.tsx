import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ONBOARDING_CONTENT } from '@/src/constants/onboarding';
import { tokens } from '@/src/theme/tokens';
import { markOnboardingAsSeen } from '@/src/lib/onboarding';

export const LoginPrompt = () => {
  const router = useRouter();

  const handlePress = async () => {
    // Marquer l'onboarding comme vu avant de naviguer
    await markOnboardingAsSeen();
    router.push('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>{ONBOARDING_CONTENT.login.prompt}</Text>
      <TouchableOpacity
        onPress={handlePress}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Se connecter"
        accessibilityHint="Navigue vers la page de connexion"
      >
        <Text style={styles.link}>{ONBOARDING_CONTENT.login.cta} →</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: tokens.spacing[8],
    paddingHorizontal: tokens.spacing[6],
  },
  prompt: {
    fontSize: tokens.font.sizes.md,
    fontWeight: tokens.font.weights.regular,
    color: tokens.colors.mutedForegroundLight,
    marginBottom: tokens.spacing[2],
  },
  link: {
    fontSize: tokens.font.sizes.md,
    fontWeight: tokens.font.weights.semibold,
    color: tokens.colors.primary,
    textDecorationLine: 'underline',
  },
});

