// Builds the Turoyo textbook (A1–C2, Serto only) in three editions: en, ru, uk.
// Usage: node turoyo-book.js <outDir>
// Reads the course data from the site repo, the translations from en.js / uk.js
// (index-aligned with strings.json, produced by dump.js) and the intros intro-{en,ru,uk}.html.
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const REPO = process.env.REPO || '/home/user/madrashta';
const HERE = __dirname;
const OUT = process.argv[2] || path.join(HERE, 'out');
fs.mkdirSync(OUT, { recursive: true });

global.window = {};
require(path.join(REPO, 'js/turoyo-data.js'));
require(path.join(REPO, 'js/turoyo-levels.js'));
const D = window.COURSE_DATA;

// English transliteration: the engine's own rules (incl. D.enRules for Turoyo).
const toEn = (() => { const src = fs.readFileSync(path.join(REPO, 'js/course.js'), 'utf8');
  const m = src.match(/var EN_RULES[\s\S]*?function toEn\(tr\) \{[\s\S]*?\n  \}\n/); return eval(m[0] + ';toEn'); })();

const STR = JSON.parse(fs.readFileSync(path.join(HERE, 'strings.json'), 'utf8'));
const TR = { en: require(path.join(HERE, 'en.js')), uk: require(path.join(HERE, 'uk.js')) };
if (TR.en.length !== STR.length || TR.uk.length !== STR.length) throw new Error('translation arrays out of sync with strings.json');
const MAP = { en: {}, uk: {} };
STR.forEach((s, i) => { MAP.en[s] = TR.en[i]; MAP.uk[s] = TR.uk[i]; });
const INTRO = { en: 'intro-en.html', ru: 'intro-ru.html', uk: 'intro-uk.html' };

let ED = 'ru';
const L = s => (s == null || ED === 'ru' || !/[\u0400-\u04ff]/.test(s)) ? s : (MAP[ED][s] != null ? MAP[ED][s] : (() => { throw new Error('missing ' + ED + ' translation: ' + s); })());
const T3 = (ru, uk, en) => ED === 'uk' ? uk : ED === 'en' ? en : ru;

