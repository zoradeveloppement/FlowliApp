/**
 * FadeInDelayed Animation - Flowli Design System
 * Fades in content with an upward slide and delay
 */
import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';
import { easings } from '../theme/motion';
import { tokens } from '../theme/tokens';

export interface FadeInDelayedProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  translateY?: number;
  style?: ViewStyle;
}

export const FadeInDelayed: React.FC<FadeInDelayedProps> = ({
  children,
  delay = 800,
  duration = 600,
  translateY = 20,
  style,
}) => {
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(new Animated.Value(translateY)).current;

  useEffect(() => {
    const animation = Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration,
        delay,
        easing: easings.out,
        useNativeDriver: true,
      }),
      Animated.timing(translateAnim, {
        toValue: 0,
        duration,
        delay,
        easing: easings.out,
        useNativeDriver: true,
      }),
    ]);

    animation.start();

    return () => {
      animation.stop();
    };
  }, [opacityAnim, translateAnim, delay, duration]);

  return (
    <Animated.View
      style={[
        {
          opacity: opacityAnim,
          transform: [{ translateY: translateAnim }],
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
};

