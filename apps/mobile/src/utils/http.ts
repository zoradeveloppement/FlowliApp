import { supabase } from '../lib/supabase';

const API_BASE = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/$/, '');
if (!API_BASE) console.warn('[HTTP] EXPO_PUBLIC_API_URL manquant');

export async function authHeaders(extra?: HeadersInit) {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  const base: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) base.Authorization = `Bearer ${token}`;
  return { ...base, ...(extra as any) };
}

async function handleResponse<T>(res: Response): Promise<{ ok: boolean; status: number; data: T | null; raw: string | null; }> {
  const status = res.status;
  const text = await res.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch { /* keep raw */ }
  return { ok: res.ok, status, data, raw: res.ok ? null : text };
}

export async function get<T = any>(path: string, init?: RequestInit) {
  const headers = await authHeaders(init?.headers);
  const res = await fetch(`${API_BASE}/${path}`, { ...init, method: 'GET', headers });
  return handleResponse<T>(res);
}

export async function post<T = any>(path: string, body?: any, init?: RequestInit) {
  const headers = await authHeaders(init?.headers);
  const res = await fetch(`${API_BASE}/${path}`, {
    ...init,
    method: 'POST',
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return handleResponse<T>(res);
}

export { API_BASE as API_URL };
