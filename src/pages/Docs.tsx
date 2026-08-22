import { useState } from 'react';
import { FolderOpen, Plus, Search } from 'lucide-react';
import { Breadcrumb } from '../components/Breadcrumb';
import { KnowledgeGraph } from '../features/docs/KnowledgeGraph';
import { ROOT_ENTRIES, SUBPAGE_COUNT, preview, typeInfo } from '../features/docs/data';

export default function Docs() {
  const [query, setQuery] = useState('');

  const entries = ROOT_ENTRIES.filter((e) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return e.title.toLowerCase().includes(q) || e.content.toLowerCase().includes(q);
  });

  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 px-5 pt-4">
        <Breadcrumb Icon={FolderOpen} section="Docs" page="Knowledge" />
      </div>

      <div className="flex min-h-0 flex-1 gap-4 px-4 pb-4 pt-4">
        {/* The graph is the map of the knowledge base; the list is the index.
            Both stay visible so a link you notice in one is findable in the other. */}
        <div className="hidden w-[340px] shrink-0 xl:block">
          <KnowledgeGraph />
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="mb-4 flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-app-muted" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search knowledge…"
                className="h-9 w-full rounded-[6px] border border-app-border bg-app-bg pl-10 pr-3 text-sm text-app-text outline-none transition-colors placeholder:text-app-muted hover:border-app-muted/40 focus:border-app-muted/60"
              />
            </div>
            <button
              type="button"
              className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-[6px] bg-white px-4 text-sm font-medium text-zinc-900 transition-opacity hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              New Entry
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto pr-1 app-scroll">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {entries.map((entry) => {
                const { label, color } = typeInfo(entry.type);
                const children = SUBPAGE_COUNT.get(entry.id) ?? 0;
                return (
                  <div
                    key={entry.id}
                    className="group flex cursor-pointer flex-col rounded-lg border border-app-border bg-app-panel p-4 transition-colors hover:border-app-muted/40"
                  >
                    <div className="mb-1.5 flex items-center gap-2">
                      <h3 className="min-w-0 flex-1 truncate text-[15px] font-medium text-app-text">
                        {entry.title}
                      </h3>
                      <span
                        className="inline-flex shrink-0 items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] leading-none"
                        style={{ color, borderColor: `${color}55` }}
                      >
                        {label}
                      </span>
                      {children > 0 && (
                        <span className="shrink-0 text-[10px] tabular-nums text-app-muted">
                          {children}
                        </span>
                      )}
                    </div>
                    <p className="line-clamp-3 text-[12px] leading-relaxed text-app-muted">
                      {preview(entry.content, 160)}
                    </p>
                  </div>
                );
              })}
            </div>
            {entries.length === 0 && (
              <p className="py-12 text-center text-sm text-app-muted">
                Nothing matches “{query}”.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
