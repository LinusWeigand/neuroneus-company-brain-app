import { useState, type ReactNode } from 'react';
import { Check, ChevronDown, Clock, House, MessageSquare, X } from 'lucide-react';
import { Breadcrumb } from '../components/Breadcrumb';
import { cn, initials } from '../lib/utils';
import {
  hhmm, todayLabel, type AgendaEvent, type BriefingParagraph,
} from '../features/dashboard/view';
import { useWorkspace } from '../lib/workspace';

const SectionTitle = ({ children }: { children: ReactNode }) => (
  <p className="mb-4 font-sans text-[15px] font-semibold text-app-text">{children}</p>
);

const Avatar = ({ initials }: { initials: string }) => (
  <span className="flex size-[18px] shrink-0 items-center justify-center rounded-full border border-app-border bg-app-bg text-[8px] font-semibold text-app-text/80">
    {initials}
  </span>
);

/* Inline references inside the narrative. Three kinds, matching the product
   design: a task reads as a link, a goal as a chip carrying its own colour, and
   a person as their avatar followed by their name. Sizes are in `em` so each
   one scales with the prose it sits in. */

const TaskRef = ({ title }: { title: string }) => (
  <span className="cursor-pointer text-[#6699ff] hover:underline">{title}</span>
);

const GoalRef = ({ title, color }: { title: string; color: string }) => (
  <span className="inline-flex max-w-full cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-[6px] border border-[#3D3D3D]/50 bg-[#3D3D3D] px-2 py-[0.25em] align-middle text-[0.9em] font-medium leading-none text-app-text transition-colors hover:border-[#676765] hover:bg-[#2E2E2E]">
    <span className="h-1.5 w-1.5 shrink-0 rounded-[2px]" style={{ background: color }} />
    <span className="truncate">{title}</span>
  </span>
);

const PersonRef = ({ name }: { name: string }) => (
  <span className="inline">
    <span className="relative top-[-0.075em] mr-[0.35em] inline-flex h-[1.35em] w-[1.35em] shrink-0 items-center justify-center rounded-full bg-app-text align-middle">
      <span className="text-[0.47em] font-semibold leading-none text-[#121212]">
        {initials(name)}
      </span>
    </span>
    <span className="cursor-pointer text-app-text hover:underline">{name}</span>
  </span>
);

const ActionButton = ({ icon: Icon, children }: { icon: typeof Check; children: ReactNode }) => (
  <button
    type="button"
    className="inline-flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-[6px] border border-app-border bg-transparent px-3 text-[13px] font-medium text-app-text shadow-sm shadow-black/5 transition-colors hover:bg-app-text/10"
  >
    <Icon className="h-3.5 w-3.5" />
    {children}
  </button>
);

