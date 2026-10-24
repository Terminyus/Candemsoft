import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/lib/dictionary";
import { asset } from "@/lib/static";
import { getProducts, getSite, publicFileExists } from "@/lib/content";
import { Logo } from "@/components/ui/Logo";
import { getActiveSocialGroups, type SocialGroup } from "@/lib/social";
import { SocialIcon } from "./SocialIcon";

export function V2SocialSection({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const site = getSite();
  const products = getProducts();
  const groups: SocialGroup[] = getActiveSocialGroups(site, products);

  return (
    <section aria-labelledby="v2-social-heading" className="border-t border-ink-800 py-10">
      <div className="container-site">
        {/* Section Header: Left/Top Logo & Description from Dictionary */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-ink-800/60 pb-5">
          <div className="flex items-center gap-4">
            <Logo surface="ink" className="h-6 w-auto md:h-7 shrink-0" priority={false} />
            <div className="hidden h-5 w-px bg-ink-800 sm:block" aria-hidden="true" />
            <div>
              <h3 id="v2-social-heading" className="font-archivo text-sm font-semibold tracking-tight text-paper-100">
                {dict.footer.social}
              </h3>
              <p className="font-mono text-xs text-stone-400">
                {dict.footer.socialLead}
              </p>
            </div>
          </div>
        </div>

        {/* Project Groups: 4 columns on desktop, 2 on tablet, 1 on mobile */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {groups.map((group) => {
            const icon = group.icon;
            const base = icon ? icon.replace(/\.[^.]+$/, "") : "";
            const hasAvif = icon ? publicFileExists(`${base}.avif`) : false;
            const hasWebp = icon ? publicFileExists(`${base}.webp`) : false;
            const iconExists = icon ? publicFileExists(icon) : false;

            return (
              <div
                key={group.id}
                className="flex flex-col justify-between rounded-xl border border-ink-800 bg-ink-900/60 p-4 transition-all duration-200 hover:border-ink-700 hover:bg-ink-900/90"
              >
                {/* Project Identity: Icon & Name */}
                <div className="flex items-center gap-3">
                  {icon && iconExists ? (
                    <picture className="shrink-0">
                      {hasAvif && <source type="image/avif" srcSet={asset(`${base}.avif`)} />}
                      {hasWebp && <source type="image/webp" srcSet={asset(`${base}.webp`)} />}
                      <img
                        src={asset(icon)}
                        alt={`${group.name} logo`}
                        width={36}
                        height={36}
                        loading="lazy"
                        decoding="async"
                        className="h-9 w-9 rounded-lg border border-ink-800 bg-ink-950 p-1 object-contain"
                      />
                    </picture>
                  ) : (
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-signal/30 bg-signal/15 font-mono text-sm font-bold text-signal shrink-0"
                      aria-hidden="true"
                    >
                      {group.name[0]}
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

                {/* Project Social Links: 44px WCAG 2.2 AAA accessible touch targets */}
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-ink-800/80 pt-3">
                  {group.links.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer me"
                      aria-label={`${group.name} ${link.networkName}`}
                      title={`${group.name} · ${link.networkName}`}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-ink-800 bg-ink-950 text-stone-400 transition-all hover:border-signal/60 hover:bg-ink-900 hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950"
                    >
                      <SocialIcon network={link.network} className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
