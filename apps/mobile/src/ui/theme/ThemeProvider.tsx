import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useColorScheme, View, Text, Pressable, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { tokens } from '../../theme/tokens';

type ThemeMode = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryGlow: string;
  primaryForeground: string;
  background: string;
  foreground: string;
  card: string;
  muted: string;
  mutedForeground: string;
  border: string;
  input: string;
  destructive: string;
  success: string;
  ring: string;
}

interface ThemeContextType {
  mode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setMode: (mode: ThemeMode) => void;
  colors: ThemeColors;
  tokens: typeof tokens;
  isWeb: boolean;
  isMobile: boolean;
}

const THEME_STORAGE_KEY = '@flowli_theme_mode';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function resolveColors(theme: ResolvedTheme): ThemeColors {
  const isDark = theme === 'dark';
  
  return {
    primary: tokens.colors.primary,
    primaryLight: tokens.colors.primaryLight,
    primaryGlow: tokens.colors.primaryGlow,
    primaryForeground: tokens.colors.primaryForeground,
    background: isDark ? tokens.colors.backgroundDark : tokens.colors.backgroundLight,
    foreground: isDark ? tokens.colors.foregroundDark : tokens.colors.foregroundLight,
    card: isDark ? tokens.colors.cardDark : tokens.colors.cardLight,
    muted: isDark ? tokens.colors.mutedDark : tokens.colors.mutedLight,
    mutedForeground: isDark ? tokens.colors.mutedForegroundDark : tokens.colors.mutedForegroundLight,
    border: isDark ? tokens.colors.borderDark : tokens.colors.borderLight,
    input: isDark ? tokens.colors.inputDark : tokens.colors.inputLight,
    destructive: isDark ? tokens.colors.destructiveDark : tokens.colors.destructiveLight,
    success: tokens.colors.success,
    ring: tokens.colors.ring,
  };
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [isLoaded, setIsLoaded] = useState(false);
  
  const isWeb = Platform.OS === 'web';
  const isMobile = !isWeb;

  // Load theme preference from storage
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (stored && (stored === 'light' || stored === 'dark' || stored === 'system')) {
          setModeState(stored as ThemeMode);
        }
      } catch (e) {
        console.warn('Failed to load theme preference:', e);
      } finally {
        setIsLoaded(true);
      }
    };
    loadTheme();
  }, []);

  const setMode = useCallback(async (newMode: ThemeMode) => {
    setModeState(newMode);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newMode);
    } catch (e) {
      console.warn('Failed to save theme preference:', e);
    }
  }, []);

  // Resolve the actual theme
  const resolvedTheme: ResolvedTheme = mode === 'system' 
    ? (systemColorScheme === 'dark' ? 'dark' : 'light')
    : mode;

  const colors = resolveColors(resolvedTheme);

  const value: ThemeContextType = {
    mode,
    resolvedTheme,
    setMode,
    colors,
    tokens,
    isWeb,
    isMobile,
  };

  // Don't render until theme is loaded to prevent flash
  // But provide a fallback to prevent blank screen on iOS
  if (!isLoaded) {
    return (
      <ThemeContext.Provider value={{
        mode: 'system',
        resolvedTheme: 'light',
        setMode: () => {},
        colors: resolveColors('light'),
        tokens,
        isWeb,
        isMobile,
      }}>
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Themed components
export const ThemedView: React.FC<{
  children: React.ReactNode;
  style?: any;
  className?: string;
}> = ({ children, style, className }) => {
  const { colors } = useTheme();
  return (
    <View style={[{ backgroundColor: colors.background }, style]} className={className}>
      {children}
    </View>
  );
};

export const ThemedText: React.FC<{
  children: React.ReactNode;
  style?: any;
  className?: string;
  variant?: 'default' | 'muted';
}> = ({ children, style, className, variant = 'default' }) => {
  const { colors } = useTheme();
  const color = variant === 'muted' ? colors.mutedForeground : colors.foreground;
  return (
    <Text style={[{ color }, style]} className={className}>
      {children}
    </Text>
  );
};

// Theme toggle component
export const ThemeToggle: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { mode, setMode, colors } = useTheme();
  
  const modes: ThemeMode[] = ['light', 'system', 'dark'];
  
  return (
    <View style={{ flexDirection: 'row', gap: tokens.spacing[2], alignItems: 'center' }}>
      {modes.map((m) => (
        <Pressable
          key={m}
          onPress={() => setMode(m)}
          style={{
            paddingHorizontal: compact ? tokens.spacing[2] : tokens.spacing[3],
            paddingVertical: tokens.spacing[2],
            borderRadius: tokens.radius.md,
            backgroundColor: mode === m ? colors.primary : colors.muted,
          }}
        >
          <Text
            style={{
              color: mode === m ? colors.primaryForeground : colors.foreground,
              fontSize: tokens.font.sizes.sm,
              fontWeight: tokens.font.weights.medium,
              textTransform: 'capitalize',
            }}
          >
            {compact ? m[0].toUpperCase() : m}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};
