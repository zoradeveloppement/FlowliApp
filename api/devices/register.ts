import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { applyCors, handlePreflight } from '../_cors';

export const config = { runtime: 'nodejs' };

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;         // pour vérifier le JWT
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE!; // pour écrire en base sans RLS

// Helper: obtenir l'utilisateur depuis le JWT Authorization
async function getUserFromAuthHeader(req: VercelRequest) {
  const auth = req.headers.authorization || req.headers.Authorization as string | undefined;
  if (!auth || !auth.toString().toLowerCase().startsWith('bearer ')) return null;
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: auth } }
  });
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) return null;
  return data.user;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const pf = handlePreflight(req, res); if (pf !== undefined) return;
  applyCors(req, res);

  if (req.method !== 'POST') return res.status(405).end();

  // TODO: rate-limit(IP, 'devices:register')

  try {
    // 1) Auth via JWT
    const user = await getUserFromAuthHeader(req);
    if (!user) {
      return res.status(401).json({ error: 'unauthorized' });
    }

    // 2) Payload client minimal
    const expoPushToken = String(req.body?.expoPushToken ?? '').trim();
    const platformRaw = String(req.body?.platform ?? '').trim().toLowerCase();
    const appVersion = req.body?.appVersion ? String(req.body.appVersion) : null;

    if (!expoPushToken || !platformRaw) {
      return res.status(400).json({ error: 'invalid_payload' });
    }
    const platform = ['ios','android','web'].includes(platformRaw) ? platformRaw : 'unknown';

    // 3) Upsert en base (service role)
    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);
    // NOTE: adapter le onConflict selon ta contrainte unique. Ici on prend (user_id, expo_push_token).
    const payload = {
      user_id: user.id,
      user_email: (user.email || '').toLowerCase(),
      expo_push_token: expoPushToken,
      platform,
      app_version: appVersion,
      last_seen_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { error: dbError } = await admin
      .from('devices')
      .upsert(payload, { onConflict: 'expo_push_token' });

    if (dbError) {
      console.error('[devices/register] upsert_error', { code: dbError.code, msg: dbError.message });
      return res.status(500).json({ error: 'server_error' });
    }

    // 4) OK
    if (process.env.NODE_ENV !== 'production') {
      console.log(JSON.stringify({
        evt: 'devices_register_ok',
        uid: user.id,
        email: (user.email || '').replace(/(^.).*(@.*$)/, '$1***$2'),
        platform,
        tokenPrefix: expoPushToken.slice(0, 8),
      }));
    }
    return res.status(200).json({ ok: true });
  } catch (e: any) {
    console.error('[devices/register] fatal', { msg: e?.message });
    return res.status(500).json({ error: 'server_error' });
  }
}
