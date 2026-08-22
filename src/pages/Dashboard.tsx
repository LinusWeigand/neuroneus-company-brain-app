import { useState, type ReactNode } from 'react';
import { Check, ChevronDown, Clock, House, MessageSquare, X } from 'lucide-react';
import { Breadcrumb } from '../components/Breadcrumb';
import { cn } from '../lib/utils';
import {
  AGENDA, FOCUS_TIME, PREPARED_FOR_YOU, WAITING_ON_YOU,
  hhmm, todayLabel, type AgendaEvent,
} from '../features/dashboard/data';

const SectionTitle = ({ children }: { children: ReactNode }) => (
  <p className="mb-4 font-sans text-[15px] font-semibold text-app-text">{children}</p>
);

const Avatar = ({ initials }: { initials: string }) => (
  <span className="flex size-[18px] shrink-0 items-center justify-center rounded-full border border-app-border bg-app-bg text-[8px] font-semibold text-app-text/80">
    {initials}
  </span>
);

/** Inline reference to a goal or task inside the narrative. */
const Ref = ({ children, color }: { children: ReactNode; color?: string }) => (
  <span
    className="rounded border px-1 py-0.5 text-[13px] leading-none"
    style={{ color: color ?? '#93b4d8', borderColor: `${color ?? '#93b4d8'}44` }}
  >
    {children}
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
              {event.goal && <Ref color={event.goal.color}>{event.goal.title}</Ref>}
              {event.task && <Ref>{event.task}</Ref>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
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
              {FOCUS_TIME}
            </span>
          </div>

          {/* The narrative: what matters today, with the goals and tasks it
              refers to linked inline rather than listed separately. */}
          <div className="space-y-4 text-[15px] leading-[1.8] text-app-text/80">
            <p>
              Northwind is the only thing on this week's critical path.{' '}
              <Ref>Finalize the Northwind pricing proposal</Ref> is due today, and nothing else on{' '}
              <Ref color="#60a5fa">Q3 revenue push</Ref> can move before those numbers are signed
              off. Sarah Kim has had the master agreement waiting on your countersignature since
              yesterday.
            </p>
            <p>
              <Ref color="#60a5fa">EU market expansion</Ref> hangs on one decision:{' '}
              <Ref>Review the Munich office lease</Ref> is due in two days, the broker is on the
              phone about it this afternoon, and that call is hard to reverse once the lease is
              countersigned.
            </p>
            <p>
              You closed <Ref>Website relaunch brief</Ref> yesterday, and Daniel Ross has taken the
              compliance paperwork off your plate.{' '}
              <Ref color="#60a5fa">Hiring: senior engineers</Ref> still has no tasks on it at all —
              it will not move on its own.
            </p>
          </div>

          <section className="mt-10">
            <SectionTitle>Waiting on you</SectionTitle>
            <div className="overflow-hidden rounded-[10px] border border-app-border">
              {WAITING_ON_YOU.map((item, i) => (
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
              {PREPARED_FOR_YOU.map((item) => (
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
              {AGENDA.map((event, i) => (
                <AgendaRow key={event.id} event={event} index={i} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
