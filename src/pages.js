/* Страницы ÁUA. Порядок блоков — по стратегии сайтов: вопрос человека → ответ.
   Цен нет на главной и страницах пространств: они только на «Условиях» (ссылка из подвала и вопросов). */
const D = require('../lib/data');
const { esc } = require('../lib/engine');
const UI = require('./ui');
const CFG = require('./config');
const { spaces, articles } = require('./content');
const { icon, C } = UI;
const TX = require('./texts');

const HOME = ['Главная', ''];
const T = CFG.terms;
const term = t => t ? `<span class="term">${esc(t)}</span>` : '';
const METHOD = [
  ['Знакомство', 'Обсуждаем пространство, гостей, характер бренда и задачу аромата. Если нужно — приезжаем посмотреть.', T.znakomstvo],
  ['Композиция', 'Предлагаем 2–3 аромата из коллекции или направления фирменного аромата, которые продолжают интерьер и бренд.', T.kompoziciya],
  ['Расстановка', 'Определяем точки установки по маршруту гостя и количество аппаратов.', T.rasstanovka],
  ['Запуск', 'Устанавливаем диффузоры, настраиваем интенсивность и расписание для каждой зоны.', T.zapusk],
  ['Сопровождение', 'Меняем масла по графику, следим за аппаратами. Гость видит только результат.', T.soprovozhdenie]
];
const SIG_STEPS = [
  ['Бриф', 'Бренд тремя словами, интерьер, гости, маршрут. Можно начать с брифа на сайте и продолжить на встрече.'],
  ['Направления', 'Готовим несколько направлений аромата и показываем их на дегустации в вашем пространстве.'],
  ['Доработка', 'Выбранное направление уточняем: больше тепла, меньше сладости, другая база — пока аромат не станет вашим.'],
  ['Финальная формула', 'Фиксируем формулу и закрепляем её за брендом. Она одинаково звучит в каждой точке.'],
  ['Запуск', 'Расставляем аппараты по зонам, настраиваем интенсивность и расписание, дальше ведём аромат каждый день.']
];
const CHECKS = [
  ['Безопасность масел', 'Работаем на составах для профессиональных диффузоров. До запуска показываем состав масла, которое будет звучать у вас.'],
  ['Интенсивность', 'Настраиваем силу аромата на месте и проверяем её в разное время дня: заметно на входе, не навязчиво через минуту.'],
  ['Шум', 'Аппараты Nova работают тише 35 дБ. В тихих зонах — спа, кабинетах, номерах этажа — проверяем, что их не слышно.'],
  ['Монтаж', 'Место, питание и крепление согласуем с инженером объекта: автономно или в приточную вентиляцию, без остановки работы.']
];
const TASTE = [
  ['Заявка или бриф', 'Рассказываете о пространстве — в форме, в WhatsApp или в брифе из пяти вопросов.'],
  ['Подбор', 'По брифу выбираем композиции, которые подходят вашему интерьеру и гостям.'],
  ['Дегустация у вас', 'Привозим композиции и аппарат, включаем их в вашем пространстве, при вашем свете и потоке людей.'],
  ['Выбор', 'Вы выбираете аромат вместе с командой, мы предлагаем схему расстановки по зонам.']
];
const FAM_TEXT = {
  fresh: 'Цитрус, лайм, базилик и морской воздух. Чистая энергия для пространств, где важны свежесть и ясность.',
  floral: 'Роза, жасмин и фрезия. Праздничные, женственные композиции для бутиков, салонов и ювелирных домов.',
  gourmand: 'Кофе, ваниль и карамель. Тёплые композиции для ресторанов, кондитерских и домашнего уюта.',
  hotel: 'Белый чай, инжир, мускус и благородная древесина. Ароматы лобби пятизвёздочных отелей.',
  spa: 'Зелёный чай, бамбук, лаванда, эвкалипт. Композиции тишины для спа и wellness.',
  perfume: 'Кедр, сандал, кожа, табак и пряности. Ароматы с характером, построенные как духи.'
};
/* Отельные — первыми */
const FAMS = ['hotel', 'perfume', 'spa', 'floral', 'fresh', 'gourmand'].map(D.cat);

