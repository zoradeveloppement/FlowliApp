import React from 'react';
import { TouchableOpacity, StyleSheet, Animated, Linking, View } from 'react-native';
import { MessageCircle } from 'lucide-react-native';
import { ONBOARDING_LINKS } from '@/src/constants/onboarding';
import { tokens } from '@/src/theme/tokens';
import { usePingAnimation } from '@/src/animations';

export const WhatsAppFAB = () => {
  const { scale, opacity } = usePingAnimation();

  const handlePress = async () => {
    try {
      const canOpen = await Linking.canOpenURL(ONBOARDING_LINKS.whatsapp);
      if (canOpen) {
        await Linking.openURL(ONBOARDING_LINKS.whatsapp);
      }
    } catch (error) {
      console.error('Error opening WhatsApp:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Halo ping animé */}
      <Animated.View
        style={[
          styles.halo,
          {
            transform: [{ scale }],
            opacity,
          },
        ]}
      />
      {/* Bouton principal */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handlePress}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Contacter sur WhatsApp"
        accessibilityHint="Ouvre WhatsApp pour discuter de votre projet"
        activeOpacity={0.8}
      >
        <MessageCircle size={24} color="#FFFFFF" strokeWidth={2} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  halo: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: tokens.colors.success,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: tokens.colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: tokens.colors.success,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.55,
    shadowRadius: 15,
    elevation: 10,
  },
});

