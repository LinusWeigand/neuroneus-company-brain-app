import { useEffect, useState, type FormEvent } from 'react';
import { useAuth } from '../lib/auth';
import { AuthShell, ContactFooter, FIELD, LABEL, WHITE_BUTTON } from '../components/AuthShell';
import { SIGN_UP_URL } from '../lib/config';
import { cn } from '../lib/utils';

/** Brand marks for the federated options, drawn inline so no request is made. */
const GoogleMark = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
    <path fill="#4285F4" d="M23.06 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h6.2a5.3 5.3 0 0 1-2.3 3.48v2.89h3.72c2.18-2 3.44-4.96 3.44-8.38Z" />
    <path fill="#34A853" d="M12 23.5c3.1 0 5.7-1.03 7.62-2.79l-3.72-2.89c-1.03.69-2.35 1.1-3.9 1.1-3 0-5.54-2.02-6.45-4.74H1.71v2.98A11.5 11.5 0 0 0 12 23.5Z" />
    <path fill="#FBBC05" d="M5.55 14.18a6.9 6.9 0 0 1 0-4.36V6.84H1.71a11.5 11.5 0 0 0 0 10.32l3.84-2.98Z" />
    <path fill="#EA4335" d="M12 5.04c1.69 0 3.2.58 4.4 1.72l3.3-3.3C17.7 1.6 15.1.5 12 .5A11.5 11.5 0 0 0 1.71 6.84l3.84 2.98C6.46 7.1 9 5.04 12 5.04Z" />
  </svg>
);

const MicrosoftMark = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
    <path fill="#F25022" d="M2 2h9.5v9.5H2z" />
    <path fill="#7FBA00" d="M12.5 2H22v9.5h-9.5z" />
    <path fill="#00A4EF" d="M2 12.5h9.5V22H2z" />
    <path fill="#FFB900" d="M12.5 12.5H22V22h-9.5z" />
  </svg>
);

/** Messages for the ?error= codes /api/auth/callback can redirect back with. */
const OAUTH_ERRORS: Record<string, string> = {
  no_account:
    'No account found for that address. Contact us to request access.',
  email_unverified:
    'Your provider could not confirm that email address belongs to you. Sign in with your password instead.',
  oauth_denied: 'Sign-in was cancelled.',
  oauth_state: 'That sign-in attempt expired. Please try again.',
  oauth_unavailable: 'That sign-in method is not available right now.',
  oauth_failed: 'Sign-in failed. Please try again.',
};

/**
 * Request a reset link. The response is deliberately identical whether or not
 * the address has an account, so the wording never confirms one exists.
 */
function ForgotPassword({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      await fetch('/api/auth/forgot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
    } catch {
      /* Even a network failure shows the same confirmation: reporting it
         differently would leak whether the address was found. */
    } finally {
      setBusy(false);
      setSent(true);
    }
  };

  if (sent) {
    return (
      <AuthShell footer={<ContactFooter />}>
        <h1 className="text-xl font-bold leading-snug text-white">Check your inbox</h1>
        <p className="text-[13px] leading-relaxed text-app-muted">
          If an account exists for {email || 'that address'}, a reset link is on its way. It
          expires in an hour.
        </p>
        <button type="button" onClick={onBack} className={cn(WHITE_BUTTON, 'w-full')}>
          Back to sign in
        </button>
      </AuthShell>
    );
  }

  return (
    <AuthShell footer={<ContactFooter />}>
      <h1 className="text-xl font-bold leading-snug text-white">Reset your password</h1>
      <p className="text-[13px] leading-relaxed text-app-muted">
        Enter your email and we'll send you a link to choose a new password.
      </p>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div className="space-y-1.5">
          <label htmlFor="reset-email" className={LABEL}>Email</label>
          <input
            id="reset-email"
            type="email"
            autoComplete="username"
            placeholder="name@example.com"
            className={FIELD}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button type="submit" disabled={busy} className={cn(WHITE_BUTTON, 'w-full')}>
          {busy ? 'Sending…' : 'Send reset link'}
        </button>
      </form>

      <button
        type="button"
        onClick={onBack}
        className="text-[13px] text-app-muted transition-colors hover:text-app-text"
      >
        Back to sign in
      </button>
    </AuthShell>
  );
}

export default function Login() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [forgot, setForgot] = useState(false);

  /* The OAuth callback reports failures by redirecting here with ?error=.
     Strip it from the URL once read, so a refresh does not resurrect it. */
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('error');
    if (!code) return;
    setError(OAUTH_ERRORS[code] ?? OAUTH_ERRORS.oauth_failed!);
    window.history.replaceState({}, '', window.location.pathname);
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setError('');
    setBusy(true);
    try {
      await signIn(email, password);
      // No redirect needed: the app re-renders once the session exists.
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not sign you in.');
    } finally {
      setBusy(false);
    }
  };

  if (forgot) return <ForgotPassword onBack={() => setForgot(false)} />;

  return (
    <AuthShell footer={<ContactFooter />}>
          <h1 className="text-xl font-bold leading-snug text-white">Sign in</h1>

          {/* Federated sign-in is part of the original design but needs OAuth
              apps registered with each provider. Disabled until configured
              rather than hidden, so the option is visibly coming. */}
          <div className="flex gap-3">
            {/* A full navigation, not fetch: the provider redirects the browser
                back to our callback, which sets the session cookie. */}
            <a
              href="/api/auth/start/google"
              className={cn(WHITE_BUTTON, 'flex flex-1 items-center justify-center gap-2')}
            >
              <GoogleMark />
              Google
            </a>
            <a
              href="/api/auth/start/microsoft"
              className={cn(WHITE_BUTTON, 'flex flex-1 items-center justify-center gap-2')}
            >
              <MicrosoftMark />
              Microsoft
            </a>
          </div>

          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-white/10" />
            <span className="text-[11px] uppercase tracking-wider text-app-muted">or</span>
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="space-y-1.5">
              <label htmlFor="email" className={LABEL}>Email</label>
              <input
                id="email"
                type="email"
                autoComplete="username"
                placeholder="name@example.com"
                className={FIELD}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className={LABEL}>Password</label>
                <button
                  type="button"
                  onClick={() => setForgot(true)}
                  className="text-[11px] text-app-muted transition-colors hover:text-app-text"
                >
                  Forgot password?
                </button>
              </div>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className={FIELD}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <p role="alert" className="text-[13px] text-red-400">
                {error}
              </p>
            )}

            <button type="submit" disabled={busy} className={cn(WHITE_BUTTON, 'w-full')}>
              {busy ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-[13px] text-app-muted">
            Don't have an account?{' '}
            <a href={SIGN_UP_URL} className="text-app-text underline-offset-2 hover:underline">
              Sign up
            </a>
          </p>
    </AuthShell>
  );
}
