/* Презентация ÁUA в PDF: node tools/deck.js → src/assets/aua-presentation.pdf
   Собирается из тех же данных, что и сайт (пространства, коллекция, этапы, контакты из config.js).
   Цен нет — презентацию пересылают тем, кто решает, а фирменный аромат считается под проект. */
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');
const D = require('../lib/data');
const UI = require('../src/ui');
const CFG = require('../src/config');
const { spaces } = require('../src/content');

const root = path.join(__dirname, '..');
const imgDir = path.join(root, 'src', 'assets', 'img');
const out = path.join(root, CFG.deck.startsWith('assets/') ? 'src' : '', CFG.deck);
/* Картинки ужимаются в JPEG ~1000 px (Pillow), иначе PDF весит больше 10 МБ */
const small = path.join(os.tmpdir(), 'aua-deck-img');
fs.mkdirSync(small, { recursive: true });
const python = process.env.PYTHON || 'C:/Users/anton/AppData/Local/Programs/Python/Python312/python.exe';
execFileSync(python, ['-c', `import sys,glob,os
from PIL import Image
for f in glob.glob(os.path.join(sys.argv[1],'*.webp')):
    im=Image.open(f).convert('RGB'); im.thumbnail((1000 if 'hero' not in f else 1600,)*2)
    im.save(os.path.join(sys.argv[2],os.path.basename(f)[:-5]+'.jpg'),quality=82,optimize=True)`, imgDir, small]);
const img = k => 'file:///' + path.join(small, k + '.jpg').replace(/\\/g, '/');
const C = UI.C;
const FAMS = ['hotel', 'perfume', 'spa', 'floral', 'fresh', 'gourmand'].map(D.cat);
const site = 'https://t0niske.github.io/aua-maison/';

const SIG = [['Бриф', 'Бренд тремя словами, интерьер, гости, маршрут.'], ['Направления', 'Несколько направлений на дегустации в вашем пространстве.'], ['Доработка', 'Уточняем выбранное, пока аромат не станет вашим.'], ['Финальная формула', 'Фиксируем формулу и закрепляем за брендом.'], ['Запуск', 'Аппараты по зонам, интенсивность, расписание и сервис.']];
const METHOD = [['Знакомство', 'Пространство, гости, характер бренда.'], ['Композиция', 'Ароматы из коллекции или направления фирменного.'], ['Расстановка', 'Точки по маршруту гостя и число аппаратов.'], ['Запуск', 'Монтаж, интенсивность и расписание по зонам.'], ['Сопровождение', 'Замена масел и сервис по графику.']];
const CHECKS = [['Безопасность масел', 'Составы для профессиональных диффузоров, состав показываем до запуска.'], ['Интенсивность', 'Настраиваем на месте и проверяем в разное время дня.'], ['Шум', 'Аппараты Nova тише 35 дБ.'], ['Монтаж', 'Автономно или в вентиляцию — по согласованию с инженером.']];
const n2 = i => String(i + 1).padStart(2, '0');
const list = a => a.map(([t, d], i) => `<li><span>${n2(i)}</span><b>${t}</b><p>${d}</p></li>`).join('');

