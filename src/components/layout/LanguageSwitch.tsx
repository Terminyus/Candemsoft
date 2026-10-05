"use client";

import Link from "next/link";
import { Fragment } from "react";
import { useSelectedLayoutSegments } from "next/navigation";
import { localeNames, locales, type Locale } from "@/i18n/config";
import { pathFromSegments } from "@/i18n/routes";
import { cn } from "@/components/ui/cn";

// Switching locale swaps the root layout (full load), so prefetching the other tree only produces failed segment requests.
export function LanguageSwitch({ lang, label, className }: { lang: Locale; label: string; className?: string }) {
  const segments = useSelectedLayoutSegments();
  return (
    <nav aria-label={label} className={cn("flex items-center font-mono text-mono-sm", className)}>
      {locales.map((l, i) => (
        <Fragment key={l}>
          {i > 0 && (
            <span aria-hidden className="px-1 text-ink-600">
              /
            </span>
          )}
          {l === lang ? (
            <span aria-current="true" title={localeNames[l]} className="text-paper-100">
              {l.toLocaleUpperCase("en")}
            </span>
          ) : (
            <Link
              href={pathFromSegments(l, segments)}
              hrefLang={l}
              lang={l}
              prefetch={false}
              title={localeNames[l]}
              aria-label={localeNames[l]}
              className="text-stone-400 transition-colors hover:text-signal"
            >
              {l.toLocaleUpperCase("en")}
            </Link>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
