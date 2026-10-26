/* ÁUA — меню, сцены с точками (Точки / Список), всплывающие карточки зон,
   дегустация и бриф → WhatsApp, цели аналитики. */
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* Цели: tasting_request, brief_submit, deck_download, wa_click (+ brief_open).
     Пока счётчиков нет (config.js), события остаются в dataLayer */
  function track(ev, params) {
    params = params || {};
    params.page = location.pathname;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: ev }, params));
    if (window.ym && window.YM_ID) window.ym(window.YM_ID, 'reachGoal', ev, params);
    if (window.gtag) window.gtag('event', ev, params);
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a');
    if (!a) return;
    if (a.getAttribute('data-ev')) track(a.getAttribute('data-ev'));
    else if (/wa\.me\//.test(a.href)) track('wa_click');
  });
  function openWa(base, msg) { window.open(base + '?text=' + encodeURIComponent(msg), '_blank', 'noopener'); }

  var burger = $('#burger');
  var setMenu = function (open) {
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  };
  burger.addEventListener('click', function () { setMenu(!document.body.classList.contains('menu-open')); });
  $$('.menu a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });

  /* сцены */
  $$('.stage').forEach(function (st) {
    var views = $$('.stage-view', st), tabs = $$('.toggle button', st);
    tabs.forEach(function (b) {
      b.addEventListener('click', function () {
        tabs.forEach(function (x) { x.setAttribute('aria-selected', x === b); });
        views.forEach(function (v) { v.hidden = v.getAttribute('data-view') !== b.getAttribute('data-to'); });
        closePops();
      });
    });

    var art = $('.stage-art', st);
    function closePops() {
      $$('.pop', st).forEach(function (p) { p.hidden = true; });
      $$('button.hs', st).forEach(function (h) { h.setAttribute('aria-expanded', 'false'); });
    }
    $$('button.hs', st).forEach(function (h) {
      h.addEventListener('click', function (e) {
        e.stopPropagation();
        var pop = document.getElementById(h.getAttribute('aria-controls'));
        var was = !pop.hidden;
        closePops();
        if (was) return;
        pop.hidden = false;
        h.setAttribute('aria-expanded', 'true');
        // карточка рядом с точкой, но в пределах сцены
        var ar = art.getBoundingClientRect(), hr = h.getBoundingClientRect(), vr = pop.parentNode.getBoundingClientRect();
        var w = pop.offsetWidth, ph = pop.offsetHeight;
        var x = hr.left - vr.left + (hr.left - ar.left > ar.width / 2 ? -w - 16 : hr.width + 16);
        var y = hr.top - vr.top - ph / 2 + hr.height / 2;
        x = Math.max(0, Math.min(x, vr.width - w));
        y = Math.max(0, Math.min(y, vr.height - ph));
        if (window.innerWidth < 760) { x = (vr.width - w) / 2; y = hr.top - vr.top + hr.height + 12; }
        pop.style.left = x + 'px'; pop.style.top = y + 'px';
      });
    });
    $$('.pop-x', st).forEach(function (b) { b.addEventListener('click', closePops); });
    document.addEventListener('click', function (e) { if (!e.target.closest('.pop')) closePops(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closePops(); setMenu(false); } });
  });

  /* дегустация → WhatsApp с меткой сайта и страницы */
  var form = $('#lead-form');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = function (id) { return $(id).value.trim(); };
    var msg = 'Здравствуйте! Пишу с сайта ÁUA, страница «' + form.getAttribute('data-page') + '». Хочу дегустацию на объекте.' +
      (v('#f-name') ? '\nИмя: ' + v('#f-name') : '') + (v('#f-phone') ? '\nТелефон: ' + v('#f-phone') : '') +
      (v('#f-biz') ? '\nКомпания: ' + v('#f-biz') : '') + '\nПространство: ' + v('#f-type');
    track('tasting_request', { space: v('#f-type') });
    openWa(form.getAttribute('data-wa'), msg);
  });

  /* бриф: по одному вопросу на экран; без JS видны все пять */
  var brief = $('#brief');
  if (brief) (function () {
    var steps = $$('.bq', brief), cur = 0, n = steps.length;
    var prev = $('#bq-prev'), next = $('#bq-next'), send = $('#bq-send'), prog = $('.bq-prog', brief), bar = $('.bq-bar i', brief);
    brief.classList.add('stepped');
    function show(i) {
      cur = Math.max(0, Math.min(n - 1, i));
      steps.forEach(function (s, k) { s.hidden = k !== cur; });
      prev.hidden = cur === 0; next.hidden = cur === n - 1; send.hidden = cur !== n - 1;
      prog.textContent = ('0' + (cur + 1)).slice(-2) + ' / ' + ('0' + n).slice(-2);
      bar.style.width = ((cur + 1) / n * 100) + '%';
    }
    prev.addEventListener('click', function () { show(cur - 1); focusStep(); });
    next.addEventListener('click', function () { show(cur + 1); focusStep(); });
    function focusStep() { var l = $('legend', steps[cur]); l.setAttribute('tabindex', '-1'); l.focus({ preventScroll: true }); brief.scrollIntoView({ block: 'start', behavior: 'smooth' }); }
    // выбор в один клик переводит на следующий вопрос (кроме площади и семейств)
    $$('input[name="when"]', brief).forEach(function (r) { r.addEventListener('change', function () { setTimeout(function () { show(cur + 1); }, 250); }); });
    // тип пространства из адреса: /brif/?type=otel
    var t = (location.search.match(/[?&]type=([\w-]+)/) || [])[1];
    if (t) { var r = $('input[data-slug="' + t + '"]', brief); if (r) r.checked = true; }
    // подсказки слов заполняют первое пустое поле
    $$('.chip-b', brief).forEach(function (b) {
      b.addEventListener('click', function () {
        var f = $$('.words input', brief).filter(function (x) { return !x.value.trim(); })[0];
        if (f) { f.value = b.textContent; b.disabled = true; }
      });
    });
    $('#bq-share').addEventListener('click', function () {
      var url = location.origin + location.pathname + (t ? '?type=' + t : '');
      if (navigator.share) navigator.share({ title: 'Бриф на аромат — ÁUA', url: url }).catch(function () {});
      else if (navigator.clipboard) navigator.clipboard.writeText(url).then(function () { $('#bq-share').lastChild.textContent = 'Ссылка скопирована'; });
    });
    brief.addEventListener('submit', function (e) {
      e.preventDefault();
      var val = function (name) { return $$('[name="' + name + '"]', brief).filter(function (x) { return x.type === 'radio' || x.type === 'checkbox' ? x.checked : x.value.trim(); }).map(function (x) { return x.value.trim(); }).join(', '); };
      var words = ['w1', 'w2', 'w3'].map(val).filter(Boolean).join(', ');
      var rows = [['Пространство', [val('type'), val('area')].filter(Boolean).join(', ')], ['Образ', words], ['Семейства', val('fam')], ['Запуск', val('when')],
        ['Имя', val('name')], ['Телефон', val('phone')], ['Компания', val('company')]];
      var msg = 'Здравствуйте! Бриф на аромат с сайта ÁUA, страница «Бриф».' + rows.filter(function (r) { return r[1]; }).map(function (r) { return '\n' + r[0] + ': ' + r[1]; }).join('');
      track('brief_submit', { space: val('type') });
      openWa(brief.getAttribute('data-wa'), msg);
    });
    show(0);
  })();

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    $$('.sec .sec-head, .sec .cards > *, .steps > li, .srows > li, .facts > div, .zone-list > li').forEach(function (el, i) {
      el.classList.add('rv'); el.style.transitionDelay = (i % 4) * 70 + 'ms'; io.observe(el);
    });
  }
})();
