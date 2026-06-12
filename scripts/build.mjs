import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const PUBLIC = path.join(ROOT, 'public');
const DIST = path.join(ROOT, 'dist');

const TEXT_EXTENSIONS = new Set(['.html', '.css', '.js', '.json', '.svg', '.xml', '.txt', '.webmanifest']);

async function readJson(file) {
  return JSON.parse(await fs.readFile(file, 'utf8'));
}

async function exists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function escapeAttr(value = '') {
  return escapeHtml(value).replaceAll('`', '&#96;');
}

function slugify(value = '') {
  return String(value)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'untitled';
}

function parseScalar(value) {
  const trimmed = value.trim();
  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;
  if (trimmed === 'null') return null;
  if ((trimmed.startsWith('[') && trimmed.endsWith(']')) || (trimmed.startsWith('{') && trimmed.endsWith('}'))) {
    try {
      return JSON.parse(trimmed.replace(/'/g, '"'));
    } catch {
      return trimmed;
    }
  }
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed);
  return trimmed;
}

function parseFrontMatter(markdown) {
  const match = markdown.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/);
  if (!match) return { data: {}, body: markdown };
  const data = {};
  for (const rawLine of match[1].split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const index = line.indexOf(':');
    if (index === -1) continue;
    const key = line.slice(0, index).trim();
    const value = line.slice(index + 1).trim();
    data[key] = parseScalar(value);
  }
  return { data, body: markdown.slice(match[0].length) };
}

function cleanBasePath(basePath = '') {
  if (!basePath || basePath === '/') return '';
  const withSlash = basePath.startsWith('/') ? basePath : `/${basePath}`;
  return withSlash.replace(/\/+$/, '');
}

function normalizeSiteUrl(url) {
  const fallback = 'https://example.com';
  return String(url || fallback).replace(/\/+$/, '') + '/';
}

