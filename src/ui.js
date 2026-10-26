/* ÁUA: layout и блоки. Визуальный язык — референс massage-self: гипсовые рендеры
   на бледно-голубом, точки с выносками, переключатель «Точки / Список». */
const D = require('../lib/data');
const { esc, strip } = require('../lib/engine');
const CFG = require('./config');
const { spaces } = require('./content');

let site;
const init = s => { site = s; };

/* Свои контакты ÁUA из config.js, пока пусто — общие */
const C = Object.fromEntries(Object.entries({ ...D.contacts, email: '', instagram: '' }).map(([k, v]) => [k, CFG.contacts[k] || v]));
const wa = text => 'https://wa.me/' + C.whatsapp + (text ? '?text=' + encodeURIComponent(text) : '');
/* WhatsApp с меткой сайта и страницы — менеджер видит контекст, мы — откуда клиент */
const label = p => strip(p.label || p.h1 || p.title);
const waPage = (p, ask = '') => wa(`Здравствуйте! Пишу с сайта ÁUA, страница «${label(p)}».${ask ? ' ' + ask : ''}`);
const deck = () => '/' + CFG.deck;

const ICONS = {
  arrowUR: '<path d="M7 17 17 7M8 7h9v9"/>',
  arrowUL: '<path d="M17 17 7 7M7 16V7h9"/>',
  arrowR: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  dots: '<circle cx="12" cy="12" r="8"/><path d="M12 8v8M8 12h8"/>',
  grid: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
  tap: '<path d="M9 11V6a2 2 0 0 1 4 0v5M13 10a2 2 0 0 1 4 0v4a6 6 0 0 1-6 6h-1a5 5 0 0 1-4-2l-3-4a1.6 1.6 0 0 1 2.4-2L9 15"/><path d="M3 3h3M3 3v3M21 3h-3M21 3v3"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  wa: '<path d="M4 20l1.3-4.2A8 8 0 1 1 8.4 19z"/><path d="M9 9.2c.3 1.6 2.2 3.6 3.9 4.1l1.2-1 1.7.8c-.2 1-1 1.7-2 1.6-2.9-.3-5.9-3.2-6.2-6.1-.1-1 .6-1.8 1.6-2l.8 1.7z"/>',
  doc: '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M10 12h5M10 16h5"/>',
  brief: '<path d="M8 4h8M9 4v2h6V4"/><rect x="5" y="5" width="14" height="16" rx="2"/><path d="m9 13 2 2 4-4"/>'
};
const icon = (n, cls = 'ic') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n]}</svg>`;

/* Меню шапки (компьютер) и полное меню (бургер). Условия — только в подвале и вопросах */
const NAV = [['Пространства', 'prostranstva/'], ['Фирменный аромат', 'signature/'], ['Метод', 'metod/'], ['Коллекция', 'kollekciya/'], ['Журнал', 'zhurnal/']];
const MENU = [
  ['Пространства', 'prostranstva/'], ['Фирменный аромат', 'signature/'], ['Аромабрендинг', 'aromabrending/'], ['Метод', 'metod/'],
  ['Коллекция', 'kollekciya/'], ['Журнал', 'zhurnal/'], ['Бриф', 'brif/'], ['Контакты', 'kontakty/']
];
/* Форма дегустации есть внизу каждой страницы (кроме noCta); на главной — в своём блоке */
const tastingHref = p => p.tastingHere || !p.noCta ? '#degustaciya' : '/#degustaciya';

function header(p) {
  const cur = h => ('/' + p.path).startsWith('/' + h) ? ' aria-current="page"' : '';
  return `<a class="skip" href="#main">К содержанию</a>
<header class="hdr">
  <a class="logo" href="/" aria-label="ÁUA — на главную">ÁUA</a>
  <nav class="hnav" aria-label="Разделы">${NAV.map(([n, h]) => `<a href="/${h}"${cur(h)}>${n}</a>`).join('')}</nav>
  <a class="hdr-cta" href="${tastingHref(p)}">Дегустация</a>
  <button class="burger" id="burger" type="button" aria-label="Открыть меню" aria-expanded="false" aria-controls="menu"><i></i><i></i><i></i></button>
