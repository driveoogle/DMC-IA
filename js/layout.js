/* ── DMC IA — layout ── */
function renderNav(activePage) {
  return `
<nav>
  <a class="brand" href="index.html">
    <div class="brand-dot">
      <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
    </div>
    <span class="brand-name">DMC IA</span>
  </a>
  <div class="nav-center">
    <a class="nav-link ${activePage==='home'?'active':''}" href="index.html" data-i18n="nav_home">Home</a>
    <a class="nav-link ${activePage==='services'?'active':''}" href="services.html" data-i18n="nav_services">Services</a>
    <a class="nav-link ${activePage==='catalogue'?'active':''}" href="catalogue.html" data-i18n="nav_catalogue">Catalogue</a>
    <a class="nav-link ${activePage==='contact'?'active':''}" href="contact.html" data-i18n="nav_contact">Contact</a>
  </div>
  <div class="nav-right">
    <div class="lang-switch">
      <button class="lang-btn" data-lang="en" onclick="setLang('en')">EN</button>
      <button class="lang-btn" data-lang="pt" onclick="setLang('pt')">PT</button>
    </div>
    <a class="btn btn-accent" href="contact.html" data-i18n="nav_cta">Get in touch</a>
  </div>
</nav>`;
}

function renderFooter() {
  return `
<footer>
  <div class="footer-brand">
    <div class="brand-dot" style="width:22px;height:22px;border-radius:5px;background:linear-gradient(135deg,#7c5cfc,#00e5a0);">
      <svg viewBox="0 0 24 24" style="width:12px;height:12px;"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
    </div>
    DMC IA
  </div>
  <div class="footer-links">
    <a class="footer-link" href="index.html" data-i18n="nav_home">Home</a>
    <a class="footer-link" href="services.html" data-i18n="nav_services">Services</a>
    <a class="footer-link" href="catalogue.html" data-i18n="nav_catalogue">Catalogue</a>
    <a class="footer-link" href="contact.html" data-i18n="nav_contact">Contact</a>
  </div>
  <div class="footer-copy">
    <span data-i18n="footer_copy">© 2026 DMC IA. All rights reserved.</span>
    <span style="display:flex;gap:1rem;">
      <a class="footer-link" href="#" data-i18n="footer_privacy">Privacy Policy</a>
      <a class="footer-link" href="#" data-i18n="footer_terms">Terms of Use</a>
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
