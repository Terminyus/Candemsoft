# SEO Görevleri — candemsoft.com
Hazırlayan: Claude, 2026-10-22. Kaynak: Search Console (sc-domain:candemsoft.com) + canlı site taraması.
Antigravity'ye talimat: Aşağıdaki maddeleri sırayla uygula. Her madde için önce mevcut durumu doğrula, sonra değiştir. Dağıtımı (sunucuya gönderme) yapma; yalnız yerel dosyaları değiştir ve değişikliklerin özetini ver.

## Mevcut durum
- Site haritası başarılı (116 URL), dizine eklenen 75, eklenmeyen 14 sayfa. 3 ayda toplam 1 tıklama.
- title/description/canonical/OG/JSON-LD (Organization, WebSite) mevcut, robots.txt var.

## Görevler
1. [P1] Dizine eklenmeyen 14 sayfanın nedenini bul (Search Console > Sayfa dizinleme). Sitemap'teki her URL'yi 200 ve self-canonical için kontrol et; sitemap'ten 404/redirect/noindex olanları çıkar.
2. [P1] Her sayfaya benzersiz title (≤60 karakter) ve description (120-160 karakter) ver; çift olanları listele.
3. [P1] TR/EN çiftleri için `hreflang` (tr, en, x-default) ekle; yoksa karşılıklı olduğunu doğrula.
4. [P2] JSON-LD'ye `LocalBusiness`/`ProfessionalService`, blog yazılarına `Article`, sayfalara `BreadcrumbList` ekle. Rich Results mantığıyla doğrula.
5. [P2] Hizmet sayfalarına yerel anahtar kelimeler (İstanbul + hizmet adı) ve iç link yapısı: ana sayfadan her hizmete, her hizmetten ilgili blog/vaka yazısına.
6. [P2] Core Web Vitals: görsellere width/height, `next/image` + modern format, kritik olmayan JS'i ertele. Lighthouse mobil çıktısını rapora ekle.
7. [P3] `www` → apex 301 yönlendirmesini doğrula. `/styleguide` zaten robots'ta kapalı, sitemap'te olmadığını doğrula.
