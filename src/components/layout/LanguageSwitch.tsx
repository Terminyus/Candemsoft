"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { switchLocalePath } from "@/i18n/routes";
import { cn } from "@/components/ui/cn";

export function LanguageSwitch({ lang, label, className }: { lang: Locale; label: string; className?: string }) {
  const pathname = usePathname();
  const target: Locale = lang === "tr" ? "en" : "tr";
  return (
    <Link
      href={switchLocalePath(pathname, lang, target)}
      hrefLang={target}
      lang={target}
      aria-label={label}
      className={cn("font-mono text-mono-sm transition-colors hover:text-signal", className)}
    >
      <span aria-hidden className={lang === "tr" ? "text-paper-100" : "text-stone-400"}>
        TR
      </span>
      <span aria-hidden className="px-1 text-ink-600">
        /
      </span>
      <span aria-hidden className={lang === "en" ? "text-paper-100" : "text-stone-400"}>
        EN
      </span>
    </Link>
  );
}
