import React, { useState } from 'react';
import { View, TextInput, Text, Platform, StyleSheet } from 'react-native';
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

  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return styles.inputSmall;
      case 'md':
        return styles.inputMedium;
      case 'lg':
        return styles.inputLarge;
      default:
        return styles.inputMedium;
    }
  };

  const getBorderStyle = () => {
    if (error) return styles.inputError;
    if (isFocused) return styles.inputFocused;
    return styles.inputDefault;
  };

  const baseClasses = 'border rounded-md bg-white';
  const sizeClasses = getSizeClasses();
  const borderClasses = getBorderClasses();

  return (
    <View className={`${className}`} style={styles.container}>
      {label && (
        <Text className="text-body text-textMain font-medium mb-2" style={styles.label}>
          {label}
        </Text>
      )}
      
      <TextInput
        className={`${baseClasses} ${sizeClasses} ${borderClasses}`}
        style={[
          styles.input,
          getSizeStyle(),
          getBorderStyle(),
          Platform.OS === 'web' ? {
            outline: 'none',
            transition: 'border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out'
          } : undefined
        ]}
        placeholder={placeholder}
        placeholderTextColor="#6E6E6E"
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
      
      {error && (
        <Text className="text-danger text-secondary mt-1" style={styles.errorText}>
          {error}
        </Text>
      )}
      
      {helperText && !error && (
        <Text className="text-textMuted text-secondary mt-1" style={styles.helperText}>
          {helperText}
        </Text>
      )}
    </View>
  );
};

// Styles de fallback pour Expo Go (quand NativeWind ne fonctionne pas)
const styles = StyleSheet.create({
  container: {
    // Container styles
  },
  label: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    color: '#1A1A1A',
  },
  inputSmall: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  inputMedium: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  inputLarge: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 18,
  },
  inputDefault: {
    borderColor: '#D1D5DB',
  },
  inputFocused: {
    borderColor: '#7C3AED',
  },
  inputError: {
    borderColor: '#F44336',
  },
  errorText: {
    color: '#F44336',
    fontSize: 14,
    marginTop: 4,
  },
  helperText: {
    color: '#6E6E6E',
    fontSize: 14,
    marginTop: 4,
  },
});
