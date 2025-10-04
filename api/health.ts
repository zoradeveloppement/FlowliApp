import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  return res.status(200).json({ 
    ok: true, 
    service: 'FlowliApp API', 
    ts: new Date().toISOString() 
  });
}
