import {
  createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode,
} from 'react';

export type User = { id: number; email: string; name: string };

type AuthState = {
  /** undefined while the first session check is in flight. */
  user: User | null | undefined;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

/**
 * Session state for the app.
 *
 * The session itself lives in an httpOnly cookie the browser cannot read, so
 * this asks the server who it is rather than trusting anything client-side.
 * `user === undefined` means "not known yet" and is deliberately distinct from
 * `null` ("known to be signed out") — conflating them flashes the login screen
 * at users who are in fact signed in.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/auth/session', { credentials: 'same-origin' });
        const data = res.ok ? ((await res.json()) as { user: User }) : null;
        if (!cancelled) setUser(data?.user ?? null);
      } catch {
        if (!cancelled) setUser(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ email, password }),
    });
    const data = (await res.json().catch(() => null)) as
      | { user?: User; error?: string }
      | null;
    if (!res.ok || !data?.user) {
      throw new Error(data?.error || 'Could not sign you in.');
    }
    setUser(data.user);
  }, []);

  const signOut = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' });
    } finally {
      // Sign out locally even if the request failed; the cookie may already
      // be gone and leaving the UI "signed in" would be worse.
      setUser(null);
    }
  }, []);

  const value = useMemo(() => ({ user, signIn, signOut }), [user, signIn, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
