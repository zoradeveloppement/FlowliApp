import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/src/lib/supabase';

export default function VerifyOTP() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    // Récupérer l'email depuis les params de route
    const emailParam = params.email as string;
    if (emailParam) {
      setEmail(emailParam);
    } else {
      // Fallback: rediriger vers login si pas d'email
      router.replace('/(auth)/login');
    }
  }, [params.email, router]);

  const handleVerifyOTP = async () => {
    if (!code || code.length !== 6) {
      Alert.alert('Code invalide', 'Veuillez entrer un code à 6 chiffres');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: 'email'
      });

      if (error) {
        if (error.message.includes('invalid') || error.message.includes('expired')) {
          Alert.alert(
            'Code invalide ou expiré',
            'Le code que vous avez saisi est incorrect ou a expiré. Veuillez demander un nouveau code.',
            [
              { text: 'OK' },
              { text: 'Renvoyer', onPress: handleResendCode }
            ]
          );
        } else {
          Alert.alert('Erreur', error.message);
        }
        return;
      }

      // Succès - redirection vers Home
      router.replace('/(app)/home');
    } catch (err: any) {
      Alert.alert('Erreur', err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) return;

    setResendLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email
      });

      if (error) {
        Alert.alert('Erreur', error.message);
      } else {
        Alert.alert('Code renvoyé', 'Un nouveau code a été envoyé à votre adresse email');
        setCode(''); // Reset le code
      }
    } catch (err: any) {
      Alert.alert('Erreur', err.message || 'Impossible de renvoyer le code');
    } finally {
      setResendLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.replace('/(auth)/login');
  };

  if (!email) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 16 }}>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16, justifyContent: 'center' }}>
      <View style={{ marginBottom: 32 }}>
        <Text style={{ fontSize: 24, fontWeight: '700', marginBottom: 8 }}>
          Vérification du code
        </Text>
        <Text style={{ fontSize: 16, color: '#6b7280', marginBottom: 8 }}>
          Entrez le code à 6 chiffres envoyé à :
        </Text>
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#1f2937' }}>
          {email}
        </Text>
      </View>

      <View style={{ marginBottom: 24 }}>
        <TextInput
          placeholder="123456"
          value={code}
          onChangeText={setCode}
          keyboardType="numeric"
          maxLength={6}
          style={{
            borderWidth: 1,
            borderColor: '#d1d5db',
            borderRadius: 8,
            padding: 16,
            fontSize: 18,
            textAlign: 'center',
            letterSpacing: 4,
            fontWeight: '600'
          }}
          autoFocus
        />
      </View>

      <TouchableOpacity
        onPress={handleVerifyOTP}
        disabled={loading || code.length !== 6}
        style={{
          backgroundColor: loading || code.length !== 6 ? '#9ca3af' : '#2563eb',
          padding: 16,
          borderRadius: 8,
          marginBottom: 16,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {loading ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
            Valider
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleResendCode}
        disabled={resendLoading}
        style={{
          padding: 12,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#d1d5db',
          marginBottom: 16,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {resendLoading ? (
          <ActivityIndicator color="#6b7280" size="small" />
        ) : (
          <Text style={{ color: '#6b7280', fontSize: 14 }}>
            Renvoyer le code
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleBackToLogin}
        style={{
          padding: 12,
          alignItems: 'center'
        }}
      >
        <Text style={{ color: '#2563eb', fontSize: 14 }}>
          Retour à la connexion
        </Text>
      </TouchableOpacity>
    </View>
  );
}
