import { Stack } from 'expo-router';
import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform, Text, View, StatusBar, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppIcon } from '@/src/ui/icons/AppIcon';
import AppBottomNav from '../../components/AppBottomNav';
import { useTheme } from '../../src/ui/theme/ThemeProvider';
import { Sidebar } from '../../src/ui/layout/Sidebar';
import { TopBar } from '../../src/ui/layout/TopBar';
import { usePathname } from 'expo-router';
import { supabase } from '@/src/lib/supabase';
import { TopBarProvider, useTopBar } from '../../src/ui/layout/TopBarContext';

function AppLayoutContent() {
  const insets = useSafeAreaInsets();
  const { isWeb } = useTheme();
  const pathname = usePathname();
  const { topBarState } = useTopBar();
  
  // Configuration du channel Android par défaut
  useEffect(() => {
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
      });
    }
  }, []);

  // Debug listener pour voir les notifications en premier plan
  useEffect(() => {
    const sub = Notifications.addNotificationReceivedListener(n => {
      console.log('[PUSH RECEIVED]', n.request.content.title, n.request.content.body);
    });
    return () => sub.remove();
  }, []);

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      // La redirection sera gérée par le système d'auth
    } catch (error: any) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  // Sur web, on affiche la sidebar et le TopBar
  if (isWeb) {
    return (
      <View style={styles.webContainer}>
        <Sidebar onLogout={logout} />
        <View style={styles.webContent}>
          <TopBar 
            onLogout={logout} 
            onRefresh={topBarState.onRefresh}
            showBackButton={topBarState.showBackButton}
            projectName={topBarState.projectName}
            projectStatus={topBarState.projectStatus}
          />
          <View style={styles.webStackContainer}>
            <Stack
              screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
                gestureEnabled: true,
                gestureDirection: 'horizontal',
                contentStyle: { flex: 1, height: '100%' },
              }}
            >
              <Stack.Screen 
                name="home" 
                options={({ route }) => ({
                  animation: (route.params as { animation?: string })?.animation as any || 'slide_from_right' as any,
                  gestureEnabled: true,
                })}
              />
              <Stack.Screen 
                name="factures" 
                options={({ route }) => ({
                  animation: (route.params as { animation?: string })?.animation as any || 'slide_from_right' as any,
                  gestureEnabled: true,
                })}
              />
              <Stack.Screen 
                name="documents" 
                options={({ route }) => ({
                  animation: (route.params as { animation?: string })?.animation as any || 'slide_from_right' as any,
                  gestureEnabled: true,
                })}
              />
              <Stack.Screen 
                name="profile" 
                options={({ route }) => ({
                  animation: (route.params as { animation?: string })?.animation as any || 'slide_from_right' as any,
                  gestureEnabled: true,
                })}
              />
              <Stack.Screen 
                name="projets/[id]" 
                options={({ route }) => ({
                  animation: (route.params as { animation?: string })?.animation as any || 'slide_from_right' as any,
                  gestureEnabled: true,
                })}
              />
            </Stack>
          </View>
        </View>
      </View>
    );
  }

  // Sur mobile, layout normal avec bottom nav
  const containerStyle = { flex: 1, paddingTop: insets.top };

  return (
    <View style={containerStyle}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      >
        <Stack.Screen 
          name="home" 
          options={({ route }) => ({
            animation: (route.params as { animation?: string })?.animation as any || 'slide_from_right' as any,
            gestureEnabled: true,
          })}
        />
        <Stack.Screen 
          name="factures" 
          options={({ route }) => ({
            animation: (route.params as { animation?: string })?.animation as any || 'slide_from_right' as any,
            gestureEnabled: true,
          })}
        />
        <Stack.Screen 
          name="documents" 
          options={({ route }) => ({
            animation: (route.params as { animation?: string })?.animation as any || 'slide_from_right' as any,
            gestureEnabled: true,
          })}
        />
        <Stack.Screen 
          name="profile" 
          options={({ route }) => ({
            animation: (route.params as { animation?: string })?.animation as any || 'slide_from_right' as any,
            gestureEnabled: true,
          })}
        />
        <Stack.Screen 
          name="projets/[id]" 
          options={({ route }) => ({
            animation: (route.params as { animation?: string })?.animation as any || 'slide_from_right' as any,
            gestureEnabled: true,
          })}
        />
      </Stack>
      
      {/* Bottom Navigation - seulement sur mobile */}
      <AppBottomNav />
    </View>
  );
}

export default function AppLayout() {
  return (
    <TopBarProvider>
      <AppLayoutContent />
    </TopBarProvider>
  );
}

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    height: '100vh',
    backgroundColor: '#F7F8FA',
  },
  webContent: {
    flex: 1,
    flexDirection: 'column',
    minWidth: 0,
    overflow: 'hidden',
  },
  webStackContainer: {
    flex: 1,
    overflow: 'hidden',
  },
});
