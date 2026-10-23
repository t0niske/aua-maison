(function () {
  const D = window.SITE_DATA;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* loader: short counter, then lift */
  const loader = $('#loader'), cnt = $('#loader-count');
  if (reduce) loader.classList.add('done');
  else {
    const t0 = performance.now(), dur = 1300;
    (function tick(t) {
      const p = Math.min(1, (t - t0) / dur);
      cnt.textContent = String(Math.round(p * 100)).padStart(2, '0');
      if (p < 1) requestAnimationFrame(tick); else setTimeout(() => loader.classList.add('done'), 150);
    })(t0);
  }

  /* nav */
  const nav = $('#nav');
  const onScroll = () => nav.classList.toggle('solid', scrollY > 40);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const burger = $('#burger'), mm = $('#mmenu');
  burger.addEventListener('click', () => {
    const open = burger.getAttribute('aria-expanded') !== 'true';
    burger.setAttribute('aria-expanded', open); mm.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
  });
  mm.addEventListener('click', e => { if (e.target.closest('a')) burger.click(); });

  /* facts */
  $('#facts').innerHTML = D.facts.map(f => `<div class="fact reveal"><b>${f.v}</b><span>${esc(f.t)}</span></div>`).join('');

  /* method: pinned scroll progress drives step */
  const method = $('#method'), mts = $$('.mt'), arts = $$('.ma');
  mts.forEach((m, i) => $('h3', m).dataset.n = '0' + (i + 1));
  let curStep = -1;
  function setStep(i) {
    if (i === curStep) return; curStep = i;
    mts.forEach((m, k) => m.classList.toggle('is-on', k === i));
    arts.forEach((a, k) => a.classList.toggle('on', k === i));
    $('#m-num').textContent = '0' + (i + 1);
    $('#m-step').textContent = i + 1;
  }
  function onMethod() {
    const r = method.getBoundingClientRect();
    const total = r.height - innerHeight;
    const p = Math.min(1, Math.max(0, -r.top / total));
    $('#m-bar').style.width = (p * 100) + '%';
    setStep(Math.min(3, Math.floor(p * 4)));
  }
  addEventListener('scroll', onMethod, { passive: true }); onMethod();

  /* collection */
  const cats = Object.entries(D.categories);
  $('#filters').innerHTML = `<button type="button" data-c="all" aria-pressed="true">Вся коллекция · ${D.scents.length}</button>` +
    cats.map(([k, v]) => `<button type="button" data-c="${k}" aria-pressed="false">${v}</button>`).join('');
  $('#coll').innerHTML = D.scents.map(s => `
    <li class="ci" data-c="${s.cat}">
      <button type="button" aria-expanded="false">
        <span class="n">N°${String(s.n).padStart(2, '0')}</span>
        <span class="nm">${esc(s.name)}</span>
        <span class="nt">${s.note} нота</span>
        <span class="ct">${D.categories[s.cat]}</span>
        <span class="pl" aria-hidden="true">+</span>
      </button>
      <div class="desc"><div><p>${esc(s.desc)}</p></div></div>
    </li>`).join('');
  $('#coll').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    const li = b.parentElement, open = !li.classList.contains('open');
    li.classList.toggle('open', open); b.setAttribute('aria-expanded', open);
  });
  $('#filters').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    $$('#filters button').forEach(x => x.setAttribute('aria-pressed', x === b));
    const c = b.dataset.c;
    $$('#coll .ci').forEach(li => li.classList.toggle('hide', c !== 'all' && li.dataset.c !== c));
  });

  /* spaces */
  const byN = n => D.scents.find(s => s.n === n);
  $('#spaces-list').innerHTML = D.industries.map((ind, i) => `
    <article class="sp reveal">
      <span class="n">${['I', 'II', 'III', 'IV', 'V', 'VI'][i]}</span>
      <div><h3>${ind.name}</h3><small>${ind.short}</small></div>
      <div><p>${esc(ind.text)}</p><div class="rec">${ind.scents.map(n => `<span>${esc(byN(n).name)}</span>`).join('')}</div></div>
    </article>`).join('');

  /* devices & plans */
  $('#devs').innerHTML = D.devices.map(d => `
    <article class="dev reveal" data-dev="${d.id}">
      <div class="dev-head">
        <div><h3>${d.name}</h3><p>${esc(d.lead)}</p></div>
        <svg viewBox="0 0 200 260" aria-hidden="true"><use href="#nova-art"/></svg>
      </div>
      <dl class="specs">${d.specs.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
      <div class="plans" role="group" aria-label="Срок подписки ${d.name}">
        ${d.plans.map((p, i) => `<button type="button" class="plan" data-i="${i}" aria-pressed="${i === 2}">
          <span class="pm">${p.months} ${p.months === 1 ? 'месяц' : p.months < 5 ? 'месяца' : 'месяцев'}</span>
          <span class="pt">${D.fmt(p.total)}</span>
          <span class="pp">${D.fmt(D.perMonth(p))} / мес</span></button>`).join('')}
      </div>
      <div class="dev-total"><div><b class="tot"></b><small class="tot-s"></small></div><a class="tot-a" href="#" target="_blank" rel="noopener">Оформить</a></div>
    </article>`).join('');
  function renderDev(card, i) {
    const d = D.devices.find(x => x.id === card.dataset.dev), p = d.plans[i];
    $$('.plan', card).forEach((b, k) => b.setAttribute('aria-pressed', k === i));
    $('.tot', card).textContent = D.fmt(D.perMonth(p)) + ' / мес';
    $('.tot-s', card).textContent = p.months === 1 ? 'помесячная оплата' : `${D.fmt(p.total)} за ${p.months} мес · выгода ${D.fmt(d.plans[0].total * p.months - p.total)}`;
    $('.tot-a', card).href = D.waLink(`Здравствуйте! Хочу подписку ÁUA: ${d.name}, ${p.months} мес. Хочу начать с 3 бесплатных дней.`);
  }
  $$('.dev').forEach(c => {
    renderDev(c, 2);
    c.addEventListener('click', e => { const b = e.target.closest('.plan'); if (b) renderDev(c, +b.dataset.i); });
  });

  /* odors marquee (doubled for seamless loop) */
  const od = D.odors.map(o => `<span>${o}</span>`).join('');
  $('#odors').innerHTML = od + od;

  /* company */
  $('#company-stats').innerHTML = D.company.map(c => `<div class="co reveal"><b>${c.v}</b><span>${c.t}</span></div>`).join('');

  /* faq */
  $('#faq-list').innerHTML = D.faq.map(([q, a]) => `
    <div class="fq"><button type="button" aria-expanded="false"><span>${esc(q)}</span><span aria-hidden="true">+</span></button>
    <div class="a"><div><p>${esc(a)}</p></div></div></div>`).join('');
  $('#faq-list').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    const f = b.parentElement, open = !f.classList.contains('open');
    f.classList.toggle('open', open); b.setAttribute('aria-expanded', open);
  });

  /* contact: build WhatsApp message from the form */
  const send = $('#cform-send');
  function upd() {
    const n = $('#f-name').value.trim(), s = $('#f-space').value, a = $('#f-area').value.trim();
    send.href = D.waLink(`Здравствуйте! ${n ? 'Меня зовут ' + n + '. ' : ''}Хочу аромапрезентацию ÁUA. Пространство: ${s}${a ? ', ' + a + ' м²' : ''}.`);
  }
  $('#cform').addEventListener('input', upd); upd();

  /* reveal on scroll */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  $$('.reveal').forEach(el => io.observe(el));
})();
