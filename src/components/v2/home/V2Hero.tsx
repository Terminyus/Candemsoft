import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { getProducts, getSite } from "@/lib/content";
import type { Dictionary } from "@/lib/dictionary";
import { RoomIcon } from "@/components/v2/rooms/RoomInfo";
import { v2Href } from "@/components/v2/nav";

export function V2Hero({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const t = dict.v2;
  const site = getSite();
  const shelf = getProducts().filter((p) => p.status === "live");
  const stats = [
    ...site.stats.map((s) => ({ v: s.value, k: s.label[lang] })),
    { v: String(shelf.length), k: dict.stats.products },
  ];
  return (
    <section aria-labelledby="v2-hero" className="border-b border-ink-950">
      <div className="container-site grid gap-12 pb-12 pt-[clamp(2.5rem,6vw,5rem)] xl:grid-cols-[minmax(0,1fr)_22rem] xl:items-end">
        <div className="min-w-0">
          <p className="font-mono text-mono-sm text-stone-600">{t.heroKicker}</p>
          <h1 id="v2-hero" className="v2-display mt-6 text-[clamp(2.5rem,1rem+6.2vw,7.25rem)]">
            <span className="block">{t.heroLine1}</span>
            <span className="block">{t.heroLine2}</span>
            <span className="block text-signal">{t.heroLine3}</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lead text-stone-600">{t.heroLead}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href={v2Href(lang, "contact")}
              className="inline-flex min-h-14 items-center gap-3 rounded-full bg-ink-950 px-8 font-archivo text-lg font-semibold text-white transition-colors hover:bg-signal hover:text-ink-950"
            >
              {t.heroCta} <span aria-hidden>→</span>
            </Link>
            <a href="#rooms" className="font-archivo font-semibold underline decoration-signal decoration-2 underline-offset-[6px] hover:text-ember">
              {t.heroSecondary} ↓
            </a>
          </div>
        </div>

        {/* The shelf: our apps, each one a doorway into its room below. */}
        <nav aria-label={t.shelf}>
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-2">
            {shelf.map((p) => (
              <li key={p.slug}>
                <a
                  href={`#${p.slug}`}
                  className="group flex items-center gap-2.5 rounded-2xl border border-ink-950 p-2.5 transition-colors sm:gap-3 sm:p-3 hover:bg-ink-950 hover:text-white"
                >
                  <RoomIcon product={p} className="size-11 ring-1 ring-ink-950/10" />
                  <span className="min-w-0 font-archivo text-sm font-semibold leading-tight sm:text-[0.95rem]">{p.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <dl className="container-site grid grid-cols-3 border-t border-ink-950">
        {stats.map((s, i) => (
          <div key={s.k} className={`flex flex-col-reverse justify-end gap-1 py-6 ${i > 0 ? "border-l border-ink-950 pl-4 sm:pl-6" : ""}`}>
            <dt className="font-mono text-mono-sm text-stone-600">{s.k}</dt>
            <dd className="v2-display text-[clamp(2rem,1.5rem+2.5vw,3.5rem)]">{s.v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