function createContext(site) {
  const basePath = cleanBasePath(site.basePath || '');
  const siteUrl = normalizeSiteUrl(site.url);

  function withBase(url = '') {
    if (!url) return '';
    if (/^(https?:)?\/\//.test(url) || /^(mailto|tel):/.test(url) || url.startsWith('#') || url.startsWith('data:')) return url;
    if (!url.startsWith('/')) return url;
    if (url === '/') return basePath || '/';
    return `${basePath}${url}`;
  }

  function absoluteUrl(pagePath = '/') {
    const clean = pagePath.replace(/^\/+/, '');
    return new URL(clean, siteUrl).toString();
  }

  return { basePath, siteUrl, withBase, absoluteUrl };
}

function formatDate(date) {
  if (!date) return '';
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return String(date);
  return new Intl.DateTimeFormat('en', { year: 'numeric', month: 'long', day: 'numeric' }).format(parsed);
}

function readingTime(markdown) {
  const text = markdown.replace(/```[\s\S]*?```/g, '').replace(/[#>*_`\-[\]()]/g, ' ');
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 225));
}

function linkAttributes(url, ctx) {
  const href = ctx.withBase(url);
  const external = /^(https?:)?\/\//.test(url);
  return `href="${escapeAttr(href)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}`;
}

function transformInline(text, ctx) {
  const placeholders = [];
  const stash = (html) => {
    const key = `@@PLACEHOLDER_${placeholders.length}@@`;
    placeholders.push([key, html]);
    return key;
  };

  let value = String(text).replace(/`([^`]+)`/g, (_, code) => stash(`<code>${escapeHtml(code)}</code>`));
  value = escapeHtml(value);

  value = value.replace(/!\[([^\]]*)\]\(([^\s)]+)(?:\s+&quot;([^&]*)&quot;)?\)/g, (_, alt, src, title) => {
    const imgSrc = ctx.withBase(src);
    const titleAttr = title ? ` title="${escapeAttr(title)}"` : '';
    return `<img src="${escapeAttr(imgSrc)}" alt="${escapeAttr(alt)}" loading="lazy" decoding="async"${titleAttr}>`;
  });

  value = value.replace(/\[([^\]]+)\]\(([^\s)]+)(?:\s+&quot;([^&]*)&quot;)?\)/g, (_, label, href, title) => {
    const titleAttr = title ? ` title="${escapeAttr(title)}"` : '';
    return `<a ${linkAttributes(href, ctx)}${titleAttr}>${label}</a>`;
  });

  value = value
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');

  for (const [key, html] of placeholders) {
    value = value.replaceAll(key, html);
  }
  return value;
}

function renderTable(lines, ctx) {
  const rows = lines.map((line) => line.trim().replace(/^\||\|$/g, '').split('|').map((cell) => cell.trim()));
  if (rows.length < 2) return null;
  const separator = rows[1];
  if (!separator.every((cell) => /^:?-{3,}:?$/.test(cell))) return null;
  const headers = rows[0];
  const body = rows.slice(2);
  return `<table><thead><tr>${headers.map((h) => `<th>${transformInline(h, ctx)}</th>`).join('')}</tr></thead><tbody>${body.map((row) => `<tr>${row.map((cell) => `<td>${transformInline(cell, ctx)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
}

function markdownToHtml(markdown, ctx) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const html = [];
  let paragraph = [];
  let list = null;
  let blockquote = [];
  let code = null;

  const flushParagraph = () => {
    if (!paragraph.length) return;
    html.push(`<p>${transformInline(paragraph.join(' '), ctx)}</p>`);
    paragraph = [];
  };

  const flushList = () => {
    if (!list) return;
    html.push(`<${list.type}>${list.items.map((item) => `<li>${transformInline(item, ctx)}</li>`).join('')}</${list.type}>`);
    list = null;
  };

  const flushBlockquote = () => {
    if (!blockquote.length) return;
    html.push(`<blockquote>${markdownToHtml(blockquote.join('\n'), ctx)}</blockquote>`);
    blockquote = [];
  };

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];

    if (code) {
      if (line.trim().startsWith('```')) {
        html.push(`<pre><code${code.lang ? ` class="language-${escapeAttr(code.lang)}"` : ''}>${escapeHtml(code.lines.join('\n'))}</code></pre>`);
        code = null;
      } else {
        code.lines.push(line);
      }
      continue;
    }

    const fence = line.match(/^```\s*([\w-]+)?\s*$/);
    if (fence) {
      flushParagraph();
      flushList();
      flushBlockquote();
      code = { lang: fence[1] || '', lines: [] };
      continue;
    }

    if (!line.trim()) {
      flushParagraph();
      flushList();
      flushBlockquote();
      continue;
    }

    if (/^\|.*\|\s*$/.test(line) && i + 1 < lines.length && /^\|?\s*:?-{3,}:?/.test(lines[i + 1])) {
      flushParagraph();
      flushList();
      flushBlockquote();
      const tableLines = [line];
      i += 1;
      while (i < lines.length && /^\|.*\|\s*$/.test(lines[i])) {
        tableLines.push(lines[i]);
        i += 1;
      }
      i -= 1;
      const table = renderTable(tableLines, ctx);
      if (table) html.push(table);
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      flushList();
      flushBlockquote();
      const level = Math.min(6, heading[1].length);
      const raw = heading[2].replace(/\s+#+\s*$/, '');
      const id = slugify(raw.replace(/[`*_\[\]()]/g, ''));
      html.push(`<h${level} id="${escapeAttr(id)}">${transformInline(raw, ctx)}</h${level}>`);
      continue;
    }

    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(line.trim())) {
      flushParagraph();
      flushList();
      flushBlockquote();
      html.push('<hr>');
      continue;
    }

    const quote = line.match(/^>\s?(.*)$/);
    if (quote) {
      flushParagraph();
      flushList();
      blockquote.push(quote[1]);
      continue;
    }

    const unordered = line.match(/^\s*[-*+]\s+(.+)$/);
    const ordered = line.match(/^\s*\d+\.\s+(.+)$/);
    if (unordered || ordered) {
      flushParagraph();
      flushBlockquote();
      const type = ordered ? 'ol' : 'ul';
      if (!list || list.type !== type) flushList();
      if (!list) list = { type, items: [] };
      list.items.push((unordered || ordered)[1]);
      continue;
    }

    paragraph.push(line.trim());
  }

  if (code) {
    html.push(`<pre><code${code.lang ? ` class="language-${escapeAttr(code.lang)}"` : ''}>${escapeHtml(code.lines.join('\n'))}</code></pre>`);
  }
  flushParagraph();
  flushList();
  flushBlockquote();

  return html.join('\n');
}

