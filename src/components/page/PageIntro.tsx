import type { ReactNode } from "react";
import { MonoLabel } from "@/components/ui/MonoLabel";

type Props = { label: string; title: string; lead?: string; aside?: ReactNode; id?: string };

/** Ink page opener shared by inner pages. Title left, lead pushed right: asymmetric by default. */
export function PageIntro({ label, title, lead, aside, id = "page-title" }: Props) {
  return (
    <section data-surface="ink" aria-labelledby={id}>
      <div className="container-site grid-site gap-y-8 pb-(--section-sm) pt-[clamp(3rem,6vw,6rem)]">
        <MonoLabel as="p" className="col-span-full">
          {label}
        </MonoLabel>
        <h1 id={id} className="col-span-full font-display-tight text-h1 font-semibold lg:col-span-9">
          {title}
        </h1>
        {lead && <p className="col-span-full text-lead text-stone-400 md:col-span-5 lg:col-span-5 lg:col-start-7">{lead}</p>}
        {aside && <div className="col-span-full">{aside}</div>}
      </div>
    </section>
  );
}
