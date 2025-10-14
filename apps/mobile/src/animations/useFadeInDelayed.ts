import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

interface UseFadeInDelayedOptions {
  delay?: number;
  duration?: number;
  translateY?: number;
}

/**
 * Hook d'animation fade-in avec delay et translateY
 * Utilisé pour le hero et les sections de l'onboarding
 */
export const useFadeInDelayed = ({
  delay = 0,
  duration = 600,
  translateY = 20,
}: UseFadeInDelayedOptions = {}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(translateY)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateYAnim, duration, delay]);

  return {
    opacity,
    transform: [{ translateY: translateYAnim }],
  };
};

