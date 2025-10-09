import { Stack } from 'expo-router';
import { Platform } from 'react-native';
import { ThemeProvider } from '../src/ui/theme/ThemeProvider';
import { ToastProvider } from '../src/ui/components';

if (Platform.OS === 'web') {
  require('../global.css');
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
