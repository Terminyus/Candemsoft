# Candemsoft — Sanat Yönetimi

Bu belge sitenin görsel ve hareket dilini tanımlar. Yeni bir bileşen ya da bölüm eklerken önce buraya bakın; bir karar burada yoksa ya da burayla çelişiyorsa, önce bu belgeyi güncelleyin.

## Fikir: "Konsol ve şartname"

Candemsoft bir yazılım ekibi. Ziyaretçiye "biz de bir yazılım ürünü gibi düşünüyoruz" hissini vermek istiyoruz, ama bunu neon ışıklar ve uzay temalı gradyanlarla değil, **iyi yapılmış bir geliştirici aracının netliğiyle** yapıyoruz.

Site iki yüzeyden oluşur:

- **Konsol (koyu):** komut, hareket, etkileşim. Hero, terminal, proje vitrini, iletişim çağrısı.
- **Şartname (açık):** okuma, açıklama, detay. Hizmet açıklamaları, case study metinleri, blog, hakkımızda.

Bölümler bu iki yüzey arasında gidip gelir. Bu, her bölümün aynı kalıpta görünmesini engelleyen ana kontrast aracıdır: renk değişimi = bağlam değişimi.

## Renk

Logo, **turuncu bir işaret ve beyaz bir yazıdan** oluşuyor; yani markanın gerçek imza rengi mavi değil, turuncu. Eski sitedeki `#2563eb` mavisini atmıyoruz ama rolünü değiştiriyoruz.

| Token | Değer | Rol |
|---|---|---|
| `ink-950` | `#0E0D0B` | Konsol zemini. Saf siyah değil, hafif sıcak; turuncuyla kavga etmez. |
| `ink-900` | `#161512` | Konsol üstündeki yüzeyler (terminal penceresi, kart). |
| `ink-800` | `#24221E` | Konsol çizgileri, ayraçlar. |
| `ink-600` | `#4A463F` | Konsolda pasif metin, kenarlıklar (dekoratif). |
| `stone-400` | `#A39D91` | Konsolda ikincil metin (ink-950 üzerinde 7.2:1). |
| `stone-600` | `#5F5A50` | Şartnamede ikincil metin (paper üzerinde 6.0:1). |
| `paper-50` | `#FBFAF7` | En açık yüzey (form alanı, kart). |
| `paper-100` | `#F3F0EA` | Şartname zemini. Kâğıt tonu; beyazdan daha az yorucu, baskı hissi verir. |
| `paper-200` | `#E6E1D7` | Şartname çizgileri. |
| `signal` | `#F85404` | **Logodan ölçüldü.** Birincil vurgu: CTA, imleç, aktif durum, focus halkası. |
| `ember` | `#B93F05` | Açık zeminde turuncu metin gerektiğinde (paper-100 üzerinde 4.9:1). |
| `cobalt` | `#6B9BFF` | Eski marka mavisinin yeniden yorumu. Yalnızca terminal çıktısında "dizin/bağlantı" rengi ve veri vurgusu (ink-900 üzerinde 6.75:1). Terminallerde mavi geleneksel olarak dizin rengidir; mavi böylece rastgele değil, anlamlı bir yerde yaşar. |
| `mint` | `#4ADE80` | Yalnızca terminalde "başarılı" çıktı (✓). |

Kurallar:

- **Gradyan yok.** Tek istisna: görsellerin altına okunabilirlik için konan düz siyah→şeffaf karartma.
- **Glassmorphism yok.** Bulanık arka plan yalnızca menü/terminal açıkken arkayı karartmak için, o da düşük yoğunlukta.
- Turuncu bir sayfada **az** görünmeli. Her ekranda en fazla bir veya iki turuncu öğe. Az olduğu için görünür.
- Açık zeminde küçük metin asla `signal` ile yazılmaz (kontrast 2.95:1); `ember` kullanılır.

## Tipografi

