import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/src/lib/supabase';
import { Platform } from 'react-native';

export default function AuthCallback() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        if (Platform.OS === 'web') {
          // Sur web, on doit échanger le code contre une session
          const { data, error } = await supabase.auth.exchangeCodeForSession(window.location.href);
          if (error) {
            console.error('Auth callback error:', error);
            setError(error.message);
            setStatus('error');
            return;
          }
          console.log('Auth callback success:', data);
        } else {
          // Sur mobile, la session est déjà gérée automatiquement
          // On vérifie juste qu'elle existe
          const { data } = await supabase.auth.getSession();
          if (!data.session) {
            setError('No session found');
            setStatus('error');
            return;
          }
        }

        setStatus('success');
        // Redirection vers l'écran principal
        router.replace('/(app)/home');
      } catch (err: any) {
        console.error('Auth callback error:', err);
        setError(err.message || 'Unknown error');
        setStatus('error');
      }
    };

    handleAuthCallback();
  }, [router]);

  if (status === 'loading') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 16, fontSize: 16 }}>Connexion en cours...</Text>
      </View>
    );
  }

  if (status === 'error') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#dc2626', marginBottom: 8 }}>
          Erreur de connexion
        </Text>
        <Text style={{ textAlign: 'center', color: '#6b7280' }}>
          {error || 'Une erreur est survenue lors de la connexion.'}
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: '600', color: '#16a34a' }}>
        Connexion réussie !
      </Text>
      <Text style={{ marginTop: 8, color: '#6b7280' }}>
        Redirection en cours...
      </Text>
    </View>
  );
}
