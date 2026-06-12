(() => {
  const root = document.documentElement;
  const toggle = document.querySelector('[data-theme-toggle]');
  const storedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');

  root.setAttribute('data-theme', initialTheme);

  const syncToggle = () => {
    if (!toggle) return;
    const current = root.getAttribute('data-theme') || 'light';
    toggle.setAttribute('aria-label', `Switch to ${current === 'dark' ? 'light' : 'dark'} theme`);
    toggle.textContent = current === 'dark' ? '☀︎' : '☾';
  };

  syncToggle();

  toggle?.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    syncToggle();
  });

  const input = document.querySelector('[data-filter-input]');
  const cards = Array.from(document.querySelectorAll('[data-filter-card]'));
  const chips = Array.from(document.querySelectorAll('[data-tag-filter]'));
  const noResults = document.querySelector('[data-no-results]');
  let activeTag = '';

  const applyFilters = () => {
    const query = (input?.value || '').trim().toLowerCase();
    let visibleCount = 0;

    for (const card of cards) {
      const haystack = (card.dataset.search || '').toLowerCase();
      const tags = (card.dataset.tags || '').toLowerCase().split('|');
      const matchesQuery = !query || haystack.includes(query);
      const matchesTag = !activeTag || tags.includes(activeTag.toLowerCase());
      const visible = matchesQuery && matchesTag;
      card.hidden = !visible;
      if (visible) visibleCount += 1;
    }

    if (noResults) {
      noResults.classList.toggle('is-visible', visibleCount === 0);
    }
  };

  input?.addEventListener('input', applyFilters);

  for (const chip of chips) {
    chip.addEventListener('click', () => {
      const tag = chip.dataset.tagFilter || '';
      activeTag = activeTag === tag ? '' : tag;
      for (const other of chips) {
        other.setAttribute('aria-pressed', String((other.dataset.tagFilter || '') === activeTag));
      }
      applyFilters();
    });
  }
})();
