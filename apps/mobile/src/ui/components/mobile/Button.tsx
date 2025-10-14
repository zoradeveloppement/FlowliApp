import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'disabled';
  size?: 'sm' | 'md' | 'lg';
  onPress?: () => void;
  disabled?: boolean;
  title: string;
  style?: any;
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
    const baseStyle = styles.button;
    
    // Size styles
    const sizeStyles = {
      sm: styles.buttonSmall,
      md: styles.buttonMedium,
      lg: styles.buttonLarge,
    };
    
    // Variant styles
    const variantStyles = {
      primary: disabled ? styles.buttonPrimaryDisabled : styles.buttonPrimary,
      secondary: disabled ? styles.buttonSecondaryDisabled : styles.buttonSecondary,
      ghost: disabled ? styles.buttonGhostDisabled : styles.buttonGhost,
      disabled: styles.buttonDisabled,
    };
    
    return [baseStyle, sizeStyles[size], variantStyles[variant], style];
  };

  const getTextStyle = () => {
    const baseStyle = styles.buttonText;
    
    // Size styles
    const sizeStyles = {
      sm: styles.buttonTextSmall,
      md: styles.buttonTextMedium,
      lg: styles.buttonTextLarge,
    };
    
    // Variant styles
    const variantStyles = {
      primary: disabled ? styles.buttonTextPrimaryDisabled : styles.buttonTextPrimary,
      secondary: disabled ? styles.buttonTextSecondaryDisabled : styles.buttonTextSecondary,
      ghost: disabled ? styles.buttonTextGhostDisabled : styles.buttonTextGhost,
      disabled: styles.buttonTextDisabled,
    };
    
    return [baseStyle, sizeStyles[size], variantStyles[variant]];
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
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
  button: {
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  buttonSmall: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  buttonMedium: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  buttonLarge: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  buttonPrimary: {
    backgroundColor: '#7C3AED',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonPrimaryDisabled: {
    backgroundColor: '#D1D5DB',
  },
  buttonSecondary: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#7C3AED',
  },
  buttonSecondaryDisabled: {
    backgroundColor: '#F4F5F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  buttonGhost: {
    backgroundColor: 'transparent',
  },
  buttonGhostDisabled: {
    backgroundColor: 'transparent',
  },
  buttonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  buttonText: {
    fontWeight: '500',
    textAlign: 'center',
  },
  buttonTextSmall: {
    fontSize: 14,
  },
  buttonTextMedium: {
    fontSize: 16,
  },
  buttonTextLarge: {
    fontSize: 18,
  },
  buttonTextPrimary: {
    color: '#FFFFFF',
  },
  buttonTextPrimaryDisabled: {
    color: '#6B7280',
  },
  buttonTextSecondary: {
    color: '#7C3AED',
  },
  buttonTextSecondaryDisabled: {
    color: '#9CA3AF',
  },
  buttonTextGhost: {
    color: '#7C3AED',
  },
  buttonTextGhostDisabled: {
    color: '#9CA3AF',
  },
  buttonTextDisabled: {
    color: '#6B7280',
  },
});
