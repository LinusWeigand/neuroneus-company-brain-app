import { useState, type ReactNode } from 'react';
import { Check, ChevronDown, Clock, House, MessageSquare, Trash2 } from 'lucide-react';
import { Breadcrumb } from '../components/Breadcrumb';
import { cn, initials } from '../lib/utils';
import {
  agendaColor, agendaOffset, hhmm, todayLabel,
  type AgendaEvent, type BriefingParagraph,
} from '../features/dashboard/view';
import { useWorkspace } from '../lib/workspace';

const SectionTitle = ({ children }: { children: ReactNode }) => (
  <p className="mb-4 font-sans text-[15px] font-semibold text-app-text">{children}</p>
);

const Avatar = ({ initials }: { initials: string }) => (
  <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-app-text text-[9px] font-semibold text-[#121212]">
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

/**
 * One agenda row. Clicking a row with detail expands it in place; rows with
 * nothing behind them are inert and say so by not offering a chevron.
 */
function AgendaRow({ event, previous }: { event: AgendaEvent; previous?: AgendaEvent }) {
  const [open, setOpen] = useState(false);
  const expandable = !!(event.description || event.goal || event.task);

  return (
    <div style={{ marginTop: agendaOffset(event, previous) }}>
      <button
        type="button"
        onClick={expandable ? () => setOpen((v) => !v) : undefined}
        className={cn(
          'group flex w-full items-start gap-3 text-left',
          !expandable && 'cursor-default',
        )}
      >
        <span className="w-[104px] shrink-0 text-[13px] font-medium leading-[22px] tabular-nums text-app-muted">
          {hhmm(event.start)}
          {event.end ? ` – ${hhmm(event.end)}` : ''}
        </span>
        <span
          className={cn('mt-[3px] h-4 w-[3px] shrink-0 rounded-full', agendaColor(event.color))}
        />
        <span
          className={cn(
            'min-w-0 flex-1 truncate text-[14px] leading-[22px] text-app-text/85 transition-colors',
            expandable && 'group-hover:text-app-text',
          )}
        >
          {event.title}
        </span>
        {/* Reserved whether or not a chevron is drawn, so titles line up. */}
        <span className="w-4 shrink-0 pt-[3px]">
          {expandable && (
            <ChevronDown
              className={cn(
                'h-4 w-4 text-app-muted/50 transition-transform',
                open && 'rotate-180',
              )}
            />
          )}
        </span>
      </button>

      {open && (
        <div className="ml-[131px] mt-2 flex flex-col items-start gap-2">
          {event.description && (
            <p className="text-[14px] leading-relaxed text-app-muted">{event.description}</p>
          )}
          {(event.goal || event.task) && (
            <div className="flex max-w-full flex-col items-start gap-1.5 text-[14px]">
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
            <span className="flex items-center gap-1.5 text-[11px] text-app-muted/40">
              <Clock className="h-3 w-3" />
              {focusTime}
            </span>
          </div>

          {/* What matters today, with the goals and tasks it refers to linked
              inline rather than listed separately. */}
          <Briefing paragraphs={briefing} />

          <section className="mt-14">
            <SectionTitle>Waiting on you</SectionTitle>
            <div className="flex flex-col">
              {waitingOnYou.map((item) => (
                <div key={item.initials} className="flex items-center gap-3 py-2.5">
                  <Avatar initials={item.initials} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] text-app-text/85">{item.title}</p>
                    <p className="mt-0.5 text-[13px] text-app-muted/60">
                      {item.from} asked for your review
                    </p>
                  </div>
                  {/* Fixed width whether or not a deadline is shown, so the
                      Review buttons stay in one column. */}
                  <span className="flex w-[185px] shrink-0 items-baseline justify-end gap-1.5 text-[13px]">
                    {item.overdue && item.due && (
                      <>
                        <span className="text-app-muted">task deadline</span>
                        <span className="font-medium text-red-400">{item.due}</span>
                      </>
                    )}
                  </span>
                  <button
                    type="button"
                    className="inline-flex h-8 shrink-0 cursor-pointer items-center rounded-[6px] border border-app-border bg-app-bg px-3 text-[13px] font-medium text-app-text shadow-sm shadow-black/5 transition-colors hover:bg-app-text/10"
                  >
                    Review
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-14">
            <SectionTitle>Prepared for you</SectionTitle>
            <div className="flex flex-col gap-3">
              {preparedForYou.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-app-border bg-app-panel p-4"
                >
                  <h5 className="mb-1 font-sans text-[14px] font-semibold text-app-text">
                    {item.title}
                  </h5>
                  <p className="text-[14px] leading-relaxed text-app-text/85">{item.body}</p>
                  <div className="mt-3.5 flex items-center gap-2">
                    {/* "Done" only appears where the suggestion is an action
                        that can actually be completed. */}
                    {item.canBeDone && <ActionButton icon={Check}>Done</ActionButton>}
                    <ActionButton icon={MessageSquare}>Discuss</ActionButton>
                    <ActionButton icon={Trash2}>Discard</ActionButton>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-14 pb-4">
            <SectionTitle>The rest of the day</SectionTitle>
            <div className="flex flex-col">
              {agenda.map((event, i) => (
                <AgendaRow key={event.id} event={event} previous={agenda[i - 1]} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