| Rol | Font | Neden |
|---|---|---|
| Başlık ve metin | **Schibsted Grotesk** (variable `wght`): başlıklarda 800, metinde 400 | Haber grotesk'i: kalın kesimi karakterli ve kararlı, metin boyutunda sakin. Türkçe aksanlar (İ, Ğ, Ş) geniş ve temiz. Tek aile iki rolü taşıyor; başlıkla metin arasındaki kontrast ağırlıktan ve boyuttan geliyor. |
| Kod / etiket | **JetBrains Mono** | Terminal, komut, meta bilgi (tarih, kategori, numaralandırma). Mono font sitede "makine sesi" rolündedir; insan sesi ise metin fontudur. |

> **Değişiklik (2026-10-05):** İlk sürümde başlıklar Bricolage Grotesque'in dar (wdth 88) kesimiydi, metin Instrument Sans'tı. Dar kesim Türkçede harfleri sıkışık gösterdiği için geri bildirimle Schibsted Grotesk'e geçildi. Font `next/font` ile yüklenir; yedek font metrikleri otomatik ayarlanır.

Fontların hepsi Google Fonts'ta `latin-ext` alt kümesine sahip: **ğ, ü, ş, ı, İ, ö, ç** ve İspanyolca karakterler eksiksiz.

### Ölçek

Akışkan ölçek (`clamp`), 360px → 1440px arası:

| Token | Mobil → Masaüstü | Kullanım |
|---|---|---|
| `display` | 56 → 168px, `line-height: .92` (Türkçe büyük harf aksanları satırlar arasında çakışmasın diye), `tracking: -0.04em` | Yalnızca hero ve bölüm açılışlarında, sayfa başına bir kez. |
| `h1` | 40 → 96px, `lh .98` | Sayfa başlığı. |
| `h2` | 32 → 64px, `lh 1` | Bölüm başlığı. |
| `h3` | 22 → 32px, `lh 1.1` | Kart/alt başlık. |
| `lead` | 18 → 24px, `lh 1.4` | Giriş paragrafı. |
| `body` | 16 → 18px, `lh 1.6` | Metin. |
| `mono-sm` | 12 → 13px, `tracking: .02em`, büyük harf **değil** | Etiketler. |

### Türkçe büyük/küçük harf

- CSS `text-transform: uppercase` **kullanılmaz**. Tarayıcı `lang` özniteliğine göre doğru dönüşüm yapsa da (tr: i→İ), bileşen başka dilde render edildiğinde hata yapar. Büyük harf gerekiyorsa metin kaynağında büyük yazılır ya da `toLocaleUpperCase(locale)` kullanılır.
- `<html lang>` her zaman doğru dile ayarlanır (`tr` / `en`).
- Arama ve terminal komut eşleştirmesi `toLocaleLowerCase('tr')` + aksan normalizasyonu ile yapılır: `İletişim`, `iletisim`, `ILETISIM` aynı komuttur.

## Grid ve boşluk

- **12 kolon** masaüstü, **6 kolon** tablet, **4 kolon** mobil. Gutter 24px (mobil 16px).
- Dış kenar boşluğu: `clamp(16px, 4vw, 64px)`. Maksimum içerik genişliği 1440px; tam genişlik bölümler (proje vitrini) bu sınırı aşabilir.
- **Asimetri kuralı:** metin blokları nadiren 1. kolondan başlar ve nadiren ortalanır. Varsayılan düzenler: `3–9`, `1–5 / 7–12`, `5–12`. Ortalanmış blok yalnızca 404'te.
- **Boşluk ritmi** 4px tabanlı. Bölüm içi: 8/12/16/24/32/48. Bölümler arası: `section-sm` 80px, `section` 128px, `section-lg` 192px (masaüstü; mobilde ~%60). Her bölüm aynı boşlukla ayrılmaz: yoğun içerikten sonra büyük nefes, ilişkili iki bölüm arasında küçük.
- Kenarlıklar 1px, köşe yarıçapı **en fazla 4px**. Yuvarlak "pill" yalnızca küçük etiketlerde. Büyük yuvarlak kartlar yok.

