import type { ReactNode } from "react";

export function V2PageHead({ kicker, title, lead, children }: { kicker: string; title: string; lead?: string; children?: ReactNode }) {
  return (
    <header className="border-b border-ink-950">
      <div className="container-site grid gap-8 pb-12 pt-[clamp(2.5rem,6vw,5rem)] lg:grid-cols-[1fr_minmax(0,28rem)] lg:items-end">
        <div>
          <p className="font-mono text-mono-sm text-stone-600">{kicker}</p>
          <h1 className="v2-display mt-5 text-[clamp(2.75rem,1.3rem+5.6vw,7rem)]">{title}</h1>
        </div>
        {lead && <p className="text-lead text-stone-600">{lead}</p>}
      </div>
      {children}
    </header>
  );
}
