import { useState } from 'react';
import { ChevronDown, Layers, Plus, Search } from 'lucide-react';
import { Breadcrumb } from '../components/Breadcrumb';
import { GoalsView } from '../features/goals/GoalsView';
import { TasksView } from '../features/goals/TasksView';
import { cn } from '../lib/utils';

type Tab = 'goals' | 'tasks';

const TAB_BASE =
  'relative z-10 flex h-9 cursor-pointer items-center justify-center rounded-[6px] px-3 text-sm font-medium transition-colors duration-200 ease-in-out';

export default function Goals() {
  /* The marketing demo auto-cycles these tabs every few seconds to show both
     views. That belongs in a demo, not in a tool someone is working in — here
     the tab only changes when the user changes it. */
  const [tab, setTab] = useState<Tab>('goals');
  const label = tab === 'goals' ? 'Goals' : 'Tasks';

  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 px-5 pt-4">
        <Breadcrumb Icon={Layers} section="Goals & Tasks" page={label} />
      </div>

      <div className="flex h-full min-h-0 flex-col px-4 pb-6 pt-4">
        <div className="mb-4 flex items-center gap-3">
          <div className="relative grid h-9 shrink-0 grid-cols-2 overflow-hidden rounded-[6px] border border-app-border-soft bg-app-raised">
            <div
              className="pointer-events-none absolute top-0 h-full w-1/2 rounded-[6px] bg-app-text transition-[left] duration-200 ease-in-out"
              style={{ left: tab === 'goals' ? '0%' : '50%' }}
            />
            {(['goals', 'tasks'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={cn(
                  TAB_BASE,
                  tab === t ? 'text-[#1F1F1E]' : 'text-app-muted hover:text-app-text',
                )}
              >
                {t === 'goals' ? 'Goals' : 'Tasks'}
              </button>
            ))}
          </div>

          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-app-muted" />
            <input
              placeholder={`Search ${tab}...`}
              className="h-9 w-full rounded-[6px] border border-app-border bg-app-bg pl-10 pr-3 text-sm text-app-text outline-none transition-colors placeholder:text-app-muted hover:border-app-muted/40 focus:border-app-muted/60"
            />
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <div className="relative">
              <span className="grid h-9 cursor-pointer items-center rounded-[6px] bg-app-raised pl-3 pr-8 text-sm text-white transition-colors hover:bg-app-border">
                {tab === 'goals' ? 'Grid' : 'Kanban'}
              </span>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white opacity-60" />
            </div>
            <button
              type="button"
              className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-[6px] bg-white px-4 text-sm font-medium text-zinc-900 transition-opacity hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              {tab === 'goals' ? 'New Goal' : 'New Task'}
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto app-scroll">
          {tab === 'goals' ? <GoalsView /> : <TasksView />}
        </div>
      </div>
    </div>
  );
}
