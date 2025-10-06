export const config = { runtime: 'nodejs22.x' };

export default function handler(_req: any, res: any) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(`<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><title>FlowliApp API</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  body{font-family:ui-sans-serif,system-ui,-apple-system;line-height:1.5;padding:24px;color:#0f172a;background:#f8fafc}
  .card{max-width:720px;margin:0 auto;background:#fff;border-radius:16px;padding:24px;box-shadow:0 1px 4px rgba(0,0,0,.06)}
  h1{font-size:22px;margin:0 0 12px}
  code{background:#f1f5f9;padding:2px 6px;border-radius:6px}
  ul{margin:8px 0 0 18px}
</style></head><body>
<div class="card">
  <h1>FlowliApp — API en ligne ✅</h1>
  <p>Endpoints utiles :</p>
  <ul>
    <li><code>/api/health</code> — ping</li>
    <li><code>/api/me/tasks</code> — tâches (JWT) ou <code>?email=&amp;X-Debug:1</code> pour tests</li>
    <li><code>/api/webhook/airtable</code> — webhook Airtable</li>
  </ul>
  <p>Config app: <code>EXPO_PUBLIC_API_URL = https://flowli-app.vercel.app/api</code></p>
</div>
</body></html>`);
}
