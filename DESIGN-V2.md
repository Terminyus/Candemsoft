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
| Turuncu | `#F85404` | Logodan. Yapısal bloklar (CTA, "yakında" odası), vurgu |

Odalarda o ürünün kendi renkleri geçerlidir (logolardan ölçüldü):

| Oda | Renkler | Karakter |
|---|---|---|
| Seyyah | Mürekkep `#1F4FBF`, kâğıt `#FAF8F3` | Yenilenen seyyah.info'ya göre: spiralli defter sayfası, kendini çizen rota ve GPS damgası, uygulamanın karakalem Galata çizimi (polaroid), soluk Türkiye karakalem manzarası, toplanan etiketler ve odaya yürüyen ayak izleri. El yazısı satırın altında mürekkep çizgisi (Caveat). |
| Orpigo | Lacivert `#101838`, kırmızı `#E80820` | Uygulamanın hız çizgileri. **Çalışan bir hız okuma demosu**: kelimeler tek tek akar, ORP harfi kırmızı ve sabit bir kılavuzun altında durur. Ziyaretçi başlatmadan oynamaz. |
| Kişisel QR | Siyah, sarı `#F8D008` | Noktalı ızgara. **Taranabilir gerçek bir QR** (derleme sırasında üretilir, kisiselqr.com'u açar) ve "örnek profil" kartı. |
| CandemFit | Gece `#000810`, turkuaz `#00D8D8` | Sokak ızgarası üzerinde scroll'la çizilen GPS rotası (CSS scroll-driven animation), "örnek" etiketli antrenman verisi. |
| Candemkey | Gece `#070B1A`, mor → mavi → camgöbeği | candemkey.com'daki gibi parlayan yay. **Çalışan AI paneli**: beş düğmeden biri seçilince taslak cümle yeniden yazılır (örnekler candemkey.com'un kendi örnekleri). Türkçe Q klavye ve AI tuşu. Uygulama mağazalarda "yakında", site canlı. |

## Tipografi

- **Archivo**, genişlik ekseni sayesinde tek aile iki ses: başlıklarda geniş (wdth 125) ve kalın (800), ara başlık ve arayüzde 112/700. Değişken font yerine bu iki kesim `fontTools` ile **sabit dosyalara indirildi** (176 KB → 52 KB).
- Gövde metni Instrument Sans, etiketler JetBrains Mono (klasik tasarımla ortak).
- Caveat yalnızca Seyyah odasında (ağırlığı düşürmek için bağlamsal alternatifleri çıkarılmış alt küme, 71 KB → 44 KB); odalar `content-visibility: auto` olduğu için oda yaklaşmadan indirilmez.
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

| Seyyah | Ayak izleri döngüyle "yürür"; **Buradayım** ile durak durak check-in: GPS doğrulama beklemesi, rotanın bir sonraki ayağı mürekkeplenir, etiket kazanılır, üç durakta "Rota tamam" damgası | Uygulamanın check-in akışını denetmek |
| Candemkey | Klavye taslağı tuş tuş yazar (basılan tuş parlar), AI tuşuna basılır, aksiyon sonucu gelir; sırayla beş aksiyon. Durdur/oynat düğmesi; bir aksiyon seçilince döngü durur; ekran dışında çalışmaz | Klavyenin nasıl kullanıldığını göstermek |

`prefers-reduced-motion` ya da scroll animasyonu desteklemeyen tarayıcı: rotalar ve çizimler hazır çizili gelir, demolar yalnızca ziyaretçi başlatınca oynar.

## Kurallar

- Odalardaki örnek veriler her zaman "örnek" diye etiketlenir.
- Yeni bir ürün eklendiğinde odası yoksa otomatik olarak "yakında" odasıyla gösterilir; kendi odası `src/components/v2/rooms/` altında yazılıp `ProductRooms.tsx`'e eklenir. Uygulaması henüz mağazada olmayan ama sitesi canlı bir ürünün odası `preLaunch` listesine eklenir (Candemkey).
- Odalardaki çizimler ve etiketler ürünlerin kendi sitelerinden alınır (`public/rooms/<ürün>/`).
