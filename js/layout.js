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
    <a class="nav-link nav-link-midas ${activePage==='midas'?'active':''}" href="/midas-ia/" data-i18n="nav_midas">MIDAS IA</a>
    <a class="nav-link ${activePage==='contact'?'active':''}" href="/contact.html" data-i18n="nav_contact">Contact</a>
  </div>
  <div class="nav-right">
    <div class="lang-switch">
      <button class="lang-btn" data-lang="en" onclick="setLang('en')">EN</button>
      <button class="lang-btn" data-lang="pt" onclick="setLang('pt')">PT</button>
    </div>
    <a class="btn btn-accent" href="/contact.html" data-i18n="nav_cta">Request a Quote</a>
    <button class="nav-burger" id="nav-burger" aria-label="Ouvrir le menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </div>
  <div class="nav-mobile" id="nav-mobile">
    <a class="nav-mobile-link ${activePage==='home'?'active':''}" href="/" data-i18n="nav_home">Home</a>
    <a class="nav-mobile-link ${activePage==='services'?'active':''}" href="/services.html" data-i18n="nav_services">Services</a>
    <a class="nav-mobile-link ${activePage==='catalogue'?'active':''}" href="/catalogue.html" data-i18n="nav_catalogue">Catalogue</a>
    <a class="nav-mobile-link ${activePage==='formation'?'active':''}" href="/formation.html" data-i18n="nav_formation">Training</a>
    <a class="nav-mobile-link ${activePage==='midas'?'active':''}" href="/midas-ia/" data-i18n="nav_midas">MIDAS IA</a>
    <a class="nav-mobile-link ${activePage==='contact'?'active':''}" href="/contact.html" data-i18n="nav_contact">Contact</a>
    <a class="btn btn-accent" href="/contact.html" data-i18n="nav_cta">Request a Quote</a>
  </div>
</nav>`;
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
    <a class="footer-link" href="/midas-ia/" data-i18n="nav_midas">MIDAS IA</a>
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
  initChatWidget();
  initNavBurger();
}

/* ── Menu mobile (hamburger) ── */
function initNavBurger() {
  const burger = document.getElementById('nav-burger');
  const mobile = document.getElementById('nav-mobile');
  if (!burger || !mobile) return;

  function setOpen(open) {
    mobile.classList.toggle('nav-mobile-open', open);
    burger.classList.toggle('nav-burger-active', open);
    burger.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('nav-mobile-locked', open);
  }

  burger.addEventListener('click', () => setOpen(!mobile.classList.contains('nav-mobile-open')));
  mobile.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
}

/* ── Chat widget IA ── */
function renderChatWidget() {
  const t = (typeof translations !== 'undefined' && typeof currentLang !== 'undefined')
    ? translations[currentLang] : {};
  const title       = t.chat_title       || "🤖 MIDAS Assistant";
  const greeting    = t.chat_greeting    || "👋 Hello! How can I help you?";
  const placeholder = t.chat_placeholder || "Type your message...";

  return `
<div class="chat-widget" id="chat-widget">
  <button class="chat-bubble" id="chat-bubble" aria-label="Ouvrir le chat assistant">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
  </button>
  <div class="chat-panel" id="chat-panel">
    <div class="chat-panel-header">
      <span data-i18n="chat_title">${title}</span>
      <button class="chat-close" id="chat-close" aria-label="Fermer le chat">&times;</button>
    </div>
    <div class="chat-messages" id="chat-messages">
      <div class="chat-msg chat-msg-ai" data-i18n="chat_greeting">${greeting}</div>
    </div>
    <div class="chat-quick-replies" id="chat-quick-replies"></div>
    <div class="chat-input-row">
      <input type="text" id="chat-input" class="chat-input" data-i18n-placeholder="chat_placeholder" placeholder="${placeholder}">
      <button id="chat-send" class="chat-send" aria-label="Envoyer">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
      </button>
    </div>
  </div>
