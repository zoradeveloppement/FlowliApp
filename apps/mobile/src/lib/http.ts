import { supabase } from '@/src/lib/supabase';

// Sécuriser l'URL de base
const rawBase = process.env.EXPO_PUBLIC_API_URL!;
const base = rawBase.replace(/\/+$/, ''); // strip trailing slashes

// Cache du token pour éviter les appels répétés à getSession()
let cachedToken: string | null = null;

// Listener pour les changements de session
supabase.auth.onAuthStateChange((_event, session) => {
  cachedToken = session?.access_token || null;
  console.log('Auth state changed:', _event, session ? 'Session active' : 'No session');
});

export async function httpJson(path: string, init: RequestInit = {}) {
  const base = process.env.EXPO_PUBLIC_API_URL!.replace(/\/+$/, '');
  const clean = path.replace(/^\/+/, '');
  const url = `${base}/${clean}`;

  const res = await fetch(url, {
    method: init.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
    body: init.body,
  });

  const text = await res.text().catch(() => '');
  if (__DEV__) console.log('[HTTP RAW]', res.status, url, text.slice(0, 300));

  if (!res.ok) throw new Error(`HTTP_${res.status}: ${text}`);
  try { return JSON.parse(text); } catch { return {}; }
}

export const get = (p: string, headers: any = {}) =>
  httpJson(p, { method: 'GET', headers });

export const post = (p: string, body: any, headers: any = {}) =>
  httpJson(p, { method: 'POST', headers, body: JSON.stringify(body) });
