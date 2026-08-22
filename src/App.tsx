import { Suspense, lazy } from 'react';
import { useLocation } from 'react-router-dom';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import { Splash } from './components/Splash';
import { useAuth } from './lib/auth';

/* The entry chunk is what an anonymous visitor downloads. It holds the two
   screens reachable without a session and nothing else — no workspace shapes,
   no app chrome, no graph libraries. */
const AuthedApp = lazy(() => import('./AuthedApp'));

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
  if (user === undefined) return <Splash />;

  if (user === null) return <Login />;

  return (
    <Suspense fallback={<Splash />}>
      <AuthedApp />
    </Suspense>
  );
}
