import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

/**
 * Hook d'animation ping (halo pulsant)
 * Utilisé pour le bouton WhatsApp FAB
 */
export const usePingAnimation = () => {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.75)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 1.5,
          duration: 1500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 1500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [scale, opacity]);

  return {
    scale,
    opacity,
  };
};

