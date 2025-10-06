export const config = { runtime: 'nodejs' };

// Types natifs Vercel (runtime nodejs22.x)

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).end();

  // Require JWT (we don't decode here; API is behind Supabase session on the app)
  const auth = req.headers.authorization || '';
  if (!auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing JWT' });
  }

  const { userId, expoPushToken, platform, isTester } = req.body || {};
  if (!userId || !expoPushToken || !platform) {
    return res.status(400).json({ error: 'userId, expoPushToken, platform required' });
  }

  try {
    // Upsert device using Supabase service role (server-only)
    const url = `${process.env.SUPABASE_URL}/rest/v1/devices`;
    const r = await fetch(url, {
      method: 'POST',
      headers: {
        apikey: process.env.SUPABASE_SERVICE_ROLE!,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates'
      },
      body: JSON.stringify({
        user_id: userId,
        expo_push_token: expoPushToken,
        platform,
        is_tester: !!isTester,
        updated_at: new Date().toISOString()
      })
    });

    if (!r.ok) {
      const t = await r.text().catch(() => '');
      return res.status(500).json({ error: 'supabase_upsert_failed', details: t });
    }

    return res.status(200).json({ ok: true });
  } catch (e: any) {
    return res.status(500).json({ error: 'unexpected', message: e?.message ?? 'unknown' });
  }
}