</div>`;
}

/* Moteur d'intentions du support IA — reflète le service AI Customer Support */
const chatIntents = [
  { id:'pricing',   answerKey:'chat_a_pricing',   patterns:['price','pricing','cost','combien','preco','preço','tarif','quanto custa'] },
  { id:'services',  answerKey:'chat_a_services',  patterns:['service','servico','serviço','what do you do','o que fazem','automation','automatizacao','automação'] },
  { id:'audit',     answerKey:'chat_a_audit',     patterns:['audit','diagnostico','diagnóstico','demo','book a call','agendar','quote','orcamento','orçamento'] },
  { id:'languages', answerKey:'chat_a_languages', patterns:['language','idioma','lingua','língua','speak french','speak english'] },
  { id:'hours',      answerKey:'chat_a_hours',     patterns:['hours','horario','horário','available','disponivel','disponível','open 24','24/7'] },
  { id:'human',      answerKey:'chat_a_human',     patterns:['human','humano','agent','speak to someone','falar com alguem','falar com alguém','representative'] },
  { id:'greeting',   answerKey:'chat_a_greeting',  patterns:['hello','hi','ola','olá','bonjour','hey'] },
  { id:'thanks',     answerKey:'chat_a_thanks',    patterns:['thanks','thank you','obrigado','obrigada','merci'] },
];

function matchChatIntent(rawText) {
  const text = rawText
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '');
  return chatIntents.find(intent =>
    intent.patterns.some(p => text.includes(p.normalize('NFD').replace(/[̀-ͯ]/g, '')))
  );
}

function initChatWidget() {
  if (document.getElementById('chat-widget')) return;
  document.body.insertAdjacentHTML('beforeend', renderChatWidget());

  const bubble   = document.getElementById('chat-bubble');
  const panel    = document.getElementById('chat-panel');
  const closeBtn = document.getElementById('chat-close');
  const input    = document.getElementById('chat-input');
  const sendBtn  = document.getElementById('chat-send');
  const list     = document.getElementById('chat-messages');
  const quickRow = document.getElementById('chat-quick-replies');

  function togglePanel(open) {
    panel.classList.toggle('chat-panel-open', open);
    bubble.classList.toggle('chat-bubble-active', open);
  }

  bubble.addEventListener('click', () => togglePanel(!panel.classList.contains('chat-panel-open')));
  closeBtn.addEventListener('click', () => togglePanel(false));

  function addMessage(sender, text) {
    const div = document.createElement('div');
    div.className = `chat-msg chat-msg-${sender}`;
    div.textContent = text;
    list.appendChild(div);
    list.scrollTop = list.scrollHeight;
    return div;
  }

  function currentT() {
    return (typeof translations !== 'undefined' && typeof currentLang !== 'undefined')
      ? translations[currentLang] : {};
  }

  function renderQuickReplies() {
    const t = currentT();
    const quick = [
      { label: t.chat_quick_pricing  || '💶 Pricing',      text: t.chat_quick_pricing  ? t.chat_quick_pricing.replace(/^\S+\s/, '')  : 'Pricing' },
      { label: t.chat_quick_services || '🤖 Our services', text: t.chat_quick_services ? t.chat_quick_services.replace(/^\S+\s/, '') : 'Our services' },
      { label: t.chat_quick_audit    || '📋 Free AI audit', text: t.chat_quick_audit    ? t.chat_quick_audit.replace(/^\S+\s/, '')    : 'Free AI audit' },
      { label: t.chat_quick_human    || '🙋 Talk to a human', text: t.chat_quick_human  ? t.chat_quick_human.replace(/^\S+\s/, '')    : 'Talk to a human' },
    ];
    quickRow.innerHTML = '';
    quick.forEach(q => {
      const btn = document.createElement('button');
      btn.className = 'chat-quick-btn';
      btn.textContent = q.label;
      btn.addEventListener('click', () => { input.value = q.text; send(); });
      quickRow.appendChild(btn);
    });
  }

  let captureState = null; // null | { step: 'email', userMessage: string }

  function isValidEmail(str) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
  }

  function submitLead(userMessage, email) {
    fetch('https://formspree.io/f/mgojwygz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ message: userMessage, email: email, _subject: 'Novo lead via chat MIDAS' }),
    }).catch(() => {}); // silencieux — l'utilisateur a déjà eu la confirmation
  }

  function respond(userText) {
    const t = currentT();

    // Étape 2 : on attend l'email
    if (captureState && captureState.step === 'email') {
      if (!isValidEmail(userText)) {
        const typing = addMessage('ai', '…');
        typing.classList.add('chat-msg-typing');
        setTimeout(() => {
          typing.classList.remove('chat-msg-typing');
          typing.textContent = t.chat_invalid_email || "Hmm, esse email não parece válido. Pode tentar novamente?";
          list.scrollTop = list.scrollHeight;
        }, 600);
        return;
      }
      // Email valide → envoi + confirmation
      submitLead(captureState.userMessage, userText);
      captureState = null;
      const typing = addMessage('ai', '…');
      typing.classList.add('chat-msg-typing');
      setTimeout(() => {
        typing.classList.remove('chat-msg-typing');
        typing.textContent = t.chat_email_thanks || "Perfeito! Entraremos em contacto brevemente. Entretanto, posso ajudá-lo com mais alguma coisa?";
        list.scrollTop = list.scrollHeight;
      }, 700);
      return;
    }

    const intent = matchChatIntent(userText);
    const typing = addMessage('ai', '…');
    typing.classList.add('chat-msg-typing');
    setTimeout(() => {
      typing.classList.remove('chat-msg-typing');
      if (intent && t[intent.answerKey]) {
        typing.textContent = t[intent.answerKey];
        if (intent.id === 'human' || intent.id === 'audit') {
          const link = document.createElement('a');
          link.href = '/contact.html';
          link.className = 'chat-msg chat-msg-ai chat-msg-link';
          link.textContent = '→ contact.html';
          list.appendChild(link);
        }
      } else {
        // Fallback → on enregistre le message et on demande l'email
        captureState = { step: 'email', userMessage: userText };
        typing.textContent = t.chat_ask_email || "Registei a sua mensagem! Para que a nossa equipa possa entrar em contacto consigo, qual é o seu endereço de email?";
      }
      list.scrollTop = list.scrollHeight;
    }, 700 + Math.random() * 500);
  }

  function send() {
    const text = input.value.trim();
    if (!text) return;
    addMessage('user', text);
    input.value = '';
    respond(text);
  }

  sendBtn.addEventListener('click', send);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') send(); });
  renderQuickReplies();
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
