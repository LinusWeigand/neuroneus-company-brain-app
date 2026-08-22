/**
 * Dashboard shapes and formatters.
 *
 * Content lives in api/_data and arrives through useWorkspace() — nothing in
 * this file may hold any.
 */

export const hhmm = (ts: number) => {
  const d = new Date(ts);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

export const todayLabel = () =>
  new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' });

/** Reviews and sign-offs other people are blocked on. */
export type WaitingItem = {
  initials: string;
  title: string;
  from: string;
  due: string | null;
  overdue: boolean;
};

/** Suggestions Ora has drafted. `canBeDone` decides whether "Done" is offered:
 *  some suggestions are actions to take, others are only worth discussing. */
export type PreparedItem = { title: string; body: string; canBeDone: boolean };

export type AgendaEvent = {
  id: string;
  start: number;
  end?: number;
  color?: string;
  title: string;
  description?: string;
  goal?: { title: string; color: string };
  task?: string;
};

/**
 * A run of briefing prose: either plain text, or a reference to a goal or task
 * that renders as a chip. Stored as runs rather than as marked-up text so the
 * browser never has to parse anything back out.
 */
export type BriefingSegment = { text: string } | { ref: string; color?: string };
export type BriefingParagraph = BriefingSegment[];
