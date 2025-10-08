import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/src/lib/supabase';
import { Platform } from 'react-native';
import { Screen } from '../../src/ui/layout';
import { Card } from '../../src/ui/components';

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
        
        // Forcer l'hydratation de la session avant la navigation
        // Évite que Home se monte avant que le token soit disponible
        await supabase.auth.getSession();
        
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
      <Screen>
        <View className="flex-1 justify-center items-center">
          <Card className="items-center py-8">
            <ActivityIndicator size="large" color="#6C63FF" />
            <Text className="text-body text-textMuted mt-4">Connexion en cours...</Text>
          </Card>
        </View>
      </Screen>
    );
  }

  if (status === 'error') {
    return (
      <Screen>
        <View className="flex-1 justify-center items-center">
          <Card className="items-center py-8">
            <Text className="text-4xl mb-4">❌</Text>
            <Text className="text-h2 text-danger mb-2">Erreur de connexion</Text>
            <Text className="text-body text-textMuted text-center">
              {error || 'Une erreur est survenue lors de la connexion.'}
            </Text>
          </Card>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View className="flex-1 justify-center items-center">
        <Card className="items-center py-8">
          <Text className="text-4xl mb-4">✅</Text>
          <Text className="text-h2 text-success mb-2">Connexion réussie !</Text>
          <Text className="text-body text-textMuted">
            Redirection en cours...
          </Text>
        </Card>
      </View>
    </Screen>
  );
}
