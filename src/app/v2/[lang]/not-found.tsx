import Link from "next/link";
import { lang as rootLang } from "next/root-params";
import { defaultLocale, isLocale } from "@/i18n/config";
import { getDictionary } from "@/lib/dictionary";
import { v2Href } from "@/components/v2/nav";

export default async function NotFound() {
  const raw = await rootLang();
  const lang = raw && isLocale(raw) ? raw : defaultLocale;
  const t = (await getDictionary(lang)).notFound;
  return (
    <section className="container-site flex min-h-[60svh] flex-col items-start justify-center gap-6 py-(--section)">
      <p className="v2-display text-[clamp(6rem,3rem+14vw,14rem)] text-signal">404</p>
      <h1 className="v2-display text-[clamp(2rem,1.4rem+2.6vw,3.5rem)]">{t.title}</h1>
      <p className="text-lead text-stone-600">{t.body}</p>
      <Link href={v2Href(lang, "home")} className="inline-flex min-h-12 items-center rounded-full bg-ink-950 px-6 font-archivo font-semibold text-white hover:bg-signal hover:text-ink-950">
        {t.home}
      </Link>
    </section>
  );
}
