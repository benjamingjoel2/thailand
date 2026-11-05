// Longtail Travel — small progressive enhancements. Loaded with `defer`; the site works without it.
(() => {
  const d = document;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = d) => r.querySelector(s);
  const $$ = (s, r = d) => [...r.querySelectorAll(s)];

  // Header: solid after scrolling past the hero, hidden while scrolling down.
  const hdr = $('#hdr');
  let lastY = scrollY;
  const onHeader = () => {
    const y = scrollY;
    if (!hdr.hasAttribute('data-solid')) hdr.classList.toggle('is-solid', y > 40);
    hdr.classList.toggle('is-hidden', y > 400 && y > lastY && !d.body.classList.contains('menu-open'));
    lastY = y;
  };

  // Menu overlay
  const menu = $('#menu');
  const openBtn = $('.hdr .menu-btn');
  const setMenu = (open) => {
    if (open) menu.hidden = false;
    requestAnimationFrame(() => menu.classList.toggle('is-open', open));
    openBtn.setAttribute('aria-expanded', String(open));
    d.body.classList.toggle('menu-open', open);
    d.body.style.overflow = open ? 'hidden' : '';
    if (open) setTimeout(() => $('.menu-close', menu).focus(), 50);
    else { openBtn.focus(); setTimeout(() => { if (!menu.classList.contains('is-open')) menu.hidden = true; }, 650); }
  };
  openBtn?.addEventListener('click', () => setMenu(true));
  $('.menu-close', menu)?.addEventListener('click', () => setMenu(false));
  d.addEventListener('keydown', (e) => {
    if (!menu.classList.contains('is-open')) return;
    if (e.key === 'Escape') setMenu(false);
    if (e.key === 'Tab') {
      const f = $$('a,button', menu).filter((x) => x.offsetParent);
      if (e.shiftKey && d.activeElement === f[0]) { e.preventDefault(); f.at(-1).focus(); }
      else if (!e.shiftKey && d.activeElement === f.at(-1)) { e.preventDefault(); f[0].focus(); }
    }
  });

  // Reveal on scroll
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  $$('[data-reveal]').forEach((el) => io.observe(el));

  // Scroll-linked progress: ribbons draw themselves; the home river boat sails.
  const prog = $$('[data-progress]');
  const boat = $('#riverboat');
  const line = $('#riverline');
  const len = line ? line.getTotalLength() : 0;
  const bp = $('#boatpath');
  let bpBoat, bpPath, bpLen;
  if (bp && !reduce) {
    bpPath = $('#bp', bp);
    bpLen = bpPath.getTotalLength();
    bpBoat = d.createElement('div');
    bpBoat.style.cssText = 'position:absolute;left:50%;top:0;width:44px;height:22px;margin:-11px 0 0 -22px;will-change:transform';
    bpBoat.innerHTML = '<svg viewBox="-100 -30 160 60" width="44" height="22" style="overflow:visible;transform:rotate(90deg)">' + ($('#riverboat') ? $('#riverboat').innerHTML : '') + '</svg>';
    bp.appendChild(bpBoat);
  }
  const clamp = (v) => Math.max(0, Math.min(1, v));
  const onProgress = () => {
    const vh = innerHeight;
    for (const el of prog) {
      const r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) continue;
      const p = clamp((vh - r.top) / (vh * 0.9 + r.height * 0.6));
      el.style.setProperty('--p', reduce ? 1 : p.toFixed(3));
      if (el.id === 'river' && boat && len) {
        const t = clamp((vh - r.top) / (vh + r.height));
        const at = len * (0.03 + t * 0.94);
        const a = line.getPointAtLength(at), b = line.getPointAtLength(Math.min(len, at + 2));
        const ang = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
        boat.setAttribute('transform', `translate(${a.x.toFixed(1)} ${a.y.toFixed(1)}) rotate(${ang.toFixed(1)})`);
        line.style.setProperty('--p', (0.03 + t * 0.94).toFixed(3));
      }
    }
    if (bpBoat) {
      const max = d.documentElement.scrollHeight - innerHeight;
      const t = clamp(scrollY / max);
      bp.classList.toggle('is-on', scrollY > innerHeight * 0.6);
      const h = bp.clientHeight;
      const pt = bpPath.getPointAtLength(bpLen * t);
      bpBoat.style.transform = `translate(${((pt.x - 17) / 34) * 34}px, ${(pt.y / 1000) * h}px)`;
    }
  };
  let ticking = false;
  addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { onHeader(); onProgress(); ticking = false; });
  }, { passive: true });
  addEventListener('resize', onProgress, { passive: true });
  onHeader(); onProgress();
  if (reduce) $$('svg').forEach((s) => s.pauseAnimations && s.pauseAnimations());

  // Two-coasts picker: default to the current month or ?m=
  const coasts = $('.coasts');
  if (coasts) {
    const q = +new URLSearchParams(location.search).get('m');
    const m = q >= 1 && q <= 12 ? q : new Date().getMonth() + 1;
    const r = $('#m' + m);
    if (r) r.checked = true;
  }

  // Destination filters
  const filters = $('.filters');
  if (filters) {
    filters.hidden = false;
    filters.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      $$('button', filters).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      $$('.dcard').forEach((c) => { c.hidden = b.dataset.f !== 'all' && c.dataset.region !== b.dataset.f; });
    });
  }

  // Khlong map
  const kmap = $('#kmap');
  if (kmap) {
    const btns = $$('.routes button');
    const items = $$('.stops li');
    btns.forEach((b) => b.addEventListener('click', () => {
      const on = b.getAttribute('aria-pressed') !== 'true';
      btns.forEach((x) => x.setAttribute('aria-pressed', String(on && x === b)));
      const r = on ? b.dataset.route : 'all';
      kmap.dataset.route = r;
      items.forEach((li) => li.classList.toggle('is-dim', r !== 'all' && !li.dataset.r.includes(r)));
    }));
    const activate = (id) => {
      $$('.stop', kmap).forEach((s) => s.classList.toggle('is-active', s.dataset.stop === id));
      items.forEach((li) => li.classList.toggle('is-active', li.dataset.stop === id));
    };
    items.forEach((li) => {
      const b = $('button', li);
      b.addEventListener('click', () => activate(li.dataset.stop));
      b.addEventListener('mouseenter', () => activate(li.dataset.stop));
      b.addEventListener('focus', () => activate(li.dataset.stop));
    });
  }

  // Sub-navigation: highlight the section in view
  const sub = $('.subnav');
  if (sub) {
    const links = $$('a', sub);
    const so = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id));
    }), { rootMargin: '-40% 0px -55% 0px' });
    links.forEach((a) => { const t = $(a.getAttribute('href')); if (t) so.observe(t); });
  }

  // Enquiry form: prefill from ?m= / ?d= / ?j=, validate, then post to the form service.
  const form = $('#enquiry');
  if (form) {
    const qs = new URLSearchParams(location.search);
    const m = +qs.get('m');
    if (m) { const o = $(`#month option[data-m="${m}"]`); if (o) o.selected = true; }
    const ctx = qs.get('d') || qs.get('j');
    if (ctx) form.elements.interest_destination.value = ctx;
    form.elements._next.value = location.origin + form.dataset.thanks;
    const fields = [['name', (v) => v.trim().length > 1], ['email', (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())]];
    form.addEventListener('submit', (e) => {
      let first = null;
      for (const [n, ok] of fields) {
        const el = form.elements[n];
        const bad = !ok(el.value);
        el.closest('.field').classList.toggle('is-invalid', bad);
        el.setAttribute('aria-invalid', String(bad));
        if (bad && !first) first = el;
      }
      const c = form.elements.consent;
      $('#f-consent').classList.toggle('is-invalid', !c.checked);
      c.setAttribute('aria-invalid', String(!c.checked));
      if (!c.checked && !first) first = c;
      if (first) { e.preventDefault(); first.focus(); return; }
      const btn = $('button[type=submit]', form);
      btn.textContent = btn.dataset.sending;
      btn.disabled = true;
    });
  }
})();
