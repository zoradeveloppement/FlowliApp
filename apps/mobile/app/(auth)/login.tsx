import { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, StatusBar } from 'react-native';
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
    <Screen className="bg-white">
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
          className="flex-1"
        >
          {/* Container centré */}
          <View className="flex-1 items-stretch justify-center px-6 py-8">
            {/* Branding compact */}
            <View className="items-center mb-8">
              <View className="w-14 h-14 rounded-full bg-violet-600 items-center justify-center mb-3">
                <Text className="text-white text-2xl font-bold">F</Text>
              </View>
              <Text className="text-xs tracking-widest text-gray-500 font-semibold">FLOWLI</Text>
            </View>

            {/* Titre + sous-titre (tailles raisonnables mobiles) */}
            <View className="mb-8">
              <Text className="text-2xl font-bold text-gray-900 text-center">Connexion sécurisée</Text>
              <Text className="text-sm text-gray-500 text-center mt-2">
                Connectez-vous en un instant avec votre email.
              </Text>
            </View>

            {/* Zone formulaire */}
            <View className="mb-4">
              <Input
                placeholder="email@exemple.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                error={error ?? undefined}
                className="rounded-2xl text-base"
              />
              <Text className="text-[12px] text-gray-500 mt-2">
                Utilisez l’email associé à votre compte.
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
            <View className="items-center mt-6">
              <View className="flex-row items-center bg-gray-50 rounded-full px-3.5 py-2">
                <View className="w-4 h-4 rounded-full bg-emerald-500 items-center justify-center mr-2">
                  <Text className="text-white text-[10px] font-bold">✓</Text>
                </View>
                <Text className="text-gray-600 text-[12px] font-medium">Connexion chiffrée</Text>
              </View>
            </View>

            {/* Footer aide minimal */}
            <View className="items-center mt-8">
              <Text className="text-[12px] text-gray-400 text-center">
                Un email avec un code à usage unique vous sera envoyé.
              </Text>
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
    </Screen>
  );
}