import { Stack } from 'expo-router';
import { ThemeProvider } from '../src/ui/theme/ThemeProvider';
import { ToastProvider } from '../src/ui/components';

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
