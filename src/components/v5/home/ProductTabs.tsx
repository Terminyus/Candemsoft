"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { cn } from "@/components/ui/cn";

export type TabProduct = {
  slug: string;
  name: string;
  icon: string | null;
  tagline: string;
  description: string;
  features: string[];
  links: { label: string; href: string }[];
  shot: string | null;
  shotAlt: string;
  color: string; // the app's own brand colour
  soon: boolean;
  soonLabel: string;
};

/** WAI-ARIA tabs: one product per panel, each panel tinted in that app's own colour (from Vitrin). */
export function ProductTabs({ products, label }: { products: TabProduct[]; label: string }) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  // Footer and shelf links point at #slug: open that product's tab.
  useEffect(() => {
    const sync = () => {
      const i = products.findIndex((p) => `#${p.slug}` === window.location.hash);
      if (i < 0) return;
      setActive(i);
      root.current?.scrollIntoView({ block: "start" });
    };
    const raf = requestAnimationFrame(sync);
    window.addEventListener("hashchange", sync);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("hashchange", sync);
    };
  }, [products]);
  const onKey = (e: KeyboardEvent, i: number) => {
    const n = products.length;
    const next = e.key === "ArrowRight" ? (i + 1) % n : e.key === "ArrowLeft" ? (i - 1 + n) % n : e.key === "Home" ? 0 : e.key === "End" ? n - 1 : -1;
    if (next < 0) return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };
  return (
    <div ref={root} className="scroll-mt-28">
      <div role="tablist" aria-label={label} className="-mx-(--gutter) flex gap-2 overflow-x-auto px-(--gutter) pb-2 [scrollbar-width:none] lg:mx-0 lg:px-0">
        {products.map((p, i) => (
          <button
            key={p.slug}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            role="tab"
            id={`${id}-t-${p.slug}`}
            aria-selected={active === i}
            aria-controls={`${id}-p-${p.slug}`}
            tabIndex={active === i ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => onKey(e, i)}
            className={cn(
              "flex min-h-12 shrink-0 items-center gap-3 rounded-xl border px-4 text-left font-semibold transition-colors",
              active === i ? "border-corp-ink bg-corp-ink text-white" : "border-corp-line bg-white hover:border-corp-ink/40",
            )}
          >
            {p.icon ? (
              <span className="relative size-7 overflow-hidden rounded-md bg-white">
                <Image src={p.icon} alt="" fill sizes="28px" className="object-contain" />
              </span>
            ) : (
              <span aria-hidden className="grid size-7 place-items-center rounded-md bg-signal text-xs font-bold text-corp-ink">
                {p.name[0]}
              </span>
            )}
            {p.name}
          </button>
        ))}
      </div>
      {products.map((p, i) => (
        <div
          key={p.slug}
          role="tabpanel"
          id={`${id}-p-${p.slug}`}
          aria-labelledby={`${id}-t-${p.slug}`}
          hidden={active !== i}
          className="mt-6 overflow-hidden rounded-2xl border border-corp-line"
          style={{ background: `linear-gradient(0deg, ${p.color}0d, ${p.color}0d), #fff` }}
        >
          <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[1.3fr_1fr] lg:items-center">
            <div>
              <span className="inline-block h-1.5 w-12 rounded-full" style={{ background: p.color }} />
              <h3 className="v5-title mt-4 text-[clamp(1.75rem,1.3rem+1.8vw,2.75rem)]">{p.tagline}</h3>
              <p className="mt-4 text-lg text-corp-muted">{p.description}</p>
              {p.soon && <p className="mt-4 inline-block rounded-full bg-corp-soft px-3 py-1 text-sm font-semibold">{p.soonLabel}</p>}
              {p.features.length > 0 && (
                <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden className="mt-0.5 shrink-0" style={{ color: p.color }}>
                        <path d="M5 10.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
              )}
              {p.links.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-3">
                  {p.links.map((l, j) => (
                    <a
                      key={l.href}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn("inline-flex min-h-11 items-center rounded-lg px-5 text-sm font-semibold", j === 0 ? "bg-corp-ink text-white hover:bg-ember" : "border border-corp-line bg-white hover:border-corp-ink")}
                    >
                      {l.label} ↗
                    </a>
                  ))}
                </div>
              )}
            </div>
            {p.shot && (
              <div className="relative mx-auto aspect-[9/16] w-52 overflow-hidden rounded-[2rem] border-[6px] border-corp-ink shadow-2xl sm:w-60">
                <Image src={p.shot} alt={p.shotAlt} fill sizes="240px" className="object-cover object-top" />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
