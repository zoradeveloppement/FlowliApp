import type { VercelRequest, VercelResponse } from '@vercel/node';
import { applyCors, handlePreflight } from './_cors';

export const config = { runtime: 'nodejs' };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const pf = handlePreflight(req, res);
  if (pf !== undefined) return; // OPTIONS déjà répondu
  applyCors(req, res);
  
  return res.status(200).json({ 
    ok: true, 
    service: 'FlowliApp API', 
    ts: new Date().toISOString() 
  });
}
