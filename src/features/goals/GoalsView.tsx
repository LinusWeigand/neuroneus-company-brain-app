/** Goals tab: one card per goal, recovered from the deployed prerender. */
export function GoalsView() {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(380px,1fr))] gap-4">
      <div className="group relative flex h-[210px] cursor-pointer flex-col overflow-hidden rounded-xl border border-[#3D3D3D] bg-[#2C2C2B] transition-all duration-200 hover:border-[#676765] hover:bg-[#242424]/10">
        <div className="flex items-start justify-between gap-3 px-5 pt-4">
          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex h-4 items-center gap-2">
              <span className="rounded border border-[#FAFAFA]/15 px-1.5 py-0.5 text-[11px] leading-none text-[#FAFAFA]/70">Sales</span>
              <span className="text-[11px] font-medium text-red-400">High</span>
            </div>
            <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-[#FAFAFA]">Q3 revenue push</h3>
            <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-[#8C8C8C]">Close Northwind and Ardent and lift recurring revenue 30% before the quarter ends.</p>
          </div>
          <span className="-mr-1 -mt-0.5 flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-[6px] text-[#8C8C8C] opacity-0 transition-opacity hover:bg-[#242424]/50 hover:text-[#FAFAFA] group-hover:opacity-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ellipsis-vertical h-3.5 w-3.5">
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </span>
        </div>
        <div className="mt-auto flex flex-col gap-2 px-5 pb-4 pt-3">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium" style={{ color: "rgb(96, 165, 250)" }}>In progress</span>
            <span className="text-[12px] tabular-nums text-[#8C8C8C]">5/12 tasks · 50%</span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-[#3D3D3D]">
            <div className="h-full rounded-full transition-all duration-300" style={{ width: "50%", background: "rgb(96, 165, 250)" }} />
          </div>
          <div className="mt-2 flex h-5 items-center justify-between">
            <div className="flex items-center gap-1.5 text-[12px]">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar h-3 w-3 shrink-0 text-[#8C8C8C]">
                <path d="M8 2v4" />
                <path d="M16 2v4" />
                <rect width="18" height="18" x="3" y="4" rx="2" />
                <path d="M3 10h18" />
              </svg>
              <span className="text-[#8C8C8C]">10/17/2026</span>
            </div>
            <div className="flex -space-x-1.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-[#2C2C2B] bg-[#FAFAFA]">
                <span className="text-[7px] font-semibold leading-none text-[#121212]">AM</span>
              </span>
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-[#2C2C2B] bg-[#FAFAFA]">
                <span className="text-[7px] font-semibold leading-none text-[#121212]">SK</span>
              </span>
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-[#2C2C2B] bg-[#FAFAFA]">
                <span className="text-[7px] font-semibold leading-none text-[#121212]">DR</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="group relative flex h-[210px] cursor-pointer flex-col overflow-hidden rounded-xl border border-[#3D3D3D] bg-[#2C2C2B] transition-all duration-200 hover:border-[#676765] hover:bg-[#242424]/10">
        <div className="flex items-start justify-between gap-3 px-5 pt-4">
          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex h-4 items-center gap-2">
              <span className="rounded border border-[#FAFAFA]/15 px-1.5 py-0.5 text-[11px] leading-none text-[#FAFAFA]/70">Operations</span>
              <span className="text-[11px] font-medium text-red-400">High</span>
            </div>
            <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-[#FAFAFA]">EU market expansion</h3>
            <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-[#8C8C8C]">Open the first EU office: legal entity, lease and the local hiring pipeline.</p>
          </div>
          <span className="-mr-1 -mt-0.5 flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-[6px] text-[#8C8C8C] opacity-0 transition-opacity hover:bg-[#242424]/50 hover:text-[#FAFAFA] group-hover:opacity-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ellipsis-vertical h-3.5 w-3.5">
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </span>
        </div>
        <div className="mt-auto flex flex-col gap-2 px-5 pb-4 pt-3">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium" style={{ color: "rgb(96, 165, 250)" }}>In progress</span>
            <span className="text-[12px] tabular-nums text-[#8C8C8C]">7/9 tasks · 83%</span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-[#3D3D3D]">
            <div className="h-full rounded-full transition-all duration-300" style={{ width: "83%", background: "rgb(96, 165, 250)" }} />
          </div>
          <div className="mt-2 flex h-5 items-center justify-between">
            <div className="flex items-center gap-1.5 text-[12px]">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar h-3 w-3 shrink-0 text-[#8C8C8C]">
                <path d="M8 2v4" />
                <path d="M16 2v4" />
                <rect width="18" height="18" x="3" y="4" rx="2" />
                <path d="M3 10h18" />
              </svg>
              <span className="text-[#8C8C8C]">09/02/2026</span>
            </div>
            <div className="flex -space-x-1.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-[#2C2C2B] bg-[#FAFAFA]">
                <span className="text-[7px] font-semibold leading-none text-[#121212]">AM</span>
              </span>
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-[#2C2C2B] bg-[#FAFAFA]">
                <span className="text-[7px] font-semibold leading-none text-[#121212]">EC</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="group relative flex h-[210px] cursor-pointer flex-col overflow-hidden rounded-xl border border-[#3D3D3D] bg-[#2C2C2B] transition-all duration-200 hover:border-[#676765] hover:bg-[#242424]/10">
        <div className="flex items-start justify-between gap-3 px-5 pt-4">
          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex h-4 items-center gap-2">
              <span className="rounded border border-[#FAFAFA]/15 px-1.5 py-0.5 text-[11px] leading-none text-[#FAFAFA]/70">People</span>
              <span className="text-[11px] font-medium text-blue-400">Medium</span>
            </div>
            <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-[#FAFAFA]">Hiring: senior engineers</h3>
            <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-[#8C8C8C]">Three senior hires for the platform team before the January roadmap starts.</p>
          </div>
          <span className="-mr-1 -mt-0.5 flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-[6px] text-[#8C8C8C] opacity-0 transition-opacity hover:bg-[#242424]/50 hover:text-[#FAFAFA] group-hover:opacity-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ellipsis-vertical h-3.5 w-3.5">
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </span>
        </div>
        <div className="mt-auto flex flex-col gap-2 px-5 pb-4 pt-3">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium" style={{ color: "rgb(113, 113, 122)" }}>Not started</span>
            <span className="text-[12px] tabular-nums text-[#8C8C8C]">No tasks</span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-[#3D3D3D]">
            <div className="h-full rounded-full transition-all duration-300" style={{ width: "0%", background: "rgb(113, 113, 122)" }} />
          </div>
          <div className="mt-2 flex h-5 items-center justify-between">
            <div className="flex items-center gap-1.5 text-[12px]" />
            <div className="flex -space-x-1.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-[#2C2C2B] bg-[#FAFAFA]">
                <span className="text-[7px] font-semibold leading-none text-[#121212]">AM</span>
              </span>
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-[#2C2C2B] bg-[#FAFAFA]">
                <span className="text-[7px] font-semibold leading-none text-[#121212]">RP</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="group relative flex h-[210px] cursor-pointer flex-col overflow-hidden rounded-xl border border-[#3D3D3D] bg-[#2C2C2B] transition-all duration-200 hover:border-[#676765] hover:bg-[#242424]/10">
        <div className="flex items-start justify-between gap-3 px-5 pt-4">
          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex h-4 items-center gap-2">
              <span className="rounded border border-[#FAFAFA]/15 px-1.5 py-0.5 text-[11px] leading-none text-[#FAFAFA]/70">Marketing</span>
              <span className="text-[11px] font-medium text-blue-400">Medium</span>
            </div>
            <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-[#FAFAFA]">Website relaunch</h3>
            <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-[#8C8C8C]">New positioning, new site — live before the revenue push needs landing pages.</p>
          </div>
          <span className="-mr-1 -mt-0.5 flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-[6px] text-[#8C8C8C] opacity-0 transition-opacity hover:bg-[#242424]/50 hover:text-[#FAFAFA] group-hover:opacity-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ellipsis-vertical h-3.5 w-3.5">
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </span>
        </div>
        <div className="mt-auto flex flex-col gap-2 px-5 pb-4 pt-3">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium" style={{ color: "rgb(96, 165, 250)" }}>In progress</span>
            <span className="text-[12px] tabular-nums text-[#8C8C8C]">9/14 tasks · 68%</span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-[#3D3D3D]">
            <div className="h-full rounded-full transition-all duration-300" style={{ width: "68%", background: "rgb(96, 165, 250)" }} />
          </div>
          <div className="mt-2 flex h-5 items-center justify-between">
            <div className="flex items-center gap-1.5 text-[12px]">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar h-3 w-3 shrink-0 text-[#8C8C8C]">
                <path d="M8 2v4" />
                <path d="M16 2v4" />
                <rect width="18" height="18" x="3" y="4" rx="2" />
                <path d="M3 10h18" />
              </svg>
              <span className="text-[#8C8C8C]">08/18/2026</span>
            </div>
            <div className="flex -space-x-1.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-[#2C2C2B] bg-[#FAFAFA]">
                <span className="text-[7px] font-semibold leading-none text-[#121212]">DR</span>
              </span>
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-[#2C2C2B] bg-[#FAFAFA]">
                <span className="text-[7px] font-semibold leading-none text-[#121212]">AM</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="group relative flex h-[210px] cursor-pointer flex-col overflow-hidden rounded-xl border border-[#3D3D3D] bg-[#2C2C2B] transition-all duration-200 hover:border-[#676765] hover:bg-[#242424]/10">
        <div className="flex items-start justify-between gap-3 px-5 pt-4">
          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex h-4 items-center gap-2">
              <span className="rounded border border-[#FAFAFA]/15 px-1.5 py-0.5 text-[11px] leading-none text-[#FAFAFA]/70">Partnerships</span>
              <span className="text-[11px] font-medium text-slate-400">Low</span>
            </div>
            <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-[#FAFAFA]">Partner program launch</h3>
            <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-[#8C8C8C]">Stand up the reseller tier: deck, pricing and the first five signed partners.</p>
          </div>
          <span className="-mr-1 -mt-0.5 flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-[6px] text-[#8C8C8C] opacity-0 transition-opacity hover:bg-[#242424]/50 hover:text-[#FAFAFA] group-hover:opacity-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ellipsis-vertical h-3.5 w-3.5">
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </span>
        </div>
        <div className="mt-auto flex flex-col gap-2 px-5 pb-4 pt-3">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium" style={{ color: "rgb(113, 113, 122)" }}>Backlog</span>
            <span className="text-[12px] tabular-nums text-[#8C8C8C]">2/6 tasks · 42%</span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-[#3D3D3D]">
            <div className="h-full rounded-full transition-all duration-300" style={{ width: "42%", background: "rgb(113, 113, 122)" }} />
          </div>
          <div className="mt-2 flex h-5 items-center justify-between">
            <div className="flex items-center gap-1.5 text-[12px]">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar h-3 w-3 shrink-0 text-[#8C8C8C]">
                <path d="M8 2v4" />
                <path d="M16 2v4" />
                <rect width="18" height="18" x="3" y="4" rx="2" />
                <path d="M3 10h18" />
              </svg>
              <span className="text-[#8C8C8C]">08/11/2026</span>
            </div>
            <div className="flex -space-x-1.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-[#2C2C2B] bg-[#FAFAFA]">
                <span className="text-[7px] font-semibold leading-none text-[#121212]">DR</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="group relative flex h-[210px] cursor-pointer flex-col overflow-hidden rounded-xl border border-[#3D3D3D] bg-[#2C2C2B] transition-all duration-200 hover:border-[#676765] hover:bg-[#242424]/10">
        <div className="flex items-start justify-between gap-3 px-5 pt-4">
          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex h-4 items-center gap-2">
              <span className="rounded border border-[#FAFAFA]/15 px-1.5 py-0.5 text-[11px] leading-none text-[#FAFAFA]/70">Legal</span>
              <span className="text-[11px] font-medium text-blue-400">Medium</span>
            </div>
            <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-[#FAFAFA]">Compliance: SOC 2 audit</h3>
            <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-[#8C8C8C]">Evidence collection and the auditor walkthrough for the Type II report.</p>
          </div>
          <span className="-mr-1 -mt-0.5 flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-[6px] text-[#8C8C8C] opacity-0 transition-opacity hover:bg-[#242424]/50 hover:text-[#FAFAFA] group-hover:opacity-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ellipsis-vertical h-3.5 w-3.5">
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </span>
        </div>
        <div className="mt-auto flex flex-col gap-2 px-5 pb-4 pt-3">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium" style={{ color: "rgb(96, 165, 250)" }}>In progress</span>
            <span className="text-[12px] tabular-nums text-[#8C8C8C]">4/10 tasks · 45%</span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-[#3D3D3D]">
            <div className="h-full rounded-full transition-all duration-300" style={{ width: "45%", background: "rgb(96, 165, 250)" }} />
          </div>
          <div className="mt-2 flex h-5 items-center justify-between">
            <div className="flex items-center gap-1.5 text-[12px]">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar h-3 w-3 shrink-0 text-[#8C8C8C]">
                <path d="M8 2v4" />
                <path d="M16 2v4" />
                <rect width="18" height="18" x="3" y="4" rx="2" />
                <path d="M3 10h18" />
              </svg>
              <span className="text-[#8C8C8C]">10/27/2026</span>
            </div>
            <div className="flex -space-x-1.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-[#2C2C2B] bg-[#FAFAFA]">
                <span className="text-[7px] font-semibold leading-none text-[#121212]">EC</span>
              </span>
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-[#2C2C2B] bg-[#FAFAFA]">
                <span className="text-[7px] font-semibold leading-none text-[#121212]">DR</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="group relative flex h-[210px] cursor-pointer flex-col overflow-hidden rounded-xl border border-[#3D3D3D] bg-[#2C2C2B] transition-all duration-200 hover:border-[#676765] hover:bg-[#242424]/10">
        <div className="flex items-start justify-between gap-3 px-5 pt-4">
          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex h-4 items-center gap-2">
              <span className="rounded border border-[#FAFAFA]/15 px-1.5 py-0.5 text-[11px] leading-none text-[#FAFAFA]/70">Engineering</span>
              <span className="text-[11px] font-medium text-red-400">High</span>
            </div>
            <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-[#FAFAFA]">Data platform migration</h3>
            <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-[#8C8C8C]">One warehouse instead of four pipelines — the metering the usage caps are billed on.</p>
          </div>
          <span className="-mr-1 -mt-0.5 flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-[6px] text-[#8C8C8C] opacity-0 transition-opacity hover:bg-[#242424]/50 hover:text-[#FAFAFA] group-hover:opacity-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ellipsis-vertical h-3.5 w-3.5">
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </span>
        </div>
        <div className="mt-auto flex flex-col gap-2 px-5 pb-4 pt-3">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium" style={{ color: "rgb(96, 165, 250)" }}>In progress</span>
            <span className="text-[12px] tabular-nums text-[#8C8C8C]">6/11 tasks · 55%</span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-[#3D3D3D]">
            <div className="h-full rounded-full transition-all duration-300" style={{ width: "55%", background: "rgb(96, 165, 250)" }} />
          </div>
          <div className="mt-2 flex h-5 items-center justify-between">
            <div className="flex items-center gap-1.5 text-[12px]">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar h-3 w-3 shrink-0 text-[#8C8C8C]">
                <path d="M8 2v4" />
                <path d="M16 2v4" />
                <rect width="18" height="18" x="3" y="4" rx="2" />
                <path d="M3 10h18" />
              </svg>
              <span className="text-[#8C8C8C]">08/24/2026</span>
            </div>
            <div className="flex -space-x-1.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-[#2C2C2B] bg-[#FAFAFA]">
                <span className="text-[7px] font-semibold leading-none text-[#121212]">RP</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
