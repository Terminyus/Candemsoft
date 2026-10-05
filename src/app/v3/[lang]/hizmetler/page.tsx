import type { Metadata } from "next";
import { getServices, getSite, getStack } from "@/lib/content";
import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";
import { V3PageHead } from "@/components/v3/V3PageHead";

export async function generateMetadata({ params }: PageProps<"/v3/[lang]/hizmetler">): Promise<Metadata> {
  return { title: (await getDictionary(await resolveLang(params))).nav.services };
}

// Services as the classifieds page: each one a boxed ad.
export default async function Page({ params }: PageProps<"/v3/[lang]/hizmetler">) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  const t = dict.v3;
  const { contact } = getSite();
  return (
    <>
      <V3PageHead kicker={t.classifiedsTitle} title={dict.servicesPage.title} deck={dict.servicesPage.lead} />
      <div className="container-site grid gap-4 pt-8 md:grid-cols-2 lg:grid-cols-3">
        {getServices().map((s, i) => (
          <section key={s.slug} id={s.slug} aria-labelledby={`h-${s.slug}`} className="scroll-mt-14 border-2 border-news-ink p-5">
            <p className="v3-kicker text-ember">{String(i + 1).padStart(2, "0")}</p>
            <h2 id={`h-${s.slug}`} className="v3-headline mt-1 text-3xl">
              {s.title[lang]}
            </h2>
            <p className="mt-3 leading-snug">{s.summary[lang]}</p>
            <ul className="mt-4 border-t border-news-ink/30">
              {s.items[lang].map((item) => (
                <li key={item} className="border-b border-dotted border-news-ink/40 py-1.5 italic">
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}
        <section aria-labelledby="wanted" className="border-2 border-news-ink bg-signal p-5">
          <h2 id="wanted" className="v3-headline text-4xl">
            {t.wanted}
          </h2>
          <p className="mt-3 leading-snug">{t.wantedBody}</p>
          <p className="mt-3 font-[650]">
            <a href={`mailto:${contact.email}`} className="underline underline-offset-4">
              {contact.email}
            </a>
          </p>
          <p className="v3-kicker mt-6">{dict.servicesPage.stackLabel}</p>
          <p className="mt-1">{getStack().join(" · ")}</p>
        </section>
      </div>
    </>
  );
}
