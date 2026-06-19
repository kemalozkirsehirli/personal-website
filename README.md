# Kemal Özkırşehirli — Personal Academic Website

Statik, dependency-light, Manolis Kellis / classic MIT academic-homepage hissine yakın kişisel akademik site.

## Final durum

- Canlı domain: `https://kemal-ozkirsehirli.com`
- GitHub Pages kaynağı: `main` branch → `/docs`
- Tüm sayfalarda arka plan: `#FFF8E7`
- Web résumé: `/cv/` (güncel finalized résumé bilgileriyle)
- İndirilebilir/public résumé PDF yok
- About poem: `/about/`
- Özkırşehirli Group: `/group/` (application form, LinkedIn launch post, ayrıntılı MeshAnyOrder ve TBXT programları dahil)
- Essays ve AI-for-Science notes yayımlanmıyor
- Spotlight sırası `About → Özkırşehirli Group → Application Form`
- Word cloud kompakt, renkli ve çakışmasızdır; 129 terimin tamamı yataydır, `AI for Science` merkezde yer alır ve temel araştırma kavramları önemlerine göre daha büyük gösterilir

## Lokal çalıştırma

```bash
npm install
npm run check
npm run dev
```

Tarayıcı:

```txt
http://localhost:4173/
```

## İçerik düzenleme

- Ana sayfa, Spotlight, selected work, Group: `src/data/site.json`
- Projeler: `src/data/projects.json`
- Web résumé: `src/content/cv.md`
- Fotoğraflar ve word cloud: `public/`
- Görsel düzen: `src/styles/main.css`
- Build sistemi: `scripts/build.mjs`

## Her değişiklikten sonra

```bash
npm run check
rm -rf docs
cp -R dist docs
printf "kemal-ozkirsehirli.com\n" > docs/CNAME
touch docs/.nojekyll
```

Ardından GitHub Desktop:

```txt
Commit to main
Push origin
```

GitHub Pages birkaç dakika içinde `/docs` klasöründeki yeni çıktıyı yayımlar.

## GitHub Pages ayarı

```txt
Repository → Settings → Pages
Source: Deploy from a branch
Branch: main
Folder: /docs
Custom domain: kemal-ozkirsehirli.com
Enforce HTTPS: on
```

## DNS

```txt
A      @      185.199.108.153
A      @      185.199.109.153
A      @      185.199.110.153
A      @      185.199.111.153
CNAME  www    kemalozkirsehirli.github.io
```

GitHub verification TXT kaydını DNS'te tut.

## Word cloud yeniden üretme

```bash
python3 -m pip install -r requirements-wordcloud.txt
python3 scripts/generate_wordcloud.py
npm run check
rm -rf docs
cp -R dist docs
printf "kemal-ozkirsehirli.com\n" > docs/CNAME
touch docs/.nojekyll
```
