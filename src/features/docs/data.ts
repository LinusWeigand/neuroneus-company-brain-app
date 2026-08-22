/**
 * Knowledge-base entries and the graph derived from them.
 *
 * The graph is not authored separately: edges come from each entry's `parent`
 * plus every [[wiki link]] found in its body text, and a node's size comes from
 * how many edges it ended up with. Add a link in the prose and the graph
 * changes with it.
 */

export type EntryType =
  | 'note' | 'customer' | 'process' | 'project'
  | 'person' | 'decision' | 'learning' | 'product';

export type Entry = {
  id: string;
  title: string;
  type: EntryType;
  content: string;
  parent?: string;
};

export type GraphNode = {
  id: string;
  title: string;
  type: EntryType;
  val: number;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
};

export type GraphLink = { source: string; target: string; kind: 'child' | 'ref' };

export const TYPE_COLOR: Record<EntryType, string> = {
  note: '#868e96',
  customer: '#228be6',
  process: '#40c057',
  project: '#7950f2',
  person: '#fd7e14',
  decision: '#fa5252',
  learning: '#fab005',
  product: '#15aabf',
};

export const typeInfo = (t: EntryType) => ({
  label: t.charAt(0).toUpperCase() + t.slice(1),
  color: TYPE_COLOR[t] ?? TYPE_COLOR.note,
});

/** Strip wiki-link brackets and markdown for preview text. */
export const preview = (text: string, max = 140) => {
  const clean = text
    .replace(/\[\[([^[\]]+)\]\]/g, '$1')
    .replace(/[*_`#>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return clean.length > max ? clean.slice(0, max).trimEnd() + '\u2026' : clean;
};

export const GRAPH_WIDTH = 400;
export const GRAPH_HEIGHT = 774;
const RADIUS_SCALE = 5;

/** Node radius grows with degree, but as a square root so hubs stay sane. */
export const nodeRadius = (val: number) => Math.sqrt(val) * RADIUS_SCALE;

/** Types are laid out around a circle so each kind clusters in its own region. */
export const TYPE_ORDER: EntryType[] = [
  'customer', 'process', 'decision', 'product',
  'project', 'person', 'learning', 'note',
];

const CLUSTER = new Map<EntryType, { x: number; y: number }>(
  TYPE_ORDER.map((t, i) => {
    const angle = (i / TYPE_ORDER.length) * Math.PI * 2 - Math.PI / 2;
    return [t, { x: Math.cos(angle) * 300, y: Math.sin(angle) * 300 }];
  }),
);

export const clusterCenter = (t: EntryType) => CLUSTER.get(t) ?? { x: 0, y: 0 };

export const ENTRIES: Entry[] = [
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
] as Entry[];

/** Build nodes and de-duplicated undirected links from the entries. */
export function buildGraph(entries: Entry[]) {
  const idByTitle = new Map(entries.map((e) => [e.title, e.id]));
  const ids = new Set(entries.map((e) => e.id));
  const seen = new Set<string>();
  const links: GraphLink[] = [];
  const degree = new Map<string, number>();

  const connect = (a: string, b: string, kind: GraphLink['kind']) => {
    if (a === b || !ids.has(a) || !ids.has(b)) return;
    const key = [a, b].sort().join('-');
    if (seen.has(key)) return;
    seen.add(key);
    links.push({ source: a, target: b, kind });
    degree.set(a, (degree.get(a) ?? 0) + 1);
    degree.set(b, (degree.get(b) ?? 0) + 1);
  };

  for (const e of entries) if (e.parent) connect(e.parent, e.id, 'child');
  for (const e of entries) {
    for (const [, title] of e.content.matchAll(/\[\[([^[\]]+)\]\]/g)) {
      const target = idByTitle.get(title);
      if (target) connect(e.id, target, 'ref');
    }
  }

  return {
    nodes: entries.map((e) => ({
      id: e.id,
      title: e.title,
      type: e.type,
      val: 1 + (degree.get(e.id) ?? 0),
    })) as GraphNode[],
    links,
  };
}

export const GRAPH = buildGraph(ENTRIES);

/** Top-level entries (no parent) and how many children each has. */
export const ROOT_ENTRIES = ENTRIES.filter((e) => !e.parent);
export const SUBPAGE_COUNT = ENTRIES.reduce((m, e) => {
  if (e.parent) m.set(e.parent, (m.get(e.parent) ?? 0) + 1);
  return m;
}, new Map<string, number>());
