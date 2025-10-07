import { httpJson, authHeaders } from '../lib/http';
import { normalizeTasks, Task } from './parseTasks';

export async function fetchTasks(params: Record<string,string|undefined> = {}) {
  const base = process.env.EXPO_PUBLIC_API_URL!.replace(/\/+$/,'');
  const qs = new URLSearchParams();
  for (const [k,v] of Object.entries(params)) if (v != null && v !== '') qs.set(k, String(v));
  const url = `${base}/me/tasks${qs.toString() ? `?${qs}` : ''}`;

  const headers = { ...(await authHeaders()) };
  const raw = await httpJson(url, { headers });
  const { items, count } = normalizeTasks(raw as any);
  return { items, count, raw }; // raw pour debug UI
}

// Fonction de test d'authentification avec debug
export async function testAuthFlow(email?: string) {
  const base = process.env.EXPO_PUBLIC_API_URL!.replace(/\/+$/,'');
  const headers = { ...(await authHeaders()) };
  
  // Log du token pour debug
  if (__DEV__) {
    const { data } = await import('../lib/supabase').then(m => m.supabase.auth.getSession());
    console.log('[WEB] token head', data.session?.access_token?.slice(0,10));
  }
  
  // Test avec X-Debug si email fourni
  if (email) {
    const debugHeaders = { ...headers, 'X-Debug': '1' };
    const debugUrl = `${base}/me/tasks?email=${encodeURIComponent(email)}&statuses=A faire,En cours,En retard`;
    console.log('[DEBUG] Testing with X-Debug and email override:', email);
    return await httpJson(debugUrl, { headers: debugHeaders });
  }
  
  // Test normal
  const url = `${base}/me/tasks?statuses=A faire,En cours,En retard`;
  return await httpJson(url, { headers });
}
