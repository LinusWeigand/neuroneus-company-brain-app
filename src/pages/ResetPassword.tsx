import { useState, type FormEvent } from 'react';
import { AuthShell, ContactFooter, FIELD, LABEL, WHITE_BUTTON } from '../components/AuthShell';
import { cn } from '../lib/utils';

/** Mirrors the server's floor in api/auth/reset.ts. */
const MIN_PASSWORD = 12;

export default function ResetPassword() {
  const token = new URLSearchParams(window.location.search).get('token') ?? '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    if (password.length < MIN_PASSWORD) {
      return setError(`Password must be at least ${MIN_PASSWORD} characters.`);
    }
    if (password !== confirm) return setError('Those passwords do not match.');

    setError('');
    setBusy(true);
    try {
      const res = await fetch('/api/auth/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? 'Could not reset your password.');
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not reset your password.');
    } finally {
      setBusy(false);
    }
  };

  const footer = <ContactFooter />;

  if (!token) {
    return (
      <AuthShell footer={footer}>
        <h1 className="text-xl font-bold leading-snug text-white">Reset link incomplete</h1>
        <p className="text-[13px] leading-relaxed text-app-muted">
          This link is missing its token. Open the most recent reset email again, or request a
          new link.
        </p>
        <a href="/" className={cn(WHITE_BUTTON, 'flex items-center justify-center')}>
          Back to sign in
        </a>
      </AuthShell>
    );
  }

  if (done) {
    return (
      <AuthShell footer={footer}>
        <h1 className="text-xl font-bold leading-snug text-white">Password updated</h1>
        <p className="text-[13px] leading-relaxed text-app-muted">
          You have been signed out everywhere else. Sign in with your new password.
        </p>
        {/* A full load, not a route change: resetting revoked every session,
            so the cached user in memory is stale and must be re-fetched. */}
        <button
          type="button"
          onClick={() => window.location.assign('/')}
          className={cn(WHITE_BUTTON, 'w-full')}
        >
          Sign in
        </button>
      </AuthShell>
    );
  }

  return (
    <AuthShell footer={footer}>
      <h1 className="text-xl font-bold leading-snug text-white">Choose a new password</h1>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div className="space-y-1.5">
          <label htmlFor="password" className={LABEL}>New password</label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            className={FIELD}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="text-[11px] text-app-muted">At least {MIN_PASSWORD} characters.</p>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="confirm" className={LABEL}>Confirm password</label>
          <input
            id="confirm"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            className={FIELD}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>

        {error && <p role="alert" className="text-[13px] text-red-400">{error}</p>}

        <button type="submit" disabled={busy} className={cn(WHITE_BUTTON, 'w-full')}>
          {busy ? 'Saving…' : 'Set new password'}
        </button>
      </form>
    </AuthShell>
  );
}
