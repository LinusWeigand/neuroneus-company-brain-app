import type { ReactNode } from 'react';
import { useWorkspaceState } from '../lib/workspace';
import { Splash } from './Splash';

/**
 * Holds a screen back until the workspace has arrived.
 *
 * `useWorkspace()` throws when read early, deliberately: a screen that renders
 * against half-loaded content is a bug that shows up as a blank panel rather
 * than as an error. Everything that reads content renders under this.
 */
export function WorkspaceGate({ children }: { children: ReactNode }) {
  const { data, error, reload } = useWorkspaceState();

  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 bg-app-bg px-6 text-center">
        <p className="text-[13px] text-app-text">{error}</p>
        <button
          type="button"
          onClick={reload}
          className="inline-flex h-8 cursor-pointer items-center rounded-[6px] border border-app-border px-3 text-[13px] font-medium text-app-text transition-colors hover:bg-app-text/10"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!data) return <Splash />;
  return <>{children}</>;
}
