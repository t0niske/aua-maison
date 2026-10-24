/* Страницы ÁUA */
const D = require('../lib/data');
const { esc } = require('../lib/engine');
const UI = require('./ui');
const { spaces, articles } = require('./content');
const { icon } = UI;
const TX = require('./texts');

const HOME = ['Главная', ''];
const METHOD = [
  ['Знакомство', 'Обсуждаем пространство, гостей, характер бренда и задачу аромата. Если нужно — приезжаем посмотреть.'],
  ['Композиция', 'Предлагаем 2–3 аромата из коллекции, которые продолжают интерьер и бренд.'],
  ['Расстановка', 'Определяем точки установки по маршруту гостя и количество аппаратов.'],
  ['Запуск', 'Устанавливаем диффузоры, настраиваем интенсивность и расписание. Обычно — в день обращения.'],
  ['Сопровождение', 'Меняем масла по графику, следим за аппаратами. Гость видит только результат.']
];
const FAM_TEXT = {
  fresh: 'Цитрус, лайм, базилик и морской воздух. Чистая энергия для пространств, где важны свежесть и ясность.',
  floral: 'Роза, жасмин и фрезия. Праздничные, женственные композиции для бутиков, салонов и ювелирных домов.',
  gourmand: 'Кофе, ваниль и карамель. Тёплые композиции для ресторанов, кондитерских и домашнего уюта.',
  hotel: 'Белый чай, инжир, мускус и благородная древесина. Ароматы лобби пятизвёздочных отелей.',
  spa: 'Зелёный чай, бамбук, лаванда, эвкалипт. Композиции тишины для спа и wellness.',
  perfume: 'Кедр, сандал, кожа, табак и пряности. Ароматы с характером, построенные как духи.'
};

