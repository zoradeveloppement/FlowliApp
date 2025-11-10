import { createClient } from '@supabase/supabase-js'
import { Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

const url = process.env.EXPO_PUBLIC_SUPABASE_URL
const anon = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

if (!url) {
  throw new Error(
    'EXPO_PUBLIC_SUPABASE_URL is required. Please set it in your environment variables or Vercel project settings.'
  )
}

if (!anon) {
  throw new Error(
    'EXPO_PUBLIC_SUPABASE_ANON_KEY is required. Please set it in your environment variables or Vercel project settings.'
  )
}

export const supabase = createClient(url, anon, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storage: Platform.OS === 'web' ? undefined : AsyncStorage,
    detectSessionInUrl: Platform.OS === 'web'
  }
})
