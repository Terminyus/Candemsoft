"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { useSelectedLayoutSegments } from "next/navigation";
import { localeNames, locales, type Locale } from "@/i18n/config";
import { pathFromSegments, v3 } from "@/i18n/routes";
import mark from "../../../public/brand/mark.png";

type Props = {
  lang: Locale;
  home: string;
  date: string;
  items: { key: string; label: string; href: string }[];
  t: { issue: string; price: string; edition: string; motto: string; est: string; print: string; primary: string };
};

export function V3Header({ lang, home, date, items, t }: Props) {
  const segments = useSelectedLayoutSegments();
  const current = v3(pathFromSegments(lang, segments));
  const active = (h: string) => current === h || current.startsWith(h + "/");
  return (
    <>
      <header className="container-site pt-4">
        {/* Dateline */}
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-news-ink pb-2 v3-kicker">
          <span>
            {t.issue} · <time>{date}</time>
          </span>
          <span className="flex items-center gap-4">
            <span>{t.price}</span>
            <span className="flex items-center gap-1" aria-label={t.edition}>
              <span className="hidden sm:inline">{t.edition}:</span>
              {locales.map((l, i) => (
                <Fragment key={l}>
                  {i > 0 && <span aria-hidden>·</span>}
                  {l === lang ? (
                    <span aria-current="true" className="underline decoration-signal decoration-2 underline-offset-4">
                      {l.toLocaleUpperCase("en")}
                    </span>
                  ) : (
                    <Link href={v3(pathFromSegments(l, segments))} hrefLang={l} lang={l} prefetch={false} aria-label={localeNames[l]} className="hover:text-ember">
                      {l.toLocaleUpperCase("en")}
                    </Link>
                  )}
                </Fragment>
              ))}
            </span>
            <button type="button" onClick={() => window.print()} className="v3-noprint hidden underline underline-offset-4 hover:text-ember md:inline">
              {t.print}
            </button>
          </span>
        </div>

        {/* Masthead */}
        <Link href={home} className="group flex items-center justify-center gap-[0.18em] py-5 text-[clamp(2.75rem,1rem+8vw,8.5rem)] sm:py-7">
          <Image src={mark} alt="" priority className="h-[0.62em] w-auto" />
          <span className="v3-headline leading-none tracking-[-0.035em]">
            Candemsoft<span className="text-signal">.</span>
          </span>
        </Link>

        {/* Motto between double rules */}
        <p className="flex flex-wrap items-center justify-center gap-x-4 border-y-[3px] border-double border-news-ink py-2 text-center italic">
          <span>{t.motto}</span>
          <span aria-hidden className="hidden sm:inline">
            ·
          </span>
          <span>{t.est}</span>
        </p>
      </header>

      {/* Section bar: sticky, one scrollable line on phones, no hamburger. */}
      <nav aria-label={t.primary} className="v3-noprint sticky top-0 z-40 border-b border-news-ink bg-news-paper/95 backdrop-blur-[2px]">
        <ul className="container-site flex gap-6 overflow-x-auto whitespace-nowrap py-3 v3-kicker [scrollbar-width:none] md:justify-center">
          {items.map((item) => (
            <li key={item.key}>
              <Link
                href={item.href}
                aria-current={active(item.href) ? "page" : undefined}
                className="hover:text-ember aria-[current=page]:text-ember aria-[current=page]:underline aria-[current=page]:decoration-2 aria-[current=page]:underline-offset-4"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
