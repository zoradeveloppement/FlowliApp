// api/_cors.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

const ALLOWED_ORIGINS = [
  'http://localhost:8081',
  'https://flowli-app.vercel.app',
];

export function applyCors(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin as string | undefined;
  const allowOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[1];
  res.setHeader('Access-Control-Allow-Origin', allowOrigin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, X-Debug, X-Push-Audience, X-Webhook-Secret');
  res.setHeader('Access-Control-Max-Age', '600');
}

export function handlePreflight(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    applyCors(req, res);
    return res.status(204).end();
  }
}
