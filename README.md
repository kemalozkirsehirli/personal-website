# Kemal Özkırşehirli — Personal Academic Website

Static, dependency-light personal academic website with a classic MIT / Manolis Kellis-style layout.

## Current setup

- Live domain: `https://kemal-ozkirsehirli.com`
- GitHub Pages source: `main` branch → `/docs`
- Background across every page: `#FFF8E7`
- Web résumé: `/cv/`
- No downloadable/public résumé PDF
- About poem: `/about/`
- Özkırşehirli Group: `/group/`
- Essays and AI-for-Science notes are not published
- Word cloud is horizontal, compact, colored, and centered on `AI for Science`

## Public-content lock

This repository follows [`PUBLIC_CONTENT_POLICY.md`](PUBLIC_CONTENT_POLICY.md).

Only user-approved website content and material explicitly supplied in the user-designated `Public` release archive may appear on the website. The user-designated `Owner` archive is a do-not-publish source and is used only to define the privacy denylist.

`npm run check` now:

1. rebuilds `dist/`;
2. verifies required pages and local links;
3. rejects owner/private-master/anonymous-review markers, key material, local paths, the private phone number, résumé PDFs, PDFs/ZIPs/keys/databases inside published trees, and local-only links;
4. requires `resumePdf` to remain `null`;
5. replaces `docs/` with the audited `dist/` output; and
6. audits `docs/` again.

## Local preview

```bash
npm install
npm run check
npm run dev
```

Open:

```txt
http://localhost:4173/
```

## Content editing

- Homepage, Spotlight, selected work: `src/data/site.json`
- Özkırşehirli Group page: `scripts/build.mjs`
- Projects: `src/data/projects.json`
- Web résumé: `src/content/cv.md`
- Photos and word cloud: `public/`
- Visual design: `src/styles/main.css`

## After each edit

```bash
npm run check
```

`npm run check` automatically refreshes `/docs`, so no manual `dist → docs` copy is needed.

Then use GitHub Desktop:

```txt
Commit to main
Push origin
```

## GitHub Pages

```txt
Repository → Settings → Pages
Source: Deploy from a branch
Branch: main
Folder: /docs
Custom domain: kemal-ozkirsehirli.com
Enforce HTTPS: on
```

## Word cloud regeneration

```bash
python3 -m pip install -r requirements-wordcloud.txt
python3 scripts/generate_wordcloud.py
npm run check
```
