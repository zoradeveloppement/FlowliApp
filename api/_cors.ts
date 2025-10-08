import type { VercelRequest, VercelResponse } from '@vercel/node';

const PROD_ORIGIN = 'https://flowli-app.vercel.app';

const isAllowedDevOrigin = (origin?: string) => {
  if (!origin) return false;
  try {
    const u = new URL(origin);
    const host = u.hostname;
    // Expo dev tunnels & localhost - plus permissif
    return (
      host.endsWith('.exp.direct') ||
      host.endsWith('.expo.dev') ||
      host.endsWith('.exp.host') ||
      host === 'localhost' ||
      host.startsWith('192.168.') ||
      host.startsWith('10.') ||
      host.startsWith('172.') ||
      // Ajout pour les tunnels Expo dynamiques
      host.includes('exp.direct') ||
      host.includes('expo.dev')
    );
  } catch {
    return false;
  }
};

export function applyCors(req: VercelRequest, res: VercelResponse) {
  const origin = (req.headers.origin as string) || '';
  const allowOrigin = isAllowedDevOrigin(origin) ? origin : PROD_ORIGIN;
  
  // Debug CORS en dev
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[CORS] Origin: ${origin}, Allowed: ${isAllowedDevOrigin(origin)}, Setting: ${allowOrigin}`);
  }
  
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
