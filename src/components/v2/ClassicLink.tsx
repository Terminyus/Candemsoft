"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useSelectedLayoutSegments } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { pathFromSegments } from "@/i18n/routes";

/** The current page in the classic design (a different root layout, so a full load). */
export function ClassicLink({ lang, className, children }: { lang: Locale; className?: string; children: ReactNode }) {
  const segments = useSelectedLayoutSegments();
  return (
    <Link href={pathFromSegments(lang, segments)} prefetch={false} className={className}>
      {children}
    </Link>
  );
}