function register(site) {
  const { add, img } = site;
  const S = s => `/prostranstva/${s.slug}/`;
  const onHome = spaces.filter(s => s.home !== false);
  const famCards = () => `<div class="cards cards-3 cards-sp">${FAMS.map(c => `<a class="card" href="/kollekciya/#${c.slug}"><span class="card-media">${img('family-' + c.slug, { cls: 'card-img' })}<span class="go">${icon('arrowUR')}</span></span><span class="card-t">${c.name}</span><span class="card-d">${c.mood}</span></a>`).join('')}</div>`;
  const artCard = a => `<a class="card card-text" href="/zhurnal/${a.slug}/"><span class="card-n">${dateRu(a.date)} · ${a.read} мин</span><span class="card-t">${esc(a.h1)}</span><span class="card-d">${esc(a.lead)}</span><span class="go">${icon('arrowUR')}</span></a>`;
  const numList = (list, cls) => `<ol class="${cls}">${list.map(([t, d, tm], i) => `<li><span class="step-n">${String(i + 1).padStart(2, '0')}</span><h3>${t}</h3><p>${d}</p>${term(tm)}</li>`).join('')}</ol>`;

  /* ── Главная ── */
  const homeFaq = [
    ['Сколько времени занимает запуск?', `Аромат из коллекции можно запустить сразу после дегустации, как только согласуем точки установки${T.zapusk ? ` (${T.zapusk})` : ''}. Фирменный аромат создаётся дольше: ${T.signature ? 'обычно ' + T.signature : 'точный срок называем после брифа, он зависит от числа пространств и доработок'}.`],
    ['Будет ли аромат только нашим?', 'Фирменная композиция, созданная по вашему брифу, закрепляется за вами. Аромат из коллекции может звучать и у других клиентов, поэтому бренду с несколькими точками мы советуем фирменный.'],
    ['Можно ли подключить аромат к вентиляции?', 'Да, если позволяет система: место подключения и режим работы согласуем с инженером объекта. Если нет — аппараты работают автономно, их ставят на стену, стойку или в нишу.'],
    ['Безопасны ли масла для гостей и персонала?', 'Используем составы для профессиональных диффузоров, рассчитанные на долгую работу в помещениях с людьми. До запуска показываем состав, а интенсивность настраиваем так, чтобы аромат не был навязчивым.'],
    ['Как оформляется работа?', 'Официальным договором с юрлицом или ИП. Условия и цены базовой подписки — на странице <a href="/usloviya/">«Условия»</a>, фирменный аромат считаем под проект после дегустации.'],
    ['Работаете ли вы с сетями?', 'Да: один аромат во всех точках, один график обслуживания и один договор. Обычно начинаем с флагмана, а после него переносим аромат на остальные точки сети.']
  ];
  add({
    path: '', label: 'Главная', bodyClass: 'home', priority: '1.0', noCta: true, tastingHere: true,
    title: 'Премиальная ароматизация и фирменный аромат в Астане — ÁUA',
    description: 'Премиальная ароматизация и фирменный аромат для отелей, бутиков, ресторанов и резиденций в Астане. 32 композиции, дегустация на объекте, монтаж и сервис.',
    schema: [site.schema.website(), site.schema.business(C), site.schema.faq(homeFaq)],
    get body() {
      return `
<section class="hero">
  <div class="wrap hero-top">
    <h1 class="display hero-h1">Премиальная ароматизация и фирменный аромат</h1>
    <div class="hero-side">
      <p class="hero-sub">Отели, бутики, рестораны, резиденции в Астане. Подбираем и ведём аромат.</p>
      <p class="hero-proof">32 композиции · 10 типов пространств</p>
      ${UI.actions(this)}
    </div>
  </div>
  <div class="wrap">${UI.stage('hero', onHome.map(s => ({ x: s.x, y: s.y, label: s.label, href: S(s) })), { id: 'home', eager: true, fallback: require('./drawing')(), tip: 'Нажмите на пространство, чтобы узнать, как в нём звучит аромат', cardImg: i => 'space-' + onHome[i].slug })}</div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="sec-head"><p class="kicker">// пространства</p><h2 class="h2">Десять типов пространств</h2></div>
    <div class="cards cards-5 cards-sp">${spaces.map((s, i) => UI.card({ label: s.name, href: S(s) }, i, 'space-' + s.slug)).join('')}</div>
  </div>
</section>

<section class="sec">
  <div class="wrap split">
    <div>
      <p class="kicker">// фирменный аромат</p>
      <h2 class="h2">Аромат, который узнают с закрытыми глазами</h2>
      <p>Один аромат во всех зонах и во всех точках бренда. Подберём его из коллекции или создадим с нуля — и будем вести каждый день.</p>
      <ul class="gets">${CFG.signatureGets.map(([t, d]) => `<li><b>${t}</b><span>${d}</span></li>`).join('')}</ul>
      <a class="btn btn-ink" href="/signature/">Как мы создаём аромат ${icon('arrowUR')}</a>
    </div>
    <div class="note-card"><p class="kicker">// этапы</p>${numList(SIG_STEPS, 'mini-steps')}</div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="sec-head"><p class="kicker">// метод</p><h2 class="h2">Пять шагов к аромату пространства</h2></div>
    ${numList(METHOD, 'steps')}
    <a class="more" href="/metod/">Подробнее о методе ${icon('arrowUR')}</a>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="sec-head"><p class="kicker">// перед запуском</p><h2 class="h2">Что мы проверяем перед запуском</h2></div>
    <div class="cards cards-4">${CHECKS.map(([t, d], i) => `<div class="card card-text"><span class="card-n">${String(i + 1).padStart(2, '0')}</span><span class="card-t">${t}</span><span class="card-d">${d}</span></div>`).join('')}</div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="sec-head"><p class="kicker">// коллекция</p><h2 class="h2">Шесть семейств, тридцать две композиции</h2></div>
    ${famCards()}
    <a class="more" href="/kollekciya/">Вся коллекция ${icon('arrowUR')}</a>
  </div>
</section>

<section class="sec contact" id="degustaciya"><div class="wrap">
  <div class="ct-card">
    <div>
      <p class="kicker">// дегустация</p>
      <h2 class="h2">Как проходит дегустация</h2>
      <p class="lead">Аромат нельзя выбрать по описанию. Поэтому мы привозим композиции и включаем их у вас.</p>
      ${numList(TASTE, 'mini-steps')}
    </div>
    ${UI.tastingForm(this)}
  </div>
</div></section>

<section class="sec">
  <div class="wrap">
    <div class="sec-head"><p class="kicker">// журнал</p><h2 class="h2">Об аромате и бренде</h2></div>
    <div class="cards cards-3">${articles.slice(0, 3).map(artCard).join('')}</div>
    <a class="more" href="/zhurnal/">Все статьи ${icon('arrowUR')}</a>
  </div>
</section>

${UI.faq(homeFaq)}

<section class="sec final">
  <div class="wrap">
    <div class="sec-head"><p class="kicker">// с чего начать</p><h2 class="h2">Три способа начать разговор</h2></div>
    <div class="cards cards-3">
      <a class="card card-text card-way" href="/brif/" data-ev="brief_open"><span class="card-n">// готовы обсудить</span><span class="card-t">Бриф из пяти вопросов</span><span class="card-d">Ответы сразу идут в подготовку дегустации. Ссылку можно переслать тому, кто знает объект.</span><span class="go">${icon('arrowUR')}</span></a>
      <a class="card card-text card-way" href="${UI.waPage(this, 'Хочу обсудить аромат для пространства.')}" target="_blank" rel="noopener"><span class="card-n">// есть вопрос</span><span class="card-t">Написать в WhatsApp</span><span class="card-d">${CFG.reply ? esc(CFG.reply) + '.' : 'Ответим в рабочее время.'} Можно сразу прислать фото или план пространства.</span><span class="go">${icon('arrowUR')}</span></a>
      <a class="card card-text card-way" href="${UI.deck()}" download data-ev="deck_download"><span class="card-n">// показать руководству</span><span class="card-t">Презентация PDF</span><span class="card-d">Метод, этапы фирменного аромата и пространства на нескольких страницах — без формы и регистрации.</span><span class="go">${icon('arrowUR')}</span></a>
    </div>
  </div>
</section>`;
    }
  });

  /* ── Пространства ── */
  add({
    path: 'prostranstva/',
    title: 'Премиальная ароматизация пространств: отель, бутик, ресторан, спа',
    description: 'Премиальная ароматизация десяти типов пространств в Астане: отель, бутик, ресторан, спа, резиденция, офис, автосалон, клиника, салон красоты, фитнес-клуб.',
    h1: 'Пространства',
    breadcrumbs: [HOME, ['Пространства', 'prostranstva/']],
    schema: [site.schema.itemList(spaces.map(s => [s.h1, `prostranstva/${s.slug}/`]))],
    get body() {
      return UI.head(this, { lead: 'Каждое пространство звучит по-своему. Выберите своё — расскажем, где аромат работает и какие композиции мы выбираем.' }) + `
<section class="sec sec-top"><div class="wrap"><div class="cards cards-3">${spaces.map((s, i) => UI.card({ label: s.h1, text: s.lead, href: S(s) }, i, 'space-' + s.slug)).join('')}</div></div></section>
<section class="sec"><div class="wrap narrow prose">
  <h2>Почему одно и то же масло звучит по-разному</h2>
  <p>Аромат живёт в воздухе: на него влияют высота потолков, вентиляция, материалы и поток людей. В лобби с камнем и высоким потолком композиции нужно больше силы, в небольшом бутике с текстилем — больше деликатности. Поэтому мы подбираем не только аромат, но и точки установки по маршруту гостя, а окончательный выбор делаем на дегустации в вашем пространстве.</p>
</div></section>`;
    }
  });

  spaces.forEach(s => {
    const p = `prostranstva/${s.slug}/`;
    const impl = s.impl || [
      ['Дегустация на месте', `Привозим композиции и включаем их ${s.where}: аромат выбирают в своём интерьере, а не по описанию.`],
      ['Монтаж без остановки работы', 'Аппараты ставим в тихие часы, без шума и пыли. Автономно — на стену, стойку или в нишу, либо в приточную вентиляцию по согласованию с инженером.'],
      ['Настройка по зонам', `Интенсивность и расписание задаём для каждой зоны: ${s.zones.map(z => z.name.toLowerCase()).join(', ')}.`],
      ['Сервис по графику', 'Масла меняет наш специалист в удобное время. Обслуживание и гарантия входят в договор, персоналу ничего делать не нужно.']
    ];
    const scents = s.motifs
      ? `<div class="sec-head"><p class="kicker">// композиции</p><h2 class="h2">Что звучит в отелях</h2></div>
    <div class="cards cards-4">${s.motifs.map(([n, d]) => { const sc = D.byN(n); return `<div class="card card-text card-scent"><span class="card-n">${String(n).padStart(2, '0')} · ${D.cat(sc.cat).short}</span><span class="card-t">${esc(sc.name)}</span><span class="card-d">${esc(d)}</span><span class="card-notes">${sc.notes.map(esc).join(' · ')}</span></div>`; }).join('')}
      <a class="card card-text card-own" href="/signature/"><span class="card-n">// только ваш</span><span class="card-t">Или создадим свой</span><span class="card-d">Фирменный аромат по брифу: формула закрепляется за вашим отелем.</span><span class="go">${icon('arrowUR')}</span></a></div>`
      : `<div class="sec-head"><p class="kicker">// композиции</p><h2 class="h2">Что звучит в этом пространстве</h2></div>
    <ul class="srows">${s.scents.map(n => UI.scentRow(D.byN(n))).join('')}</ul>
    <div class="more-row"><a class="more" href="/kollekciya/">Вся коллекция ${icon('arrowUR')}</a><a class="more" href="/signature/">Создать фирменный аромат ${icon('arrowUR')}</a></div>`;
    add({
      path: p, title: s.title, description: s.description, h1: s.h1,
      spaceName: s.name, briefType: s.slug,
      breadcrumbs: [HOME, ['Пространства', 'prostranstva/'], [s.h1, p]],
      schema: [site.schema.service({ name: s.h1, description: s.description, type: 'Ароматизация помещений' }, p), site.schema.faq(s.faq)],
      ctaTitle: `Дегустация ${s.where}`,
      get body() {
        return `
<section class="phead phead-stage">
  <div class="wrap">
    <div class="phead-top">${UI.back()}${site.crumbs(this.breadcrumbs)}</div>
    <h1 class="display">${s.h1}</h1>
    <p class="lead">${s.lead}</p>
    ${UI.actions(this, { tasting: `Дегустация ${s.where}`, brief: true, wa: `Интересует аромат: ${s.name.toLowerCase()}.` })}
  </div>
  <div class="wrap">${UI.stage('space-' + s.slug, s.zones.map(z => ({ x: z.x, y: z.y, label: z.name, text: z.text })), { id: s.slug, eager: true, fallback: require('./drawing').space(s.zones, s.h1), tip: 'Нажмите на точку, чтобы увидеть, как работает аромат в этой зоне' })}</div>
</section>
<section class="sec">
  <div class="wrap split">
    <div class="prose">${s.intro.map(t => `<p>${t}</p>`).join('')}</div>
    <ol class="zone-list">${s.zones.map((z, i) => `<li><span>${String(i + 1).padStart(2, '0')}</span><div><h2 class="h4">${z.name}</h2><p>${z.text}</p></div></li>`).join('')}</ol>
  </div>
</section>
<section class="sec">
  <div class="wrap">${scents}</div>
</section>
<section class="sec">
  <div class="wrap">
    <div class="sec-head"><p class="kicker">// внедрение</p><h2 class="h2">Как внедряем</h2></div>
    ${numList(impl, 'steps steps-4')}
  </div>
</section>
${UI.faq(s.faq, s.motifs ? 'Вопросы отелей' : 'Вопросы')}
<section class="sec"><div class="wrap">
  <div class="sec-head"><p class="kicker">// другие пространства</p></div>
  <div class="cards cards-5">${spaces.filter(o => o !== s).map((o, i) => UI.card({ label: o.short || o.h1, href: S(o) }, i, 'space-' + o.slug)).join('')}</div>
</div></section>`;
      }
    });
  });

  /* ── Коллекция ── */
  add({
    path: 'kollekciya/',
    title: 'Коллекция ароматов для премиальных пространств — 32 композиции',
    description: 'Коллекция ÁUA: 32 композиции для отелей, бутиков, ресторанов и спа. У каждой — настроение, интенсивность, три ноты и пространства, где она звучит лучше.',
    h1: 'Коллекция',
    breadcrumbs: [HOME, ['Коллекция', 'kollekciya/']],
    schema: [site.schema.itemList(D.scents.map(s => [s.name, `kollekciya/#${D.cat(s.cat).slug}`]))],
    get body() {
      return UI.head(this, { lead: 'Тридцать две композиции в шести семействах. У каждой — настроение, интенсивность, три ноты и пространства, где она звучит лучше. Ароматы с известными названиями — по мотивам.' }) + `
<nav class="fam-nav wrap" aria-label="Семейства">${FAMS.map(c => `<a href="#${c.slug}">${c.name}</a>`).join('')}</nav>
${FAMS.map(c => `<section class="sec fam" id="${c.slug}">
  <div class="wrap fam-grid">
    <div class="fam-side">
      ${img('family-' + c.slug, { cls: 'fam-img' })}
      <p class="kicker">// ${plural(D.scents.filter(s => s.cat === c.id).length)}</p>
      <h2 class="h2">${c.name}</h2>
      <p>${FAM_TEXT[c.id]}</p>
    </div>
    <ul class="srows">${D.scents.filter(s => s.cat === c.id).map(UI.scentRow).join('')}</ul>
  </div>
</section>`).join('')}`;
    }
  });

  /* ── Фирменный аромат ── */
  const sigFaq = [
    ['Чем фирменный аромат отличается от аромата из коллекции?', 'Аромат из коллекции готов сразу и может звучать у других клиентов. Фирменный создаётся по вашему брифу, проходит доработку и закрепляется за брендом.'],
    ['Сколько стоит фирменный аромат?', 'Считаем под проект: стоимость зависит от числа пространств, аппаратов и того, создаём аромат с нуля или дорабатываем композицию из коллекции. Начинаем с дегустации. Базовая подписка на ароматизацию — на странице <a href="/usloviya/">«Условия»</a>.'],
    ['Сколько времени занимает создание?', T.signature ? `Обычно ${T.signature} от брифа до финальной формулы.` : 'Точный срок называем после брифа: он зависит от числа направлений и доработок.'],
    ['Можно ли сменить аромат позже?', 'Да, но фирменный аромат работает, когда он постоянен: гости начинают узнавать его через несколько месяцев.']
  ];
  add({
    path: 'signature/', label: 'Фирменный аромат',
    title: 'Фирменный аромат для отеля и бренда в Астане — создание | ÁUA',
    description: 'Создание фирменного аромата для отеля, бутика, ресторана или бренда в Астане: бриф, направления, доработка, финальная формула и запуск. Начинаем с дегустации.',
    h1: 'Фирменный аромат для бренда и пространства',
    breadcrumbs: [HOME, ['Фирменный аромат', 'signature/']],
    schema: [site.schema.faq(sigFaq), site.schema.service({ name: 'Создание фирменного аромата', description: 'Фирменный аромат для бренда и пространства: от брифа до запуска и сопровождения', type: 'Аромабрендинг' }, 'signature/')],
    get body() {
      return UI.head(this, { lead: 'Аромат, который гости узнают с закрытыми глазами. Становится частью бренда — как логотип, музыка и униформа.', actions: {} }) + `
<section class="sec sec-top"><div class="wrap split">
  <div class="prose">
    <h2>Что это</h2>
    <p>Фирменный аромат — это композиция, которую гость связывает только с вами. Она звучит во всех зонах и во всех точках бренда: в лобби отеля и в его ресторане, в каждом бутике сети, в офисе продаж и в лобби готового дома.</p>
    <p>Его можно подобрать из коллекции и закрепить за брендом или создать с нуля по брифу. Во втором случае формула принадлежит только вам.</p>
  </div>
  <div class="cmp">
    <div class="cmp-col"><p class="kicker">// из коллекции</p><ul><li>Готов сразу, выбираете на дегустации</li><li>32 композиции в шести семействах</li><li>Может звучать и у других клиентов</li></ul></div>
    <div class="cmp-col cmp-own"><p class="kicker">// фирменный</p><ul><li>Создаётся по вашему брифу</li><li>Проходит доработку до «того самого»</li><li>Формула закрепляется за брендом</li></ul></div>
  </div>
</div></section>
<section class="sec"><div class="wrap">
  <div class="sec-head"><p class="kicker">// этапы</p><h2 class="h2">Как мы создаём фирменный аромат</h2></div>
  ${numList(SIG_STEPS, 'steps')}
</div></section>
<section class="sec"><div class="wrap split">
  <div>
    <p class="kicker">// что вы получаете</p>
    <h2 class="h2">Что получает клиент</h2>
    <ul class="gets">${CFG.signatureGets.map(([t, d]) => `<li><b>${t}</b><span>${d}</span></li>`).join('')}</ul>
  </div>
  <div class="note-card"><p class="kicker">// пример</p><h2 class="h3">Пример: как мы создаём аромат для отеля</h2><p>Бриф: «спокойный, светлый, гостеприимный». Направления — белый чай, инжир, гладкое дерево. После доработки аромат звучит в лобби, ресторане и спа: в лобби — Nova 1000 по расписанию, в ресторане и спа — Nova 300.</p><p class="pc-note">Это пример процесса, а не кейс клиента.</p></div>
</div></section>
<section class="sec"><div class="wrap narrow">
  <div class="calc">
    <p class="kicker">// стоимость и сроки</p>
    <h2 class="h2">Считаем под проект, начинаем с дегустации</h2>
    <p>Стоимость зависит от числа пространств и аппаратов, а также от того, создаём ли аромат с нуля. ${T.signature ? `Создание занимает ${esc(T.signature)}.` : 'Сроки называем после брифа.'} Первый шаг всегда один — дегустация в вашем пространстве.</p>
    ${UI.actions(this, { brief: true, wa: 'Интересует фирменный аромат.' })}
  </div>
  <p class="sig-more">Подробнее о подборе — в статьях «<a href="/zhurnal/kak-vybrat-signature-aromat/">Как выбрать фирменный аромат</a>» и «<a href="/zhurnal/aromabrending-primery/">Аромабрендинг: примеры брендов</a>».</p>
</div></section>
${UI.faq(sigFaq)}`;
    }
  });

  /* ── Аромабрендинг ── */
  const abFaq = [
    ['Чем аромабрендинг отличается от аромамаркетинга?', 'Аромамаркетинг — любое использование запаха для впечатления и продаж. Аромабрендинг — его часть, в которой аромат закрепляется за брендом и становится элементом фирменного стиля.'],
    ['Нужен ли аромабрендинг небольшому бренду?', 'Да, если у бренда есть пространство, где клиент проводит время: бутик, ресторан, салон. Одной точки достаточно, чтобы аромат начали связывать с вами.'],
    ['Сколько стоит аромабрендинг?', 'Фирменный аромат считаем под проект после дегустации. Если нужен аромат из коллекции без создания своего — условия подписки на странице <a href="/usloviya/">«Условия»</a>.']
  ];
  add({
    path: 'aromabrending/',
    title: 'Аромабрендинг: что это и как создать аромат бренда — ÁUA',
    description: 'Аромабрендинг — аромат как часть фирменного стиля. Что это, чем отличается от аромамаркетинга, примеры брендов и как создать аромат бренда в Астане.',
    h1: 'Аромабрендинг',
    breadcrumbs: [HOME, ['Аромабрендинг', 'aromabrending/']],
    schema: [site.schema.faq(abFaq), site.schema.service({ name: 'Аромабрендинг', description: 'Создание аромата бренда и его запуск во всех пространствах', type: 'Аромабрендинг' }, 'aromabrending/')],
    get body() {
      return UI.head(this, { lead: 'Аромабрендинг — это аромат, который становится частью фирменного стиля, как логотип или цвет. Клиент узнаёт бренд по запаху ещё до того, как увидит вывеску.', actions: { brief: true, wa: 'Интересует аромабрендинг.' } }) + `
<section class="sec sec-top"><div class="wrap split">
  <div class="prose">
    <h2>Из чего состоит аромат бренда</h2>
    <p>Аромабрендинг держится на четырёх вещах. Первая — сама композиция: подобранная или созданная под характер бренда. Вторая — точки контакта: пространства, где клиент проводит время, от лобби и бутика до офиса продаж и мероприятий. Третья — постоянство: аромат не меняется месяцами и годами. Четвёртая — история: название и описание, которые команда может рассказать гостю.</p>
    <p>Без любой из них аромат остаётся просто приятным запахом. Со всеми четырьмя — становится знаком, который работает без слов.</p>
    <h2>Чем отличается от аромамаркетинга</h2>
    <p><a href="/aromamarketing/">Аромамаркетинг</a> — широкое понятие: любой запах, который помогает впечатлению и продажам. Аромабрендинг уже: это аромат, закреплённый за конкретным брендом. Кофейня с запахом кофе занимается аромамаркетингом, отель со своим белым чаем во всех городах — аромабрендингом.</p>
  </div>
  <div class="note-card"><p class="kicker">// примеры</p><ol class="am-list">
    <li><b>Singapore Airlines</b> — собственный аромат на полотенцах и в салоне.</li>
    <li><b>Westin</b> — белый чай в лобби по всему миру.</li>
    <li><b>Shangri-La</b> — тёплая ваниль и сандал вместо привычной свежести.</li>
    <li><b>Rolls-Royce</b> — воссозданный запах классического салона.</li>
  </ol><a class="more" href="/zhurnal/aromabrending-primery/">Разбор примеров ${icon('arrowUR')}</a></div>
</div></section>
<section class="sec"><div class="wrap">
  <div class="sec-head"><p class="kicker">// как мы работаем</p><h2 class="h2">От брифа до запуска</h2></div>
  ${numList(SIG_STEPS, 'steps')}
  <a class="more" href="/signature/">Подробнее о фирменном аромате ${icon('arrowUR')}</a>
</div></section>
${UI.faq(abFaq)}`;
    }
  });

  /* ── Аромамаркетинг ── */
  const amFaq = [
    ['Чем аромамаркетинг отличается от ароматизации?', 'Ароматизация делает воздух приятным. Аромамаркетинг использует аромат как инструмент: он задаёт настроение, удерживает гостя и связывает впечатление с местом.'],
    ['Как понять, что аромат работает?', 'Спросите гостей и сотрудников через месяц, послушайте отзывы, посмотрите, задерживаются ли гости в лаунже. Лучший знак — когда аромат начинают узнавать и спрашивать, что это.'],
    ['С чего начать бренду с несколькими точками?', 'С флагмана: подобрать композицию, протестировать её месяц и затем распространить на все точки сети.']
  ];
  add({
    path: 'aromamarketing/',
    title: 'Аромамаркетинг для премиальных брендов в Астане — ÁUA',
    description: 'Аромамаркетинг в Астане для отелей, бутиков, ресторанов и девелоперов: как запах влияет на впечатление, четыре принципа премиального аромата и как оценить результат.',
    h1: 'Аромамаркетинг',
    breadcrumbs: [HOME, ['Аромамаркетинг', 'aromamarketing/']],
    schema: [site.schema.faq(amFaq), site.schema.service({ name: 'Аромамаркетинг', description: 'Ароматизация пространств бренда и подбор аромата под задачу', type: 'Аромамаркетинг' }, 'aromamarketing/')],
    get body() {
      return UI.head(this, { lead: 'Запах — единственное чувство, которое бренд может занять полностью: у конкурентов может быть похожий интерьер, но не ваш аромат.' }) + `
<section class="sec sec-top"><div class="wrap split">
  <div class="prose">
    <p>Аромамаркетинг — это работа с запахом как с частью впечатления. В премиальном сегменте его используют давно: гостиничные сети, модные дома и автомобильные марки годами держат один и тот же аромат, чтобы гость узнавал их с закрытыми глазами.</p>
    <p>Обоняние связано с эмоциями и памятью напрямую, без «перевода» в слова. Поэтому аромат вызывает ощущение раньше, чем человек его осознаёт, и запоминается дольше, чем вывеска или цвет стен.</p>
    <h2>Где он работает сильнее всего</h2>
    <p>Там, где гость задерживается: в лобби и лаунже отеля, в примерочной бутика, в зоне ожидания клиники, в офисе продаж застройщика. Чем дольше человек находится в пространстве, тем крепче аромат связывается с местом.</p>
    <p>Когда аромат закрепляется за брендом и звучит во всех его точках, аромамаркетинг становится <a href="/aromabrending/">аромабрендингом</a>.</p>
  </div>
  <div class="note-card"><p class="kicker">// четыре принципа</p><ol class="am-list">
    <li><b>Постоянство.</b> Аромат узнают, только если он не меняется месяцами.</li>
    <li><b>Деликатность.</b> Премиальный аромат замечают на входе и не чувствуют навязчивым через минуту.</li>
    <li><b>Маршрут.</b> Точки ставятся там, где гость впервые входит и где задерживается.</li>
    <li><b>Единство.</b> Один аромат во всех пространствах и городах сети.</li>
  </ol></div>
</div></section>
<section class="sec"><div class="wrap">
  <div class="sec-head"><p class="kicker">// где работает</p><h2 class="h2">Аромамаркетинг по пространствам</h2></div>
  <div class="cards cards-5">${spaces.map((o, i) => UI.card({ label: o.short || o.h1, href: S(o) }, i, 'space-' + o.slug)).join('')}</div>
</div></section>
${UI.faq(amFaq)}`;
    }
  });

  /* ── Метод ── */
  add({
    path: 'metod/',
    title: 'Метод ÁUA: как мы создаём аромат пространства — 5 шагов',
    description: 'Как проходит премиальная ароматизация с ÁUA: знакомство с пространством, выбор композиции, расстановка диффузоров, запуск и ежедневное сопровождение.',
    h1: 'Метод',
    breadcrumbs: [HOME, ['Метод', 'metod/']],
    get body() {
      return UI.head(this, { lead: 'Пять шагов от первого разговора до аромата, который звучит каждый день.' }) + `
<section class="sec sec-top"><div class="wrap narrow"><ol class="timeline">${METHOD.map(([t, d, tm], i) => `<li><span class="step-n">${String(i + 1).padStart(2, '0')}</span><div><h2 class="h3">${t}</h2><p>${d}</p>${term(tm)}</div></li>`).join('')}</ol></div></section>
<section class="sec"><div class="wrap split">
  <div class="prose">
    <h2>Оборудование</h2>
    <p>Мы работаем на металлических диффузорах Nova. Nova 300 рассчитан на пространство до 300 м², Nova 1000 — до 1000 м² и управляется со смартфона. Оба работают тише 35 дБ и по расписанию: аромат включается к открытию и выключается после закрытия.</p>
    <h2>Сопровождение</h2>
    <p>Масла меняет наш специалист по графику. Обслуживание и гарантия входят в договор: если аппарат выйдет из строя, мы его заменим.</p>
  </div>
  <div class="dev-art">${img('device')}</div>
</div></section>`;
    }
  });

  /* ── Условия (ссылка только из подвала и вопросов) ── */
  const condFaq = [
    ['Что входит в подписку?', TX.included.join(', ') + '.'],
    ['Почему 6 месяцев выгоднее?', 'Длинный срок позволяет планировать поставки масел и обслуживание, поэтому цена в месяц ниже.'],
    ['Как заключается договор?', 'Официальный договор с юрлицом или ИП на 1, 3 или 6 месяцев.'],
    ['Сколько стоит фирменный аромат?', 'Считаем под проект после дегустации: подробнее на странице <a href="/signature/">«Фирменный аромат»</a>.']
  ];
  add({
    path: 'usloviya/',
    title: 'Условия и цены ÁUA: подписка на ароматизацию от 33 333 ₸',
    description: 'Цены на премиальную ароматизацию в Астане: Nova 300 от 33 333 ₸ и Nova 1000 от 66 667 ₸ в месяц. Диффузор, композиция, масла, сервис и гарантия включены.',
    h1: 'Условия',
    breadcrumbs: [HOME, ['Условия', 'usloviya/']],
    schema: [site.schema.faq(condFaq)],
    get body() {
      return UI.head(this, { lead: 'Базовая подписка — диффузор, композиция из коллекции, замена масел, обслуживание и гарантия. Чем дольше срок, тем ниже цена в месяц.' }) + `
<section class="sec sec-top"><div class="wrap"><div class="plans">${D.devices.map(d => `<article class="plan">
  <p class="kicker">// до ${d.area} м²</p><h2 class="h3">${d.name}</h2><p class="plan-lead">${TX.lead[d.id]}</p>
  <ul class="plan-rows">${d.plans.map(pl => `<li><span>${UI.months(pl.months)}</span><b>${D.fmt(pl.total)}</b><small>${D.fmt(D.perMonth(pl))} / мес</small></li>`).join('')}</ul>
  <dl class="plan-specs">${d.specs.slice(0, 6).map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
</article>`).join('')}</div>
<h2 class="h3 incl-h">Что входит в сопровождение</h2>
<ul class="incl">${TX.included.map(t => `<li>${icon('plus')}${t}</li>`).join('')}</ul>
<div class="note-card note-sig"><p class="kicker">// фирменный аромат</p><p>Создание фирменного аромата в подписку не входит и считается под проект. <a href="/signature/">Как мы его создаём</a></p></div></div></section>
${UI.faq(condFaq)}`;
    }
  });

  /* ── Для дизайнеров ── */
  const dzFaq = [
    ['На каком этапе подключать аромат?', 'Лучше всего — на этапе рабочего проекта, пока можно заложить места под аппараты и розетки. Но мы работаем и с готовыми интерьерами.'],
    ['Кто общается с клиентом?', 'Как вам удобнее: вы представляете нас клиенту, а дальше мы ведём проект сами и держим вас в курсе — или участвуем в ваших встречах.'],
    ['Какие условия партнёрства?', 'Обсуждаем лично: напишите нам, расскажите о своих проектах, и мы предложим формат сотрудничества.']
  ];
  add({
    path: 'dizajneram/', label: 'Для дизайнеров',
    title: 'Аромат в проект интерьера — партнёрство для дизайнеров | ÁUA',
    description: 'Для дизайнеров интерьера в Астане: подбираем аромат в проект, закладываем места под аппараты на этапе ремонта и готовим презентацию для вашего клиента.',
    h1: 'Для дизайнеров интерьера',
    breadcrumbs: [HOME, ['Для дизайнеров', 'dizajneram/']],
    schema: [site.schema.faq(dzFaq)],
    ctaTitle: 'Обсудим ваш проект',
    get body() {
      return UI.head(this, { lead: 'Аромат — последний слой интерьера. Поможем сдать проект целиком: от мест под аппараты на этапе ремонта до аромата, который продолжает вашу концепцию.', actions: { tasting: 'Дегустация для клиента', wa: 'Я дизайнер интерьера, хочу обсудить проект.' } }) + `
<section class="sec sec-top"><div class="wrap">
  <div class="sec-head"><p class="kicker">// что даём</p><h2 class="h2">Что мы делаем для вашего проекта</h2></div>
  <div class="cards cards-4">
    <div class="card card-text"><span class="card-n">01</span><span class="card-t">Подбор аромата в проект</span><span class="card-d">Под материалы, свет и концепцию интерьера: из коллекции или фирменный для клиента-бренда.</span></div>
    <div class="card card-text"><span class="card-n">02</span><span class="card-t">Места под аппараты</span><span class="card-d">На этапе ремонта: точки по маршруту гостя, ниши и розетки. Nova — 160 × 86,5 × 205 мм, питание 12 В.</span></div>
    <div class="card card-text"><span class="card-n">03</span><span class="card-t">Презентация для клиента</span><span class="card-d">Аромат, ноты и схема расстановки на нескольких страницах — в вашей подаче проекта.</span></div>
    <div class="card card-text"><span class="card-n">04</span><span class="card-t">Сопровождение после сдачи</span><span class="card-d">Монтаж, запуск и замена масел — без вашего участия. Объект продолжает звучать так, как задумано.</span></div>
  </div>
</div></section>
<section class="sec"><div class="wrap split">
  <div class="prose">
    <h2>Как передать клиента</h2>
    <p>Напишите нам о проекте: тип объекта, площадь, стадия и концепция. Мы предложим композиции и места под аппараты, а затем проведём дегустацию для вашего клиента — у него на объекте или в шоуруме, вместе с вами.</p>
    <p>Дальше проект ведём мы: договор, монтаж, запуск и обслуживание. Вы получаете интерьер, который звучит так же продуманно, как выглядит.</p>
  </div>
  <div class="note-card"><p class="kicker">// партнёрство</p><h2 class="h3">Условия обсуждаем лично</h2><p>Каждый дизайнер работает по-своему, поэтому формат сотрудничества мы предлагаем после знакомства.</p><a class="more" href="${UI.waPage(this, 'Я дизайнер интерьера, хочу обсудить партнёрство.')}" target="_blank" rel="noopener">Написать в WhatsApp ${icon('arrowUR')}</a></div>
</div></section>
${UI.faq(dzFaq)}`;
    }
  });

  /* ── Бриф: пять вопросов, по одному на экран ── */
  const AREAS = ['до 300 м²', '300–1000 м²', '1000–3000 м²', 'больше 3000 м²', 'несколько объектов'];
  const WORDS = ['спокойный', 'тёплый', 'свежий', 'статусный', 'смелый', 'чистый', 'домашний', 'праздничный', 'строгий'];
  const WHEN = ['в ближайшие 2 недели', 'в течение месяца', 'через 1–3 месяца', 'к открытию объекта', 'пока изучаем'];
  const chip = (name, v, type = 'radio', extra = '') => `<label class="chip"><input type="${type}" name="${name}" value="${esc(v)}"${extra}><span>${esc(v)}</span></label>`;
  add({
    path: 'brif/', label: 'Бриф', noCta: true, bodyClass: 'brief-page',
    title: 'Бриф на фирменный аромат — пять вопросов | ÁUA',
    description: 'Бриф на аромат для отеля, бутика, ресторана или резиденции в Астане: пять вопросов по одному на экран. Ответы идут в подготовку дегустации на вашем объекте.',
    h1: 'Бриф на аромат',
    breadcrumbs: [HOME, ['Бриф', 'brif/']],
    get body() {
      const steps = [
        ['Какое пространство и какая площадь?', `<div class="chips">${spaces.map(s => chip('type', s.name, 'radio', ` data-slug="${s.slug}"`)).join('')}${chip('type', 'Другое')}</div>
          <p class="bq-sub">Площадь</p><div class="chips">${AREAS.map(a => chip('area', a)).join('')}</div>`],
        ['Каким должен быть образ? Три слова', `<div class="words"><input name="w1" aria-label="Первое слово" placeholder="Например, спокойный"><input name="w2" aria-label="Второе слово" placeholder="тёплый"><input name="w3" aria-label="Третье слово" placeholder="статусный"></div>
          <p class="bq-sub">Подсказки — нажмите, чтобы добавить</p><div class="chips chips-hint">${WORDS.map(w => `<button type="button" class="chip-b">${w}</button>`).join('')}</div>`],
        ['Какие семейства ароматов вам ближе?', `<div class="chips chips-fam">${FAMS.map(c => `<label class="chip chip-fam"><input type="checkbox" name="fam" value="${esc(c.name)}"><span><b>${c.name}</b><small>${c.mood}</small></span></label>`).join('')}${chip('fam', 'Не знаю — подскажите', 'checkbox')}</div>`],
        ['Когда нужен запуск?', `<div class="chips">${WHEN.map(w => chip('when', w)).join('')}</div>`],
        ['Как с вами связаться?', `<div class="form bq-contacts"><label>Имя<input name="name" autocomplete="name" placeholder="Как к вам обращаться"></label><label>Телефон<input name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+7"></label><label>Компания и должность<input name="company" autocomplete="organization" placeholder="Например, отель, управляющий"></label></div>`]
      ];
      return UI.head(this, { lead: 'Пять вопросов, по одному на экран. Ответы сразу идут в подготовку дегустации: мы приедем с композициями, которые подходят вашему пространству.' }) + `
<section class="sec sec-top"><div class="wrap narrow">
  <form class="brief" id="brief" novalidate data-wa="${UI.wa()}">
    <div class="bq-top"><span class="bq-prog" aria-live="polite">01 / 05</span><button type="button" class="bq-share" id="bq-share">${icon('arrowUR')}Переслать коллеге</button></div>
    <div class="bq-bar"><i></i></div>
    ${steps.map(([q, html], i) => `<fieldset class="bq" data-step="${i}"><legend><span>${String(i + 1).padStart(2, '0')}</span>${q}</legend>${html}</fieldset>`).join('')}
    <div class="bq-nav">
      <button type="button" class="btn btn-glass" id="bq-prev">${icon('arrowUL')}Назад</button>
      <button type="button" class="btn btn-ink" id="bq-next">Дальше ${icon('arrowR')}</button>
      <button type="submit" class="btn btn-ink" id="bq-send">Отправить бриф в WhatsApp ${icon('arrowUR')}</button>
    </div>
    <p class="f-note">Бриф откроется в WhatsApp готовым сообщением — останется нажать «Отправить».</p>
  </form>
</div></section>
<section class="sec"><div class="wrap narrow prose">
  <h2>Зачем нужен бриф</h2>
  <p>Бриф — это не анкета ради заявки. По ответам мы выбираем композиции и аппараты для дегустации, поэтому первая встреча проходит предметно: вы сразу слышите ароматы в своём пространстве, а не листаете каталог.</p>
  <p>Если объект лучше знает коллега — управляющий, инженер или бренд-менеджер, — перешлите ему ссылку на эту страницу. Не уверены в ответе — пропустите вопрос, уточним на встрече. Есть вопросы — <a href="${UI.waPage(this)}" target="_blank" rel="noopener">напишите в WhatsApp</a>.</p>
</div></section>`;
    }
  });

  /* ── Журнал ── */
  add({
    path: 'zhurnal/',
    title: 'Журнал ÁUA — об аромате, сервисе и фирменном стиле',
    description: 'Статьи ÁUA о премиальной ароматизации: аромат дорогих отелей, примеры аромабрендинга, выбор фирменного аромата, аромат жилого комплекса.',
    h1: 'Журнал',
    breadcrumbs: [HOME, ['Журнал', 'zhurnal/']],
    get body() {
      return UI.head(this, { lead: 'Об аромате как части сервиса и бренда.' }) + `
<section class="sec sec-top"><div class="wrap"><div class="cards cards-3">${articles.map(artCard).join('')}</div></div></section>
<section class="sec"><div class="wrap narrow prose"><p>В журнале мы рассказываем, как аромат работает в отелях, бутиках, ресторанах, спа и жилых комплексах, какие ароматы выбирают известные бренды, как выбрать фирменную композицию и почему в премиальном сервисе важны деликатность и постоянство.</p></div></section>`;
    }
  });
  articles.forEach(a => {
    const p = `zhurnal/${a.slug}/`;
    add({
      path: p, title: a.title, description: a.description, h1: a.h1, ogType: 'article', updated: a.date,
      breadcrumbs: [HOME, ['Журнал', 'zhurnal/'], [a.h1, p]],
      schema: [site.schema.article(a, p)],
      get body() {
        return UI.head(this, { lead: a.lead, backHref: '/zhurnal/', backLabel: 'Журнал' }) + `<article class="sec sec-top"><div class="wrap narrow prose"><p class="kicker">// ${dateRu(a.date)} · ${a.read} мин</p>${a.body}</div></article>`;
      }
    });
  });

  /* ── Контакты ── */
  add({
    path: 'kontakty/',
    title: 'Контакты ÁUA — премиальная ароматизация в Астане',
    description: `Контакты ÁUA в Астане: ${C.phone}, WhatsApp, ${C.street}. Дегустация и фирменный аромат для отеля, бутика, ресторана и резиденции.`,
    h1: 'Контакты',
    breadcrumbs: [HOME, ['Контакты', 'kontakty/']],
    schema: [site.schema.business(C)],
    ctaTitle: 'Запишитесь на дегустацию',
    get body() {
      return UI.head(this, { lead: 'Расскажите о вашем пространстве — мы предложим композиции и приедем на дегустацию.' }) + `
<section class="sec sec-top"><div class="wrap"><div class="cards cards-4">
  <a class="card card-text" href="tel:${C.phoneRaw}"><span class="card-n">// телефон</span><span class="card-t">${C.phone}</span></a>
  <a class="card card-text" href="${UI.waPage(this)}" target="_blank" rel="noopener"><span class="card-n">// whatsapp</span><span class="card-t">Написать</span></a>
  <a class="card card-text" href="${C.map2gis}" target="_blank" rel="noopener"><span class="card-n">// офис</span><span class="card-t">${C.address}</span></a>
  <div class="card card-text"><span class="card-n">// время работы</span><span class="card-t">${C.hours}</span></div>
</div></div></section>
<section class="sec"><div class="wrap narrow prose"><p>ÁUA работает с отелями, бутиками, ресторанами, спа, жилыми комплексами и офисами по всей Астане. Специалист приезжает в пространство, устанавливает диффузоры и дальше сам меняет масла по графику. Перед встречей можно посмотреть <a href="/kollekciya/">коллекцию</a> и заполнить <a href="/brif/">бриф</a>.</p><p>Первая встреча — знакомство с пространством: мы смотрим планировку, высоту потолков, вентиляцию и маршрут гостя, слушаем, каким вы видите характер бренда. После этого привозим композиции на дегустацию и предлагаем схему расстановки аппаратов.</p></div></section>`;
    }
  });

  add({
    path: 'politika-konfidencialnosti/', noindex: true, noCta: true,
    title: 'Политика конфиденциальности — ÁUA',
    description: 'Политика обработки персональных данных сайта ÁUA: какие данные мы получаем через формы и мессенджеры и как их используем.',
    h1: 'Политика конфиденциальности',
    breadcrumbs: [HOME, ['Политика конфиденциальности', 'politika-konfidencialnosti/']],
    get body() {
      return UI.head(this, {}) + `<section class="sec sec-top"><div class="wrap narrow prose"><p>Сайт не собирает и не хранит персональные данные на сервере. Данные из формы и брифа (имя, телефон, компания, ответы о пространстве) передаются в WhatsApp сообщением, которое вы отправляете сами.</p><p>Мы используем их только для связи, подготовки дегустации, расчёта и заключения договора и не передаём третьим лицам, кроме случаев, предусмотренных законодательством Республики Казахстан. Чтобы удалить данные, позвоните ${C.phone}.</p></div></section>`;
    }
  });
  add({
    path: '404.html', noindex: true, noCta: true,
    title: 'Страница не найдена — ÁUA', description: 'Такой страницы нет. Вернитесь на главную ÁUA.',
    body: `<section class="phead nf"><div class="wrap">${UI.back()}<p class="kicker">// 404</p><h1 class="display">Страница не найдена</h1><p class="lead">Возможно, её переместили. Вернитесь на главную или откройте коллекцию.</p><a class="btn btn-ink" href="/kollekciya/">Коллекция ${icon('arrowUR')}</a></div></section>`
  });
}

const plural = n => `${n} ${n % 10 === 1 && n % 100 !== 11 ? 'композиция' : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 'композиции' : 'композиций'}`;

function dateRu(d) {
  const m = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  const [y, mo, da] = d.split('-').map(Number);
  return `${da} ${m[mo - 1]} ${y}`;
}

module.exports = { register };
