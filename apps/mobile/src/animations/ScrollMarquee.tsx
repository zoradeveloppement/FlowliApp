/**
 * ScrollMarquee Animation - Flowli Design System
 * Horizontal scrolling animation for logos/content
 */
import React, { useEffect, useRef } from 'react';
import { Animated, View, ViewStyle, Easing } from 'react-native';

export interface ScrollMarqueeProps {
  children: React.ReactNode;
  speedMs?: number;
  reverse?: boolean;
  pauseOnPress?: boolean;
  style?: ViewStyle;
}

export const ScrollMarquee: React.FC<ScrollMarqueeProps> = ({
  children,
  speedMs = 40000,
  reverse = false,
  pauseOnPress = false,
  style,
}) => {
  const translateAnim = useRef(new Animated.Value(reverse ? -50 : 0)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    const startAnimation = () => {
      translateAnim.setValue(reverse ? -50 : 0);
      
      animationRef.current = Animated.loop(
        Animated.timing(translateAnim, {
          toValue: reverse ? 0 : -50,
          duration: speedMs,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );

      animationRef.current.start();
    };

    startAnimation();

    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
    };
  }, [translateAnim, speedMs, reverse]);

  const handlePressIn = () => {
    if (pauseOnPress && animationRef.current) {
      // Note: React Native Animated doesn't support pause, so we stop/restart
      animationRef.current.stop();
    }
  };

  const handlePressOut = () => {
    if (pauseOnPress) {
      // Restart animation
      if (animationRef.current) {
        animationRef.current.start();
      }
    }
  };

  return (
    <View
      style={[
        {
          overflow: 'hidden',
          flexDirection: 'row',
        },
        style,
      ]}
      onTouchStart={pauseOnPress ? handlePressIn : undefined}
      onTouchEnd={pauseOnPress ? handlePressOut : undefined}
    >
      <Animated.View
        style={{
          flexDirection: 'row',
          transform: [
            {
              translateX: translateAnim.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
            },
          ],
        }}
      >
        {children}
      </Animated.View>
    </View>
  );
};

