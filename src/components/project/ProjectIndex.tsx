"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRef, useState, ViewTransition, type PointerEvent } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
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

const ease = [0.2, 0.8, 0.2, 1] as const;

function Preview({ item, x, y }: { item: IndexItem | null; x: ReturnType<typeof useSpring>; y: ReturnType<typeof useSpring> }) {
  return (
    <motion.div
      aria-hidden
      style={{ x, y }}
      className="pointer-events-none fixed left-0 top-0 z-40 hidden w-[min(28vw,420px)] [@media(hover:hover)]:block"
    >
      <AnimatePresence mode="popLayout">
        {item && (
          <motion.div
            key={item.slug}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.24, ease }}
            className="relative aspect-[16/10] -translate-x-1/2 -translate-y-1/2 overflow-hidden bg-ink-900 shadow-[0_24px_60px_-20px_rgba(14,13,11,0.5)] ring-1 ring-ink-800"
          >
            {item.desktop ? (
              <ViewTransition name={`shot-${item.slug}-desktop`} share="morph" default="none">
                <Image src={item.desktop} alt="" fill sizes="420px" className="object-cover object-top" />
              </ViewTransition>
            ) : (
              <span className="absolute left-3 top-3 font-mono text-mono-sm text-stone-400">{item.host}</span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function ProjectIndexView({ items, labels, filter, onFilter }: ViewProps) {
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState<IndexItem | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 400, damping: 40, mass: 0.6 });
  const y = useSpring(my, { stiffness: 400, damping: 40, mass: 0.6 });
  const listRef = useRef<HTMLUListElement>(null);

  const cats = Object.keys(labels.categories);
  const count = (c: string) => (c === "all" ? items.filter((i) => !i.own).length : items.filter((i) => i.categories.includes(c)).length);
  const visible = items.filter((i) => (filter === "all" ? !i.own : i.categories.includes(filter)));
  const clientCount = visible.filter((i) => !i.own).length;

  // The preview rides the right half of the list (over the secondary columns) and only
  // follows the pointer vertically, so it never covers the project names being read.
  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== "mouse" || !listRef.current) return;
    const rect = listRef.current.getBoundingClientRect();
    mx.set(rect.left + rect.width * 0.74);
    my.set(e.clientY);
  };

  return (
    <div>
      <div role="group" aria-label={labels.filterLabel} className="flex flex-wrap gap-2">
        {["all", ...cats].map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={filter === c}
            onClick={() => onFilter(c)}
            className={cn(
              "min-h-11 rounded-full border px-4 font-mono text-mono-sm transition-colors duration-(--duration-1)",
              filter === c
                ? "border-ink-950 bg-ink-950 text-paper-100"
                : "border-paper-200 text-stone-600 hover:border-ink-950 hover:text-ink-950",
            )}
          >
            {c === "all" ? labels.all : labels.categories[c]} <span className="opacity-60">{count(c)}</span>
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
        <AnimatePresence initial={false} mode="popLayout">
          {visible.map((item, i) => (
            <motion.li
              key={item.slug}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease }}
              onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(item.desktop ? item : null)}
              className="group relative border-b border-paper-200"
            >
              <div className="grid grid-cols-4 items-baseline gap-x-6 gap-y-3 py-6 lg:grid-cols-12 lg:py-7">
                {item.desktop && (
                  <ViewTransition name={`shot-${item.slug}-desktop`} share="morph" default="none">
                    <div className="relative col-span-full aspect-[16/10] overflow-hidden bg-ink-900 lg:hidden">
                      <Image src={item.desktop} alt="" fill sizes="100vw" {...(i === 0 ? { loading: "eager" as const, fetchPriority: "high" as const } : {})} className="object-cover object-top" />
                    </div>
                  </ViewTransition>
                )}
                <span className="col-span-1 hidden font-mono text-mono-sm text-stone-600 transition-colors group-hover:text-ember lg:block">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="col-span-4 font-display-tight text-[clamp(1.75rem,1.2rem+2.4vw,3.5rem)] font-semibold leading-none tracking-[-0.03em] transition-transform duration-(--duration-2) ease-(--ease-out) lg:col-span-5 lg:group-hover:translate-x-2">
                  <Link href={item.href} className="after:absolute after:inset-0">
                    {item.name}
                  </Link>
                </h2>
                <span className="col-span-2 text-stone-600 lg:col-span-3">
                  {item.own ? <span className="text-ember">{labels.ownProduct}</span> : item.type}
                </span>
                <span className="col-span-2 font-mono text-mono-sm text-stone-600 lg:col-span-3">
                  {item.sector}
                  {item.offline && <span className="block text-stone-600/80">{labels.offline}</span>}
                </span>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
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

      <Preview item={hovered} x={x} y={y} />
    </div>
  );
}

/** Reads/writes ?kategori= so a filtered list can be shared. */
export function ProjectIndex(props: Omit<ViewProps, "filter" | "onFilter">) {
  const params = useSearchParams();
  const fromUrl = params.get("kategori");
  const filter = fromUrl && fromUrl in props.labels.categories ? fromUrl : "all";
  const onFilter = (f: string) => {
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
