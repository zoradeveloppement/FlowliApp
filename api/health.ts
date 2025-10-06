// Types natifs Vercel (runtime nodejs22.x)

export default async function handler(_req: any, res: any) {
  return res.status(200).json({ 
    ok: true, 
    service: 'FlowliApp API', 
    ts: new Date().toISOString() 
  });
}
