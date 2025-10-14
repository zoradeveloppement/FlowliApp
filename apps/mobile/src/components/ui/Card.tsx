/**
 * Card Component - Flowli Design System
 */
import React, { useRef } from 'react';
import { View, Pressable, Text, Animated, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../ui/theme/ThemeProvider';
import { getShadow, ShadowName } from '../../theme/getShadow';
import { getPremiumGradient } from '../../theme/gradients';
import { tokens } from '../../theme/tokens';

export type CardVariant = 'default' | 'violet' | 'premium';

export interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  onPress?: () => void;
  style?: ViewStyle;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  onPress,
  style,
  className,
}) => {
  const { colors } = useTheme();
  const shadowAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    if (variant === 'violet' || variant === 'premium') {
      Animated.timing(shadowAnim, {
        toValue: 1,
        duration: tokens.motion.durations.smooth,
        useNativeDriver: false,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (variant === 'violet' || variant === 'premium') {
      Animated.timing(shadowAnim, {
        toValue: 0,
        duration: tokens.motion.durations.smooth,
        useNativeDriver: false,
      }).start();
    }
  };

  const baseStyle: ViewStyle = {
    borderRadius: tokens.radius.lg,
    ...style,
  };

  // Variant-specific styles
  if (variant === 'violet') {
    const cardStyle: ViewStyle = {
      ...baseStyle,
      borderWidth: 2,
      borderColor: `${colors.primary}1A`, // 10% opacity
      backgroundColor: colors.card,
      ...getShadow('card'),
    };

    if (onPress) {
      return (
        <Pressable
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          className={className}
        >
          <Animated.View style={cardStyle}>
            {children}
          </Animated.View>
        </Pressable>
      );
    }

    return (
      <View style={cardStyle} className={className}>
        {children}
      </View>
    );
  }

  if (variant === 'premium') {
    const gradientProps = getPremiumGradient();
    const cardStyle: ViewStyle = {
      ...baseStyle,
      borderWidth: 1,
      borderColor: `${colors.primary}1A`,
      ...getShadow('premium'),
    };

    if (onPress) {
      return (
        <Pressable
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          className={className}
        >
          <LinearGradient
            colors={gradientProps.colors}
            start={gradientProps.start}
            end={gradientProps.end}
            style={cardStyle}
          >
            {children}
          </LinearGradient>
        </Pressable>
      );
    }

    return (
      <LinearGradient
        colors={gradientProps.colors}
        start={gradientProps.start}
        end={gradientProps.end}
        style={cardStyle}
        className={className}
      >
        {children}
      </LinearGradient>
    );
  }

  // Default variant
  const cardStyle: ViewStyle = {
    ...baseStyle,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    ...getShadow('card'),
  };

  return (
    <View style={cardStyle} className={className}>
      {children}
    </View>
  );
};

// Card subcomponents
export const CardHeader: React.FC<{
  children: React.ReactNode;
  style?: ViewStyle;
}> = ({ children, style }) => (
  <View
    style={[
      {
        padding: tokens.spacing[6],
        flexDirection: 'column',
        gap: tokens.spacing[2],
      },
      style,
    ]}
  >
    {children}
  </View>
);

export const CardTitle: React.FC<{
  children: React.ReactNode;
  style?: TextStyle;
}> = ({ children, style }) => {
  const { colors } = useTheme();
  return (
    <Text
      style={[
        {
          fontSize: tokens.font.sizes.xl,
          fontWeight: tokens.font.weights.semibold,
          lineHeight: tokens.font.sizes.xl * 1.2,
          letterSpacing: tokens.font.letterSpacings.tight,
          color: colors.foreground,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

export const CardDescription: React.FC<{
  children: React.ReactNode;
  style?: TextStyle;
}> = ({ children, style }) => {
  const { colors } = useTheme();
  return (
    <Text
      style={[
        {
          fontSize: tokens.font.sizes.sm,
          color: colors.mutedForeground,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

export const CardContent: React.FC<{
  children: React.ReactNode;
  style?: ViewStyle;
}> = ({ children, style }) => (
  <View
    style={[
      {
        paddingHorizontal: tokens.spacing[6],
        paddingBottom: tokens.spacing[6],
      },
      style,
    ]}
  >
    {children}
  </View>
);

export const CardFooter: React.FC<{
  children: React.ReactNode;
  style?: ViewStyle;
}> = ({ children, style }) => (
  <View
    style={[
      {
        padding: tokens.spacing[6],
        flexDirection: 'row',
        alignItems: 'center',
      },
      style,
    ]}
  >
    {children}
  </View>
);

