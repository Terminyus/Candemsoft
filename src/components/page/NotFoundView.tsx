import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { href, type RouteKey } from "@/i18n/routes";
import type { Dictionary } from "@/lib/dictionary";

const suggestions = ["projects", "services", "contact"] as const satisfies RouteKey[];

// The one centered layout on the site (DESIGN.md). Speaks in the terminal's voice.
export function NotFoundView({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const t = dict.notFound;
  return (
    <section data-surface="ink" aria-labelledby="nf-title" className="flex min-h-[calc(100svh-var(--header-h))] items-center py-(--section-sm)">
      <div className="container-site flex flex-col items-center text-center">
        <span
          aria-hidden
          data-numeral="404"
          className="numeral block font-display-tight text-[clamp(7rem,4rem+18vw,20rem)] font-extrabold leading-[0.8] text-ink-800"
        />
        <h1 id="nf-title" className="-mt-[0.3em] text-h2">
          {t.title}
        </h1>
        <p className="mt-4 max-w-md text-stone-400">{t.body}</p>
        <div className="mt-10 w-full max-w-lg border border-ink-800 bg-ink-900 p-4 text-left font-mono text-sm">
          <p>
            <span className="text-mint">{dict.terminal.user}</span>
            <span className="text-stone-400">:~$ </span>cd ./
          </p>
          <p className="text-stone-400">cd: {t.error}</p>
          <p className="mt-3 text-stone-400">{t.try}</p>
          <ul className="mt-1 flex flex-wrap gap-x-5">
            <li>
              <Link href={href(lang, "home")} className="text-cobalt underline-offset-4 hover:underline">
                ~
              </Link>
            </li>
            {suggestions.map((k) => (
              <li key={k}>
                <Link href={href(lang, k)} className="text-cobalt underline-offset-4 hover:underline">
                  {dict.nav[k].toLocaleLowerCase(lang)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <Link href={href(lang, "home")} className="mt-10 underline underline-offset-4 hover:text-signal">
          {t.home}
        </Link>
      </div>
    </section>
  );
}
