import { Route, Routes, useLocation } from 'react-router-dom';
import { Atom, CalendarRange, Inbox } from 'lucide-react';
import { AppShell } from './components/AppShell';
import { OrakisMark } from './components/OrakisMark';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import { useAuth } from './lib/auth';
import { ComingSoon } from './components/ComingSoon';
import Dashboard from './pages/Dashboard';
import Goals from './pages/Goals';
import Team from './pages/Team';
import Docs from './pages/Docs';

export default function App() {
  const { user } = useAuth();
  const { pathname } = useLocation();

  /* Reachable in every auth state, and checked before the session even
     resolves. Signed-out people arrive here from an email link, and signed-in
     people may be resetting precisely because they suspect someone else has
     their password. */
  if (pathname === '/reset') return <ResetPassword />;

  /* undefined means the session check has not come back yet. Rendering the
     login screen during that window would flash it at people who are already
     signed in, so hold on a splash instead. */
  if (user === undefined) {
    return (
      <div className="flex h-full items-center justify-center bg-app-bg">
        <OrakisMark size={28} className="animate-spinMark text-app-muted" />
      </div>
    );
  }

  if (user === null) return <Login />;

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/team" element={<Team />} />
        <Route path="/docs" element={<Docs />} />
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
    </AppShell>
  );
}
