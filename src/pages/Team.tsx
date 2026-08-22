import { useMemo, useState } from 'react';
import { Users } from 'lucide-react';
import { Breadcrumb } from '../components/Breadcrumb';
import { TeamGraph } from '../features/team/TeamGraph';
import { MemberDetail, MemberTable } from '../features/team/ListView';
import { LIST_MEMBERS, MEMBERS } from '../features/team/data';
import { cn } from '../lib/utils';

const TOTAL_OVERDUE = MEMBERS.reduce((n, m) => n + m.overdue, 0);

const TAB =
  'relative z-10 h-full rounded-[6px] px-4 text-sm font-medium transition-colors duration-200 ease-in-out';

export default function Team() {
  const [view, setView] = useState<'map' | 'list'>('map');
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  const selectedRow = useMemo(
    () => LIST_MEMBERS.find((m) => m.id === selectedMember) ?? null,
    [selectedMember],
  );

  /* Switching view drops the selection: a person highlighted in the list has
     no meaning on the map, and vice versa. */
  const changeView = (v: 'map' | 'list') => {
    setView(v);
    setSelectedMember(null);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 px-5 pt-4">
        <Breadcrumb Icon={Users} section="Team" page="Overview" />
      </div>

      <div
        className={cn(
          'flex min-h-[28px] shrink-0 items-center gap-5 px-5 pb-2 pt-3',
          view === 'map' && 'border-b border-app-border-soft',
        )}
      >
        <div className="flex min-w-0 flex-wrap items-center gap-1">
          <div className="relative grid h-7 shrink-0 grid-cols-2 overflow-hidden rounded-[6px] border border-app-border-soft bg-app-raised">
            <div
              className="pointer-events-none absolute inset-y-0 w-1/2 rounded-[6px] bg-app-text transition-[left] duration-200 ease-in-out"
              style={{ left: view === 'map' ? '50%' : '0%' }}
            />
            {(['list', 'map'] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => changeView(v)}
                className={cn(TAB, view === v ? 'text-[#1F1F1E]' : 'text-app-muted hover:text-app-text')}
              >
                {v === 'list' ? 'List' : 'Map'}
              </button>
            ))}
          </div>

          <span className="flex h-7 cursor-pointer items-center gap-1.5 rounded-[6px] px-2.5 text-sm text-app-muted transition-colors hover:bg-white/10 hover:text-app-text">
            <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-[2px] bg-[#f87171]" />
            {TOTAL_OVERDUE} overdue
          </span>
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        <div className="min-w-0 flex-1">
          {view === 'map' ? (
            <TeamGraph />
          ) : (
            <MemberTable
              selectedId={selectedMember}
              onSelect={(id) => setSelectedMember((cur) => (cur === id ? null : id))}
            />
          )}
        </div>
        {view === 'list' && selectedRow && (
          <div className="min-h-0 w-[320px] shrink-0 pr-3">
            <MemberDetail row={selectedRow} onClose={() => setSelectedMember(null)} />
          </div>
        )}
      </div>
    </div>
  );
}
