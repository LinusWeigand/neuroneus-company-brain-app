/** Kanban columns behind the Tasks tab. */
export type TaskCard = {
  goal?: string;
  title: string;
  desc?: string;
  priority: 'high' | 'medium' | 'low';
  dueDays?: number;
  review?: string;
};

export type TaskColumn = { label: string; color: string; cards: TaskCard[] };

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

export const TASK_COLUMNS: TaskColumn[] = [
  {
    label: 'Backlog',
    color: '#71717a',
    cards: [
      {
        goal: 'EU market expansion',
        title: 'Scope office options in Paris',
        desc: 'Shortlist three districts and pull rent comparables for each.',
        priority: 'low',
      },
      {
        title: 'Onboarding plan for the new account manager',
        desc: 'First-week schedule, systems access and a 30-day ramp.',
        priority: 'low',
      },
    ],
  },
  {
    label: 'To do',
    color: '#71717a',
    cards: [
      {
        goal: 'Q3 revenue push',
        title: 'Chase Northwind on the master agreement',
        desc: 'Legal replied two days ago — get the countersigned copy back.',
        priority: 'high',
        dueDays: -1,
      },
      {
        goal: 'EU market expansion',
        title: 'Review the Munich office lease',
        desc: 'Square metres and the rent ladder — the broker wants an answer in two days.',
        priority: 'high',
        dueDays: 2,
      },
      {
        title: 'Prepare the weekly partner sync agenda',
        priority: 'medium',
        dueDays: 0,
      },
    ],
  },
  {
    label: 'In progress',
    color: '#60a5fa',
    cards: [
      {
        goal: 'Q3 revenue push',
        title: 'Finalize the Northwind pricing proposal',
        desc: 'Rebuild the tiers around the new usage caps and sign off the discount floor.',
        priority: 'high',
        dueDays: 0,
      },
      {
        goal: 'Partner program launch',
        title: 'Partnership deck — final draft',
        desc: 'Ten slides, updated traction numbers and the reseller pricing grid.',
        priority: 'high',
        dueDays: -3,
        review: 'Alex Morgan',
      },
      {
        goal: 'Compliance: SOC 2 audit',
        title: 'Q2 compliance filings',
        desc: 'Collect access-review evidence and close the two open auditor notes.',
        priority: 'medium',
        dueDays: 6,
      },
    ],
  },
  {
    label: 'Completed',
    color: '#10b981',
    cards: [
      {
        goal: 'Website relaunch',
        title: 'Website relaunch brief',
        desc: 'Positioning, sitemap and the copy deck for the new landing pages.',
        priority: 'medium',
        dueDays: -1,
      },
      {
        goal: 'Q3 revenue push',
        title: 'Collect Q2 pipeline numbers',
        priority: 'medium',
        dueDays: -3,
      },
    ],
  },
];
