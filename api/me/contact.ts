import type { VercelRequest, VercelResponse } from '@vercel/node';
import { applyCors, handlePreflight } from '../_cors';
import { createClient } from '@supabase/supabase-js';

export const config = { runtime: 'nodejs' };

// Supabase Admin client for JWT verification
const supaAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!
);

type AirtableRecord = { id: string; fields: Record<string, any> };
type AirtableList = { records: AirtableRecord[]; offset?: string };

const TABLE_CONTACTS_ID = 'tblK73rIQAGyK8lDb';

const FIELD_CONTACT_EMAIL = 'Email';
const FIELD_CONTACT_NAME = 'Nom';
const FIELD_CONTACT_PHONE = 'Téléphone';
const FIELD_CONTACT_COMPANY = 'Entreprise';
const FIELD_CONTACT_ADDRESS = 'Adresse';

function buildUrl(baseId: string, tableIdOrName: string, params?: Record<string, string>) {
  const u = new URL(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableIdOrName)}`);
  if (params) for (const [k, v] of Object.entries(params)) u.searchParams.set(k, v);
  return u.toString();
}

async function airtableGet(url: string, token: string) {
  const resp = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!resp.ok) {
    const body = await resp.text().catch(() => '');
    throw new Error(`Airtable HTTP ${resp.status}: ${body.slice(0, 300)}`);
  }
  return resp.json() as Promise<AirtableList>;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const pf = handlePreflight(req, res);
  if (pf !== undefined) return;
  applyCors(req, res);

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;

  if (!token || !baseId) {
    console.error(JSON.stringify({
      event: 'me_contact_env_missing',
      timestamp: new Date().toISOString()
    }));
    return res.status(500).json({ error: 'Server error' });
  }

  // Extract email from JWT
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    console.log(JSON.stringify({
      event: 'me_contact_no_jwt',
      timestamp: new Date().toISOString()
    }));
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const jwt = authHeader.split(' ')[1];
  let email: string;

  try {
    const { data, error } = await supaAdmin.auth.getUser(jwt);
    if (error || !data.user?.email) {
      console.log(JSON.stringify({
        event: 'me_contact_invalid_jwt',
        error: error?.message,
        timestamp: new Date().toISOString()
      }));
      return res.status(401).json({ error: 'Invalid token' });
    }
    email = data.user.email.trim().toLowerCase();
  } catch (e: any) {
    console.error(JSON.stringify({
      event: 'me_contact_jwt_error',
      message: e?.message,
      timestamp: new Date().toISOString()
    }));
    return res.status(500).json({ error: 'Server error' });
  }

  try {
    // Find contact by email (case-insensitive)
    const formulaContact = `LOWER({${FIELD_CONTACT_EMAIL}})='${email.replace(/'/g, "\\'")}'`;
    const urlContact = buildUrl(baseId, TABLE_CONTACTS_ID, {
      filterByFormula: formulaContact,
      maxRecords: '1'
    });

    console.log(JSON.stringify({
      event: 'me_contact_fetch',
      email,
      timestamp: new Date().toISOString()
    }));

    const contactResp = await airtableGet(urlContact, token);
    const contact = contactResp.records[0];

    if (!contact) {
      console.log(JSON.stringify({
        event: 'me_contact_not_found',
        email,
        timestamp: new Date().toISOString()
      }));
      return res.status(404).json({ error: 'Contact not found' });
    }

    // Extract fields
    const fields = contact.fields;
    const result = {
      id: contact.id,
      name: String(fields[FIELD_CONTACT_NAME] || '').trim(),
      email: String(fields[FIELD_CONTACT_EMAIL] || '').trim(),
      phone: fields[FIELD_CONTACT_PHONE] ? String(fields[FIELD_CONTACT_PHONE]).trim() : undefined,
      company: fields[FIELD_CONTACT_COMPANY] ? String(fields[FIELD_CONTACT_COMPANY]).trim() : undefined,
      address: fields[FIELD_CONTACT_ADDRESS] ? String(fields[FIELD_CONTACT_ADDRESS]).trim() : undefined,
    };

    console.log(JSON.stringify({
      event: 'me_contact_success',
      email,
      contactId: contact.id,
      timestamp: new Date().toISOString()
    }));

    return res.status(200).json(result);
  } catch (e: any) {
    console.error(JSON.stringify({
      event: 'me_contact_error',
      message: e?.message,
      email,
      timestamp: new Date().toISOString()
    }));
    return res.status(500).json({ error: 'Server error' });
  }
}

