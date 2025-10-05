import type { VercelRequest, VercelResponse } from '@vercel/node';

type AirtableRecord = { id: string; fields: Record<string, any> };
type AirtableList = { records: AirtableRecord[]; offset?: string };

const TABLE_CONTACTS_ID  = 'tblK73rIQAGyK8lDb';
const TABLE_TASKS_ID     = 'tbloedlTDaqnj6XJq';
const TABLE_PROJECTS_ID  = 'tblJBx1UgRMDkI6P5';

const FIELD_CONTACT_EMAIL   = 'Email';
const FIELD_TASK_TITLE      = 'Nom de la tâche';
const FIELD_TASK_STATUS     = 'Statut';
const FIELD_TASK_PROGRESS   = 'Avancement';  // 0..1
const FIELD_TASK_DUE        = 'Deadline';    // ISO
const FIELD_TASK_PROJECTS   = 'Projets';     // linked -> Projets
const FIELD_TASK_CLIENT     = 'Client';      // linked -> Contacts
const FIELD_PROJECT_NAME    = 'Nom Projet';
const FIELD_PROJECT_CONTACT = 'Nom Client';  // linked -> Contacts (used on B path)

// "Terminé" est considéré clôturé; par défaut on ne filtre pas sur le statut.
const CLOSED_STATUS = 'Terminé';

