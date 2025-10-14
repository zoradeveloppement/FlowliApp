import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Clock, CheckCircle, Shield } from 'lucide-react-native';
import { ONBOARDING_CONTENT } from '@/src/constants/onboarding';
import { tokens } from '@/src/theme/tokens';

const ICON_MAP = {
  Clock,
  CheckCircle,
  Shield,
};

export const ArgumentsBadges = () => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {ONBOARDING_CONTENT.arguments.map((arg, index) => {
        const IconComponent = ICON_MAP[arg.icon as keyof typeof ICON_MAP];
        return (
          <View key={index} style={styles.badge}>
            <IconComponent
              size={16}
              color={tokens.colors.primaryForeground}
              strokeWidth={2}
            />
            <Text style={styles.badgeText}>{arg.text}</Text>
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: tokens.spacing[6],
    gap: tokens.spacing[3],
    paddingBottom: tokens.spacing[6],
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: tokens.spacing[4],
    paddingVertical: tokens.spacing[2],
    borderRadius: tokens.radius.full,
    gap: tokens.spacing[2],
  },
  badgeText: {
    fontSize: tokens.font.sizes.sm,
    fontWeight: tokens.font.weights.medium,
    color: tokens.colors.primaryForeground,
  },
});

