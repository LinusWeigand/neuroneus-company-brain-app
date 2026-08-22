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
 * A run of briefing prose. Stored as runs rather than as marked-up text so the
 * browser never has to parse anything back out.
 *
 * The three reference kinds are visually distinct in the product design and so
 * are distinct here: a task is a plain blue link, a goal is a chip carrying its
 * own colour swatch, and a person is an avatar followed by their name. A single
 * generic `ref` cannot render any of them correctly.
 */
export type BriefingSegment =
  | { text: string }
  | { task: string }
  | { goal: string; color: string }
  | { person: string };

export type BriefingParagraph = BriefingSegment[];
