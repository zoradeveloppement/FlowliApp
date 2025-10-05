import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient as createSb } from '@supabase/supabase-js';

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

  // Debug flag
  const debug  = String(req.headers['x-debug'] || '').toLowerCase() === '1';

  // Auth: prefer Supabase JWT email; fallback to query only in debug or legacy (no auth header)
  const authHeader = String(req.headers['authorization'] || '');
  let email: string | undefined;
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7).trim();
    if (token) {
      try {
        const sb = createSb(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, { auth: { persistSession: false } });
        const { data: userResp } = await sb.auth.getUser(token);
        const jwtEmail = userResp?.user?.email?.toLowerCase();
        if (jwtEmail) email = jwtEmail;
      } catch {
        // ignore auth errors; will consider legacy/debug fallback
      }
    }
  }
  if (!email) {
    const q = (req.query.email as string | undefined)?.trim().toLowerCase();
    if (q && (!authHeader || debug)) {
      email = q;
    }
  }
  if (!email) return res.status(401).json({ error: 'Unauthorized' });

  const limitRaw = Number(req.query.limit ?? 50);
  const limit = Number.isFinite(limitRaw) ? Math.max(1, Math.min(100, limitRaw)) : 50;

  // Optional filter: ?statuses=A%20faire,En%20cours (default = ALL statuses)
  const statusesRaw = (req.query.statuses as string | undefined)?.trim();
  const statuses = statusesRaw && statusesRaw.toLowerCase() !== 'all'
    ? statusesRaw.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  // Optional filters: projectId and search
  const projectId = (req.query.projectId as string | undefined)?.trim();
  const searchRaw = (req.query.search as string | undefined)?.trim();
  const search = searchRaw ? searchRaw.toLowerCase() : '';

  const token  = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;

  if (!token || !baseId) {
    console.error(JSON.stringify({ event:'me_tasks_env_missing', baseLen:(baseId||'').length, tokenLen:(token||'').length, timestamp: new Date().toISOString() }));
    return res.status(500).json({ error: 'Server error' });
  }

  try {
    // 1) Find contact by email (case-insensitive)
    const formulaContact = `LOWER({${FIELD_CONTACT_EMAIL}})='${email.replace(/'/g, "\\'")}'`;
    const urlContact = buildUrl(baseId, TABLE_CONTACTS_ID, { filterByFormula: formulaContact, maxRecords: '1' });
    const contactResp = await airtableGet(urlContact, token, 'contacts', debug);
    const contact = contactResp.records[0];
    if (!contact) {
      console.log(JSON.stringify({ event:'me_tasks_no_contact', email, auth: authHeader.startsWith('Bearer ') ? 'jwt' : 'query', timestamp:new Date().toISOString() }));
      return res.status(404).json({ error: 'Contact not found' });
    }
    const contactId = contact.id;
    const contactName = String(contact.fields?.['Nom'] ?? contact.fields?.['Name'] ?? '').trim();

    // Shared pieces for filtering
    const byProjectId = projectId ? `FIND('${projectId.replace(/'/g, "\\'")}',ARRAYJOIN({${FIELD_TASK_PROJECTS}}))` : '';
    const byProjectEq = projectId ? `ARRAYJOIN({${FIELD_TASK_PROJECTS}})='${projectId.replace(/'/g, "\\'")}'` : '';
    const byClientId = `FIND('${contactId}',ARRAYJOIN({${FIELD_TASK_CLIENT}}))`;
    const escapedName = (contactName || '').replace(/'/g, "\\'");
    const byClientName = escapedName ? `FIND('${escapedName}',ARRAYJOIN({${FIELD_TASK_CLIENT}}))` : '';

    // Status and search clauses
    const statusClause = statuses.length > 0 ? `OR(${statuses.map(s => `{${FIELD_TASK_STATUS}}='${s.replace(/'/g, "\\'")}'`).join(',')})` : '';
    const searchClause = search ? `FIND('${search.replace(/'/g, "\\'")}',LOWER({${FIELD_TASK_TITLE}}))` : '';

    let tasksA: AirtableRecord[] = [];
    let tasksB: AirtableRecord[] = [];
    let formulaA1 = '';
    let formulaA2 = '';
    let formulaA1eq = '';
    let formulaA2eq = '';
    let usedJsPostFilter = false;

    if (projectId) {
      // PATH A: Enhanced projectId filtering with A1 + A2
      // A1: byClientId AND byProjectId
      formulaA1 = `AND(${byClientId},${byProjectId})`;
      if (statusClause) formulaA1 = `AND(${formulaA1},${statusClause})`;
      if (searchClause) formulaA1 = `AND(${formulaA1},${searchClause})`;

      const urlTasksA1 = buildUrl(baseId, TABLE_TASKS_ID, { filterByFormula: formulaA1, pageSize: String(Math.min(100, limit)) });
      const tasksA1Resp = await airtableGet(urlTasksA1, token, 'tasksA1', debug);
      const tasksA1 = tasksA1Resp.records;

      // A2: byClientName AND byProjectId (fallback)
      if (byClientName) {
        formulaA2 = `AND(${byClientName},${byProjectId})`;
        if (statusClause) formulaA2 = `AND(${formulaA2},${statusClause})`;
        if (searchClause) formulaA2 = `AND(${formulaA2},${searchClause})`;

        const urlTasksA2 = buildUrl(baseId, TABLE_TASKS_ID, { filterByFormula: formulaA2, pageSize: String(Math.min(100, limit)) });
        const tasksA2Resp = await airtableGet(urlTasksA2, token, 'tasksA2', debug);
        const tasksA2 = tasksA2Resp.records;

        // Union A1 + A2
        const byIdA = new Map<string, AirtableRecord>();
        for (const r of tasksA1) byIdA.set(r.id, r);
        for (const r of tasksA2) byIdA.set(r.id, r);
        tasksA = Array.from(byIdA.values());
      } else {
        tasksA = tasksA1;
      }

      // Enhanced projectId handling with fallbacks
      const unionP = new Map<string, AirtableRecord>();
      for (const r of tasksA) unionP.set(r.id, r);
      for (const r of tasksB) unionP.set(r.id, r);


      // If union is empty, try strict equality formulas
      if (unionP.size === 0 && byProjectEq) {
        // A1eq: byClientId AND byProjectEq
        formulaA1eq = `AND(${byClientId},${byProjectEq})`;
        if (statusClause) formulaA1eq = `AND(${formulaA1eq},${statusClause})`;
        if (searchClause) formulaA1eq = `AND(${formulaA1eq},${searchClause})`;

        const urlTasksA1eq = buildUrl(baseId, TABLE_TASKS_ID, { filterByFormula: formulaA1eq, pageSize: String(Math.min(100, limit)) });
        const tasksA1eqResp = await airtableGet(urlTasksA1eq, token, 'tasksA1eq', debug);
        const tasksA1eq = tasksA1eqResp.records;

        // A2eq: byClientName AND byProjectEq (when contactName exists)
        if (byClientName) {
          formulaA2eq = `AND(${byClientName},${byProjectEq})`;
          if (statusClause) formulaA2eq = `AND(${formulaA2eq},${statusClause})`;
          if (searchClause) formulaA2eq = `AND(${formulaA2eq},${searchClause})`;

          const urlTasksA2eq = buildUrl(baseId, TABLE_TASKS_ID, { filterByFormula: formulaA2eq, pageSize: String(Math.min(100, limit)) });
          const tasksA2eqResp = await airtableGet(urlTasksA2eq, token, 'tasksA2eq', debug);
          const tasksA2eq = tasksA2eqResp.records;

          // Union A1eq + A2eq
          for (const r of tasksA1eq) unionP.set(r.id, r);
          for (const r of tasksA2eq) unionP.set(r.id, r);
        } else {
          for (const r of tasksA1eq) unionP.set(r.id, r);
        }
      }

      // If still empty, fallback to JS post-filtering
      if (unionP.size === 0) {
        usedJsPostFilter = true;
        
        // Run original NO-projectId path for this contact (A+B)
        let formulaANoProject = byClientId;
        if (statusClause) formulaANoProject = `AND(${byClientId},${statusClause})`;
        if (searchClause) formulaANoProject = `AND(${formulaANoProject},${searchClause})`;

        const urlTasksANoProject = buildUrl(baseId, TABLE_TASKS_ID, { filterByFormula: formulaANoProject, pageSize: String(Math.min(100, limit)) });
        const tasksANoProjectResp = await airtableGet(urlTasksANoProject, token, 'tasksANoProject', debug);
        const tasksANoProject = tasksANoProjectResp.records;

        // Path B without projectId
        const formulaBProjectsNoProject = `FIND('${contactId}',ARRAYJOIN({${FIELD_PROJECT_CONTACT}}))`;
        const urlProjectsBNoProject = buildUrl(baseId, TABLE_PROJECTS_ID, {
          filterByFormula: formulaBProjectsNoProject,
          pageSize: '100'
        });
        const projectsBNoProjectResp = await airtableGet(urlProjectsBNoProject, token, 'projectsBNoProject', debug);
        const projectIdsBNoProject = projectsBNoProjectResp.records.map(r => r.id);

        let tasksBNoProject: AirtableRecord[] = [];
        if (projectIdsBNoProject.length > 0) {
          const ids = projectIdsBNoProject.slice(0, 50);
          const orProj = ids.map(id => `FIND('${id}',ARRAYJOIN({${FIELD_TASK_PROJECTS}}))`).join(',');
          const byProjects = ids.length === 1 ? `FIND('${ids[0]}',ARRAYJOIN({${FIELD_TASK_PROJECTS}}))` : `OR(${orProj})`;
          let formulaBNoProject = byProjects;
          if (statusClause) formulaBNoProject = `AND(${byProjects},${statusClause})`;
          if (searchClause) formulaBNoProject = `AND(${formulaBNoProject},${searchClause})`;

          const urlTasksBNoProject = buildUrl(baseId, TABLE_TASKS_ID, { filterByFormula: formulaBNoProject, pageSize: '100' });
          const tasksBNoProjectResp = await airtableGet(urlTasksBNoProject, token, 'tasksBNoProject', debug);
          tasksBNoProject = tasksBNoProjectResp.records;
        }

        // Union A + B without projectId
        const tasksNoProject = [...tasksANoProject, ...tasksBNoProject];

        // JS post-filter by projectId
        const hardFiltered = tasksNoProject.filter(r => {
          const f = r.fields || {};
          const ids = Array.isArray(f[FIELD_TASK_PROJECTS]) ? f[FIELD_TASK_PROJECTS] : [];
          return ids.includes(projectId);
        });

        // Insert hardFiltered into unionP
        for (const r of hardFiltered) unionP.set(r.id, r);
      }

      // Replace tasksA and tasksB with unionP results
      tasksA = Array.from(unionP.values());
      tasksB = []; // Clear tasksB since we're using unionP
    } else {
      // Original logic when no projectId
      let formulaA = byClientId;
      if (statusClause) formulaA = `AND(${byClientId},${statusClause})`;
      if (searchClause) formulaA = `AND(${formulaA},${searchClause})`;

      const urlTasksAById = buildUrl(baseId, TABLE_TASKS_ID, { filterByFormula: formulaA, pageSize: String(Math.min(100, limit)) });
      const tasksAByIdResp = await airtableGet(urlTasksAById, token, 'tasksA_byId', debug);
      const tasksAById = tasksAByIdResp.records;

      tasksA = tasksAById;
      if (tasksAById.length === 0 && statuses.length === 0 && contactName) {
        // Fallback when {Client} is a lookup that stores names
        let formulaA2 = byClientName;
        if (searchClause) formulaA2 = `AND(${byClientName},${searchClause})`;

        const urlTasksAByName = buildUrl(baseId, TABLE_TASKS_ID, { filterByFormula: formulaA2, pageSize: String(Math.min(100, limit)) });
        const tasksAByNameResp = await airtableGet(urlTasksAByName, token, 'tasksA_byName', debug);
        tasksA = tasksAByNameResp.records;
      }
    }

    // 2B) Path B: Enhanced logic based on projectId presence
    let formulaBp = '';
    let formulaBProjects = '';

    if (projectId) {
      // PATH B: Direct projectId filtering with post-filter by contact
      formulaBp = byProjectId;
      if (statusClause) formulaBp = `AND(${byProjectId},${statusClause})`;
      if (searchClause) formulaBp = `AND(${formulaBp},${searchClause})`;

      const urlTasksBp = buildUrl(baseId, TABLE_TASKS_ID, { filterByFormula: formulaBp, pageSize: '100' });
      const tasksBpResp = await airtableGet(urlTasksBp, token, 'tasksBp', debug);
      const tasksBp = tasksBpResp.records;

      // Post-filter by contact: keep if Client contains contactId OR contactName
      tasksB = tasksBp.filter(task => {
        const clientField = task.fields?.[FIELD_TASK_CLIENT];
        if (Array.isArray(clientField)) {
          // Client is linked records (IDs)
          return clientField.includes(contactId);
        } else if (typeof clientField === 'string') {
          // Client is lookup field (names)
          return clientField.includes(contactName) || clientField.includes(contactId);
        }
        return false;
      });
    } else {
      // Original logic: projects linked by {Nom Client} → tasks by projectIds
      formulaBProjects = `FIND('${contactId}',ARRAYJOIN({${FIELD_PROJECT_CONTACT}}))`;
      const urlProjectsB = buildUrl(baseId, TABLE_PROJECTS_ID, {
        filterByFormula: formulaBProjects,
        pageSize: '100'
      });
      const projectsResp = await airtableGet(urlProjectsB, token, 'projectsB', debug);
      const projectIds = projectsResp.records.map(r => r.id);

      if (projectIds.length > 0) {
        // Batch OR on projects (Airtable limits; we keep it to 50 for safety)
        const ids = projectIds.slice(0, 50);
        const orProj = ids.map(id => `FIND('${id}',ARRAYJOIN({${FIELD_TASK_PROJECTS}}))`).join(',');
        const byProjects = ids.length === 1 ? `FIND('${ids[0]}',ARRAYJOIN({${FIELD_TASK_PROJECTS}}))` : `OR(${orProj})`;
        let formulaB = byProjects;
        if (statusClause) formulaB = `AND(${byProjects},${statusClause})`;
        if (searchClause) formulaB = `AND(${formulaB},${searchClause})`;

        const urlTasksB = buildUrl(baseId, TABLE_TASKS_ID, { filterByFormula: formulaB, pageSize: '100' });
        const tasksBResp = await airtableGet(urlTasksB, token, 'tasksB', debug);
        tasksB = tasksBResp.records;
      }
    }

    // 3) Union + dedup by record id
    const byId = new Map<string, AirtableRecord>();
    for (const r of tasksA) byId.set(r.id, r);
    for (const r of tasksB) byId.set(r.id, r);
    const tasks = Array.from(byId.values());

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
          progress: (typeof f[FIELD_TASK_PROGRESS] === 'number') ? f[FIELD_TASK_PROGRESS] : null,
          dueDate: f[FIELD_TASK_DUE] ?? null,
          projectId: primaryProjectId,
          projectName: primaryProjectId ? (projectNames.get(primaryProjectId) ?? null) : null
        };
      });

    const counts = { A1: 0, A2: 0, Bp: 0, A1eq: 0, A2eq: 0, unionAfterEq: 0, unionAfterJs: 0, A: (tasksA?.length ?? 0), B: (tasksB?.length ?? 0), union: items.length };

    // Compact log for quick scanning
    console.log(JSON.stringify({ event:'me_tasks', email, auth: authHeader.startsWith('Bearer ') ? 'jwt' : 'query', count: items.length, filtered: statuses.length>0 || !!projectId || !!search, statuses, projectId, search, timestamp:new Date().toISOString() }));

    res.setHeader('Cache-Control', 'private, max-age=0');
    if (debug) {
      return res.status(200).json({
        items,
        count: items.length,
        debug: {
          contactId,
          contactName,
          formulas: { A1: formulaA1, A2: formulaA2, A1eq: formulaA1eq, A2eq: formulaA2eq, Bp: formulaBp, B_projects: formulaBProjects },
          counts,
          usedJsPostFilter: projectId ? usedJsPostFilter : false
        }
      });
    }
    return res.status(200).json({ items, count: items.length });
  } catch (e:any) {
    console.error(JSON.stringify({ event:'me_tasks_error', message: e?.message, timestamp: new Date().toISOString() }));
    return res.status(500).json({ error: 'Server error' });
  }
}

