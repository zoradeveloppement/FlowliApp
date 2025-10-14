/**
 * Input Component - Flowli Design System
 */
import React, { useState } from 'react';
import { View, TextInput, Text, TextInputProps, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../ui/theme/ThemeProvider';
import { tokens } from '../../theme/tokens';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  helperText?: string;
  errorText?: string;
  error?: boolean;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  variant?: 'input' | 'textarea';
}

export const Input: React.FC<InputProps> = ({
  label,
  helperText,
  errorText,
  error = false,
  containerStyle,
  inputStyle,
  variant = 'input',
  editable = true,
  ...textInputProps
}) => {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const hasError = error || !!errorText;

  const containerStyles: ViewStyle = {
    width: '100%',
    ...containerStyle,
  };

  const inputContainerStyle: ViewStyle = {
    height: variant === 'textarea' ? 100 : 40,
    borderWidth: 1,
    borderColor: hasError 
      ? colors.destructive 
      : isFocused 
        ? colors.ring 
        : colors.input,
    borderRadius: tokens.radius.md,
    backgroundColor: colors.background,
    paddingHorizontal: tokens.spacing[3],
    paddingVertical: tokens.spacing[2],
  };

  const inputTextStyle: TextStyle = {
    fontSize: tokens.font.sizes.md,
    color: colors.foreground,
    flex: 1,
    ...inputStyle,
  };

  const labelStyle: TextStyle = {
    fontSize: tokens.font.sizes.sm,
    fontWeight: tokens.font.weights.medium,
    marginBottom: tokens.spacing[2],
    color: colors.foreground,
  };

  const helperTextStyle: TextStyle = {
    fontSize: tokens.font.sizes.sm,
    marginTop: tokens.spacing[2],
    color: hasError ? colors.destructive : colors.mutedForeground,
  };

  return (
    <View style={containerStyles}>
      {label && <Text style={labelStyle}>{label}</Text>}
      
      <View style={inputContainerStyle}>
        <TextInput
          {...textInputProps}
          multiline={variant === 'textarea'}
          editable={editable}
          onFocus={(e) => {
            setIsFocused(true);
            textInputProps.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            textInputProps.onBlur?.(e);
          }}
          style={inputTextStyle}
          placeholderTextColor={colors.mutedForeground}
        />
      </View>

      {(helperText || errorText) && (
        <Text style={helperTextStyle}>
          {errorText || helperText}
        </Text>
      )}
    </View>
  );
};

// Separate Textarea component for clarity
export const Textarea: React.FC<Omit<InputProps, 'variant'>> = (props) => {
  return <Input {...props} variant="textarea" />;
};

