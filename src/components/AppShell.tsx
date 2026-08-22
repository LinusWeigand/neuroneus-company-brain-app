import { useState, type ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronsUpDown, Info, PanelLeft, Settings } from 'lucide-react';
import { cn } from '../lib/utils';
import { NAV, USER, WORKSPACE } from '../lib/nav';
import { OrakisMark } from './OrakisMark';

const EXPANDED = 248;
const COLLAPSED = 58;

/**
 * Application chrome: a collapsible sidebar beside a scrolling content area.
 *
 * The shell owns the only full-height flexbox on the page. Each screen scrolls
 * inside its own region rather than scrolling the document, which is why
 * `html` has `overflow: hidden` — otherwise the page and the panel fight over
 * a second scrollbar.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-full w-full overflow-hidden bg-app-bg text-app-text">
      <aside
        className="relative flex shrink-0 flex-col border-r border-app-border-soft bg-app-bg transition-[width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{ width: collapsed ? COLLAPSED : EXPANDED }}
      >
        {/* Workspace switcher. Both states are always mounted and cross-faded,
            so the label never reflows mid-animation. */}
        <div className="p-2">
          <button
            type="button"
            className={cn(
              'group relative flex w-full items-center rounded-[6px] transition-colors hover:bg-white/10',
              collapsed ? 'h-8 p-0' : 'px-2 py-1.5',
            )}
          >
            <OrakisMark
              size={24}
              className={cn(
                'mx-auto shrink-0 text-app-text transition-opacity duration-200 ease-out',
                collapsed ? 'opacity-100 delay-100' : 'opacity-0 delay-0',
              )}
            />
            <div
              className={cn(
                'absolute inset-y-0 left-2 right-2 flex items-center gap-2 transition-opacity duration-200 ease-out',
                collapsed ? 'opacity-0 delay-0' : 'opacity-100 delay-100',
              )}
            >
              <div className="min-w-0 flex-1 text-left">
                <span className="block whitespace-nowrap font-orbitron text-base font-extrabold uppercase leading-tight tracking-widest text-app-text">
                  {WORKSPACE.org}
                </span>
                <span className="block truncate text-[11px] leading-tight text-app-text/60">
                  {WORKSPACE.name}
                </span>
              </div>
              <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-app-muted" />
            </div>
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 app-scroll">
          {NAV.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              title={collapsed ? label : undefined}
              className={({ isActive }) =>
                cn(
                  'flex h-8 items-center gap-2.5 rounded-[6px] px-2 text-[13px] transition-colors',
                  collapsed && 'justify-center px-0',
                  isActive
                    ? 'bg-white/10 font-medium text-app-text'
                    : 'text-app-muted hover:bg-white/5 hover:text-app-text',
                )
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-app-border-soft p-2">
          <button
            type="button"
            className={cn(
              'flex w-full items-center gap-2 rounded-[6px] p-1.5 transition-colors hover:bg-white/10',
              collapsed && 'justify-center',
            )}
          >
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-app-text text-[10px] font-semibold text-[#121212]">
              {USER.initials}
            </span>
            {!collapsed && (
              <span className="min-w-0 flex-1 text-left">
                <span className="block truncate text-[13px] leading-tight text-app-text">
                  {USER.name}
                </span>
                <span className="block truncate text-[11px] leading-tight text-app-muted">
                  {USER.email}
                </span>
              </span>
            )}
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-12 shrink-0 items-center gap-2 border-b border-app-border-soft px-3">
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="flex size-7 items-center justify-center rounded-[6px] text-app-muted transition-colors hover:bg-white/10 hover:text-app-text"
          >
            <PanelLeft className="h-4 w-4" />
          </button>
          <div className="min-w-0 flex-1" id="app-breadcrumb-slot" />
          <button
            type="button"
            aria-label="Settings"
            className="flex size-7 items-center justify-center rounded-[6px] text-app-muted transition-colors hover:bg-white/10 hover:text-app-text"
          >
            <Settings className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Help"
            className="flex size-7 items-center justify-center rounded-[6px] text-app-muted transition-colors hover:bg-white/10 hover:text-app-text"
          >
            <Info className="h-4 w-4" />
          </button>
        </header>

        <main className="min-h-0 flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
