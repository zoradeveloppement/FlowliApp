import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/src/lib/supabase';
import { Screen } from '../../src/ui/layout';
import { Card, Input, Button, Snackbar } from '../../src/ui/components';

export default function AuthCallback() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'recovery'>('loading');
  const [error, setError] = useState<string | null>(null);
  
  // Password reset states
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check if this is a password recovery flow
        if (params.type === 'recovery') {
          setStatus('recovery');
          return;
        }

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
  }, [router, params.type]);

  const handlePasswordUpdate = async () => {
    // Validation
    if (!newPassword || !confirmPassword) {
      setPasswordError('Veuillez remplir tous les champs');
      return;
    }
    
    if (newPassword.length < 6) {
      setPasswordError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas');
      return;
    }

    setPasswordLoading(true);
    setPasswordError(null);
    
    try {
      const { error } = await supabase.auth.updateUser({ 
        password: newPassword 
      });
      
      if (error) {
        setPasswordError(error.message);
      } else {
        setStatus('success');
        // Forcer l'hydratation de la session avant la navigation
        await supabase.auth.getSession();
        router.replace('/(app)/home');
      }
    } catch (err: any) {
      setPasswordError(err.message || 'Erreur lors de la mise à jour du mot de passe');
    } finally {
      setPasswordLoading(false);
    }
  };

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

  if (status === 'recovery') {
    return (
      <Screen>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <View className="flex-1 justify-center items-center px-6" style={styles.recoveryContainer}>
            <Card className="w-full max-w-md" style={styles.recoveryCard}>
              <Text className="text-2xl font-bold text-gray-900 mb-2 text-center" style={styles.recoveryTitle}>
                Nouveau mot de passe
              </Text>
              <Text className="text-base text-gray-500 mb-6 text-center" style={styles.recoverySubtitle}>
                Définissez un nouveau mot de passe pour votre compte
              </Text>
              
              <View className="space-y-4" style={styles.inputsContainer}>
                <Input
                  label="Nouveau mot de passe"
                  placeholder="Entrez votre nouveau mot de passe"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!showPassword}
                  error={passwordError && newPassword !== confirmPassword ? passwordError : undefined}
                  className="rounded-2xl"
                />
                
                <Input
                  label="Confirmer le mot de passe"
                  placeholder="Confirmez votre nouveau mot de passe"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPassword}
                  error={passwordError && newPassword === confirmPassword ? passwordError : undefined}
                  className="rounded-2xl"
                />
              </View>

              <Button
                title={passwordLoading ? "Mise à jour..." : "Mettre à jour le mot de passe"}
                variant="primary"
                onPress={handlePasswordUpdate}
                disabled={passwordLoading || !newPassword || !confirmPassword}
                className="rounded-full py-4 mt-6"
              />
            </Card>
          </View>
        </KeyboardAvoidingView>
        
        <Snackbar
          type="error"
          message={passwordError || ''}
          visible={!!passwordError}
          onHide={() => setPasswordError(null)}
        />
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

// Styles de fallback pour Expo Go (quand NativeWind ne fonctionne pas)
const styles = StyleSheet.create({
  recoveryContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  recoveryCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  recoveryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  recoverySubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputsContainer: {
    marginBottom: 24,
  },
});
