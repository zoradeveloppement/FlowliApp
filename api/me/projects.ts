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
const TABLE_PROJECTS_ID = 'tblJBx1UgRMDkI6P5';

const FIELD_CONTACT_EMAIL = 'Email';
const FIELD_PROJECT_NAME = 'Nom Projet';
const FIELD_PROJECT_CONTACT = 'Nom Client';

function buildUrl(baseId: string, tableIdOrName: string, params?: Record<string, string>) {
  const u = new URL(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableIdOrName)}`);
  if (params) for (const [k, v] of Object.entries(params)) u.searchParams.set(k, v);
  return u.toString();
}

async function airtableGet(url: string, token: string) {
  const resp = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!resp.ok) {
    const body = await resp.text().catch(() => '');
    console.error(JSON.stringify({
      event: 'me_projects_airtable_error',
      status: resp.status,
      body: body?.slice(0, 300),
      url,
      timestamp: new Date().toISOString()
    }));
    throw new Error(`Airtable HTTP ${resp.status}`);
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
      event: 'me_projects_env_missing',
      timestamp: new Date().toISOString()
    }));
    return res.status(500).json({ error: 'Server error' });
  }

  // Extract email from JWT
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    console.log(JSON.stringify({
      event: 'me_projects_no_jwt',
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
        event: 'me_projects_invalid_jwt',
        error: error?.message,
        timestamp: new Date().toISOString()
      }));
      return res.status(401).json({ error: 'Invalid token' });
    }
    email = data.user.email.trim().toLowerCase();
  } catch (e: any) {
    console.error(JSON.stringify({
      event: 'me_projects_jwt_error',
      message: e?.message,
      timestamp: new Date().toISOString()
    }));
    return res.status(500).json({ error: 'Server error' });
  }

  try {
    // 1) Find contact by email (case-insensitive)
    const formulaContact = `LOWER({${FIELD_CONTACT_EMAIL}})='${email.replace(/'/g, "\\'")}'`;
    const urlContact = buildUrl(baseId, TABLE_CONTACTS_ID, {
      filterByFormula: formulaContact,
      maxRecords: '1'
    });

    console.log(JSON.stringify({
      event: 'me_projects_fetch_contact',
      email,
      timestamp: new Date().toISOString()
    }));

    const contactResp = await airtableGet(urlContact, token);
    const contact = contactResp.records[0];

    if (!contact) {
      console.log(JSON.stringify({
        event: 'me_projects_contact_not_found',
        email,
        timestamp: new Date().toISOString()
      }));
      return res.status(404).json({ error: 'Contact not found' });
    }

    const contactId = contact.id;

    // 2) Find projects linked to this contact
    const formulaProjects = `FIND('${contactId}',ARRAYJOIN({${FIELD_PROJECT_CONTACT}}))`;
    const urlProjects = buildUrl(baseId, TABLE_PROJECTS_ID, {
      filterByFormula: formulaProjects,
      pageSize: '100'
    });

    console.log(JSON.stringify({
      event: 'me_projects_fetch_projects',
      email,
      contactId,
      timestamp: new Date().toISOString()
    }));

    const projectsResp = await airtableGet(urlProjects, token);
    const projects = projectsResp.records.map(r => ({
      id: r.id,
      name: String(r.fields?.[FIELD_PROJECT_NAME] ?? '').trim() || 'Sans nom'
    }));

    console.log(JSON.stringify({
      event: 'me_projects_success',
      email,
      contactId,
      count: projects.length,
      timestamp: new Date().toISOString()
    }));

    res.setHeader('Cache-Control', 'private, max-age=60'); // Cache 1 minute
    return res.status(200).json({ projects });
  } catch (e: any) {
    console.error(JSON.stringify({
      event: 'me_projects_error',
      message: e?.message,
      timestamp: new Date().toISOString()
    }));
    return res.status(500).json({ error: 'Server error' });
  }
}

