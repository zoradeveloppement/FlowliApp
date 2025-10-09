import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { applyCors, handlePreflight } from '../_cors';

export const config = { runtime: 'nodejs' };

// Supabase Admin client for user creation
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE! // Admin access for user creation
);

// Constants from existing patterns
const TABLE_CONTACTS_ID = 'tblK73rIQAGyK8lDb';
const FIELD_CONTACT_EMAIL = 'Email';

type AirtableRecord = { id: string; fields: Record<string, any> };
type AirtableList = { records: AirtableRecord[]; offset?: string };

function buildUrl(baseId: string, tableIdOrName: string, params?: Record<string, string>) {
  const u = new URL(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableIdOrName)}`);
  if (params) for (const [k, v] of Object.entries(params)) u.searchParams.set(k, v);
  return u.toString();
}

async function airtableGet(url: string, token: string, debugTag?: string) {
  const resp = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!resp.ok) {
    const body = await resp.text().catch(() => '');
    console.error(JSON.stringify({ 
      event: 'register_airtable_error', 
      tag: debugTag, 
      status: resp.status, 
      body: body?.slice(0, 300), 
      url, 
      timestamp: new Date().toISOString() 
    }));
    throw new Error(`Airtable HTTP ${resp.status}`);
  }
  return resp.json() as Promise<AirtableList>;
}

async function airtableContactExists(email: string): Promise<boolean> {
  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;

  if (!token || !baseId) {
    console.error(JSON.stringify({ 
      event: 'register_env_missing', 
      baseLen: (baseId || '').length, 
      tokenLen: (token || '').length, 
      timestamp: new Date().toISOString() 
    }));
    return false;
  }

  try {
    // Find contact by email (case-insensitive)
    const formulaContact = `LOWER({${FIELD_CONTACT_EMAIL}})='${email.replace(/'/g, "\\'")}'`;
    const urlContact = buildUrl(baseId, TABLE_CONTACTS_ID, { 
      filterByFormula: formulaContact, 
      maxRecords: '1' 
    });
    
    const contactResp = await airtableGet(urlContact, token, 'contacts');
    const contact = contactResp.records[0];
    
    return !!contact;
  } catch (e: any) {
    console.error(JSON.stringify({ 
      event: 'register_airtable_error', 
      message: e?.message, 
      email: email,
      timestamp: new Date().toISOString() 
    }));
    return false;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const pf = handlePreflight(req, res);
  if (pf !== undefined) return; // OPTIONS already handled
  applyCors(req, res);
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // TODO: rate-limit(IP, 'auth:register') post-MVP
  // const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  // Extract and normalize inputs
  const emailRaw = String(req.body?.email ?? '');
  const passwordRaw = String(req.body?.password ?? '');
  const email = emailRaw.trim().toLowerCase();
  const password = passwordRaw; // Never log passwords

  // Basic validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.log(JSON.stringify({ 
      event: 'register_validation_failed', 
      reason: 'invalid_email',
      email: email,
      timestamp: new Date().toISOString() 
    }));
    return res.status(400).json({ created: false, reason: 'invalid' });
  }

  if (password.length < 8) {
    console.log(JSON.stringify({ 
      event: 'register_validation_failed', 
      reason: 'password_too_short',
      email: email,
      timestamp: new Date().toISOString() 
    }));
    return res.status(400).json({ created: false, reason: 'invalid' });
  }

  // Airtable guard - check if email exists in Contacts
  const allowed = await airtableContactExists(email);
  if (!allowed) {
    // Generic response (no enumeration)
    console.log(JSON.stringify({ 
      event: 'register_not_authorized', 
      email: email,
      timestamp: new Date().toISOString() 
    }));
    return res.status(200).json({ created: false });
  }

  try {
    // Create Supabase user (email confirmed immediately for simple UX)
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      // Optional: initial metadata
      user_metadata: { source: 'flowli-register' }
    });

    if (error) {
      // Handle existing user case
      if ((error as any)?.message?.toLowerCase?.().includes('already registered') ||
          (error as any)?.status === 422 ||
          (error as any)?.code === 'user_already_exists') {
        console.log(JSON.stringify({ 
          event: 'register_user_exists', 
          email: email,
          timestamp: new Date().toISOString() 
        }));
        return res.status(409).json({ created: false, reason: 'exists' });
      }
      
      console.error(JSON.stringify({ 
        event: 'register_supabase_error', 
        code: (error as any)?.code, 
        message: error.message,
        email: email,
        timestamp: new Date().toISOString() 
      }));
      
      // Generic response for other errors
      return res.status(200).json({ created: false });
    }

    // Success
    console.log(JSON.stringify({ 
      event: 'register_success', 
      email: email,
      userId: data.user?.id,
      timestamp: new Date().toISOString() 
    }));

    // Don't return sensitive info; client will use signInWithPassword next
    return res.status(201).json({ created: true });
  } catch (e: any) {
    console.error(JSON.stringify({ 
      event: 'register_unexpected_error', 
      message: e?.message,
      email: email,
      timestamp: new Date().toISOString() 
    }));
    
    // Generic response for unexpected errors
    return res.status(200).json({ created: false });
  }
}
