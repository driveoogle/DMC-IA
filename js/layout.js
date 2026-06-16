/* ── DMC IA — layout ── */
function renderNav(activePage) {
  return `
<nav>
  <a class="brand" href="/">
    <div class="brand-dot">
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="nc-grad-nav" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#7c5cfc;stop-opacity:1"/>
            <stop offset="100%" style="stop-color:#00e5a0;stop-opacity:1"/>
          </linearGradient>
        </defs>
        <line x1="50" y1="50" x2="100" y2="100" stroke="url(#nc-grad-nav)" stroke-width="10" stroke-linecap="round"/>
        <line x1="150" y1="50" x2="100" y2="100" stroke="url(#nc-grad-nav)" stroke-width="10" stroke-linecap="round"/>
        <line x1="100" y1="100" x2="100" y2="150" stroke="url(#nc-grad-nav)" stroke-width="10" stroke-linecap="round"/>
        <circle cx="50" cy="50" r="20" fill="url(#nc-grad-nav)"/>
        <circle cx="150" cy="50" r="20" fill="url(#nc-grad-nav)"/>
        <circle cx="100" cy="150" r="20" fill="url(#nc-grad-nav)"/>
        <circle cx="100" cy="100" r="28" fill="url(#nc-grad-nav)"/>
        <circle cx="50" cy="50" r="8" fill="#0c0c10"/>
        <circle cx="150" cy="50" r="8" fill="#0c0c10"/>
        <circle cx="100" cy="150" r="8" fill="#0c0c10"/>
        <circle cx="100" cy="100" r="12" fill="#0c0c10"/>
      </svg>
    </div>
    <span class="brand-name">DMC IA</span>
  </a>
  <div class="nav-center">
    <a class="nav-link ${activePage==='home'?'active':''}" href="/" data-i18n="nav_home">Home</a>
    <a class="nav-link ${activePage==='services'?'active':''}" href="/services.html" data-i18n="nav_services">Services</a>
    <a class="nav-link ${activePage==='catalogue'?'active':''}" href="/catalogue.html" data-i18n="nav_catalogue">Catalogue</a>
    <a class="nav-link ${activePage==='formation'?'active':''}" href="/formation.html" data-i18n="nav_formation">Training</a>
    <a class="nav-link ${activePage==='contact'?'active':''}" href="/contact.html" data-i18n="nav_contact">Contact</a>
  </div>
  <div class="nav-right">
    <div class="lang-switch">
      <button class="lang-btn" data-lang="en" onclick="setLang('en')">EN</button>
      <button class="lang-btn" data-lang="pt" onclick="setLang('pt')">PT</button>
    </div>
    <button class="theme-toggle" onclick="toggleTheme()" aria-label="Toggle light/dark mode">
      <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
      <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
    </button>
    <a class="btn btn-accent" href="/contact.html" data-i18n="nav_cta">Request a Quote</a>
  </div>
</nav>`;
}

function toggleTheme() {
  const isLight = document.documentElement.classList.toggle('light');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
}

function renderFooter() {
  return `
<footer>
  <div class="footer-brand">
    <div class="brand-dot" style="width:22px;height:22px;border-radius:5px;background:#0c0c10;">
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style="width:22px;height:22px;">
        <defs>
          <linearGradient id="nc-grad-footer" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#7c5cfc;stop-opacity:1"/>
            <stop offset="100%" style="stop-color:#00e5a0;stop-opacity:1"/>
          </linearGradient>
        </defs>
        <line x1="50" y1="50" x2="100" y2="100" stroke="url(#nc-grad-footer)" stroke-width="10" stroke-linecap="round"/>
        <line x1="150" y1="50" x2="100" y2="100" stroke="url(#nc-grad-footer)" stroke-width="10" stroke-linecap="round"/>
        <line x1="100" y1="100" x2="100" y2="150" stroke="url(#nc-grad-footer)" stroke-width="10" stroke-linecap="round"/>
        <circle cx="50" cy="50" r="20" fill="url(#nc-grad-footer)"/>
        <circle cx="150" cy="50" r="20" fill="url(#nc-grad-footer)"/>
        <circle cx="100" cy="150" r="20" fill="url(#nc-grad-footer)"/>
        <circle cx="100" cy="100" r="28" fill="url(#nc-grad-footer)"/>
        <circle cx="50" cy="50" r="8" fill="#0c0c10"/>
        <circle cx="150" cy="50" r="8" fill="#0c0c10"/>
        <circle cx="100" cy="150" r="8" fill="#0c0c10"/>
        <circle cx="100" cy="100" r="12" fill="#0c0c10"/>
      </svg>
    </div>
    DMC IA
  </div>
  <div class="footer-links">
    <a class="footer-link" href="/" data-i18n="nav_home">Home</a>
    <a class="footer-link" href="/services.html" data-i18n="nav_services">Services</a>
    <a class="footer-link" href="/catalogue.html" data-i18n="nav_catalogue">Catalogue</a>
    <a class="footer-link" href="/formation.html" data-i18n="nav_formation">Training</a>
    <a class="footer-link" href="/contact.html" data-i18n="nav_contact">Contact</a>
  </div>
  <div class="footer-copy">
    <span data-i18n="footer_copy">© 2026 DMC IA. All rights reserved.</span>
    <span style="display:flex;gap:1rem;">
      <a class="footer-link" href="/privacy.html" data-i18n="footer_privacy">Privacy Policy</a>
      <a class="footer-link" href="/terms.html" data-i18n="footer_terms">Terms of Use</a>
    </span>
  </div>
</footer>`;
}

function initLayout(activePage) {
  const navEl  = document.getElementById('nav-placeholder');
  const footEl = document.getElementById('footer-placeholder');
  if (navEl)  navEl.outerHTML  = renderNav(activePage);
  if (footEl) footEl.outerHTML = renderFooter();
  initLang();
  initTilt();
}

/* ── Card tilt effect ── */
function initTilt() {
  document.querySelectorAll('.acard, .catcard').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const cx = r.width / 2;
      const cy = r.height / 2;
      const rotX = ((y - cy) / cy) * -6;
      const rotY = ((x - cx) / cx) * 6;
      card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s ease, border-color 0.25s, box-shadow 0.25s';
      setTimeout(() => { card.style.transition = ''; }, 400);
    });
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'border-color 0.25s, box-shadow 0.25s';
    });
  });
}
