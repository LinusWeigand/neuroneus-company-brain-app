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
 * Prose with goals, tasks and people referenced inline, stored as runs: each
 * segment is plain text or one of the three reference kinds. Markup in the text
 * would mean parsing it back out in the browser, and each kind renders
 * differently anyway.
 *
 * Segment order is the reading order. The landing-page demo has these scrambled
 * — every text run hoisted to the front of the paragraph with the references
 * appended after — which is the html2jsx conversion bug, not the design.
 */
export const BRIEFING = [
  [
    { text: "Northwind is the only thing on this week's critical path. " },
    { task: 'Finalize the Northwind pricing proposal' },
    { text: ' is due today, and nothing else on ' },
    { goal: 'Q3 revenue push', color: '#60a5fa' },
    { text: ' can move before those numbers are signed off. ' },
    { person: 'Sarah Kim' },
    { text: ' has had the master agreement waiting on your countersignature since yesterday.' },
  ],
  [
    { goal: 'EU market expansion', color: '#60a5fa' },
    { text: ' hangs on one decision: ' },
    { task: 'Review the Munich office lease' },
    {
      text:
        ' is due in two days, the broker is on the phone about it this afternoon, and'
        + ' that call is hard to reverse once the lease is countersigned.',
    },
  ],
  [
    { text: 'You closed ' },
    { task: 'Website relaunch brief' },
    { text: ' yesterday, and ' },
    { person: 'Daniel Ross' },
    { text: ' has taken the compliance paperwork off your plate. ' },
    // Grey, not blue: this goal has no tasks and has not started.
    { goal: 'Hiring: senior engineers', color: '#8c8c8c' },
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