async function copyDir(src, dest) {
  if (!(await exists(src))) return;
  await fs.mkdir(dest, { recursive: true });
  for (const entry of await fs.readdir(src, { withFileTypes: true })) {
    const sourcePath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(sourcePath, destPath);
    } else if (entry.isFile()) {
      await fs.copyFile(sourcePath, destPath);
    }
  }
}

async function writeFile(outputPath, content) {
  const file = path.join(DIST, outputPath);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, content, 'utf8');
}

function renderTags(tags = []) {
  return `<div class="tags">${tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}</div>`;
}

function renderNav(site, ctx, activePath) {
  const items = site.nav || [];
  return items.map((item) => {
    const isActive = activePath === item.url || (item.url !== '/' && activePath.startsWith(item.url));
    return `<a href="${escapeAttr(ctx.withBase(item.url))}"${isActive ? ' aria-current="page"' : ''}>${escapeHtml(item.label)}</a>`;
  }).join('\n');
}

function renderSocialLinks(site, ctx, className = 'button') {
  const links = site.author?.links || [];
  return links.map((link) => `<a class="${escapeAttr(className)}" ${linkAttributes(link.url, ctx)}>${escapeHtml(link.label)}</a>`).join('\n');
}

function renderTextList(items = []) {
  if (!items.length) return '';
  return `<ul class="plain-list">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
}

function renderLinkRows(rows = [], ctx) {
  if (!rows.length) return '';
  return rows.map((row) => {
    const links = row.links || [];
    return `<div class="link-row"><strong>${escapeHtml(row.label || '')}</strong><span>${links.map((link) => `<a ${linkAttributes(link.url, ctx)}>${escapeHtml(link.label)}</a>`).join(' <em>/</em> ')}</span></div>`;
  }).join('\n');
}

function renderSpotlight(items = [], ctx) {
  if (!items.length) return '';
  return `<ol class="spotlight-list">${items.map((item) => `<li><a ${linkAttributes(item.url, ctx)}>${escapeHtml(item.label)}</a>${item.description ? `<small>${escapeHtml(item.description)}</small>` : ''}</li>`).join('')}</ol>`;
}

function renderLayout({ site, ctx, title, description, activePath = '/', path: pagePath = '/', content, image = '/og-image.svg', type = 'website', extraHead = '' }) {
  const fullTitle = title && title !== site.title ? `${title} · ${site.title}` : site.title;
  const desc = description || site.description || '';
  const canonical = ctx.absoluteUrl(pagePath);
  const ogImage = /^(https?:)?\/\//.test(image) ? image : ctx.absoluteUrl(image.replace(/^\//, ''));
  const authorName = site.author?.name || site.title;
  const brandInitial = authorName.trim().slice(0, 1).toUpperCase() || 'Y';

  const schema = {
    '@context': 'https://schema.org',
    '@type': type === 'article' ? 'Article' : 'WebSite',
    name: fullTitle,
    url: canonical,
    description: desc,
    author: {
      '@type': 'Person',
      name: authorName,
      email: site.author?.email || undefined,
      jobTitle: site.author?.role || undefined,
      address: site.author?.location || undefined
    }
  };

  return `<!doctype html>
<html lang="${escapeAttr(site.language || 'en')}" data-theme="light">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(fullTitle)}</title>
  <meta name="description" content="${escapeAttr(desc)}">
  <link rel="canonical" href="${escapeAttr(canonical)}">
  <meta property="og:type" content="${type === 'article' ? 'article' : 'website'}">
  <meta property="og:title" content="${escapeAttr(fullTitle)}">
  <meta property="og:description" content="${escapeAttr(desc)}">
  <meta property="og:image" content="${escapeAttr(ogImage)}">
  <meta property="og:url" content="${escapeAttr(canonical)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="theme-color" content="#17120f">
  <link rel="icon" href="${escapeAttr(ctx.withBase('/favicon.svg'))}" type="image/svg+xml">
  <link rel="manifest" href="${escapeAttr(ctx.withBase('/site.webmanifest'))}">
  <link rel="alternate" type="application/rss+xml" title="${escapeAttr(site.title)} essays" href="${escapeAttr(ctx.withBase('/feed.xml'))}">
  <link rel="stylesheet" href="${escapeAttr(ctx.withBase('/assets/main.css'))}">
  <script defer src="${escapeAttr(ctx.withBase('/assets/main.js'))}"></script>
  <script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>
  ${extraHead}
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header">
    <div class="site-shell navbar">
      <a class="brand" href="${escapeAttr(ctx.withBase('/'))}" aria-label="${escapeAttr(site.title)} home">
        <span class="brand-mark" aria-hidden="true">${escapeHtml(brandInitial)}</span>
        <span class="brand-copy"><strong>${escapeHtml(site.title)}</strong><small>${escapeHtml(site.author?.role || site.description || '')}</small></span>
      </a>
      <nav class="nav-links" aria-label="Primary navigation">
        ${renderNav(site, ctx, activePath)}
        <button class="theme-toggle" type="button" data-theme-toggle aria-label="Switch theme">☾</button>
      </nav>
    </div>
  </header>
  <main id="main" class="site-shell">
    ${content}
  </main>
  <footer class="site-footer">
    <div class="site-shell footer-inner">
      <span>© ${new Date().getFullYear()} ${escapeHtml(authorName)}.</span>
      <span>Built as a static site. No tracking by default.</span>
    </div>
  </footer>
