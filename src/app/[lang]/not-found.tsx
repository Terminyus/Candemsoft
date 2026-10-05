import Link from "next/link";
import { lang as rootLang } from "next/root-params";
import { isLocale, defaultLocale } from "@/i18n/config";
import { href, type RouteKey } from "@/i18n/routes";
import { getDictionary } from "@/lib/dictionary";

const suggestions: RouteKey[] = ["projects", "services", "contact"];

// The one centered layout on the site (DESIGN.md). Speaks in the terminal's voice.
export default async function NotFound() {
  const raw = await rootLang();
  const lang = raw && isLocale(raw) ? raw : defaultLocale;
  const dict = await getDictionary(lang);
  const t = dict.notFound;
  return (
    <section data-surface="ink" aria-labelledby="nf-title" className="flex min-h-[calc(100svh-var(--header-h))] items-center py-(--section-sm)">
      <div className="container-site flex flex-col items-center text-center">
        <p aria-hidden className="font-display-tight text-[clamp(7rem,4rem+18vw,20rem)] font-semibold leading-[0.8] text-ink-800">
          404
        </p>
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
                  {dict.nav[k as "projects" | "services" | "contact"].toLocaleLowerCase(lang)}
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
