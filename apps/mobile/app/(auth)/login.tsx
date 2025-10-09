import { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Screen } from '../../src/ui/layout';
import { Input, Button, Snackbar } from '../../src/ui/components';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const sendMagicLink = async () => {
    if (!email) {
      setError('Veuillez entrer votre email');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const webBaseUrl = process.env.EXPO_PUBLIC_WEB_BASE_URL!;
      const emailRedirectTo = `${webBaseUrl}/auth/callback`;

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo }
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess('Code envoyé avec succès');
        setTimeout(() => {
          router.push({ pathname: '/(auth)/verify-otp', params: { email } });
        }, 450);
      }
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = loading || !email;

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
              <Text className="text-2xl font-bold text-gray-900 text-center" style={styles.title}>Connexion sécurisée</Text>
              <Text className="text-sm text-gray-500 text-center mt-2" style={styles.subtitle}>
                Connectez-vous en un instant avec votre email.
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
                className="rounded-2xl text-base"
              />
              <Text className="text-[12px] text-gray-500 mt-2" style={styles.helperText}>
                Utilisez l'email associé à votre compte.
              </Text>
            </View>

            {/* CTA */}
            <Button
              title={loading ? 'Envoi…' : 'Recevoir mon code'}
              variant="primary"
              onPress={sendMagicLink}
              disabled={isDisabled}
              className="rounded-full py-3.5"
            />

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
                Un email avec un code à usage unique vous sera envoyé.
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
});