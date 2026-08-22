import {
  createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode,
} from 'react';
import { buildGraph, type Entry, type GraphNode, type GraphLink } from '../features/docs/view';
import type { ListMember, MemberNode, GoalNode } from '../features/team/view';
import type { GoalCard, TaskColumn } from '../features/goals/view';
import type {
  AgendaEvent, BriefingParagraph, PreparedItem, WaitingItem,
} from '../features/dashboard/view';

export type Workspace = {
  /** The workspace label in the sidebar. */
  name: string;
  dashboard: {
    waitingOnYou: WaitingItem[];
    preparedForYou: PreparedItem[];
    agenda: AgendaEvent[];
    briefing: BriefingParagraph[];
    focusTime: string;
  };
  team: {
    members: MemberNode[];
    goals: GoalNode[];
    edges: [string, string][];
    listMembers: ListMember[];
    totalOverdue: number;
  };
  goals: { goalCards: GoalCard[]; taskColumns: TaskColumn[] };
  docs: {
    entries: Entry[];
    rootEntries: Entry[];
    subpageCount: Map<string, number>;
    graph: { nodes: GraphNode[]; links: GraphLink[] };
  };
};

type State = { data: Workspace | null; error: string | null; reload: () => void };

const WorkspaceContext = createContext<State | null>(null);

/**
 * Workspace content, fetched after sign-in.
 *
 * None of this ships in the JavaScript bundle: it lives in api/_data and is
 * only reachable through /api/data, which requires a session. Anything derived
 * from it (the knowledge graph, roll-ups) is computed here rather than stored,
 * so there is a single source of truth.
 */
export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [raw, setRaw] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  const reload = useCallback(() => {
    setError(null);
    setRaw(null);
    setAttempt((n) => n + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/data', { credentials: 'same-origin' });
        if (!res.ok) throw new Error('Could not load your workspace.');
        const json = await res.json();
        if (!cancelled) setRaw(json);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Could not load your workspace.');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const value = useMemo<State>(() => {
    if (!raw) return { data: null, error, reload };
    const w = raw as Omit<Workspace, 'team' | 'docs'> & {
      team: Omit<Workspace['team'], 'totalOverdue'>;
      docs: { entries: Entry[] };
    };
    const entries = w.docs.entries;
    return {
      error,
      reload,
      data: {
        name: w.name,
        dashboard: w.dashboard,
        team: {
          ...w.team,
          totalOverdue: w.team.members.reduce((n, m) => n + m.overdue, 0),
        },
        goals: w.goals,
        docs: {
          entries,
          rootEntries: entries.filter((e) => !e.parent),
          subpageCount: entries.reduce((m, e) => {
            if (e.parent) m.set(e.parent, (m.get(e.parent) ?? 0) + 1);
            return m;
          }, new Map<string, number>()),
          graph: buildGraph(entries),
        },
      },
    };
  }, [raw, error, reload]);

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

/** Throws if read before the data has arrived — screens render under <WorkspaceGate>. */
export function useWorkspace(): Workspace {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error('useWorkspace must be used inside <WorkspaceProvider>');
  if (!ctx.data) throw new Error('Workspace read before it finished loading');
  return ctx.data;
}

/** The loading/error state itself, for the gate and for chrome that renders
 *  alongside the spinner rather than behind it. */
export function useWorkspaceState(): State {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error('useWorkspaceState must be used inside <WorkspaceProvider>');
  return ctx;
}
