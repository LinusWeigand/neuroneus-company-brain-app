import type { ReactNode } from 'react';
import { CONTACT_EMAIL } from '../lib/config';

/* Shared field styling for every signed-out screen. Kept here rather than
   duplicated per page so sign-in, forgot and reset cannot drift apart. */
export const FIELD =
  'h-11 w-full rounded-[6px] border border-white/10 bg-app-bg px-3 text-sm text-app-text outline-none transition-colors placeholder:text-app-muted/70 focus:border-white/25';
export const LABEL = 'text-[11px] font-medium uppercase tracking-wider text-app-muted';
export const WHITE_BUTTON =
  'h-11 rounded-[6px] bg-white text-[#1a1a1a] text-sm font-medium transition-all duration-200 hover:bg-white/90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100';

export function AuthShell({ children, footer }: { children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="flex min-h-full items-center justify-center bg-app-bg px-6 py-12">
      <div className="w-full max-w-[380px]">
        <div className="mb-8 text-center">
          <span className="font-orbitron text-2xl font-bold uppercase tracking-widest text-app-text">
            Orakis
          </span>
        </div>
        <div className="flex flex-col gap-5">{children}</div>
        {footer}
      </div>
    </div>
  );
}

export function ContactFooter() {
  return (
    <p className="mt-8 text-center text-[12px] text-app-muted">
      <a href={`mailto:${CONTACT_EMAIL}`} className="transition-colors hover:text-app-text">
        Contact
      </a>
    </p>
  );
}
