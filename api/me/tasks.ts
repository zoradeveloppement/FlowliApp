import type { VercelRequest, VercelResponse } from '@vercel/node';

type AirtableRecord = { id: string; fields: Record<string, any> };
type AirtableList = { records: AirtableRecord[]; offset?: string };

const TABLE_CONTACTS_ID = 'tblK73rIQAGyK8lDb';
const TABLE_TASKS_ID = 'tbloedlTDaqnj6XJq';
const TABLE_PROJECTS_ID = 'tblJBx1UgRMDkI6P5';

const FIELD_CONTACT_EMAIL = 'Email';
const FIELD_TASK_TITLE = 'Nom de la tâche';
const FIELD_TASK_STATUS = 'Statut';
const FIELD_TASK_PROGRESS = 'Avancement';
const FIELD_TASK_DUE = 'Deadline';
const FIELD_TASK_PROJECTS = 'Projets';
const FIELD_TASK_CLIENT = 'Client';
const FIELD_PROJECT_NAME = 'Nom Projet';

const IN_PROGRESS_STATUSES = ['A faire', 'En cours'];

function buildUrl(baseId: string, tableIdOrName: string, params?: Record<string,string>) {
  const u = new URL(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableIdOrName)}`);
  if (params) for (const [k,v] of Object.entries(params)) u.searchParams.set(k, v);
  return u.toString();
}

async function airtableGet(url: string, token: string) {
  const resp = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!resp.ok) throw new Error(`Airtable HTTP ${resp.status}`);
  return resp.json() as Promise<AirtableList>;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });

  const email = (req.query.email as string | undefined)?.trim().toLowerCase();
  const limitRaw = Number(req.query.limit ?? 50);
  const limit = Number.isFinite(limitRaw) ? Math.max(1, Math.min(100, limitRaw)) : 50;
  const statusesRaw = (req.query.statuses as string | undefined)?.trim();
  // If statusesRaw is undefined or "all" (case-insensitive), do not filter by status.
  const statuses = statusesRaw && statusesRaw.toLowerCase() !== 'all'
    ? statusesRaw.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;
  if (!token || !baseId) return res.status(500).json({ error: 'Server error' });

  if (!email) return res.status(400).json({ error: 'Missing email' });

  try {
    // 1) Find contact by email (case-insensitive)
    const formulaContact = `LOWER({${FIELD_CONTACT_EMAIL}})='${email.replace(/'/g, "\\'")}'`;
    const urlContact = buildUrl(baseId, TABLE_CONTACTS_ID, { filterByFormula: formulaContact, maxRecords: '1' });
    const contactResp = await airtableGet(urlContact, token);
    const contact = contactResp.records[0];
    if (!contact) {
      console.log(JSON.stringify({ event:'me_tasks_no_contact', email, timestamp:new Date().toISOString() }));
      return res.status(404).json({ error: 'Contact not found' });
    }
    const contactId = contact.id;

    // 2) List tasks for this contact with optional statuses filter
    const byContact = `FIND('${contactId}',ARRAYJOIN({${FIELD_TASK_CLIENT}}))`;
    let formulaTasks = byContact;
    if (statuses.length > 0) {
      const orParts = statuses.map(s => `{${FIELD_TASK_STATUS}}='${s.replace(/'/g, "\\'")}'`).join(',');
      formulaTasks = `AND(${byContact},OR(${orParts}))`;
    }
    const urlTasks = buildUrl(baseId, TABLE_TASKS_ID, {
      filterByFormula: formulaTasks,
      pageSize: String(Math.min(50, limit)) // Airtable max 100; we cap at 50 by default
    });
    const tasksResp = await airtableGet(urlTasks, token);
    const tasks = tasksResp.records;

    if (!tasks || tasks.length === 0) {
      console.log(JSON.stringify({ event:'me_tasks', email, count:0, filtered: statuses.length>0, statuses, timestamp:new Date().toISOString() }));
      return res.status(200).json({ items: [], count: 0 });
    }

    // 3) Enrich with project names
    const projectIdSet = new Set<string>();
    for (const t of tasks) {
      const ids = t.fields?.[FIELD_TASK_PROJECTS];
      if (Array.isArray(ids)) ids.forEach((id: string) => projectIdSet.add(id));
    }
    const projectIds = Array.from(projectIdSet);
    let projectNames = new Map<string,string>();
    if (projectIds.length > 0) {
      // OR(RECORD_ID()='id1',RECORD_ID()='id2',...)
      const orParts = projectIds.slice(0, 50).map(id => `RECORD_ID()='${id}'`).join(',');
      const formulaProjects = projectIds.length === 1 ? `RECORD_ID()='${projectIds[0]}'` : `OR(${orParts})`;
      const urlProjects = buildUrl(baseId, TABLE_PROJECTS_ID, { filterByFormula: formulaProjects, pageSize: '50' });
      const projResp = await airtableGet(urlProjects, token);
      projectNames = new Map(projResp.records.map(r => [r.id, String(r.fields?.[FIELD_PROJECT_NAME] ?? '')]));
    }

    // 4) Normalize payload
    const items = tasks.slice(0, limit).map(r => {
      const f = r.fields || {};
      const projectIds: string[] = Array.isArray(f[FIELD_TASK_PROJECTS]) ? f[FIELD_TASK_PROJECTS] : [];
      const primaryProjectId = projectIds[0];
      return {
        id: r.id,
        title: String(f[FIELD_TASK_TITLE] ?? ''),
        status: String(f[FIELD_TASK_STATUS] ?? ''),
        progress: f[FIELD_TASK_PROGRESS] ?? null,
        dueDate: f[FIELD_TASK_DUE] ?? null,
        projectId: primaryProjectId ?? null,
        projectName: primaryProjectId ? (projectNames.get(primaryProjectId) ?? null) : null
      };
    });

    console.log(JSON.stringify({ event:'me_tasks', email, count: items.length, filtered: statuses.length>0, statuses, timestamp:new Date().toISOString() }));
    res.setHeader('Cache-Control', 'private, max-age=0');
    return res.status(200).json({ items, count: items.length });
  } catch (e:any) {
    console.error(JSON.stringify({ event:'me_tasks_error', message: e?.message, timestamp:new Date().toISOString() }));
    return res.status(500).json({ error: 'Server error' });
  }
}