</body>
</html>`;
}

function essayCard(essay, ctx) {
  return `<article class="card list-card" data-filter-card data-tags="${escapeAttr((essay.tags || []).join('|'))}" data-search="${escapeAttr([essay.title, essay.description, ...(essay.tags || [])].join(' '))}">
    ${essay.cover ? `<a class="card-cover" href="${escapeAttr(ctx.withBase(essay.url))}" aria-label="Read ${escapeAttr(essay.title)}"><img src="${escapeAttr(ctx.withBase(essay.cover))}" alt="" loading="lazy" decoding="async"></a>` : ''}
    <div class="card-body">
      <div class="card-meta"><time datetime="${escapeAttr(essay.date)}">${escapeHtml(formatDate(essay.date))}</time><span>·</span><span>${essay.readingTime} min read</span></div>
      <h2><a href="${escapeAttr(ctx.withBase(essay.url))}">${escapeHtml(essay.title)}</a></h2>
      <p>${escapeHtml(essay.description || '')}</p>
      ${renderTags(essay.tags)}
    </div>
  </article>`;
}

function projectCard(project, ctx) {
  const links = (project.links || []).map((link) => `<a class="button small-button" ${linkAttributes(link.url, ctx)}>${escapeHtml(link.label)}</a>`).join('\n');
  return `<article class="card list-card" data-filter-card data-tags="${escapeAttr((project.tags || []).join('|'))}" data-search="${escapeAttr([project.title, project.status, project.description, ...(project.tags || [])].join(' '))}">
    <div class="card-body">
      ${project.status ? `<span class="project-status">${escapeHtml(project.status)}</span>` : ''}
      <h2>${escapeHtml(project.title)}</h2>
      <p>${escapeHtml(project.description || '')}</p>
      ${renderTags(project.tags)}
      ${links ? `<div class="card-footer inline-actions">${links}</div>` : ''}
    </div>
  </article>`;
}

function tagFilters(tags) {
  return `<div class="tags" aria-label="Filter by tag">${tags.map((tag) => `<button class="filter-chip" type="button" data-tag-filter="${escapeAttr(tag)}" aria-pressed="false">${escapeHtml(tag)}</button>`).join('')}</div>`;
}

async function loadEssays(ctx) {
  const essaysDir = path.join(SRC, 'content', 'essays');
  const files = (await fs.readdir(essaysDir)).filter((file) => file.endsWith('.md'));
  const essays = [];

  for (const file of files) {
    const fullPath = path.join(essaysDir, file);
    const markdown = await fs.readFile(fullPath, 'utf8');
    const { data, body } = parseFrontMatter(markdown);
    if (data.draft) continue;
    const slug = data.slug ? slugify(data.slug) : slugify(path.basename(file, '.md'));
    const url = `/essays/${slug}/`;
    essays.push({
      slug,
      url,
      title: data.title || slug,
      description: data.description || '',
      date: data.date || '',
      tags: Array.isArray(data.tags) ? data.tags : [],
      cover: data.cover || '',
      html: markdownToHtml(body, ctx),
      body,
      readingTime: readingTime(body)
    });
  }

  return essays.sort((a, b) => String(b.date).localeCompare(String(a.date)));
}

async function renderHome(site, ctx, essays, projects) {
  const author = site.author || {};
  const spotlight = site.home?.spotlight || [
    { label: 'AI for Science notes', url: '/essays/ai-for-science-notes/', description: 'research notebook' },
    { label: 'Molecular property modeling', url: '/projects/', description: 'selected project' },
    { label: 'Curriculum vitae', url: '/cv/', description: 'education and work' },
    { label: 'Essay archive', url: '/essays/', description: 'public writing' }
  ];
  const directory = site.home?.directory || [
    { label: 'About', links: [site.home?.primaryCta || { label: 'Essays', url: '/essays/' }, site.home?.secondaryCta || { label: 'CV', url: '/cv/' }, { label: 'Projects', url: '/projects/' }, { label: 'Photos', url: '/photos/' }] },
    { label: 'Writing', links: essays.slice(0, 3).map((essay) => ({ label: essay.title, url: essay.url })) },
    { label: 'Work', links: projects.slice(0, 3).map((project) => ({ label: project.title, url: '/projects/' })) }
  ];
  const highlights = author.highlights || [
    author.role || 'Researcher and writer',
    'AI for science, computational drug discovery, and scientific computing',
    'Essays, notes, projects, and selected public work'
  ];
  const latest = essays.slice(0, 5).map((essay) => essayCard(essay, ctx)).join('\n');
  const featuredProjects = projects.slice(0, 4).map((project) => projectCard(project, ctx)).join('\n');
  const emailLine = author.email ? `<a href="mailto:${escapeAttr(author.email)}">${escapeHtml(author.email)}</a>` : '';
  const content = `<section class="academic-hero">
    <aside class="portrait-panel" aria-label="Profile summary">
      <div class="profile-art"><img src="${escapeAttr(ctx.withBase(author.avatar || '/photos/profile.svg'))}" alt="${escapeAttr(author.name || site.title)} profile image" loading="eager" decoding="async"></div>
      <div class="profile-meta">
        <h2>${escapeHtml(author.name || site.title)}</h2>
        <p>${escapeHtml(author.location || '')}</p>
        ${emailLine ? `<p>${emailLine}</p>` : ''}
        <div class="social-row">${renderSocialLinks(site, ctx, 'text-link')}</div>
      </div>
    </aside>

    <section class="intro-panel">
      <p class="eyebrow">${escapeHtml(site.home?.eyebrow || 'Personal website')}</p>
      <h1>${escapeHtml(author.name || site.title)}</h1>
      <p class="role-line">${escapeHtml(author.role || '')}</p>
      <p class="lede">${escapeHtml(author.bio || site.home?.intro || site.description || '')}</p>
      <div class="hero-actions">
        ${site.home?.primaryCta ? `<a class="button primary" href="${escapeAttr(ctx.withBase(site.home.primaryCta.url))}">${escapeHtml(site.home.primaryCta.label)}</a>` : ''}
        ${site.home?.secondaryCta ? `<a class="button" href="${escapeAttr(ctx.withBase(site.home.secondaryCta.url))}">${escapeHtml(site.home.secondaryCta.label)}</a>` : ''}
      </div>
      <div class="academic-note">
        <h2>Highlights</h2>
        ${renderTextList(highlights)}
      </div>
    </section>

    <aside class="spotlight-panel" aria-label="Spotlight links">
      <h2>Spotlight</h2>
      ${renderSpotlight(spotlight, ctx)}
    </aside>
  </section>

  <section class="directory-panel" aria-label="Site directory">
    ${renderLinkRows(directory, ctx)}
  </section>

  <section class="section split-section">
    <div class="section-head compact-head">
      <div>
        <p class="eyebrow">Writing</p>
        <h2>Latest essays and notes</h2>
      </div>
      <a class="button" href="${escapeAttr(ctx.withBase('/essays/'))}">All essays</a>
    </div>
    <div class="stack">${latest}</div>
  </section>

  <section class="section split-section">
    <div class="section-head compact-head">
      <div>
        <p class="eyebrow">Selected work</p>
        <h2>Projects</h2>
      </div>
      <a class="button" href="${escapeAttr(ctx.withBase('/projects/'))}">All projects</a>
    </div>
    <div class="stack">${featuredProjects}</div>
  </section>`;

  await writeFile('index.html', renderLayout({ site, ctx, title: site.title, description: site.description, activePath: '/', path: '/', content }));
}

async function renderEssaysIndex(site, ctx, essays) {
  const tags = [...new Set(essays.flatMap((essay) => essay.tags || []))].sort((a, b) => a.localeCompare(b));
  const content = `<section class="page-head">
    <p class="eyebrow">Writing archive</p>
    <h1>Essays</h1>
    <p>Research notes, project writeups, and essays. Filter by keyword or tag.</p>
  </section>
  <section class="filters" aria-label="Essay filters">
    <input class="search-input" type="search" placeholder="Search essays..." data-filter-input aria-label="Search essays">
    ${tagFilters(tags)}
  </section>
  <p class="no-results" data-no-results>No essays match that filter.</p>
  <section class="stack">${essays.map((essay) => essayCard(essay, ctx)).join('\n')}</section>`;
  await writeFile('essays/index.html', renderLayout({ site, ctx, title: 'Essays', description: 'Essays and research notes.', activePath: '/essays/', path: '/essays/', content }));
}

async function renderEssayPages(site, ctx, essays) {
  for (let index = 0; index < essays.length; index += 1) {
    const essay = essays[index];
    const previous = essays[index + 1];
    const next = essays[index - 1];
    const nav = `<div class="section grid two">
      ${previous ? `<a class="callout" href="${escapeAttr(ctx.withBase(previous.url))}"><p>← Older</p><strong>${escapeHtml(previous.title)}</strong></a>` : '<div></div>'}
      ${next ? `<a class="callout" href="${escapeAttr(ctx.withBase(next.url))}"><p>Newer →</p><strong>${escapeHtml(next.title)}</strong></a>` : '<div></div>'}
    </div>`;
    const content = `<article>
      <div class="article-hero">
        <header class="page-head">
          <p class="eyebrow">Essay</p>
          <h1>${escapeHtml(essay.title)}</h1>
          <p>${escapeHtml(essay.description || '')}</p>
          <div class="card-meta"><time datetime="${escapeAttr(essay.date)}">${escapeHtml(formatDate(essay.date))}</time><span>·</span><span>${essay.readingTime} min read</span></div>
          ${renderTags(essay.tags)}
        </header>
        ${essay.cover ? `<div class="article-cover"><img src="${escapeAttr(ctx.withBase(essay.cover))}" alt="" loading="eager" decoding="async"></div>` : ''}
      </div>
      <div class="prose-card"><div class="prose">${essay.html}</div></div>
      ${nav}
    </article>`;
    await writeFile(`essays/${essay.slug}/index.html`, renderLayout({ site, ctx, title: essay.title, description: essay.description, activePath: '/essays/', path: essay.url, content, image: essay.cover || '/og-image.svg', type: 'article' }));
  }
}

async function renderProjects(site, ctx, projects) {
  const tags = [...new Set(projects.flatMap((project) => project.tags || []))].sort((a, b) => a.localeCompare(b));
  const content = `<section class="page-head">
    <p class="eyebrow">Selected work</p>
    <h1>Projects</h1>
    <p>Research, engineering, writing, and experiments worth making public.</p>
  </section>
  <section class="filters" aria-label="Project filters">
    <input class="search-input" type="search" placeholder="Search projects..." data-filter-input aria-label="Search projects">
    ${tagFilters(tags)}
  </section>
  <p class="no-results" data-no-results>No projects match that filter.</p>
  <section class="stack">${projects.map((project) => projectCard(project, ctx)).join('\n')}</section>`;
  await writeFile('projects/index.html', renderLayout({ site, ctx, title: 'Projects', description: 'Selected projects and research work.', activePath: '/projects/', path: '/projects/', content }));
}

async function renderCv(site, ctx) {
  const markdown = await fs.readFile(path.join(SRC, 'content', 'cv.md'), 'utf8');
  const { data, body } = parseFrontMatter(markdown);
  const author = site.author || {};
  const pdf = site.resumePdf ? `<a class="button primary" href="${escapeAttr(ctx.withBase(site.resumePdf))}">Download PDF</a>` : '';
  const content = `<section class="page-head cv-head">
    <p class="eyebrow">Curriculum vitae</p>
    <h1>${escapeHtml(data.title || 'CV')}</h1>
    <p>${escapeHtml(data.description || 'Education, research, projects, publications, and skills.')}</p>
  </section>
  <section class="cv-layout">
    <aside class="cv-sidebar" aria-label="CV contact information">
      <h2>${escapeHtml(author.name || site.title)}</h2>
      <p>${escapeHtml(author.role || '')}</p>
      <dl>
        ${author.location ? `<div><dt>Location</dt><dd>${escapeHtml(author.location)}</dd></div>` : ''}
        ${author.email ? `<div><dt>Email</dt><dd><a href="mailto:${escapeAttr(author.email)}">${escapeHtml(author.email)}</a></dd></div>` : ''}
      </dl>
      <div class="sidebar-links">${renderSocialLinks(site, ctx, 'text-link')}</div>
      <div class="inline-actions cv-actions">${pdf}<button class="button" type="button" onclick="window.print()">Print / Save PDF</button></div>
    </aside>
    <section class="prose-card"><div class="prose cv-prose">${markdownToHtml(body, ctx)}</div></section>
  </section>`;
  await writeFile('cv/index.html', renderLayout({ site, ctx, title: data.title || 'CV', description: data.description || 'Curriculum vitae.', activePath: '/cv/', path: '/cv/', content }));
}

async function renderPhotos(site, ctx, photos) {
  const cards = photos.map((photo) => `<figure class="photo-card">
    <img src="${escapeAttr(ctx.withBase(photo.src))}" alt="${escapeAttr(photo.alt || photo.caption || '')}" loading="lazy" decoding="async">
    <figcaption>${escapeHtml(photo.caption || '')}${photo.year ? ` · ${escapeHtml(photo.year)}` : ''}</figcaption>
  </figure>`).join('\n');
  const content = `<section class="page-head">
    <p class="eyebrow">Gallery</p>
    <h1>Photos</h1>
    <p>A small visual archive. Replace the starter SVGs with your own photos in <code>public/photos/</code>.</p>
  </section>
  <section class="gallery-grid">${cards}</section>`;
  await writeFile('photos/index.html', renderLayout({ site, ctx, title: 'Photos', description: 'Photo gallery.', activePath: '/photos/', path: '/photos/', content }));
}

async function renderNotFound(site, ctx) {
  const content = `<section class="page-head">
    <p class="eyebrow">404</p>
    <h1>Page not found</h1>
    <p>This page does not exist, or it moved.</p>
    <div class="inline-actions"><a class="button primary" href="${escapeAttr(ctx.withBase('/'))}">Go home</a><a class="button" href="${escapeAttr(ctx.withBase('/essays/'))}">Read essays</a></div>
  </section>`;
  await writeFile('404.html', renderLayout({ site, ctx, title: 'Page not found', description: '404 page.', activePath: '', path: '/404.html', content }));
}

function xmlEscape(value = '') {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
}

async function renderFeeds(site, ctx, essays) {
  const staticPages = ['/', '/essays/', '/projects/', '/cv/', '/photos/'];
  const urls = [...staticPages, ...essays.map((essay) => essay.url)];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url><loc>${xmlEscape(ctx.absoluteUrl(url))}</loc></url>`).join('\n')}\n</urlset>\n`;
  await writeFile('sitemap.xml', sitemap);

  const feedItems = essays.slice(0, 20).map((essay) => `
    <item>
      <title>${xmlEscape(essay.title)}</title>
      <link>${xmlEscape(ctx.absoluteUrl(essay.url))}</link>
      <guid>${xmlEscape(ctx.absoluteUrl(essay.url))}</guid>
      <pubDate>${new Date(`${essay.date}T00:00:00`).toUTCString()}</pubDate>
      <description>${xmlEscape(essay.description || '')}</description>
    </item>`).join('');
  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${xmlEscape(site.title)} Essays</title>
    <link>${xmlEscape(ctx.absoluteUrl('/essays/'))}</link>
    <description>${xmlEscape(site.description || '')}</description>${feedItems}
  </channel>
</rss>
`;
  await writeFile('feed.xml', feed);

  const robots = `User-agent: *\nAllow: /\n\nSitemap: ${ctx.absoluteUrl('/sitemap.xml')}\n`;
  await writeFile('robots.txt', robots);


  const manifest = {
    name: site.title || 'Personal Website',
    short_name: site.title || 'Personal Site',
    start_url: ctx.withBase('/'),
    display: 'standalone',
    background_color: '#f6f0e8',
    theme_color: '#17120f',
    icons: [
      {
        src: ctx.withBase('/favicon.svg'),
        sizes: 'any',
        type: 'image/svg+xml'
      }
    ]
  };
  await writeFile('site.webmanifest', `${JSON.stringify(manifest, null, 2)}\n`);

  const searchIndex = essays.map((essay) => ({
    title: essay.title,
    description: essay.description,
    tags: essay.tags,
    date: essay.date,
    url: ctx.withBase(essay.url)
  }));
  await writeFile('search.json', `${JSON.stringify(searchIndex, null, 2)}\n`);
}

