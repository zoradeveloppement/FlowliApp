import { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../src/lib/supabase';
import { post } from '../../src/lib/http';
import { Screen } from '../../src/ui/layout';
import { Input, Button, Card, Snackbar } from '../../src/ui/components';
import { tokens } from '../../src/theme/tokens';

// Email masking utility
function maskEmail(email: string) {
  const atIndex = email.indexOf('@');
  if (atIndex <= 0) return email;
  return email[0] + '***' + email.slice(atIndex);
}

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password strength scoring (0-4 scale)
function scorePassword(password: string): number {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return Math.min(score, 4);
}

export default function Signup() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState<{ type: 'success' | 'error' | 'info'; msg: string } | null>(null);

  const handleCheckEmail = async () => {
    const emailTrimmed = email.trim().toLowerCase();
    
    if (!emailRegex.test(emailTrimmed)) {
      setSnack({ type: 'error', msg: 'Adresse e-mail invalide' });
      return;
    }

    setLoading(true);
    try {
      const response = await post('auth/check-contact', { email: emailTrimmed });
      
      if (response?.allowed) {
        setStep(2);
        setSnack({ type: 'success', msg: 'Email autorisé ✅' });
      } else {
        setSnack({ 
          type: 'info', 
          msg: 'Merci, votre demande a bien été prise en compte.' 
        });
      }
    } catch (error: any) {
      console.error('Check contact error:', error);
      setSnack({ type: 'error', msg: 'Une erreur est survenue. Réessayez.' });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    const emailTrimmed = email.trim().toLowerCase();
    
    // Validation
    if (!emailRegex.test(emailTrimmed)) {
      setSnack({ type: 'error', msg: 'Email invalide' });
      return;
    }
    
    if (password.length < 8) {
      setSnack({ type: 'error', msg: 'Mot de passe trop court (minimum 8 caractères)' });
      return;
    }
    
    if (password !== confirmPassword) {
      setSnack({ type: 'error', msg: 'Les mots de passe ne correspondent pas' });
      return;
    }

    setLoading(true);
    try {
      const response = await post('auth/register', { 
        email: emailTrimmed, 
        password 
      });

      if (response?.created === true) {
        // Auto-login after successful registration
        const { error } = await supabase.auth.signInWithPassword({ 
          email: emailTrimmed, 
          password 
        });
        
        if (error) {
          throw error;
        }
        
        setSnack({ type: 'success', msg: 'Compte créé avec succès ✅' });
        router.replace('/(app)/home');
        return;
      }
      
      if (response?.reason === 'exists') {
        setSnack({ 
          type: 'info', 
          msg: 'Ce compte existe déjà. Connectez-vous.' 
        });
        return;
      }
      
      if (response?.reason === 'invalid') {
        setSnack({ 
          type: 'error', 
          msg: 'Données invalides. Vérifiez votre email et mot de passe.' 
        });
        return;
      }
      
      // Generic response for other cases (not authorized, etc.)
      setSnack({ 
        type: 'info', 
        msg: 'Merci, votre demande a bien été prise en compte.' 
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      setSnack({ type: 'error', msg: 'Impossible de créer le compte. Réessayez.' });
    } finally {
      setLoading(false);
    }
  };

  const passwordScore = scorePassword(password);
  const strengthLabels = ['Très faible', 'Faible', 'Moyen', 'Bon', 'Fort'];
  const strengthLabel = strengthLabels[passwordScore];

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
          <View className="flex-1 items-stretch justify-center px-8 py-12" style={styles.mainContainer}>
            {/* Branding */}
            <View className="items-center mb-8" style={styles.brandingContainer}>
              <View className="w-14 h-14 rounded-full bg-violet-600 items-center justify-center mb-3" style={styles.logoContainer}>
                <Text className="text-white text-2xl font-bold" style={styles.logoText}>F</Text>
              </View>
              <Text className="text-xs tracking-widest text-gray-500 font-semibold" style={styles.brandText}>FLOWLI</Text>
            </View>

            <Card className="w-full max-w-md mx-auto">
              {step === 1 ? (
                <View>
                  <Text className="text-2xl font-bold text-gray-900 text-center mb-2" style={styles.title}>
                    Créer un compte
                  </Text>
                  <Text className="text-sm text-gray-500 text-center mb-6" style={styles.subtitle}>
                    Entrez votre adresse e-mail pour continuer.
                  </Text>
                  
                  <Input
                    label="Email"
                    placeholder="email@exemple.com"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className="mb-4"
                  />
                  
                  <Button
                    title={loading ? 'Vérification...' : 'Continuer'}
                    variant="primary"
                    onPress={handleCheckEmail}
                    disabled={loading || !email.trim()}
                    className="mb-4"
                  />
                  
                  <Button
                    title="J'ai déjà un compte"
                    variant="ghost"
                    onPress={() => router.replace('/(auth)/login')}
                    className="mb-2"
                  />
                </View>
              ) : (
                <View>
                  <Text className="text-2xl font-bold text-gray-900 text-center mb-2" style={styles.title}>
                    Bienvenue
                  </Text>
                  <Text className="text-sm text-gray-500 text-center mb-6" style={styles.subtitle}>
                    Compte autorisé pour {maskEmail(email)}. Choisissez un mot de passe.
                  </Text>
                  
                  <Input
                    label="Mot de passe (minimum 8 caractères)"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    className="mb-3"
                  />
                  
                  {/* Password strength indicator */}
                  <View className="mb-3">
                    <View className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <View 
                        className="h-2 bg-violet-600 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${(passwordScore / 4) * 100}%`,
                          backgroundColor: passwordScore < 2 ? '#F44336' : passwordScore < 3 ? '#FF9800' : '#7C3AED'
                        }}
                      />
                    </View>
                    <Text className="text-xs text-gray-500 mt-1">
                      Robustesse : {strengthLabel}
                    </Text>
                  </View>
                  
                  <Input
                    label="Confirmer le mot de passe"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    className="mb-4"
                  />
                  
                  <Button
                    title={loading ? 'Création...' : 'Créer mon compte'}
                    variant="primary"
                    onPress={handleRegister}
                    disabled={loading || !password || !confirmPassword}
                    className="mb-4"
                  />
                  
                  <Button
                    title="Changer d'e-mail"
                    variant="ghost"
                    onPress={() => setStep(1)}
                    className="mb-2"
                  />
                </View>
              )}
            </Card>

            {/* Trust badge */}
            <View className="items-center mt-6" style={styles.trustContainer}>
              <View className="flex-row items-center bg-gray-50 rounded-full px-3.5 py-2" style={styles.trustBadge}>
                <View className="w-4 h-4 rounded-full bg-emerald-500 items-center justify-center mr-2" style={styles.checkIcon}>
                  <Text className="text-white text-[10px] font-bold" style={styles.checkText}>✓</Text>
                </View>
                <Text className="text-gray-600 text-[12px] font-medium" style={styles.trustText}>
                  Inscription sécurisée
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Snackbar */}
      {snack && (
        <Snackbar
          type={snack.type}
          message={snack.msg}
          visible={true}
          onHide={() => setSnack(null)}
        />
      )}
    </View>
  );
}

