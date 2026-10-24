import type { ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import type { Product } from "@/lib/content";
import { publicFileExists } from "@/lib/content";
import type { Dictionary } from "@/lib/dictionary";
import { asset } from "@/lib/static";
import { cn } from "@/components/ui/cn";
import { parseSocialUrl } from "@/lib/social";
import { SocialIcon } from "@/components/v2/SocialIcon";

/** Colours a room hands to the shared info block. */
export type RoomTheme = {
  kicker: string; // small label colour
  button: string; // primary store button
  ghost: string; // secondary buttons
  rule: string; // list dividers
  bullet: string;
  muted: string;
};

const platformName = { ios: "iOS", android: "Android", web: "Web" } as const;

export function RoomIcon({ product, className, priority }: { product: Product; className?: string; priority?: boolean }) {
  const icon = product.icon;
  const base = icon ? icon.replace(/\.[^.]+$/, "") : "";
  const hasAvif = icon ? publicFileExists(`${base}.avif`) : false;
  const hasWebp = icon ? publicFileExists(`${base}.webp`) : false;

  return (
    <span className={cn("relative block size-16 shrink-0 overflow-hidden rounded-[22%] bg-white md:size-20", className)}>
      {icon && publicFileExists(icon) ? (
        <picture className="absolute inset-0 size-full">
          {hasAvif && <source type="image/avif" srcSet={asset(`${base}.avif`)} />}
          {hasWebp && <source type="image/webp" srcSet={asset(`${base}.webp`)} />}
          <img
            src={asset(icon)}
            alt={`${product.name} logo`}
            width={80}
            height={80}
            loading={priority ? "eager" : "lazy"}
            decoding={priority ? "sync" : "async"}
            fetchPriority={priority ? "high" : "low"}
            className="size-full object-contain"
          />
        </picture>
      ) : (
        <span aria-hidden className="absolute inset-0 grid place-items-center v2-heading text-2xl text-ink-950">
          {product.name[0]}
        </span>
      )}
    </span>
  );
}

export function StoreButtons({ product, dict, theme }: { product: Product; dict: Dictionary; theme: RoomTheme }) {
  const t = dict.productsPage;
  const links = [
    product.links.appStore && { href: product.links.appStore, label: t.appStore },
    product.links.googlePlay && { href: product.links.googlePlay, label: t.googlePlay },
    product.links.web && { href: product.links.web, label: t.web },
  ].filter((l): l is { href: string; label: string } => Boolean(l));
  if (!links.length) return null;
  return (
    <div className="flex flex-wrap gap-3">
      {links.map((l, i) => (
        <a
          key={l.href}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "inline-flex min-h-12 items-center gap-3 rounded-full px-6 font-archivo text-[0.95rem] font-semibold transition-transform active:translate-y-px",
            i === 0 ? theme.button : theme.ghost,
          )}
        >
          {l.label} <span aria-hidden>↗</span>
        </a>
      ))}
    </div>
  );
}

/** Ürünün resmî sosyal hesapları: odanın kendi renklerinde, 44 px dokunma alanlı ikon satırı. */
export function RoomSocial({ product, theme }: { product: Product; theme: RoomTheme }) {
  const links = (product.social ?? []).map(parseSocialUrl);
  if (!links.length) return null;
  return (
    <ul className="flex flex-wrap gap-2" aria-label={`${product.name} social`}>
      {links.map((l) => (
        <li key={l.url}>
          <a
            href={l.url}
            target="_blank"
            rel="noopener noreferrer me"
            aria-label={`${product.name} ${l.networkName}`}
            className={cn(
              "inline-flex size-11 items-center justify-center rounded-full border opacity-80 transition-opacity hover:opacity-100",
              theme.rule,
              theme.muted,
            )}
          >
            <SocialIcon network={l.network} className="size-5" />
          </a>
        </li>
      ))}
    </ul>
  );
}

export function RoomInfo({
  product,
  lang,
  dict,
  theme,
  index,
  titleClass,
  taglineClass,
  tagline,
  extra,
  level = 3,
}: {
  product: Product;
  lang: Locale;
  dict: Dictionary;
  theme: RoomTheme;
  index: number;
  titleClass?: string;
  taglineClass?: string;
  /** Replaces the plain tagline (e.g. to set part of it in a different hand). */
  tagline?: ReactNode;
  /** Rendered after the store buttons (e.g. "coming soon" store badges). */
  extra?: ReactNode;
  /** h3 under a section heading (home), h2 directly under the page h1 (products page). */
  level?: 2 | 3;
}) {
  const Title = level === 2 ? "h2" : "h3";
  const features = product.features[lang];
  return (
    <div className="@container flex min-w-0 flex-col gap-6">
      <div className="flex items-center gap-5">
        <RoomIcon product={product} />
        <div>
          <p className={cn("font-mono text-mono-sm", theme.kicker)}>
            {String(index).padStart(2, "0")} /{" "}
            {product.platforms.map((p) => platformName[p]).join(" · ") || dict.common.comingSoon}
          </p>
          <Title
            id={`room-${product.slug}`}
            className={cn("v2-display mt-1 text-[clamp(2rem,11cqi,4.75rem)]", titleClass)}
          >
            {product.name}
          </Title>
        </div>
      </div>
      <p className={taglineClass ?? "v2-heading text-[clamp(1.5rem,1.2rem+1.2vw,2.25rem)]"}>
        {tagline ?? product.tagline[lang]}
      </p>
      <p className={cn("max-w-xl text-lead", theme.muted)}>{product.description[lang]}</p>
      {features.length > 0 && (
        <ul className={cn("grid max-w-xl gap-x-6 border-t sm:grid-cols-2", theme.rule)}>
          {features.map((f) => (
            <li key={f} className={cn("flex gap-3 border-b py-2.5", theme.rule)}>
              <span aria-hidden className={theme.bullet}>
                +
              </span>
              {f}
            </li>
          ))}
        </ul>
      )}
      {product.androidSoon && (
        <p className={cn("font-mono text-mono-sm", theme.kicker)}>{dict.productsPage.androidSoon}</p>
      )}
      <StoreButtons product={product} dict={dict} theme={theme} />
      <RoomSocial product={product} theme={theme} />
      {extra}
    </div>
  );
}
