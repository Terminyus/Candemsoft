"use client";

import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";
import { pathFromSegments } from "@/i18n/routes";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/i18n/config";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/components/ui/cn";
import { LanguageSwitch } from "./LanguageSwitch";

export type NavItem = { key: string; label: string; href: string };

type Props = {
  lang: Locale;
  home: string;
  items: NavItem[];
  labels: { menu: string; close: string; switchTo: string; primary: string };
  extra?: React.ReactNode;
};

function isActive(pathname: string, href: string, home: string) {
  if (href === home) return pathname === home;
  return pathname === href || pathname.startsWith(href + "/");
}

export function Header({ lang, home, items, labels, extra }: Props) {
  // Not usePathname: during prerender it returns the rewritten internal path (/tr/...), which would
  // make the active state differ between server HTML and the browser.
  const pathname = pathFromSegments(lang, useSelectedLayoutSegments());
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const last = useRef(0);
  const menuButton = useRef<HTMLButtonElement>(null);

  // Hide while reading down, show on any upward scroll: gives long pages room without losing navigation.
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        setHidden(y > 240 && y > last.current + 4);
        if (y < last.current - 4 || y < 240) setHidden(false);
        last.current = y;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the menu after navigation (adjusting state during render, not in an effect).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      data-surface="ink"
      className={cn(
        "sticky top-0 z-50 border-b border-ink-800 transition-transform duration-(--duration-2) ease-(--ease-out)",
        hidden && !open && "-translate-y-full",
      )}
    >
      <div className="container-site flex h-(--header-h) items-center justify-between gap-6">
        <Link href={home} onClick={() => setOpen(false)} className="shrink-0" aria-label="Candemsoft">
          <Logo priority />
        </Link>

        <nav aria-label={labels.primary} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {items.map((item) => {
              const active = isActive(pathname, item.href, home);
              return (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative block px-3 py-2 text-[0.95rem] transition-colors duration-(--duration-1)",
                      active ? "text-paper-100" : "text-stone-400 hover:text-paper-100",
                    )}
                  >
                    {item.label}
                    {active && <span aria-hidden className="absolute inset-x-3 -bottom-px h-0.5 bg-signal" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-4">
          {extra}
          <LanguageSwitch lang={lang} label={labels.switchTo} className="hidden sm:inline-block" />
          <button
            ref={menuButton}
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
            className="-mr-2 flex min-h-11 items-center gap-2 px-2 font-mono text-mono-sm text-paper-100 lg:hidden"
          >
            <span aria-hidden className="relative block h-2.5 w-4">
              <span
                className={cn(
                  "absolute left-0 top-0 h-px w-4 bg-current transition-transform duration-(--duration-2)",
                  open && "translate-y-[5px] rotate-45",
                )}
              />
              <span
                className={cn(
                  "absolute bottom-0 left-0 h-px w-4 bg-current transition-transform duration-(--duration-2)",
                  open && "-translate-y-[4px] -rotate-45",
                )}
              />
            </span>
            {open ? labels.close : labels.menu}
          </button>
        </div>
      </div>

      {/* CSS-only menu animation keeps Motion out of the bundle every page loads. */}
      <div
        id="mobile-menu"
        data-surface="ink"
        data-open={open || undefined}
        inert={!open}
        className="mobile-menu fixed inset-x-0 bottom-0 top-(--header-h) overflow-y-auto lg:hidden"
      >
        <nav aria-label={labels.primary} className="container-site flex min-h-full flex-col justify-between py-8">
          <ul>
            {items.map((item, i) => (
              <li key={item.key} style={{ "--i": i } as React.CSSProperties} className="border-b border-ink-800">
                <Link
                  href={item.href}
                  // Close on every tap: a link to the current page doesn't change the path,
                  // which used to leave the menu open and the page scroll-locked.
                  onClick={() => setOpen(false)}
                  aria-current={isActive(pathname, item.href, home) ? "page" : undefined}
                  className="flex items-baseline gap-4 py-3 font-display text-[2.25rem] font-semibold leading-tight tracking-tight aria-[current=page]:text-signal"
                >
                  <span className="font-mono text-mono-sm font-normal text-stone-400">{String(i + 1).padStart(2, "0")}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <LanguageSwitch lang={lang} label={labels.switchTo} className="mt-8 self-start py-2 text-base" />
        </nav>
      </div>
    </header>
  );
}