async function copyAssets() {
  await fs.mkdir(path.join(DIST, 'assets'), { recursive: true });
  await fs.copyFile(path.join(SRC, 'styles', 'main.css'), path.join(DIST, 'assets', 'main.css'));
  await fs.copyFile(path.join(SRC, 'scripts', 'main.js'), path.join(DIST, 'assets', 'main.js'));
}

export async function build() {
  const site = await readJson(path.join(SRC, 'data', 'site.json'));
  const projects = await readJson(path.join(SRC, 'data', 'projects.json'));
  const photos = await readJson(path.join(SRC, 'data', 'photos.json'));
  const ctx = createContext(site);

  await fs.rm(DIST, { recursive: true, force: true });
  await fs.mkdir(DIST, { recursive: true });
  await copyDir(PUBLIC, DIST);
  await copyAssets();
  await writeFile('.nojekyll', '');

  const essays = await loadEssays(ctx);
  await renderHome(site, ctx, essays, projects);
  await renderEssaysIndex(site, ctx, essays);
  await renderEssayPages(site, ctx, essays);
  await renderProjects(site, ctx, projects);
  await renderCv(site, ctx);
  await renderPhotos(site, ctx, photos);
  await renderNotFound(site, ctx);
  await renderFeeds(site, ctx, essays);

  return { site, ctx, essays, projects, photos, dist: DIST };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  build()
    .then(({ essays, projects, photos }) => {
      console.log(`Built site: ${essays.length} essays, ${projects.length} projects, ${photos.length} photos.`);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
