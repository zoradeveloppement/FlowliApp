import { useState } from 'react';
import { View, TextInput, Button, Text, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const sendMagicLink = async () => {
    if (!email) return Alert.alert('Email requis');
    setLoading(true);
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
        Alert.alert('Erreur', error.message);
      } else {
        Alert.alert(
          'Code envoyé',
          'Un code à 6 chiffres a été envoyé à votre email. Voulez-vous le saisir maintenant ?',
          [
            { text: 'Plus tard', style: 'cancel' },
            { text: 'Saisir le code', onPress: () => router.push(`/(auth)/verify-otp?email=${encodeURIComponent(email)}`) }
          ]
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    if (!email) return Alert.alert('Email requis');
    setResendLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email
      });
      if (error) {
        Alert.alert('Erreur', error.message);
      } else {
        Alert.alert('Code renvoyé', 'Un nouveau code a été envoyé à votre adresse email');
      }
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: '700', marginBottom: 8 }}>Connexion</Text>
      <TextInput
        placeholder="email@exemple.com"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth:1, borderColor:'#ccc', borderRadius:8, padding:12 }}
      />
      
      <TouchableOpacity
        onPress={sendMagicLink}
        disabled={loading}
        style={{
          backgroundColor: loading ? '#9ca3af' : '#2563eb',
          padding: 16,
          borderRadius: 8,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {loading ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
            Recevoir un code de connexion
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={resendCode}
        disabled={resendLoading || !email}
        style={{
          backgroundColor: resendLoading || !email ? '#f3f4f6' : '#f8fafc',
          padding: 12,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#d1d5db',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {resendLoading ? (
          <ActivityIndicator color="#6b7280" size="small" />
        ) : (
          <Text style={{ color: resendLoading || !email ? '#9ca3af' : '#6b7280', fontSize: 14 }}>
            Renvoyer le code
          </Text>
        )}
      </TouchableOpacity>

      <Text style={{ color:'#666', marginTop:8, fontSize:12 }}>
        Conseil: utilise un email auquel tu as accès depuis cet appareil.
      </Text>
    </View>
  );
}
