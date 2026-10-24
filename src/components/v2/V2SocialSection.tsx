import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/lib/dictionary";
import { asset } from "@/lib/static";
import { Logo } from "@/components/ui/Logo";
import { getActiveSocialGroups, type SocialGroup } from "@/lib/social";
import { SocialIcon } from "./SocialIcon";

export function V2SocialSection({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const groups: SocialGroup[] = getActiveSocialGroups();

  const labels = {
    heading: lang === "tr" ? "Sosyal Medya & Projeler" : lang === "es" ? "Redes & Proyectos" : "Social & Projects",
    lead:
      lang === "tr"
        ? "Resmî hesaplarımız ve ürün topluluklarımız"
        : lang === "es"
          ? "Perfiles oficiales y comunidades de producto"
          : "Official channels and product communities",
  };

  return (
    <section aria-labelledby="v2-social-heading" className="border-t border-ink-800 py-10">
      <div className="container-site">
        {/* Section Header: Left/Top Logo & Description */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-ink-800/60 pb-5">
          <div className="flex items-center gap-4">
            <Logo surface="ink" className="h-6 w-auto md:h-7 shrink-0" priority={false} />
            <div className="hidden h-5 w-px bg-ink-800 sm:block" aria-hidden="true" />
            <div>
              <h3 id="v2-social-heading" className="font-archivo text-sm font-semibold tracking-tight text-paper-100">
                {labels.heading}
              </h3>
              <p className="font-mono text-xs text-stone-400">
                {labels.lead}
              </p>
            </div>
          </div>
        </div>

        {/* Project Groups: 4 columns on desktop, 2 on tablet, 1 on mobile */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {groups.map((group) => (
            <div
              key={group.id}
              className="flex flex-col justify-between rounded-xl border border-ink-800 bg-ink-900/60 p-4 transition-all duration-200 hover:border-ink-700 hover:bg-ink-900/90"
            >
              {/* Project Top: Icon & Name */}
              <div className="flex items-center gap-3">
                {group.icon ? (
                  <img
                    src={asset(group.icon)}
                    alt=""
                    width={32}
                    height={32}
                    loading="lazy"
                    decoding="async"
                    className="h-8 w-8 rounded-lg border border-ink-800 bg-ink-950 p-1 object-contain shrink-0"
                    aria-hidden="true"
                  />
                ) : (
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-signal/30 bg-signal/15 font-mono text-xs font-bold text-signal shrink-0"
                    aria-hidden="true"
                  >
                    C
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h4 className="font-archivo text-sm font-semibold text-paper-100 truncate">
                    {group.name}
                  </h4>
                  <p className="font-mono text-[11px] text-stone-400 truncate">
                    {group.category[lang]}
                  </p>
                </div>
              </div>

              {/* Project Social Links as Icon Buttons */}
              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-ink-800/80 pt-3">
                {group.links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer me"
                    aria-label={`${group.name} ${link.networkName}`}
                    title={`${group.name} · ${link.networkName}`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-ink-800 bg-ink-950 text-stone-400 transition-all hover:border-signal/60 hover:bg-ink-900 hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950"
                  >
                    <SocialIcon network={link.network} className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
