import type { Locale } from "@/i18n/config";
import { getProducts } from "@/lib/content";
import type { Dictionary } from "@/lib/dictionary";
import { CandemkeyRoom } from "./CandemkeyRoom";
import { FitRoom } from "./FitRoom";
import { KeyRoom } from "./KeyRoom";
import { OrpigoRoom } from "./OrpigoRoom";
import { QrRoom } from "./QrRoom";
import { SeyyahRoom } from "./SeyyahRoom";

const rooms = { seyyah: SeyyahRoom, orpigo: OrpigoRoom, "kisisel-qr": QrRoom, candemfit: FitRoom } as const;
// Rooms that also make sense before the apps are in the stores (the product site is live).
const preLaunch = { candemkey: CandemkeyRoom } as const;

/** Every live product gets its own room; anything without a template falls back to the "soon" room. */
export function ProductRooms({ lang, dict, level = 3 }: { lang: Locale; dict: Dictionary; level?: 2 | 3 }) {
  const products = getProducts();
  return (
    <>
      {products.map((p, i) => {
        const Room =
          p.slug in preLaunch
            ? preLaunch[p.slug as keyof typeof preLaunch]
            : p.status === "live" && p.slug in rooms
              ? rooms[p.slug as keyof typeof rooms]
              : undefined;
        return Room ? (
          <Room key={p.slug} product={p} lang={lang} dict={dict} index={i + 1} level={level} />
        ) : (
          <KeyRoom key={p.slug} product={p} lang={lang} dict={dict} level={level} />
        );
      })}
    </>
  );
}
