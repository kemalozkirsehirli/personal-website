# Personal Essay + CV Website

Bu repo; essaylerini, CV’ni, projelerini ve fotoğraflarını yayınlamak için sıfır bağımlılıklı, hızlı, mobil uyumlu, statik bir kişisel web sitesi üretir.

Özellikler:

- Essay sistemi: `src/content/essays/*.md` dosyalarından otomatik sayfa üretir.
- CV sayfası: `src/content/cv.md` dosyasından HTML CV üretir.
- Proje kartları: `src/data/projects.json` üzerinden yönetilir.
- Fotoğraf galerisi: `src/data/photos.json` ve `public/photos/` üzerinden yönetilir.
- SEO: canonical URL, Open Graph, JSON-LD, sitemap ve RSS üretir.
- Dark/light tema, responsive tasarım, essay filtreleme.
- GitHub Pages, Netlify ve Vercel deploy ayarları hazır.
- Dış paket yok. `npm install` neredeyse sadece lockfile doğrular.

## 1) Lokal çalıştırma

Node.js 18.18+ kurulu olsun.

```bash
npm install
npm run check
npm run dev
```

Tarayıcıda aç:

```txt
http://localhost:4173
```

`npm run dev` dosyaları izler, değişiklikte tekrar build alır. Tarayıcıyı yenilemen yeterli.

## 2) Kişiselleştirme

Ana ayar dosyası:

```txt
src/data/site.json
```

Önce şunları değiştir:

```json
{
  "url": "https://your-domain.com",
  "basePath": "",
  "title": "Your Name",
  "description": "Essays, research, projects, CV, and photography.",
  "author": {
    "name": "Your Name",
    "role": "MIT rising senior · CADD-AI for Science researcher",
    "email": "you@example.com"
  }
}
```

### GitHub Pages project sitesi kullanacaksan

Repo URL’in şu tipteyse:

```txt
https://USERNAME.github.io/REPO_NAME/
```

`src/data/site.json` içinde:

```json
{
  "url": "https://USERNAME.github.io/REPO_NAME",
  "basePath": "/REPO_NAME"
}
```

Kendi domain’in varsa veya repo `USERNAME.github.io` ise:

```json
{
  "url": "https://senindomainin.com",
  "basePath": ""
}
```

## 3) Essay eklemek

Yeni dosya oluştur:

```txt
src/content/essays/yeni-essay.md
```

Şablon:

```md
---
title: "Essay Başlığı"
description: "Tek cümlelik özet."
date: "2026-06-12"
tags: ["Research", "Life"]
draft: false
cover: "/photos/notebook.svg"
---

Buraya yaz.
```

Notlar:

- `draft: true` yaparsan essay build’e girmez.
- Dosya adı URL olur: `yeni-essay.md` → `/essays/yeni-essay/`.
- Görsel yolu `/photos/...` şeklinde olmalı ve dosya `public/photos/` altında bulunmalı.

## 4) CV düzenlemek

CV içeriği:

```txt
src/content/cv.md
```

PDF CV de koymak istersen:

1. PDF dosyanı `public/files/cv.pdf` olarak ekle.
2. `src/data/site.json` içinde şu alanı doldur:

```json
"resumePdf": "/files/cv.pdf"
```

Sonra:

```bash
npm run check
```

## 5) Proje eklemek

`src/data/projects.json` dosyasına yeni kart ekle:

```json
{
  "title": "Project title",
  "status": "Active",
  "description": "What the project does and why it matters.",
  "tags": ["AI", "Science"],
  "links": [
    { "label": "GitHub", "url": "https://github.com/username/repo" }
  ]
}
```

## 6) Fotoğraf eklemek

1. Fotoğrafını `public/photos/` içine koy: örnek `public/photos/lab.jpg`.
2. `src/data/photos.json` içine ekle:

```json
{
  "src": "/photos/lab.jpg",
  "alt": "Short accessible description",
  "caption": "Caption shown under the photo",
  "year": "2026"
}
```

## 7) Production build

```bash
npm run build
```

Çıktı klasörü:

```txt
dist/
```

## 8) GitHub’a gönderme

GitHub’da boş bir repo oluştur. Sonra lokal klasörde:

```bash
git init
git add .
git commit -m "Initial personal site"
git branch -M main
git remote add origin git@github.com:USERNAME/REPO_NAME.git
git push -u origin main
```

HTTPS kullanıyorsan remote şu formda olur:

```bash
git remote add origin https://github.com/USERNAME/REPO_NAME.git
```

## 9) Deploy seçenekleri

### Seçenek A — GitHub Pages, önerilen basit akış

Bu repo `.github/workflows/deploy.yml` içerir. Push sonrası `npm run build` çalışır ve `dist/` GitHub Pages’e deploy edilir.

GitHub’da:

1. Repo → **Settings** → **Pages**.
2. **Build and deployment** → **Source**: **GitHub Actions** seç.
3. `main` branch’e push yap.
4. Repo → **Actions** kısmından deploy’un yeşile dönmesini bekle.

### Seçenek B — Netlify

Netlify’da “Add new project” → GitHub repo’nu seç.

Ayarlar:

```txt
Build command: npm run build
Publish directory: dist
```

`netlify.toml` bu ayarları zaten içeriyor.

### Seçenek C — Vercel

Vercel’da “New Project” → GitHub repo’nu seç.

Ayarlar:

```txt
Build Command: npm run build
Output Directory: dist
```

`vercel.json` bu ayarları zaten içeriyor.

## 10) Yayına almadan önce son kontrol

```bash
npm run check
```

Kontrol şunları yapar:

- Build alır.
- Ana sayfa, essay, proje, CV ve fotoğraf sayfalarının üretildiğini doğrular.
- Üretilen HTML içindeki local linkleri tarar.
- Kırık internal link varsa hata verir.

## Dosya haritası

```txt
.
├── .github/workflows/deploy.yml
├── public/
│   ├── favicon.svg
│   ├── og-image.svg
│   ├── files/
│   └── photos/
├── scripts/
│   ├── build.mjs
│   ├── check.mjs
│   ├── dev.mjs
│   └── serve.mjs
├── src/
│   ├── content/
│   │   ├── cv.md
│   │   └── essays/
│   ├── data/
│   │   ├── photos.json
│   │   ├── projects.json
│   │   └── site.json
│   ├── scripts/main.js
│   └── styles/main.css
├── LICENSE
├── netlify.toml
├── package.json
└── vercel.json
```

## Net kural

Gizli bilgi koyma. GitHub Pages siteleri public erişilebilir olur; private repo kullansan bile yayınlanan site internete açıktır. CV’de telefon, ev adresi, kişisel ID gibi bilgileri gereksizse koyma.
