/* Слоты картинок ÁUA. Общий стиль — как у референса massage-self: матовый белый гипс
   (clay render) на бледно-голубом фоне, мягкий студийный свет, без цвета. */
const STYLE = 'Monochrome 3D clay render: everything is made of smooth matte white plaster, no colours, no textures, no text, no logos, no people. Soft diffused studio light from the upper left, gentle ambient occlusion and soft shadows. Background: seamless pale powder-blue gradient from #C9D8EC at the edges to #E3EBF5 in the centre, fading into the background at the bottom. Calm, premium, minimal, very clean, high detail.';
const space = (scene, zones) => ({
  w: 16, h: 10, prio: 1,
  prompt: `${STYLE}\nSubject: an isometric cut-away architectural maquette (like an architect's white study model) of ${scene}, seen from the front at a 30° angle, the front wall removed so the interior is visible. Furniture and objects are simplified but recognisable.\nLayout (important, the website places clickable points on these areas): ${zones}.\nThe model is centred and occupies about 80% of the width, with air around it. Aspect ratio 16:10.`
});
const still = (what) => ({
  w: 1, h: 1, prio: 1,
  prompt: `${STYLE}\nSubject: a minimal sculptural still life made of white plaster: ${what}. The objects lie loosely on a low white plinth, centred, with a lot of air around them. A single wisp of translucent white mist curls above the composition. Aspect ratio 1:1.`
});

module.exports = {
  'hero': {
    title: 'Главный макет: здание с 6 пространствами', w: 4, h: 3, prio: 1, where: 'главная, первый экран (на неё ставятся точки)',
    alt: 'Белый макет здания: лобби отеля, бутик, ресторан, спа, офис и резиденция',
    prompt: `${STYLE}\nSubject: a white plaster architectural maquette of a three-storey luxury mixed-use building, front facade removed like a dollhouse cut-away, seen straight from the front with a slight top-down angle so every room is visible.\nLayout (important, the website places clickable points on these rooms):\n- top floor, centre: a penthouse residence with a sofa, a dining table and a big window;\n- middle floor, left half: a spa with a small pool and a massage table;\n- middle floor, right half: an executive office with a meeting table and chairs;\n- ground floor, left third: a hotel lobby with a reception desk and a chandelier;\n- ground floor, centre third: a fashion boutique with clothing rails and a plinth;\n- ground floor, right third: a restaurant with round tables and a bar counter.\nA very small white plaster aroma diffuser (a small rectangular box) stands in each room. The building is centred and fills about 85% of the frame height. Aspect ratio 4:3.\n\nПосле генерации пришлите картинку — я подгоню точки точно по комнатам.`
  },
  'space-otel': { title: 'Отель: лобби', alt: 'Макет лобби отеля: вход, ресепшн, лаунж, лифтовой холл', where: '/prostranstva/otel/', ...space('a five-star hotel lobby', 'left — the entrance doors; centre-left — a long reception desk; right-bottom — a lounge with armchairs and a low table; right-top — the elevator hall with two elevator doors') },
  'space-butik': { title: 'Бутик', alt: 'Макет бутика: витрина, торговый зал, примерочные, касса', where: '/prostranstva/butik/', ...space('a luxury fashion boutique', 'left — the shop window and the entrance; centre — the sales floor with clothing rails and a central plinth with bags; right-top — two fitting rooms with curtains; right-bottom — a cash desk') },
  'space-restoran': { title: 'Ресторан', alt: 'Макет ресторана: вход, лаунж-бар, гардероб, санузлы', where: '/prostranstva/restoran/', ...space('a fine-dining restaurant with a bar', 'left — the entrance with a host stand; centre — a lounge bar with high stools and bottles on shelves; right-bottom — a cloakroom with coats on hangers; right-top — the restroom door with a washbasin') },
  'space-spa': { title: 'Спа', alt: 'Макет спа: ресепшн, кабинеты, бассейн, зона отдыха', where: '/prostranstva/spa/', ...space('a premium spa and wellness centre', 'left — a calm reception desk with a vase; centre-top — a treatment room with a massage table; right-bottom — a small pool and a hammam bench; right-top — a relaxation area with loungers') },
  'space-rezidenciya': { title: 'Резиденция', alt: 'Макет резиденции: лобби, лифтовой холл, гостиная, гардеробная', where: '/prostranstva/rezidenciya/', ...space('a premium residential building with a penthouse', 'left-bottom — the lobby with a concierge desk; centre — an elevator hall; right-bottom — the penthouse living room with a sofa; right-top — a walk-in wardrobe') },
  'space-ofis': { title: 'Офис', alt: 'Макет офиса: ресепшн, переговорная, кабинет, клиентская зона', where: '/prostranstva/ofis/', ...space('an executive office of a private bank', 'left — the reception desk; centre-top — a meeting room with a long table; right — the CEO cabinet with a desk and a bookshelf; centre-bottom — a client lounge with armchairs') },
  'family-svezhie-citrusovye': { title: 'Свежие и цитрусовые', alt: 'Гипсовая композиция: лимоны, лайм, листья базилика', where: '/kollekciya/', ...still('a halved lemon, a whole lime, a bergamot and three basil leaves') },
  'family-cvetochnye': { title: 'Цветочные', alt: 'Гипсовая композиция: роза, жасмин, фрезия', where: '/kollekciya/', ...still('an open rose, a sprig of jasmine and a freesia stem') },
  'family-gurmanskie': { title: 'Гурманские', alt: 'Гипсовая композиция: кофейные зёрна, ваниль, карамель', where: '/kollekciya/', ...still('a small heap of coffee beans, two vanilla pods and a piece of caramel') },
  'family-otelnye': { title: 'Отельные', alt: 'Гипсовая композиция: инжир, чайная чаша, полотенце', where: '/kollekciya/', ...still('a halved fig, a small tea bowl with tea leaves and a neatly folded towel') },
  'family-spa-relax': { title: 'SPA и релакс', alt: 'Гипсовая композиция: лаванда, эвкалипт, камни', where: '/kollekciya/', ...still('a bundle of lavender, a eucalyptus branch and three smooth stones stacked') },
  'family-parfyumernye': { title: 'Парфюмерные', alt: 'Гипсовая композиция: кедр, кожа, табачный лист', where: '/kollekciya/', ...still('a block of cedar wood, a folded leather glove and a dried tobacco leaf') },
  'device': {
    title: 'Диффузор Nova на голубом фоне', w: 4, h: 5, prio: 1, where: '/usloviya/, /metod/',
    alt: 'Диффузор Nova для премиальной ароматизации',
    prompt: `Studio product photograph of a compact rectangular aroma diffuser about 20 cm tall made of matte graphite-grey metal with slightly rounded edges, a narrow vertical black glossy glass panel on the right half of the front with small glowing blue LED digits and a tiny red power icon, a round black fan grille on top, four short black feet. Three-quarter view, standing on a white plaster plinth. Seamless pale powder-blue background (#D6E2F0), soft diffused light, soft shadow. No text, no logos. Aspect ratio 4:5.\n\nПриложите фото аппарата из PDF-прайса как референс.`
  },
  'og': { title: 'Обложка для соцсетей', w: 16, h: 9, prio: 2, where: 'превью ссылок', alt: 'ÁUA — премиальная ароматизация пространств', prompt: `${STYLE}\nSubject: a white plaster maquette of a luxury hotel lobby on the right side of the frame, a soft wisp of mist rising from a tiny diffuser; the left half is empty pale-blue space for a headline. Aspect ratio 16:9.` }
};
