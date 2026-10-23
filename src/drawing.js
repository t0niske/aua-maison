/* Плоский архитектурный разрез здания (тонкие линии) — показывается на главной,
   пока нет рендера hero.*. Комнаты совпадают с точками из content.js. */
module.exports = function heroDrawing() {
  const room = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" class="d-room"/>`;
  return `<svg class="stage-img stage-draw" viewBox="0 0 1200 900" role="img" aria-label="Разрез здания: резиденция, спа, офис, лобби отеля, бутик и ресторан">
  <defs>
    <pattern id="hatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0v10" class="d-hatch"/></pattern>
    <radialGradient id="glow"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
  </defs>
  <ellipse cx="600" cy="470" rx="560" ry="400" fill="url(#glow)" opacity=".55"/>
  <!-- земля -->
  <path d="M40 760H1160" class="d-ground"/>
  <rect x="40" y="760" width="1120" height="26" fill="url(#hatch)"/>
  <!-- корпус -->
  ${room(380, 130, 440, 210)}
  ${room(160, 340, 440, 220)}${room(600, 340, 440, 220)}
  ${room(120, 560, 320, 200)}${room(440, 560, 320, 200)}${room(760, 560, 320, 200)}
  <path d="M360 130h480M140 340h920M100 560h1000" class="d-slab"/>
  <path d="M380 130l220-70 220 70" class="d-roof"/>
  <!-- резиденция: диван, стол, окно -->
  <g class="d-f"><rect x="420" y="270" width="150" height="40" rx="10"/><rect x="420" y="250" width="150" height="24" rx="10"/><rect x="640" y="250" width="120" height="14" rx="4"/><path d="M660 264v46M740 264v46"/><rect x="430" y="160" width="340" height="60" rx="2" class="d-glass"/></g>
  <!-- спа: бассейн, массажный стол -->
  <g class="d-f"><rect x="200" y="490" width="200" height="40" rx="20" class="d-water"/><path d="M215 508c20-8 40 8 60 0s40 8 60 0 40 8 60 0"/><rect x="440" y="470" width="120" height="16" rx="8"/><path d="M455 486v44M545 486v44"/><circle cx="250" cy="410" r="24"/><path d="M250 386v-20"/></g>
  <!-- офис: переговорный стол -->
  <g class="d-f"><rect x="700" y="470" width="220" height="18" rx="4"/><path d="M720 488v42M900 488v42"/><rect x="720" y="440" width="28" height="30" rx="6"/><rect x="790" y="440" width="28" height="30" rx="6"/><rect x="860" y="440" width="28" height="30" rx="6"/><rect x="960" y="390" width="50" height="140"/><path d="M960 425h50M960 460h50M960 495h50"/></g>
  <!-- лобби: стойка, люстра -->
  <g class="d-f"><rect x="170" y="690" width="170" height="70" rx="4"/><path d="M280 560v40"/><path d="M250 600h60l-10 26h-40z"/><rect x="370" y="660" width="20" height="100"/></g>
  <!-- бутик: стойки, подиум -->
  <g class="d-f"><path d="M480 620h90M480 620v140M570 620v140"/><path d="M495 630v40M515 630v46M535 630v38M555 630v44"/><rect x="620" y="710" width="100" height="50" rx="2"/><rect x="645" y="680" width="40" height="30" rx="6"/></g>
  <!-- ресторан: бар, столы -->
  <g class="d-f"><rect x="790" y="700" width="140" height="60" rx="3"/><path d="M800 640h120M800 670h120"/><circle cx="1000" cy="712" r="26"/><path d="M1000 738v22"/><circle cx="1040" cy="650" r="0"/></g>
  <!-- маленькие диффузоры в комнатах -->
  <g class="d-dev"><rect x="760" y="296" width="14" height="18" rx="2"/><rect x="570" y="512" width="14" height="18" rx="2"/><rect x="1020" y="512" width="14" height="18" rx="2"/><rect x="400" y="742" width="14" height="18" rx="2"/><rect x="735" y="742" width="14" height="18" rx="2"/><rect x="1050" y="742" width="14" height="18" rx="2"/></g>
  <!-- размеры -->
  <g class="d-dim"><path d="M120 812H1080M120 804v16M1080 804v16"/><path d="M1130 130V760M1122 130h16M1122 760h16"/></g>
  <text x="600" y="840" class="d-t" text-anchor="middle">РАЗРЕЗ · 6 ПРОСТРАНСТВ · 1 АРОМАТ</text>
</svg>`;
};

/* План одного пространства (16:10): контур, зоны вокруг точек, путь гостя, диффузоры. */
module.exports.space = function spaceDrawing(zones, name) {
  const W = 1200, H = 750;
  const P = zones.map(z => [z.x / 100 * W, z.y / 100 * H]);
  const path = 'M' + P.map(p => p.map(Math.round).join(' ')).join(' L');
  return `<svg class="stage-img stage-draw" viewBox="0 0 ${W} ${H}" role="img" aria-label="План: ${name}">
  <defs><radialGradient id="zg"><stop offset="0" stop-color="#fff" stop-opacity=".85"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
  <pattern id="hatch2" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0v10" class="d-hatch"/></pattern></defs>
  <rect x="70" y="80" width="1060" height="600" class="d-room"/>
  <path d="M70 80h1060v600H70z" class="d-slab" style="stroke-width:8"/>
  <path d="M70 300v120" stroke="#D6E2F0" stroke-width="12"/>
  <path d="M70 300a120 120 0 0 1 120 120" class="d-dim"/>
  <rect x="70" y="680" width="1060" height="22" fill="url(#hatch2)"/>
  ${P.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="150" fill="url(#zg)"/><circle cx="${x}" cy="${y}" r="96" class="d-zone"/>`).join('')}
  <path d="${path}" class="d-route"/>
  ${P.map(([x, y]) => `<rect x="${x + 70}" y="${y + 40}" width="16" height="20" rx="2" class="d-devr"/>`).join('')}
  <text x="600" y="730" class="d-t" text-anchor="middle">ПЛАН · ${zones.length} ЗОНЫ · МАРШРУТ ГОСТЯ</text>
</svg>`;
};