// Styles harmonisés avec la DA de l'onboarding
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.backgroundLight,
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
    paddingHorizontal: tokens.spacing[8],
    paddingVertical: tokens.spacing[12],
  },
  brandingContainer: {
    alignItems: 'center',
    marginBottom: tokens.spacing[8],
  },
  logoContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: tokens.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: tokens.spacing[3],
  },
  logoText: {
    color: tokens.colors.primaryForeground,
    fontSize: tokens.font.sizes.xl,
    fontWeight: tokens.font.weights.bold,
  },
  brandText: {
    fontSize: tokens.font.sizes.xs,
    letterSpacing: 2,
    color: tokens.colors.mutedForegroundLight,
    fontWeight: tokens.font.weights.semibold,
  },
  title: {
    fontSize: tokens.font.sizes.xl,
    fontWeight: tokens.font.weights.bold,
    color: tokens.colors.foregroundLight,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: tokens.font.sizes.sm,
    color: tokens.colors.mutedForegroundLight,
    textAlign: 'center',
  },
  trustContainer: {
    alignItems: 'center',
    marginTop: tokens.spacing[6],
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: tokens.colors.mutedLight,
    borderRadius: tokens.radius.full,
    paddingHorizontal: tokens.spacing[3] + 2,
    paddingVertical: tokens.spacing[2],
  },
  checkIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: tokens.colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: tokens.spacing[2],
  },
  checkText: {
    color: tokens.colors.primaryForeground,
    fontSize: 10,
    fontWeight: tokens.font.weights.bold,
  },
  trustText: {
    color: '#4B5563',
    fontSize: tokens.font.sizes.xs,
    fontWeight: tokens.font.weights.medium,
  },
});
