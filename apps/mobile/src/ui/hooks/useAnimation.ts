import { useRef, useEffect } from 'react';
import { Animated, Platform } from 'react-native';

export const useFadeIn = (duration = 300) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration,
      useNativeDriver: true,
    }).start();
  }, [opacity, duration]);

  return opacity;
};

export const useSlideIn = (direction: 'up' | 'down' | 'left' | 'right' = 'up', duration = 300) => {
  const translateValue = useRef(new Animated.Value(
    direction === 'up' ? 50 : 
    direction === 'down' ? -50 :
    direction === 'left' ? 50 : -50
  )).current;

  useEffect(() => {
    Animated.timing(translateValue, {
      toValue: 0,
      duration,
      useNativeDriver: true,
    }).start();
  }, [translateValue, duration]);

  return translateValue;
};

export const useBounce = (duration = 300) => {
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      tension: 100,
      friction: 3,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  return scale;
};

export const usePulse = (duration = 1000) => {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const createPulse = () => {
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.1,
          duration: duration / 2,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: duration / 2,
          useNativeDriver: true,
        }),
      ]).start(() => createPulse());
    };

    createPulse();
  }, [pulse, duration]);

  return pulse;
};
