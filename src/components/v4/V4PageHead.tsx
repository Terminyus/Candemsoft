import { Scramble } from "./fx/Scramble";

export function V4PageHead({ path, title, lead }: { path: string; title: string; lead?: string }) {
  return (
    <header className="border-b border-dev-line">
      <div className="container-site grid gap-6 pb-12 pt-[clamp(2.5rem,6vw,5rem)] lg:grid-cols-[1fr_minmax(0,26rem)] lg:items-end">
        <div>
          <p className="v4-mono text-sm text-dev-comment">{path}</p>
          <Scramble as="h1" text={title} className="v4-title mt-4 text-[clamp(2.4rem,1.3rem+4.6vw,5.5rem)]" />
        </div>
        {lead && <p className="text-lg text-dev-muted">{lead}</p>}
      </div>
    </header>
  );
}
