import type { VercelRequest, VercelResponse } from '@vercel/node';
import { applyCors, handlePreflight } from '../_cors';

export const config = { runtime: 'nodejs' };

// Constants from existing /api/me/tasks.ts
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
      event: 'check_contact_airtable_error', 
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
      event: 'check_contact_env_missing', 
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
      event: 'check_contact_error', 
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

  // Extract and normalize email
  const email = String(req.body?.email || '').trim().toLowerCase();
  
  // If no email provided, return not allowed
  if (!email) {
    console.log(JSON.stringify({ 
      event: 'check_contact_no_email', 
      timestamp: new Date().toISOString() 
    }));
    return res.status(200).json({ allowed: false });
  }

  // TODO: Add rate-limiting (IP-based, in-memory Map) post-MVP
  // const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  // if (rateLimitExceeded(clientIP)) return res.status(200).json({ allowed: false });

  try {
    // Check if contact exists in Airtable
    const exists = await airtableContactExists(email);
    
    console.log(JSON.stringify({ 
      event: 'check_contact', 
      email, 
      allowed: exists,
      timestamp: new Date().toISOString() 
    }));

    return res.status(200).json({ allowed: exists });
  } catch (e: any) {
    // Always return safe fallback on any error
    console.error(JSON.stringify({ 
      event: 'check_contact_fallback', 
      message: e?.message, 
      email,
      timestamp: new Date().toISOString() 
    }));
    return res.status(200).json({ allowed: false });
  }
}