function register(site) {
  const { add, img } = site;
  const S = s => `/prostranstva/${s.slug}/`;
  const onHome = spaces.filter(s => s.home !== false);

  /* ── Главная ── */
  add({
    path: '', bodyClass: 'home', priority: '1.0',
    title: 'ÁUA — премиальная ароматизация пространств в Астане',
    description: 'Премиальная ароматизация отелей, бутиков, ресторанов, спа, резиденций и офисов в Астане. Фирменный аромат, 32 композиции, диффузоры и сервис по подписке.',
    schema: [site.schema.website(), site.schema.business(D.contacts)],
    body: `
<section class="hero">
  <div class="wrap hero-top">
    <h1 class="display">Премиальная ароматизация пространств</h1>
    <p class="hero-sub">Отели, бутики, рестораны, спа, резиденции и офисы в Астане. Подбираем фирменный аромат и ведём его каждый день.</p>
  </div>
  <div class="wrap">${UI.stage('hero', onHome.map(s => ({ x: s.x, y: s.y, label: s.label, href: S(s) })), { id: 'home', eager: true, fallback: require('./drawing')(), tip: 'Нажмите на пространство, чтобы узнать, как в нём звучит аромат', cardImg: i => 'space-' + onHome[i].slug })}</div>
</section>

<section class="sec manifest">
  <div class="wrap narrow">
    <p class="kicker">// манифест</p>
    <p class="big">Гость забудет мрамор и свет, но запомнит, как пахло в лобби. Мы работаем с тем, что остаётся в памяти дольше всего.</p>
    <div class="facts">
      <div><b>32</b><span>композиции в коллекции</span></div>
      <div><b>6</b><span>семейств ароматов</span></div>
      <div><b>1 день</b><span>от заявки до запуска</span></div>
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="sec-head"><p class="kicker">// метод</p><h2 class="h2">Пять шагов к аромату пространства</h2></div>
    <ol class="steps">${METHOD.map(([t, d], i) => `<li><span class="step-n">${String(i + 1).padStart(2, '0')}</span><h3>${t}</h3><p>${d}</p></li>`).join('')}</ol>
    <a class="more" href="/metod/">Подробнее о методе ${icon('arrowUR')}</a>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="sec-head"><p class="kicker">// коллекция</p><h2 class="h2">Шесть семейств, тридцать две композиции</h2></div>
    <div class="cards cards-3">${D.categories.map(c => `<a class="card" href="/kollekciya/#${c.slug}"><span class="card-media">${img('family-' + c.slug, { cls: 'card-img' })}<span class="go">${icon('arrowUR')}</span></span><span class="card-t">${c.name}</span><span class="card-d">${c.mood}</span></a>`).join('')}</div>
  </div>
</section>

<section class="sec">
  <div class="wrap split">
    <div>
      <p class="kicker">// фирменный аромат</p>
      <h2 class="h2">Аромат, который узнают с закрытыми глазами</h2>
      <p>Один аромат во всех зонах и во всех точках бренда. Через несколько месяцев гости начинают узнавать вас по запаху — так работают лучшие отели и модные дома мира.</p>
      <a class="btn btn-ink" href="/signature/">Как мы подбираем ${icon('arrowUR')}</a>
    </div>
    <div class="price-card">
      <p class="kicker">// условия</p>
      ${D.devices.map(d => `<div class="pc-row"><span><b>${d.name}</b> до ${d.area} м²</span><span>от <b>${UI.pm(d)}</b> / мес</span></div>`).join('')}
      <p class="pc-note">Диффузор, композиция, замена масел, обслуживание и гарантия — в одной подписке.</p>
      <a class="more" href="/usloviya/">Все условия ${icon('arrowUR')}</a>
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="sec-head"><p class="kicker">// журнал</p><h2 class="h2">Об аромате и сервисе</h2></div>
    <div class="cards cards-3">${articles.map(a => `<a class="card card-text" href="/zhurnal/${a.slug}/"><span class="card-n">${dateRu(a.date)}</span><span class="card-t">${esc(a.h1)}</span><span class="card-d">${esc(a.lead)}</span><span class="go">${icon('arrowUR')}</span></a>`).join('')}</div>
  </div>
</section>`
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
  <p>Аромат живёт в воздухе: на него влияют высота потолков, вентиляция, материалы и поток людей. В лобби с камнем и высоким потолком композиции нужно больше силы, в небольшом бутике с текстилем — больше деликатности. Поэтому мы подбираем не только аромат, но и точки установки по маршруту гостя.</p>
</div></section>`;
    }
  });

  spaces.forEach(s => {
    const p = `prostranstva/${s.slug}/`;
    const allFaq = [...s.faq, ['Сколько стоит?', `Подписка на Nova 300 — от ${UI.pm(D.devices[0])} в месяц, на Nova 1000 — от ${UI.pm(D.devices[1])}. В цену входят диффузор, композиция, масла, обслуживание и гарантия.`]];
    add({
      path: p, title: s.title, description: s.description, h1: s.h1,
      breadcrumbs: [HOME, ['Пространства', 'prostranstva/'], [s.h1, p]],
      schema: [site.schema.service({ name: s.h1 + ' — премиальная ароматизация', description: s.description, type: 'Ароматизация помещений', low: 33333, high: 400000 }, p), site.schema.faq(allFaq)],
      ctaTitle: `Подберём аромат: ${s.name.toLowerCase()}`,
      get body() {
        return `
<section class="phead phead-stage">
  <div class="wrap">
    <div class="phead-top">${UI.back()}${site.crumbs(this.breadcrumbs)}</div>
    <h1 class="display">${s.h1}</h1>
    <p class="lead">${s.lead}</p>
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
  <div class="wrap">
    <div class="sec-head"><p class="kicker">// композиции</p><h2 class="h2">Что звучит в этом пространстве</h2></div>
    <ul class="srows">${s.scents.map(n => UI.scentRow(D.byN(n))).join('')}</ul>
    <a class="more" href="/kollekciya/">Вся коллекция ${icon('arrowUR')}</a>
  </div>
</section>
${UI.faq(allFaq)}
<section class="sec"><div class="wrap">
  <div class="sec-head"><p class="kicker">// другие пространства</p></div>
  <div class="cards cards-5">${spaces.filter(o => o !== s).map((o, i) => UI.card({ label: o.h1, href: S(o) }, i, 'space-' + o.slug)).join('')}</div>
</div></section>`;
      }
    });
  });

  /* ── Коллекция ── */
  add({
    path: 'kollekciya/',
    title: 'Коллекция ароматов для премиальных пространств — 32 композиции',
    description: 'Коллекция ÁUA: 32 композиции для ароматизации отелей, бутиков, ресторанов и спа. Отельные, парфюмерные, цветочные, свежие, гурманские и SPA-ароматы с нотами.',
    h1: 'Коллекция',
    breadcrumbs: [HOME, ['Коллекция', 'kollekciya/']],
    schema: [site.schema.itemList(D.scents.map(s => [s.name, `kollekciya/#${D.cat(s.cat).slug}`]))],
    get body() {
      return UI.head(this, { lead: 'Тридцать две композиции в шести семействах. У каждой — верхние ноты, сердце и база, как у духов.' }) + `
<nav class="fam-nav wrap" aria-label="Семейства">${D.categories.map(c => `<a href="#${c.slug}">${c.name}</a>`).join('')}</nav>
${D.categories.map(c => `<section class="sec fam" id="${c.slug}">
  <div class="wrap fam-grid">
    <div class="fam-side">
      ${img('family-' + c.slug, { cls: 'fam-img' })}
      <p class="kicker">// ${D.scents.filter(s => s.cat === c.id).length} композиций</p>
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
    ['Это индивидуальная композиция?', 'Мы подбираем фирменный аромат из коллекции из 32 композиций под ваш бренд, интерьер и гостей, и закрепляем его за всеми вашими пространствами.'],
    ['Сколько времени занимает подбор?', 'Обычно 1–3 дня: знакомство, 2–3 варианта на выбор, тест в пространстве.'],
    ['Можно ли сменить аромат позже?', 'Да, при следующей замене масла. Но фирменный аромат работает, когда он постоянен.']
  ];
  add({
    path: 'signature/',
    title: 'Фирменный аромат для отеля и бренда — подбор signature-аромата',
    description: 'Подбор фирменного аромата для отеля, бутика, ресторана или бренда в Астане: характер, интерьер, гости, тест в пространстве. Signature-аромат во всех точках.',
    h1: 'Фирменный аромат',
    breadcrumbs: [HOME, ['Фирменный аромат', 'signature/']],
    schema: [site.schema.faq(sigFaq)],
    get body() {
      return UI.head(this, { lead: 'Аромат, который становится частью бренда — как логотип, музыка и униформа.' }) + `
<section class="sec sec-top"><div class="wrap split">
  <div class="prose">
    <p>Фирменный аромат — это композиция, которую гость связывает только с вами. Она звучит во всех зонах и во всех точках бренда: в лобби отеля и в его ресторане, в каждом бутике сети, в офисе продаж и в лобби готового дома.</p>
    <p>Мы подбираем такой аромат из коллекции под три вещи: характер бренда, интерьер и гостей. Затем тестируем его в пространстве и закрепляем за вами.</p>
    <h2>Что учитываем</h2>
    <ul>
      <li><b>Характер бренда</b> — спокойный, смелый, классический, современный.</li>
      <li><b>Интерьер</b> — материалы, свет, высота потолков.</li>
      <li><b>Гости</b> — кто они, сколько времени проводят в пространстве.</li>
      <li><b>Маршрут</b> — где гость впервые чувствует аромат и где задерживается.</li>
    </ul>
    <p>Подробнее — в статье «<a href="/zhurnal/kak-vybrat-signature-aromat/">Как выбрать фирменный аромат</a>».</p>
  </div>
  <div class="note-card"><p class="kicker">// пример</p><h2 class="h3">Отель в центре Астаны</h2><p>Лобби, ресторан и спа звучат одной композицией — белый чай, инжир, гладкое дерево. В лобби — Nova 1000 по расписанию, в ресторане и спа — Nova 300.</p><p class="pc-note">Пример расстановки, не кейс клиента.</p></div>
</div></section>
${UI.faq(sigFaq)}`;
    }
  });

  /* ── Аромамаркетинг ── */
  const amFaq = [
    ['Чем аромамаркетинг отличается от ароматизации?', 'Ароматизация делает воздух приятным. Аромамаркетинг использует аромат как инструмент бренда: один узнаваемый запах во всех точках, связанный с вашим именем.'],
    ['Как понять, что аромат работает?', 'Спросите гостей и сотрудников через месяц, послушайте отзывы, посмотрите, задерживаются ли гости в лаунже. Лучший знак — когда аромат начинают узнавать и спрашивать, что это.'],
    ['С чего начать бренду с несколькими точками?', 'С флагмана: подобрать композицию, протестировать её месяц и затем распространить на все точки сети.']
  ];
  add({
    path: 'aromamarketing/',
    title: 'Аромамаркетинг и аромабрендинг для премиальных брендов — ÁUA',
    description: 'Аромамаркетинг в Астане для отелей, бутиков, ресторанов и девелоперов: как аромат становится частью бренда, принципы аромабрендинга и как оценить результат.',
    h1: 'Аромамаркетинг',
    breadcrumbs: [HOME, ['Аромамаркетинг', 'aromamarketing/']],
    schema: [site.schema.faq(amFaq), site.schema.service({ name: 'Аромамаркетинг и аромабрендинг', description: 'Подбор фирменного аромата и ароматизация пространств бренда', type: 'Аромамаркетинг', low: 33333, high: 400000 }, 'aromamarketing/')],
    get body() {
      return UI.head(this, { lead: 'Запах — единственное чувство, которое бренд может занять полностью: у конкурентов может быть похожий интерьер, но не ваш аромат.' }) + `
<section class="sec sec-top"><div class="wrap split">
  <div class="prose">
    <p>Аромамаркетинг — это работа с запахом как с частью бренда. В премиальном сегменте его используют давно: гостиничные сети, модные дома и автомобильные марки годами держат один и тот же аромат, чтобы гость узнавал их с закрытыми глазами.</p>
    <p>Обоняние связано с эмоциями и памятью напрямую, без «перевода» в слова. Поэтому аромат вызывает ощущение раньше, чем человек его осознаёт, и запоминается дольше, чем вывеска или цвет стен. Через несколько месяцев постоянный аромат становится таким же знаком бренда, как логотип.</p>
    <h2>Аромабрендинг: когда аромат становится вашим</h2>
    <p>Аромабрендинг — следующий шаг: композиция закрепляется за брендом и звучит во всех его точках. Лобби отеля, его ресторан и спа; все бутики сети; офис продаж застройщика и лобби готового дома. Подробно о подборе — на странице <a href="/signature/">«Фирменный аромат»</a>.</p>
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
  <div class="cards cards-5">${spaces.map((o, i) => UI.card({ label: o.h1, href: S(o) }, i, 'space-' + o.slug)).join('')}</div>
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
<section class="sec sec-top"><div class="wrap narrow"><ol class="timeline">${METHOD.map(([t, d], i) => `<li><span class="step-n">${String(i + 1).padStart(2, '0')}</span><div><h2 class="h3">${t}</h2><p>${d}</p></div></li>`).join('')}</ol></div></section>
<section class="sec"><div class="wrap split">
  <div class="prose">
    <h2>Оборудование</h2>
    <p>Мы работаем на металлических диффузорах Nova. Nova 300 рассчитан на пространство до 300 м², Nova 1000 — до 1000 м² и управляется со смартфона. Оба работают тише 35 дБ и по расписанию: аромат включается к открытию и выключается после закрытия.</p>
    <h2>Сопровождение</h2>
    <p>Масла меняет наш специалист по графику. Обслуживание и гарантия входят в подписку: если аппарат выйдет из строя, мы его заменим.</p>
  </div>
  <div class="dev-art">${img('device')}</div>
</div></section>`;
    }
  });

  /* ── Условия ── */
  const condFaq = [
    ['Что входит в подписку?', TX.included.join(', ') + '.'],
    ['Почему 6 месяцев выгоднее?', 'Длинный срок позволяет планировать поставки масел и обслуживание, поэтому цена в месяц ниже.'],
    ['Как заключается договор?', 'Официальный договор с юрлицом или ИП на 1, 3 или 6 месяцев.']
  ];
  add({
    path: 'usloviya/',
    title: 'Условия и цены ÁUA: подписка на ароматизацию от 33 333 ₸',
    description: 'Цены на премиальную ароматизацию в Астане: Nova 300 от 33 333 ₸ и Nova 1000 от 66 667 ₸ в месяц. Диффузор, композиция, масла, сервис и гарантия включены.',
    h1: 'Условия',
    breadcrumbs: [HOME, ['Условия', 'usloviya/']],
    schema: [site.schema.faq(condFaq)],
    get body() {
      return UI.head(this, { lead: 'Одна подписка — диффузор, композиция, замена масел, обслуживание и гарантия. Чем дольше срок, тем ниже цена в месяц.' }) + `
<section class="sec sec-top"><div class="wrap"><div class="plans">${D.devices.map(d => `<article class="plan">
  <p class="kicker">// до ${d.area} м²</p><h2 class="h3">${d.name}</h2><p class="plan-lead">${TX.lead[d.id]}</p>
  <ul class="plan-rows">${d.plans.map(pl => `<li><span>${UI.months(pl.months)}</span><b>${D.fmt(pl.total)}</b><small>${D.fmt(D.perMonth(pl))} / мес</small></li>`).join('')}</ul>
  <dl class="plan-specs">${d.specs.slice(0, 6).map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
</article>`).join('')}</div>
<ul class="incl">${TX.included.map(t => `<li>${icon('plus')}${t}</li>`).join('')}</ul></div></section>
${UI.faq(condFaq)}`;
    }
  });

  /* ── Журнал ── */
  add({
    path: 'zhurnal/',
    title: 'Журнал ÁUA — об аромате, сервисе и фирменном стиле',
    description: 'Статьи ÁUA о премиальной ароматизации: аромат как часть сервиса, выбор фирменного аромата, аромат жилого комплекса и офиса продаж.',
    h1: 'Журнал',
    breadcrumbs: [HOME, ['Журнал', 'zhurnal/']],
    get body() {
      return UI.head(this, { lead: 'Об аромате как части сервиса и бренда.' }) + `
<section class="sec sec-top"><div class="wrap"><div class="cards cards-3">${articles.map(a => `<a class="card card-text" href="/zhurnal/${a.slug}/"><span class="card-n">${dateRu(a.date)} · ${a.read} мин</span><span class="card-t">${esc(a.h1)}</span><span class="card-d">${esc(a.lead)}</span><span class="go">${icon('arrowUR')}</span></a>`).join('')}</div></div></section>
<section class="sec"><div class="wrap narrow prose"><p>В журнале мы рассказываем, как аромат работает в отелях, бутиках, ресторанах, спа и жилых комплексах, как выбрать фирменную композицию и почему в премиальном сервисе важны деликатность и постоянство. Все статьи основаны на нашей практике ароматизации пространств в Астане.</p></div></section>`;
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
  const C = D.contacts;
  add({
    path: 'kontakty/',
    title: 'Контакты ÁUA — премиальная ароматизация в Астане',
    description: `Контакты ÁUA в Астане: ${C.phone}, WhatsApp, ${C.street}. Подбор фирменного аромата для отеля, бутика, ресторана и резиденции.`,
    h1: 'Контакты',
    breadcrumbs: [HOME, ['Контакты', 'kontakty/']],
    schema: [site.schema.business(C)],
    ctaTitle: 'Напишите нам',
    get body() {
      return UI.head(this, { lead: 'Расскажите о вашем пространстве — мы предложим композиции и приедем на установку.' }) + `
<section class="sec sec-top"><div class="wrap"><div class="cards cards-4">
  <a class="card card-text" href="tel:${C.phoneRaw}"><span class="card-n">// телефон</span><span class="card-t">${C.phone}</span></a>
  <a class="card card-text" href="${D.waLink()}" target="_blank" rel="noopener"><span class="card-n">// whatsapp</span><span class="card-t">Написать</span></a>
  <a class="card card-text" href="${C.map2gis}" target="_blank" rel="noopener"><span class="card-n">// офис</span><span class="card-t">${C.address}</span></a>
  <div class="card card-text"><span class="card-n">// время работы</span><span class="card-t">${C.hours}</span></div>
</div></div></section>
<section class="sec"><div class="wrap narrow prose"><p>ÁUA работает с отелями, бутиками, ресторанами, спа, жилыми комплексами и офисами по всей Астане. Специалист приезжает в пространство, устанавливает диффузоры и дальше сам меняет масла по графику. Перед встречей можно посмотреть <a href="/kollekciya/">коллекцию</a> и <a href="/usloviya/">условия</a>.</p><p>Первая встреча — знакомство с пространством: мы смотрим планировку, высоту потолков, вентиляцию и маршрут гостя, слушаем, каким вы видите характер бренда. После этого предлагаем две-три композиции и схему расстановки аппаратов, а затем запускаем аромат — обычно в день обращения.</p></div></section>`;
    }
  });

  add({
    path: 'politika-konfidencialnosti/', noindex: true, noCta: true,
    title: 'Политика конфиденциальности — ÁUA',
    description: 'Политика обработки персональных данных сайта ÁUA: какие данные мы получаем через формы и мессенджеры и как их используем.',
    h1: 'Политика конфиденциальности',
    breadcrumbs: [HOME, ['Политика конфиденциальности', 'politika-konfidencialnosti/']],
    get body() {
      return UI.head(this, {}) + `<section class="sec sec-top"><div class="wrap narrow prose"><p>Сайт не собирает и не хранит персональные данные на сервере. Данные из формы (имя, тип пространства, адрес) передаются в WhatsApp сообщением, которое вы отправляете сами.</p><p>Мы используем их только для связи, расчёта и заключения договора и не передаём третьим лицам, кроме случаев, предусмотренных законодательством Республики Казахстан. Чтобы удалить данные, позвоните ${C.phone}.</p></div></section>`;
    }
  });
  add({
    path: '404.html', noindex: true, noCta: true,
    title: 'Страница не найдена — ÁUA', description: 'Такой страницы нет. Вернитесь на главную ÁUA.',
    body: `<section class="phead nf"><div class="wrap">${UI.back()}<p class="kicker">// 404</p><h1 class="display">Страница не найдена</h1><p class="lead">Возможно, её переместили. Вернитесь на главную или откройте коллекцию.</p><a class="btn btn-ink" href="/kollekciya/">Коллекция ${icon('arrowUR')}</a></div></section>`
  });
}

function dateRu(d) {
  const m = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  const [y, mo, da] = d.split('-').map(Number);
  return `${da} ${m[mo - 1]} ${y}`;
}

module.exports = { register };
