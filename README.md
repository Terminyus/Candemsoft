# Candemsoft

Candemsoft kurumsal web sitesi. Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Motion, GSAP.

Tasarım kararları ve gerekçeleri için: [DESIGN.md](DESIGN.md)

## Kurulum

Gereksinim: Node.js 20.9 veya üstü.

```bash
npm install
npx playwright install chromium   # yalnızca ekran görüntüsü almak için
```

## Komutlar

| Komut | Ne yapar |
|---|---|
| `npm run dev` | Geliştirme sunucusu: http://localhost:3000 |
| `npm run build` | Üretim derlemesi (tüm sayfalar statik üretilir) |
| `npm run start` | Derlenmiş siteyi yerelde çalıştırır |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript kontrolü |
| `npm run format` | Prettier ile biçimlendirme |
| `npm test` | Birim testleri (terminal komut motoru) |
| `npm run test:a11y -- <url>` | axe-core ile WCAG 2.1 AA taraması, tüm sayfalar, masaüstü + mobil |
| `npm run test:lighthouse -- <url>` | Mobil Lighthouse; herhangi bir kategori 90'ın altına düşerse başarısız olur (önce `npm run build && npm start`) |
| `npm run capture:projects` | Canlı projelerin ekran görüntülerini alır (aşağıya bakın) |
| `npm run screenshots -- <url> <klasör> <yollar...>` | Masaüstü + mobil ekran görüntüsü alır. Örn: `npm run screenshots -- http://localhost:3000 screenshots / /projeler` |

## Diller ve adresler

- Türkçe varsayılan dildir ve önek almaz: `/projeler`, `/iletisim`
- İngilizce `/en` altındadır ve İngilizce adres kullanır: `/en/projects`, `/en/contact`
- İspanyolca `/es` altındadır ve İspanyolca adres kullanır: `/es/proyectos`, `/es/contacto`
- `/tr/...` adresleri öneksiz Türkçe adrese yönlendirilir.
- Adres eşlemesi tek bir dosyada: `src/i18n/routes.ts`

## İçeriği güncelleme (koda dokunmadan)

Sitedeki tüm metin ve veriler `content/` klasöründedir. Bir dosyayı düzenleyip kaydetmeniz yeterli; yeniden derlemede site güncellenir. Her metin alanında `tr`, `en` ve `es` karşılığı vardır.

```
content/
├── site.json          İletişim bilgileri, rakamlar, sosyal medya
├── services.json      Hizmetler
├── stack.json         Kullandığımız teknolojiler
├── products.json      Kendi ürünlerimiz
├── team.json          Ekip
├── projects/          Her müşteri projesi için bir dosya
├── blog/              Blog yazıları (MDX)
└── locales/           Arayüz metinleri (menü, butonlar, hata mesajları)
```

Dosyalardaki `_todo` ve `_draft` alanları yalnızca not içindir; sitede gösterilmez. **`TODO` ile başlayan metinler** sitede "içerik bekleniyor" olarak işaretlenir.

### Yeni proje eklemek

1. `content/projects/` içindeki bir dosyayı kopyalayın, adını projenin kısa adıyla değiştirin (örn. `yeni-proje.json`).
2. `slug` alanı dosya adıyla aynı olmalı; adres `/projeler/<slug>` olur.
3. `categories`: `web`, `mobil`, `kurumsal`, `e-ticaret` değerlerinden bir veya birkaçı. Projeler sayfasındaki filtreler bunu kullanır.
4. `order`: listede kaçıncı sırada görüneceği. `featured: true` olanlar ana sayfada görünür.
5. `status`: `live` (yayında) veya `offline`. Yayında olmayan projeler listede kalır ama "siteye git" butonu ve ekran görüntüsü gösterilmez.
6. Görseller `public/projects/<slug>/desktop.webp` ve `mobile.webp`. Canlı sitelerden otomatik almak için:

   ```bash
   npm run capture:projects              # tüm yayındaki projeler
   npm run capture:projects -- proox     # yalnızca biri
   ```

   Betik çerez banner'larını gizler (kabul etmez). **Çıktıya mutlaka bakın:** bir site 200 dönüp park sayfası, hosting hatası ya da bot doğrulaması gösterebilir. Öyleyse o projenin `status` alanını `offline` yapın ve görselleri silin.
7. `caseStudy` altındaki `challenge`, `approach`, `outcome` alanları doluysa detay sayfasında ilgili bölüm görünür; boşsa hiç gösterilmez.

### Ürün bilgisi eklemek

`content/products.json` içinde ilgili ürünü bulun:

- `tagline`, `description`: kısa tanım ve açıklama (`tr` / `en` / `es`).
- `features`: "Öne çıkanlar" listesi, her dil için bir dizi.
- `project`: `content/projects` içindeki eşleşen projenin `slug`'ı; ürün sayfasında o projenin ekran görüntüleri ve "Proje sayfası" linki gösterilir.
- `links.appStore`, `links.googlePlay`, `links.web`: dolu olan linkler buton olarak görünür.
- `status`: `live` (yayında) veya `soon` (yakında).
- `platforms`: `ios`, `android`, `web`.
- `icon`: `public/products/` altına koyduğunuz ikonun yolu, örn. `/products/orpigo.png` (kare, en az 256×256).

### Ekip

`content/team.json` içindeki `members` listesinde her kişi için:

