/**
 * Docs shapes, palette, and the graph derivation.
 *
 * The graph is not authored separately: edges come from each entry's `parent`
 * plus every [[wiki link]] found in its body text, and a node's size comes from
 * how many edges it ended up with. Add a link in the prose and the graph
 * changes with it.
 *
 * The entries themselves live in api/_data and arrive through useWorkspace() —
 * nothing in this file may hold any.
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
  pinned?: boolean;
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
