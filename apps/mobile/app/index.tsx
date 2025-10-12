import { useEffect } from 'react'
import { useRouter, useSegments } from 'expo-router'
import { supabase } from '@/src/lib/supabase'

export default function Root() {
  const router = useRouter()
  const segments = useSegments()

  useEffect(() => {
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
          if (segments[0] !== '(auth)') router.replace('/(auth)/login')
        }
      }
    })
    return () => subscription?.unsubscribe()
  }, [router, segments])

  return null
}