function buildUrl(baseId: string, tableIdOrName: string, params?: Record<string,string>) {
  const u = new URL(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableIdOrName)}`);
  if (params) for (const [k,v] of Object.entries(params)) u.searchParams.set(k, v);
  return u.toString();
}

async function airtableGet(url: string, token: string, debugTag?: string, debug?: boolean) {
  const resp = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!resp.ok) {
    const body = debug ? (await resp.text().catch(()=>'')) : '';
    console.error(JSON.stringify({ event:'me_tasks_airtable_error', tag: debugTag, status: resp.status, body: body?.slice(0,300), url, timestamp: new Date().toISOString() }));
    throw new Error(`Airtable HTTP ${resp.status}`);
  }
  return resp.json() as Promise<AirtableList>;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });

  const email = (req.query.email as string | undefined)?.trim().toLowerCase();
  const limitRaw = Number(req.query.limit ?? 50);
  const limit = Number.isFinite(limitRaw) ? Math.max(1, Math.min(100, limitRaw)) : 50;

  // Optional filter: ?statuses=A%20faire,En%20cours (default = ALL statuses)
  const statusesRaw = (req.query.statuses as string | undefined)?.trim();
  const statuses = statusesRaw && statusesRaw.toLowerCase() !== 'all'
    ? statusesRaw.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  const token  = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const debug  = String(req.headers['x-debug'] || '').toLowerCase() === '1';

  if (!token || !baseId) {
    console.error(JSON.stringify({ event:'me_tasks_env_missing', baseLen:(baseId||'').length, tokenLen:(token||'').length, timestamp: new Date().toISOString() }));
    return res.status(500).json({ error: 'Server error' });
  }
  if (!email) return res.status(400).json({ error: 'Missing email' });

  try {
    // 1) Find contact by email (case-insensitive)
    const formulaContact = `LOWER({${FIELD_CONTACT_EMAIL}})='${email.replace(/'/g, "\\'")}'`;
    const urlContact = buildUrl(baseId, TABLE_CONTACTS_ID, { filterByFormula: formulaContact, maxRecords: '1' });
    const contactResp = await airtableGet(urlContact, token, 'contacts', debug);
    const contact = contactResp.records[0];
    if (!contact) {
      console.log(JSON.stringify({ event:'me_tasks_no_contact', email, timestamp:new Date().toISOString() }));
      return res.status(404).json({ error: 'Contact not found' });
    }
    const contactId = contact.id;

    // 2A) Path A: tasks linked by {Client} contains contactId
    const byClient = `FIND('${contactId}',ARRAYJOIN({${FIELD_TASK_CLIENT}}))`;
    let formulaA = byClient;
    if (statuses.length > 0) {
      const orParts = statuses.map(s => `{${FIELD_TASK_STATUS}}='${s.replace(/'/g, "\\'")}'`).join(',');
      formulaA = `AND(${byClient},OR(${orParts}))`;
    }
    const urlTasksA = buildUrl(baseId, TABLE_TASKS_ID, { filterByFormula: formulaA, pageSize: String(Math.min(100, limit)) });
    const tasksAResp = await airtableGet(urlTasksA, token, 'tasksA', debug);
    const tasksA = tasksAResp.records;

    // 2B) Path B: projects linked by {Nom Client} contains contactId → then tasks where {Projets} in projectIds
    const urlProjectsB = buildUrl(baseId, TABLE_PROJECTS_ID, {
      filterByFormula: `FIND('${contactId}',ARRAYJOIN({${FIELD_PROJECT_CONTACT}}))`,
      pageSize: '100'
    });
    const projectsResp = await airtableGet(urlProjectsB, token, 'projectsB', debug);
    const projectIds = projectsResp.records.map(r => r.id);
    let tasksB: AirtableRecord[] = [];
    if (projectIds.length > 0) {
      // Batch OR on projects (Airtable limits; we keep it to 50 for safety)
      const ids = projectIds.slice(0, 50);
      const orProj = ids.map(id => `FIND('${id}',ARRAYJOIN({${FIELD_TASK_PROJECTS}}))`).join(',');
      const byProjects = ids.length === 1 ? `FIND('${ids[0]}',ARRAYJOIN({${FIELD_TASK_PROJECTS}}))` : `OR(${orProj})`;
      let formulaB = byProjects;
      if (statuses.length > 0) {
        const orStatus = statuses.map(s => `{${FIELD_TASK_STATUS}}='${s.replace(/'/g, "\\'")}'`).join(',');
        formulaB = `AND(${byProjects},OR(${orStatus}))`;
      }
      const urlTasksB = buildUrl(baseId, TABLE_TASKS_ID, { filterByFormula: formulaB, pageSize: '100' });
      const tasksBResp = await airtableGet(urlTasksB, token, 'tasksB', debug);
      tasksB = tasksBResp.records;
    }

    // 3) Union + dedup by record id
    const byId = new Map<string, AirtableRecord>();
    for (const r of tasksA) byId.set(r.id, r);
    for (const r of tasksB) byId.set(r.id, r);
    const tasks = Array.from(byId.values());

    if (tasks.length === 0) {
      console.log(JSON.stringify({ event:'me_tasks', email, count:0, filtered: statuses.length>0, timestamp:new Date().toISOString() }));
      return res.status(200).json({ items: [], count: 0 });
    }

    // 4) Enrich with project names (primary project if multiple)
    const projIdSet = new Set<string>();
    for (const t of tasks) {
      const ids = t.fields?.[FIELD_TASK_PROJECTS];
      if (Array.isArray(ids)) ids.forEach((id: string) => projIdSet.add(id));
    }
    let projectNames = new Map<string,string>();
    const projIds = Array.from(projIdSet);
    if (projIds.length > 0) {
      const orParts = projIds.slice(0, 50).map(id => `RECORD_ID()='${id}'`).join(',');
      const formulaProj = projIds.length === 1 ? `RECORD_ID()='${projIds[0]}'` : `OR(${orParts})`;
      const urlProjNames = buildUrl(baseId, TABLE_PROJECTS_ID, { filterByFormula: formulaProj, pageSize: '50' });
      const projResp = await airtableGet(urlProjNames, token, 'projectsNames', debug);
      projectNames = new Map(projResp.records.map(r => [r.id, String(r.fields?.[FIELD_PROJECT_NAME] ?? '')]));
    }

    // 5) Normalize items
    const items = tasks
      .slice(0, limit)
      .map(r => {
        const f = r.fields || {};
        const projectIds: string[] = Array.isArray(f[FIELD_TASK_PROJECTS]) ? f[FIELD_TASK_PROJECTS] : [];
        const primaryProjectId = projectIds[0] ?? null;
        return {
          id: r.id,
          title: String(f[FIELD_TASK_TITLE] ?? ''),
          status: String(f[FIELD_TASK_STATUS] ?? ''),
          progress: (typeof f[FIELD_TASK_PROGRESS] === 'number') ? f[FIELD_TASK_PROGRESS] : null, // 0..1 per your schema
          dueDate: f[FIELD_TASK_DUE] ?? null, // ISO string or null
          projectId: primaryProjectId,
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
