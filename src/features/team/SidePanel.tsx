import { ArrowUpRight, X } from 'lucide-react';
import {
  EDGES, MEMBERS, OVERDUE,
  kindOf, labelOf, nodeMeta, panelMeta,
  type GoalNode, type GraphNodeT, type TaskNode,
} from './data';

/**
 * Detail panel for the selected graph node.
 *
 * Everything it shows is derived from the adjacency map rather than stored:
 * the connection lists are just the node's neighbours bucketed by kind, and
 * "Works with" counts goals two members both sit on.
 */
export function SidePanel({
  node, neighbours, nodeById, onClose, onSelect,
}: {
  node: GraphNodeT;
  neighbours: Map<string, Set<string>>;
  nodeById: Map<string, GraphNodeT>;
  onClose: () => void;
  onSelect: (id: string) => void;
}) {
  const kind = kindOf(node);
  const linked = [...(neighbours.get(node.id) ?? [])]
    .filter((id) => id !== node.id)
    .map((id) => nodeById.get(id))
    .filter(Boolean) as GraphNodeT[];

  const kindLabel = kind === 'member' ? 'Member' : kind === 'goal' ? 'Goal' : 'Task';
  const progress = 'progress' in node ? (node as GoalNode).progress : undefined;
  const meta = kind === 'goal' || kind === 'task' ? panelMeta(node as GoalNode | TaskNode) : [];

  // For a member: who else works on the same goals, and on how many.
  const worksWith =
    kind === 'member'
      ? MEMBERS.filter((m) => m.id !== node.id)
          .map((m) => {
            const mine = EDGES.filter(([a]) => a === node.id).map(([, g]) => g);
            const count = EDGES.filter(([a, g]) => a === m.id && mine.includes(g)).length;
            return { name: m.name, count };
          })
          .filter((m) => m.count > 0)
      : [];

  const groups = [
    { label: 'Members', kind: 'member' as const },
    { label: 'Goals', kind: 'goal' as const },
    { label: 'Tasks', kind: 'task' as const },
  ];

  return (
    <div className="absolute inset-y-0 right-0 flex w-[300px] max-w-[80%] flex-col border-l border-[#3D3D3D] bg-[#2C2C2B]/95 shadow-2xl backdrop-blur-xl">
      <div className="flex shrink-0 items-center justify-between px-4 pb-3 pt-4">
        <span className="text-[11px] font-bold uppercase tracking-wider text-white">
          {kindLabel}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-[#8C8C8C]/40 transition-colors hover:bg-[#2E2E2E] hover:text-[#FAFAFA]"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className={'flex-1 overflow-y-auto px-4 pb-4 app-scroll'}>
        <p className="text-[15px] font-semibold leading-snug text-white">{labelOf(node)}</p>

        {meta.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px]">
            {meta.map((m, i) => (
              <span key={i} style={{ color: m.color }}>{m.text}</span>
            ))}
          </div>
        )}

        {progress && progress.total > 0 && (
          <p className="mt-2 text-[12px] text-[#FAFAFA]/55">
            {progress.done} of {progress.total} tasks done
            {progress.late > 0 && (
              <span style={{ color: OVERDUE }}> · {progress.late} overdue</span>
            )}
          </p>
        )}

        {kind === 'member' && (
          <div className="mt-4">
            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-[#FAFAFA]/50">
              Works with
            </p>
            {worksWith.length > 0 ? (
              <div className="space-y-1">
                {worksWith.map((m) => (
                  <div key={m.name} className="flex items-center justify-between text-[12px]">
                    <span className="truncate text-[#FAFAFA]/80">{m.name}</span>
                    <span className="ml-2 shrink-0 tabular-nums text-[#FAFAFA]/55">
                      {m.count} shared {m.count === 1 ? 'goal' : 'goals'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[12px] text-[#FAFAFA]/50">Shares no goals with anyone.</p>
            )}
          </div>
        )}

        {(kind === 'goal' || kind === 'task') && (
          <span className="mt-3 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-[#3D3D3D] bg-[#262626] px-3 py-2 text-[12px] font-medium text-[#FAFAFA]/85 transition-colors hover:bg-[#2E2E2E] hover:text-[#FAFAFA]">
            Open {kind}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        )}

        {groups.map(({ label, kind: k }) => {
          const items = linked.filter((n) => kindOf(n) === k);
          if (items.length === 0) return null;
          return (
            <div key={k} className="mt-5">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#FAFAFA]/50">
                {label} <span className="text-[#FAFAFA]/35">{items.length}</span>
              </p>
              <div className="space-y-1.5">
                {items.map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => onSelect(n.id)}
                    className="w-full rounded-lg border border-[#3D3D3D] bg-[#262626] px-3 py-2 text-left transition-colors hover:bg-[#2E2E2E]"
                  >
                    <p className="text-[12px] leading-snug text-[#FAFAFA]/85">{labelOf(n)}</p>
                    {kindOf(n) !== 'member' && (
                      <div className="mt-1 flex flex-wrap items-center gap-x-2 text-[10px]">
                        {nodeMeta(n as GoalNode | TaskNode).map((m, i) => (
                          <span key={i} style={{ color: m.color }}>{m.text}</span>
                        ))}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          );
        })}

        {linked.length === 0 && (
          <p className="mt-5 text-[12px] text-[#FAFAFA]/50">No connections.</p>
        )}
      </div>
    </div>
  );
}