</header>
<nav class="menu" id="menu" aria-label="Основное меню">
  <div class="menu-in">
    <ol class="menu-main">${MENU.map(([n, h], i) => `<li><a href="/${h}"><span>${String(i + 1).padStart(2, '0')}</span>${n}</a></li>`).join('')}</ol>
    <div class="menu-side">
      <p class="menu-k">// пространства</p>
      ${spaces.map(s => `<a href="/prostranstva/${s.slug}/">${s.short || s.h1}</a>`).join('')}
      <p class="menu-k">// ещё</p>
      <a href="/aromamarketing/">Аромамаркетинг</a>
      <a href="/dizajneram/">Для дизайнеров</a>
      <p class="menu-k">// связь</p>
      <a href="tel:${C.phoneRaw}">${C.phone}</a>
      <a href="${waPage(p)}" target="_blank" rel="noopener">WhatsApp</a>
    </div>
  </div>
</nav>`;
}

function footer(p) {
  return `<footer class="ftr">
  <div class="wrap ftr-in">
    <div>
      <a class="logo" href="/">ÁUA</a>
      <p>Премиальная ароматизация и фирменный аромат для отелей, бутиков, ресторанов, резиденций и офисов в Астане.</p>
    </div>
    <nav aria-label="Пространства"><p class="ftr-k">// пространства</p>${spaces.map(s => `<a href="/prostranstva/${s.slug}/">${s.short || s.h1}</a>`).join('')}</nav>
    <nav aria-label="Разделы"><p class="ftr-k">// разделы</p>${[...MENU.filter(m => m[1] !== 'prostranstva/' && m[1] !== 'kontakty/'), ['Аромамаркетинг', 'aromamarketing/'], ['Для дизайнеров', 'dizajneram/'], ['Условия и цены', 'usloviya/']].map(([n, h]) => `<a href="/${h}">${n}</a>`).join('')}</nav>
    <address><p class="ftr-k">// контакты</p><a href="tel:${C.phoneRaw}">${C.phone}</a><a href="${waPage(p)}" target="_blank" rel="noopener">WhatsApp</a>${C.email ? `<a href="mailto:${C.email}">${C.email}</a>` : ''}${C.instagram ? `<a href="${C.instagram}" target="_blank" rel="noopener">Instagram</a>` : ''}<a href="${C.map2gis}" target="_blank" rel="noopener">${C.address}</a><span>${C.hours}</span><a href="/kontakty/">Все контакты</a></address>
  </div>
  <div class="wrap ftr-bot"><span>// © 2026 ÁUA</span><a href="/politika-konfidencialnosti/">Политика конфиденциальности</a></div>
</footer>`;
}

/* Нижняя панель на телефоне: WhatsApp · Бриф */
function mobbar(p) {
  return `<div class="mobbar" role="navigation" aria-label="Связь">
  <a class="mb-wa" href="${waPage(p)}" target="_blank" rel="noopener">${icon('wa')}WhatsApp</a>
  <a class="mb-brief" href="/brif/${p.briefType ? '?type=' + p.briefType : ''}" data-ev="brief_open">${icon('brief')}Бриф</a>
</div>`;
}

/* Счётчики подключаются, только когда в config.js есть номера. Цели: tasting_request, brief_submit, deck_download, wa_click */
function analytics() {
  let s = '<script>window.dataLayer=window.dataLayer||[];</script>';
  if (CFG.metrika) s += `\n<script>(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");ym(${CFG.metrika},"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});window.YM_ID=${CFG.metrika};</script>`;
  if (CFG.ga4) s += `\n<script async src="https://www.googletagmanager.com/gtag/js?id=${CFG.ga4}"></script><script>function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${CFG.ga4}');</script>`;
  return s;
}

