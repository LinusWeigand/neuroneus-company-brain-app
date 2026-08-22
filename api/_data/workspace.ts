/**
 * Workspace content, server-side only.
 *
 * This file must never be imported from src/. It is reachable exclusively
 * through api/data.ts, which requires a valid session first — that is what
 * keeps it out of the public JavaScript bundle. `npm run build` greps the
 * output for strings that only occur here, so a stray import fails the build
 * rather than quietly shipping this to every visitor.
 *
 * Sample content for now; replace with real queries when the product has
 * customer data. The boundary is what matters, not what is behind it.
 */

/** The workspace label in the sidebar. Moves to the session in phase 2, when
 *  a user belongs to a company row rather than to the only workspace there is. */
export const WORKSPACE_NAME = 'Meridian';

/** Reviews other people are blocked on. */
/** Today at hh:mm as a timestamp, evaluated per request so the agenda always
 *  reads as today rather than the day this file was written. */
const hhmmToday = (h: number, m: number) => {
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d.getTime();
};

export const WAITING_ON_YOU = [
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

/** Suggestions Ora has drafted. */
export const PREPARED_FOR_YOU = [
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

/** Today's calendar. Times are rebuilt per request so the agenda always reads as today. */
export const AGENDA = [
  {
    id: 'e1',
    start: hhmmToday(9, 30),
    end: hhmmToday(10, 30),
    color: 'bg-blue-500',
    title: 'Client meeting: Northwind',
    description: 'Walk through the revised pricing tiers and close the open questions.',
    task: 'Finalize the Northwind pricing proposal',
  },
  { id: 'e2', start: hhmmToday(10, 30), end: hhmmToday(11, 15), color: 'bg-purple-500', title: 'Weekly partner sync' },
  {
    id: 'e3',
    start: hhmmToday(13, 30),
    color: 'bg-green-500',
    title: 'Call: broker on the Munich office',
    description: 'Square metres and the rent ladder — she wants an answer in the next couple of days.',
    goal: { title: 'EU market expansion', color: '#60a5fa' },
    task: 'Review the Munich office lease',
  },
  {
    id: 'e4',
    start: hhmmToday(15, 0),
    end: hhmmToday(16, 30),
    color: 'bg-orange-500',
    title: 'Contract call: Ardent',
    goal: { title: 'Q3 revenue push', color: '#60a5fa' },
  },
  { id: 'e5', start: hhmmToday(17, 0), end: hhmmToday(17, 30), title: 'Onboarding: new account manager' },
];

/** Team members as graph nodes. */
/** Focus time protected on the calendar today. */
export const FOCUS_TIME = '5h 12m';

/**
 * The Daily Briefing narrative.
 *
 * Prose with goals and tasks referenced inline, so it is stored as runs rather
 * than as a string: a segment is either plain text or a reference chip. Markup
 * in the text would mean parsing it back out in the browser, and a chip needs
 * its own colour anyway.
 */
export const BRIEFING = [
  [
    { text: "Northwind is the only thing on this week's critical path. " },
    { ref: 'Finalize the Northwind pricing proposal' },
    { text: ' is due today, and nothing else on ' },
    { ref: 'Q3 revenue push', color: '#60a5fa' },
    {
      text:
        ' can move before those numbers are signed off. Sarah Kim has had the master'
        + ' agreement waiting on your countersignature since yesterday.',
    },
  ],
  [
    { ref: 'EU market expansion', color: '#60a5fa' },
    { text: ' hangs on one decision: ' },
    { ref: 'Review the Munich office lease' },
    {
      text:
        ' is due in two days, the broker is on the phone about it this afternoon, and'
        + ' that call is hard to reverse once the lease is countersigned.',
    },
  ],
  [
    { text: 'You closed ' },
    { ref: 'Website relaunch brief' },
    {
      text:
        ' yesterday, and Daniel Ross has taken the compliance paperwork off your plate. ',
    },
    { ref: 'Hiring: senior engineers', color: '#60a5fa' },
    { text: ' still has no tasks on it at all — it will not move on its own.' },
  ],
];

export const MEMBERS = [
  {
    "id": "am",
    "name": "Alex Morgan",
    "x": 250,
    "y": 190,
    "r": 30,
    "w": 60,
    "h": 60,
    "round": true,
    "overdue": 2
  },
  {
    "id": "sk",
    "name": "Sarah Kim",
    "x": 665,
    "y": 185,
    "r": 24,
    "w": 48,
    "h": 48,
    "round": true,
    "overdue": 0
  },
  {
    "id": "dr",
    "name": "Daniel Ross",
    "x": 270,
    "y": 505,
    "r": 26,
    "w": 52,
    "h": 52,
    "round": true,
    "overdue": 1
  },
  {
    "id": "ec",
    "name": "Emma Clarke",
    "x": 655,
    "y": 490,
    "r": 22,
    "w": 44,
    "h": 44,
    "round": true,
    "overdue": 0
  },
  {
    "id": "rp",
    "name": "Raj Patel",
    "x": 455,
    "y": 550,
    "r": 25,
    "w": 50,
    "h": 50,
    "round": true,
    "overdue": 0
  }
];

/** Goals and their tasks, positioned for the map. */
export const TEAM_GOALS = [
  {
    "id": "g1",
    "x": 148,
    "y": 350,
    "w": 216,
    "h": 96,
    "r": 0,
    "round": false,
    "title": "Q3 revenue push",
    "status": "In progress",
    "priority": "High",
    "inDays": 75,
    "people": [
      "Alex Morgan",
      "Sarah Kim",
      "Daniel Ross"
    ],
    "progress": {
      "done": 5,
      "total": 12,
      "late": 2
    },
    "tasks": [
      {
        "id": "t1",
        "x": 130,
        "y": 500,
        "w": 200,
        "h": 60,
        "r": 0,
        "round": false,
        "title": "Chase Northwind on the master agreement",
        "members": [
          "am"
        ],
        "status": "To do",
        "priority": "High",
        "inDays": -1
      },
      {
        "id": "t2",
        "x": 168,
        "y": 622,
        "w": 212,
        "h": 60,
        "r": 0,
        "round": false,
        "title": "Finalize the Northwind pricing proposal",
        "members": [
          "am",
          "sk"
        ],
        "status": "In progress",
        "priority": "High",
        "inDays": 0
      }
    ]
  },
  {
    "id": "g2",
    "x": 600,
    "y": 78,
    "w": 228,
    "h": 96,
    "r": 0,
    "round": false,
    "title": "EU market expansion",
    "status": "In progress",
    "priority": "High",
    "inDays": 30,
    "people": [
      "Alex Morgan",
      "Emma Clarke"
    ],
    "progress": {
      "done": 7,
      "total": 9,
      "late": 0
    },
    "tasks": [
      {
        "id": "t3",
        "x": 836,
        "y": 190,
        "w": 196,
        "h": 60,
        "r": 0,
        "round": false,
        "title": "Review the Munich office lease",
        "members": [
          "am"
        ],
        "status": "To do",
        "priority": "High",
        "inDays": 2
      },
      {
        "id": "t4",
        "x": 832,
        "y": 74,
        "w": 196,
        "h": 60,
        "r": 0,
        "round": false,
        "title": "Scope office options in Paris",
        "members": [
          "ec"
        ],
        "status": "Backlog",
        "priority": "Low"
      }
    ]
  },
  {
    "id": "g3",
    "x": 802,
    "y": 555,
    "w": 222,
    "h": 80,
    "r": 0,
    "round": false,
    "title": "Website relaunch",
    "status": "In progress",
    "priority": "Medium",
    "inDays": 15,
    "people": [
      "Daniel Ross",
      "Alex Morgan"
    ],
    "progress": {
      "done": 9,
      "total": 14,
      "late": 0
    },
    "tasks": [
      {
        "id": "t5",
        "x": 800,
        "y": 675,
        "w": 210,
        "h": 60,
        "r": 0,
        "round": false,
        "title": "Website relaunch brief",
        "members": [
          "dr",
          "am"
        ],
        "status": "Completed",
        "priority": "Medium",
        "done": true
      }
    ]
  },
  {
    "id": "g4",
    "x": 432,
    "y": 655,
    "w": 210,
    "h": 80,
    "r": 0,
    "round": false,
    "title": "Hiring: senior engineers",
    "status": "Not started",
    "priority": "Medium",
    "people": [
      "Alex Morgan",
      "Raj Patel"
    ],
    "tasks": []
  }
];

/** member id -> goal id. */
export const EDGES = [
  [
    "am",
    "g1"
  ],
  [
    "sk",
    "g1"
  ],
  [
    "dr",
    "g1"
  ],
  [
    "am",
    "g2"
  ],
  [
    "ec",
    "g2"
  ],
  [
    "dr",
    "g3"
  ],
  [
    "am",
    "g3"
  ],
  [
    "am",
    "g4"
  ],
  [
    "rp",
    "g4"
  ]
];

/** Per-person detail for the roster view. */
export const LIST_MEMBERS = [
  {
    "id": "am",
    "name": "Alex Morgan",
    "activeGoals": [
      "Q3 revenue push",
      "EU market expansion"
    ],
    "more": 2,
    "goals": 4,
    "tasks": 7,
    "overdue": 2,
    "focus": "Getting Northwind signed before the quarter closes.",
    "detailGoals": [
      {
        "title": "Q3 revenue push",
        "category": "Sales",
        "description": "Close Northwind and Ardent and lift recurring revenue 30%.",
        "status": "in progress",
        "priority": "high",
        "deadlineDays": 75,
        "done": 5,
        "total": 12
      },
      {
        "title": "EU market expansion",
        "category": "Operations",
        "description": "Open the first EU office: legal entity, lease and the local hiring pipeline.",
        "status": "in progress",
        "priority": "high",
        "deadlineDays": 30,
        "done": 7,
        "total": 9
      }
    ],
    "detailTasks": [
      {
        "title": "Countersign the Northwind master agreement",
        "status": "to do",
        "priority": "high",
        "deadlineDays": -1
      },
      {
        "title": "Chase Northwind on the master agreement",
        "status": "to do",
        "priority": "high",
        "deadlineDays": -1
      },
      {
        "title": "Finalize the Northwind pricing proposal",
        "status": "in progress",
        "priority": "high",
        "deadlineDays": 0
      },
      {
        "title": "Review the Munich office lease",
        "status": "to do",
        "priority": "high",
        "deadlineDays": 2
      }
    ]
  },
  {
    "id": "sk",
    "name": "Sarah Kim",
    "activeGoals": [
      "Q3 revenue push"
    ],
    "more": 0,
    "goals": 1,
    "tasks": 3,
    "overdue": 0,
    "focus": "Northwind pricing tiers.",
    "detailGoals": [
      {
        "title": "Q3 revenue push",
        "category": "Sales",
        "description": "Close Northwind and Ardent and lift recurring revenue 30%.",
        "status": "in progress",
        "priority": "high",
        "deadlineDays": 75,
        "done": 5,
        "total": 12
      }
    ],
    "detailTasks": [
      {
        "title": "Finalize the Northwind pricing proposal",
        "status": "in progress",
        "priority": "high",
        "deadlineDays": 0
      },
      {
        "title": "Draft the Q3 revenue forecast",
        "status": "to do",
        "priority": "medium",
        "deadlineDays": 6
      },
      {
        "title": "Collect the tier feedback from sales",
        "status": "backlog",
        "priority": "low"
      }
    ]
  },
  {
    "id": "dr",
    "name": "Daniel Ross",
    "activeGoals": [
      "Q3 revenue push",
      "Website relaunch"
    ],
    "more": 2,
    "goals": 4,
    "tasks": 5,
    "overdue": 1,
    "focus": "Compliance paperwork, then back to the relaunch.",
    "detailGoals": [
      {
        "title": "Website relaunch",
        "category": "Marketing",
        "description": "New positioning, new site — live before the revenue push needs landing pages.",
        "status": "in progress",
        "priority": "medium",
        "deadlineDays": 15,
        "done": 9,
        "total": 14
      },
      {
        "title": "Q3 revenue push",
        "category": "Sales",
        "description": "Close Northwind and Ardent and lift recurring revenue 30%.",
        "status": "in progress",
        "priority": "high",
        "deadlineDays": 75,
        "done": 5,
        "total": 12
      }
    ],
    "detailTasks": [
      {
        "title": "Partnership deck — final draft",
        "status": "in progress",
        "priority": "high",
        "deadlineDays": -3
      },
      {
        "title": "Rewrite the pricing page copy",
        "status": "to do",
        "priority": "medium",
        "deadlineDays": 4
      },
      {
        "title": "Website relaunch brief",
        "status": "completed",
        "priority": "medium"
      }
    ]
  },
  {
    "id": "ec",
    "name": "Emma Clarke",
    "activeGoals": [
      "EU market expansion",
      "Compliance: SOC 2 audit"
    ],
    "more": 0,
    "goals": 2,
    "tasks": 3,
    "overdue": 0,
    "focus": "SOC 2 evidence for the auditor.",
    "detailGoals": [
      {
        "title": "EU market expansion",
        "category": "Operations",
        "description": "Open the first EU office: legal entity, lease and the local hiring pipeline.",
        "status": "in progress",
        "priority": "high",
        "deadlineDays": 30,
        "done": 7,
        "total": 9
      },
      {
        "title": "Compliance: SOC 2 audit",
        "category": "Legal",
        "description": "Evidence collection and the auditor walkthrough for the Type II report.",
        "status": "in progress",
        "priority": "medium",
        "deadlineDays": 85,
        "done": 4,
        "total": 10
      }
    ],
    "detailTasks": [
      {
        "title": "Scope office options in Paris",
        "status": "backlog",
        "priority": "low"
      },
      {
        "title": "Sign-off: Q2 financial summary",
        "status": "to do",
        "priority": "medium",
        "deadlineDays": 5
      },
      {
        "title": "Collect SOC 2 evidence — access logs",
        "status": "in progress",
        "priority": "medium",
        "deadlineDays": 12
      }
    ]
  },
  {
    "id": "rp",
    "name": "Raj Patel",
    "activeGoals": [
      "Data platform migration",
      "Hiring: senior engineers"
    ],
    "more": 0,
    "goals": 2,
    "tasks": 4,
    "overdue": 0,
    "focus": "The data platform cutover.",
    "detailGoals": [
      {
        "title": "Data platform migration",
        "category": "Engineering",
        "description": "One warehouse instead of four pipelines — the metering the usage caps are billed on.",
        "status": "in progress",
        "priority": "high",
        "deadlineDays": 21,
        "done": 6,
        "total": 11
      },
      {
        "title": "Hiring: senior engineers",
        "category": "People",
        "description": "Three senior hires for the platform team before the January roadmap starts.",
        "status": "not started",
        "priority": "medium",
        "done": 0,
        "total": 0
      }
    ],
    "detailTasks": [
      {
        "title": "Plan the data platform cutover",
        "status": "in progress",
        "priority": "high",
        "deadlineDays": 8
      },
      {
        "title": "Fix the metering double-count under retry",
        "status": "to do",
        "priority": "medium",
        "deadlineDays": 3
      },
      {
        "title": "Debrief the platform candidates",
        "status": "to do",
        "priority": "medium",
        "deadlineDays": 2
      }
    ]
  }
];

/** Kanban columns behind the Tasks tab. */
export const TASK_COLUMNS = [
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

/** Goal cards shown on the Goals tab. */
/**
 * Goal cards behind the Goals tab.
 *
 * `percent` is stored rather than derived from done/total. The recovered
 * design reads "5/12 tasks · 50%", and 5/12 is not 50% — the bar and the count
 * came from different places in the original. Computing one from the other
 * would quietly change what the page says.
 *
 * `people` holds full names; the avatars derive their initials. The original
 * stored the initials themselves, which made the roster and the cards
 * disagree about what a person is.
 */
export const GOAL_CARDS = [
  {
    "category": "Sales",
    "priority": "high",
    "title": "Q3 revenue push",
    "description": "Close Northwind and Ardent and lift recurring revenue 30% before the quarter ends.",
    "status": { "label": "In progress", "color": "#60a5fa" },
    "progress": { "done": 5, "total": 12, "percent": 50 },
    "dueDays": 75,
    "people": ["Alex Morgan", "Sarah Kim", "Daniel Ross"]
  },
  {
    "category": "Operations",
    "priority": "high",
    "title": "EU market expansion",
    "description": "Open the first EU office: legal entity, lease and the local hiring pipeline.",
    "status": { "label": "In progress", "color": "#60a5fa" },
    "progress": { "done": 7, "total": 9, "percent": 83 },
    "dueDays": 30,
    "people": ["Alex Morgan", "Emma Clarke"]
  },
  {
    "category": "People",
    "priority": "medium",
    "title": "Hiring: senior engineers",
    "description": "Three senior hires for the platform team before the January roadmap starts.",
    "status": { "label": "Not started", "color": "#71717a" },
    "people": ["Alex Morgan", "Raj Patel"]
  },
  {
    "category": "Marketing",
    "priority": "medium",
    "title": "Website relaunch",
    "description": "New positioning, new site — live before the revenue push needs landing pages.",
    "status": { "label": "In progress", "color": "#60a5fa" },
    "progress": { "done": 9, "total": 14, "percent": 68 },
    "dueDays": 15,
    "people": ["Daniel Ross", "Alex Morgan"]
  },
  {
    "category": "Partnerships",
    "priority": "low",
    "title": "Partner program launch",
    "description": "Stand up the reseller tier: deck, pricing and the first five signed partners.",
    "status": { "label": "Backlog", "color": "#71717a" },
    "progress": { "done": 2, "total": 6, "percent": 42 },
    "dueDays": 8,
    "people": ["Daniel Ross"]
  },
  {
    "category": "Legal",
    "priority": "medium",
    "title": "Compliance: SOC 2 audit",
    "description": "Evidence collection and the auditor walkthrough for the Type II report.",
    "status": { "label": "In progress", "color": "#60a5fa" },
    "progress": { "done": 4, "total": 10, "percent": 45 },
    "dueDays": 85,
    "people": ["Emma Clarke", "Daniel Ross"]
  },
  {
    "category": "Engineering",
    "priority": "high",
    "title": "Data platform migration",
    "description": "One warehouse instead of four pipelines — the metering the usage caps are billed on.",
    "status": { "label": "In progress", "color": "#60a5fa" },
    "progress": { "done": 6, "total": 11, "percent": 55 },
    "dueDays": 21,
    "people": ["Raj Patel"]
  }
];

/** Knowledge-base entries. The graph is derived from these client-side. */
export const ENTRIES = [
  {
    "id": "northwind",
    "title": "Northwind Energy",
    "type": "customer",
    "pinned": true,
    "content": "Enterprise account since 2024. The three-year master agreement cleared legal two days ago and has been waiting on Alex's countersignature since yesterday — the open points live in [[Master agreement — redlines]]. Sarah Kim owns the relationship, and everything the deal waits on sits in [[Q3 revenue push]]."
  },
  {
    "id": "nw-redlines",
    "parent": "northwind",
    "title": "Master agreement — redlines",
    "type": "decision",
    "content": "Liability cap and the termination window. Legal replied two days ago; anything below list needs [[Discount floor policy]] first."
  },
  {
    "id": "nw-priya",
    "parent": "northwind",
    "title": "Priya Raman — Northwind CTO",
    "type": "person",
    "content": "Decides on architecture, not on price. Prefers a written summary before any call — see [[Briefing before an exec call]]."
  },
  {
    "id": "nw-marcus",
    "parent": "northwind",
    "title": "Marcus Feld — Northwind procurement",
    "type": "person",
    "content": "Runs the security questionnaire. Nothing signs before [[SOC 2 evidence checklist]] clears."
  },
  {
    "id": "nw-onboard",
    "parent": "northwind",
    "title": "Onboarding — Northwind ops team",
    "type": "process",
    "content": "Accounts, environments and the questionnaire from [[SOC 2 evidence checklist]]. Mirrors [[Customer onboarding — standard]]."
  },
  {
    "id": "nw-renewal",
    "parent": "northwind",
    "title": "Northwind — renewal timeline",
    "type": "decision",
    "content": "Notice window opens in October. Everything in [[Pricing tiers 2026]] has to hold by then."
  },
  {
    "id": "nw-pricing",
    "parent": "northwind",
    "title": "Northwind — pricing history",
    "type": "note",
    "content": "What they paid per seat since 2024, and the two discounts we granted mid-term."
  },
  {
    "id": "nw-escal",
    "parent": "northwind",
    "title": "Northwind — support escalations",
    "type": "learning",
    "content": "Every escalation since the pilot, and which of them we caused. Fed [[Escalation postmortems]]."
  },
  {
    "id": "harborline",
    "title": "Harborline Logistics",
    "type": "customer",
    "content": "Second-biggest account. Procurement runs the same playbook as [[Northwind Energy]], so the security questionnaire lands before the quote does."
  },
  {
    "id": "hl-pilot",
    "parent": "harborline",
    "title": "Harborline — pilot scope",
    "type": "decision",
    "content": "Two depots, ninety days, one success metric everyone actually agreed on."
  },
  {
    "id": "hl-dana",
    "parent": "harborline",
    "title": "Dana Okoro — Harborline ops lead",
    "type": "person",
    "content": "The only person who can green-light a rollout. Reads everything, answers in one line."
  },
  {
    "id": "hl-integration",
    "parent": "harborline",
    "title": "Harborline — telemetry integration",
    "type": "process",
    "content": "Their depot feed into our ingest. Same shape as [[Data platform migration]] wants for everyone."
  },
  {
    "id": "hl-renewal",
    "parent": "harborline",
    "title": "Harborline — renewal risk",
    "type": "learning",
    "content": "They churn when the champion leaves. [[Dana Okoro — Harborline ops lead]] is the champion."
  },
  {
    "id": "cavendish",
    "title": "Cavendish Retail",
    "type": "customer",
    "content": "Signed in March, still onboarding. Slower than [[Harborline Logistics]] because their data lives in four places — see [[Data platform migration]]."
  },
  {
    "id": "cv-rollout",
    "parent": "cavendish",
    "title": "Cavendish — store rollout plan",
    "type": "process",
    "content": "Forty stores in three waves. Wave one is the test of [[Customer onboarding — standard]]."
  },
  {
    "id": "cv-owner",
    "parent": "cavendish",
    "title": "Ines Bauer — Cavendish programme lead",
    "type": "person",
    "content": "Owns the rollout internally. Wants a weekly written update, not a call."
  },
  {
    "id": "cv-data",
    "parent": "cavendish",
    "title": "Cavendish — data quality findings",
    "type": "learning",
    "content": "Four systems, three spellings per store. Why [[Data platform migration]] exists."
  },
  {
    "id": "ardent",
    "title": "Ardent Manufacturing",
    "type": "customer",
    "content": "Late-stage. Their legal team lifted the redlines from [[Northwind Energy]] almost word for word, so [[Master agreement — redlines]] answers most of it."
  },
  {
    "id": "ar-security",
    "parent": "ardent",
    "title": "Ardent — security review",
    "type": "process",
    "content": "Same questionnaire, stricter reviewer. Everything comes from [[SOC 2 evidence checklist]]."
  },
  {
    "id": "ar-tomas",
    "parent": "ardent",
    "title": "Tomas Brandt — Ardent CFO",
    "type": "person",
    "content": "Signs the contract. Only cares about the number in [[Pricing tiers 2026]]."
  },
  {
    "id": "vellum",
    "title": "Vellum Publishing",
    "type": "customer",
    "content": "Small, loud, useful: they file the best bug reports we get. Feeds [[Escalation postmortems]]."
  },
  {
    "id": "ve-usage",
    "parent": "vellum",
    "title": "Vellum — usage pattern",
    "type": "learning",
    "content": "They use one feature ninety percent of the time. That feature is why [[Pricing tiers 2026]] has a usage cap."
  },
  {
    "id": "kestrel",
    "title": "Kestrel Foods",
    "type": "customer",
    "content": "Reseller-led, not direct — the terms come from [[Partner program — reseller tiers]]."
  },
  {
    "id": "ke-margin",
    "parent": "kestrel",
    "title": "Kestrel — margin exception",
    "type": "decision",
    "content": "Approved once, at 4 points over band, on the condition it never becomes precedent. It became precedent — see [[Discount floor policy]]."
  },
  {
    "id": "lumen",
    "title": "Lumen Health",
    "type": "customer",
    "content": "Regulated: nothing moves without [[SOC 2 evidence checklist]] and the DPA in [[Data processing agreement]]."
  },
  {
    "id": "lu-dpa",
    "parent": "lumen",
    "title": "Lumen — DPA amendments",
    "type": "decision",
    "content": "Two clauses we accept, one we never do. The one we never do is in [[Data processing agreement]]."
  },
  {
    "id": "brightpath",
    "title": "Brightpath Education",
    "type": "customer",
    "content": "Pilot only. The reason [[Pricing tiers 2026]] has an education band at all."
  },
  {
    "id": "pricing",
    "title": "Pricing tiers 2026",
    "type": "product",
    "content": "Three tiers rebuilt around the new usage caps. Never quote below list without reading [[Discount floor policy]]. The education band exists because of [[Brightpath Education]]."
  },
  {
    "id": "pr-caps",
    "parent": "pricing",
    "title": "Usage caps — how they were set",
    "type": "decision",
    "content": "Cap is the 90th percentile of actual use, not a guess. [[Vellum — usage pattern]] set the shape."
  },
  {
    "id": "pr-floor",
    "parent": "pricing",
    "title": "Discount floor policy",
    "type": "decision",
    "content": "Nothing below list without a written reason. [[Kestrel — margin exception]] is what happens when we skip it."
  },
  {
    "id": "pr-migration",
    "parent": "pricing",
    "title": "Tier migration — existing accounts",
    "type": "process",
    "content": "Who moves, who is grandfathered, and what we tell [[Northwind Energy]] at renewal."
  },
  {
    "id": "partner",
    "title": "Partner program — reseller tiers",
    "type": "product",
    "content": "Margin bands, certification requirements and who owns the first five signed partners. Depends on [[Pricing tiers 2026]]."
  },
  {
    "id": "pt-cert",
    "parent": "partner",
    "title": "Partner certification path",
    "type": "process",
    "content": "Three modules, one exam, renewed yearly. Built from [[Customer onboarding — standard]]."
  },
  {
    "id": "pt-margins",
    "parent": "partner",
    "title": "Reseller margin bands",
    "type": "decision",
    "content": "Four bands by volume. Below band four we sell direct — [[Kestrel Foods]] is the exception."
  },
  {
    "id": "usage-api",
    "title": "Usage metering API",
    "type": "product",
    "content": "What the caps in [[Pricing tiers 2026]] are actually measured with. Owned by the platform team."
  },
  {
    "id": "ua-accuracy",
    "parent": "usage-api",
    "title": "Metering accuracy — known gaps",
    "type": "learning",
    "content": "Two events double-count under retry. Fixed in staging, not yet in [[Data platform migration]]."
  },
  {
    "id": "sso",
    "title": "SSO / SAML support",
    "type": "product",
    "content": "Table stakes for every account above the mid band. [[Ardent Manufacturing]] made it a condition."
  },
  {
    "id": "eu",
    "title": "EU entity setup",
    "type": "process",
    "content": "Legal entity first, then the lease, then the local hiring pipeline. [[Munich office lease]] is the current blocker, and a second entity means a second run at [[Data processing agreement]]."
  },
  {
    "id": "eu-payroll",
    "parent": "eu",
    "title": "EU payroll — provider choice",
    "type": "decision",
    "content": "Two providers, one that handles DE and AT together. That one wins."
  },
  {
    "id": "eu-hiring",
    "parent": "eu",
    "title": "Munich — first three hires",
    "type": "process",
    "content": "One lead, two engineers. The lead has to be in place before [[Munich office lease]] starts costing us."
  },
  {
    "id": "soc2",
    "title": "SOC 2 evidence checklist",
    "type": "process",
    "content": "Access reviews, change management and the vendor list. Two auditor notes are still open — see [[Vendor list — 2026]]. Every customer security review starts here, from [[Northwind Energy]] to [[Lumen Health]]."
  },
  {
    "id": "soc-access",
    "parent": "soc2",
    "title": "Quarterly access review",
    "type": "process",
    "content": "Who has production access and why. Ninety minutes if the [[Vendor list — 2026]] is current."
  },
  {
    "id": "soc-vendors",
    "parent": "soc2",
    "title": "Vendor list — 2026",
    "type": "note",
    "content": "Every subprocessor, what they touch, and which DPA covers them — see [[Data processing agreement]]."
  },
  {
    "id": "soc-change",
    "parent": "soc2",
    "title": "Change management — evidence trail",
    "type": "process",
    "content": "What the auditor actually asked for, versus what we thought they wanted."
  },
  {
    "id": "onboarding",
    "title": "Customer onboarding — standard",
    "type": "process",
    "content": "The path every account walks: kickoff, environments, questionnaire, first value. [[Cavendish — store rollout plan]] is the stress test."
  },
  {
    "id": "on-kickoff",
    "parent": "onboarding",
    "title": "Kickoff — the first 30 minutes",
    "type": "process",
    "content": "Names, decision rights, and the one metric they will judge us on."
  },
  {
    "id": "on-value",
    "parent": "onboarding",
    "title": "First value — what counts",
    "type": "learning",
    "content": "Not login. Not setup. The first report they send to their own boss."
  },
  {
    "id": "dpa",
    "title": "Data processing agreement",
    "type": "process",
    "content": "Our standard DPA and the two clauses we negotiate. [[Lumen — DPA amendments]] is the hard case."
  },
  {
    "id": "incident",
    "title": "Incident response — on call",
    "type": "process",
    "content": "Who is paged, what they say, and when the customer hears it. Feeds [[Escalation postmortems]]."
  },
  {
    "id": "in-sev",
    "parent": "incident",
    "title": "Severity levels — the honest version",
    "type": "note",
    "content": "Sev 1 means someone is awake. Everything else can wait for the morning."
  },
  {
    "id": "hiring-loop",
    "title": "Hiring loop — engineering",
    "type": "process",
    "content": "Four stages, one bar, written debrief before the room. Same loop [[Munich — first three hires]] uses."
  },
  {
    "id": "munich",
    "title": "Munich office lease",
    "type": "decision",
    "content": "12-year term on Maximilianstraße with a break clause at year five. The broker wants an answer within days, and the hiring pipeline in [[EU entity setup]] cannot start until it is signed."
  },
  {
    "id": "mu-terms",
    "parent": "munich",
    "title": "Lease terms — square metres and rent ladder",
    "type": "note",
    "content": "Square metres, the step-up schedule and the service charge cap."
  },
  {
    "id": "mu-alt",
    "parent": "munich",
    "title": "Munich — the option we passed on",
    "type": "decision",
    "content": "Cheaper, smaller, wrong side of the river. Worth revisiting if [[Munich — first three hires]] slips."
  },
  {
    "id": "build-buy",
    "title": "Build vs buy — analytics",
    "type": "decision",
    "content": "We buy. Revisit when the vendor bill passes two engineers a year. Ties into [[Data platform migration]]."
  },
  {
    "id": "region",
    "title": "EU data residency — where we host",
    "type": "decision",
    "content": "Frankfurt, not Dublin, because [[Lumen Health]] asked and [[Data processing agreement]] made it cheap to say yes."
  },
  {
    "id": "support-tiers",
    "title": "Support tiers — what we promise",
    "type": "decision",
    "content": "Response times by band. The top band is the only one with a named human, and it is priced in [[Pricing tiers 2026]]."
  },
  {
    "id": "roadmap-q3",
    "title": "Q3 roadmap — what got cut",
    "type": "decision",
    "content": "Two features cut so [[Data platform migration]] could ship. The cut list is the interesting part."
  },
  {
    "id": "relaunch",
    "title": "Website relaunch brief",
    "type": "project",
    "content": "Positioning, sitemap and the copy deck the relaunch runs on — signed off yesterday, so the site can be live before the revenue push needs landing pages. Pricing page copy comes straight from [[Pricing tiers 2026]]."
  },
  {
    "id": "rl-positioning",
    "parent": "relaunch",
    "title": "Positioning — the one sentence",
    "type": "learning",
    "content": "Took four weeks and eleven drafts. The winning one came from a support ticket."
  },
  {
    "id": "rl-pricing-page",
    "parent": "relaunch",
    "title": "Pricing page — open questions",
    "type": "note",
    "content": "Do we show the caps? [[Usage caps — how they were set]] says yes, sales says no."
  },
  {
    "id": "dataplat",
    "title": "Data platform migration",
    "type": "project",
    "content": "One warehouse instead of four pipelines. [[Cavendish — data quality findings]] is the reason it got funded, and [[Metering accuracy — known gaps]] is the reason it is urgent."
  },
  {
    "id": "dp-cutover",
    "parent": "dataplat",
    "title": "Cutover plan — the risky hour",
    "type": "process",
    "content": "What runs in parallel, what breaks, and who says stop."
  },
  {
    "id": "dp-cost",
    "parent": "dataplat",
    "title": "Migration — cost model",
    "type": "note",
    "content": "Cheaper from month seven. Month one to six is the argument."
  },
  {
    "id": "q3push",
    "title": "Q3 revenue push",
    "type": "project",
    "content": "Close [[Northwind Energy]] and [[Ardent Manufacturing]], lift recurring revenue 30%. Everything else waits."
  },
  {
    "id": "brand",
    "title": "Brand refresh — phase two",
    "type": "project",
    "content": "The parts of [[Website relaunch brief]] that did not fit in phase one."
  },
  {
    "id": "sarah",
    "title": "Sarah Kim — account lead",
    "type": "person",
    "content": "Owns [[Northwind Energy]] and half of [[Q3 revenue push]]. Ask her before quoting anything."
  },
  {
    "id": "daniel",
    "title": "Daniel Ross — marketing",
    "type": "person",
    "content": "Owns [[Website relaunch brief]]. Took the compliance paperwork off Alex's plate this quarter."
  },
  {
    "id": "emma",
    "title": "Emma Clarke — operations",
    "type": "person",
    "content": "Runs [[EU entity setup]] and the audit side of [[SOC 2 evidence checklist]]."
  },
  {
    "id": "raj",
    "title": "Raj Patel — platform lead",
    "type": "person",
    "content": "Owns [[Data platform migration]] and [[Usage metering API]]. The bottleneck, and knows it — [[Hiring loop — engineering]] is the plan to stop being one."
  },
  {
    "id": "postmortems",
    "title": "Escalation postmortems",
    "type": "learning",
    "content": "Every escalation, what caused it, what we changed. Most of them trace to [[Customer onboarding — standard]] being skipped."
  },
  {
    "id": "pm-pattern",
    "parent": "postmortems",
    "title": "The pattern behind most escalations",
    "type": "learning",
    "content": "Nobody wrote down who decides. [[Kickoff — the first 30 minutes]] now asks."
  },
  {
    "id": "exec-brief",
    "title": "Briefing before an exec call",
    "type": "learning",
    "content": "One page, three numbers, one ask. [[Priya Raman — Northwind CTO]] taught us this the hard way."
  },
  {
    "id": "discount-lesson",
    "title": "What discounting actually costs",
    "type": "learning",
    "content": "Two points of margin is one engineer. [[Discount floor policy]] exists because of this note."
  },
  {
    "id": "churn-signals",
    "title": "Churn signals we keep missing",
    "type": "learning",
    "content": "The champion goes quiet six weeks before the notice. [[Harborline — renewal risk]] is the live example."
  },
  {
    "id": "demo-lesson",
    "title": "Demos that land",
    "type": "learning",
    "content": "Show their data, not ours. Costs twenty minutes of prep and doubles the close rate. The prep is the same one [[Kickoff — the first 30 minutes]] asks for."
  },
  {
    "id": "competitors",
    "title": "Competitive notes — 2026",
    "type": "note",
    "content": "Who we lose to and why. Two of the three reasons are in [[Pricing tiers 2026]]."
  },
  {
    "id": "glossary",
    "title": "Glossary — what we mean by what",
    "type": "note",
    "content": "Account, workspace, seat, tenant. Four words, four arguments avoided. Written during [[Customer onboarding — standard]], after the third time we meant different things."
  },
  {
    "id": "board-q2",
    "title": "Board update — Q2",
    "type": "note",
    "content": "The three slides that mattered: [[Q3 revenue push]], [[EU entity setup]], [[Data platform migration]]."
  },
  {
    "id": "tooling",
    "title": "Tooling — what we pay for",
    "type": "note",
    "content": "Every subscription and who uses it. Overlaps with [[Vendor list — 2026]] more than it should."
  }
];
