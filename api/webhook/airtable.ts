import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

type AnyRec = Record<string, any>;

function safeBody(req: VercelRequest): AnyRec {
  const b = req.body as any;
  return typeof b === 'object' && b !== null ? b : {};
}

function pickInfo(p: AnyRec): { customerId?: string; status?: string } {
  const directId = p.customerId ?? p.customerID ?? p.customer_id;
  const directStatus = p.status ?? p.newStatus ?? p.state;
  const nested = p.record ?? p.fields ?? {};
  const nestedId = nested.customerId ?? nested.customerID ?? nested.customer_id;
  const nestedStatus = nested.status ?? nested.newStatus ?? nested.state;
  return {
    customerId: (directId ?? nestedId)?.toString(),
    status: (directStatus ?? nestedStatus)?.toString(),
  };
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    return res.status(200).json({ message: 'Airtable webhook ready' });
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const expected = process.env.WEBHOOK_SECRET;
    const got = (req.headers['x-webhook-secret'] || req.headers['X-Webhook-Secret']) as string | undefined;
    if (!expected || !got || got !== expected) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const audienceHeader = (req.headers['x-push-audience'] || req.headers['X-Push-Audience']) as string | undefined;
    const audience: 'testers' | 'all' = audienceHeader === 'all' ? 'all' : 'testers';

    const body = safeBody(req);
    const { customerId, status } = pickInfo(body);

    const SUPABASE_URL = process.env.SUPABASE_URL!;
    const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE!;
    const EXPO_PUSH_ENDPOINT = process.env.EXPO_PUSH_ENDPOINT || 'https://exp.host/--/api/v2/push/send';

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, { auth: { persistSession: false } });

    // fetch tokens
    let query = supabase.from('devices')
      .select('expo_push_token, is_tester')
      .not('expo_push_token', 'is', null);
    if (audience === 'testers') query = query.eq('is_tester', true);

    const { data, error } = await query;
    if (error) {
      console.error(JSON.stringify({
        event: 'airtable_webhook_query_error',
        audience, customerId, status,
        message: error.message, code: error.code,
        timestamp: new Date().toISOString(),
      }));
      return res.status(500).json({ error: 'Server error' });
    }

    const tokens = (data ?? []).map(d => d.expo_push_token as string).filter(Boolean);
    const tokenCount = tokens.length;

    let successCount = 0;
    let failureCount = 0;

    if (tokenCount > 0) {
      const messages = tokens.map(to => ({
        to,
        title: 'Statut mis à jour',
        body: customerId && status ? `Client ${customerId} → ${status}` : 'Votre statut a été mis à jour',
        data: { customerId, status, source: 'airtable' },
      }));

      for (const batch of chunk(messages, 100)) {
        const resp = await fetch(EXPO_PUSH_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(batch),
        });
        const json = await resp.json().catch(() => null) as any;
        const results = Array.isArray(json?.data) ? json.data : [];
        for (const r of results) {
          if (r?.status === 'ok') successCount++; else failureCount++;
        }
      }
    }

    console.log(JSON.stringify({
      event: 'airtable_webhook',
      audience, customerId, status,
      tokenCount, successCount, failureCount,
      timestamp: new Date().toISOString(),
    }));

    return res.status(200).json({ ok: true, audience, tokenCount, successCount, failureCount });
  } catch (e: any) {
    console.error(JSON.stringify({
      event: 'airtable_webhook_exception',
      message: e?.message,
      stack: e?.stack?.split('\n')[0],
      timestamp: new Date().toISOString(),
    }));
    
    if (req.headers['x-debug'] === '1') {
      return res.status(500).json({ error: 'Server error', hint: String(e?.message || '') });
    } else {
      return res.status(500).json({ error: 'Server error' });
    }
  }
}