import { get } from '../utils/http';

export type Project = {
  id: string;
  name: string;
};

export async function fetchProjects(): Promise<Project[]> {
  const resp = await get('me/projects');
  if (!resp.ok) {
    throw new Error(resp.raw || `HTTP ${resp.status}`);
  }
  return resp.data?.projects || [];
}

