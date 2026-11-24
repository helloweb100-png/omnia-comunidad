/* ==========================================================================
   OMNIA COMUNIDAD · script.js
   Número de WhatsApp (10 dígitos, sin 52). Vacío = botón y formulario ocultos.
   ========================================================================== */
const WHATSAPP_NUMBER = "";

(function () {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const hasWA = /^\d{10}$/.test(WHATSAPP_NUMBER);
  const waURL = (msg) => hasWA ? 'https://wa.me/52' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg) : '#contacto';
  const desktop = window.matchMedia('(min-width: 1024px)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  root.classList.add('app');
  if (!reduced) root.classList.add('scrub');
  const scrub = !reduced;

  /* ---------------- WhatsApp: una sola constante ---------------- */
  function setupWA() {
    $$('[data-wa]').forEach((a) => {
      a.setAttribute('href', waURL(a.dataset.wa || ''));
      if (hasWA) { a.target = '_blank'; a.rel = 'noopener'; }
    });
    const fl = $('#waFloat');
    if (fl && hasWA) {
      fl.hidden = false;
      setTimeout(() => fl.classList.add('show-label'), 4000);
      setTimeout(() => fl.classList.remove('show-label'), 9000);
    }
    const form = $('#formWrap'), visit = $('#visit');
    if (hasWA) {
      if (form) form.hidden = false;
      if (visit) visit.hidden = true;
      $$('.wa-only').forEach((e) => e.hidden = false);
      $$('.no-wa-only').forEach((e) => e.hidden = true);
    }
  }
  setupWA();

  /* ---------------- Cargador ---------------- */
  const loader = $('#loader'), pct = $('#pct');
  let lenis = null;
  (function runLoader() {
    const t0 = performance.now();
    const tick = (now) => {
      const t = clamp((now - t0) / 1500);
      if (pct) pct.textContent = Math.round(1 - Math.pow(1 - t, 3) > 0 ? (1 - Math.pow(1 - t, 3)) * 100 : 0) + ' %';
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    setTimeout(() => loader && loader.classList.add('is-iris'), 1500);
    setTimeout(() => root.classList.add('hero-in'), 1650);
    setTimeout(() => {
      if (loader) loader.remove();
      document.body.classList.remove('is-loading');
      if (lenis) lenis.start();
    }, 2000);
  })();

  /* ---------------- Lenis (scroll suave) ---------------- */
  if (!reduced && window.Lenis) {
    try {
      lenis = new window.Lenis({ lerp: 0.085, smoothWheel: true });
      lenis.stop();
      const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
      root.style.scrollBehavior = 'auto';
    } catch (e) { lenis = null; }
  }

  /* ---------------- Anclajes ---------------- */
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    closeMenu();
    if (lenis) lenis.scrollTo(target, { offset: -70, duration: 1.6 });
    else target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  });

  /* ---------------- Menú móvil ---------------- */
  const burger = $('#burger'), menu = $('#menu');
  function closeMenu() {
    if (!menu) return;
    menu.classList.remove('is-open'); menu.setAttribute('aria-hidden', 'true');
    root.classList.remove('menu-open');
    if (burger) { burger.setAttribute('aria-expanded', 'false'); burger.setAttribute('aria-label', 'Abrir menú'); }
  }
  if (burger && menu) {
    burger.addEventListener('click', () => {
      const open = !menu.classList.contains('is-open');
      menu.classList.toggle('is-open', open); menu.setAttribute('aria-hidden', String(!open));
      root.classList.toggle('menu-open', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
    window.addEventListener('resize', () => { if (innerWidth >= 1024) closeMenu(); });
  }

  /* ---------------- Revelado (IO + respaldo por geometría) ---------------- */
  const revealEls = $$('[data-reveal]');
  const pending = new Set(revealEls);
  const show = (el) => { el.classList.add('is-in'); pending.delete(el); if (io) io.unobserve(el); };
  let io = null;
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) show(en.target); });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
    revealEls.forEach((el) => io.observe(el));
  }
  function geoReveal() {
    const vh = innerHeight, vw = innerWidth;
    pending.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < vh * 0.92 && r.bottom > 0 && r.left < vw && r.right > 0) show(el);
    });
  }
  setTimeout(geoReveal, 2000);
  setTimeout(geoReveal, 3500);

  /* ---------------- Progreso de sección ---------------- */
  const prog = (el) => {
    const r = el.getBoundingClientRect();
    const d = r.height - innerHeight;
    return d > 0 ? clamp(-r.top / d) : 0;
  };

  /* ---------------- Referencias de secciones ---------------- */
  const hdr = $('#hdr'), progressBar = $('#progress');
  const nav = $('#nav'), navInd = $('#navInd');
  const navLinks = nav ? $$('a', nav) : [];
  const manif = $('#manifiesto'), words = $$('.w', manif || document);
  const reasons = $('#esencia'), rRail = $('#rRail'), rView = $('.reasons__viewport'), rCards = $$('.rc', reasons || document);
  const hist = $('#historia'), tl = $('#tl'), tlItems = $$('.tl__item'), tlFill = $('#tlFill'), histIcons = $$('.hist__icon'), histBig = $('#histBig');
  const iris = $('#comunidad'), irisMedia = $('#irisMedia'), irisRing = $('#irisRing');
  const valores = $('#valores'), lvls = $$('.lvl').reverse();
  const foot = $('#pie'), footWord = $('#footWord');
  const secOrder = ['inicio', 'ticker', 'manifiesto', 'esencia', 'productos', 'historia', 'fundador', 'mision', 'camino', 'comunidad', 'faq', 'contacto'].map((id) => document.getElementById(id));
  const navMap = { manifiesto: 'esencia', esencia: 'esencia', productos: 'productos', historia: 'historia', fundador: 'historia', mision: 'historia', camino: 'camino', comunidad: 'camino', faq: 'contacto', contacto: 'contacto' };
  let activeNav = null;

  const c1 = [92, 138, 156], c2 = [255, 255, 255], c3 = [63, 208, 164];
  const mix = (a, b, t) => 'rgb(' + a.map((v, i) => Math.round(lerp(v, b[i], t))).join(',') + ')';

  function updNav() {
    if (!nav) return;
    let cur = null;
    secOrder.forEach((s) => { if (s && s.getBoundingClientRect().top <= innerHeight * 0.4) cur = s.id; });
    const key = cur ? navMap[cur] || null : null;
    if (key === activeNav) return;
    activeNav = key;
    let found = null;
    navLinks.forEach((a) => { const on = a.dataset.k === key; a.classList.toggle('is-active', on); if (on) found = a; });
    if (found && desktop.matches) {
      nav.style.setProperty('--ix', found.offsetLeft + 'px');
      nav.style.setProperty('--iw', found.offsetWidth + 'px');
      nav.classList.add('has-ind');
    } else nav.classList.remove('has-ind');
  }

  function updManif() {
    if (!manif || !scrub) return;
    const p = prog(manif), n = words.length;
    manif.style.setProperty('--sc', (0.6 + p * 0.9).toFixed(3));
    const q = clamp((p - 0.8) / 0.1);
    manif.style.setProperty('--q', q.toFixed(3));
    words.forEach((w, i) => {
      const start = 0.05 + (i / n) * 0.62;
      const t = clamp((p - start) / 0.08);
      const em = w.classList.contains('em');
      w.style.color = mix(c1, em ? c3 : c2, t);
      if (em) w.style.setProperty('--k', t.toFixed(3));
    });
  }

  function updReasons() {
    if (!reasons || !rRail) return;
    if (!scrub || !desktop.matches) { rRail.style.transform = ''; rCards.forEach((c) => c.classList.remove('is-active')); return; }
    const p = prog(reasons);
    const max = Math.max(0, rRail.scrollWidth - rView.clientWidth);
    rRail.style.transform = 'translate3d(' + (-p * max).toFixed(1) + 'px,0,0)';
    const idx = Math.round(p * (rCards.length - 1));
    rCards.forEach((c, i) => c.classList.toggle('is-active', i === idx));
    const ring = $('#rProg'), num = $('#rNum');
    if (ring) ring.setAttribute('stroke-dashoffset', (276.46 * (1 - (0.25 + p * 0.75))).toFixed(1));
    if (num) num.textContent = '0' + (idx + 1) + '/04';
  }

  let histIdx = -1;
  function updHist() {
    if (!tl) return;
    const r = tl.getBoundingClientRect(), vh = innerHeight;
    tl.style.setProperty('--lp', clamp((vh * 0.5 - r.top) / r.height).toFixed(3));
    let best = 0, bd = 1e9;
    tlItems.forEach((it, i) => {
      const b = it.getBoundingClientRect();
      const d = Math.abs(b.top + b.height / 2 - vh / 2);
      if (d < bd) { bd = d; best = i; }
    });
    if (best !== histIdx) {
      histIdx = best;
      tlItems.forEach((it, i) => it.classList.toggle('is-active', i === best));
      histIcons.forEach((ic, i) => ic.classList.toggle('is-active', i === best));
      if (histBig) histBig.textContent = '0' + (best + 1);
    }
  }

  function updIris() {
    if (!iris || !scrub) return;
    const p = prog(iris);
    const maxR = Math.hypot(innerWidth, innerHeight) / 2 * 1.08;
    const e = 1 - Math.pow(1 - clamp(p / 0.85), 2.2);
    iris.style.setProperty('--r', (80 + e * (maxR - 80)).toFixed(1) + 'px');
    iris.style.setProperty('--is', (1.3 - 0.3 * e).toFixed(3));
    iris.style.setProperty('--rs', (1 + e * 2.2).toFixed(3));
    iris.style.setProperty('--ro2', clamp(1 - p / 0.6).toFixed(3));
    iris.style.setProperty('--hn', clamp(1 - p * 6).toFixed(3));
    iris.style.setProperty('--t', clamp((p - 0.7) / 0.18).toFixed(3));
  }

  function updPyr() {
    if (!valores || !lvls.length) return;
    const r = valores.getBoundingClientRect(), vh = innerHeight;
    const q = clamp((vh * 0.9 - r.top) / (r.height + vh * 0.35));
    lvls.forEach((l, j) => l.classList.toggle('on', q > 0.18 + j * 0.17));
  }

  function updFoot() {
    if (!foot || !footWord || reduced) return;
    const r = foot.getBoundingClientRect();
    const k = clamp((innerHeight - r.top) / (r.height * 0.9));
    footWord.style.setProperty('--fy', ((1 - k) * 55).toFixed(1) + '%');
  }

  /* ---------------- Camino ---------------- */
  const camList = $('#camList'), camSvg = $('#camSvg');
  const stations = $$('.st');
  let camPath = null, camBase = null, camLeaf = null, camLen = 0, stLens = [];
  const NS = 'http://www.w3.org/2000/svg';
  function buildCamino() {
    if (!camList || !camSvg) return;
    const br = camList.getBoundingClientRect();
    if (!br.width) return;
    const pts = stations.map((st) => {
      const d = $('.st__dot', st).getBoundingClientRect();
      return { x: d.left + d.width / 2 - br.left, y: d.top + d.height / 2 - br.top };
    });
    const sw = desktop.matches ? 70 : 22;
    const all = [{ x: pts[0].x, y: 0 }].concat(pts, [{ x: pts[pts.length - 1].x, y: br.height }]);
    let d = 'M' + all[0].x.toFixed(1) + ' ' + all[0].y.toFixed(1);
    const segs = [];
    for (let i = 1; i < all.length; i++) {
      const a = all[i - 1], b = all[i], dy = b.y - a.y, dir = i % 2 ? 1 : -1;
      d += ' C' + (a.x + sw * dir).toFixed(1) + ' ' + (a.y + dy / 3).toFixed(1) + ',' + (b.x - sw * dir).toFixed(1) + ' ' + (b.y - dy / 3).toFixed(1) + ',' + b.x.toFixed(1) + ' ' + b.y.toFixed(1);
      segs.push(d);
    }
    camSvg.setAttribute('viewBox', '0 0 ' + br.width.toFixed(1) + ' ' + br.height.toFixed(1));
    camSvg.innerHTML = '';
    camBase = document.createElementNS(NS, 'path');
    camBase.setAttribute('d', d); camBase.setAttribute('fill', 'none'); camBase.setAttribute('stroke', 'rgba(10,84,112,.16)'); camBase.setAttribute('stroke-width', '3'); camBase.setAttribute('stroke-linecap', 'round');
    camPath = document.createElementNS(NS, 'path');
    camPath.setAttribute('d', d); camPath.setAttribute('fill', 'none'); camPath.setAttribute('stroke', 'url(#gBrand)'); camPath.setAttribute('stroke-width', '4'); camPath.setAttribute('stroke-linecap', 'round');
    camLeaf = document.createElementNS(NS, 'path');
    camLeaf.setAttribute('d', 'M26 62C36 48 56 44 80 46C76 66 60 78 42 74C34 72 29 68 26 62Z'); camLeaf.setAttribute('fill', 'url(#gLeaf)');
    camSvg.appendChild(camBase); camSvg.appendChild(camPath); camSvg.appendChild(camLeaf);
    camLen = camPath.getTotalLength();
    camPath.style.strokeDasharray = camLen; camPath.style.strokeDashoffset = camLen;
    stLens = [];
    for (let i = 1; i <= pts.length; i++) {
      const tmp = document.createElementNS(NS, 'path');
      tmp.setAttribute('d', segs[i - 1]);
      stLens.push(tmp.getTotalLength());
    }
    updCamino();
  }
  function updCamino() {
    if (!camPath || !camLen) return;
    const r = camList.getBoundingClientRect(), vh = innerHeight;
    const p = reduced ? 1 : clamp((vh * 0.66 - r.top) / r.height);
    const drawn = p * camLen;
    camPath.style.strokeDashoffset = (camLen - drawn).toFixed(1);
    const pt = camPath.getPointAtLength(drawn);
    const pt2 = camPath.getPointAtLength(Math.min(camLen, drawn + 2));
    const ang = Math.atan2(pt2.y - pt.y, pt2.x - pt.x) * 180 / Math.PI;
    camLeaf.setAttribute('transform', 'translate(' + pt.x.toFixed(1) + ' ' + pt.y.toFixed(1) + ') rotate(' + ang.toFixed(1) + ') scale(.55) translate(-53 -61)');
    camLeaf.style.opacity = p > 0.005 ? 1 : 0;
    stations.forEach((st, i) => {
      const lit = drawn >= stLens[i] - 6;
      if (lit !== st.classList.contains('is-lit')) {
        st.classList.toggle('is-lit', lit);
        if (lit && window.anime && !reduced) {
          window.anime({ targets: $('.st__dot', st), scale: [1, 1.5, 1.1], duration: 700, easing: 'easeOutElastic(1, .6)' });
        }
      }
    });
  }
  if (camList) {
    if (!reduced) stations.forEach((s) => s.classList.remove('is-lit'));
    setTimeout(buildCamino, 60);
    window.addEventListener('load', buildCamino);
  }

  /* ---------------- Bucle de scroll unificado ---------------- */
  let ticking = false;
  function onFrame() {
    ticking = false;
    const y = window.scrollY || window.pageYOffset;
    const maxScroll = document.documentElement.scrollHeight - innerHeight;
    if (progressBar) progressBar.style.setProperty('--sp', maxScroll > 0 ? clamp(y / maxScroll).toFixed(4) : 0);
    if (hdr) hdr.classList.toggle('is-small', y > 40);
    updNav(); updManif(); updReasons(); updHist(); updIris(); updPyr(); updFoot(); updCamino();
    geoReveal();
  }
  function request() { if (!ticking) { ticking = true; requestAnimationFrame(onFrame); } }
  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', () => { buildCamino(); histIdx = -1; activeNav = null; request(); });
  window.addEventListener('load', request);
  request();
  setTimeout(request, 400);

  /* ---------------- Hero: rotador, anillo 3D y red de partículas ---------------- */
  const rot = $('#rot');
  if (rot && !reduced) {
    const spans = $$('span', rot); let ri = 0;
    setInterval(() => {
      const prev = spans[ri]; prev.classList.remove('on'); prev.classList.add('out');
      ri = (ri + 1) % spans.length;
      const nxt = spans[ri]; nxt.classList.remove('out'); nxt.classList.add('on');
      setTimeout(() => { prev.classList.remove('out'); }, 700);
    }, 2600);
  }

  const ring3d = $('#ring3d');
  let mx = 0, my = 0, tx = 0, ty = 0, pointerActive = false, rxv = 0, ryv = 0;
  window.addEventListener('pointermove', (e) => {
    pointerActive = true;
    mx = (e.clientX / innerWidth - 0.5) * 2; my = (e.clientY / innerHeight - 0.5) * 2;
    netMouse.x = e.clientX; netMouse.y = e.clientY;
  }, { passive: true });
  const netMouse = { x: -999, y: -999 };

  /* Canvas de red */
  const cv = $('#net');
  let netVisible = true, netRunning = false;
  const leafPath = (typeof Path2D !== 'undefined') ? new Path2D('M26 62C36 48 56 44 80 46C76 66 60 78 42 74C34 72 29 68 26 62Z') : null;
  let parts = [], W = 0, H = 0, dpr = 1, ctx = null;
  function initNet() {
    if (!cv) return;
    ctx = cv.getContext('2d');
    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      const r = cv.getBoundingClientRect();
      W = r.width; H = r.height;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = innerWidth < 768 ? 34 : 64;
      parts = [];
      for (let i = 0; i < n; i++) {
        const leaf = Math.random() < 0.25;
        parts.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.25, vy: -(0.1 + Math.random() * 0.35), r: leaf ? 6 + Math.random() * 6 : 1.2 + Math.random() * 1.8, leaf, rot: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.01 });
      }
      if (reduced) drawNet(true);
    };
    resize();
    window.addEventListener('resize', resize);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((en) => { netVisible = en[0].isIntersecting; if (netVisible) startNet(); }).observe(cv);
    }
    startNet();
  }
  function startNet() { if (reduced || netRunning || !netVisible) return; netRunning = true; requestAnimationFrame(netLoop); }
  function netLoop() {
    if (!netVisible) { netRunning = false; return; }
    drawNet(false);
    requestAnimationFrame(netLoop);
  }
  function drawNet(still) {
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);
    const rect = cv.getBoundingClientRect();
    const mxp = netMouse.x - rect.left, myp = netMouse.y - rect.top;
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      if (!still) {
        const dx = mxp - p.x, dy = myp - p.y, d2 = dx * dx + dy * dy;
        if (d2 < 22500 && d2 > 1) { const d = Math.sqrt(d2), f = (1 - d / 150) * 0.03; p.vx += dx / d * f; p.vy += dy / d * f; }
        p.vx *= 0.995; p.vy = p.vy * 0.995 + (-0.2 - p.vy) * 0.002;
        p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        if (p.y < -20) { p.y = H + 20; p.x = Math.random() * W; }
        if (p.x < -20) p.x = W + 20; else if (p.x > W + 20) p.x = -20;
      }
      for (let j = i + 1; j < parts.length; j++) {
        const q = parts[j], dx = p.x - q.x, dy = p.y - q.y, d2 = dx * dx + dy * dy;
        if (d2 < 14400) {
          ctx.strokeStyle = 'rgba(10,134,160,' + ((1 - Math.sqrt(d2) / 120) * 0.28).toFixed(3) + ')';
          ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        }
      }
    }
    for (const p of parts) {
      if (p.leaf && leafPath) {
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); const s = p.r * 2 / 54; ctx.scale(s, s); ctx.translate(-53, -61);
        ctx.fillStyle = 'rgba(63,208,164,.6)'; ctx.fill(leafPath); ctx.restore();
      } else {
        ctx.fillStyle = 'rgba(10,134,160,.55)'; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
      }
    }
  }
  initNet();

  /* ---------------- Productos ---------------- */
  const PRODUCTS = [
    { n: 'Aloe con Tepezcohuite y Cuachalalate', g: '#3FD0A4', d: 'Presentación de 500 ml con Tepezcohuite y Cuachalalate, plantas de la herbolaria mexicana. Su etiqueta indica que apoya el sistema inmune e hidrata y nutre el organismo.', aloe: true },
    { n: 'Aloe Piña', g: '#E8C14A', d: 'La versión con piña de nuestro Aloe, de la línea Omnia.' },
    { n: 'Fibra', g: '#C9A06A', d: 'Suplemento de fibra de la línea Omnia para acompañar tu alimentación diaria.' },
    { n: 'Depura-T', g: '#7BC96F', d: 'Fórmula Depura-T de la línea Omnia. Pide a tu asesor su ficha técnica completa.' },
    { n: 'Pancrea Plus', g: '#2FA3C7', d: 'Fórmula Pancrea Plus de la línea Omnia. Pide a tu asesor su ficha técnica completa.' },
    { n: 'Omegas', g: '#F2A65A', d: 'Suplemento de ácidos grasos Omega de la línea Omnia.' },
    { n: 'Lactosuero', g: '#CFE8F5', d: 'Suplemento a base de lactosuero (suero de leche) de la línea Omnia.' }
  ];
  const prodSec = $('#productos'), tabs = $$('.tab'), stage = $('#stage');
  const bSpin = $('#bSpin'), bTilt = $('#bTilt');
  const labName = $('#labName'), labClaims = $('#labClaims');
  const info = $('#info'), infoName = $('#infoName'), infoDesc = $('#infoDesc'), infoCta = $('#infoCta');
  let cur = 0, auto = !reduced, autoTimer = null;

  function buildBubbles() {
    const wrap = $('#bubbles');
    if (!wrap || reduced) return;
    for (let i = 0; i < 14; i++) {
      const b = document.createElement('i');
      const s = 5 + Math.random() * 11;
      b.style.cssText = 'left:' + (8 + Math.random() * 84) + '%;width:' + s + 'px;height:' + s + 'px;animation-duration:' + (4 + Math.random() * 5).toFixed(2) + 's;animation-delay:-' + (Math.random() * 8).toFixed(2) + 's';
      wrap.appendChild(b);
    }
  }
  buildBubbles();

  function splash() {
    const wrap = $('#drops');
    if (!wrap || reduced) return;
    wrap.innerHTML = '';
    for (let i = 0; i < 8; i++) wrap.appendChild(document.createElement('i'));
    const drops = $$('i', wrap);
    if (window.anime) {
      window.anime({
        targets: drops, opacity: [{ value: 1, duration: 60 }, { value: 0, duration: 600 }],
        translateX: () => window.anime.random(-90, 90), translateY: [{ value: () => window.anime.random(-90, -30), duration: 300, easing: 'easeOutQuad' }, { value: 12, duration: 340, easing: 'easeInQuad' }],
        scale: [0.6, 1.2], delay: window.anime.stagger(30), easing: 'easeOutQuad'
      });
    } else {
      drops.forEach((d, i) => {
        const dx = (i - 3.5) * 24;
        d.animate([{ transform: 'translate(0,0)', opacity: 1 }, { transform: 'translate(' + dx + 'px,-70px)', opacity: 1, offset: .5 }, { transform: 'translate(' + dx * 1.2 + 'px,10px)', opacity: 0 }], { duration: 700, delay: i * 30, easing: 'ease-out' });
      });
    }
  }

  function setProduct(i, byUser) {
    i = (i + PRODUCTS.length) % PRODUCTS.length;
    const prev = cur; cur = i;
    const p = PRODUCTS[i];
    if (byUser) { auto = false; prodSec.classList.remove('auto'); clearInterval(autoTimer); }
    tabs.forEach((t, k) => { const on = k === i; t.classList.toggle('is-active', on); t.setAttribute('aria-selected', String(on)); });
    const act = tabs[i];
    if (act && tabs[0] && act.parentElement.scrollWidth > act.parentElement.clientWidth && !desktop.matches) {
      act.parentElement.scrollTo({ left: act.offsetLeft - 20, behavior: reduced ? 'auto' : 'smooth' });
    }
    prodSec.style.setProperty('--glow', p.g);
    const swap = () => {
      labName.textContent = p.n;
      labClaims.hidden = !p.aloe;
      if (infoName) infoName.textContent = p.n;
      if (infoDesc) infoDesc.textContent = p.d;
      if (infoCta) { infoCta.textContent = 'Quiero la ficha de ' + p.n; infoCta.dataset.wa = 'Hola Omnia, quiero la ficha técnica de ' + p.n; infoCta.setAttribute('href', waURL(infoCta.dataset.wa)); }
      if (info) { info.classList.remove('is-swap'); void info.offsetWidth; info.classList.add('is-swap'); }
    };
    if (prev === i && !byUser) { swap(); return; }
    if (bSpin && !reduced && bSpin.animate) {
      bSpin.animate([{ transform: 'rotateY(0deg)' }, { transform: 'rotateY(360deg)' }], { duration: 700, easing: 'cubic-bezier(.5,0,.2,1)' });
      setTimeout(swap, 340);
      setTimeout(splash, 560);
    } else swap();
    // reinicia la barra de progreso de la pestaña activa
    if (auto) { prodSec.classList.remove('auto'); void prodSec.offsetWidth; prodSec.classList.add('auto'); }
  }
  tabs.forEach((t, k) => t.addEventListener('click', () => setProduct(k, true)));
  tabs.forEach((t) => t.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); setProduct(cur + 1, true); tabs[cur].focus(); }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); setProduct(cur - 1, true); tabs[cur].focus(); }
  }));
  if (prodSec) {
    labClaims.hidden = false;
    if (auto) {
      prodSec.classList.add('auto');
      autoTimer = setInterval(() => {
        const r = prodSec.getBoundingClientRect();
        if (r.top < innerHeight * 0.8 && r.bottom > innerHeight * 0.2) setProduct(cur + 1, false);
      }, 5000);
    }
  }
  // inclinación de la botella con el puntero
  let bx = 0, by = 0;
  function bottleLoop(t) {
    if (stage && bTilt) {
      const r = stage.getBoundingClientRect();
      if (r.bottom > 0 && r.top < innerHeight) {
        let ty2, tx2;
        if (finePointer && pointerActive) {
          const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
          tx2 = clamp((mx * innerWidth / 2 + innerWidth / 2 - cx) / (innerWidth / 2), -1, 1) * 14;
          ty2 = clamp((my * innerHeight / 2 + innerHeight / 2 - cy) / (innerHeight / 2), -1, 1) * -8;
        } else { tx2 = Math.sin(t / 1800) * 12; ty2 = Math.cos(t / 2300) * 5; }
        by = lerp(by, tx2, 0.07); bx = lerp(bx, ty2, 0.07);
        bTilt.style.setProperty('--by', by.toFixed(2) + 'deg'); bTilt.style.setProperty('--bx', bx.toFixed(2) + 'deg');
      }
    }
    // anillo del hero
    if (ring3d && !reduced) {
      if (finePointer && pointerActive) { tx = mx * 8; ty = -my * 8; } else { tx = Math.sin(t / 2500) * 7; ty = Math.cos(t / 3100) * 5; }
      ryv = lerp(ryv, tx, 0.06); rxv = lerp(rxv, ty, 0.06);
      ring3d.style.setProperty('--ry', ryv.toFixed(2) + 'deg'); ring3d.style.setProperty('--rx', rxv.toFixed(2) + 'deg');
    }
    requestAnimationFrame(bottleLoop);
  }
  if (!reduced) requestAnimationFrame(bottleLoop);

  /* ---------------- Tarjetas con inclinación 3D (bento) ---------------- */
  if (finePointer && !reduced) {
    $$('.tilt').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        el.style.setProperty('--mx', (px * 100).toFixed(1) + '%'); el.style.setProperty('--my', (py * 100).toFixed(1) + '%');
        el.style.transform = 'perspective(900px) rotateX(' + ((0.5 - py) * 8).toFixed(2) + 'deg) rotateY(' + ((px - 0.5) * 8).toFixed(2) + 'deg)';
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------------- FAQ ---------------- */
  $$('.fq').forEach((item) => {
    const btn = $('button', item);
    btn.addEventListener('click', () => {
      const open = !item.classList.contains('is-open');
      $$('.fq').forEach((o) => { o.classList.remove('is-open'); $('button', o).setAttribute('aria-expanded', 'false'); });
      item.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
  });

  /* ---------------- Formulario → WhatsApp ---------------- */
  const form = $('#waForm');
  if (form) {
    const nombre = $('#fNombre'), err = $('#errNombre');
    nombre.addEventListener('input', () => { err.textContent = ''; nombre.closest('.fld').classList.remove('has-err'); nombre.removeAttribute('aria-invalid'); });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = nombre.value.trim();
      if (name.length < 2) {
        err.textContent = 'Cuéntanos tu nombre para saludarte como mereces.';
        nombre.closest('.fld').classList.add('has-err'); nombre.setAttribute('aria-invalid', 'true'); nombre.focus();
        return;
      }
      if (!hasWA) return;
      const interes = (form.querySelector('input[name=interes]:checked') || {}).value || '';
      const prod = $('#fProd').value, msg = $('#fMsg').value.trim();
      let text = 'Hola Omnia Comunidad, soy ' + name + '. Me interesa: ' + interes + '.';
      if (prod) text += ' Producto: ' + prod + '.';
      if (msg) text += ' ' + msg;
      window.open(waURL(text), '_blank', 'noopener');
    });
  }

  /* ---------------- Insignia de horario (hora de Ciudad de México) ---------------- */
  (function badge() {
    const b = $('#badge'), t = $('#badgeT');
    if (!b || !t) return;
    function paint() {
      let open = false;
      try {
        const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Mexico_City', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date());
        const g = (k) => (parts.find((p) => p.type === k) || {}).value;
        const day = g('weekday'), h = parseInt(g('hour'), 10) % 24, m = parseInt(g('minute'), 10);
        const mins = h * 60 + m;
        open = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].indexOf(day) > -1 && mins >= 600 && mins < 960;
      } catch (e) { t.textContent = 'Lunes a viernes'; return; }
      b.classList.toggle('is-open', open); b.classList.toggle('is-closed', !open);
      t.textContent = open ? 'Abierto ahora' : 'Cerrado ahora';
    }
    paint(); setInterval(paint, 60000);
  })();

  /* ---------------- Cursor personalizado ---------------- */
  if (finePointer && !reduced) {
    const dot = $('#curDot'), halo = $('#curHalo');
    if (dot && halo) {
      root.classList.add('cur-on');
      let cx = innerWidth / 2, cy = innerHeight / 2, hx = cx, hy = cy;
      dot.style.opacity = '0'; halo.style.opacity = '0';
      window.addEventListener('pointermove', (e) => { cx = e.clientX; cy = e.clientY; dot.style.opacity = ''; halo.style.opacity = ''; }, { passive: true });
      document.addEventListener('pointerover', (e) => { halo.classList.toggle('is-big', !!e.target.closest('a, button, label, summary, .tab')); });
      (function loop() {
        hx = lerp(hx, cx, 0.16); hy = lerp(hy, cy, 0.16);
        dot.style.transform = 'translate3d(' + cx + 'px,' + cy + 'px,0)';
        halo.style.transform = 'translate3d(' + hx + 'px,' + hy + 'px,0)';
        requestAnimationFrame(loop);
      })();
    }
  }

  /* Respaldo final: si algo quedó sin revelar tras cargar, se muestra. */
  window.addEventListener('load', () => { setTimeout(geoReveal, 1200); });
})();
