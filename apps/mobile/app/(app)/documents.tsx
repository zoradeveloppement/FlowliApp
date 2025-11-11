import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppLayout } from '../../src/ui/layout';
import { useRouter } from 'expo-router';
import { supabase } from '@/src/lib/supabase';

export default function Documents() {
  const router = useRouter();

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      router.replace('/(public)/onboarding');
    } catch (error: any) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <AppLayout onLogout={logout}>
      <View style={styles.container}>
        <Text style={styles.title}>Documents</Text>
        <Text style={styles.subtitle}>Page en construction</Text>
      </View>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
});

