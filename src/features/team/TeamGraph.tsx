import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { SidePanel } from './SidePanel';
import { GraphNodeBox } from './GraphNode';
import { bounds, clamp, edgePath, type Point } from './geometry';
import {
  EDGES, FONT, GOALS, MEMBERS, MIN_ZOOM, MAX_ZOOM,
  EDGE, EDGE_DIM, EDGE_SHARED, OVERDUE, STROKE_ACTIVE,
  initials, memberById,
  type GraphNodeT,
} from './data';

const TOTAL_TASKS = GOALS.reduce((n, g) => n + g.tasks.length, 0);

export function TeamGraph() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [activeGoal, setActiveGoal] = useState<string | null>('g1');
  const [selected, setSelected] = useState<string | null>('g1');
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [dragged, setDragged] = useState<Record<string, Point>>({});

  const dragRef = useRef<{ id: string; sx: number; sy: number; ox: number; oy: number; moved: boolean } | null>(null);
  const panRef = useRef<{ px: number; py: number; sx: number; sy: number } | null>(null);
  const didFit = useRef(false);

  useLayoutEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const measure = () => setSize({ width: el.offsetWidth, height: el.offsetHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* The whole mock window is CSS-scaled, so a pointer moving 10 screen px is
     fewer than 10 layout px. This ratio converts back. */
  const cssScale = () => {
    const el = hostRef.current;
    if (!el || !el.offsetWidth) return 1;
    return el.getBoundingClientRect().width / el.offsetWidth || 1;
  };

  const posOf = <T extends { id: string; x: number; y: number }>(n: T): Point =>
    dragged[n.id] ?? { x: n.x, y: n.y };

  /** Tasks are hidden until their goal (or their owner) is the active node. */
  const visibleTasks = useMemo(() => {
    const set = new Set<string>();
    GOALS.forEach((g) =>
      g.tasks.forEach((t) => {
        if (activeGoal === g.id || activeGoal === t.members[0]) set.add(t.id);
      }),
    );
    return set;
  }, [activeGoal]);

  const hiddenTasks = TOTAL_TASKS - visibleTasks.size;

  /** Undirected adjacency: member↔goal, goal↔task, and task↔its owner. */
  const neighbours = useMemo(() => {
    const map = new Map<string, Set<string>>();
    const seed = (id: string) => {
      if (!map.has(id)) map.set(id, new Set([id]));
    };
    const link = (a: string, b: string) => {
      seed(a); seed(b);
      map.get(a)!.add(b);
      map.get(b)!.add(a);
    };
    EDGES.forEach(([m, g]) => link(m, g));
    GOALS.forEach((g) => {
      seed(g.id);
      g.tasks.forEach((t) => {
        link(g.id, t.id);
        link(t.members[0], t.id);
      });
    });
    return map;
  }, []);

  const selectedSet = selected ? neighbours.get(selected) ?? null : null;
  const isNeighbour = (id: string) => !selectedSet || selectedSet.has(id);
  const hasSelection = !!selected;

  /** Non-neighbours fade right back when something is selected. */
  const opacityOf = (id: string, dim?: boolean) =>
    hasSelection && !isNeighbour(id) ? 0.14 : dim ? 0.4 : 1;

  const isActive = (id: string) =>
    selected === id || activeGoal === id || (hasSelection && isNeighbour(id));

  /** Edges on the selected node's path go dashed and brighter; others recede. */
  const edgeStyle = (a: string, b: string, shared = false) => {
    const on = !selected || a === selected || b === selected;
    return {
      stroke: on ? (shared ? EDGE_SHARED : EDGE) : EDGE_DIM,
      strokeWidth: on && hasSelection ? 1.8 : shared ? 1.4 : 1,
      strokeDasharray: on && hasSelection ? '7 5' : undefined,
      style: { opacity: hasSelection && !on ? 0.1 : 1, transition: 'opacity 0.18s' },
    };
  };

  const allNodes = useMemo<GraphNodeT[]>(
    () => [...MEMBERS, ...GOALS, ...GOALS.flatMap((g) => g.tasks)],
    [],
  );
  const nodeById = useMemo(() => new Map(allNodes.map((n) => [n.id, n])), [allNodes]);
  const selectedNode = selected ? nodeById.get(selected) ?? null : null;

  const fit = () => {
    if (!size.width || !size.height) return;
    const nodes = [
      ...MEMBERS,
      ...GOALS,
      ...GOALS.flatMap((g) => g.tasks.filter((t) => visibleTasks.has(t.id))),
    ];
    const b = bounds(nodes, posOf);
    const pad = 80;
    const w = b.maxX - b.minX + pad * 2;
    const h = b.maxY - b.minY + pad * 2;
    const z = clamp(Math.min(size.width / w, size.height / h), MIN_ZOOM, 1.6);
    setZoom(z);
    setPan({
      x: size.width / 2 - ((b.minX + b.maxX) / 2) * z,
      y: size.height / 2 - ((b.minY + b.maxY) / 2) * z,
    });
  };

  useEffect(() => {
    if (!didFit.current && size.width > 0) {
      fit();
      didFit.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size.width, size.height]);

  /** Drag a single node. Mouse only, so touch scrolling still works. */
  const startNodeDrag = (e: React.PointerEvent, node: { id: string; x: number; y: number }) => {
    if (e.pointerType !== 'mouse') return;
    e.stopPropagation();
    const start = posOf(node);
    const scale = cssScale() * zoom;
    dragRef.current = { id: node.id, sx: e.clientX, sy: e.clientY, ox: start.x, oy: start.y, moved: false };

    const move = (ev: PointerEvent) => {
      const d = dragRef.current;
      if (!d) return;
      // A few px of slop so a click with a shaky hand still counts as a click.
      if (Math.abs(ev.clientX - d.sx) + Math.abs(ev.clientY - d.sy) > 3) d.moved = true;
      setDragged((prev) => ({
        ...prev,
        [d.id]: { x: d.ox + (ev.clientX - d.sx) / scale, y: d.oy + (ev.clientY - d.sy) / scale },
      }));
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  };

  /** Drag the canvas. Pressing empty space also clears the selection. */
  const startPan = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    setSelected(null);
    const scale = cssScale();
    panRef.current = { px: pan.x, py: pan.y, sx: e.clientX, sy: e.clientY };

    const move = (ev: PointerEvent) => {
      const p = panRef.current;
      if (!p) return;
      setPan({ x: p.px + (ev.clientX - p.sx) / scale, y: p.py + (ev.clientY - p.sy) / scale });
    };
    const up = () => {
      panRef.current = null;
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  };

  const handleClick = (e: React.MouseEvent, id: string, kind: 'member' | 'goal' | 'task') => {
    e.stopPropagation();
    // Suppress the click that always follows a drag.
    const moved = dragRef.current?.moved;
    dragRef.current = null;
    if (moved) return;

    if (kind === 'task') {
      setSelected((cur) => (cur === id ? null : id));
      return;
    }
    // Members and goals drive which tasks are revealed, so they move both bits
    // of state together.
    const already = activeGoal === id;
    setActiveGoal(already ? null : id);
    setSelected(already ? null : id);
  };

  const between = (a: any, b: any) =>
    edgePath({ ...a, ...posOf(a) }, { ...b, ...posOf(b) });

  return (
    <div ref={hostRef} className="relative h-full w-full overflow-hidden">
      <svg
        width={size.width}
        height={size.height}
        onPointerDown={startPan}
        style={{ display: 'block', cursor: 'grab', fontFamily: FONT }}
      >
        <g transform={`translate(${pan.x} ${pan.y}) scale(${zoom})`}>
          {EDGES.map(([m, gid]) => {
            const goal = GOALS.find((g) => g.id === gid)!;
            return (
              <path
                key={`${m}-${gid}`}
                d={between(memberById(m), goal)}
                fill="none"
                {...edgeStyle(m, gid, goal.people.length > 1)}
              />
            );
          })}

          {GOALS.map((g) =>
            g.tasks.filter((t) => visibleTasks.has(t.id)).map((t) => (
              <path key={`${g.id}-${t.id}`} d={between(g, t)} fill="none" {...edgeStyle(g.id, t.id)} />
            )),
          )}

          {GOALS.map((g) =>
            g.tasks.filter((t) => visibleTasks.has(t.id)).map((t) => (
              <path
                key={`o-${t.id}`}
                d={between(memberById(t.members[0]), t)}
                fill="none"
                {...edgeStyle(t.members[0], t.id)}
              />
            )),
          )}

          {MEMBERS.map((m) => {
            const p = posOf(m);
            return (
              <g
                key={m.id}
                onPointerDown={(e) => startNodeDrag(e, m)}
                onClick={(e) => handleClick(e, m.id, 'member')}
                style={{ cursor: 'pointer', opacity: opacityOf(m.id), transition: 'opacity 0.18s' }}
              >
                {m.overdue > 0 && (
                  <circle cx={p.x} cy={p.y} r={m.r + 4} fill="none" stroke={OVERDUE} strokeWidth={2} opacity={0.75} />
                )}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={m.r}
                  fill={isActive(m.id) ? '#FFFFFF' : '#FAFAFA'}
                  stroke={selected === m.id ? STROKE_ACTIVE : 'transparent'}
                  strokeWidth={2}
                />
                <text
                  x={p.x}
                  y={p.y + Math.round(m.r * 0.5) * 0.36}
                  textAnchor="middle"
                  fill="#18181B"
                  fontSize={Math.round(m.r * 0.5)}
                  fontWeight={700}
                  style={{ userSelect: 'none' }}
                >
                  {initials(m.name)}
                </text>
                {m.overdue > 0 && (
                  <>
                    <circle cx={p.x + m.r - 2} cy={p.y - m.r + 2} r={9} fill={OVERDUE} />
                    <text
                      x={p.x + m.r - 2}
                      y={p.y - m.r + 5.5}
                      textAnchor="middle"
                      fill="#1F1F1E"
                      fontSize={10}
                      fontWeight={700}
                      style={{ userSelect: 'none' }}
                    >
                      {m.overdue}
                    </text>
                  </>
                )}
                <text
                  x={p.x}
                  y={p.y + m.r + 15}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.7)"
                  fontSize={11}
                  fontWeight={600}
                  style={{ userSelect: 'none' }}
                >
                  {m.name}
                </text>
              </g>
            );
          })}

          {GOALS.map((g) => (
            <g key={g.id}>
              <g
                onPointerDown={(e) => startNodeDrag(e, g)}
                onClick={(e) => handleClick(e, g.id, 'goal')}
                style={{ cursor: 'pointer', opacity: opacityOf(g.id), transition: 'opacity 0.18s' }}
              >
                <GraphNodeBox node={g} pos={posOf(g)} isGoal active={isActive(g.id)} selected={selected === g.id} />
              </g>
              {g.tasks
                .filter((t) => visibleTasks.has(t.id))
                .map((t) => (
                  <g
                    key={t.id}
                    onPointerDown={(e) => startNodeDrag(e, t)}
                    onClick={(e) => handleClick(e, t.id, 'task')}
                    style={{ cursor: 'pointer', opacity: opacityOf(t.id, t.done), transition: 'opacity 0.18s' }}
                  >
                    <GraphNodeBox node={t} pos={posOf(t)} isGoal={false} active={isActive(t.id)} selected={selected === t.id} />
                  </g>
                ))}
            </g>
          ))}
        </g>
      </svg>

      {selectedNode && (
        <SidePanel
          node={selectedNode}
          neighbours={neighbours}
          nodeById={nodeById}
          onClose={() => setSelected(null)}
          onSelect={(id) => setSelected(id)}
        />
      )}

      {hiddenTasks > 0 && !activeGoal && (
        <p className="pointer-events-none absolute right-4 top-3.5 text-[11px] text-[#8C8C8C]/40">
          Click a goal to reveal its {hiddenTasks === 1 ? 'task' : 'tasks'}
        </p>
      )}

      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full border border-[#3D3D3D] bg-[#2C2C2B]/90 px-1.5 py-1 backdrop-blur">
        <button
          type="button"
          onClick={() => setZoom((z) => clamp(z * 0.85, MIN_ZOOM, MAX_ZOOM))}
          className="flex h-6 w-6 items-center justify-center rounded-full text-[#8C8C8C]/70 hover:bg-[#3D3D3D] hover:text-[#FAFAFA]"
        >
          −
        </button>
        <span className="w-10 text-center text-[11px] tabular-nums text-[#8C8C8C]/60">
          {Math.round(zoom * 100)}%
        </span>
        <button
          type="button"
          onClick={() => setZoom((z) => clamp(z * 1.15, MIN_ZOOM, MAX_ZOOM))}
          className="flex h-6 w-6 items-center justify-center rounded-full text-[#8C8C8C]/70 hover:bg-[#3D3D3D] hover:text-[#FAFAFA]"
        >
          +
        </button>
        <button
          type="button"
          onClick={fit}
          className="ml-1 rounded-full px-2 text-[11px] text-[#8C8C8C]/70 hover:bg-[#3D3D3D] hover:text-[#FAFAFA]"
        >
          Fit
        </button>
      </div>
    </div>
  );
}
