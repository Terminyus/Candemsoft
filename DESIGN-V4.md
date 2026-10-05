# Candemsoft — Derleme (alternatif tasarım)

Aynı içerik (`/content`), dördüncü sanat yönetimi: **bol animasyonlu, yazılım şirketi havasında**. `/v4` altında yaşar, arama motorlarına kapalıdır. Diğerleri: [DESIGN.md](DESIGN.md), [DESIGN-V2.md](DESIGN-V2.md), [DESIGN-V3.md](DESIGN-V3.md).

## Fikir: "Site çalışan bir program"

Her animasyon yazılım dünyasından bir metafor; hepsi gerçek veriyle çalışır:

| Bölüm | Metafor | Veri |
|---|---|---|
| Hero | Bir bileşen kendini yazar, satır tamamlandıkça önizleme derlenir, "✓ Derlendi" | Hizmet başlıkları, şehir |
| Teknoloji şeridi | Bağımlılık listesi gibi akan şerit | `content/stack.json` |
| Ürünler | Fareyle 3B eğilen kartlar, her ürünün kendi renginde parlama | Ürün içerikleri, ekran görüntüleri |
| Dağıtımlar | Vercel tarzı deployment listesi | Projelerin **gerçek** durumu: kapalı siteler "Offline", alan adı üstü çizili |
| Hizmetler | `services/web.ts` modülleri | Hizmetler ve kapsamları |
| CTA | Terminalde komut yazılır, çıktı olarak iletişim kanalları gelir | Gerçek e-posta, telefon, WhatsApp |
| Footer | Son derleme tarihi ve commit hash'i | `git log -1` (`src/lib/build-info.ts`) |

Uydurma veri yok: hero'daki derleme bir gösteri, "süre" gibi sahte metrikler kullanılmadı.

## Renk

Gece editörü: zemin `#07080A`, yüzey `#0F1115`, çizgi `#1D2027`, metin `#E8EAED`, ikincil `#9AA0A6` (7.6:1). Vurgu logodaki turuncu `#F85404`. Sözdizimi renkleri aynı zamanda vurgu: anahtar kelime `#6B9BFF`, string `#4ADE80`, etiket `#FF8A4C`, attribute `#E3B341`, fonksiyon `#FF7AB6` — hepsi zeminde ≥ 5.6:1.

## Tipografi

**Geist** (değişken, 400–800) ve **Geist Mono**: yazılım dünyasının yerlisi. Mono font arayüzün ikinci dili: menü `./ürünler`, yollar `~/candemsoft/apps`, komutlar `$ candemsoft deployments ls`.

## Hareket envanteri

| Efekt | Teknik |
|---|---|
| Kod yazma + önizleme | React state, 28 ms adım; server tamamlanmış hali render eder |
| Nokta ızgarası (imleç çevresi turuncu) | Canvas 2D, ekran dışında durur, DPR ≤ 2 |
| Özel imleç | rAF + `transform`; yalnızca fare, reduced-motion'da kapalı |
| Scramble başlıklar | Gerçek metin yerinde (görünmez) kalır, karışık kopya üstte: layout kayması yok |
| Sayaçlar | Yalnızca ilk ekranda değilse 0'dan sayar |
| Kaydırma ilerleme çubuğu, satırların yükselmesi | CSS scroll-driven animations (JS yok) |
| Teknoloji şeridi, nabız atan durum noktaları, imleç yanıp sönmesi | CSS keyframes |
| 3B kartlar | Pointer + `transform`, yalnızca fare |

Kurallar:
- Yalnızca `transform`, `opacity` ve `visibility`. Kaydırmayla gelen öğeler **solmaz**, sadece kayar: metin hiçbir an düşük kontrastta gösterilmez.
- `prefers-reduced-motion`: editör derlenmiş açılır, canvas statik çizilir, şerit/imleç/yükselme/sayaç kapalı.
- Ölçüm (mobil Lighthouse): 94–97, TBT 0–10 ms, CLS ~0.

> **Değişiklik:** İlk sürümdeki "bu sitenin git geçmişi" bölümü geri bildirimle kaldırıldı.
