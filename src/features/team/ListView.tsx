import { useState } from 'react';
import { ChevronRight, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';
import {
  LIST_MEMBERS, PRIORITY_STYLE, STATUS_STYLE,
  formatDay, initials,
  type ListMember,
} from './data';

const TH = 'py-2 text-left text-[10px] font-semibold uppercase tracking-widest text-[#8C8C8C]/60';

/** Roster table. A whole row is the click target, not just the name. */
export function MemberTable({
  selectedId, onSelect,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="px-[18px] pb-4 pt-2">
      <div className="overflow-hidden rounded-xl border border-[#3D3D3D] bg-[#2C2C2B]">
        <table className="w-full table-fixed">
          <thead>
            <tr className="border-b border-[#3D3D3B]">
              <th className={cn('w-[220px] pl-6 pr-4', TH)}>Member</th>
              <th className={cn('px-4', TH)}>Active Goals</th>
              <th className={cn('w-[70px] px-4 text-center', TH)}>Goals</th>
              <th className={cn('w-[70px] px-4 text-center', TH)}>Tasks</th>
              <th className={cn('w-[80px] pl-4 pr-6 text-center', TH)}>Overdue</th>
            </tr>
          </thead>
          <tbody>
            {LIST_MEMBERS.map((m, i) => (
              <tr
                key={m.name}
                onClick={() => onSelect(m.id)}
                className={cn(
                  'cursor-pointer transition-colors duration-150',
                  i < LIST_MEMBERS.length - 1 && 'border-b border-[#3D3D3B]',
                  selectedId === m.id ? 'bg-white/5' : 'hover:bg-white/[0.02]',
                )}
              >
                <td className="py-2 pl-6 pr-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FAFAFA]/80 text-[10px] font-semibold text-[#121212]">
                      {initials(m.name)}
                    </span>
                    <p className="truncate text-[13px] font-medium leading-tight text-[#FAFAFA]">
                      {m.name}
                    </p>
                  </div>
                </td>
                <td className="py-2 px-4">
                  <div className="flex flex-col gap-0.5">
                    {m.activeGoals.map((g) => (
                      <div key={g} className="flex min-w-0 items-center gap-1.5">
                        <span className="h-1 w-1 shrink-0 rounded-full bg-[#FAFAFA]/40" />
                        <span className="truncate text-[12px] text-[#FAFAFA]/85">{g}</span>
                      </div>
                    ))}
                    {m.more > 0 && (
                      <span className="pl-2.5 text-[11px] text-[#8C8C8C]/50">+{m.more} more</span>
                    )}
                  </div>
                </td>
                <td className="py-2 px-4 text-center">
                  <span className="text-[12px] text-[#8C8C8C]/75">{m.goals}</span>
                </td>
                <td className="py-2 px-4 text-center">
                  <span className="text-[12px] text-[#8C8C8C]/75">{m.tasks}</span>
                </td>
                <td className="py-2 pl-4 pr-6 text-center">
                  {m.overdue > 0 ? (
                    <span className="inline-flex items-center gap-1 text-[11px] text-red-400/80">
                      <Clock className="h-3 w-3" />
                      {m.overdue}
                    </span>
                  ) : (
                    <span className="text-[12px] text-[#8C8C8C]/75">0</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** Detail pane for one person, with its own Goals/Tasks sub-tabs. */
export function MemberDetail({ row, onClose }: { row: ListMember; onClose: () => void }) {
  const [tab, setTab] = useState<'goals' | 'tasks'>('goals');

  return (
    <div className="relative flex h-full flex-col bg-[#1F1F1E]">
      <div className="pointer-events-none absolute inset-0 z-10 rounded-lg border border-[#3D3D3D]" />

      <div className="shrink-0 border-b border-[#3D3D3D] px-6 py-4">
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FAFAFA] text-xs font-semibold text-[#121212]">
            {initials(row.name)}
          </span>
          <div className="min-w-0 flex-1">
            <span className="truncate text-[14px] font-semibold text-[#FAFAFA]">{row.name}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] border border-[#3D3D3D] bg-[#2C2C2B] text-[#8C8C8C] transition-colors duration-150 hover:bg-[#3D3D3D] hover:text-[#FAFAFA]"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {row.focus && (
          <div className="mt-3 rounded-lg border border-[#3D3D3D] bg-[#242424] px-3 py-2">
            <p className="mb-0.5 text-[10px] uppercase tracking-wider text-[#8C8C8C]/40">
              Working on
            </p>
            <p className="text-[12px] leading-relaxed text-[#FAFAFA]/80">{row.focus}</p>
          </div>
        )}

        <div className="mt-3 flex gap-1">
          {(['goals', 'tasks'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                'rounded-[6px] px-3 py-1.5 text-[12px] font-medium tracking-wider transition-colors',
                tab === t
                  ? 'bg-[#2E2E2E] text-[#FAFAFA]'
                  : 'text-[#8C8C8C]/50 hover:bg-[#242424] hover:text-[#FAFAFA]',
              )}
            >
              {t === 'goals' ? 'Goals' : 'Tasks'}
            </button>
          ))}
        </div>
      </div>

      <div className={'min-h-0 flex-1 space-y-2 overflow-y-auto p-4 app-scroll'}>
        {tab === 'goals' &&
          row.detailGoals.map((g) => {
            const status = STATUS_STYLE[g.status] ?? STATUS_STYLE['not started'];
            const priority = g.priority ? PRIORITY_STYLE[g.priority] : null;
            const total = g.total ?? 0;
            const pct = total > 0 ? Math.round(((g.done ?? 0) / total) * 100) : 0;
            const late = g.deadlineDays !== undefined && g.deadlineDays < 0;
            return (
              <div
                key={g.title}
                className="space-y-2 rounded-xl border border-[#3D3D3D] bg-[#1E1E1D] p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    {g.category && (
                      <div className="mb-1.5 flex">
                        <span className="max-w-full truncate rounded border border-[#FAFAFA]/15 px-1.5 py-0.5 text-[10px] leading-none text-[#FAFAFA]/70">
                          {g.category}
                        </span>
                      </div>
                    )}
                    <p className="text-[13px] font-medium leading-snug text-[#FAFAFA]">{g.title}</p>
                    {g.description && (
                      <p className="mt-0.5 line-clamp-1 text-[11px] text-[#8C8C8C]/50">
                        {g.description}
                      </p>
                    )}
                  </div>
                  {priority && (
                    <span className={cn('shrink-0 text-[11px] font-medium', priority.color)}>
                      {priority.label}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className={cn('text-[11px] font-medium', status.color)}>{status.label}</span>
                  {g.deadlineDays !== undefined && (
                    <span
                      className={cn(
                        'text-[11px]',
                        late ? 'font-medium text-red-400' : 'text-[#8C8C8C]/50',
                      )}
                    >
                      {formatDay(g.deadlineDays)}
                    </span>
                  )}
                </div>

                {total > 0 && (
                  <div className="space-y-1">
                    <div className="h-1 w-full overflow-hidden rounded-full bg-[#3D3D3D]">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all',
                          pct === 100 ? 'bg-emerald-400' : 'bg-[#FAFAFA]',
                        )}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-[10px] tabular-nums text-[#8C8C8C]/40">
                      {g.done}/{total} Tasks · {pct}%
                    </p>
                  </div>
                )}
              </div>
            );
          })}

        {tab === 'tasks' &&
          row.detailTasks.map((t) => {
            const status = STATUS_STYLE[t.status] ?? STATUS_STYLE['to do'];
            const priority = t.priority ? PRIORITY_STYLE[t.priority] : null;
            const late = t.deadlineDays !== undefined && t.deadlineDays < 0;
            return (
              <div
                key={t.title}
                className="flex items-start gap-3 rounded-xl border border-[#3D3D3D] bg-[#1E1E1D] p-3"
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="text-[13px] font-medium leading-snug text-[#FAFAFA]">{t.title}</p>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className={cn('text-[11px] font-medium', status.color)}>
                      {status.label}
                    </span>
                    {t.deadlineDays !== undefined && (
                      <span
                        className={cn(
                          'text-[11px]',
                          late ? 'font-medium text-red-400' : 'text-[#8C8C8C]/50',
                        )}
                      >
                        {formatDay(t.deadlineDays)}
                      </span>
                    )}
                    {priority && (
                      <span className={cn('text-[11px]', priority.color)}>{priority.label}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
