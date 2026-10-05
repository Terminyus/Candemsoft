import type { Locale } from "@/i18n/config";
import { getProducts } from "@/lib/content";
import type { Dictionary } from "@/lib/dictionary";
import { FitRoom } from "./FitRoom";
import { KeyRoom } from "./KeyRoom";
import { OrpigoRoom } from "./OrpigoRoom";
import { QrRoom } from "./QrRoom";
import { SeyyahRoom } from "./SeyyahRoom";

const rooms = { seyyah: SeyyahRoom, orpigo: OrpigoRoom, "kisisel-qr": QrRoom, candemfit: FitRoom } as const;

/** Every live product gets its own room; anything without a template falls back to the "soon" room. */
export function ProductRooms({ lang, dict, level = 3 }: { lang: Locale; dict: Dictionary; level?: 2 | 3 }) {
  const products = getProducts();
  return (
    <>
      {products.map((p, i) => {
        const Room = p.slug in rooms ? rooms[p.slug as keyof typeof rooms] : undefined;
        return Room && p.status === "live" ? (
          <Room key={p.slug} product={p} lang={lang} dict={dict} index={i + 1} level={level} />
        ) : (
          <KeyRoom key={p.slug} product={p} lang={lang} dict={dict} level={level} />
        );
      })}
    </>
  );
}
