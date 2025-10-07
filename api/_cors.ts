import type { VercelRequest, VercelResponse } from '@vercel/node';

const PROD_ORIGIN = 'https://flowli-app.vercel.app';

const isAllowedDevOrigin = (origin?: string) => {
  if (!origin) return false;
  try {
    const u = new URL(origin);
    const host = u.hostname;
    // Expo dev tunnels & localhost
    return (
      host.endsWith('.exp.direct') ||
      host.endsWith('.expo.dev') ||
      host.endsWith('.exp.host') ||
      host === 'localhost' ||
      host.startsWith('192.168.') ||
      host.startsWith('10.') ||
      host.startsWith('172.')
    );
  } catch {
    return false;
  }
};

export function applyCors(req: VercelRequest, res: VercelResponse) {
  const origin = (req.headers.origin as string) || '';
  const allowOrigin = isAllowedDevOrigin(origin) ? origin : PROD_ORIGIN;
  res.setHeader('Access-Control-Allow-Origin', allowOrigin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Authorization, Content-Type, X-Debug, X-Push-Audience, X-Webhook-Secret'
  );
  res.setHeader('Access-Control-Max-Age', '600');
}

export function handlePreflight(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    applyCors(req, res);
    return res.status(204).end();
  }
}