const html = `<!doctype html><html lang="ru"><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Jura:wght@400;500;600&family=Mulish:wght@400;500;600;700&display=swap">
<style>
@page{size:297mm 210mm;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
body{font:400 11pt/1.5 Mulish,sans-serif;color:#0A0E16;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.pg{width:297mm;height:210mm;padding:16mm 18mm;position:relative;overflow:hidden;page-break-after:always;
  background:linear-gradient(rgba(255,255,255,.3) 1px,transparent 1px) 0 0/16mm 16mm,linear-gradient(90deg,rgba(255,255,255,.3) 1px,transparent 1px) 0 0/16mm 16mm,linear-gradient(180deg,#DCE6F2,#D3DFEE)}
.pg:last-child{page-break-after:auto}
.k{font:500 9pt/1 Jura,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#B8401C;margin-bottom:5mm}
h1{font:500 40pt/1 Jura,sans-serif;text-transform:uppercase;letter-spacing:.03em}
h2{font:500 26pt/1.05 Jura,sans-serif;text-transform:uppercase;letter-spacing:.03em;margin-bottom:8mm;max-width:200mm}
.logo{font:600 22pt/1 Jura,sans-serif;letter-spacing:.12em}
.foot{position:absolute;left:18mm;right:18mm;bottom:9mm;display:flex;justify-content:space-between;font:500 8pt/1 Jura,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#525C6E}
.cover img{position:absolute;right:4mm;bottom:14mm;width:162mm;
  -webkit-mask-image:radial-gradient(closest-side,#000 72%,transparent 100%);mask-image:radial-gradient(closest-side,#000 72%,transparent 100%)}
.cover .txt{position:relative;width:118mm;margin-top:24mm}
.cover h1{font-size:34pt}
.cover p{font-size:13pt;color:#2C3444;margin-top:8mm}
.proof{font:500 10pt/1.3 Jura,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#B8401C;margin-top:6mm}
ol{list-style:none;display:grid;gap:4mm}
.cols5{grid-template-columns:repeat(5,1fr)}
.cols4{grid-template-columns:repeat(4,1fr)}
li{background:rgba(255,255,255,.6);border:1px solid #fff;border-radius:5mm;padding:6mm 5mm}
li span{font:500 9pt/1 Jura,sans-serif;letter-spacing:.14em;color:#B8401C}
li b{display:block;font:600 13pt/1.2 Jura,sans-serif;margin:3mm 0 2mm}
li p{font-size:9.5pt;color:#2C3444}
.gets{display:grid;grid-template-columns:repeat(4,1fr);gap:4mm;margin-top:8mm}
.gets div{border-top:1px solid rgba(10,14,22,.15);padding-top:4mm}
.gets b{font:600 12pt/1.2 Jura,sans-serif}
.gets p{font-size:9.5pt;color:#2C3444;margin-top:2mm}
.sp{display:grid;grid-template-columns:repeat(5,1fr);gap:4mm}
.sp div{background:rgba(255,255,255,.55);border:1px solid #fff;border-radius:4mm;padding:2.5mm 2.5mm 4mm}
.sp img{width:100%;aspect-ratio:16/10;object-fit:cover;border-radius:3mm}
.sp b{display:block;font:600 11pt/1.2 Jura,sans-serif;margin-top:3mm;padding:0 1mm}
.fam{display:grid;grid-template-columns:repeat(6,1fr);gap:4mm}
.fam div{text-align:left}
.fam img{width:100%;aspect-ratio:1;object-fit:cover;border-radius:4mm}
.fam b{display:block;font:600 11pt/1.2 Jura,sans-serif;margin-top:3mm}
.fam p{font-size:9pt;color:#2C3444}
.lead{font-size:12pt;color:#2C3444;max-width:210mm;margin:-3mm 0 8mm}
.ct{display:grid;grid-template-columns:1fr 1fr;gap:12mm;margin-top:4mm}
.ct dl{display:grid;gap:4mm}
.ct dt{font:500 8.5pt/1 Jura,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#525C6E}
.ct dd{font:600 14pt/1.25 Jura,sans-serif;margin-top:1.5mm}
</style></head><body>

<section class="pg cover">
  <div class="logo">ÁUA</div>
  <div class="txt">
    <p class="k">// Астана</p>
    <h1>Премиальная ароматизация и фирменный аромат</h1>
    <p>Отели, бутики, рестораны, резиденции и офисы. Подбираем или создаём аромат бренда и ведём его каждый день.</p>
    <p class="proof">32 композиции · 10 типов пространств</p>
  </div>
  <img src="${img('hero')}" alt="">
  <div class="foot"><span>// презентация</span><span>${site.replace('https://', '')}</span></div>
</section>

<section class="pg">
  <p class="k">// фирменный аромат</p>
  <h2>Аромат, который узнают с закрытыми глазами</h2>
  <p class="lead">Одна композиция во всех зонах и во всех точках бренда: в лобби и ресторане отеля, в каждом бутике сети, в офисе продаж и в лобби готового дома.</p>
  <ol class="cols5">${list(SIG)}</ol>
  <div class="gets">${CFG.signatureGets.map(([t, d]) => `<div><b>${t}</b><p>${d}</p></div>`).join('')}</div>
  <div class="foot"><span>// ÁUA</span><span>02</span></div>
</section>

<section class="pg">
  <p class="k">// метод</p>
  <h2>Пять шагов к аромату пространства</h2>
  <ol class="cols5">${list(METHOD)}</ol>
  <p class="k" style="margin-top:12mm">// перед запуском</p>
  <ol class="cols4">${list(CHECKS)}</ol>
  <div class="foot"><span>// ÁUA</span><span>03</span></div>
</section>

<section class="pg">
  <p class="k">// пространства</p>
  <h2>Десять типов пространств</h2>
  <div class="sp">${spaces.map(s => `<div><img src="${img('space-' + s.slug)}" alt=""><b>${s.name}</b></div>`).join('')}</div>
  <div class="foot"><span>// ÁUA</span><span>04</span></div>
</section>

<section class="pg">
  <p class="k">// коллекция</p>
  <h2>Шесть семейств, тридцать две композиции</h2>
  <p class="lead">У каждой композиции — верхние ноты, сердце и база, как у духов. Отельные и парфюмерные — основа фирменных ароматов.</p>
  <div class="fam">${FAMS.map(c => `<div><img src="${img('family-' + c.slug)}" alt=""><b>${c.name}</b><p>${c.mood}</p></div>`).join('')}</div>
  <div class="foot"><span>// ÁUA</span><span>05</span></div>
</section>

<section class="pg">
  <p class="k">// дегустация</p>
  <h2>Начнём с дегустации в вашем пространстве</h2>
  <p class="lead">Привозим композиции и аппарат, включаем их у вас — аромат выбирают в своём интерьере, а не по описанию. Фирменный аромат считаем под проект.</p>
  <div class="ct">
    <dl><div><dt>Телефон</dt><dd>${C.phone}</dd></div><div><dt>WhatsApp</dt><dd>wa.me/${C.whatsapp}</dd></div>${C.email ? `<div><dt>Почта</dt><dd>${C.email}</dd></div>` : ''}</dl>
    <dl><div><dt>Офис</dt><dd>${C.address}</dd></div><div><dt>Бриф на аромат</dt><dd>${site.replace('https://', '')}brif/</dd></div>${C.instagram ? `<div><dt>Instagram</dt><dd>${C.instagram.replace(/^https?:\/\//, '')}</dd></div>` : ''}</dl>
  </div>
  <div class="foot"><span>// ÁUA · Астана</span><span>06</span></div>
</section>
</body></html>`;

const tmp = path.join(os.tmpdir(), 'aua-deck.html');
fs.writeFileSync(tmp, html);
const chrome = process.env.CHROME || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
execFileSync(chrome, ['--headless=new', '--disable-gpu', '--no-pdf-header-footer', '--virtual-time-budget=10000',
  `--user-data-dir=${path.join(os.tmpdir(), 'aua-deck-prof')}`, `--print-to-pdf=${out}`, 'file:///' + tmp.replace(/\\/g, '/')], { stdio: 'ignore' });
console.log('PDF:', path.relative(root, out), Math.round(fs.statSync(out).size / 1024) + ' КБ');
