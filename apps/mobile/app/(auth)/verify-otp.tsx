import { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/src/lib/supabase';
import { Screen } from '../../src/ui/layout';
import { Button, Snackbar } from '../../src/ui/components';

export default function VerifyOTP() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [resendTimer, setResendTimer] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [expiryTimer, setExpiryTimer] = useState(300);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const inputRefs = useRef<(TextInput | null)[]>([]);

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

  // Timer d'expiration
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (expiryTimer > 0) {
      interval = setInterval(() => {
        setExpiryTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [expiryTimer]);

  // Redirection si pas d'email
  useEffect(() => {
    if (!email) {
      router.replace('/(auth)/login');
    } else {
      // Focus premier input
      setTimeout(() => inputRefs.current[0]?.focus(), 300);
    }
  }, [email, router]);

  // Fonction pour masquer l'email
  const maskEmail = (email: string) => {
    const [localPart, domain] = email.split('@');
    if (localPart.length <= 2) {
      return `${localPart[0]}***@${domain}`;
    }
    return `${localPart.substring(0, 2)}***@${domain}`;
  };

  // Gestion de la saisie d'un chiffre
  const handleCodeChange = (text: string, index: number) => {
    if (isBlocked) return;
    
    const newCode = [...code];
    
    // Si on colle un code complet
    if (text.length === 6 && index === 0) {
      const digits = text.split('').slice(0, 6);
      setCode(digits);
      inputRefs.current[5]?.focus();
      return;
    }
    
    // Saisie normale
    const digit = text.slice(-1);
    if (/^\d$/.test(digit) || digit === '') {
      newCode[index] = digit;
      setCode(newCode);
      
      // Auto-focus sur le champ suivant
      if (digit && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  // Gestion du backspace
  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Vérification du code OTP
  const handleVerifyOTP = async () => {
    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      setError('Veuillez entrer le code complet');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: email!,
        token: fullCode,
        type: 'email'
      });

      if (error) {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        if (newAttempts >= 3) {
          setIsBlocked(true);
          setCode(['', '', '', '', '', '']);
          setError('Trop de tentatives. Demandez un nouveau code.');
        } else {
          setError('Code invalide. Réessayez.');
          setCode(['', '', '', '', '', '']);
          inputRefs.current[0]?.focus();
        }
        return;
      }

      setSuccess('Connexion réussie !');
      setTimeout(() => {
        router.replace('/(app)/home');
      }, 800);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  // Renvoyer le code
  const handleResendCode = async () => {
    if (!email || resendTimer > 0) return;

    setResendLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email!
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess('Nouveau code envoyé');
        setCode(['', '', '', '', '', '']);
        setAttempts(0);
        setIsBlocked(false);
        setResendTimer(60);
        setExpiryTimer(300);
        setTimeout(() => inputRefs.current[0]?.focus(), 300);
      }
    } catch (err: any) {
      setError(err.message || 'Impossible de renvoyer le code');
    } finally {
      setResendLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.replace('/(auth)/login');
  };

  // Formatage du temps
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!email) {
    return (
      <Screen className="bg-white">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#7C3AED" />
        </View>
      </Screen>
    );
  }

  const isCodeComplete = code.every(digit => digit !== '');

  return (
    <Screen className="bg-white">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 px-6 pt-12">
          {/* Header avec bouton retour */}
          <TouchableOpacity 
            onPress={handleBackToLogin}
            className="mb-8"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center">
              <Text className="text-2xl mr-2">←</Text>
              <Text className="text-gray-600 text-base">Retour</Text>
            </View>
          </TouchableOpacity>

          {/* Titre */}
          <View className="mb-10">
            <Text className="text-4xl font-bold text-gray-900 mb-3">
              Vérification
            </Text>
            <Text className="text-base text-gray-500 leading-relaxed">
              Code envoyé à{'\n'}
              <Text className="font-semibold text-gray-700">{maskEmail(email)}</Text>
            </Text>
          </View>

          {/* Inputs code - Style moderne */}
          <View className="mb-8">
            <View className="flex-row justify-between mb-4">
              {code.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={ref => inputRefs.current[index] = ref}
                  value={digit}
                  onChangeText={(text) => handleCodeChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={index === 0 ? 6 : 1}
                  editable={!isBlocked && !loading}
                  className={`
                    flex-1 mx-1.5 h-16 rounded-2xl text-center text-2xl font-bold
                    ${digit ? 'bg-violet-50 border-2 border-violet-600 text-violet-600' : 'bg-gray-50 border-2 border-gray-200 text-gray-900'}
                    ${isBlocked ? 'opacity-50' : 'opacity-100'}
                  `}
                  style={{ textAlignVertical: 'center' }}
                />
              ))}
            </View>
            
            {/* Timer d'expiration */}
            {expiryTimer > 0 && expiryTimer < 60 && (
              <Text className="text-center text-sm text-orange-600">
                Expire dans {formatTime(expiryTimer)}
              </Text>
            )}
          </View>

          {/* Bouton principal */}
          <Button
            title={loading ? "Vérification..." : "Valider"}
            variant="primary"
            onPress={handleVerifyOTP}
            disabled={loading || !isCodeComplete || isBlocked}
            className="rounded-full py-4 mb-6"
          />

          {/* Renvoyer le code */}
          <TouchableOpacity
            onPress={handleResendCode}
            disabled={resendLoading || resendTimer > 0 || isBlocked}
            activeOpacity={0.7}
            className="items-center py-3"
          >
            <Text className={`text-base ${
              resendLoading || resendTimer > 0 || isBlocked 
                ? 'text-gray-400' 
                : 'text-violet-600 font-medium'
            }`}>
              {resendLoading 
                ? "Envoi..." 
                : resendTimer > 0 
                  ? `Renvoyer dans ${resendTimer}s` 
                  : 'Renvoyer le code'
              }
            </Text>
          </TouchableOpacity>

          {/* Info sécurité */}
          {attempts > 0 && attempts < 3 && (
            <View className="mt-6 bg-orange-50 rounded-2xl p-4">
              <Text className="text-sm text-orange-700 text-center">
                {3 - attempts} tentative{3 - attempts > 1 ? 's' : ''} restante{3 - attempts > 1 ? 's' : ''}
              </Text>
            </View>
          )}
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