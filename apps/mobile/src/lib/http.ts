import { supabase } from '@/src/lib/supabase';

const API = process.env.EXPO_PUBLIC_API_URL!;

// Cache du token pour éviter les appels répétés à getSession()
let cachedToken: string | null = null;

// Listener pour les changements de session
supabase.auth.onAuthStateChange((_event, session) => {
  cachedToken = session?.access_token || null;
  console.log('Auth state changed:', _event, session ? 'Session active' : 'No session');
});

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
  
  const res = await fetch(`${API}${path}`, { headers });
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
