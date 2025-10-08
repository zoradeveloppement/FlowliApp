import { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, Clipboard } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/src/lib/supabase';
import { Screen } from '../../src/ui/layout';
import { Input, Button, Card, Snackbar } from '../../src/ui/components';

export default function VerifyOTP() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [resendTimer, setResendTimer] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [expiryTimer, setExpiryTimer] = useState(300); // 5 minutes en secondes
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
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

  // Timer d'expiration (5 minutes)
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
    }
  }, [email, router]);

  // Vérification du presse-papiers au chargement
  useEffect(() => {
    const checkClipboard = async () => {
      try {
        const clipboardContent = await Clipboard.getString();
        // Vérifier si le contenu est un code à 6 chiffres
        if (/^\d{6}$/.test(clipboardContent)) {
          setCode(clipboardContent);
        }
      } catch (error) {
        // Ignorer les erreurs de presse-papiers
      }
    };
    
    checkClipboard();
  }, []);

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
      setError('Veuillez entrer un code à 6 chiffres');
      return;
    }

    setLoading(true);
    setError(null);
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
          setError('Trop de tentatives. Demandez un nouveau code.');
        } else {
          setError('Code invalide ou expiré. Demandez un nouveau code.');
        }
        return;
      }

      // Succès - redirection vers Home
      setSuccess('Connexion réussie !');
      setTimeout(() => {
        router.replace('/(app)/home');
      }, 1000);
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
        setSuccess('Un nouveau code a été envoyé à votre adresse email');
        setCode(''); // Reset le code
        setAttempts(0); // Reset les tentatives
        setIsBlocked(false); // Débloquer
        setResendTimer(60); // Timer de 60s
        setExpiryTimer(300); // Reset timer d'expiration (5 min)
        inputRef.current?.focus(); // Refocus sur l'input
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

  const handleChangeEmail = () => {
    router.replace('/(auth)/login');
  };

  // Formatage du temps d'expiration
  const formatExpiryTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!email) {
    return (
      <Screen>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" />
          <Text className="text-body text-textMuted mt-4">Chargement...</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View className="flex-1 justify-center">
        <Card className="mb-6">
          <Text className="text-h1 text-textMain mb-2">Vérification du code</Text>
          <Text className="text-body text-textMuted mb-4">
            Entrez le code à 6 chiffres envoyé à :
          </Text>
          
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-body text-textMain font-medium">
              {maskEmail(email)}
            </Text>
            <TouchableOpacity onPress={handleChangeEmail}>
              <Text className="text-primary text-secondary font-medium">
                Changer d'email
              </Text>
            </TouchableOpacity>
          </View>
          
          {expiryTimer > 0 && (
            <Text className="text-danger text-secondary text-center mb-4">
              Expire dans {formatExpiryTime(expiryTimer)}
            </Text>
          )}
          
          <Input
            label="Code de vérification"
            placeholder="123456"
            value={code}
            onChangeText={setCode}
            keyboardType="numeric"
            maxLength={6}
            error={isBlocked ? 'Trop de tentatives - Demandez un nouveau code' : undefined}
            className={isBlocked ? 'border-danger bg-red-50' : ''}
          />
          
          <Button
            title={loading ? "Vérification..." : "Valider"}
            variant="primary"
            onPress={handleVerifyOTP}
            disabled={loading || code.length !== 6 || isBlocked}
            className="mt-4"
          />
          
          <Button
            title={
              resendLoading 
                ? "Envoi en cours..." 
                : resendTimer > 0 
                  ? `Renvoyer dans ${resendTimer}s` 
                  : 'Renvoyer le code'
            }
            variant="secondary"
            onPress={handleResendCode}
            disabled={resendLoading || resendTimer > 0 || isBlocked}
            className="mt-3"
          />
          
          <TouchableOpacity
            onPress={handleBackToLogin}
            className="mt-4 items-center"
          >
            <Text className="text-primary text-secondary">
              Retour à la connexion
            </Text>
          </TouchableOpacity>
        </Card>
      </View>
      
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