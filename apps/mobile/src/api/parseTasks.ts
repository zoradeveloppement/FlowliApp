// src/api/parseTasks.ts
export type Task = {
  id: string;
  title: string;
  status: string;
  progress: number | null;
  dueDate: string | null;
  projectId?: string | null;
  projectName?: string | null;
};

export type TasksResponse =
  | Task[]
  | { items: Task[]; count?: number; debug?: unknown };

export function normalizeTasks(resp: TasksResponse): { items: Task[]; count: number } {
  // Tolérer les 2 formats
  if (Array.isArray(resp)) {
    return { items: resp, count: resp.length };
  }
  if (resp && typeof resp === 'object' && 'items' in resp) {
    const items = Array.isArray((resp as any).items) ? (resp as any).items as Task[] : [];
    const count = typeof (resp as any).count === 'number' ? (resp as any).count : items.length;
    return { items, count };
  }
  // Fallback ultra-sécurisé
  return { items: [], count: 0 };
}
