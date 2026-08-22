import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Atom, CalendarRange, Inbox } from 'lucide-react';
import { AppShell } from './components/AppShell';
import { ComingSoon } from './components/ComingSoon';
import { Splash } from './components/Splash';
import { WorkspaceGate } from './components/WorkspaceGate';
import { WorkspaceProvider } from './lib/workspace';

/* Split per route: a first visit to the Dashboard has no reason to download
   the Team map. */
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Goals = lazy(() => import('./pages/Goals'));
const Team = lazy(() => import('./pages/Team'));

/**
 * Everything behind the session.
 *
 * Loaded lazily from App, so none of it — and none of the workspace shapes it
 * pulls in — is in the chunk the login page downloads.
 *
 * WorkspaceProvider is mounted here rather than at the root on purpose:
 * mounting it above the auth check would fire an unauthenticated /api/data on
 * every visit to the login page.
 */
export default function AuthedApp() {
  return (
    <WorkspaceProvider>
      <AppShell>
        <WorkspaceGate>
          <Suspense fallback={<Splash />}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/team" element={<Team />} />
              <Route
                path="/inbox"
                element={
                  <ComingSoon
                    Icon={Inbox}
                    section="Inbox"
                    page="Inbox"
                    note="Mail and notifications land here. Not built yet."
                  />
                }
              />
              <Route
                path="/calendar"
                element={
                  <ComingSoon
                    Icon={CalendarRange}
                    section="Calendar"
                    page="Calendar"
                    note="A full calendar view. The day's agenda is on the Dashboard for now."
                  />
                }
              />
              <Route
                path="/ora"
                element={
                  <ComingSoon
                    Icon={Atom}
                    section="Ora"
                    page="Ora"
                    note="The assistant. Needs a backend before it can answer anything real."
                  />
                }
              />
            </Routes>
          </Suspense>
        </WorkspaceGate>
      </AppShell>
    </WorkspaceProvider>
  );
}
