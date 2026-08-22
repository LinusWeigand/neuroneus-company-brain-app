/**
 * Goals and Tasks shapes and formatters.
 *
 * The cards and columns live in api/_data and arrive through useWorkspace() —
 * nothing in this file may hold any.
 */

/** One card on the Tasks kanban. */
export type TaskCard = {
  goal?: string;
  title: string;
  desc?: string;
  priority: 'high' | 'medium' | 'low';
  dueDays?: number;
  review?: string;
};

export type TaskColumn = { label: string; color: string; cards: TaskCard[] };

/** One card on the Goals tab. `progress.percent` is carried rather than
 *  derived from done/total — see the note in api/_data/workspace.ts. */
export type GoalCard = {
  title: string;
  category: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: { label: string; color: string };
  people: string[];
  progress?: { done: number; total: number; percent: number };
  dueDays?: number;
};

export const PRIORITY = {
  high: { label: 'High', cls: 'text-red-400' },
  medium: { label: 'Medium', cls: 'text-blue-400' },
  low: { label: 'Low', cls: 'text-slate-400' },
} as const;

/** Dates are stored as offsets from today so the board never looks stale. */
export function dueDate(offsetDays: number) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const p = (n: number) => String(n).padStart(2, '0');
  return {
    text: `${p(d.getMonth() + 1)}/${p(d.getDate())}/${d.getFullYear()}`,
    overdue: offsetDays < 0,
  };
}
