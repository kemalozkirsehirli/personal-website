# Kemal Özkırşehirli — Personal Academic Website

Manolis Kellis / old MIT academic homepage hissine yakın, statik, hızlı, dependency-free kişisel akademik site.

Bu final versiyonda:

- Ana domain `https://kemal-ozkirsehirli.com` olarak ayarlandı.
- `basePath` boş bırakıldı; custom domain için doğru ayar bu.
- `public/CNAME` ve root `CNAME` dosyaları `kemal-ozkirsehirli.com` içeriyor.
- Essays ve AI for Science notes şu an publish edilmiyor.
- `src/content/essays/` içinde sadece `.gitkeep` var.
- Ana sayfadan Essays / AI notes tıklanabilir linkleri kaldırıldı; yalnızca “held back” notu olarak görünüyor.
- RSS linki footer’dan kaldırıldı; `feed.xml` boş/uyumlu şekilde üretilmeye devam ediyor.
- CV’den daha fazla içerik homepage ve projects sayfasına dağıtıldı.

## Lokal çalıştırma

```bash
npm install
npm run check
npm run dev
```

Tarayıcıda:

```txt
http://localhost:4173
```

## Desktop’taki GitHub bağlı klasöre kopyalama

Mevcut GitHub repo klasörün:

```txt
~/Desktop/Red/personal-website
```

Zip’i `Downloads` içine indir, sonra:

```bash
TARGET="$HOME/Desktop/Red/personal-website"
ZIP="$HOME/Downloads/askim-personal-site-final-kemal-domain.zip"
TMP="$HOME/Downloads/askim-site-final-update"

test -d "$TARGET" || { echo "Bulamadım: $TARGET"; exit 1; }
test -f "$ZIP" || { echo "Zip yok: $ZIP"; exit 1; }

cd "$HOME/Desktop/Red"
cp -R personal-website "personal-website-backup-$(date +%Y%m%d-%H%M%S)"

rm -rf "$TMP"
mkdir -p "$TMP"
unzip -o "$ZIP" -d "$TMP"

rsync -av --delete \
  --exclude='.git/' \
  --exclude='node_modules/' \
  "$TMP/askim-personal-site/" \
  "$TARGET/"

cd "$TARGET"
npm install
npm run check
npm run dev
```

Site local’da düzgünse:

```bash
Control + C
cd "$HOME/Desktop/Red/personal-website"
git status
git add -A
git commit -m "Finalize personal website for kemal-ozkirsehirli.com"
git push origin main
```

Branch adın `master` ise:

```bash
git push origin master
```

## GitHub Pages deploy

1. Repo → Settings → Pages.
2. Build and deployment → Source: GitHub Actions.
3. Custom domain: `kemal-ozkirsehirli.com`.
4. Save.
5. Actions tab’ında deploy yeşile dönsün.
6. DNS kayıtlarını domain registrar’da ayarla.
7. DNS oturduktan sonra Pages’te Enforce HTTPS seç.

## DNS kayıtları

Apex domain için:

```txt
Type: A
Host: @
Value: 185.199.108.153

Type: A
Host: @
Value: 185.199.109.153

Type: A
Host: @
Value: 185.199.110.153

Type: A
Host: @
Value: 185.199.111.153
```

`www` yönlendirmesi için:

```txt
Type: CNAME
Host: www
Value: YOUR-GITHUB-USERNAME.github.io
```

`YOUR-GITHUB-USERNAME` kısmını GitHub kullanıcı adınla değiştir.

## İçerik düzenleme

Ana kimlik / homepage / spotlight:

```txt
src/data/site.json
```

Projeler:

```txt
src/data/projects.json
```

CV:

```txt
src/content/cv.md
```

Fotoğraflar:

```txt
public/photos/
src/data/photos.json
```

PDF CV:

```txt
public/files/kemal-ozkirsehirli-cv-2026.pdf
```

## Sonra essay eklemek

Essayler şu an bilerek kapalı. Açmak istediğinde:

1. `src/content/essays/yeni-essay.md` ekle.
2. `src/data/site.json` içinde `enableFeed` değerini `true` yap.
3. Nav içine Essays linkini geri koy:

```json
{ "label": "Essays", "url": "/essays/" }
```

4. Writing directory’deki disabled notları gerçek linklerle değiştir.

Essay şablonu:

```md
---
title: "Essay Başlığı"
description: "Tek cümlelik özet."
date: "2026-06-12"
tags: ["AI for Science"]
draft: false
cover: "/photos/notebook.svg"
---

Buraya yaz.
```

## Kontrol

Her deploy’dan önce:

```bash
npm run check
```

Bu komut build alır, zorunlu HTML dosyalarını ve kırık local linkleri kontrol eder.
