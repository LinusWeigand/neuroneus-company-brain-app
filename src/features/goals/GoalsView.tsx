import { Calendar, EllipsisVertical } from 'lucide-react';
import { cn, initials } from '../../lib/utils';
import { useWorkspace } from '../../lib/workspace';
import { PRIORITY, dueDate, type GoalCard } from './view';

/**
 * Goals tab: one card per goal.
 *
 * Recovered from the deployed prerender, where each card was literal markup —
 * seven near-identical copies that also happened to be workspace content
 * compiled into the public bundle. The layout is unchanged; only its source is.
 */
function Card({ goal }: { goal: GoalCard }) {
  const priority = PRIORITY[goal.priority];
  const due = goal.dueDays === undefined ? null : dueDate(goal.dueDays);
  const { status, progress } = goal;

  return (
    <div className="group relative flex h-[210px] cursor-pointer flex-col overflow-hidden rounded-xl border border-[#3D3D3D] bg-[#2C2C2B] transition-all duration-200 hover:border-[#676765] hover:bg-[#242424]/10">
      <div className="flex items-start justify-between gap-3 px-5 pt-4">
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex h-4 items-center gap-2">
            <span className="rounded border border-[#FAFAFA]/15 px-1.5 py-0.5 text-[11px] leading-none text-[#FAFAFA]/70">
              {goal.category}
            </span>
            <span className={cn('text-[11px] font-medium', priority.cls)}>{priority.label}</span>
          </div>
          <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-[#FAFAFA]">
            {goal.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-[#8C8C8C]">
            {goal.description}
          </p>
        </div>
        <span className="-mr-1 -mt-0.5 flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-[6px] text-[#8C8C8C] opacity-0 transition-opacity hover:bg-[#242424]/50 hover:text-[#FAFAFA] group-hover:opacity-100">
          <EllipsisVertical className="h-3.5 w-3.5" />
        </span>
      </div>

      <div className="mt-auto flex flex-col gap-2 px-5 pb-4 pt-3">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-medium" style={{ color: status.color }}>
            {status.label}
          </span>
          <span className="text-[12px] tabular-nums text-[#8C8C8C]">
            {progress
              ? `${progress.done}/${progress.total} tasks · ${progress.percent}%`
              : 'No tasks'}
          </span>
        </div>

        <div className="h-1 w-full overflow-hidden rounded-full bg-[#3D3D3D]">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${progress?.percent ?? 0}%`, background: status.color }}
          />
        </div>

        <div className="mt-2 flex h-5 items-center justify-between">
          {/* Rendered even with no date: it is the left half of the
              justify-between, and dropping it would slide the avatars over. */}
          <div className="flex items-center gap-1.5 text-[12px]">
            {due && (
              <>
                <Calendar className="h-3 w-3 shrink-0 text-[#8C8C8C]" />
                <span className="text-[#8C8C8C]">{due.text}</span>
              </>
            )}
          </div>
          <div className="flex -space-x-1.5">
            {goal.people.map((person) => (
              <span
                key={person}
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-[#2C2C2B] bg-[#FAFAFA]"
              >
                <span className="text-[7px] font-semibold leading-none text-[#121212]">
                  {initials(person)}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function GoalsView() {
  const { goalCards } = useWorkspace().goals;

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(380px,1fr))] gap-4">
      {goalCards.map((goal) => (
        <Card key={goal.title} goal={goal} />
      ))}
    </div>
  );
}
