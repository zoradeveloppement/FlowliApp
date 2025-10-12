import { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Screen } from '../../src/ui/layout';
import { Input, Button, Snackbar, Card } from '../../src/ui/components';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Password reset states
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Veuillez entrer votre email et mot de passe');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess('Connexion réussie !');
        setTimeout(() => {
          router.replace('/(app)/home');
        }, 800);
      }
    } finally {
      setLoading(false);
    }
  };

  const sendPasswordReset = async () => {
    if (!resetEmail) {
      setError('Veuillez entrer votre email');
      return;
    }
    setResetLoading(true);
    setError(null);
    try {
      const webBase = process.env.EXPO_PUBLIC_WEB_BASE_URL ?? 'http://localhost:8081'
      const mobileRedirect = 'portailclient://auth/callback' // scheme défini dans app.config.ts

      const { error } = await supabase.auth.resetPasswordForEmail(
        resetEmail.trim().toLowerCase(),
        {
          redirectTo: Platform.select({
            web: `${webBase}/auth/callback`,
            default: mobileRedirect,
          })
        }
      );

      if (error) {
        setError(error.message);
      } else {
        setResetSuccess('Email envoyé si le compte existe.');
        setShowResetForm(false);
        setResetEmail('');
      }
    } finally {
      setResetLoading(false);
    }
  };

  const handleResetClick = () => {
    setResetEmail(email); // Pre-fill with current email if available
    setShowResetForm(true);
  };

  const isDisabled = loading || !email || !password;

  return (
    <View className="flex-1 bg-white" style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
        style={styles.keyboardView}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
          className="flex-1"
        >
          {/* Container centré */}
          <View className="flex-1 items-stretch justify-center px-8 py-12" style={styles.mainContainer}>
            {/* Branding compact */}
            <View className="items-center mb-8" style={styles.brandingContainer}>
              <View className="w-14 h-14 rounded-full bg-violet-600 items-center justify-center mb-3" style={styles.logoContainer}>
                <Text className="text-white text-2xl font-bold" style={styles.logoText}>F</Text>
              </View>
              <Text className="text-xs tracking-widest text-gray-500 font-semibold" style={styles.brandText}>FLOWLI</Text>
            </View>

            {/* Titre + sous-titre (tailles raisonnables mobiles) */}
            <View className="mb-8" style={styles.titleContainer}>
              <Text className="text-2xl font-bold text-gray-900 text-center" style={styles.title}>Connexion</Text>
              <Text className="text-sm text-gray-500 text-center mt-2" style={styles.subtitle}>
                Connectez-vous avec votre email et mot de passe.
              </Text>
            </View>

            {/* Zone formulaire */}
            <View className="mb-4" style={styles.formContainer}>
              <Input
                placeholder="email@exemple.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                error={error ?? undefined}
                className="rounded-2xl text-base mb-3"
              />
              <Input
                placeholder="Votre mot de passe"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                error={error ?? undefined}
                className="rounded-2xl text-base"
              />
              <Text className="text-[12px] text-gray-500 mt-2" style={styles.helperText}>
                Utilisez vos identifiants de connexion.
              </Text>
            </View>

            {/* CTA */}
            <Button
              title={loading ? 'Connexion…' : 'Se connecter'}
              variant="primary"
              onPress={handleLogin}
              disabled={isDisabled}
              className="rounded-full py-3.5"
            />

            {/* Password reset link */}
            <TouchableOpacity
              onPress={handleResetClick}
              activeOpacity={0.7}
              className="items-center mt-4"
              style={styles.resetLink}
            >
              <Text className="text-violet-600 text-base font-medium" style={styles.resetLinkText}>
                Mot de passe oublié ?
              </Text>
            </TouchableOpacity>

            {/* Password reset form */}
            {showResetForm && (
              <Card className="mt-6">
                <Text className="text-lg font-semibold text-gray-900 mb-4" style={styles.resetTitle}>
                  Réinitialiser le mot de passe
                </Text>
                <Input
                  placeholder="email@exemple.com"
                  value={resetEmail}
                  onChangeText={setResetEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="rounded-2xl text-base mb-4"
                />
                <View className="flex-row gap-3" style={styles.resetButtonsContainer}>
                  <Button
                    title="Annuler"
                    variant="ghost"
                    onPress={() => {
                      setShowResetForm(false);
                      setResetEmail('');
                    }}
                    className="flex-1 rounded-full py-3"
                  />
                  <Button
                    title={resetLoading ? 'Envoi…' : 'Envoyer le lien'}
                    variant="primary"
                    onPress={sendPasswordReset}
                    disabled={resetLoading || !resetEmail}
                    className="flex-1 rounded-full py-3"
                  />
                </View>
              </Card>
            )}

            {/* Badge de confiance */}
            <View className="items-center mt-6" style={styles.trustContainer}>
              <View className="flex-row items-center bg-gray-50 rounded-full px-3.5 py-2" style={styles.trustBadge}>
                <View className="w-4 h-4 rounded-full bg-emerald-500 items-center justify-center mr-2" style={styles.checkIcon}>
                  <Text className="text-white text-[10px] font-bold" style={styles.checkText}>✓</Text>
                </View>
                <Text className="text-gray-600 text-[12px] font-medium" style={styles.trustText}>Connexion chiffrée</Text>
              </View>
            </View>

            {/* Footer aide minimal */}
            <View className="items-center mt-8" style={styles.footerContainer}>
              <Text className="text-[12px] text-gray-400 text-center" style={styles.footerText}>
                Connexion sécurisée avec mot de passe.
              </Text>
              <Button
                title="Créer un compte"
                variant="ghost"
                onPress={() => router.push({ pathname: '/(auth)/signup' } as any)}
                className="mt-4"
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Snackbars */}
      <Snackbar
        type="error"
        message={error || ''}
        visible={!!error}
        onHide={() => setError(null)}
      />
      <Snackbar
        type="success"
        message={success || ''}
        visible={!!success}
        onHide={() => setSuccess(null)}
      />
      <Snackbar
        type="success"
        message={resetSuccess || ''}
        visible={!!resetSuccess}
        onHide={() => setResetSuccess(null)}
      />
    </View>
  );
}

// Styles de fallback pour Expo Go (quand NativeWind ne fonctionne pas)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  mainContainer: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  brandingContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  brandText: {
    fontSize: 12,
    letterSpacing: 2,
    color: '#6B7280',
    fontWeight: '600',
  },
  titleContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
  },
  formContainer: {
    marginBottom: 16,
  },
  helperText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
  },
  trustContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  checkIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  checkText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  trustText: {
    color: '#4B5563',
    fontSize: 12,
    fontWeight: '500',
  },
  footerContainer: {
    alignItems: 'center',
    marginTop: 32,
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  resetLink: {
    alignItems: 'center',
    marginTop: 16,
  },
  resetLinkText: {
    color: '#7C3AED',
    fontSize: 16,
    fontWeight: '500',
  },
  resetTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  resetButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
});