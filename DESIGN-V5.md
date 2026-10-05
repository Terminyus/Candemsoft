# Candemsoft — Kurumsal (alternatif tasarım)

Aynı içerik (`/content`), beşinci sanat yönetimi. `/v5` altında yaşar, arama motorlarına kapalıdır (`noindex`). Diğerleri: [DESIGN.md](DESIGN.md) (Klasik), [DESIGN-V2.md](DESIGN-V2.md) (Vitrin), [DESIGN-V3.md](DESIGN-V3.md) (Gazete), [DESIGN-V4.md](DESIGN-V4.md) (Derleme).

## Fikir: "Şirket sitesi, yazılımcı elinden"

İlk bakışta tanıdık bir kurumsal site: üstte iletişim şeridi, beyaz başlık, "Teklif alın" butonu, çözümler, referanslar, ekip, iletişim bandı. Bir müşteri neyi nerede arayacağını bilir.

Yazılım şirketi olduğu ayrıntılarda belli olur ve bu ayrıntılar önceki dört tasarımdan alındı:

| Parça | Nereden | v5'te |
|---|---|---|
| Kod kartı, "Ready · Production" rozeti | Derleme (v4) | Hero kolajı, teknoloji bölümündeki `package.json` |
| Sayaçlar (`Counter`), canlı nokta (`v4-pulse`), scroll'la yükselme (`v4-rise`) | Derleme (v4) | İstatistikler ve kartlar |
| Her ürünün kendi rengi | Vitrin (v2) | Ürün sekmeleri: panel o uygulamanın rengine bürünür |
| Alıntı gibi dizilmiş ilkeler | Gazete (v3) | "Nasıl çalışıyoruz" bölümü |
| Arşiv listesi (kapanmış müşteri siteleri) | Gazete (v3) | Projeler sayfası |
| Schibsted Grotesk, turuncu-siyah | Klasik (v1) | Başlıklar ve marka rengi |

## Renk

| | | |
|---|---|---|
| Lacivert-siyah | `#101828` (`corp-ink`) | Metin, koyu bantlar, footer |
| Gri | `#475467` / `#E4E7EC` / `#F6F7F9` | İkincil metin, çizgiler, açık bölümler |
| Turuncu | `#B93F05` (`ember`) | Butonlar, vurgu (beyaz üstünde AA kontrast) |
| Parlak turuncu | `#F85404` (`signal`) | Yalnızca koyu zeminde, dekoratif çizgiler |

Ürün renkleri yalnızca ürün sekmelerinde kullanılır.

## Tipografi

- Başlıklar: **Schibsted Grotesk** (kalın, sıkı aralık, `v5-title`).
- Kod ve rozetler: **Geist Mono**.
- Fontlar kendi barındırılır, layout yalnızca bu ikisini preload eder.

## Hareket

Sakin tutuldu; kurumsal bir sitede hareket dikkati dağıtmamalı.

- Hero kolajı yavaşça süzülür (`v5-float`, 7–9 sn).
- Kartlar scroll'la yükselir (yalnızca `transform`, kontrastı bozmaz).
- Sayaçlar görünür olunca sayar.
- `prefers-reduced-motion` açıkken hepsi durur.

## Ürün sekmeleri

- WAI-ARIA sekmeleri: ok tuşları, Home/End.
- `#seyyah` gibi bir adresle açılınca ilgili sekme seçilir; footer ve ürün şeridi linkleri bunu kullanır.
