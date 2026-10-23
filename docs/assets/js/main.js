/* ÁUA — меню, сцены с точками (Точки / Список), всплывающие карточки зон, заявка. */
(function () {
  var D = window.SITE_DATA;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

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

  /* заявка → WhatsApp */
  var form = $('#lead-form');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var n = $('#f-name').value.trim(), t = $('#f-type').value, b = $('#f-biz').value.trim();
    var msg = 'Здравствуйте! Хочу подобрать аромат (ÁUA).' + (n ? '\nИмя: ' + n : '') + '\nПространство: ' + t + (b ? '\nОбъект: ' + b : '') + '\nСтраница: ' + document.title;
    window.open(D.waLink(msg), '_blank', 'noopener');
  });

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    $$('.sec .sec-head, .sec .cards > *, .steps > li, .srows > li, .facts > div, .zone-list > li').forEach(function (el, i) {
      el.classList.add('rv'); el.style.transitionDelay = (i % 4) * 70 + 'ms'; io.observe(el);
    });
  }
})();
