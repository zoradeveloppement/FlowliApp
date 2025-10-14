import React, { useRef } from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  Animated, 
  Linking, 
  GestureResponderEvent,
  View 
} from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { tokens } from '@/src/theme/tokens';
import { markOnboardingAsSeen } from '@/src/lib/onboarding';

interface PrimaryCTAProps {
  label: string;
  url: string;
  variant?: 'primary' | 'secondary';
  icon?: LucideIcon;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export const PrimaryCTA = ({
  label,
  url,
  variant = 'primary',
  icon: Icon,
  accessibilityLabel,
  accessibilityHint,
}: PrimaryCTAProps) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = async (event: GestureResponderEvent) => {
    event.preventDefault();
    
    // Marquer l'onboarding comme vu quand l'utilisateur interagit avec un CTA
    await markOnboardingAsSeen();
    
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      }
    } catch (error) {
      console.error('Error opening URL:', error);
    }
  };

  const isPrimary = variant === 'primary';

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[styles.button, isPrimary ? styles.buttonPrimary : styles.buttonSecondary]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || label}
        accessibilityHint={accessibilityHint}
        activeOpacity={0.9}
      >
        <View style={styles.content}>
          {Icon && (
            <Icon
              size={20}
              color={isPrimary ? tokens.colors.primaryForeground : tokens.colors.primary}
              strokeWidth={2}
            />
          )}
          <Text style={[styles.buttonText, isPrimary ? styles.textPrimary : styles.textSecondary]}>
            {label}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: tokens.radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  buttonPrimary: {
    backgroundColor: tokens.colors.primaryForeground,
    shadowColor: tokens.colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing[2],
  },
  buttonText: {
    fontSize: tokens.font.sizes.md,
    fontWeight: tokens.font.weights.semibold,
  },
  textPrimary: {
    color: tokens.colors.primary,
  },
  textSecondary: {
    color: tokens.colors.primaryForeground,
  },
});

