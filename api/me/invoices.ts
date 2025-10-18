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
const TABLE_INVOICES_ID = 'tblMRdwMIMgKTzSEn';

const FIELD_CONTACT_EMAIL = 'Email';
const FIELD_CONTACT_NAME = 'Nom';
const FIELD_PROJECT_NAME = 'Nom Projet';
const FIELD_PROJECT_CONTACT = 'Nom Client';

const FIELD_INVOICE_NUMBER = 'Numéro facture';
const FIELD_INVOICE_AMOUNT = 'Montant (from Flux financiers)';
const FIELD_INVOICE_MONTH = 'Mois';
const FIELD_INVOICE_YEAR = 'Année';
const FIELD_INVOICE_PROJECTS = 'Projets'; // linked records (array of project IDs)
const FIELD_INVOICE_PDF = 'facture'; // attachment field

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
      event: 'me_invoices_airtable_error',
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
      event: 'me_invoices_env_missing',
      timestamp: new Date().toISOString()
    }));
    return res.status(500).json({ error: 'Server error' });
  }

  // Extract email from JWT
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    console.log(JSON.stringify({
      event: 'me_invoices_no_jwt',
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
        event: 'me_invoices_invalid_jwt',
        error: error?.message,
        timestamp: new Date().toISOString()
      }));
      return res.status(401).json({ error: 'Invalid token' });
    }
    email = data.user.email.trim().toLowerCase();
  } catch (e: any) {
    console.error(JSON.stringify({
      event: 'me_invoices_jwt_error',
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
      event: 'me_invoices_fetch_contact',
      email,
      timestamp: new Date().toISOString()
    }));

    const contactResp = await airtableGet(urlContact, token);
    const contact = contactResp.records[0];

    if (!contact) {
      console.log(JSON.stringify({
        event: 'me_invoices_contact_not_found',
        email,
        timestamp: new Date().toISOString()
      }));
      return res.status(404).json({ error: 'Contact not found' });
    }

    const contactName = String(contact.fields?.[FIELD_CONTACT_NAME] ?? '').trim();
    
    console.log(JSON.stringify({
      event: 'me_invoices_contact_found',
      email,
      contactId: contact.id,
      contactName,
      contactFields: Object.keys(contact.fields || {}),
      timestamp: new Date().toISOString()
    }));

    // 2) Find projects linked to this contact by NAME
    const escapedName = contactName.replace(/'/g, "\\'");
    const formulaProjects = `FIND('${escapedName}',ARRAYJOIN({${FIELD_PROJECT_CONTACT}}))`;
    const urlProjects = buildUrl(baseId, TABLE_PROJECTS_ID, {
      filterByFormula: formulaProjects,
      pageSize: '100'
    });

    console.log(JSON.stringify({
      event: 'me_invoices_fetch_projects',
      email,
      contactName,
      escapedName,
      formulaProjects,
      timestamp: new Date().toISOString()
    }));

    const projectsResp = await airtableGet(urlProjects, token);
    
    if (projectsResp.records.length === 0) {
      console.log(JSON.stringify({
        event: 'me_invoices_no_projects',
        email,
        timestamp: new Date().toISOString()
      }));
      return res.status(200).json({ invoices: [] });
    }

    const projectIds = projectsResp.records.map(r => r.id);
    const projectNames = new Map(
      projectsResp.records.map(r => [
        r.id,
        String(r.fields?.[FIELD_PROJECT_NAME] ?? '').trim() || 'Sans nom'
      ])
    );

    console.log(JSON.stringify({
      event: 'me_invoices_projects_found',
      email,
      projectIds,
      timestamp: new Date().toISOString()
    }));

    // 3) Find invoices linked to these projects
    // Build formula: OR(FIND('recXXX', ARRAYJOIN({Projets})), FIND('recYYY', ARRAYJOIN({Projets})), ...)
    const projectFormulas = projectIds.map(
      id => `FIND('${id}',ARRAYJOIN({${FIELD_INVOICE_PROJECTS}}))`
    );
    const formulaInvoices = projectFormulas.length === 1 
      ? projectFormulas[0] 
      : `OR(${projectFormulas.join(',')})`;

    const urlInvoices = buildUrl(baseId, TABLE_INVOICES_ID, {
      filterByFormula: formulaInvoices,
      pageSize: '100'
    });

    console.log(JSON.stringify({
      event: 'me_invoices_fetch_invoices',
      email,
      formulaInvoices,
      timestamp: new Date().toISOString()
    }));

    const invoicesResp = await airtableGet(urlInvoices, token);

    console.log(JSON.stringify({
      event: 'me_invoices_airtable_response',
      email,
      recordsCount: invoicesResp.records.length,
      timestamp: new Date().toISOString()
    }));

    // 4) Map invoices to response format
    const invoices = invoicesResp.records.map(r => {
      const fields = r.fields;
      
      // Extract PDF URL from attachment field
      let pdfUrl: string | undefined;
      const attachments = fields[FIELD_INVOICE_PDF];
      if (Array.isArray(attachments) && attachments.length > 0 && attachments[0]?.url) {
        pdfUrl = attachments[0].url;
      }

      // Extract project name from linked records
      let projectName = 'Sans projet';
      const linkedProjects = fields[FIELD_INVOICE_PROJECTS];
      if (Array.isArray(linkedProjects) && linkedProjects.length > 0) {
        const firstProjectId = linkedProjects[0];
        projectName = projectNames.get(firstProjectId) || 'Sans projet';
      }

      // Extract amount (can be number or array)
      let amount = 0;
      const rawAmount = fields[FIELD_INVOICE_AMOUNT];
      if (typeof rawAmount === 'number') {
        amount = rawAmount;
      } else if (Array.isArray(rawAmount) && rawAmount.length > 0) {
        amount = typeof rawAmount[0] === 'number' ? rawAmount[0] : 0;
      }

      return {
        id: r.id,
        number: String(fields[FIELD_INVOICE_NUMBER] || '').trim() || 'N/A',
        amount,
        month: fields[FIELD_INVOICE_MONTH] ? String(fields[FIELD_INVOICE_MONTH]).trim() : undefined,
        year: fields[FIELD_INVOICE_YEAR] || undefined,
        projectName,
        pdfUrl
      };
    });

    console.log(JSON.stringify({
      event: 'me_invoices_success',
      email,
      count: invoices.length,
      invoices: invoices.map(i => ({ id: i.id, number: i.number, amount: i.amount, hasPdf: !!i.pdfUrl })),
      timestamp: new Date().toISOString()
    }));

    res.setHeader('Cache-Control', 'private, max-age=60'); // Cache 1 minute
    return res.status(200).json({ invoices });
  } catch (e: any) {
    console.error(JSON.stringify({
      event: 'me_invoices_error',
      message: e?.message,
      timestamp: new Date().toISOString()
    }));
    return res.status(500).json({ error: 'Server error' });
  }
}

