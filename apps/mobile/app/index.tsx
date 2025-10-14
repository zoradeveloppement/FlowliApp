import { useEffect, useState } from 'react'
import { useRouter, useSegments } from 'expo-router'
import { supabase } from '@/src/lib/supabase'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { View, ActivityIndicator, StyleSheet } from 'react-native'

const ONBOARDING_SEEN_KEY = '@flowli_onboarding_seen'

export default function Root() {
  const router = useRouter()
  const segments = useSegments()
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true)

  // Vérifier si l'onboarding a déjà été vu
  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const hasSeenOnboarding = await AsyncStorage.getItem(ONBOARDING_SEEN_KEY)
        
        if (!hasSeenOnboarding) {
          // Première visite : afficher l'onboarding
          router.replace('/(public)/onboarding')
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error)
      } finally {
        setIsCheckingOnboarding(false)
      }
    }

    checkOnboarding()
  }, [])

  // Gérer l'authentification
  useEffect(() => {
    if (isCheckingOnboarding) return

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Important: si on est dans un flux de récupération de mdp, on pousse vers la page dédiée
      if (event === 'PASSWORD_RECOVERY') {
        router.replace('/auth/callback?type=recovery')
        return
      }
      
      // Sinon logique standard
      if (session) {
        if (segments[0] !== '(app)') router.replace('/(app)/home')
      } else {
        // NE PAS forcer la redirection si on arrive depuis un lien avec "code" ou "type=recovery"
        const href = typeof window !== 'undefined' ? window.location.href : ''
        const shouldHold =
          href.includes('type=recovery') ||
          href.includes('code=') ||
          href.includes('access_token=')
        
        if (!shouldHold) {
          // Si pas dans l'onboarding ni dans l'auth, rediriger vers login
          if (segments[0] !== '(auth)' && segments[0] !== '(public)') {
            router.replace('/(auth)/login')
          }
        }
      }
    })
    
    return () => subscription?.unsubscribe()
  }, [router, segments, isCheckingOnboarding])

  // Afficher un loader pendant la vérification
  if (isCheckingOnboarding) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    )
  }

  return null
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
})
