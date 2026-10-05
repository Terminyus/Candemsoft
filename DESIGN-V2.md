# Candemsoft — Vitrin (alternatif tasarım)

Aynı içerik (`/content`), farklı bir sanat yönetimi. `/v2` altında yaşar, arama motorlarına kapalıdır (`noindex`). Klasik tasarım için bkz. [DESIGN.md](DESIGN.md).

## Fikir: "Vitrin ve odalar"

Klasik tasarım bir geliştirici konsoluydu (koyu, terminal, mono). Vitrin bir **ürün mağazası**: beyaz duvarlar, siyah tipografi, yapısal turuncu bloklar ve her uygulamanın kendi renkleriyle döşenmiş bir **odası**.

Candemsoft'un iki yüzünden ikincisini (kendi ürünlerini) öne çıkarır: önce odalar, sonra müşteri işleri.

## Renk

Site çerçevesi yalnızca üç renk kullanır:

| | | |
|---|---|---|
| Beyaz | `#FFFFFF` | Zemin |
| Siyah | `#0E0D0B` | Tipografi, çizgiler, birincil buton |
| Turuncu | `#F85404` | Logodan. Yapısal bloklar (CTA, Candemkey odası), vurgu |

Odalarda o ürünün kendi renkleri geçerlidir (logolardan ölçüldü):

| Oda | Renkler | Karakter |
|---|---|---|
| Seyyah | Mavi `#0068C8`, kâğıt `#F6F3EA` | Kareli defter, mavi mürekkep. SVG türbülans filtresiyle titrek kara kalem çizgileri, tarama desenli pinler, el yazısı notlar (Caveat). |
| Orpigo | Lacivert `#101838`, kırmızı `#E80820` | Uygulamanın hız çizgileri. **Çalışan bir hız okuma demosu**: kelimeler tek tek akar, ORP harfi kırmızı ve sabit bir kılavuzun altında durur. Ziyaretçi başlatmadan oynamaz. |
| Kişisel QR | Siyah, sarı `#F8D008` | Noktalı ızgara. **Taranabilir gerçek bir QR** (derleme sırasında üretilir, kisiselqr.com'u açar) ve "örnek profil" kartı. |
| CandemFit | Gece `#000810`, turkuaz `#00D8D8` | Sokak ızgarası üzerinde scroll'la çizilen GPS rotası (CSS scroll-driven animation), "örnek" etiketli antrenman verisi. |
| Candemkey | Turuncu, siyah | "Yakında": Türkçe Q klavyesi tuşları. |

## Tipografi

- **Archivo**, genişlik ekseni sayesinde tek aile iki ses: başlıklarda geniş (wdth 125) ve kalın (800), ara başlık ve arayüzde 112/700. Değişken font yerine bu iki kesim `fontTools` ile **sabit dosyalara indirildi** (176 KB → 52 KB).
- Gövde metni Instrument Sans, etiketler JetBrains Mono (klasik tasarımla ortak).
- Caveat yalnızca Seyyah odasında; odalar `content-visibility: auto` olduğu için oda yaklaşmadan indirilmez.
- Yedek fontlar `size-adjust` ile gerçek fontların genişliğine ayarlı (CLS 0).

## Düzen

- Siyah 1px çizgilerle bölünmüş İsviçre afiş ızgarası; kartlar yuvarlak köşeli (16–24px), butonlar hap.
- Başlık soldan, açıklama sağdan alta hizalı (`SectionHead`).
- Her oda tam genişlik; metin ve görsel sırası odadan odaya yer değiştirir.

## Hareket

| Nerede | Ne | Amaç |
|---|---|---|
| Orpigo | Kelime kelime okuma | Ürünün kendisini deneyimletmek |
| CandemFit | Rota scroll'la çizilir | Ürünün "animasyonlu rota" özelliğini anlatmak |
| Kartlar, butonlar | Hover'da 4–8px kayma, renk değişimi | Geri bildirim |

`prefers-reduced-motion`: rota hazır çizili gelir, demo yalnızca ziyaretçi başlatınca oynar.

## Kurallar

- Odalardaki örnek veriler her zaman "örnek" diye etiketlenir.
- Yeni bir ürün eklendiğinde odası yoksa otomatik olarak "yakında" odasıyla gösterilir; kendi odası `src/components/v2/rooms/` altında yazılıp `ProductRooms.tsx`'e eklenir.
