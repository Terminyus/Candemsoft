"use client";

import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { useSelectedLayoutSegments } from "next/navigation";
import { localeNames, locales, type Locale } from "@/i18n/config";
import { pathFromSegments, v4 } from "@/i18n/routes";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/components/ui/cn";

type Props = {
  lang: Locale;
  home: string;
  items: { key: string; label: string; href: string }[];
  labels: { menu: string; close: string; language: string; primary: string; cta: string; ctaHref: string };
};

export function V4Header({ lang, home, items, labels }: Props) {
  const segments = useSelectedLayoutSegments();
  const current = v4(pathFromSegments(lang, segments));
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const active = (h: string) => current === h || current.startsWith(h + "/");
  const crumb = "~/candemsoft" + (segments.length ? "/" + segments.join("/") : "");

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

  const langs = (
    <span className="flex items-center gap-1 v4-mono text-xs">
      {locales.map((l, i) => (
        <Fragment key={l}>
          {i > 0 && <span aria-hidden className="text-dev-line">/</span>}
          {l === lang ? (
            <span aria-current="true" className="text-dev-text">
              {l}
            </span>
          ) : (
            <Link href={v4(pathFromSegments(l, segments))} hrefLang={l} lang={l} prefetch={false} aria-label={localeNames[l]} onClick={close} className="text-dev-muted hover:text-signal">
              {l}
            </Link>
          )}
        </Fragment>
      ))}
    </span>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-dev-line bg-dev-bg/90 backdrop-blur-md">
      <div aria-hidden className="v4-progress absolute inset-x-0 bottom-0 h-px bg-signal" />
      <div className="container-site flex h-(--header-h) items-center justify-between gap-6">
        <div className="flex min-w-0 items-center gap-4">
          <Link href={home} onClick={close} aria-label="Candemsoft" className="shrink-0">
            <Logo className="h-6 md:h-6" />
          </Link>
          <span className="hidden truncate v4-mono text-xs text-dev-comment xl:inline">{crumb}</span>
        </div>
        <nav aria-label={labels.primary} className="hidden lg:block">
          <ul className="flex items-center gap-1 v4-mono text-[0.82rem]">
            {items.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  aria-current={active(item.href) ? "page" : undefined}
                  className="rounded-md px-2.5 py-1.5 text-dev-muted transition-colors hover:bg-dev-surface hover:text-dev-text aria-[current=page]:text-signal"
                >
                  ./{item.label.toLocaleLowerCase(lang)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-4">
          <span className="hidden sm:block">{langs}</span>
          <Link href={labels.ctaHref} className="hidden min-h-9 items-center rounded-md bg-signal px-4 text-sm font-semibold text-dev-bg transition-transform hover:-translate-y-px md:inline-flex">
            {labels.cta}
          </Link>
          <button type="button" aria-expanded={open} aria-controls="v4-menu" onClick={() => setOpen((o) => !o)} className="-mr-2 min-h-11 px-2 v4-mono text-xs lg:hidden">
            {open ? labels.close : labels.menu}
          </button>
        </div>
      </div>
      <div id="v4-menu" data-open={open || undefined} inert={!open} className="mobile-menu fixed inset-x-0 bottom-0 top-(--header-h) overflow-y-auto bg-dev-bg lg:hidden">
        <nav aria-label={labels.primary} className="container-site flex min-h-full flex-col justify-between py-8">
          <ul>
            {items.map((item, i) => (
              <li key={item.key} style={{ "--i": i } as React.CSSProperties} className="border-b border-dev-line">
                <Link href={item.href} onClick={close} aria-current={active(item.href) ? "page" : undefined} className={cn("flex items-baseline gap-3 py-3 v4-title text-[2rem] aria-[current=page]:text-signal")}>
                  <span className="v4-mono text-xs font-normal text-dev-comment">0{i + 1}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8">{langs}</div>
        </nav>
      </div>
    </header>
  );
}