- `name`, `role`, `bio` (`tr` / `en`), `links.linkedin`, `links.github`
- `photo`: `public/team/` altına koyduğunuz fotoğrafın yolu, örn. `/team/ad-soyad.jpg`. Boşsa baş harflerden monogram gösterilir.
- Gerçek bilgiyi girdikten sonra `"placeholder": true` satırını silin.

### Blog yazısı eklemek

`content/blog/` içine iki dosya ekleyin: `<slug>.tr.mdx` ve `<slug>.en.mdx`. Dosyanın başında şu blok olmalı:

```js
export const meta = {
  title: "Başlık",
  description: "Arama sonuçlarında görünecek kısa açıklama",
  date: "2026-10-05",
  author: "Candemsoft",
  tags: ["frontend"]
};
```

Altına normal Markdown yazın. İspanyolca için `<slug>.es.mdx`. Yalnızca bir dilde yazı varsa, o yazı yalnızca o dilin blog listesinde görünür.

### Arayüz metinleri

Menü, buton, form ve hata metinleri `content/locales/tr.json`, `en.json` ve `es.json` dosyalarındadır. Üç dosyadaki anahtarlar aynı olmalıdır.

## İletişim formu

Entegrasyon noktası: `src/lib/contact.ts`.

- `NEXT_PUBLIC_CONTACT_ENDPOINT` ortam değişkeni **tanımlı değilse** (şu anki durum): form doğrulanır, sonra ziyaretçinin e-posta uygulaması mesaj önceden doldurulmuş olarak açılır. Sunucu gerekmez.
- **Tanımlıysa**: form verisi o adrese JSON olarak `POST` edilir (`name`, `email`, `phone`, `topic`, `message`, `locale`). Formspree, bir Vercel Function, CRM webhook'u vb. kullanılabilir. 2xx dışı yanıtta kullanıcıya hata mesajı ve doğrudan e-posta adresi gösterilir.

Form; zorunlu alan doğrulaması, hata durumunda ilk hatalı alana odak, bot tuzağı (honeypot) ve KVKK onay kutusu içerir.

## Kalite

- Lighthouse (mobil) hedefi: dört kategori de ≥ 90. Son ölçümler PR açıklamalarında.
- Erişilebilirlik: `npm run test:a11y` sıfır ihlal vermeli.
- `prefers-reduced-motion` açıkken animasyonlar kapanır; JS kapalıyken tüm içerik ve gezinme çalışır.

## GitHub Pages (paylaşım kopyası)

Yayında: **https://terminyus.github.io/Candemsoft/**

Sitenin statik bir kopyası `gh-pages` dalından yayınlanır. Güncellemek için:

```bash
npm run build:pages
cd out && git init -q -b gh-pages && git add -A && git commit -qm "deploy" && git push -f https://github.com/Terminyus/Candemsoft.git gh-pages && rm -rf .git && cd ..
```

Pages sunucu çalıştırmadığı için bu kopyada adresler dil önekini ve Türkçe segmenti taşır (`/tr/projeler`, `/en/projeler`, `/es/projeler`). Güvenlik başlıkları ve görsel optimizasyonu yoktur. Asıl yayın hedefi Vercel'dir (aşağıda).

## Deploy (Vercel)

Yapılandırma hazır, **henüz deploy edilmedi.**

1. Vercel'de *Add New → Project* ile bu GitHub reposunu içe aktarın. Framework otomatik olarak Next.js algılanır; ek ayar gerekmez (`vercel.json`: bölge `fra1` / Frankfurt).
2. *Environment Variables*: form için bir uç nokta kullanılacaksa `NEXT_PUBLIC_CONTACT_ENDPOINT` (bkz. `.env.example`). Boş bırakılırsa form e-posta uygulamasını açar.
3. İlk deploy bir önizleme adresinde (`*.vercel.app`) açılır; orada kontrol edin.
4. *Settings → Domains*: `candemsoft.com` ve `www.candemsoft.com` ekleyin, Vercel'in verdiği DNS kayıtlarını alan adı sağlayıcınızda girin. `www` → kök alan adına yönlendirme önerilir.
5. Yayından sonra: Google Search Console'a `https://candemsoft.com/sitemap.xml` gönderin; `npm run test:lighthouse -- https://candemsoft.com` ile tekrar ölçün.

CI iş akışı hazır ama henüz etkin değil: `docs/ci/ci.yml`. Her PR'da lint, tip kontrolü, birim testleri, üretim derlemesi ve axe erişilebilirlik taramasını çalıştırır. Etkinleştirmek için (GitHub CLI token'ına `workflow` izni gerekir):

```bash
gh auth refresh -s workflow
git mv docs/ci/ci.yml .github/workflows/ci.yml && git commit -m "ci: enable GitHub Actions" && git push
```

Güvenlik başlıkları `next.config.ts` içinde: HSTS, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, `frame-ancestors 'none'`. Tam script CSP'si nonce ve dinamik render gerektirdiği için eklenmedi (tüm sayfalar statik).

## Yayın öncesi kontrol listesi

- [ ] Ürün metinleri ve mağaza linkleri (`content/products.json`, şu an `TODO`)
- [ ] Ekip bilgileri ve fotoğraflar (`content/team.json`, şu an yer tutucu)
- [ ] Yayında olmayan 5 proje için karar: listede kalsın mı? (`status: "offline"`)
- [ ] Proje case study metinleri (isteğe bağlı, `caseStudy`)
- [ ] Gizlilik / KVKK metninin hukuki incelemesi (`content/legal/`)
- [ ] Sosyal medya linkleri (`content/site.json`)
- [ ] Form uç noktası (isteğe bağlı)