function layout(p, head) {
  return `<!doctype html>
<html lang="ru">
<head>
${head}
<script>document.documentElement.classList.add('js')</script>
${analytics()}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Jura:wght@400;500;600&family=Mulish:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="/assets/css/style.css">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
</head>
<body class="${p.bodyClass || ''}">
${header(p)}
<main id="main">
${p.body}
${p.noCta ? '' : tasting(p)}
</main>
${footer(p)}
${mobbar(p)}
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

/* Кнопки действия: дегустация (главная), презентация, строка про WhatsApp */
function actions(p, o = {}) {
  return `<div class="acts">
  <a class="btn btn-ink" href="${tastingHref(p)}">${o.tasting || 'Дегустация на объекте'} ${icon('arrowR')}</a>
  ${o.brief ? `<a class="btn btn-glass" href="/brif/${p.briefType ? '?type=' + p.briefType : ''}">${icon('brief')}Заполнить бриф</a>` : `<a class="btn btn-glass" href="${deck()}" download data-ev="deck_download">${icon('doc')}Презентация PDF</a>`}
  <p class="acts-note">Или <a href="${waPage(p, o.wa || '')}" target="_blank" rel="noopener">напишите в WhatsApp</a>${CFG.reply ? ` · ${esc(CFG.reply)}` : ''}</p>
</div>`;
}

/* Шапка внутренней страницы */
function head(p, o = {}) {
  return `<section class="phead">
  <div class="wrap">
    <div class="phead-top">${back(o.backHref, o.backLabel)}${site.crumbs(p.breadcrumbs)}</div>
    <h1 class="display">${p.h1}</h1>
    ${o.lead ? `<p class="lead">${o.lead}</p>` : ''}
    ${o.actions ? actions(p, o.actions) : ''}
  </div>
</section>`;
}

/* Ароматы с чужими названиями — «по мотивам», без логотипов */
const MOTIF = { 15: 1, 16: 1, 20: 1, 23: 1, 25: 1, 26: 1, 28: 1, 29: 1, 30: 1, 31: 1, 32: 1 };
const POWER = ['', 'деликатный', 'средний', 'насыщенный'];
function scentRow(s) {
  const c = D.cat(s.cat);
  return `<li class="srow">
  <span class="srow-n">${String(s.n).padStart(2, '0')}</span>
  <div class="srow-main"><h3>${esc(s.name)}${MOTIF[s.n] ? ' <small>по мотивам</small>' : ''}</h3><p>${esc(s.desc)}</p>
    <p class="srow-tags"><span>${esc(c.mood.split(',')[0])}</span><span>${POWER[s.power]}</span>${s.spaces.map(x => `<span class="t-sp">${esc(x)}</span>`).join('')}</p></div>
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

/* Заявка на дегустацию: имя, телефон, компания, тип пространства → WhatsApp с меткой страницы */
function tastingForm(p) {
  const types = spaces.map(s => `<option${p.spaceName === s.name ? ' selected' : ''}>${s.name}</option>`).join('') + '<option>Другое</option>';
  return `<form class="form" id="lead-form" novalidate data-page="${esc(label(p))}" data-wa="${wa()}">
      <label>Имя<input id="f-name" autocomplete="name" placeholder="Как к вам обращаться"></label>
      <label>Телефон<input id="f-phone" type="tel" autocomplete="tel" inputmode="tel" placeholder="+7"></label>
      <label>Компания или объект<input id="f-biz" autocomplete="organization" placeholder="Например, отель на Мангилик Ел"></label>
      <label>Пространство<select id="f-type">${types}</select></label>
      <button class="btn btn-ink" type="submit">Записаться на дегустацию ${icon('arrowUR')}</button>
      <p class="f-note">Откроется WhatsApp с готовым сообщением.</p>
    </form>`;
}

function tasting(p) {
  return `<section class="sec contact" id="degustaciya"><div class="wrap">
  <div class="ct-card">
    <div>
      <p class="kicker">// дегустация</p>
      <h2 class="h2">${p.ctaTitle || 'Дегустация в вашем пространстве'}</h2>
      <p class="lead">Привезём композиции и включим их у вас: аромат выбирают в своём интерьере, а не по описанию.</p>
      <ul class="ct-ways">
        <li><a href="/brif/${p.briefType ? '?type=' + p.briefType : ''}">${icon('brief')}Заполнить бриф из пяти вопросов</a></li>
        <li><a href="${waPage(p, 'Хочу дегустацию.')}" target="_blank" rel="noopener">${icon('wa')}Написать в WhatsApp</a></li>
        <li><a href="${deck()}" download data-ev="deck_download">${icon('doc')}Скачать презентацию PDF</a></li>
      </ul>
    </div>
    ${tastingForm(p)}
  </div>
</div></section>`;
}

const pm = d => D.fmt(Math.min(...d.plans.map(D.perMonth)));
const months = m => `${m} ${m === 1 ? 'месяц' : m < 5 ? 'месяца' : 'месяцев'}`;

module.exports = { init, layout, icon, stage, card, back, head, actions, scentRow, faq, tasting, tastingForm, pm, months, C, wa, waPage, deck };
