import { get } from '../utils/http';
import { normalizeTasks, Task } from './parseTasks';

export async function fetchTasks(params: Record<string,string|undefined> = {}) {
  const qs = new URLSearchParams();
  for (const [k,v] of Object.entries(params)) if (v != null && v !== '') qs.set(k, String(v));
  const url = `me/tasks${qs.toString() ? `?${qs}` : ''}`;

  const resp = await get(url);
  if (!resp.ok) {
    throw new Error(resp.raw || `HTTP ${resp.status}`);
  }
  
  const { items, count } = normalizeTasks(resp.data as any);
  return { items, count, raw: resp.data }; // raw pour debug UI
}

// Fonction de test d'authentification avec debug
export async function testAuthFlow(email?: string) {
  // Log du token pour debug
  if (__DEV__) {
    const { data } = await import('../lib/supabase').then(m => m.supabase.auth.getSession());
    console.log('[WEB] token head', data.session?.access_token?.slice(0,10));
  }
  
  // Test avec X-Debug si email fourni
  if (email) {
    const debugUrl = `me/tasks?email=${encodeURIComponent(email)}&statuses=A faire,En cours,En retard`;
    console.log('[DEBUG] Testing with X-Debug and email override:', email);
    const resp = await get(debugUrl, { headers: { 'X-Debug': '1' } });
    return resp.data;
  }
  
  // Test normal
  const url = `me/tasks?statuses=A faire,En cours,En retard`;
  const resp = await get(url);
  return resp.data;
}
