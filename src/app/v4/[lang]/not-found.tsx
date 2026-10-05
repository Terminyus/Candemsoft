import Link from "next/link";
import { lang as rootLang } from "next/root-params";
import { defaultLocale, isLocale } from "@/i18n/config";
import { getDictionary } from "@/lib/dictionary";
import { v4Href } from "@/components/v4/nav";

export default async function NotFound() {
  const raw = await rootLang();
  const lang = raw && isLocale(raw) ? raw : defaultLocale;
  const t = (await getDictionary(lang)).notFound;
  return (
    <section className="container-site py-(--section)">
      <pre className="overflow-x-auto rounded-xl border border-[#f87171]/40 bg-dev-surface p-6 v4-mono text-sm leading-relaxed">
        <span className="text-[#f87171]">Error 404: {t.title}</span>
        {"\n    at Router.resolve (candemsoft/app.ts:404:1)\n    "}
        <span className="text-dev-comment">{"// " + t.body}</span>
      </pre>
      <Link href={v4Href(lang, "home")} className="mt-6 inline-flex min-h-11 items-center rounded-md bg-signal px-5 font-semibold text-dev-bg">
        cd ~ · {t.home}
      </Link>
    </section>
  );
}
