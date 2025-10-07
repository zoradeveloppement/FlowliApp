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

export async function http(path: string, init: RequestInit = {}) {
  const cleanPath = path.replace(/^\/+/, ''); // strip leading slashes
  const url = `${base}/${cleanPath}`;
  
  // Utiliser le token en cache ou récupérer la session
  let token = cachedToken;
  if (!token) {
    const { data } = await supabase.auth.getSession();
    token = data.session?.access_token || null;
    cachedToken = token; // Mettre en cache
  }
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers || {}),
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const res = await fetch(url, {
    ...init,
    headers,
  });
  
  // Log minimal pour debug (désactivable en prod)
  if (__DEV__) console.log(`[HTTP] ${res.status} ${url}`);
  
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP_${res.status} on ${url}: ${text?.slice(0,200)}`);
  }
  
  return res.json().catch(() => ({}));
}

// Client HTTP sécurisé avec logging en dev
export async function httpJson(url: string, init?: RequestInit) {
  const res = await fetch(url, init);
  const text = await res.text();
  if (__DEV__) console.log('[HTTP RAW]', res.status, url, text.slice(0, 400));
  if (!res.ok) throw new Error(`HTTP_${res.status}: ${text}`);
  try {
    return JSON.parse(text);
  } catch {
    return {}; // jamais throw sur parse
  }
}

// Helpers pour les méthodes HTTP
export const get = (p: string, headers: any = {}) =>
  http(p, { method: 'GET', headers });

export const post = (p: string, body: any, headers: any = {}) =>
  http(p, { method: 'POST', body: JSON.stringify(body), headers });

// Auth header (Supabase JWT) — dans un wrapper
export async function authHeaders() {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiGet(path: string, opts?: { headers?: Record<string, string> }) {
  // Utiliser le token en cache ou récupérer la session
  let token = cachedToken;
  if (!token) {
    const { data } = await supabase.auth.getSession();
    token = data.session?.access_token || null;
    cachedToken = token; // Mettre en cache
  }
  
  const headers: Record<string, string> = { ...(opts?.headers || {}) };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const res = await fetch(`${base}/${path.replace(/^\/+/, '')}`, { headers });
  return res;
}

export async function apiJson(path: string, opts?: { headers?: Record<string,string> }) {
  const res = await apiGet(path, opts);
  const text = await res.text().catch(() => '');
  if (!res.ok) {
    // Gestion spéciale des erreurs d'authentification
    if (res.status === 401) {
      // Token expiré ou invalide - forcer la mise à jour
      cachedToken = null;
      console.warn('Token expired or invalid, clearing cache');
    }
    // Surface l'erreur côté UI et logs
    throw new Error(`HTTP_${res.status}${text ? `: ${text}` : ''}`);
  }
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    throw new Error(`HTTP_${res.status}: invalid JSON`);
  }
}

// Fonction utilitaire pour forcer la mise à jour du token
export function refreshAuthToken() {
  cachedToken = null;
  return supabase.auth.getSession().then(({ data }) => {
    cachedToken = data.session?.access_token || null;
    return cachedToken;
  });
}

// Fonction pour vérifier si l'utilisateur est authentifié
export function isAuthenticated(): boolean {
  return cachedToken !== null;
}
