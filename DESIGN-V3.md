# Candemsoft — Gazete (alternatif tasarım)

Aynı içerik (`/content`), üçüncü bir sanat yönetimi. `/v3` altında yaşar, arama motorlarına kapalıdır (`noindex`). Diğerleri: [DESIGN.md](DESIGN.md) (klasik konsol), [DESIGN-V2.md](DESIGN-V2.md) (Vitrin).

## Fikir: "Candemsoft Gazetesi"

Klasik tasarım bir geliştirici konsolu, Vitrin bir ürün mağazası. Gazete ise şirketi **bir gazetenin ön sayfası** olarak anlatır: manşet, haberler, ek, arşiv, ilanlar, köşe yazısı, künye. Gazete dili bir üsluptur; haber metinlerinin tamamı gerçek bilgiden (ürün açıklamaları, proje durumları) kurulur.

| Gazete bölümü | Sitedeki karşılığı |
|---|---|
| Manşet | Kendi ürünlerimiz: "Dört uygulama yayında, beşincisi yolda." |
| Sağ sütun | Rakamlar, "kısa kısa" (hizmetler), "yakında" kutusu (Candemkey) |
| Ürünler eki | Her uygulama kendi haberiyle |
| Müşteri işleri / **Arşiv** | Yayındaki işler; yayında olmayan siteler açıkça "arşiv"de |
| İlanlar | Hizmetler; "ARANIYOR: sıradaki projeniz" |
| Köşe yazısı | Blog |
| Okur mektupları | İletişim formu |
| Künye | Footer: sahibi, adres, iletişim, yazı işleri (ekip), dizgi, baskı |

## Renk

Gazete kâğıdı `#F2EEE3`, mürekkep `#141210`, gri `#57524A` (kâğıt üzerinde 6.7:1). Tek baskı rengi logodaki turuncu `#F85404`: "Yakında" ve "ARANIYOR" kutuları, alt çizgiler, logo noktası. Küçük turuncu metin kâğıtta `ember` (`#B93F05`, 4.8:1).

## Tipografi

| Rol | Font | Not |
|---|---|---|
| Gazete başlığı, manşetler | **Fraunces**, opsz 144 / 800 | Optik boyutun en büyük ucu: manşet kesimi |
| Metin, spotlar (italik), ara başlıklar (650) | **Newsreader**, opsz 14 | Haber metni için tasarlanmış serif |
| Bölüm etiketleri, menü | **Libre Franklin** 800 | Klasik gazete grotesk'i |

Değişken fontlar `fontTools` ile sabit kesimlere indirildi; her kesim latin + latin-ext olmak üzere 15–25 KB. Yalnızca ilk ekranda gereken kesimler preload edilir.

## Düzen

- Ön sayfa ızgarası: 2/3 manşet + 1/3 sağ sütun, aralarında ince dikey çizgi.
- Manşet metni iki sütun (`column-count`), ilk harf büyük (drop cap).
- Bölüm başlıkları iki kalın yatay çizgi arasında. Gazete başlığı ve slogan, sitenin tek ortalanmış alanı.
- Mobilde hamburger menü yok: bölüm çubuğu tek satır, yatay kayar.

## Hareket ve etkileşim

| Nerede | Ne | Amaç |
|---|---|---|
| Tüm ekran görüntüleri | Gri, noktalı "baskı" görünümü; hover/odakta renkli görüntüye döner | Geri bildirim; "basılı fotoğraf canlanır" |
| Telefonda | Görsel ekranın ortasına gelince renklenir (scroll-driven animation) | Hover olmayan cihazda aynı etki |
| "Bu sayfayı yazdır" | `@media print` ile düzgün bir A4 gazete sayfası | Gazete fikrinin gerçek karşılığı |

`prefers-reduced-motion`: görseller baskı görünümünde sabit kalır.
