import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
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

  return (
    <TouchableOpacity
      className={getButtonClasses()}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={variant === 'ghost' ? 0.7 : 0.9}
    >
      <Text className={getTextClasses()}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};