/** One agenda row. Clicking a row with detail expands it in place. */
function AgendaRow({ event, index }: { event: AgendaEvent; index: number }) {
  const [open, setOpen] = useState(false);
  const expandable = !!(event.description || event.goal || event.task);

  return (
    <div style={{ marginTop: index === 0 ? 0 : 10 }}>
      <button
        type="button"
        onClick={expandable ? () => setOpen((v) => !v) : undefined}
        className={cn(
          'flex w-full items-center gap-3 rounded-[6px] px-2 py-1.5 text-left transition-colors',
          expandable ? 'cursor-pointer hover:bg-white/5' : 'cursor-default',
        )}
      >
        <span className="w-[115px] shrink-0 text-[13px] tabular-nums text-app-muted">
          {hhmm(event.start)}
          {event.end ? ` – ${hhmm(event.end)}` : ''}
        </span>
        <span className={cn('h-3.5 w-1 shrink-0 rounded-full', event.color ?? 'bg-app-border')} />
        <span className="min-w-0 flex-1 truncate text-[13px] text-app-text">{event.title}</span>
        {expandable && (
          <ChevronDown
            className={cn(
              'h-3.5 w-3.5 shrink-0 text-app-muted transition-transform',
              open && 'rotate-180',
            )}
          />
        )}
      </button>

      {open && (
        <div className="ml-[131px] mt-2 flex flex-col items-start gap-2">
          {event.description && (
            <p className="text-[12px] leading-relaxed text-app-muted">{event.description}</p>
          )}
          {(event.goal || event.task) && (
            <div className="flex flex-wrap items-center gap-2">
              {event.goal && <GoalRef title={event.goal.title} color={event.goal.color} />}
              {event.task && <TaskRef title={event.task} />}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * The narrative, rendered from runs rather than written as markup.
 *
 * Plain text is emitted straight into the paragraph rather than wrapped in a
 * span, so the prose wraps exactly as one continuous run would.
 */
function Briefing({ paragraphs }: { paragraphs: BriefingParagraph[] }) {
  return (
    <div className="space-y-4 text-[15px] leading-[1.8] text-app-text/80">
      {paragraphs.map((segments, p) => (
        <p key={p}>
          {segments.map((seg, i) => {
            if ('task' in seg) return <TaskRef key={i} title={seg.task} />;
            if ('goal' in seg) return <GoalRef key={i} title={seg.goal} color={seg.color} />;
            if ('person' in seg) return <PersonRef key={i} name={seg.person} />;
            return seg.text;
          })}
        </p>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const {
    waitingOnYou, preparedForYou, agenda, briefing, focusTime,
  } = useWorkspace().dashboard;

  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 px-5 pt-4">
        <Breadcrumb Icon={House} section="Dashboard" page="Daily Briefing" />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 app-scroll">
        <div className="mx-auto max-w-3xl">
          <div className="mb-7 flex items-center justify-between gap-4">
            <p className="font-sans text-[22px] font-semibold text-app-text">{todayLabel()}</p>
            <span className="flex items-center gap-1.5 text-[11px] text-app-muted">
              <Clock className="h-3.5 w-3.5" />
              {focusTime}
            </span>
          </div>

          {/* What matters today, with the goals and tasks it refers to linked
              inline rather than listed separately. */}
          <Briefing paragraphs={briefing} />

          <section className="mt-10">
            <SectionTitle>Waiting on you</SectionTitle>
            <div className="overflow-hidden rounded-[10px] border border-app-border">
              {waitingOnYou.map((item, i) => (
                <div
                  key={item.initials}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3',
                    i > 0 && 'border-t border-app-border-soft',
                  )}
                >
                  <Avatar initials={item.initials} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] text-app-text">{item.title}</p>
                    <p className="text-[12px] text-app-muted">{item.from} asked for your review</p>
                  </div>
                  {item.due && (
                    <span
                      className={cn(
                        'flex shrink-0 items-center gap-1 text-[11px]',
                        item.overdue ? 'font-medium text-red-400' : 'text-app-muted',
                      )}
                    >
                      <Clock className="h-3 w-3" />
                      {item.due}
                    </span>
                  )}
                  <ActionButton icon={Check}>Review</ActionButton>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-10">
            <SectionTitle>Prepared for you</SectionTitle>
            <div className="space-y-3">
              {preparedForYou.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[10px] border border-app-border bg-app-sunken p-4"
                >
                  <p className="text-[13px] font-medium text-app-text">{item.title}</p>
                  <p className="mt-1 text-[12px] leading-relaxed text-app-muted">{item.body}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {/* "Done" only appears where the suggestion is an action
                        that can actually be completed. */}
                    {item.canBeDone && <ActionButton icon={Check}>Done</ActionButton>}
                    <ActionButton icon={MessageSquare}>Discuss</ActionButton>
                    <ActionButton icon={X}>Discard</ActionButton>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-10 pb-4">
            <SectionTitle>The rest of the day</SectionTitle>
            <div className="rounded-[10px] border border-app-border p-2">
              {agenda.map((event, i) => (
                <AgendaRow key={event.id} event={event} index={i} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
