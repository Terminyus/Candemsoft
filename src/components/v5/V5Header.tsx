"use client";

import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { useSelectedLayoutSegments } from "next/navigation";
import { localeNames, locales, type Locale } from "@/i18n/config";
import { pathFromSegments, v5 } from "@/i18n/routes";
import { Logo } from "@/components/ui/Logo";

type Props = {
  lang: Locale;
  home: string;
  items: { key: string; label: string; href: string }[];
  contact: { email: string; phone: string; phoneHref: string };
  labels: { topbar: string; quote: string; quoteHref: string; menu: string; close: string; language: string; primary: string };
};

export function V5Header({ lang, home, items, contact, labels }: Props) {
  const segments = useSelectedLayoutSegments();
  const current = v5(pathFromSegments(lang, segments));
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const active = (h: string) => current === h || current.startsWith(h + "/");

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
    <span className="flex items-center gap-1 text-sm">
      {locales.map((l, i) => (
        <Fragment key={l}>
          {i > 0 && <span aria-hidden className="text-corp-line">|</span>}
          {l === lang ? (
            <span aria-current="true" className="font-semibold">
              {l.toLocaleUpperCase("en")}
            </span>
          ) : (
            <Link href={v5(pathFromSegments(l, segments))} hrefLang={l} lang={l} prefetch={false} onClick={close} aria-label={localeNames[l]} className="hover:text-ember">
              {l.toLocaleUpperCase("en")}
            </Link>
          )}
        </Fragment>
      ))}
    </span>
  );

  return (
    <>
      {/* Utility bar: how corporate sites put contact details one glance away. */}
      <div className="hidden bg-corp-ink text-sm text-white/85 md:block">
        <div className="container-site flex h-10 items-center justify-between gap-6">
          <span>{labels.topbar}</span>
          <span className="flex items-center gap-6">
            <a href={`tel:${contact.phoneHref}`} className="hover:text-white">
              {contact.phone}
            </a>
            <a href={`mailto:${contact.email}`} className="hover:text-white">
              {contact.email}
            </a>
            <span className="[&_a]:text-white/85 [&_a:hover]:text-white">{langs}</span>
          </span>
        </div>
      </div>
      <header className="sticky top-0 z-50 border-b border-corp-line bg-white/95 backdrop-blur">
        <div className="container-site flex h-(--header-h) items-center justify-between gap-6">
          <Link href={home} onClick={close} aria-label="Candemsoft" className="shrink-0">
            <Logo surface="paper" />
          </Link>
          <nav aria-label={labels.primary} className="hidden lg:block">
            <ul className="flex items-center gap-7 text-[0.95rem] font-medium">
              {items.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    aria-current={active(item.href) ? "page" : undefined}
                    className="relative py-6 text-corp-ink/80 transition-colors hover:text-corp-ink aria-[current=page]:text-corp-ink aria-[current=page]:after:absolute aria-[current=page]:after:inset-x-0 aria-[current=page]:after:-bottom-px aria-[current=page]:after:h-0.5 aria-[current=page]:after:bg-signal"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-3">
            <Link href={labels.quoteHref} className="hidden min-h-11 items-center rounded-lg bg-ember px-5 text-sm font-semibold text-white transition-colors hover:bg-corp-ink sm:inline-flex">
              {labels.quote}
            </Link>
            <button type="button" aria-expanded={open} aria-controls="v5-menu" onClick={() => setOpen((o) => !o)} className="-mr-2 min-h-11 px-2 text-sm font-semibold lg:hidden">
              {open ? labels.close : labels.menu}
            </button>
          </div>
        </div>
        <div id="v5-menu" data-open={open || undefined} inert={!open} className="mobile-menu fixed inset-x-0 bottom-0 top-(--header-h) overflow-y-auto bg-white lg:hidden">
          <nav aria-label={labels.primary} className="container-site flex min-h-full flex-col gap-8 py-6">
            <ul>
              {items.map((item, i) => (
                <li key={item.key} style={{ "--i": i } as React.CSSProperties} className="border-b border-corp-line">
                  <Link href={item.href} onClick={close} aria-current={active(item.href) ? "page" : undefined} className="block py-4 text-2xl font-bold aria-[current=page]:text-ember">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href={labels.quoteHref} onClick={close} className="flex min-h-12 items-center justify-center rounded-lg bg-ember font-semibold text-white">
              {labels.quote}
            </Link>
            <div className="space-y-2 text-corp-muted">
              <a href={`tel:${contact.phoneHref}`} className="block">
                {contact.phone}
              </a>
              <a href={`mailto:${contact.email}`} className="block">
                {contact.email}
              </a>
              <div className="pt-2 text-corp-ink">{langs}</div>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