## Hareket dili

Tek cümle: **"Komut verilir, sistem yerine oturur."** Hareketler hızlı başlar, yumuşak durur; hiçbir şey zıplamaz.

| Token | Değer | Kullanım |
|---|---|---|
| `ease-out` | `cubic-bezier(0.2, 0.8, 0.2, 1)` | Varsayılan giriş. |
| `ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | Sayfa/panel geçişi. |
| `dur-1` | 120ms | Geri bildirim (hover, basma). |
| `dur-2` | 240ms | Arayüz (menü, terminal açılması). |
| `dur-3` | 600ms | Anlatım (başlık açılışı, görsel geçişi). |

Her animasyonun bir **amacı** olmalı:

| Amaç | Örnek |
|---|---|
| Yönlendirme | Terminalde komut çalışınca hedef bölüme kaydırma; proje kartı → detay sayfasına görsel morph (View Transitions). |
| Geri bildirim | Buton basma, filtre değişince kartların yeniden dizilmesi (layout animasyonu), form doğrulama. |
| Anlatım | Hizmetler bölümünde scroll'a bağlı ilerleme (GSAP ScrollTrigger); hero başlığının satır satır açılması. |

Yasaklar:

- Her bölümün aynı fade-up ile girmesi. Bölüm başına giriş biçimi farklı ve gerekçeli; çoğu bölümün **hiç** giriş animasyonu yoktur.
- Yalnızca `transform` ve `opacity`. `width/height/top/left` animasyonu yok.
- İçerik animasyon bitene kadar gizli kalmaz. Sunucudan gelen HTML her zaman görünür durumdadır; animasyon JS yüklendikten sonra "üstüne" eklenir. JS yoksa ya da yavaşsa site eksiksizdir.
- `prefers-reduced-motion: reduce` → tüm scroll anlatımları devre dışı, geçişler anlık, Lenis kapalı, terminal yazma efekti yok.

## İmza öğe: `candem.sh`

Eski sitedeki terminal bir süstü (önceden yazılmış komutlar oynuyordu). Yenisinde terminal **gerçekten çalışır**:

- Ana sayfa hero'sunda görünür ve yazılabilir bir prompt: `ziyaretci@candemsoft:~$`.
- Her sayfadan `⌘K` / `Ctrl+K` / `/` ile açılan aynı terminal (komut paleti modu).
- Komutlar: `projeler`, `ekip`, `hizmetler`, `urunler`, `iletisim`, `blog`, `ls`, `open <proje>`, `cat <hizmet>`, `mail`, `whatsapp`, `lang en`, `help`, `clear`. Türkçe ve İngilizce eşanlamlılar çalışır; Türkçe karakterli/karaktersiz yazım fark etmez.
- Yazarken otomatik tamamlama önerileri (Tab ile kabul). Tanınmayan komutta kibar bir "bunu mu demek istediniz?" önerisi.
- Klavyesiz kullanıcılar için öneriler tıklanabilir buton olarak da görünür. Ekran okuyucu için çıktı alanı `aria-live="polite"`.

Terminal sitenin "nasıl çalıştığımızı" anlatan tek yerdir: lafla değil, kullanımla.

## Görseller

- Projelerde **yalnızca gerçek ekran görüntüleri** (Playwright ile, masaüstü + mobil). İllüstrasyon, stok fotoğraf, 3D obje yok.
- Ekran görüntüleri sade bir tarayıcı/cihaz çerçevesinde değil, **çıplak** ve ince bir kenarlıkla gösterilir; iş konuşsun.
- Ekip fotoğrafı yoksa: Bricolage ile çizilmiş baş harf monogramı, kişiye özgü (isimden türetilen) kolon konumu ve ton farkıyla.

## İkonlar

- Emoji yok. İkon seti minimum: ok (`↗`, `→`), artı, kapat, menü. Ok karakterleri metin fontundan gelir; ayrı ikon kütüphanesi yok.
- Hizmetleri ikonla değil, **numara ve mono etiketle** ayırıyoruz (`01 / web`).

## Ses tonu (metin)

- Kısa, somut, birinci çoğul şahıs. "Yenilikçi çözümler" değil, "Altem için ürün, stok ve sipariş akışını tek panelde topladık."
- Boş sıfat yasak listesi: *yenilikçi, öncü, lider, geleceği inşa, bir üst seviye, dijital dönüşüm yolculuğu, uçtan uca mükemmellik*.
- Kanıtlanabilir rakamlar: yalnızca **50+ proje** ve **3+ yıl**. Diğer her şey için onay gerekir.

## Hareket envanteri

Sitedeki her animasyon ve neden var olduğu. Buraya yazılmayan animasyon eklenmez.

| Nerede | Ne | Amaç | Teknik |
|---|---|---|---|
| Hero başlığı | Satırlar 0.14em aşağıdan yerine oturur, turuncu nokta düşer | Anlatım: "komut verilir, sistem yerine oturur" | Yalnızca CSS `transform`; metin ilk karede görünür, LCP gecikmez |
| `candem.sh` | Tıklanan komut input'a yazılır, sonra çalışır | Geri bildirim: tıklamak ile yazmanın aynı şey olduğunu öğretir | `setInterval`, en fazla ~300ms; reduced-motion'da anında |
| `candem.sh` | Çalışan komut "→ hedef" yazar, 280ms sonra gider | Yönlendirme: nereye gidildiği görülür | reduced-motion'da 0ms |
| Komut paleti | Hafif aşağı kayarak ve belirerek açılır | Yönlendirme: katmanın üstte olduğu anlaşılır | CSS `@keyframes` (opacity + transform) |
| Ana sayfa, Hizmetler | Ekranın ortasından geçen hizmet "aktif" olur, diğer başlıklar geri çekilir; sayaç ve ilerleme çizgisi | Anlatım: uzun listede nerede olunduğu | GSAP ScrollTrigger (hydration sonrası dinamik import), `opacity` + `scaleX` |
| Proje kartı / liste → detay | Ekran görüntüsü yeni sayfadaki yerine morph olur | Yönlendirme: aynı işe bakıldığı kopmadan anlaşılır | React `<ViewTransition>` + View Transitions API; desteklemeyen tarayıcıda normal geçiş |
| Projeler listesi | İmleçle dikeyde ilerleyen ekran görüntüsü önizlemesi | Geri bildirim: tıklamadan önce işi görmek | Motion `useSpring`, yalnızca `transform`; dokunmatik cihazda yok |
| Projeler filtresi | Satırlar yeni düzene kayar | Geri bildirim: filtrenin neyi değiştirdiği | Motion `layout` |
| Header | Aşağı okurken gizlenir, yukarı kaydırınca döner | Yönlendirme: okuma alanı + her an erişilebilir menü | CSS `transform` |
| Mobil menü | Linkler sırayla belirir | Yönlendirme | Motion, 30ms aralık |
| Butonlar, listeler | Ok 4px kayar, satır başlığı 8px kayar | Geri bildirim (hover) | CSS `transform`, 120–240ms |
| Terminal imleci | Yanıp söner | Geri bildirim: burası yazılabilir | CSS; reduced-motion'da sabit |

**Lenis kullanılmadı.** Scroll anlatımı tek bir bölümde ve native scroll ile sorunsuz çalışıyor. Yumuşak kaydırma kütüphanesi kullanıcının kaydırma hızını ve işletim sistemi ayarlarını ezer, ekstra JS yükler; burada karşılığında bir şey kazandırmıyor.

`prefers-reduced-motion: reduce` açıkken: başlık, palet ve terminal yazma efekti yok; View Transitions animasyonu yok; geçiş süreleri ~0. Hizmetler bölümündeki aktif satır vurgusu kalır (hareket değil, durum).
