import { httpJson } from '../lib/http';
import { normalizeTasks, Task } from './parseTasks';
import { authHeaders } from '../lib/http';

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
