import type { LucideIcon } from 'lucide-react';
import { ChevronRight } from 'lucide-react';

/** Section > page trail, rendered at the top of each screen. */
export function Breadcrumb({
  Icon, section, page,
}: {
  Icon: LucideIcon;
  section: string;
  page: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-1.5 text-[13px]">
      <Icon className="h-3.5 w-3.5 shrink-0 text-app-muted" />
      <span className="cursor-pointer truncate text-app-muted transition-colors hover:text-app-text">
        {section}
      </span>
      <ChevronRight className="h-3.5 w-3.5 shrink-0 text-app-muted/50" />
      <span className="truncate text-app-text">{page}</span>
    </div>
  );
}
