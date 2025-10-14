/**
 * Ping Animation - Flowli Design System
 * Used for pulsing/glowing effects (e.g., WhatsApp button)
 */
import React, { useEffect, useRef } from 'react';
import { Animated, View, ViewStyle } from 'react-native';
import { tokens } from '../theme/tokens';

export interface PingProps {
  color?: string;
  size?: number;
  style?: ViewStyle;
}

export const Ping: React.FC<PingProps> = ({
  color = tokens.colors.success,
  size = 40,
  style,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.75)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [scaleAnim, opacityAnim]);

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          position: 'relative',
          justifyContent: 'center',
          alignItems: 'center',
        },
        style,
      ]}
    >
      {/* Ping circle */}
      <Animated.View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }],
        }}
      />
      
      {/* Static center circle */}
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        }}
      />
    </View>
  );
};

