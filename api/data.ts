import type { VercelRequest, VercelResponse } from '@vercel/node';
import { currentUser, json } from './_lib/auth.js';
import {
  AGENDA, BRIEFING, EDGES, ENTRIES, FOCUS_TIME, GOAL_CARDS, LIST_MEMBERS,
  MEMBERS, PREPARED_FOR_YOU, TASK_COLUMNS, TEAM_GOALS, WAITING_ON_YOU,
  WORKSPACE_NAME,
} from './_data/workspace.js';

/**
 * GET /api/data — everything the signed-in app renders.
 *
 * This exists so workspace content is never compiled into the public bundle.
 * The session check is the only thing standing between this data and the
 * internet, so it runs before anything is read.
 *
 * The payload is deliberately whole-workspace: the sample content is small and
 * every screen wants a slice of it. Once this reads from the database it wants
 * splitting per view, because "one request loads the entire company" stops
 * being cheap the moment the company is real.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return json(res, 405, { error: 'Method not allowed' });

  // Private per-user content: must never be held in a shared or browser cache.
  res.setHeader('Cache-Control', 'no-store, private');

  try {
    const user = await currentUser(req);
    if (!user) return json(res, 401, { error: 'Not authenticated' });

    return json(res, 200, {
      name: WORKSPACE_NAME,
      dashboard: {
        waitingOnYou: WAITING_ON_YOU,
        preparedForYou: PREPARED_FOR_YOU,
        agenda: AGENDA,
        briefing: BRIEFING,
        focusTime: FOCUS_TIME,
      },
      team: { members: MEMBERS, goals: TEAM_GOALS, edges: EDGES, listMembers: LIST_MEMBERS },
      goals: { goalCards: GOAL_CARDS, taskColumns: TASK_COLUMNS },
      docs: { entries: ENTRIES },
    });
  } catch (err) {
    console.error('data fetch failed:', err);
    return json(res, 500, { error: 'Could not load your workspace.' });
  }
}
