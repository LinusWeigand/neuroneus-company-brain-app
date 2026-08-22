import type { LucideIcon } from 'lucide-react';
import { Breadcrumb } from './Breadcrumb';

/** Placeholder for sections that exist in the nav but have no screen yet. */
export function ComingSoon({
  Icon, section, page, note,
}: {
  Icon: LucideIcon;
  section: string;
  page: string;
  note: string;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 px-5 pt-4">
        <Breadcrumb Icon={Icon} section={section} page={page} />
      </div>
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="max-w-sm text-center">
          <Icon className="mx-auto mb-3 h-8 w-8 text-app-muted/40" />
          <p className="text-sm font-medium text-app-text">{page}</p>
          <p className="mt-1 text-[13px] leading-relaxed text-app-muted">{note}</p>
        </div>
      </div>
    </div>
  );
}
