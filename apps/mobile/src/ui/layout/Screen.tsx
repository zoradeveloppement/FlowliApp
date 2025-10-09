import React from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

interface ScreenProps {
  children: React.ReactNode;
  className?: string;
}

export const Screen: React.FC<ScreenProps> = ({ children, className = '' }) => {
  const { isWeb } = useTheme();
  
  const baseClasses = isWeb 
    ? 'px-6 py-6 max-w-[800px] mx-auto' 
    : 'px-4 py-6';
    
  return (
    <View 
      className={`${baseClasses} ${className}`}
      style={Platform.OS !== 'web' ? styles.mobileFallback : undefined}
    >
      {children}
    </View>
  );
};

// Styles de fallback pour mobile quand NativeWind ne fonctionne pas
const styles = StyleSheet.create({
  mobileFallback: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
});
