import type { Metadata } from "next";
import Link from "next/link";
import { getProducts, getProject, publicFileExists } from "@/lib/content";
import { getDictionary } from "@/lib/dictionary";
import { resolveLang } from "@/lib/params";
import { Halftone } from "@/components/v3/Halftone";
import { V3PageHead } from "@/components/v3/V3PageHead";
import { v3Href } from "@/components/v3/nav";

export async function generateMetadata({ params }: PageProps<"/v3/[lang]/urunler">): Promise<Metadata> {
  return { title: (await getDictionary(await resolveLang(params))).v3.productsTitle };
}

const platformName = { ios: "iOS", android: "Android", web: "Web" } as const;

export default async function Page({ params }: PageProps<"/v3/[lang]/urunler">) {
  const lang = await resolveLang(params);
  const dict = await getDictionary(lang);
  const t = dict.v3;
  return (
    <>
      <V3PageHead kicker={t.productsTitle} title={dict.productsPage.title} deck={dict.productsPage.lead} />
      <div className="container-site">
        {getProducts().map((p, i) => {
          const proj = p.project ? getProject(p.project) : undefined;
          const links = [
            p.links.appStore && { h: p.links.appStore, l: dict.productsPage.appStore },
            p.links.googlePlay && { h: p.links.googlePlay, l: dict.productsPage.googlePlay },
            p.links.web && { h: p.links.web, l: dict.productsPage.web },
          ].filter((x): x is { h: string; l: string } => Boolean(x));
          return (
            <article key={p.slug} id={p.slug} aria-labelledby={`h-${p.slug}`} className="grid scroll-mt-14 gap-8 border-b border-news-ink py-12 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
              <div>
                <p className="v3-kicker text-ember">
                  {String(i + 1).padStart(2, "0")} · {p.name}
                  {p.platforms.length > 0 && ` · ${p.platforms.map((x) => platformName[x]).join(" / ")}`}
                  {p.status === "soon" && ` · ${dict.common.comingSoon}`}
                </p>
                <h2 id={`h-${p.slug}`} className="v3-headline mt-2 text-[clamp(2rem,1.3rem+3vw,3.75rem)]">
                  {p.tagline[lang]}
                </h2>
                <div className="v3-dropcap mt-5 text-[1.1rem] leading-relaxed">
                  <p>{p.description[lang]}</p>
                </div>
                {p.features[lang].length > 0 && (
                  <ul className="mt-5 columns-1 gap-8 sm:columns-2">
                    {p.features[lang].map((f) => (
                      <li key={f} className="mb-2 break-inside-avoid border-l-2 border-signal pl-3">
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
                {p.androidSoon && <p className="v3-kicker mt-4 text-news-gray">{dict.productsPage.androidSoon}</p>}
                {links.length > 0 && (
                  <p className="mt-6 flex flex-wrap gap-3">
                    {links.map((x, j) => (
                      <a
                        key={x.h}
                        href={x.h}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`v3-kicker inline-flex min-h-11 items-center border-2 border-news-ink px-4 ${j === 0 ? "bg-news-ink text-news-paper hover:bg-signal hover:text-news-ink" : "hover:bg-news-ink hover:text-news-paper"}`}
                      >
                        {x.l} ↗
                      </a>
                    ))}
                  </p>
                )}
                {proj && (
                  <Link href={v3Href(lang, "projects", proj.slug)} className="v3-kicker mt-5 inline-block underline underline-offset-4 hover:text-ember">
                    {t.continue} →
                  </Link>
                )}
              </div>
              {proj && publicFileExists(proj.images.desktop) && (
                <figure className="grid grid-cols-[3fr_1fr] items-end gap-3 self-start">
                  <Halftone src={proj.images.desktop} alt={dict.common.shotDesktop.replace("{name}", p.name)} sizes="(min-width: 1024px) 30vw, 70vw" priority={i === 0} />
                  <Halftone src={proj.images.mobile} alt={dict.common.shotMobile.replace("{name}", p.name)} sizes="(min-width: 1024px) 10vw, 25vw" ratio="aspect-[9/16]" />
                  <figcaption className="col-span-2 text-sm italic text-news-gray">{t.photoCaption.replace("{name}", p.name)}</figcaption>
                </figure>
              )}
            </article>
          );
        })}
      </div>
    </>
  );
}
