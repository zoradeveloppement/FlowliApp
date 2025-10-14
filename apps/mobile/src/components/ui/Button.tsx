/**
 * Button Component - Flowli Design System
 */
import React, { useRef } from 'react';
import { Pressable, Text, Animated, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../ui/theme/ThemeProvider';
import { getShadow } from '../../theme/getShadow';
import { getHeroGradient } from '../../theme/gradients';
import { tokens } from '../../theme/tokens';

export type ButtonVariant = 'default' | 'hero' | 'cta' | 'outline' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'default' | 'lg' | 'xl' | 'icon';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  onPress?: () => void;
  disabled?: boolean;
  className?: string;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'default',
  size = 'default',
  onPress,
  disabled = false,
  className,
  style,
}) => {
  const { colors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };

  // Size configurations
  const sizeStyles: Record<ButtonSize, { height: number; paddingX: number; fontSize: number }> = {
    sm: { height: 36, paddingX: tokens.spacing[4], fontSize: tokens.font.sizes.sm },
    default: { height: 40, paddingX: tokens.spacing[5] || 20, fontSize: tokens.font.sizes.md },
    lg: { height: 44, paddingX: tokens.spacing[8], fontSize: tokens.font.sizes.md },
    xl: { height: 56, paddingX: tokens.spacing[12], fontSize: tokens.font.sizes.lg },
    icon: { height: 40, paddingX: 0, fontSize: tokens.font.sizes.md },
  };

  const sizeConfig = sizeStyles[size];

  // Variant styles
  const getVariantStyles = (): { container: ViewStyle; text: TextStyle; useGradient: boolean } => {
    switch (variant) {
      case 'hero':
        return {
          container: {
            ...getShadow('primary'),
          },
          text: {
            color: '#FFFFFF',
            fontWeight: tokens.font.weights.bold,
          },
          useGradient: true,
        };

      case 'cta':
        return {
          container: {
            backgroundColor: colors.primary,
            ...getShadow('primary'),
          },
          text: {
            color: colors.primaryForeground,
            fontSize: 18,
            fontWeight: tokens.font.weights.bold,
          },
          useGradient: false,
        };

      case 'outline':
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: colors.input,
          },
          text: {
            color: colors.foreground,
            fontWeight: tokens.font.weights.medium,
          },
          useGradient: false,
        };

      case 'ghost':
        return {
          container: {
            backgroundColor: 'transparent',
          },
          text: {
            color: colors.foreground,
            fontWeight: tokens.font.weights.medium,
          },
          useGradient: false,
        };

      case 'destructive':
        return {
          container: {
            backgroundColor: colors.destructive,
          },
          text: {
            color: '#FFFFFF',
            fontWeight: tokens.font.weights.medium,
          },
          useGradient: false,
        };

      case 'default':
      default:
        return {
          container: {
            backgroundColor: colors.primary,
            ...getShadow('primary'),
          },
          text: {
            color: colors.primaryForeground,
            fontWeight: tokens.font.weights.medium,
          },
          useGradient: false,
        };
    }
  };

  const variantStyles = getVariantStyles();

  const containerStyle: ViewStyle = {
    height: sizeConfig.height,
    width: size === 'icon' ? sizeConfig.height : undefined,
    paddingHorizontal: size === 'icon' ? 0 : sizeConfig.paddingX,
    borderRadius: tokens.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: disabled ? 0.5 : 1,
    ...variantStyles.container,
    ...style,
  };

  const textStyle: TextStyle = {
    fontSize: sizeConfig.fontSize,
    ...variantStyles.text,
  };

  const content = (
    <Text style={textStyle}>{children}</Text>
  );

  if (variantStyles.useGradient) {
    const gradientProps = getHeroGradient();
    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Pressable
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled}
          className={className}
        >
          <LinearGradient
            colors={gradientProps.colors}
            start={gradientProps.start}
            end={gradientProps.end}
            style={containerStyle}
          >
            {content}
          </LinearGradient>
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={({ pressed }) => [
          containerStyle,
          pressed && (variant === 'outline' || variant === 'ghost') && {
            backgroundColor: colors.muted,
          },
        ]}
        className={className}
      >
        {content}
      </Pressable>
    </Animated.View>
  );
};

