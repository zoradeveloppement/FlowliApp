import { supabase } from '@/src/lib/supabase';

const API = process.env.EXPO_PUBLIC_API_URL!;

export async function apiGet(path: string, opts?: { headers?: Record<string, string> }) {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  const headers: Record<string, string> = { ...(opts?.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API}${path}`, { headers });
  return res;
}

export async function apiJson(path: string, opts?: { headers?: Record<string, string> }) {
  const res = await apiGet(path, opts);
  if (!res.ok) throw new Error(`HTTP_${res.status}`);
  return res.json();
}
