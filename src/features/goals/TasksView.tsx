import { Calendar, EllipsisVertical, Plus } from 'lucide-react';
import { cn } from '../../lib/utils';
import { PRIORITY, TASK_COLUMNS, dueDate, type TaskCard } from './data';

/** Fades the leftmost 32px so cards dissolve into the panel edge when scrolled. */
const EDGE_FADE = {
  WebkitMaskImage: 'linear-gradient(to right, transparent 0, black 32px)',
  maskImage: 'linear-gradient(to right, transparent 0, black 32px)',
};

const Chip = ({ children, truncate }: { children: React.ReactNode; truncate?: boolean }) => (
  <span
    className={cn(
      'rounded border border-[#FAFAFA]/15 px-1.5 py-0.5 text-[11px] leading-none text-[#FAFAFA]/70',
      truncate && 'max-w-full truncate',
    )}
  >
    {children}
  </span>
);

/** Half-pixel spacer that stands in for the drop indicator between cards. */
const Gap = () => <div className="my-0.5 h-0.5 w-full" />;

function Card({ card }: { card: TaskCard }) {
  const due = card.dueDays === undefined ? null : dueDate(card.dueDays);
  const priority = PRIORITY[card.priority];

  return (
    <>
      <Gap />
      <div className="group mb-2 cursor-grab rounded border border-[#3D3D3D] bg-[#2C2C2B] p-3 active:cursor-grabbing">
        {card.goal && (
          <div className="mb-1.5 flex">
            <Chip truncate>{card.goal}</Chip>
          </div>
        )}
        <div className="flex items-start justify-between gap-2">
          <p className="flex-1 cursor-pointer text-[13px] font-medium leading-snug text-[#FAFAFA]">
            {card.title}
          </p>
          <span className="-mr-1 flex h-[18px] w-5 shrink-0 cursor-pointer items-center justify-center rounded-[6px] opacity-0 transition-opacity hover:bg-[#FAFAFA]/10 group-hover:opacity-100">
            <EllipsisVertical className="h-3 w-3 text-[#FAFAFA]" />
          </span>
        </div>
        {card.desc && (
          <p className="mt-1 line-clamp-2 text-[12px] leading-snug text-[#8C8C8C]/70">
            {card.desc}
          </p>
        )}
        <div className="mt-1.5 flex flex-wrap items-center gap-2.5 border-t border-[#3D3D3D] pt-2">
          <span className={cn('text-[11px] font-medium leading-none', priority.cls)}>
            {priority.label}
          </span>
          {card.review && (
            <span className="max-w-[150px] truncate text-[11px] font-medium leading-none text-teal-400">
              Review {card.review}
            </span>
          )}
          {due && (
            <div className="ml-auto flex items-center gap-1">
              <Calendar
                className={cn(
                  'h-3 w-3 shrink-0',
                  due.overdue ? 'text-red-400' : 'text-[#8C8C8C]/50',
                )}
              />
              <span
                className={cn(
                  'text-[11px] tabular-nums leading-none',
                  due.overdue ? 'font-medium text-red-400' : 'text-[#8C8C8C]',
                )}
              >
                {due.text}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export function TasksView() {
  return (
    <div className="-mx-4 -mb-6 flex flex-1 flex-col">
      <div
        className={'flex w-full flex-1 gap-3 overflow-x-auto px-4 pb-4 app-scroll'}
        style={EDGE_FADE}
      >
        {TASK_COLUMNS.map((col) => (
          <div key={col.label} className="w-[300px] shrink-0">
            <div className="mb-3 flex items-center gap-2">
              <span
                className="h-2 w-2 shrink-0 rounded-[3px]"
                style={{ background: col.color }}
              />
              <h3 className="font-medium text-[#FAFAFA]">{col.label}</h3>
              <span className="text-sm text-[#8C8C8C]">{col.cards.length}</span>
            </div>
            {col.cards.map((card) => (
              <Card key={card.title} card={card} />
            ))}
            <Gap />
            <span className="flex w-full cursor-pointer items-center gap-1.5 px-3 py-1.5 text-xs text-[#8C8C8C] transition-colors hover:text-[#FAFAFA]">
              <span>Add card</span>
              <Plus size={16} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
