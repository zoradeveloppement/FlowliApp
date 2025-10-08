import { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
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
        options: {
          emailRedirectTo
        }
      });
      if (error) {
        setError(error.message);
      } else {
        setSuccess('Code envoyé avec succès');
        setTimeout(() => {
          router.push({ pathname: '/(auth)/verify-otp', params: { email } });
        }, 500);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen className="bg-white">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 justify-center px-6">
          {/* Logo / Branding */}
          <View className="items-center mb-12">
            <View className="w-16 h-16 rounded-full bg-violet-600 items-center justify-center mb-4">
              <Text className="text-white text-3xl font-bold">F</Text>
            </View>
            <Text className="text-sm text-gray-500 font-medium">
              FLOWLI
            </Text>
          </View>

          {/* Titre principal */}
          <View className="mb-10">
            <Text className="text-4xl font-bold text-gray-900 mb-3 text-center">
              Bienvenue
            </Text>
            <Text className="text-base text-gray-500 text-center leading-relaxed px-4">
              Connectez-vous pour suivre vos projets en temps réel
            </Text>
          </View>
          
          {/* Input email */}
          <View className="mb-6">
            <Input
              placeholder="Votre adresse email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              error={error ?? undefined}
              className="rounded-2xl text-base"
            />
          </View>
          
          {/* Bouton principal */}
          <Button
            title={loading ? "Envoi..." : "Continuer"}
            variant="primary"
            onPress={sendMagicLink}
            disabled={loading || !email}
            className="rounded-full py-4 mb-8"
          />
          
          {/* Trust badge minimaliste */}
          <View className="items-center">
            <View className="flex-row items-center bg-gray-50 rounded-full px-4 py-2.5">
              <View className="w-4 h-4 rounded-full bg-emerald-500 items-center justify-center mr-2">
                <Text className="text-white text-xs font-bold">✓</Text>
              </View>
              <Text className="text-gray-600 text-xs font-medium">
                Connexion sécurisée
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
      
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