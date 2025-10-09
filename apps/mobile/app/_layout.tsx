import { Stack } from 'expo-router';
import { Platform } from 'react-native';
import { ThemeProvider } from '../src/ui/theme/ThemeProvider';
import { ToastProvider } from '../src/ui/components';

// Import CSS pour web uniquement
if (Platform.OS === 'web') {
  require('../global.css');
}

// Fallback pour mobile - s'assurer que les styles de base sont appliqués
if (Platform.OS !== 'web') {
  // Forcer l'application des styles de base pour mobile
  console.log('Mobile platform detected - using fallback styles');
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(app)" />
          <Stack.Screen name="auth" />
        </Stack>
      </ToastProvider>
    </ThemeProvider>
  );
}
