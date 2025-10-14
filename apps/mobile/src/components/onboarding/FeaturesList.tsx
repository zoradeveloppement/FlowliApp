import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CheckCircle } from 'lucide-react-native';
import { ONBOARDING_CONTENT } from '@/src/constants/onboarding';
import { tokens } from '@/src/theme/tokens';

export const FeaturesList = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{ONBOARDING_CONTENT.features.title}</Text>
      <View style={styles.list}>
        {ONBOARDING_CONTENT.features.items.map((item, index) => (
          <View key={index} style={styles.item}>
            <CheckCircle size={20} color={tokens.colors.primary} strokeWidth={2} />
            <Text style={styles.itemText}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: tokens.spacing[6],
    paddingVertical: tokens.spacing[8],
  },
  title: {
    fontSize: tokens.font.sizes.xl,
    fontWeight: tokens.font.weights.semibold,
    color: tokens.colors.foregroundLight,
    marginBottom: tokens.spacing[6],
    lineHeight: tokens.font.lineHeights.tight * tokens.font.sizes.xl,
  },
  list: {
    gap: tokens.spacing[3],
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: tokens.spacing[3],
  },
  itemText: {
    flex: 1,
    fontSize: tokens.font.sizes.md,
    fontWeight: tokens.font.weights.regular,
    color: tokens.colors.foregroundLight,
    lineHeight: tokens.font.lineHeights.normal * tokens.font.sizes.md,
  },
});

