/**
 * Graph + roster data behind the Team Overview demo, recovered from the
 * deployed bundle.
 *
 * Coordinates are in a fixed world space; the view is panned and zoomed on top
 * of them, so a node's x/y never changes unless the user drags that node.
 * `inDays`/`deadlineDays` are offsets from today so nothing ever reads stale.
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

export const MEMBERS: MemberNode[] = [
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

export const GOALS: GoalNode[] = [
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

/** member id -> goal id. Task edges are derived from each goal's own tasks. */
export const EDGES: [string, string][] = [
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

export const LIST_MEMBERS: ListMember[] = [
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

export const memberById = (id: string) => MEMBERS.find((m) => m.id === id);

export const initials = (name: string) =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');

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

export const kindOf = (n: GraphNodeT): 'member' | 'goal' | 'task' =>
  MEMBERS.some((m) => m.id === n.id) ? 'member'
  : GOALS.some((g) => g.id === n.id) ? 'goal'
  : 'task';

export const labelOf = (n: GraphNodeT) => ('title' in n ? n.title : n.name);
