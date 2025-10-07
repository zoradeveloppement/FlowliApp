import { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/src/lib/supabase';

export default function VerifyOTP() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [resendTimer, setResendTimer] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const inputRef = useRef<TextInput>(null);

  // Timer pour le bouton renvoyer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Redirection si pas d'email
  useEffect(() => {
    if (!email) {
      router.replace('/(auth)/login');
    }
  }, [email, router]);

  // Fonction pour masquer l'email
  const maskEmail = (email: string) => {
    const [localPart, domain] = email.split('@');
    if (localPart.length <= 2) {
      return `${localPart[0]}***@${domain}`;
    }
    return `${localPart[0]}***@${domain}`;
  };

  // Vérification du code OTP
  const handleVerifyOTP = async () => {
    if (!code || code.length !== 6) {
      Alert.alert('Code invalide', 'Veuillez entrer un code à 6 chiffres');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email!,
        token: code,
        type: 'email'
      });

      if (error) {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        if (newAttempts >= 3) {
          // Bloquer après 3 tentatives
          setIsBlocked(true);
          setCode('');
          inputRef.current?.blur();
          Alert.alert(
            'Trop de tentatives',
            'Vous avez dépassé le nombre maximum de tentatives. Veuillez demander un nouveau code.',
            [
              { text: 'OK' },
              { text: 'Renvoyer', onPress: handleResendCode }
            ]
          );
        } else {
          Alert.alert(
            'Code invalide ou expiré',
            'Le code que vous avez saisi est incorrect ou a expiré. Veuillez demander un nouveau code.',
            [
              { text: 'OK' },
              { text: 'Renvoyer', onPress: handleResendCode }
            ]
          );
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

  // Renvoyer le code
  const handleResendCode = async () => {
    if (!email || resendTimer > 0) return;

    setResendLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email!
      });

      if (error) {
        Alert.alert('Erreur', error.message);
      } else {
        Alert.alert('Nouveau code envoyé', 'Un nouveau code a été envoyé à votre adresse email');
        setCode(''); // Reset le code
        setAttempts(0); // Reset les tentatives
        setIsBlocked(false); // Débloquer
        setResendTimer(60); // Timer de 60s
        inputRef.current?.focus(); // Refocus sur l'input
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
          {maskEmail(email)}
        </Text>
      </View>

      <View style={{ marginBottom: 24 }}>
        <TextInput
          ref={inputRef}
          placeholder="123456"
          value={code}
          onChangeText={setCode}
          keyboardType="numeric"
          maxLength={6}
          editable={!isBlocked}
          style={{
            borderWidth: 1,
            borderColor: isBlocked ? '#ef4444' : '#d1d5db',
            borderRadius: 8,
            padding: 16,
            fontSize: 18,
            textAlign: 'center',
            letterSpacing: 4,
            fontWeight: '600',
            backgroundColor: isBlocked ? '#fef2f2' : 'white'
          }}
          autoFocus
        />
        {isBlocked && (
          <Text style={{ color: '#ef4444', fontSize: 12, textAlign: 'center', marginTop: 4 }}>
            Trop de tentatives - Demandez un nouveau code
          </Text>
        )}
      </View>

      <TouchableOpacity
        onPress={handleVerifyOTP}
        disabled={loading || code.length !== 6 || isBlocked}
        style={{
          backgroundColor: loading || code.length !== 6 || isBlocked ? '#9ca3af' : '#2563eb',
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
        disabled={resendLoading || resendTimer > 0 || isBlocked}
        style={{
          padding: 12,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: resendTimer > 0 || isBlocked ? '#d1d5db' : '#2563eb',
          marginBottom: 16,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: resendTimer > 0 || isBlocked ? '#f3f4f6' : 'white'
        }}
      >
        {resendLoading ? (
          <ActivityIndicator color="#6b7280" size="small" />
        ) : (
          <Text style={{ 
            color: resendTimer > 0 || isBlocked ? '#9ca3af' : '#2563eb', 
            fontSize: 14 
          }}>
            {resendTimer > 0 ? `Renvoyer dans ${resendTimer}s` : 'Renvoyer le code'}
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