import { Stack } from 'expo-router';

export default function DevLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        title: 'Dev Tools',
        headerStyle: {
          backgroundColor: '#7C3AED',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="nw-check" 
        options={{ 
          title: 'NativeWind Test',
          headerBackTitle: 'Back'
        }} 
      />
    </Stack>
  );
}
