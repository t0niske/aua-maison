/* ÁUA: layout и блоки. Визуальный язык — референс massage-self: гипсовые рендеры
   на бледно-голубом, точки с выносками, переключатель «Точки / Список». */
const D = require('../lib/data');
const { esc } = require('../lib/engine');
const { spaces } = require('./content');

let site;
const init = s => { site = s; };

const ICONS = {
  arrowUR: '<path d="M7 17 17 7M8 7h9v9"/>',
  arrowUL: '<path d="M17 17 7 7M7 16V7h9"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  dots: '<circle cx="12" cy="12" r="8"/><path d="M12 8v8M8 12h8"/>',
  grid: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
  tap: '<path d="M9 11V6a2 2 0 0 1 4 0v5M13 10a2 2 0 0 1 4 0v4a6 6 0 0 1-6 6h-1a5 5 0 0 1-4-2l-3-4a1.6 1.6 0 0 1 2.4-2L9 15"/><path d="M3 3h3M3 3v3M21 3h-3M21 3v3"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>'
};
const icon = (n, cls = 'ic') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n]}</svg>`;

const MENU = [
  ['Пространства', 'prostranstva/'], ['Коллекция ароматов', 'kollekciya/'], ['Фирменный аромат', 'signature/'],
  ['Метод', 'metod/'], ['Условия', 'usloviya/'], ['Журнал', 'zhurnal/'], ['Контакты', 'kontakty/']
];

function header() {
  return `<a class="skip" href="#main">К содержанию</a>
<header class="hdr">
  <a class="logo" href="/" aria-label="ÁUA — на главную">ÁUA</a>
  <span class="meta">// Астана</span>
  <span class="meta meta-2">// премиальная ароматизация</span>
  <a class="hdr-cta" href="#kontakt">Подобрать аромат</a>
  <button class="burger" id="burger" type="button" aria-label="Открыть меню" aria-expanded="false" aria-controls="menu"><i></i><i></i><i></i></button>
</header>
<nav class="menu" id="menu" aria-label="Основное меню">
  <div class="menu-in">
    <ol class="menu-main">${MENU.map(([n, h], i) => `<li><a href="/${h}"><span>${String(i + 1).padStart(2, '0')}</span>${n}</a></li>`).join('')}</ol>
    <div class="menu-side">
      <p class="menu-k">// пространства</p>
      ${spaces.map(s => `<a href="/prostranstva/${s.slug}/">${s.h1}</a>`).join('')}
      <p class="menu-k">// связь</p>
      <a href="tel:${D.contacts.phoneRaw}">${D.contacts.phone}</a>
      <a href="${D.waLink()}" target="_blank" rel="noopener">WhatsApp</a>
    </div>
  </div>
</nav>`;
}

function footer() {
  const C = D.contacts;
  return `<footer class="ftr">
  <div class="wrap ftr-in">
    <div>
      <a class="logo" href="/">ÁUA</a>
      <p>Премиальная ароматизация пространств в Астане: отели, бутики, рестораны, спа, резиденции и офисы.</p>
    </div>
    <nav aria-label="Пространства"><p class="ftr-k">// пространства</p>${spaces.map(s => `<a href="/prostranstva/${s.slug}/">${s.h1}</a>`).join('')}</nav>
    <nav aria-label="Разделы"><p class="ftr-k">// разделы</p>${MENU.filter(m => m[1] !== 'prostranstva/').map(([n, h]) => `<a href="/${h}">${n}</a>`).join('')}</nav>
    <address><p class="ftr-k">// контакты</p><a href="tel:${C.phoneRaw}">${C.phone}</a><a href="${D.waLink()}" target="_blank" rel="noopener">WhatsApp</a><a href="${C.map2gis}" target="_blank" rel="noopener">${C.address}</a><span>${C.hours}</span></address>
  </div>
  <div class="wrap ftr-bot"><span>// © 2026 ÁUA</span><a href="/politika-konfidencialnosti/">Политика конфиденциальности</a></div>
</footer>`;
}

function layout(p, head) {
  return `<!doctype html>
