"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { startTransition, useEffect, useRef, useState, ViewTransition, type PointerEvent } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { cn } from "@/components/ui/cn";

export type IndexItem = {
  slug: string;
  name: string;
  href: string;
  type: string;
  sector: string;
  categories: string[];
  host: string;
  desktop: string | null;
  own: boolean;
  offline: boolean;
};

type Labels = {
  filterLabel: string;
  all: string;
  categories: Record<string, string>;
  empty: string;
  emptyMobile: string;
  emptyMobileHref: string;
  ownProduct: string;
  offline: string;
  pending: string;
  colName: string;
  colType: string;
  colSector: string;
};

type ViewProps = { items: IndexItem[]; labels: Labels; filter: string; onFilter: (f: string) => void };

/**
 * Pointer-following preview. Eased with requestAnimationFrame and written straight to
 * `transform`, so it costs no React renders and no animation library.
 */
function Preview({ item, target }: { item: IndexItem | null; target: React.RefObject<{ x: number; y: number }> }) {
  const el = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [shown, setShown] = useState<IndexItem | null>(item);
  if (item && item !== shown) setShown(item);

  useEffect(() => {
    let frame = 0;
    const pos = { ...target.current };
    const tick = () => {
      const k = reduce ? 1 : 0.18;
      pos.x += (target.current.x - pos.x) * k;
      pos.y += (target.current.y - pos.y) * k;
      if (el.current) el.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, reduce]);

  return (
    <div
      ref={el}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-40 hidden w-[min(28vw,420px)] [@media(hover:hover)]:block"
    >
      <div
        data-visible={item ? "" : undefined}
        className="relative aspect-[16/10] -translate-x-1/2 -translate-y-1/2 scale-[0.96] overflow-hidden bg-ink-900 opacity-0 shadow-[0_24px_60px_-20px_rgba(14,13,11,0.5)] ring-1 ring-ink-800 transition-[opacity,scale] duration-(--duration-2) ease-(--ease-out) data-visible:scale-100 data-visible:opacity-100"
      >
        {shown?.desktop ? (
          <ViewTransition name={item ? `shot-${shown.slug}-desktop` : undefined} share="morph" default="none">
            <Image key={shown.slug} src={shown.desktop} alt="" fill sizes="420px" className="object-cover object-top" />
          </ViewTransition>
        ) : null}
      </div>
    </div>
  );
}

export function ProjectIndexView({ items, labels, filter, onFilter }: ViewProps) {
  const [hovered, setHovered] = useState<IndexItem | null>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const listRef = useRef<HTMLUListElement>(null);

  const count = (c: string) => (c === "all" ? items.length : items.filter((i) => i.categories.includes(c)).length);
  // Categories with no projects are hidden rather than offered as empty filters.
  const cats = Object.keys(labels.categories).filter((c) => count(c) > 0);
  const visible = items.filter((i) => filter === "all" || i.categories.includes(filter));
  const clientCount = visible.length;

  // The preview rides the right half of the list (over the secondary columns) and only
  // follows the pointer vertically, so it never covers the project names being read.
  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== "mouse" || !listRef.current) return;
    const rect = listRef.current.getBoundingClientRect();
    pointer.current.x = rect.left + rect.width * 0.74;
    pointer.current.y = e.clientY;
  };

  return (
    <div>
      <div
        role="group"
        aria-label={labels.filterLabel}
        // Single scrollable row: height stays fixed while the mono font swaps in (CLS).
        className="-mx-(--gutter) flex gap-2 overflow-x-auto whitespace-nowrap px-(--gutter) [scrollbar-width:none] lg:mx-0 lg:px-0"
      >
        {["all", ...cats].map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={filter === c}
            onClick={() => onFilter(c)}
            className={cn(
              "min-h-11 shrink-0 rounded-full border px-4 font-mono text-mono-sm transition-colors duration-(--duration-1)",
              filter === c
                ? "border-ink-950 bg-ink-950 text-paper-100"
                : "border-paper-200 text-stone-600 hover:border-ink-950 hover:text-ink-950",
            )}
          >
            {c === "all" ? labels.all : labels.categories[c]} <span className="tabular-nums">· {count(c)}</span>
          </button>
        ))}
      </div>

      <div className="mt-10 hidden grid-cols-12 gap-x-6 border-b border-ink-950 pb-3 font-mono text-mono-sm text-stone-600 lg:grid">
        <span className="col-span-1">#</span>
        <span className="col-span-5">{labels.colName}</span>
        <span className="col-span-3">{labels.colType}</span>
        <span className="col-span-3">{labels.colSector}</span>
      </div>

      <ul
        ref={listRef}
        onPointerMove={onMove}
        onPointerLeave={() => setHovered(null)}
        className="mt-6 lg:mt-0"
        aria-live="polite"
      >
        {/* Filter changes run in a transition; each row is its own view-transition group, so rows
            that stay slide to their new place and the rest fade (see globals.css "filter-row"). */}
        {visible.map((item, i) => (
          <ViewTransition
            key={item.slug}
            name={`row-${item.slug}`}
            share="filter-row"
            enter="filter-row"
            exit="filter-row"
            update="filter-row"
            default="none"
          >
            <li
              onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(item.desktop ? item : null)}
              className="group relative border-b border-paper-200"
            >
              <div className="grid grid-cols-4 items-baseline gap-x-6 gap-y-3 py-6 lg:grid-cols-12 lg:py-7">
                {item.desktop && (
                  <ViewTransition name={`shot-${item.slug}-desktop`} share="morph" default="none">
                    <div className="relative col-span-full aspect-[16/10] overflow-hidden bg-ink-900 lg:hidden">
                      <Image
                        src={item.desktop}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 1px, calc(100vw - 32px)"
                        {...(i === 0
                          ? { loading: "eager" as const, fetchPriority: "high" as const }
                          : { fetchPriority: "low" as const })}
                        className="object-cover object-top"
                      />
                    </div>
                  </ViewTransition>
                )}
                <span className="col-span-1 hidden font-mono text-mono-sm text-stone-600 transition-colors group-hover:text-ember lg:block">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="col-span-4 font-display-tight text-[clamp(1.75rem,1.2rem+2.4vw,3.5rem)] font-extrabold leading-none tracking-[-0.03em] transition-transform duration-(--duration-2) ease-(--ease-out) lg:col-span-5 lg:group-hover:translate-x-2">
                  <Link href={item.href} className="after:absolute after:inset-0">
                    {item.name}
                  </Link>
                </h2>
                <span className="col-span-2 text-stone-600 lg:col-span-3">
                  {item.type}
                  {item.own && <span className="block font-mono text-mono-sm text-ember">{labels.ownProduct}</span>}
                </span>
                <span className="col-span-2 font-mono text-mono-sm text-stone-600 lg:col-span-3">
                  {item.sector}
                  {item.offline && <span className="block">{labels.offline}</span>}
                </span>
              </div>
            </li>
          </ViewTransition>
        ))}
      </ul>

      {clientCount === 0 && (
        <p className="mt-8 max-w-xl text-stone-600">
          {labels.empty}{" "}
          {filter === "mobil" && (
            <Link href={labels.emptyMobileHref} className="text-ink-950 underline underline-offset-4">
              {labels.emptyMobile}
            </Link>
          )}
        </p>
      )}

      <Preview item={hovered} target={pointer} />
    </div>
  );
}

/** Reads ?kategori= on load and writes it back, so a filtered list can be shared. */
export function ProjectIndex(props: Omit<ViewProps, "filter" | "onFilter">) {
  const params = useSearchParams();
  const fromUrl = params.get("kategori");
  const [filter, setFilter] = useState(fromUrl && fromUrl in props.labels.categories ? fromUrl : "all");
  const onFilter = (f: string) => {
    // A React transition, so <ViewTransition> animates the rows.
    startTransition(() => setFilter(f));
    const url = new URL(window.location.href);
    if (f === "all") url.searchParams.delete("kategori");
    else url.searchParams.set("kategori", f);
    window.history.replaceState(null, "", url);
  };
  return <ProjectIndexView {...props} filter={filter} onFilter={onFilter} />;
}

/** Prerendered fallback: the full, unfiltered list (no URL access during static render). */
export function ProjectIndexStatic(props: Omit<ViewProps, "filter" | "onFilter">) {
  return <ProjectIndexView {...props} filter="all" onFilter={() => {}} />;
}
