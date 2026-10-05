"use client";

import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";
import { Fragment } from "react";
import type { Locale } from "@/i18n/config";
import { pathFromSegments, v2, v3, v4, v5 } from "@/i18n/routes";
import type { Dictionary } from "@/lib/dictionary";

type Site = "v1" | "v2" | "v3" | "v4" | "v5";

/** The current page in every other design (different root layouts: full loads). */
export function OtherDesigns({ lang, current, t, className = "v3-kicker" }: { lang: Locale; current: Site; t: Dictionary["v3"]; className?: string }) {
  const path = pathFromSegments(lang, useSelectedLayoutSegments());
  const designs = [
    { site: "v1", name: t.classic, href: path },
    { site: "v2", name: t.vitrin, href: v2(path) },
    { site: "v3", name: t.gazete, href: v3(path) },
    { site: "v4", name: t.derleme, href: v4(path) },
    { site: "v5", name: t.kurumsal, href: v5(path) },
  ].filter((d) => d.site !== current);
  return (
    <p className={className}>
      {t.otherDesigns}:{" "}
      {designs.map((d, i) => (
        <Fragment key={d.site}>
          {i > 0 && " · "}
          <Link href={d.href} prefetch={false} className="underline underline-offset-4 hover:text-ember">
            {d.name}
          </Link>
        </Fragment>
      ))}
    </p>
  );
}
