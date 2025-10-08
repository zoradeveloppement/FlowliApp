import React, { useState } from 'react';
import { View, TextInput, Text, Platform } from 'react-native';
import { InputSize, BaseComponentProps } from '../types';

interface InputProps extends BaseComponentProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  error?: string;
  helperText?: string;
  size?: InputSize;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  helperText,
  size = 'md',
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  className = '',
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-2 text-sm';
      case 'md':
        return 'px-4 py-3 text-body';
      case 'lg':
        return 'px-4 py-4 text-lg';
      default:
        return 'px-4 py-3 text-body';
    }
  };

  const getBorderClasses = () => {
    if (error) return 'border-danger';
    if (isFocused) return 'border-primary';
    return 'border-gray-300';
  };

  const baseClasses = 'border rounded-md bg-white';
  const sizeClasses = getSizeClasses();
  const borderClasses = getBorderClasses();

  return (
    <View className={`${className}`}>
      {label && (
        <Text className="text-body text-textMain font-medium mb-2">
          {label}
        </Text>
      )}
      
      <TextInput
        className={`${baseClasses} ${sizeClasses} ${borderClasses}`}
        placeholder={placeholder}
        placeholderTextColor="#6E6E6E"
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        style={Platform.OS === 'web' ? {
          outline: 'none',
          transition: 'border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out'
        } : undefined}
      />
      
      {error && (
        <Text className="text-danger text-secondary mt-1">
          {error}
        </Text>
      )}
      
      {helperText && !error && (
        <Text className="text-textMuted text-secondary mt-1">
          {helperText}
        </Text>
      )}
    </View>
  );
};
