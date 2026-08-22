/**
 * Edge routing for the team graph.
 *
 * An edge is a cubic Bézier that starts on the *border* of each node rather
 * than its centre, so the line appears to touch the box and never crosses it.
 * Each endpoint gets a control point pushed straight out along the dominant
 * axis, which is what gives the edges their consistent orthogonal flare.
 */

export type Point = { x: number; y: number };
export type Normal = { nx: number; ny: number };

export type Shape = {
  x: number;
  y: number;
  w: number;
  h: number;
  r: number;
  round: boolean;
};

/** Where the line from (x,y) toward (tx,ty) leaves an axis-aligned box. */
function boxEdge(x: number, y: number, w: number, h: number, tx: number, ty: number): Point {
  const dx = tx - x;
  const dy = ty - y;
  if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) return { x, y };
  const hw = w / 2;
  const hh = h / 2;
  // Scale the direction vector until it hits whichever side comes first.
  const t = Math.min(
    Math.abs(dx) > 0.01 ? hw / Math.abs(dx) : Infinity,
    Math.abs(dy) > 0.01 ? hh / Math.abs(dy) : Infinity,
  );
  return { x: x + dx * t, y: y + dy * t };
}

/** Same idea for the circular member nodes. */
function circleEdge(x: number, y: number, r: number, tx: number, ty: number): Point {
  const dx = tx - x;
  const dy = ty - y;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 0.01) return { x: x + r, y };
  return { x: x + (dx * r) / len, y: y + (dy * r) / len };
}

/** Snap the outgoing direction to the dominant axis. */
function normal(x: number, y: number, ex: number, ey: number): Normal {
  const dx = Math.abs(ex - x);
  const dy = Math.abs(ey - y);
  return dx >= dy
    ? { nx: Math.sign(ex - x), ny: 0 }
    : { nx: 0, ny: Math.sign(ey - y) };
}

function curve(a: Point, an: Normal, b: Point, bn: Normal): string {
  const dist = Math.hypot(b.x - a.x, b.y - a.y);
  // Control arms scale with distance but stop growing past 110px, otherwise
  // long edges bow out absurdly far.
  const arm = Math.min(dist * 0.42, 110);
  return `M ${a.x} ${a.y} C ${a.x + an.nx * arm} ${a.y + an.ny * arm}, ${
    b.x + bn.nx * arm
  } ${b.y + bn.ny * arm}, ${b.x} ${b.y}`;
}

/** Full edge path between two positioned nodes. */
export function edgePath(a: Shape, b: Shape): string {
  const pa = a.round
    ? circleEdge(a.x, a.y, a.r, b.x, b.y)
    : boxEdge(a.x, a.y, a.w, a.h, b.x, b.y);
  const pb = b.round
    ? circleEdge(b.x, b.y, b.r, a.x, a.y)
    : boxEdge(b.x, b.y, b.w, b.h, a.x, a.y);
  return curve(pa, normal(a.x, a.y, pa.x, pa.y), pb, normal(b.x, b.y, pb.x, pb.y));
}

export const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/** Bounding box of a set of nodes, using a caller-supplied position lookup. */
export function bounds<T extends { w: number; h: number }>(
  nodes: T[],
  posOf: (n: T) => Point,
) {
  if (!nodes.length) return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const n of nodes) {
    const p = posOf(n);
    minX = Math.min(minX, p.x - n.w / 2);
    minY = Math.min(minY, p.y - n.h / 2);
    maxX = Math.max(maxX, p.x + n.w / 2);
    maxY = Math.max(maxY, p.y + n.h / 2);
  }
  return { minX, minY, maxX, maxY };
}
