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
| `npm run screenshots -- <url> <klasör> <yollar...>` | Masaüstü + mobil ekran görüntüsü alır. Örn: `npm run screenshots -- http://localhost:3000 screenshots / /projeler` |

## Diller ve adresler

- Türkçe varsayılan dildir ve önek almaz: `/projeler`, `/iletisim`
- İngilizce `/en` altındadır ve İngilizce adres kullanır: `/en/projects`, `/en/contact`
- `/tr/...` adresleri öneksiz Türkçe adrese yönlendirilir.
- Adres eşlemesi tek bir dosyada: `src/i18n/routes.ts`

## İçeriği güncelleme (koda dokunmadan)

Sitedeki tüm metin ve veriler `content/` klasöründedir. Bir dosyayı düzenleyip kaydetmeniz yeterli; yeniden derlemede site güncellenir. Her metin alanında `tr` ve `en` karşılığı vardır.

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

- `tagline` ve `description`: `TODO` metnini gerçek metinle değiştirin.
- `links.appStore`, `links.googlePlay`, `links.web`: dolu olan linkler buton olarak görünür.
- `status`: `live` (yayında) veya `soon` (yakında).
- `platforms`: `ios`, `android`, `web`.
- `icon`: `public/products/` altına koyduğunuz ikonun yolu, örn. `/products/orpigo.png`.

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

Altına normal Markdown yazın. Yalnızca bir dilde yazı varsa, o yazı yalnızca o dilin blog listesinde görünür.

### Arayüz metinleri

Menü, buton, form ve hata metinleri `content/locales/tr.json` ve `en.json` dosyalarındadır. İki dosyadaki anahtarlar aynı olmalıdır.

## İletişim formu

Form şimdilik bir sunucuya gönderim yapmaz. Entegrasyon noktası ve nasıl bağlanacağı form aşamasında burada belgelenecek.

## Deploy

Hedef platform Vercel. Deploy, onay alınmadan yapılmaz (bkz. 8. aşama).
