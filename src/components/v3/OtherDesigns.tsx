"use client";

import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { pathFromSegments, v2 } from "@/i18n/routes";

/** The current page in the other two designs (different root layouts: full loads). */
export function OtherDesigns({ lang, label, classic, vitrin }: { lang: Locale; label: string; classic: string; vitrin: string }) {
  const path = pathFromSegments(lang, useSelectedLayoutSegments());
  return (
    <p className="v3-kicker">
      {label}:{" "}
      <Link href={path} prefetch={false} className="underline underline-offset-4 hover:text-ember">
        {classic}
      </Link>{" "}
      ·{" "}
      <Link href={v2(path)} prefetch={false} className="underline underline-offset-4 hover:text-ember">
        {vitrin}
      </Link>
    </p>
  );
}
