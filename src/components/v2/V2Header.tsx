"use client";

import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { useSelectedLayoutSegments } from "next/navigation";
import { localeNames, locales, type Locale } from "@/i18n/config";
import { pathFromSegments, v2 } from "@/i18n/routes";
import { v2Root } from "@/lib/static";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/components/ui/cn";

type Item = { key: string; label: string; href: string };
type Props = {
  lang: Locale;
  home: string;
  items: Item[];
  labels: { menu: string; close: string; language: string; primary: string; classic: string; contact: string; contactHref: string };
};

function Languages({ lang, label, className }: { lang: Locale; label: string; className?: string }) {
  const segments = useSelectedLayoutSegments();
  return (
    <nav aria-label={label} className={cn("flex items-center font-mono text-mono-sm", className)}>
      {locales.map((l, i) => (
        <Fragment key={l}>
          {i > 0 && <span aria-hidden className="px-1 text-stone-400">/</span>}
          {l === lang ? (
            <span aria-current="true" className="font-semibold text-ink-950">
              {l.toLocaleUpperCase("en")}
            </span>
          ) : (
            <Link
              href={v2(pathFromSegments(l, segments))}
              hrefLang={l}
              lang={l}
              prefetch={false}
              aria-label={localeNames[l]}
              className="text-stone-600 hover:text-ember"
            >
              {l.toLocaleUpperCase("en")}
            </Link>
          )}
        </Fragment>
      ))}
    </nav>
  );
}

export function V2Header({ lang, home, items, labels }: Props) {
  const segments = useSelectedLayoutSegments();
  const current = v2(pathFromSegments(lang, segments));
  // Same page in the classic design (different root layout, so a full navigation).
  const classicHref = pathFromSegments(lang, segments);
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const active = (h: string) => current === h || current.startsWith(h + "/");

  return (
    <header className="sticky top-0 z-50 border-b border-ink-950 bg-white">
      <div className="container-site flex h-(--header-h) items-center justify-between gap-6">
        <Link href={home} onClick={close} aria-label="Candemsoft" className="shrink-0">
          <Logo surface="paper" />
        </Link>
        <nav aria-label={labels.primary} className="hidden lg:block">
          <ul className="flex items-center gap-7 font-archivo text-[0.95rem] font-medium">
            {items.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  aria-current={active(item.href) ? "page" : undefined}
                  className="relative py-2 hover:text-ember aria-[current=page]:text-ember"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-5">
          <Languages lang={lang} label={labels.language} className="hidden sm:flex" />
          <Link
            href={labels.contactHref}
            className="hidden min-h-10 items-center rounded-full bg-ink-950 px-5 font-archivo text-sm font-semibold text-white transition-colors hover:bg-signal hover:text-ink-950 md:inline-flex"
          >
            {labels.contact}
          </Link>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="v2-menu"
            onClick={() => setOpen((o) => !o)}
            className="-mr-2 min-h-11 px-2 font-mono text-mono-sm lg:hidden"
          >
            {open ? labels.close : labels.menu}
          </button>
        </div>
      </div>

      <div
        id="v2-menu"
        data-open={open || undefined}
        inert={!open}
        className="mobile-menu fixed inset-x-0 bottom-0 top-(--header-h) overflow-y-auto bg-white lg:hidden"
      >
        <nav aria-label={labels.primary} className="container-site flex min-h-full flex-col justify-between py-8">
          <ul>
            {items.map((item, i) => (
              <li key={item.key} style={{ "--i": i } as React.CSSProperties} className="border-b border-ink-950">
                <Link href={item.href} onClick={close} className="block py-3 v2-heading text-[2.25rem] aria-[current=page]:text-ember" aria-current={active(item.href) ? "page" : undefined}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex items-center justify-between gap-4">
            <Languages lang={lang} label={labels.language} className="text-base" />
            {!v2Root && (
              <Link href={classicHref} prefetch={false} className="font-mono text-mono-sm text-stone-600 underline underline-offset-4">
                {labels.classic}
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
