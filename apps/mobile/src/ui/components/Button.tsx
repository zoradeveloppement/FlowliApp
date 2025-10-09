import React from 'react';
import { TouchableOpacity, Text, Platform, StyleSheet } from 'react-native';
import { ButtonVariant, ButtonSize, BaseComponentProps } from '../types';

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
  className,
}) => {
  const getButtonClasses = () => {
    const baseClasses = 'rounded-full flex-row items-center justify-center';
    
    // Size classes
    const sizeClasses = {
      sm: 'px-3 py-2',
      md: 'px-4 py-3',
      lg: 'px-6 py-4',
    };
    
    // Variant classes
    const variantClasses = {
      primary: disabled 
        ? 'bg-gray-300' 
        : 'bg-primary shadow-lg shadow-primary/30',
      secondary: disabled
        ? 'bg-gray-200 border border-gray-300'
        : 'bg-white border border-primary',
      ghost: disabled
        ? 'bg-transparent'
        : 'bg-transparent',
      disabled: 'bg-gray-300',
    };
    
    return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className || ''}`;
  };

  const getTextClasses = () => {
    const baseClasses = 'font-medium text-center';
    
    const variantClasses = {
      primary: disabled ? 'text-gray-500' : 'text-white',
      secondary: disabled ? 'text-gray-400' : 'text-primary',
      ghost: disabled ? 'text-gray-400' : 'text-primary',
      disabled: 'text-gray-500',
    };
    
    const sizeClasses = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    };
    
    return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]}`;
  };

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
    
    return [baseStyle, sizeStyles[size], variantStyles[variant]];
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
      className={getButtonClasses()}
      style={Platform.OS !== 'web' ? getButtonStyle() : undefined}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={variant === 'ghost' ? 0.7 : 0.9}
    >
      <Text 
        className={getTextClasses()}
        style={Platform.OS !== 'web' ? getTextStyle() : undefined}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

// Styles de fallback pour Expo Go (quand NativeWind ne fonctionne pas)
const styles = StyleSheet.create({
  button: {
    borderRadius: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: '#F3F4F6',
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
