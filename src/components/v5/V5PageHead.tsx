import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/lib/dictionary";
import { v5Href } from "./nav";

export function V5PageHead({ lang, dict, crumbs = [], title, lead, kicker }: { lang: Locale; dict: Dictionary; crumbs?: { label: string; href: string }[]; title: string; lead?: string; kicker?: string }) {
  const trail = [{ label: dict.v5.home, href: v5Href(lang, "home") }, ...crumbs];
  return (
    <header className="border-b border-corp-line bg-corp-soft">
      <div className="container-site py-[clamp(2.5rem,5vw,4.5rem)]">
        <nav aria-label="breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-corp-muted">
            {trail.map((c) => (
              <li key={c.href} className="flex items-center gap-2">
                <Link href={c.href} className="hover:text-corp-ink hover:underline">
                  {c.label}
                </Link>
                <span aria-hidden>/</span>
              </li>
            ))}
            <li aria-current="page" className="font-medium text-corp-ink">
              {title}
            </li>
          </ol>
        </nav>
        {kicker && <p className="mt-6 text-sm font-semibold text-ember">{kicker}</p>}
        <h1 className="v5-title mt-4 max-w-4xl text-[clamp(2.2rem,1.4rem+3vw,3.75rem)]">{title}</h1>
        {lead && <p className="mt-4 max-w-2xl text-lg text-corp-muted">{lead}</p>}
      </div>
    </header>
  );
}
