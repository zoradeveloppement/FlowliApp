#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

function exists(p) { 
  return fs.existsSync(p); 
}

function findByGlob(startDir, substr) {
  const out = [];
  function walk(d) {
    if (!fs.existsSync(d)) return;
    for (const f of fs.readdirSync(d)) {
      const fp = path.join(d, f);
      const st = fs.statSync(fp);
      if (st.isDirectory()) walk(fp);
      else if (fp.includes(substr)) out.push(fp);
    }
  }
  if (exists(startDir)) walk(startDir);
  return out;
}

function read(p) { 
  return exists(p) ? fs.readFileSync(p, 'utf8') : ''; 
}

const checks = [];

function check(label, cond, fix) {
  checks.push({ label, ok: !!cond, fix });
}

console.log('=== FlowliApp Audit (MVP) ===\n');

// Structure
console.log('[STRUCTURE]');
check('api/ folder exists', exists('api'), 'Create `api/` at repo root.');
check('apps/mobile/ folder exists', exists('apps/mobile'), 'Scaffold Expo app under apps/mobile.');
check('supabase/migrations/ folder exists', exists('supabase/migrations'), 'Run `supabase migration new ...`.');

// API endpoint
console.log('\n[API]');
check('api/devices/register.ts exists', exists('api/devices/register.ts'), 'Add endpoint POST /api/devices/register.');
const regSrc = read('api/devices/register.ts');
check('register.ts references SUPABASE_URL', /SUPABASE_URL/.test(regSrc), 'Use process.env.SUPABASE_URL in the endpoint.');
check('register.ts references SUPABASE_SERVICE_ROLE', /SUPABASE_SERVICE_ROLE/.test(regSrc), 'Use service role key server-side.');

// Mobile config
console.log('\n[MOBILE]');
const appCfg = read('apps/mobile/app.config.ts') || read('apps/mobile/app.json');
check('app.config exposes EXPO_PUBLIC_SUPABASE_URL', /EXPO_PUBLIC_SUPABASE_URL/.test(appCfg), 'Add extra.EXPO_PUBLIC_SUPABASE_URL in app.config.ts.');
check('app.config exposes EXPO_PUBLIC_SUPABASE_ANON_KEY', /EXPO_PUBLIC_SUPABASE_ANON_KEY/.test(appCfg), 'Add extra.EXPO_PUBLIC_SUPABASE_ANON_KEY in app.config.ts.');
check('app.config exposes EXPO_PUBLIC_API_URL', /EXPO_PUBLIC_API_URL/.test(appCfg), 'Add extra.EXPO_PUBLIC_API_URL in app.config.ts.');

check('supabase client file exists', exists('apps/mobile/src/lib/supabase.ts'), 'Create supabase client under src/lib/supabase.ts.');
check('push utils exists', exists('apps/mobile/src/utils/push.ts'), 'Create push utils under src/utils/push.ts.');
check('http api client exists', exists('apps/mobile/src/lib/api.ts'), 'Create API client under src/lib/api.ts.');

check('_layout.tsx exists', exists('apps/mobile/app/_layout.tsx'), 'Create app/_layout.tsx with auth redirect.');
check('login.tsx exists', exists('apps/mobile/app/(auth)/login.tsx'), 'Create auth screen app/(auth)/login.tsx.');
check('home.tsx exists', exists('apps/mobile/app/(app)/home.tsx'), 'Create home screen app/(app)/home.tsx.');

// Supabase migration
console.log('\n[SUPABASE]');
const migs = findByGlob('supabase/migrations', 'create_devices_table');
check('devices migration file present', migs.length > 0, 'Create migration create_devices_table.sql under supabase/migrations/.');

// Git hygiene
console.log('\n[GIT HYGIENE]');
const gi = read('.gitignore');
check('.gitignore exists', !!gi, 'Create a .gitignore at repo root.');
check('.gitignore ignores .env', /\.env/.test(gi), 'Add `.env` in .gitignore.');
check('.gitignore ignores .vercel', /\.vercel/.test(gi), 'Add `.vercel` in .gitignore.');

const pass = checks.filter(c => c.ok).length;
const fail = checks.length - pass;

console.log('\n[RESULTS]');
for (const c of checks) {
  console.log(`${c.ok ? 'PASS' : 'FAIL'} - ${c.label}${c.ok ? '' : ` → ${c.fix}`}`);
}

console.log(`\nResult: ${pass}/${checks.length} checks passed.`);
process.exit(fail ? 1 : 0);