<html lang="ru">
<head>
${head}
<script>document.documentElement.classList.add('js')</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Jura:wght@400;500;600&family=Mulish:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="/assets/css/style.css">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
</head>
<body class="${p.bodyClass || ''}">
${header()}
<main id="main">
${p.body}
${p.noCta ? '' : contact(p.ctaTitle)}
</main>
${footer()}
<script src="/assets/js/data.js"></script>
<script src="/assets/js/main.js"></script>
</body>
</html>`;
}

/* Сцена с точками. points: [{x,y,label,href?|text?}]. Без картинки — заглушка того же размера. */
function stage(slot, points, o = {}) {
  const pts = points.map((p, i) => {
    const side = p.x > 55 ? 'r' : 'l';
    const inner = `<span class="hs-dot">${icon('plus')}</span><span class="hs-l">${esc(p.label)}</span>`;
    return p.href
      ? `<a class="hs side-${side}" href="${p.href}" style="left:${p.x}%;top:${p.y}%" data-i="${i}">${inner}</a>`
      : `<button class="hs side-${side}" type="button" style="left:${p.x}%;top:${p.y}%" data-i="${i}" aria-expanded="false" aria-controls="pop-${o.id}-${i}">${inner}</button>`;
  }).join('');
  const pops = points.map((p, i) => p.href || !p.text ? '' : `<div class="pop" id="pop-${o.id}-${i}" role="dialog" aria-label="${esc(p.label)}" hidden><button class="pop-x" type="button" aria-label="Закрыть">${icon('close')}</button><span class="pop-k">// ${String(i + 1).padStart(2, '0')}</span><h3>${esc(p.label)}</h3><p>${esc(p.text)}</p></div>`).join('');
  return `<div class="stage" data-stage="${o.id}">
  <div class="stage-view" data-view="points">
    <div class="tip">${icon('tap')}<span>${o.tip || 'Нажмите на точку, чтобы узнать больше'}</span></div>
    <div class="stage-art">${o.fallback && !site.hasImg(slot) ? o.fallback : site.img(slot, { cls: 'stage-img', eager: o.eager })}${pts}</div>
    ${pops}
  </div>
  <div class="stage-view" data-view="list" hidden>
    <div class="cards">${points.map((p, i) => card(p, i, o.cardImg && o.cardImg(i))).join('')}</div>
  </div>
  <div class="toggle" role="tablist" aria-label="Вид">
    <button type="button" role="tab" aria-selected="true" data-to="points">${icon('dots')}Точки</button>
    <button type="button" role="tab" aria-selected="false" data-to="list">${icon('grid')}Список</button>
  </div>
</div>`;
}

function card(p, i, slot) {
  const go = p.href ? `<span class="go">${icon('arrowUR')}</span>` : '';
  const body = `${slot ? `<span class="card-media">${site.img(slot, { cls: 'card-img' })}${go}</span>` : `<span class="card-n">${String(i + 1).padStart(2, '0')}</span>${go}`}<span class="card-t">${esc(p.label)}</span>${p.text ? `<span class="card-d">${esc(p.text)}</span>` : ''}`;
  return p.href
    ? `<a class="card" href="${p.href}">${body}</a>`
    : `<div class="card">${body}</div>`;
}

function back(href = '/', label = 'Вернуться на главную') {
  return `<a class="back" href="${href}">${icon('arrowUL')}${label}</a>`;
}

/* Шапка внутренней страницы */
function head(p, o = {}) {
  return `<section class="phead">
  <div class="wrap">
    <div class="phead-top">${back(o.backHref, o.backLabel)}${site.crumbs(p.breadcrumbs)}</div>
    <h1 class="display">${p.h1}</h1>
    ${o.lead ? `<p class="lead">${o.lead}</p>` : ''}
  </div>
</section>`;
}

function scentRow(s) {
  const c = D.cat(s.cat);
  return `<li class="srow">
  <span class="srow-n">${String(s.n).padStart(2, '0')}</span>
  <div class="srow-main"><h3>${esc(s.name)}</h3><p>${esc(s.desc)}</p></div>
  <dl class="srow-notes"><div><dt>верх</dt><dd>${esc(s.notes[0])}</dd></div><div><dt>сердце</dt><dd>${esc(s.notes[1])}</dd></div><div><dt>база</dt><dd>${esc(s.notes[2])}</dd></div></dl>
  <span class="srow-c">${c.short}</span>
</li>`;
}

function faq(list, title = 'Вопросы') {
  return `<section class="sec"><div class="wrap narrow">
  <h2 class="h2">${title}</h2>
  <div class="faq">${list.map(([q, a]) => `<details><summary>${esc(q)}${icon('plus')}</summary><p>${a}</p></details>`).join('')}</div>
</div></section>`;
}

function contact(title) {
  const types = spaces.map(s => `<option>${s.name}</option>`).join('') + '<option>Другое</option>';
  return `<section class="sec contact" id="kontakt"><div class="wrap">
  <div class="ct-card">
    <div>
      <p class="kicker">// связаться</p>
      <h2 class="h2">${title || 'Подберём аромат для вашего пространства'}</h2>
      <p class="lead">Расскажите о пространстве — мы предложим 2–3 композиции, рассчитаем аппараты и согласуем установку.</p>
      <p class="ct-l"><a href="tel:${D.contacts.phoneRaw}">${D.contacts.phone}</a><span>${D.contacts.hours}</span></p>
    </div>
    <form class="form" id="lead-form" novalidate>
      <label>Имя<input id="f-name" autocomplete="name" placeholder="Как к вам обращаться"></label>
      <label>Пространство<select id="f-type">${types}</select></label>
      <label>Название или адрес<input id="f-biz" placeholder="Например, отель на Мангилик Ел"></label>
      <button class="btn btn-ink" type="submit">Написать в WhatsApp ${icon('arrowUR')}</button>
      <p class="f-note">Откроется WhatsApp с готовым сообщением.</p>
    </form>
  </div>
</div></section>`;
}

const pm = d => D.fmt(Math.min(...d.plans.map(D.perMonth)));
const months = m => `${m} ${m === 1 ? 'месяц' : m < 5 ? 'месяца' : 'месяцев'}`;

module.exports = { init, layout, icon, stage, card, back, head, scentRow, faq, contact, pm, months };
