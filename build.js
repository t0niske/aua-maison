/* Сборка ÁUA: node build.js → docs/ (GitHub Pages публикует папку docs).
   Домен: поменяйте origin и base (для своего домена base: '/'). */
const path = require('path');
const { createSite } = require('./lib/engine');
const D = require('./lib/data');
const UI = require('./src/ui');
const { register } = require('./src/pages');

const site = createSite({
  root: __dirname,
  name: 'ÁUA',
  origin: 'https://t0niske.github.io',
  base: '/aua-maison/',
  description: 'Премиальная ароматизация пространств в Астане',
  themeColor: '#D6E2F0',
  ogImage: 'og',
  images: require('./src/images'),
  browserData: D.browserScript()
});
UI.init(site);
register(site);
site.build(UI.layout);