// Turoyo Latin → Cyrillic (Russian or Ukrainian letters).
function toCyr(tr, uk) {
  let x = String(tr || '').replace(/\s*\([^)]*\)/g, '').toLowerCase().normalize('NFC')
    .replace(/š/g, 'sh').replace(/č/g, 'ch').replace(/ž/g, 'zh').replace(/ǧ/g, 'j').replace(/ġ/g, 'gh').replace(/x/g, 'kh').replace(/ə/g, 'e')
    .normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[ʾʿ'’]/g, '');
  const P = [['kh', 'х'], ['sh', 'ш'], ['ch', 'ч'], ['zh', 'ж'], ['gh', uk ? 'ґ' : 'г'], ['th', 'т'], ['dh', 'д'],
    ['ya', 'я'], ['yu', 'ю'], ['ye', uk ? 'є' : 'е'], ['yi', uk ? 'ї' : 'йи'], ['yo', 'йо'],
    ['a', 'а'], ['b', 'б'], ['v', 'в'], ['g', uk ? 'ґ' : 'г'], ['d', 'д'], ['e', 'е'], ['z', 'з'], ['i', uk ? 'і' : 'и'], ['y', 'й'], ['k', 'к'],
    ['l', 'л'], ['m', 'м'], ['n', 'н'], ['o', 'о'], ['p', 'п'], ['r', 'р'], ['s', 'с'], ['t', 'т'], ['u', 'у'], ['f', 'ф'],
    ['h', uk ? 'г' : 'х'], ['q', 'к'], ['w', 'в'], ['j', 'дж'], ['c', 'к']];
  let o = '';
  for (let i = 0; i < x.length;) { const h = P.find(q => x.substr(i, q[0].length) === q[0]); if (h) { o += h[1]; i += h[0].length; } else { o += x[i]; i++; } }
  return o;
}
// Cyrillic reading for the current edition ('' in the English edition).
const CY = x => ED === 'en' ? '' : ED === 'uk' ? toCyr(x.tr, true) : (x.cy || toCyr(x.tr, false));
const CYN = l => ED === 'en' ? '' : ED === 'uk' ? toCyr(l.name, true) : l.cy;
const EN = x => esc(x.en != null ? x.en : toEn(x.tr));
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const letter = id => D.letters.find(l => l.id === id);
const ZWJ = '‍';
function form(ch, pos, joins) {
  if (pos === 'initial') return joins ? ch + ZWJ : ch;
  if (pos === 'medial') return joins ? ZWJ + ch + ZWJ : ZWJ + ch;
  if (pos === 'final') return ZWJ + ch;
  return ch;
}
function rng(seed) { let x = seed; return () => (x = (x * 1103515245 + 12345) % 2147483648) / 2147483648; }
function shuffled(a, seed) { const r = rng(seed); a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
// reading line: Latin, then Cyrillic (ru/uk), then EN
const READ = x => `${esc(x.tr)}<br><small>${CY(x) ? esc(CY(x)) + ' · ' : ''}EN: ${EN(x)}</small>`;

function preface() {
  if (ED === 'en') return `<section class="page"><h2>Preface</h2>
<p>This book follows the online Turoyo (Surayt) course on the Madrashta website. The material is divided into the six levels of the Common European Framework of Reference for Languages (CEFR): from A1, where you learn the alphabet, to C2, where you read about literature in Turoyo.</p>
<p>All Syriac text in this book is set in the western <b>Serto</b> script, the traditional script of Turoyo. Readings are given in two ways: in the common Turoyo Latin spelling (š, ṯ, ḥ, ṭ, ṣ, ʿ, x) and in plain English letters (EN). This is the English edition; Russian and Ukrainian editions with Cyrillic readings are published separately.</p>
<p>Each lesson is followed by exercises; the answers are at the end of the book together with a dictionary of all the words in the course. Interactive exercises, tests and certificates are available on the website in the Courses section.</p>
<p class="colophon">Course author: Michael Baddu. The course materials are a work in progress and are being reviewed by native-speaking teachers. The Noto Sans Syriac fonts are licensed under the SIL Open Font License 1.1.</p>
</section>`;
  if (ED === 'uk') return `<section class="page"><h2>Передмова</h2>
<p>Ця книжка повторює онлайн-курс мови туройо (сурайт) із сайту Madrashta. Матеріал поділено за шістьма рівнями Загальноєвропейських рекомендацій з мовної освіти (CEFR): від A1, де ви вчите абетку, до C2, де читаєте про літературу туройо.</p>
<p>Увесь сирійський текст у книжці набрано західним письмом <b>серто</b>, традиційним письмом туройо. Читання подано трьома способами: поширеною латиницею туройо (š, ṯ, ḥ, ṭ, ṣ, ʿ, x), українською кирилицею та простою англійською латиницею (EN). Це українське видання книжки.</p>
<p>Після кожного уроку є вправи, відповіді до них зібрано в кінці книжки разом зі словником усіх слів курсу. Інтерактивні вправи, тести й сертифікати доступні на сайті в розділі «Курси».</p>
<p class="colophon">Автор курсу: Michael Baddu. Матеріали курсу в розробці й перевіряються викладачами — носіями мови. Шрифти Noto Sans Syriac поширюються за ліцензією SIL Open Font License 1.1.</p>
</section>`;
  return `<section class="page"><h2>Предисловие</h2>
<p>Эта книга повторяет онлайн-курс языка туройо (сурайт) с сайта Madrashta. Материал разбит по шести уровням Общеевропейской шкалы языковых компетенций (CEFR): от A1, где вы учите алфавит, до C2, где читаете о литературе на туройо.</p>
<p>Весь сирийский текст в книге набран западным письмом <b>серто</b>, традиционным письмом туройо. Чтение дано тремя способами: распространённой латиницей туройо (š, ṯ, ḥ, ṭ, ṣ, ʿ, x), кириллицей и простой английской латиницей (EN). Это русское издание книги.</p>
<p>После каждого урока есть упражнения, ответы к ним собраны в конце книги вместе со словарём всех слов курса. Интерактивные упражнения, тесты и сертификаты доступны на сайте в разделе «Курсы».</p>
<p class="colophon">Автор курса: Michael Baddu. Материалы курса находятся в разработке и проверяются преподавателями-носителями языка. Шрифты Noto Sans Syriac распространяются по лицензии SIL Open Font License 1.1.</p>
</section>`;
}

function build() {
  const sy = (t, cls) => `<span class="syr${cls ? ' ' + cls : ''}" lang="syr" dir="rtl">${esc(t)}</span>`;
  const answers = [];
  let exNo = 0;
  const toc = [];
  let body = '';
  D.levels.forEach((lv, li) => {
    const lid = 'lv-' + lv.id;
    toc.push({ id: lid, t: `${lv.code} · ${L(lv.title)}`, lvl: 1 });
    body += `<section class="level" id="${lid}"><p class="lv-code">${lv.code}</p><h1>${esc(L(lv.title))}</h1>
      <p class="lv-cefr">CEFR ${lv.code} · ${esc(L(lv.cefr))}</p><p class="lv-sum">${esc(L(lv.summary))}</p>
      <p class="lv-can">${T3('Цель уровня', 'Мета рівня', 'Level goal')}: «${esc(L(lv.can))}»</p></section>`;
    let n = 0;
    lv.units.forEach((u, ui) => {
      if (u.kind === 'test') return;
      n++;
      const uid = `${lid}-${u.id}`;
      toc.push({ id: uid, t: `${T3('Урок', 'Урок', 'Lesson')} ${lv.code}.${n}. ${L(u.title)}`, lvl: 2 });
      body += `<section class="unit" id="${uid}"><h2><span class="u-num">${lv.code}.${n}</span> ${esc(L(u.title))}</h2>`;
      if (u.intro) body += `<p class="intro">${esc(L(u.intro)).replace(/([܀-ݏ][܀-ݏ ]*[܀-ݏ]|[܀-ݏ])/g, m => sy(m, 'inl'))}</p>`;
      const exs = [];
      if (u.kind === 'letters' || u.kind === 'numbers') {
        body += `<table class="tbl letters"><thead><tr><th>${T3('Буква', 'Літера', 'Letter')}</th><th>${T3('Название', 'Назва', 'Name')}</th><th>${T3('Звук', 'Звук', 'Sound')}</th>` + (u.kind === 'numbers' ? `<th>${T3('Число', 'Число', 'Number')}</th>` : '') + '</tr></thead><tbody>';
        u.letters.map(letter).forEach(l => {
          body += `<tr><td class="big">${sy(l.ch)}</td><td>${esc(l.name)}${CYN(l) ? '<br><small>' + esc(CYN(l)) + '</small>' : ''}</td><td><small>[${esc(L(l.tr))}]${EN(l).trim() ? ' EN: ' + EN(l) + '.' : ''} ${esc(L(l.sound))}</small></td>${u.kind === 'numbers' ? '<td>' + l.num + '</td>' : ''}</tr>`;
        });
        body += '</tbody></table>';
        const ls = shuffled(u.letters.map(letter), li * 100 + ui);
        exs.push({ q: u.kind === 'numbers' ? T3('Напишите, какое число обозначает каждая буква.', 'Напишіть, яке число позначає кожна літера.', 'Write the number each letter stands for.') : T3('Назовите буквы.', 'Назвіть літери.', 'Name the letters.'), items: ls.map(l => sy(l.ch, 'ex')), ans: ls.map(l => u.kind === 'numbers' ? l.num : l.name).join(', ') });
        exs.push({ q: T3('Перепишите каждую букву пять раз в тетради, проговаривая её название.', 'Перепишіть кожну літеру п\'ять разів у зошит, промовляючи її назву.', 'Copy each letter five times in your notebook, saying its name aloud.'), items: [], ans: '—' });
      } else if (u.kind === 'joining') {
        body += `<table class="tbl"><thead><tr><th></th><th>${T3('отдельная', 'окрема', 'isolated')}</th><th>${T3('начальная', 'початкова', 'initial')}</th><th>${T3('срединная', 'серединна', 'medial')}</th><th>${T3('конечная', 'кінцева', 'final')}</th></tr></thead><tbody>`;
        u.letters.map(letter).forEach(l => {
          body += `<tr><th>${esc(l.name)}${l.join ? '' : ' *'}</th>` + ['isolated', 'initial', 'medial', 'final'].map(p => `<td class="big">${sy(form(l.ch, p, l.join))}</td>`).join('') + '</tr>';
        });
        body += '</tbody></table><p class="note">* ' + T3('не соединяется со следующей буквой.', 'не з\'єднується з наступною літерою.', 'does not join the next letter.') + '</p>';
        const ls = shuffled(u.letters.map(letter), 7);
        exs.push({ q: T3('Соединяется ли буква со следующей? Ответьте «да» или «нет».', 'Чи з\'єднується літера з наступною? Дайте відповідь «так» або «ні».', 'Does the letter join the next one? Answer "yes" or "no".'), items: ls.map(l => sy(l.ch, 'ex')), ans: ls.map(l => l.name + ': ' + (l.join ? T3('да', 'так', 'yes') : T3('нет', 'ні', 'no'))).join('; ') });
      } else if (u.kind === 'vowels') {
        body += `<table class="tbl"><thead><tr><th>${T3('Слог', 'Склад', 'Syllable')}</th><th>${T3('Огласовка', 'Огласовка', 'Vowel sign')}</th><th>${T3('Чтение', 'Читання', 'Reading')}</th><th>${T3('Как выглядит', 'Як виглядає', 'What it looks like')}</th></tr></thead><tbody>`;
        D.vowels.forEach(v => { body += `<tr><td class="big">${sy(v.syl)}</td><td>${esc(L(v.name))}</td><td>${READ(v)}</td><td><small>${esc(L(v.note))}</small></td></tr>`; });
        body += '</tbody></table>';
        const vs = shuffled(D.vowels, 11);
        exs.push({ q: T3('Прочитайте слоги.', 'Прочитайте склади.', 'Read the syllables.'), items: vs.map(v => sy(v.syl, 'ex')), ans: vs.map(v => v.tr).join(', ') });
      } else if (u.kind === 'words') {
        const ws = D.words[u.words];
        body += `<table class="tbl words"><thead><tr><th>${T3('Слово', 'Слово', 'Word')}</th><th>${T3('Чтение', 'Читання', 'Reading')}</th><th>${T3('Перевод', 'Переклад', 'Meaning')}</th></tr></thead><tbody>`;
        ws.forEach(x => { body += `<tr><td class="big">${sy(x.syr)}</td><td>${READ(x)}</td><td>${esc(L(x.ru))}</td></tr>`; });
        body += '</tbody></table>';
        if (u.phrases && D.phrases[u.phrases]) {
          body += '<h3>' + T3('Фразы для чтения', 'Фрази для читання', 'Phrases to read') + '</h3><table class="tbl words"><tbody>';
          D.phrases[u.phrases].forEach(p => { body += `<tr><td class="big">${sy(p.syr)}</td><td>${READ(p)}</td><td>${esc(L(p.ru))}</td></tr>`; });
          body += '</tbody></table>';
        }
        const a = shuffled(ws, li * 31 + ui).slice(0, 6);
        exs.push({ q: T3('Прочитайте и переведите.', 'Прочитайте й перекладіть.', 'Read and translate.'), items: a.map(x => sy(x.syr, 'ex')), ans: a.map(x => x.tr + ' — ' + L(x.ru)).join('; ') });
        const b = shuffled(ws, li * 37 + ui + 3).slice(0, 5);
        exs.push({ q: T3('Напишите сирийскими буквами.', 'Напишіть сирійськими літерами.', 'Write in Syriac letters.'), items: b.map(x => esc(L(x.ru))), ans: b.map(x => sy(x.syr)).join(', ') });
        const c = shuffled(ws, li * 41 + ui + 5).slice(0, 5); const cr = shuffled(c, 99);
        exs.push({ q: T3('Соедините слово и перевод.', 'З\'єднайте слово й переклад.', 'Match each word with its meaning.'), match: { left: c.map(x => sy(x.syr, 'ex')), right: cr.map(x => esc(L(x.ru))) }, ans: c.map((x, i) => (i + 1) + '–' + String.fromCharCode(97 + cr.indexOf(x))).join(', ') });
      } else if (u.kind === 'sentences' || u.kind === 'reading') {
        if (u.table) body += '<table class="tbl grammar"><tbody>' + u.table.map(r => `<tr><th>${esc(L(r[0]))}</th><td>${esc(L(r[1]))}</td></tr>`).join('') + '</tbody></table>';
        const lines = u.kind === 'sentences' ? u.sentences : u.text;
        body += `<h3>${u.kind === 'sentences' ? T3('Примеры', 'Приклади', 'Examples') : T3('Текст', 'Текст', 'Text')}</h3>`;
        if (u.kind === 'reading') body += '<div class="text">' + lines.map(l => sy(l.syr, 'tline')).join('') + '</div><h3>' + T3('Чтение и перевод', 'Читання й переклад', 'Reading and translation') + '</h3>';
        body += '<table class="tbl words"><tbody>';
        lines.forEach(l => { body += `<tr><td class="big">${sy(l.syr)}</td><td>${READ(l)}</td><td>${esc(L(l.ru))}</td></tr>`; });
        body += '</tbody></table>';
        if (u.kind === 'sentences') {
          const a = shuffled(lines, ui + 5).slice(0, 4);
          exs.push({ q: T3('Переведите на русский.', 'Перекладіть українською.', 'Translate into English.'), items: a.map(x => sy(x.syr, 'ex')), ans: a.map(x => L(x.ru)).join(' / ') });
          const b = shuffled(lines, ui + 9).slice(0, 3);
          exs.push({ q: T3('Расставьте слова по порядку и запишите предложение.', 'Розставте слова в правильному порядку й запишіть речення.', 'Put the words in order and write the sentence.'), items: b.map(x => shuffled(x.syr.split(' '), ui + 3).map(t => sy(t, 'ex')).join(' · ')), ans: b.map(x => sy(x.syr)).join(' / ') });
        } else {
          exs.push({ q: T3('Ответьте на вопросы к тексту.', 'Дайте відповіді на запитання до тексту.', 'Answer the questions about the text.'), items: u.questions.map(q => esc(L(q.q)) + '<br><small>' + shuffled(q.options, 3).map(o => esc(L(o))).join(' / ') + '</small>'), ans: u.questions.map(q => L(q.options[0])).join('; ') });
        }
      }
      if (exs.length) {
        body += '<h3>' + T3('Упражнения', 'Вправи', 'Exercises') + '</h3>';
        exs.forEach(e => {
          exNo++;
          body += `<div class="ex"><p class="ex-q"><b>${exNo}.</b> ${e.q}</p>`;
          if (e.items && e.items.length) body += '<ol class="ex-items">' + e.items.map(i => `<li>${i}</li>`).join('') + '</ol>';
          if (e.match) body += '<div class="match"><ol>' + e.match.left.map(i => `<li>${i}</li>`).join('') + '</ol><ol type="a">' + e.match.right.map(i => `<li>${i}</li>`).join('') + '</ol></div>';
          body += '</div>';
          answers.push(`<li value="${exNo}"><small>${lv.code}.${n}</small> ${e.ans}</li>`);
        });
      }
      body += '</section>';
    });
  });
  const tAns = T3('Ответы к упражнениям', 'Відповіді до вправ', 'Answers to the exercises');
  const tDict = T3('Словарь', 'Словник', 'Dictionary');
  toc.push({ id: 'answers', t: tAns, lvl: 1 });
  toc.push({ id: 'dict', t: tDict, lvl: 1 });

  const all = [];
  Object.values(D.words).forEach(list => list.forEach(x => { if (!all.find(y => y.syr === x.syr && y.tr === x.tr)) all.push(x); }));
  all.sort((a, b) => L(a.ru).localeCompare(L(b.ru), ED));
  const dict = '<table class="tbl words dict"><tbody>' + all.map(x => `<tr><td>${esc(L(x.ru))}</td><td class="big">${sy(x.syr)}</td><td>${READ(x)}</td></tr>`).join('') + '</tbody></table>';

  const F = 'file://' + REPO + '/fonts/';
  const intro = fs.readFileSync(path.join(HERE, INTRO[ED]), 'utf8');
  return `<!doctype html><html lang="${ED}"><head><meta charset="utf-8"><title>${T3('Туройо', 'Туройо', 'Turoyo')} A1–C2 · ${T3('Серто', 'Серто', 'Serto')}</title><style>
@font-face{font-family:Inter;src:url(${F}inter-latin-400-normal.woff2);font-weight:400}
@font-face{font-family:Inter;src:url(${F}inter-latin-ext-400-normal.woff2);font-weight:400;unicode-range:U+0100-02BA,U+02BD-02C5,U+0300-036F,U+1E00-1EFF}
@font-face{font-family:Inter;src:url(${F}inter-cyrillic-400-normal.woff2);font-weight:400;unicode-range:U+0400-045F}
@font-face{font-family:Inter;src:url(${F}inter-cyrillic-ext-400-normal.woff2);font-weight:400;unicode-range:U+0460-052F}
@font-face{font-family:Inter;src:url(${F}inter-latin-700-normal.woff2);font-weight:700}
@font-face{font-family:Inter;src:url(${F}inter-latin-ext-700-normal.woff2);font-weight:700;unicode-range:U+0100-02BA,U+02BD-02C5,U+0300-036F,U+1E00-1EFF}
@font-face{font-family:Inter;src:url(${F}inter-cyrillic-700-normal.woff2);font-weight:700;unicode-range:U+0400-045F}
@font-face{font-family:Inter;src:url(${F}inter-cyrillic-ext-700-normal.woff2);font-weight:700;unicode-range:U+0460-052F}
@font-face{font-family:NArab;src:url(${F}noto-sans-arabic-arabic-400-normal.woff2)}
@font-face{font-family:NSyrWest;src:url(${F}noto-sans-syriac-western-syriac-400-normal.woff2)}
@page{size:A4;margin:18mm 16mm 18mm 16mm}
body{font-family:Inter,NArab,sans-serif;font-size:10.5pt;line-height:1.5;color:#0a1640;margin:0}
.syr{font-family:NSyrWest;font-size:1.35em;line-height:1.5}
.big .syr{font-size:20pt}.syr.inl{font-size:1.25em}.syr.ex{font-size:18pt}
h1{font-size:30pt;margin:0 0 8pt;color:#0f1f5c}h2{font-size:15pt;margin:0 0 6pt;color:#15308f;border-bottom:1.5pt solid #1F8A5B;padding-bottom:3pt}h3{font-size:11.5pt;margin:12pt 0 4pt;color:#0f1f5c}
.page{page-break-after:always}
.toc ol{list-style:none;padding:0;margin:0}.toc li{display:flex;gap:6pt;padding:1.5pt 0}.toc li.l1{font-weight:700;margin-top:6pt}.toc li.l2{padding-left:14pt}
.toc a{color:inherit;text-decoration:none;flex:1}
.level{page-break-before:always;padding-top:60mm;text-align:center}.lv-code{font-size:60pt;font-weight:700;color:#1F8A5B;margin:0}.lv-cefr{color:#1F8A5B;font-weight:700}.lv-sum,.lv-can{max-width:130mm;margin:6pt auto;color:#4a5a8a}.lv-can{font-style:italic}
.unit{page-break-before:always}.u-num{color:#1F8A5B}
.intro{background:#f0f8f4;border-left:3pt solid #1F8A5B;padding:6pt 10pt;border-radius:4pt}
.tbl{width:100%;border-collapse:collapse;margin:6pt 0}.tbl th,.tbl td{border-bottom:.6pt solid #dbe3fb;padding:3pt 6pt;text-align:left;vertical-align:middle}.tbl thead th{font-size:8.5pt;color:#4a5a8a}
.tbl td.big{text-align:right;white-space:nowrap}.letters td:first-child{text-align:center;width:22mm}
tr{page-break-inside:avoid}.note{font-size:8.5pt;color:#4a5a8a}
.text{direction:rtl;text-align:right;background:#fff8f0;border:1pt solid #f2d9b5;border-radius:6pt;padding:8pt 12pt;line-height:2.2}.tline{margin-left:8pt}
.ex{page-break-inside:avoid;margin:8pt 0}.ex-q{margin:0 0 3pt}.ex-items{columns:2;margin:0;padding-left:20pt}.ex-items li{padding:2pt 0}
.match{display:flex;gap:30pt}.match ol{margin:0}
.answers li{margin:3pt 0}.dict td{padding:1pt 6pt}.dict .syr{font-size:15pt}
.colophon{font-size:9pt;color:#4a5a8a}
</style></head><body>
${preface()}
${intro}
<section class="page toc"><h2>${T3('Содержание', 'Зміст', 'Contents')}</h2><ol>${toc.map(t => `<li class="l${t.lvl}"><a href="#${t.id}">${esc(t.t)}</a></li>`).join('')}</ol></section>
${body}
<section class="unit" id="answers"><h2>${tAns}</h2><ol class="answers">${answers.join('')}</ol></section>
<section class="unit" id="dict"><h2>${tDict}</h2>${dict}</section>
</body></html>`;
}

(async () => {
  const eds = (process.env.EDS || 'en,ru,uk').split(',');
  const b = await chromium.launch();
  for (const ed of eds) {
    ED = ed;
    const html = build();
    if (ed === 'en' && /[Ѐ-ӿ]/.test(html.replace(/<style>[\s\S]*?<\/style>/, ''))) {
      const m = html.match(/.{0,60}[Ѐ-ӿ].{0,60}/);
      throw new Error('Cyrillic left in the English edition: ' + m[0]);
    }
    const f = path.join(OUT, `turoyo-body-${ed}.html`);
    fs.writeFileSync(f, html);
    const p = await b.newPage();
    await p.goto('file://' + f, { waitUntil: 'load' });
    await p.evaluate(() => document.fonts.ready);
    const pdf = path.join(OUT, `turoyo-body-${ed}.pdf`);
    await p.pdf({ path: pdf, format: 'A4', printBackground: true, displayHeaderFooter: true,
      headerTemplate: '<div></div>',
      footerTemplate: `<div style="font-size:8px;width:100%;text-align:center;color:#4a5a8a;font-family:sans-serif">${T3('Туройо', 'Туройо', 'Turoyo')} A1–C2 · ${T3('Серто', 'Серто', 'Serto')} · Michael Baddu · <span class="pageNumber"></span></div>`,
      margin: { top: '16mm', bottom: '18mm', left: '16mm', right: '16mm' } });
    await p.close();
    console.log(pdf);
  }
  await b.close();
})().catch(e => { console.error(e.message); process.exit(1); });
