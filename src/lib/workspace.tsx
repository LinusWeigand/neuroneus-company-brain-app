import {
  createContext, useContext, useEffect, useMemo, useState, type ReactNode,
} from 'react';
import { buildGraph, type Entry, type GraphNode, type GraphLink } from '../features/docs/data';
import type { ListMember, MemberNode, GoalNode } from '../features/team/data';
import type { TaskColumn } from '../features/goals/data';
import type { AgendaEvent, PreparedItem, WaitingItem } from '../features/dashboard/data';
import type { GoalCard } from '../features/goals/types';

export type Workspace = {
  dashboard: {
    waitingOnYou: WaitingItem[];
    preparedForYou: PreparedItem[];
    agenda: AgendaEvent[];
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

type State = { data: Workspace | null; error: string | null };

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
  }, []);

  const value = useMemo<State>(() => {
    if (!raw) return { data: null, error };
    const w = raw as Omit<Workspace, 'team' | 'docs'> & {
      team: Omit<Workspace['team'], 'totalOverdue'>;
      docs: { entries: Entry[] };
    };
    const entries = w.docs.entries;
    return {
      error,
      data: {
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
  }, [raw, error]);

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

/** Throws if read before the data has arrived — screens render under <WorkspaceGate>. */
export function useWorkspace(): Workspace {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error('useWorkspace must be used inside <WorkspaceProvider>');
  if (!ctx.data) throw new Error('Workspace read before it finished loading');
  return ctx.data;
}

export function useWorkspaceState(): State {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error('useWorkspaceState must be used inside <WorkspaceProvider>');
  return ctx;
}
