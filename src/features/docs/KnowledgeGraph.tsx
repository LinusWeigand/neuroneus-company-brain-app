import { useEffect, useRef, useState } from 'react';
import {
  forceCollide, forceLink, forceManyBody, forceSimulation, forceX, forceY,
  type Simulation, type SimulationLinkDatum, type SimulationNodeDatum,
} from 'd3-force';
import {
  GRAPH, clusterCenter, nodeRadius, typeInfo,
  type GraphLink, type GraphNode,
} from './data';

/**
 * d3 mutates the nodes it is given (writing x/y/vx/vy), so the simulation gets
 * its own copies and the pristine GRAPH arrays stay usable for rendering.
 */
type SimNode = GraphNode & SimulationNodeDatum;
type SimLink = SimulationLinkDatum<SimNode> & { kind: GraphLink['kind'] };

/** Same forces, in the same order, as the deployed bundle configures. */
function createSimulation(nodes: SimNode[], links: SimLink[]): Simulation<SimNode, SimLink> {
  return forceSimulation<SimNode>(nodes)
    .force('link', forceLink<SimNode, SimLink>(links).id((d) => d.id).distance(36))
    .force('charge', forceManyBody<SimNode>().strength(-75))
    .force('collide', forceCollide<SimNode>((d) => nodeRadius(d.val) + 3).iterations(2))
    // The x/y forces are what pull each node toward its type's cluster.
    .force('x', forceX<SimNode>((d) => clusterCenter(d.type).x).strength(0.14))
    .force('y', forceY<SimNode>((d) => clusterCenter(d.type).y).strength(0.14))
    .alphaDecay(0.02);
}

const round = (n: number) => Math.round(n * 100) / 100;

/**
 * Settled layout, computed once at module load.
 *
 * Without this the graph would visibly fly apart from its seed positions on
 * every mount. Running the simulation to rest up front means it appears already
 * organised, and the live simulation only has to react to dragging.
 */
const LAYOUT = (() => {
  const nodes: SimNode[] = GRAPH.nodes.map((n, i) => ({
    ...n,
    x: Math.cos(i) * 140,
    y: Math.sin(i) * 140,
  }));
  const sim = createSimulation(nodes, GRAPH.links.map((l) => ({ ...l }))).stop();
  for (let i = 0; i < 600 && sim.alpha() >= sim.alphaMin(); i++) sim.tick();

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const n of nodes) {
    const r = nodeRadius(n.val);
    minX = Math.min(minX, (n.x ?? 0) - r);
    maxX = Math.max(maxX, (n.x ?? 0) + r);
    minY = Math.min(minY, (n.y ?? 0) - r);
    maxY = Math.max(maxY, (n.y ?? 0) + r);
  }
  const pad = 12;
  return {
    pos: new Map(nodes.map((n) => [n.id, { x: n.x ?? 0, y: n.y ?? 0 }])),
    view: `${minX - pad} ${minY - pad} ${maxX - minX + pad * 2} ${maxY - minY + pad * 2}`,
  };
})();

export function KnowledgeGraph() {
  const hostRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const simRef = useRef<Simulation<SimNode, SimLink> | null>(null);
  const nodesRef = useRef<SimNode[]>([]);
  const draggingRef = useRef<SimNode | null>(null);

  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);
  const [nodes, setNodes] = useState<SimNode[]>(() =>
    GRAPH.nodes.map((n) => ({ ...n, ...LAYOUT.pos.get(n.id) })),
  );

  useEffect(() => {
    const live: SimNode[] = GRAPH.nodes.map((n) => ({ ...n, ...LAYOUT.pos.get(n.id) }));
    const sim = createSimulation(live, GRAPH.links.map((l) => ({ ...l })))
      .on('tick', () => setNodes(live.map((n) => ({ ...n }))));
    // Start parked: the layout is already settled, so it only runs while dragging.
    sim.stop();
    simRef.current = sim;
    nodesRef.current = live;
    return () => { sim.stop(); };
  }, []);

  /** Screen pixels -> SVG user units, which viewBox scaling makes non-trivial. */
  const toSvgPoint = (clientX: number, clientY: number) => {
    const svg = svgRef.current;
    const ctm = svg?.getScreenCTM();
    if (!svg || !ctm) return null;
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    return pt.matrixTransform(ctm.inverse());
  };

  // Drag continues outside the circle, so these live on window.
  useEffect(() => {
    const move = (e: PointerEvent) => {
      const node = draggingRef.current;
      if (!node) return;
      const p = toSvgPoint(e.clientX, e.clientY);
      if (!p) return;
      node.fx = p.x;
      node.fy = p.y;
    };
    const end = () => {
      const node = draggingRef.current;
      if (!node) return;
      // Releasing the pin lets the forces reclaim the node.
      node.fx = null;
      node.fy = null;
      draggingRef.current = null;
      simRef.current?.alphaTarget(0);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', end);
      window.removeEventListener('pointercancel', end);
    };
  }, []);

  const startDrag = (id: string) => (e: React.PointerEvent) => {
    const node = nodesRef.current.find((n) => n.id === id);
    const p = toSvgPoint(e.clientX, e.clientY);
    if (!node || !p) return;
    e.preventDefault();
    draggingRef.current = node;
    node.fx = p.x;
    node.fy = p.y;
    // Reheat so the neighbours visibly rearrange around the dragged node.
    simRef.current?.alphaTarget(0.3).restart();
  };

  const showTooltip = (text: string) => (e: React.PointerEvent) => {
    const host = hostRef.current;
    if (!host) return;
    const r = host.getBoundingClientRect();
    const scale = r.width / host.offsetWidth || 1;
    setTooltip({ x: (e.clientX - r.left) / scale, y: (e.clientY - r.top) / scale, text });
  };

  const byId = new Map(nodes.map((n) => [n.id, n]));

  return (
    <div ref={hostRef} className="relative h-full rounded-lg border border-[#3D3D3D]">
      <svg ref={svgRef} viewBox={LAYOUT.view} preserveAspectRatio="xMidYMid meet" className="h-full w-full">
        {GRAPH.links.map((link, i) => {
          const a = byId.get(link.source);
          const b = byId.get(link.target);
          if (!a || !b) return null;
          return (
            <line
              key={i}
              x1={round(a.x ?? 0)}
              y1={round(a.y ?? 0)}
              x2={round(b.x ?? 0)}
              y2={round(b.y ?? 0)}
              stroke={link.kind === 'child' ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.12)'}
              strokeWidth={1}
            />
          );
        })}
        {nodes.map((n) => (
          <circle
            key={n.id}
            cx={round(n.x ?? 0)}
            cy={round(n.y ?? 0)}
            r={round(nodeRadius(n.val))}
            fill={typeInfo(n.type).color}
            className="cursor-grab active:cursor-grabbing"
            onPointerDown={startDrag(n.id)}
            onPointerMove={showTooltip(n.title)}
            onPointerLeave={() => setTooltip(null)}
          />
        ))}
      </svg>

      {tooltip && (
        <span
          className="pointer-events-none absolute z-10 whitespace-nowrap rounded-[3px] bg-black/70 px-1.5 py-1 text-[11px] leading-none text-[#eee]"
          style={{ left: tooltip.x + 10, top: tooltip.y + 10 }}
        >
          {tooltip.text}
        </span>
      )}
    </div>
  );
}
