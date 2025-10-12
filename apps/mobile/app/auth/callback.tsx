import { useEffect, useMemo, useState } from 'react'
import { Platform, View, Text, KeyboardAvoidingView, ScrollView, StatusBar, StyleSheet, TouchableOpacity } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { supabase } from '@/src/lib/supabase'
import { Screen } from '../../src/ui/layout'
import { Input, Button, Snackbar, Card } from '../../src/ui/components'

function parseHash(hash: string) {
  const trimmed = hash.replace(/^#/, '')
  const params = new URLSearchParams(trimmed)
  return Object.fromEntries(params.entries())
}

export default function AuthCallback() {
  const router = useRouter()
  const params = useLocalSearchParams() as Record<string, string | string[]>
  const type = Array.isArray(params.type) ? params.type[0] : params.type

  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      try {
        if (Platform.OS === 'web') {
          const url = new URL(window.location.href)
          const code = url.searchParams.get('code')
          if (code) {
            const { error } = await supabase.auth.exchangeCodeForSession(code)
            if (error) throw error
          } else {
            const hashData = parseHash(window.location.hash || '')
            const qAccess = url.searchParams.get('access_token')
            const qRefresh = url.searchParams.get('refresh_token')
            const access_token = qAccess || hashData['access_token'] || undefined
            const refresh_token = qRefresh || hashData['refresh_token'] || undefined
            if (access_token && refresh_token) {
              const { error } = await supabase.auth.setSession({ access_token, refresh_token })
              if (error) throw error
            }
          }
        }
      } catch (e: any) {
        setError(e?.message ?? 'Impossible d\'établir la session de récupération.')
      } finally {
        setReady(true)
      }
    })()
  }, [])

  const canSubmit = useMemo(() => {
    return password.length >= 8 && password === confirm
  }, [password, confirm])

  const onSubmit = async () => {
    if (!canSubmit) return
    setSubmitting(true)
    setError(null)
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      setSuccess('Mot de passe mis à jour. Vous pouvez vous reconnecter.')
      // Option : rediriger après 1–2s
      setTimeout(() => router.replace('/(auth)/login'), 1200)
    } catch (e: any) {
      setError(e?.message ?? 'Échec de la mise à jour du mot de passe.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!ready) return null

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

            {/* Titre + sous-titre */}
            <View className="mb-8" style={styles.titleContainer}>
              <Text className="text-2xl font-bold text-gray-900 text-center" style={styles.title}>
                Réinitialiser le mot de passe
              </Text>
              <Text className="text-sm text-gray-500 text-center mt-2" style={styles.subtitle}>
                {type !== 'recovery' 
                  ? 'Vous êtes sur la page de réinitialisation.'
                  : 'Choisissez un nouveau mot de passe sécurisé.'
                }
              </Text>
            </View>

            {/* Formulaire de reset */}
            <Card className="mb-6" style={styles.formCard}>
              <View className="mb-4" style={styles.formContainer}>
                <Input
                  label="Nouveau mot de passe"
                  placeholder="Au moins 8 caractères"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  error={error ?? undefined}
                  helperText="Utilisez un mot de passe fort avec des lettres, chiffres et symboles"
                  className="rounded-2xl text-base mb-3"
                />
                <Input
                  label="Confirmer le nouveau mot de passe"
                  placeholder="Répétez le mot de passe"
                  value={confirm}
                  onChangeText={setConfirm}
                  secureTextEntry
                  error={password !== confirm && confirm.length > 0 ? 'Les mots de passe ne correspondent pas' : undefined}
                  className="rounded-2xl text-base"
                />
              </View>

              {/* CTA */}
              <Button
                title={submitting ? 'Mise à jour…' : 'Mettre à jour le mot de passe'}
                variant="primary"
                onPress={onSubmit}
                disabled={!canSubmit || submitting}
                className="rounded-full py-3.5 mb-4"
              />

              {/* Retour à la connexion */}
              <TouchableOpacity
                onPress={() => router.replace('/(auth)/login')}
                activeOpacity={0.7}
                className="items-center"
                style={styles.backLink}
              >
                <Text className="text-violet-600 text-base font-medium" style={styles.backLinkText}>
                  Retour à la connexion
                </Text>
              </TouchableOpacity>
            </Card>

            {/* Badge de confiance */}
            <View className="items-center mt-6" style={styles.trustContainer}>
              <View className="flex-row items-center bg-gray-50 rounded-full px-3.5 py-2" style={styles.trustBadge}>
                <View className="w-4 h-4 rounded-full bg-emerald-500 items-center justify-center mr-2" style={styles.checkIcon}>
                  <Text className="text-white text-[10px] font-bold" style={styles.checkText}>✓</Text>
                </View>
                <Text className="text-gray-600 text-[12px] font-medium" style={styles.trustText}>
                  Connexion sécurisée
                </Text>
              </View>
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
  )
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
  formCard: {
    marginBottom: 24,
  },
  formContainer: {
    marginBottom: 16,
  },
  backLink: {
    alignItems: 'center',
  },
  backLinkText: {
    color: '#7C3AED',
    fontSize: 16,
    fontWeight: '500',
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
})
