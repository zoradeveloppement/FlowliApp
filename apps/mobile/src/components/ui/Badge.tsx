/**
 * Badge Component - Flowli Design System
 */
import React from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../ui/theme/ThemeProvider';
import { tokens } from '../../theme/tokens';
import { AppIcon, IconName } from './AppIcon';

export type BadgeVariant = 'primary' | 'success';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  icon?: IconName;
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  icon,
  style,
}) => {
  const { colors } = useTheme();

  const getVariantStyles = (): { container: ViewStyle; text: TextStyle; iconColor: string } => {
    switch (variant) {
      case 'success':
        return {
          container: {
            backgroundColor: `${colors.success}1A`, // 10% opacity
          },
          text: {
            color: colors.success,
          },
          iconColor: colors.success,
        };

      case 'primary':
      default:
        return {
          container: {
            backgroundColor: `${colors.primary}1A`, // 10% opacity
          },
          text: {
            color: colors.primary,
          },
          iconColor: colors.primary,
        };
    }
  };

  const variantStyles = getVariantStyles();

  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    gap: icon ? tokens.spacing[2] : 0,
    backgroundColor: variantStyles.container.backgroundColor,
    paddingHorizontal: tokens.spacing[4],
    paddingVertical: tokens.spacing[2],
    borderRadius: tokens.radius.full,
    alignSelf: 'flex-start',
    ...style,
  };

  const textStyle: TextStyle = {
    fontSize: tokens.font.sizes.sm,
    fontWeight: tokens.font.weights.medium,
    color: variantStyles.text.color,
  };

  return (
    <View style={containerStyle}>
      {icon && (
        <AppIcon 
          name={icon} 
          size={16} 
          color={variantStyles.iconColor}
        />
      )}
      <Text style={textStyle}>{children}</Text>
    </View>
  );
};

