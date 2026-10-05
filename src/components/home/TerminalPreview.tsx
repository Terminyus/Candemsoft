import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { href, routes, type RouteKey } from "@/i18n/routes";
import type { Dictionary } from "@/lib/dictionary";

const commands: RouteKey[] = ["projects", "services", "products", "team", "blog", "contact"];

/**
 * Server-rendered terminal: a `help` listing whose commands are real links.
 * Stage 6 layers live typing on top of exactly this markup.
 */
export function TerminalPreview({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const t = dict.terminal;
  return (
    <div className="border border-ink-800 bg-ink-900 font-mono text-[0.8125rem] leading-relaxed md:text-sm">
      <div className="flex items-center justify-between border-b border-ink-800 px-4 py-2.5 text-stone-400">
        <span>{t.title}</span>
        <span className="hidden sm:inline">{t.hint}</span>
      </div>
      <div className="p-4 md:p-5">
        <p>
          <span className="text-mint">{t.user}</span>
          <span className="text-stone-400">:~$ </span>
          <span>help</span>
        </p>
        <ul className="mt-2 grid grid-cols-[auto_1fr] gap-x-6">
          {commands.map((key) => (
            <li key={key} className="contents">
              <Link
                href={href(lang, key)}
                className="w-fit text-cobalt underline-offset-4 hover:underline focus-visible:underline"
              >
                {routes[key][lang] || key}
              </Link>
              <span className="text-stone-400">{t.cmd[key as keyof typeof t.cmd]}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3" aria-hidden>
          <span className="text-mint">{t.user}</span>
          <span className="text-stone-400">:~$ </span>
          <span className="inline-block h-[1.1em] w-[0.6em] translate-y-[0.2em] bg-signal motion-safe:animate-[blink_1.1s_steps(1)_infinite]" />
        </p>
      </div>
    </div>
  );
}
