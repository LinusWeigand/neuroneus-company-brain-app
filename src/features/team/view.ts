/**
 * Team Overview shapes, palette and formatters.
 *
 * Coordinates are in a fixed world space; the view is panned and zoomed on top
 * of them, so a node's x/y never changes unless the user drags that node.
 * `inDays`/`deadlineDays` are offsets from today so nothing ever reads stale.
 *
 * The members, goals and edges live in api/_data and arrive through
 * useWorkspace() — nothing in this file may hold any.
 */

/** Palette, kept as named constants because the raw rgba() values repeat. */
export const FONT = 'system-ui,-apple-system,sans-serif';
export const STROKE_IDLE = 'rgba(61,61,61,0.9)';
export const STROKE_ACTIVE = 'rgba(102,102,100,0.9)';
export const GOAL_FILL = 'rgba(54,54,52,0.95)';
export const GOAL_FILL_ACTIVE = 'rgba(68,68,66,0.97)';
export const TASK_FILL = 'rgba(35,35,34,0.92)';
export const TASK_FILL_ACTIVE = 'rgba(48,48,47,0.95)';
export const EDGE_DIM = 'rgba(102,102,100,0.35)';
export const EDGE = 'rgba(102,102,100,0.85)';
export const EDGE_SHARED = 'rgba(255,255,255,0.4)';
export const META_DIM = 'rgba(255,255,255,0.32)';
export const META = 'rgba(255,255,255,0.55)';
export const OVERDUE = '#f87171';
export const OVERDUE_STROKE = 'rgba(248,113,113,0.4)';

export const MIN_ZOOM = 0.15;
export const MAX_ZOOM = 2.5;

export type Progress = { done: number; total: number; late: number };

export type MemberNode = {
  id: string; name: string; x: number; y: number;
  r: number; w: number; h: number; round: boolean; overdue: number;
};

export type TaskNode = {
  id: string; x: number; y: number; w: number; h: number; r: number; round: boolean;
  title: string; members: string[];
  status?: string; priority?: string; inDays?: number; done?: boolean;
};

export type GoalNode = {
  id: string; x: number; y: number; w: number; h: number; r: number; round: boolean;
  title: string; status?: string; priority?: string; inDays?: number;
  people: string[]; progress?: Progress; tasks: TaskNode[];
};

export type GraphNodeT = MemberNode | GoalNode | TaskNode;

export type DetailGoal = {
  title: string; category: string; description: string;
  status: string; priority: string; deadlineDays?: number;
  done?: number; total?: number;
};

export type DetailTask = {
  title: string; status: string; priority: string; deadlineDays?: number;
};

export type ListMember = {
  id: string; name: string; activeGoals: string[]; more: number;
  goals: number; tasks: number; overdue: number; focus: string;
  detailGoals: DetailGoal[]; detailTasks: DetailTask[];
};

export const STATUS_STYLE: Record<string, { label: string; color: string }> = {
  "backlog": {
    "label": "Backlog",
    "color": "text-slate-400"
  },
  "not started": {
    "label": "Not started",
    "color": "text-slate-400"
  },
  "in progress": {
    "label": "In progress",
    "color": "text-blue-400"
  },
  "to do": {
    "label": "To do",
    "color": "text-slate-400"
  },
  "completed": {
    "label": "Completed",
    "color": "text-emerald-400"
  }
};

export const PRIORITY_STYLE: Record<string, { label: string; color: string }> = {
  "high": {
    "label": "High",
    "color": "text-red-400"
  },
  "medium": {
    "label": "Medium",
    "color": "text-blue-400"
  },
  "low": {
    "label": "Low",
    "color": "text-slate-400"
  }
};

/** dd.mm.yyyy, offset from today. */
export const formatDay = (offsetDays: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + offsetDays);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(dt.getDate())}.${p(dt.getMonth() + 1)}.${dt.getFullYear()}`;
};

export const isOverdue = (n: { inDays?: number; done?: boolean }) =>
  n.inDays !== undefined && n.inDays < 0 && !n.done;

/** Compact meta line used on graph nodes. */
export const nodeMeta = (n: TaskNode | GoalNode) => {
  const out: { text: string; color: string }[] = [
    { text: String(n.status ?? ''), color: META_DIM },
  ];
  if (n.inDays !== undefined)
    out.push({ text: formatDay(n.inDays), color: isOverdue(n) ? OVERDUE : META_DIM });
  return out;
};

/** Longer meta line used in the side panel. */
export const panelMeta = (n: TaskNode | GoalNode) => {
  const out: { text: string; color: string }[] = [
    { text: String(n.status ?? ''), color: META },
  ];
  if (n.priority) out.push({ text: `${n.priority} priority`, color: META });
  if (n.inDays !== undefined) {
    const day = formatDay(n.inDays);
    out.push({ text: isOverdue(n) ? `Overdue · ${day}` : day, color: isOverdue(n) ? OVERDUE : META });
  }
  return out;
};

export type NodeKind = 'member' | 'goal' | 'task';

/**
 * Which kind each node id is.
 *
 * Was a `kindOf(node)` that scanned the module-level arrays. With the content
 * arriving at runtime the lookup has to be built from what was actually
 * fetched, and a map built once beats three linear scans per rendered row.
 */
export function nodeKindIndex(members: MemberNode[], goals: GoalNode[]): Map<string, NodeKind> {
  const kinds = new Map<string, NodeKind>();
  for (const m of members) kinds.set(m.id, 'member');
  for (const g of goals) {
    kinds.set(g.id, 'goal');
    for (const t of g.tasks) kinds.set(t.id, 'task');
  }
  return kinds;
}

export const labelOf = (n: GraphNodeT) => ('title' in n ? n.title : n.name);
