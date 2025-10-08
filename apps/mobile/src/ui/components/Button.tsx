import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { ButtonVariant, ButtonSize, BaseComponentProps } from '../types';
import { globalStyles, colors, typography } from '../styles/globalStyles';

interface ButtonProps extends BaseComponentProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  onPress?: () => void;
  disabled?: boolean;
  title: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  onPress,
  disabled = false,
  title,
  style,
}) => {
  const getButtonStyle = () => {
    const baseStyle = [globalStyles.button];
    
    switch (variant) {
      case 'primary':
        return [...baseStyle, globalStyles.buttonPrimary, disabled && styles.disabled];
      case 'secondary':
        return [...baseStyle, globalStyles.buttonSecondary, disabled && styles.disabled];
      case 'ghost':
        return [...baseStyle, globalStyles.buttonGhost, disabled && styles.disabled];
      case 'disabled':
        return [...baseStyle, styles.disabled];
      default:
        return [...baseStyle, globalStyles.buttonPrimary];
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'primary':
        return [globalStyles.textWhite, typography.button];
      case 'secondary':
        return [globalStyles.textPrimary, typography.button];
      case 'ghost':
        return [globalStyles.textPrimary, typography.button];
      case 'disabled':
        return [styles.disabledText, typography.button];
      default:
        return [globalStyles.textWhite, typography.button];
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return styles.small;
      case 'md':
        return styles.medium;
      case 'lg':
        return styles.large;
      default:
        return styles.medium;
    }
  };

  return (
    <TouchableOpacity
      style={[...getButtonStyle(), getSizeStyle(), style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={variant === 'ghost' ? 0.7 : 0.9}
    >
      <Text style={getTextStyle()}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  small: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  disabled: {
    backgroundColor: colors.gray[300],
    shadowOpacity: 0,
    elevation: 0,
  },
  disabledText: {
    color: colors.gray[500],
  },
});
