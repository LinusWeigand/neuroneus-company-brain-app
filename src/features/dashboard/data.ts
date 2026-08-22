/**
 * Daily Briefing content.
 *
 * Times are built from today's date so the agenda always reads as "today"
 * rather than a frozen timestamp. Everything else is static sample content
 * until there is a backend to draw from.
 */

/** Today at hh:mm, as a timestamp. */
const at = (h: number, m: number) => {
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d.getTime();
};

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

export const WAITING_ON_YOU: WaitingItem[] = [
  {
    initials: 'SK',
    title: 'Countersign the Northwind master agreement',
    from: 'Sarah Kim',
    due: '1 day overdue',
    overdue: true,
  },
  {
    initials: 'DR',
    title: 'Partnership deck — final draft',
    from: 'Daniel Ross',
    due: '3 days overdue',
    overdue: true,
  },
  {
    initials: 'EC',
    title: 'Sign-off: Q2 financial summary',
    from: 'Emma Clarke',
    due: null,
    overdue: false,
  },
];

/** Suggestions Ora has drafted. `canBeDone` decides whether "Done" is offered:
 *  some suggestions are actions to take, others are only worth discussing. */
export type PreparedItem = { title: string; body: string; canBeDone: boolean };

export const PREPARED_FOR_YOU: PreparedItem[] = [
  {
    title: 'Chase Northwind on the master agreement',
    body: 'Three days ago you wanted to do this as soon as legal replied. Legal replied two days ago.',
    canBeDone: true,
  },
  {
    title: 'Office viewing on Maximilianstraße',
    body: 'The viewing was yesterday at 15:00. Its description says you would check the square metres — nothing has landed on your board since.',
    canBeDone: false,
  },
];

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

export const AGENDA: AgendaEvent[] = [
  {
    id: 'e1',
    start: at(9, 30),
    end: at(10, 30),
    color: 'bg-blue-500',
    title: 'Client meeting: Northwind',
    description: 'Walk through the revised pricing tiers and close the open questions.',
    task: 'Finalize the Northwind pricing proposal',
  },
  { id: 'e2', start: at(10, 30), end: at(11, 15), color: 'bg-purple-500', title: 'Weekly partner sync' },
  {
    id: 'e3',
    start: at(13, 30),
    color: 'bg-green-500',
    title: 'Call: broker on the Munich office',
    description: 'Square metres and the rent ladder — she wants an answer in the next couple of days.',
    goal: { title: 'EU market expansion', color: '#60a5fa' },
    task: 'Review the Munich office lease',
  },
  {
    id: 'e4',
    start: at(15, 0),
    end: at(16, 30),
    color: 'bg-orange-500',
    title: 'Contract call: Ardent',
    goal: { title: 'Q3 revenue push', color: '#60a5fa' },
  },
  { id: 'e5', start: at(17, 0), end: at(17, 30), title: 'Onboarding: new account manager' },
];

/** Focus time protected on the calendar today. */
export const FOCUS_TIME = '5h 12m';
