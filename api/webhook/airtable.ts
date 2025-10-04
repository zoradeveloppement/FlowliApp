import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    return res.status(200).json({ message: 'Airtable webhook ready' });
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  const secret = req.headers['x-webhook-secret'] as string | undefined;
  if (!secret) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  return res.status(200).json({ ok: true });
}
