import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { getSite, getTeam } from "@/lib/content";
import type { Dictionary } from "@/lib/dictionary";
import { OtherDesigns } from "./OtherDesigns";
import { v3Href } from "./nav";

/** The imprint (künye): who publishes this paper, where, and how it's made. */
export function V3Footer({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const t = dict.v3;
  const { contact } = getSite();
  const team = getTeam();
  const rows = [
    { k: t.owner, v: "Candemsoft" },
    { k: t.address, v: contact.city[lang] },
    { k: t.contact, v: `${contact.email} · ${contact.phone}` },
    { k: t.newsroom, v: team.map((m) => m.name).join(", ") },
    { k: t.typesetting, v: "Fraunces, Newsreader, Libre Franklin" },
    { k: t.printing, v: t.printingValue },
  ];
  return (
    <footer className="container-site mt-(--section-sm) pb-10">
      <div className="border-t-[3px] border-double border-news-ink pt-6">
        <h2 className="v3-kicker">{t.imprint}</h2>
        <dl className="mt-4 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((r) => (
            <div key={r.k} className="border-b border-news-ink/20 pb-2">
              <dt className="v3-kicker text-news-gray">{r.k}</dt>
              <dd className="mt-1">{r.v}</dd>
            </div>
          ))}
        </dl>
        <div className="v3-noprint mt-8 flex flex-wrap items-center justify-between gap-4 text-news-gray">
          <p className="v3-kicker">
            © {new Date().getFullYear()} Candemsoft ·{" "}
            <Link href={v3Href(lang, "privacy")} className="underline underline-offset-4 hover:text-ember">
              {dict.nav.privacy}
            </Link>
          </p>
          <OtherDesigns lang={lang} current="v3" t={t} />
        </div>
      </div>
    </footer>
  );
}
