import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Screen } from '../../src/ui/layout';
import { Input, Button, Card, Snackbar } from '../../src/ui/components';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const sendMagicLink = async () => {
    if (!email) {
      setError('Email requis');
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
        setSuccess(`Code envoyé à ${email}`);
        // Navigation automatique vers l'écran OTP
        router.push({ pathname: '/(auth)/verify-otp', params: { email } });
      }
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    if (!email) {
      setError('Email requis');
      return;
    }
    setResendLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email
      });
      if (error) {
        setError(error.message);
      } else {
        setSuccess('Un nouveau code a été envoyé à votre adresse email');
      }
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <Screen className="bg-gray-50">
      <View className="flex-1 justify-center px-6">
        {/* Badge de confiance (optionnel) */}
        <View className="items-center mb-8">
          <View className="flex-row items-center bg-violet-50 rounded-full px-4 py-2">
            <View className="w-5 h-5 rounded-full bg-violet-600 items-center justify-center mr-2">
              <Text className="text-white text-xs font-bold">✓</Text>
            </View>
            <Text className="text-violet-600 text-sm font-medium">
              Connexion sécurisée
            </Text>
          </View>
        </View>

        {/* Card principale */}
        <Card className="mb-6 p-8 rounded-3xl bg-white shadow-lg">
          {/* Titre principal - Style Flowli */}
          <Text className="text-4xl font-bold text-gray-900 mb-3 leading-tight">
            Connectez-vous en{' '}
            <Text className="text-violet-600">quelques secondes</Text>
          </Text>
          
          {/* Sous-titre */}
          <Text className="text-base text-gray-500 mb-8 leading-relaxed">
            Entrez votre adresse email pour recevoir un code de connexion sécurisé
          </Text>
          
          {/* Input avec style moderne */}
          <View className="mb-6">
            <Input
              label="Adresse email"
              placeholder="email@exemple.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              error={error}
              className="rounded-2xl"
            />
          </View>
          
          {/* Bouton principal - Style Flowli violet */}
          <Button
            title={loading ? "Envoi en cours..." : "Recevoir mon code"}
            variant="primary"
            onPress={sendMagicLink}
            disabled={loading}
            className="rounded-full bg-violet-600 py-4 mb-4 shadow-lg shadow-violet-500/30"
          />
          
          {/* Bouton secondaire - Style discret */}
          <TouchableOpacity
            onPress={resendCode}
            disabled={resendLoading || !email}
            className={`py-3 rounded-2xl border border-gray-200 bg-white items-center ${
              resendLoading || !email ? 'opacity-40' : 'opacity-100'
            }`}
            activeOpacity={0.7}
          >
            <Text className="text-gray-700 font-medium">
              {resendLoading ? "Envoi en cours..." : "Renvoyer le code"}
            </Text>
          </TouchableOpacity>
        </Card>
        
        {/* Note informative */}
        <View className="bg-white rounded-2xl px-6 py-4 shadow-sm">
          <View className="flex-row items-start">
            <Text className="text-2xl mr-3">💡</Text>
            <Text className="text-sm text-gray-600 flex-1 leading-relaxed">
              Utilisez un email auquel vous avez accès depuis cet appareil pour une connexion rapide
            </Text>
          </View>
        </View>
      </View>
      
      {/* Snackbars inchangés */}
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