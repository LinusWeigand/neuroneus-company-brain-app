import { Route, Routes } from 'react-router-dom';
import { Atom, CalendarRange, Inbox } from 'lucide-react';
import { AppShell } from './components/AppShell';
import { ComingSoon } from './components/ComingSoon';
import Dashboard from './pages/Dashboard';
import Goals from './pages/Goals';
import Team from './pages/Team';
import Docs from './pages/Docs';

export default function App() {
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
