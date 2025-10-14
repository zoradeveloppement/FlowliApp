import { Stack } from 'expo-router';
import { ThemeToggle } from '../../src/ui/theme/ThemeProvider';

export default function DesignLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitle: 'Design System',
        headerRight: () => <ThemeToggle compact />,
      }}
    >
      <Stack.Screen name="showcase" />
    </Stack>
  );
}

