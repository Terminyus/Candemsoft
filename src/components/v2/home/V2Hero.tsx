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
        <div className="@container min-w-0">
          <p className="font-mono text-mono-sm text-stone-600">{t.heroKicker}</p>
          {/* Sized by the column, not the viewport: "Müşterilerimiz" is one long unbreakable word. */}
          <h1 id="v2-hero" className="v2-display mt-6 text-[clamp(2.25rem,12cqi,7.25rem)]">
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
                {/* Icon above the name: the name gets the card's full width, so it never spills out. */}
                <a
                  href={`#${p.slug}`}
                  className="group flex h-full flex-col items-start gap-3 rounded-2xl border border-ink-950 p-3 transition-colors hover:bg-ink-950 hover:text-white"
                >
                  <RoomIcon product={p} className="size-12 ring-1 ring-ink-950/10" />
                  <span className="w-full font-archivo text-[0.95rem] font-semibold leading-tight [overflow-wrap:anywhere]">{p.name}</span>
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
