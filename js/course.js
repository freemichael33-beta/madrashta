'use strict';

/*
  Interactive course engine. Runs entirely in the browser (static hosting,
  strict CSP: no inline scripts or styles). Progress is kept in localStorage
  and can be exported/imported as a JSON file.
*/
(function () {
  var D = window.COURSE_DATA;
  var root = document.getElementById('course-app');
  if (!D || !root) return;

  var STORE_KEY = 'madrashta-course-v1';
  var PASS = 0.7;
  var SCRIPT_IDS = D.scripts.map(function (s) { return s.id; });

  var T = {
    start: 'Начать', cont: 'Продолжить', check: 'Проверить', next: 'Дальше', retry: 'Пройти ещё раз',
    back: 'Все уроки', correct: 'Верно!', wrong: 'Не совсем.', answer: 'Правильный ответ:',
    lessonDone: 'Урок пройден', lessonFail: 'Урок не засчитан', score: 'Результат',
    needed: 'Чтобы засчитать урок, нужно не меньше 70%.', nextLesson: 'Следующий урок',
    whichLetter: 'Какая это буква?', findLetter: 'Найдите букву', sameIn: 'Та же буква в письме',
    soundOf: 'Как читается эта буква?', meaning: 'Что значит это слово?', chooseWord: 'Выберите слово',
    typeReading: 'Напишите, как это читается (латиницей или кириллицей)', build: 'Соберите слово из букв',
    match: 'Соедините пары', joins: 'Соединяется ли эта буква со следующей буквой слова?',
    yes: 'Да', no: 'Нет', formOf: 'Какая буква спрятана в этой форме?', syllable: 'Как читается слог?',
    findSyllable: 'Найдите слог', numberOf: 'Какое число обозначает эта буква?', letterFor: 'Какая буква обозначает число',
    placeholder: 'Ваш ответ', erase: 'Стереть', clear: 'Очистить', theory: 'Теория', exercises: 'Упражнений',
    done: 'Пройдено', notStarted: 'Не начат', best: 'лучший результат', soon: 'Скоро', open: 'Открыт',
    certTitle: 'Сертификат уровня A1', certName: 'Ваше имя для сертификата', certMake: 'Получить сертификат',
    print: 'Распечатать', exportP: 'Сохранить прогресс в файл', importP: 'Загрузить прогресс из файла',
    reset: 'Сбросить прогресс', resetQ: 'Нажмите ещё раз, чтобы удалить весь прогресс', imported: 'Прогресс загружен.',
    importErr: 'Не удалось прочитать файл.', of: 'из', script: 'Письменность', planned: 'Что будет на уровне',
    forms: ['отдельная', 'начальная', 'срединная', 'конечная'], noJoin: 'не соединяется слева',
    initial: 'начальная', medial: 'срединная', final: 'конечная', isolated: 'отдельная', testIntro: 'Тест',
    reading: 'Чтение', phrases: 'Фразы для чтения'
  };

  // ---------- State --------------------------------------------------------
  function loadState() {
    var s = null;
    try { s = JSON.parse(window.localStorage.getItem(STORE_KEY)); } catch (e) { s = null; }
    if (!s || typeof s !== 'object') s = {};
    if (SCRIPT_IDS.indexOf(s.script) === -1) s.script = 'madnhaya';
    if (!s.done || typeof s.done !== 'object') s.done = {};
    if (typeof s.xp !== 'number') s.xp = 0;
    return s;
  }
  var state = loadState();
  function save() {
    try { window.localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* private mode */ }
  }

  // ---------- Helpers ------------------------------------------------------
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined && text !== null) n.textContent = text;
    return n;
  }
  function syr(text, script, extra) {
    var n = el('span', 'syr s-' + (script || state.script) + (extra ? ' ' + extra : ''), text);
    n.setAttribute('lang', 'syr');
    n.setAttribute('dir', 'rtl');
    return n;
  }
  function btn(label, cls, onClick) {
    var b = el('button', 'btn ' + (cls || 'btn-blue'), label);
    b.type = 'button';
    if (onClick) b.addEventListener('click', onClick);
    return b;
  }
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function sample(a, n) { return shuffle(a).slice(0, n); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function letterById(id) { for (var i = 0; i < D.letters.length; i++) if (D.letters[i].id === id) return D.letters[i]; return null; }
  function scriptName(id) { for (var i = 0; i < D.scripts.length; i++) if (D.scripts[i].id === id) return D.scripts[i].name; return id; }
  function otherScript(s) { return pick(SCRIPT_IDS.filter(function (x) { return x !== s; })); }
  function normalize(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/ё/g, 'е').replace(/[ʾʿ'’`ʼ\-.,!?:;]/g, '').replace(/\s+/g, ' ').trim();
  }
  function lessonKey(level, unit) { return level.id + '-' + unit.id; }
  function findLevel(id) { for (var i = 0; i < D.levels.length; i++) if (D.levels[i].id === id) return D.levels[i]; return null; }
  function findUnit(level, id) { for (var i = 0; i < level.units.length; i++) if (level.units[i].id === id) return level.units[i]; return null; }
  // Positional forms through zero-width joiners (rendered by the font's shaping).
  var ZWJ = '‍';
  function form(ch, pos, joins) {
    if (pos === 'initial') return joins ? ch + ZWJ : ch;
    if (pos === 'medial') return joins ? ZWJ + ch + ZWJ : ZWJ + ch;
    if (pos === 'final') return ZWJ + ch;
    return ch;
  }
  function wordList(unit) { return D.words[unit.words] || []; }
  function letterOptions(correct, pool, n) {
    var others = pool.filter(function (l) { return l.id !== correct.id; });
    if (others.length < n - 1) others = others.concat(D.letters.filter(function (l) { return l.id !== correct.id && pool.indexOf(l) === -1; }));
    return shuffle([correct].concat(sample(others, n - 1)));
  }
  function wordOptions(correct, pool, n) {
    var others = pool.filter(function (x) { return x.id !== correct.id; });
    return shuffle([correct].concat(sample(others, n - 1)));
  }

  // ---------- Exercise generators -----------------------------------------
  // Every exercise: { type, prompt, show (node factory), options/accept/..., answerText }
  function choiceEx(prompt, showFn, options, correctIndex, answerText) {
    return { type: 'choice', prompt: prompt, show: showFn, options: options, answer: correctIndex, answerText: answerText };
  }
  function optText(t) { return { text: t }; }
  function optSyr(t, s) { return { syr: t, script: s }; }

  function letterExercises(unit) {
    var pool = unit.letters.map(letterById);
    var out = [];
    pool.forEach(function (l, i) {
      var s = SCRIPT_IDS[i % 3];
      var opts = letterOptions(l, pool, 4);
      out.push(choiceEx(T.whichLetter, function () { return syr(l.ch, s, 'big'); },
        opts.map(function (o) { return optText(o.name + ' (' + o.cy + ')'); }), opts.indexOf(l), l.name));
    });
    pool.forEach(function (l, i) {
      var s = SCRIPT_IDS[(i + 1) % 3];
      var opts = letterOptions(l, pool, 4);
      out.push(choiceEx(T.findLetter + ' «' + l.name + '» (' + scriptName(s) + ')', null,
        opts.map(function (o) { return optSyr(o.ch, s); }), opts.indexOf(l), l.name));
    });
    sample(pool, Math.min(4, pool.length)).forEach(function (l) {
      var from = pick(SCRIPT_IDS), to = otherScript(from);
      var opts = letterOptions(l, pool, 4);
      out.push(choiceEx(T.sameIn + ' ' + scriptName(to), function () { return syr(l.ch, from, 'big'); },
        opts.map(function (o) { return optSyr(o.ch, to); }), opts.indexOf(l), l.name));
    });
    sample(pool, Math.min(3, pool.length)).forEach(function (l) {
      var opts = letterOptions(l, pool, 4);
      out.push(choiceEx(T.soundOf, function () { return syr(l.ch, pick(SCRIPT_IDS), 'big'); },
        opts.map(function (o) { return optText(o.tr); }), opts.indexOf(l), l.tr));
    });
    var pairs = sample(pool, Math.min(4, pool.length));
    var a = pick(SCRIPT_IDS), b = otherScript(a);
    out.push({ type: 'match', prompt: T.match + ': ' + scriptName(a) + ' ↔ ' + scriptName(b),
      pairs: pairs.map(function (l) { return { key: l.id, left: optSyr(l.ch, a), right: optSyr(l.ch, b) }; }) });
    return shuffle(out);
  }

  function joiningExercises(unit) {
    var pool = unit.letters.map(letterById);
    var out = [];
    pool.forEach(function (l) {
      out.push(choiceEx(T.joins, function () { return syr(l.ch, pick(SCRIPT_IDS), 'big'); },
        [optText(T.yes), optText(T.no)], l.join ? 0 : 1, l.join ? T.yes : T.no));
    });
    var joiners = pool.filter(function (l) { return l.join; });
    sample(joiners, 5).forEach(function (l) {
      var pos = pick(['initial', 'medial', 'final']);
      var s = pick(SCRIPT_IDS);
      var opts = letterOptions(l, joiners, 4);
      out.push(choiceEx(T.formOf + ' (' + T[pos] + ', ' + scriptName(s) + ')', function () { return syr(form(l.ch, pos, true), s, 'big'); },
        opts.map(function (o) { return optSyr(o.ch, s); }), opts.indexOf(l), l.name));
    });
    return shuffle(out);
  }

  function vowelExercises() {
    var out = [];
    D.vowels.forEach(function (v) {
      var opts = sample(D.vowels.filter(function (x) { return x.id !== v.id; }), 3).concat([v]);
      opts = shuffle(opts);
      out.push(choiceEx(T.syllable, function () { return syr(v.syl, 'madnhaya', 'big'); },
        opts.map(function (o) { return optText(o.tr + ' · ' + o.cy); }), opts.indexOf(v), v.tr));
    });
    sample(D.vowels, 4).forEach(function (v) {
      var opts = shuffle(sample(D.vowels.filter(function (x) { return x.id !== v.id; }), 3).concat([v]));
      out.push(choiceEx(T.findSyllable + ' «' + v.cy + '» (' + v.tr + ')', null,
        opts.map(function (o) { return optSyr(o.syl, 'madnhaya'); }), opts.indexOf(v), v.tr));
    });
    return shuffle(out);
  }

  function numberExercises(unit) {
    var pool = unit.letters.map(letterById);
    var out = [];
    pool.forEach(function (l, i) {
      var opts = letterOptions(l, pool, 4);
      out.push(choiceEx(T.numberOf, function () { return syr(l.ch, SCRIPT_IDS[i % 3], 'big'); },
        opts.map(function (o) { return optText(String(o.num)); }), opts.indexOf(l), String(l.num)));
    });
    sample(pool, 4).forEach(function (l) {
      var s = pick(SCRIPT_IDS);
      var opts = letterOptions(l, pool, 4);
      out.push(choiceEx(T.letterFor + ' ' + l.num + '?', null,
        opts.map(function (o) { return optSyr(o.ch, s); }), opts.indexOf(l), l.name));
    });
    return shuffle(out);
  }

  function wordExercises(unit) {
    var pool = wordList(unit);
    var out = [];
    pool.forEach(function (wd, i) {
      var s = SCRIPT_IDS[i % 3];
      var opts = wordOptions(wd, pool, 4);
      out.push(choiceEx(T.meaning, function () { return syr(wd.syr, s, 'big'); },
        opts.map(function (o) { return optText(o.ru); }), opts.indexOf(wd), wd.ru));
    });
    sample(pool, 4).forEach(function (wd) {
      var opts = wordOptions(wd, pool, 4);
      out.push(choiceEx(T.chooseWord + ': «' + wd.ru + '»', null,
        opts.map(function (o) { return optSyr(o.syr, state.script); }), opts.indexOf(wd), wd.tr));
    });
    sample(pool, 3).forEach(function (wd) {
      out.push({ type: 'type', prompt: T.typeReading, show: function () { return syr(wd.syr, pick(SCRIPT_IDS), 'big'); },
        hint: wd.ru, accept: [wd.tr, wd.cy].concat(wd.alt), answerText: wd.tr + ' · ' + wd.cy });
    });
    sample(pool.filter(function (x) { return x.syr.indexOf(' ') === -1 && x.syr.length <= 6; }), 2).forEach(function (wd) {
      out.push(buildEx(wd));
    });
    var pairs = sample(pool, 4);
    out.push({ type: 'match', prompt: T.match, pairs: pairs.map(function (x) { return { key: x.id, left: optSyr(x.syr, state.script), right: optText(x.ru) }; }) });
    return shuffle(out);
  }

  function buildEx(wd) {
    var chars = Array.from(wd.syr);
    var extra = sample(D.letters.map(function (l) { return l.ch; }).filter(function (c) { return chars.indexOf(c) === -1; }), 2);
    return { type: 'build', prompt: T.build + ': «' + wd.ru + '» (' + wd.cy + ')', target: wd.syr, tiles: shuffle(chars.concat(extra)), answerText: wd.syr, answerSyr: true };
  }

  function testExercises(level) {
    var all = [];
    level.units.forEach(function (u) {
      if (u.kind === 'test') return;
      var gen = generatorFor(u);
      all = all.concat(gen(u).filter(function (e) { return e.type !== 'match'; }).slice(0, 3));
    });
    return sample(all, 20);
  }

  function generatorFor(unit) {
    return { letters: letterExercises, joining: joiningExercises, vowels: vowelExercises, numbers: numberExercises, words: wordExercises }[unit.kind];
  }

  // ---------- Theory blocks -----------------------------------------------
  function theory(unit) {
    var box = el('div', 'cx-theory');
    if (unit.intro) box.appendChild(el('p', 'cx-intro', unit.intro));
    if (unit.kind === 'letters' || unit.kind === 'numbers') {
      var grid = el('div', 'cx-letter-grid');
      unit.letters.map(letterById).forEach(function (l) {
        var c = el('div', 'cx-letter-card');
        var row = el('div', 'cx-letter-row');
        SCRIPT_IDS.forEach(function (s) {
          var cell = el('div', 'cx-letter-cell');
          cell.appendChild(syr(l.ch, s, 'glyph'));
          cell.appendChild(el('span', 'cx-cell-label', scriptName(s)));
          row.appendChild(cell);
        });
        c.appendChild(row);
        c.appendChild(el('strong', 'cx-letter-name', l.name + ' · ' + l.cy + (unit.kind === 'numbers' ? ' = ' + l.num : '')));
        c.appendChild(el('p', 'cx-letter-sound', '[' + l.tr + '] ' + l.sound));
        grid.appendChild(c);
      });
      box.appendChild(grid);
    } else if (unit.kind === 'joining') {
      var table = el('table', 'cx-forms');
      var thead = el('thead'), hr = el('tr');
      hr.appendChild(el('th', null, ''));
      T.forms.forEach(function (f) { hr.appendChild(el('th', null, f)); });
      thead.appendChild(hr); table.appendChild(thead);
      var tb = el('tbody');
      unit.letters.map(letterById).forEach(function (l) {
        var tr = el('tr');
        var th = el('th', null, l.name + (l.join ? '' : ' *'));
        tr.appendChild(th);
        ['isolated', 'initial', 'medial', 'final'].forEach(function (p) {
          var td = el('td');
          td.appendChild(syr(form(l.ch, p, l.join), state.script, 'glyph'));
          tr.appendChild(td);
        });
        tb.appendChild(tr);
      });
      table.appendChild(tb);
      var wrap = el('div', 'table-wrap'); wrap.appendChild(table);
      box.appendChild(wrap);
      box.appendChild(el('p', 'fine-print', '* ' + T.noJoin + '. ' + 'Таблица показана в выбранной письменности (' + scriptName(state.script) + '); переключите её сверху, чтобы сравнить.'));
    } else if (unit.kind === 'vowels') {
      var vg = el('div', 'cx-letter-grid');
      D.vowels.forEach(function (v) {
        var c = el('div', 'cx-letter-card');
        c.appendChild(syr(v.syl, 'madnhaya', 'glyph glyph-xl'));
        c.appendChild(el('strong', 'cx-letter-name', v.name + ' · ' + v.tr + ' · ' + v.cy));
        c.appendChild(el('p', 'cx-letter-sound', v.note));
        vg.appendChild(c);
      });
      box.appendChild(vg);
    } else if (unit.kind === 'words') {
      var list = el('div', 'cx-word-grid');
      wordList(unit).forEach(function (wd) {
        var c = el('div', 'cx-word-card');
        c.appendChild(syr(wd.syr, state.script, 'word'));
        c.appendChild(el('span', 'cx-word-tr', wd.tr + ' · ' + wd.cy));
        c.appendChild(el('span', 'cx-word-ru', wd.ru));
        list.appendChild(c);
      });
      box.appendChild(list);
      var ph = unit.phrases && D.phrases[unit.phrases];
      if (ph) {
        box.appendChild(el('h3', 'cx-subhead', T.phrases));
        var pl = el('ul', 'cx-phrases');
        ph.forEach(function (p) {
          var li = el('li');
          li.appendChild(syr(p.syr, state.script, 'word'));
          li.appendChild(el('span', 'cx-word-tr', p.tr));
          li.appendChild(el('span', 'cx-word-ru', p.ru));
          pl.appendChild(li);
        });
        box.appendChild(pl);
      }
    }
    return box;
  }

  // ---------- Script switcher ---------------------------------------------
  function scriptSwitcher(onChange) {
    var wrap = el('div', 'cx-scripts');
    wrap.setAttribute('role', 'radiogroup');
    wrap.setAttribute('aria-label', T.script);
    D.scripts.forEach(function (s) {
      var b = el('button', 'cx-script' + (state.script === s.id ? ' is-active' : ''));
      b.type = 'button';
      b.setAttribute('role', 'radio');
      b.setAttribute('aria-checked', state.script === s.id ? 'true' : 'false');
      b.title = s.note;
      b.appendChild(syr('ܐܒܓ', s.id, 'cx-script-sample'));
      b.appendChild(el('span', 'cx-script-name', s.name));
      b.addEventListener('click', function () {
        state.script = s.id; save();
        if (onChange) onChange();
      });
      wrap.appendChild(b);
    });
    return wrap;
  }

  // ---------- Overview ----------------------------------------------------
  function levelProgress(level) {
    if (!level.units) return { done: 0, total: 0 };
    var done = 0;
    level.units.forEach(function (u) { var r = state.done[lessonKey(level, u)]; if (r && r.passed) done++; });
    return { done: done, total: level.units.length };
  }

  function renderOverview() {
    root.textContent = '';
    var head = el('div', 'cx-toolbar');
    head.appendChild(el('span', 'cx-toolbar-label', T.script + ':'));
    head.appendChild(scriptSwitcher(renderOverview));
    root.appendChild(head);

    var levelsNav = el('ol', 'cx-levels');
    D.levels.forEach(function (lv) {
      var li = el('li', 'cx-level' + (lv.status === 'open' ? ' is-open' : ''));
      var top = el('div', 'cx-level-top');
      top.appendChild(el('span', 'cx-level-code', lv.code));
      var tt = el('div', 'cx-level-titles');
      tt.appendChild(el('strong', null, lv.title));
      tt.appendChild(el('span', 'cx-level-cam', 'CEFR ' + lv.code + ' · ' + lv.cefr));
      top.appendChild(tt);
      top.appendChild(el('span', 'badge ' + (lv.status === 'open' ? 'badge-course' : 'badge-school'), lv.status === 'open' ? T.open : T.soon));
      li.appendChild(top);
      li.appendChild(el('p', 'cx-level-sum', lv.summary));
      if (lv.can) li.appendChild(el('p', 'cx-level-can', 'Цель уровня по CEFR: «' + lv.can + '»'));
      if (lv.status === 'open') {
        var pr = levelProgress(lv);
        var bar = el('div', 'cx-bar');
        var fill = el('progress', 'cx-progress');
        fill.max = pr.total; fill.value = pr.done;
        bar.appendChild(fill);
        bar.appendChild(el('span', 'cx-bar-text', pr.done + ' ' + T.of + ' ' + pr.total));
        li.appendChild(bar);
        var ul = el('ol', 'cx-units');
        lv.units.forEach(function (u, idx) {
          var r = state.done[lessonKey(lv, u)];
          var item = el('li', 'cx-unit' + (r && r.passed ? ' is-done' : ''));
          var a = el('a', 'cx-unit-link');
          a.href = '#/' + lv.id + '/' + u.id;
          a.appendChild(el('span', 'cx-unit-num', u.kind === 'test' ? '★' : String(idx + 1)));
          var tx = el('span', 'cx-unit-text');
          tx.appendChild(el('span', 'cx-unit-title', u.title));
          tx.appendChild(el('span', 'cx-unit-meta', r ? (r.passed ? T.done : T.lessonFail) + ' · ' + T.best + ' ' + r.best + '%' : T.notStarted));
          a.appendChild(tx);
          item.appendChild(a);
          ul.appendChild(item);
        });
        li.appendChild(ul);
        if (state.cert && state.cert.a1) {
          var cl = el('a', 'btn btn-red btn-sm', T.certTitle);
          cl.href = '#/a1/cert';
          li.appendChild(cl);
        }
      } else if (lv.plan) {
        li.appendChild(el('p', 'cx-plan-title', T.planned + ' ' + lv.code + ':'));
        var pl = el('ul', 'cx-plan');
        lv.plan.forEach(function (p) { pl.appendChild(el('li', null, p)); });
        li.appendChild(pl);
      }
      levelsNav.appendChild(li);
    });
    root.appendChild(levelsNav);
    root.appendChild(progressTools());
  }

  function progressTools() {
    var box = el('div', 'cx-tools');
    box.appendChild(btn(T.exportP, 'btn-ghost btn-sm', function () {
      var blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'madrashta-progress.json';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
    }));
    var file = el('input'); file.type = 'file'; file.accept = 'application/json,.json'; file.hidden = true;
    file.addEventListener('change', function () {
      var f = file.files && file.files[0]; if (!f) return;
      f.text().then(function (txt) {
        var s = JSON.parse(txt);
        if (!s || typeof s.done !== 'object') throw new Error('bad');
        window.localStorage.setItem(STORE_KEY, JSON.stringify(s));
        state = loadState(); renderOverview(); flash(T.imported);
      }).catch(function () { flash(T.importErr); });
    });
    box.appendChild(file);
    box.appendChild(btn(T.importP, 'btn-ghost btn-sm', function () { file.click(); }));
    var armed = false;
    var rb = btn(T.reset, 'btn-ghost btn-sm', function () {
      if (!armed) { armed = true; rb.textContent = T.resetQ; return; }
      state = { script: state.script, done: {}, xp: 0 }; save(); renderOverview();
    });
    box.appendChild(rb);
    box.appendChild(el('p', 'fine-print', 'Прогресс хранится только в этом браузере. Чтобы продолжить на другом устройстве, сохраните его в файл и загрузите там.'));
    return box;
  }

  function flash(msg) {
    var f = el('p', 'cx-flash', msg);
    f.setAttribute('role', 'status');
    root.insertBefore(f, root.firstChild);
    setTimeout(function () { f.remove(); }, 4000);
  }

  // One keyboard handler at a time, replaced on every screen.
  var keyHandler = null;
  function setKeys(fn) {
    if (keyHandler) document.removeEventListener('keydown', keyHandler);
    keyHandler = fn || null;
    if (fn) document.addEventListener('keydown', fn);
  }

  // ---------- Lesson player -----------------------------------------------
  function renderLesson(level, unit) {
    var key = lessonKey(level, unit);
    var isTest = unit.kind === 'test';
    var queue = isTest ? testExercises(level) : generatorFor(unit)(unit);
    var total = queue.length;
    var firstTry = 0, answered = 0;
    var showTheory = !isTest || !!unit.intro;

    root.textContent = '';
    var shell = el('section', 'cx-lesson');
    var top = el('div', 'cx-lesson-top');
    var back = el('a', 'cx-back', '← ' + T.back); back.href = '#/';
    top.appendChild(back);
    top.appendChild(scriptSwitcher(function () { setKeys(null); renderLesson(level, unit); }));
    shell.appendChild(top);
    shell.appendChild(el('h2', 'cx-lesson-title', level.code + ' · ' + unit.title));
    var prog = el('progress', 'cx-progress'); prog.max = total; prog.value = 0;
    shell.appendChild(prog);
    var stage = el('div', 'cx-stage');
    stage.setAttribute('aria-live', 'polite');
    shell.appendChild(stage);
    root.appendChild(shell);

    function startExercises() { nextExercise(); }

    if (showTheory) {
      stage.textContent = '';
      stage.appendChild(el('h3', 'cx-subhead', isTest ? T.testIntro : T.theory));
      stage.appendChild(theory(unit));
      var go = btn(T.start + ' (' + total + ')', 'btn-red btn-lg', startExercises);
      stage.appendChild(el('div', 'cx-actions')).appendChild(go);
    } else startExercises();

    function nextExercise() {
      if (!queue.length) return finish();
      var ex = queue.shift();
      renderExercise(ex);
    }

    function record(ex, ok) {
      if (!ex._retry) {
        answered++;
        if (ok) firstTry++;
        prog.value = answered;
      }
      if (!ok && !ex._retry && !isTest) {
        var copy = Object.assign({}, ex, { _retry: true });
        queue.push(copy);
      }
    }

    function feedback(ok, ex, after) {
      var fb = el('div', 'cx-feedback ' + (ok ? 'is-ok' : 'is-bad'));
      fb.setAttribute('role', 'status');
      fb.appendChild(el('strong', null, ok ? T.correct : T.wrong));
      if (!ok && ex.answerText) {
        var p = el('p', null, T.answer + ' ');
        if (ex.answerSyr) p.appendChild(syr(ex.answerText, state.script)); else p.appendChild(document.createTextNode(ex.answerText));
        fb.appendChild(p);
      }
      var nb = btn(T.next, ok ? 'btn-blue' : 'btn-red', function () { setKeys(null); after(); });
      fb.appendChild(nb);
      stage.appendChild(fb);
      nb.focus();
      setKeys(null);
      setTimeout(function () {
        if (nb.isConnected) setKeys(function (e) { if (e.key === 'Enter') { e.preventDefault(); nb.click(); } });
      }, 50);
    }

    function renderExercise(ex) {
      stage.textContent = '';
      stage.appendChild(el('p', 'cx-prompt', ex.prompt));
      if (ex.show) { var sh = el('div', 'cx-show'); sh.appendChild(ex.show()); stage.appendChild(sh); }
      if (ex.hint) stage.appendChild(el('p', 'cx-hint', '«' + ex.hint + '»'));
      if (ex.type === 'choice') renderChoice(ex);
      else if (ex.type === 'type') renderType(ex);
      else if (ex.type === 'build') renderBuild(ex);
      else if (ex.type === 'match') renderMatch(ex);
    }

    function renderChoice(ex) {
      var grid = el('div', 'cx-options' + (ex.options.length === 2 ? ' two' : ''));
      var buttons = [];
      var locked = false;
      ex.options.forEach(function (o, i) {
        var b = el('button', 'cx-option');
        b.type = 'button';
        b.appendChild(el('span', 'cx-key', String(i + 1)));
        if (o.syr) b.appendChild(syr(o.syr, o.script, 'opt-syr')); else b.appendChild(el('span', 'cx-opt-text', o.text));
        b.addEventListener('click', function () { choose(i); });
        buttons.push(b);
        grid.appendChild(b);
      });
      stage.appendChild(grid);
      function onKey(e) {
        var n = parseInt(e.key, 10);
        if (n >= 1 && n <= buttons.length) { e.preventDefault(); choose(n - 1); }
      }
      setKeys(onKey);
      function choose(i) {
        if (locked) return;
        locked = true;
        setKeys(null);
        var ok = i === ex.answer;
        buttons.forEach(function (b, j) {
          b.disabled = true;
          if (j === ex.answer) b.classList.add('is-right');
          else if (j === i) b.classList.add('is-wrong');
        });
        record(ex, ok);
        feedback(ok, ex, nextExercise);
      }
    }

    function renderType(ex) {
      var form = el('form', 'cx-type');
      var input = el('input', 'cx-input');
      input.type = 'text'; input.autocomplete = 'off'; input.spellcheck = false;
      input.setAttribute('autocapitalize', 'off');
      input.placeholder = T.placeholder;
      input.setAttribute('aria-label', T.placeholder);
      form.appendChild(input);
      form.appendChild(btn(T.check, 'btn-blue'));
      form.lastChild.type = 'submit';
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!input.value.trim() || input.disabled) return;
        var v = normalize(input.value);
        var ok = ex.accept.some(function (a) { return normalize(a) === v; });
        input.disabled = true; form.lastChild.disabled = true;
        input.classList.add(ok ? 'is-right' : 'is-wrong');
        record(ex, ok);
        feedback(ok, ex, nextExercise);
      });
      stage.appendChild(form);
      input.focus();
    }

    function renderBuild(ex) {
      var built = [];
      var out = el('div', 'cx-built');
      var answerLine = syr('', state.script, 'word');
      out.appendChild(answerLine);
      stage.appendChild(out);
      var tiles = el('div', 'cx-tiles');
      var tileButtons = [];
      ex.tiles.forEach(function (c, i) {
        var b = el('button', 'cx-tile');
        b.type = 'button';
        b.appendChild(syr(c, state.script));
        b.addEventListener('click', function () { built.push(i); b.disabled = true; draw(); });
        tileButtons.push(b);
        tiles.appendChild(b);
      });
      stage.appendChild(tiles);
      var acts = el('div', 'cx-actions');
      var erase = btn('⌫ ' + T.erase, 'btn-ghost btn-sm', function () {
        var i = built.pop(); if (i !== undefined) tileButtons[i].disabled = false; draw();
      });
      var check = btn(T.check, 'btn-blue', function () {
        var v = built.map(function (i) { return ex.tiles[i]; }).join('');
        var ok = v === ex.target;
        tileButtons.forEach(function (b) { b.disabled = true; });
        erase.disabled = true; check.disabled = true;
        out.classList.add(ok ? 'is-right' : 'is-wrong');
        record(ex, ok);
        feedback(ok, ex, nextExercise);
      });
      acts.appendChild(erase); acts.appendChild(check);
      stage.appendChild(acts);
      function draw() {
        answerLine.textContent = built.map(function (i) { return ex.tiles[i]; }).join('');
        check.disabled = !built.length;
      }
      draw();
    }

    function renderMatch(ex) {
      var grid = el('div', 'cx-match');
      var left = el('div', 'cx-match-col'), right = el('div', 'cx-match-col');
      var sel = null, solved = 0, mistakes = 0;
      function item(side, p) {
        var b = el('button', 'cx-option cx-match-item');
        b.type = 'button';
        var o = side === 'l' ? p.left : p.right;
        if (o.syr) b.appendChild(syr(o.syr, o.script, 'opt-syr')); else b.appendChild(el('span', 'cx-opt-text', o.text));
        b.dataset.key = p.key; b.dataset.side = side;
        b.addEventListener('click', function () {
          if (b.disabled) return;
          if (!sel || sel.dataset.side === side) {
            if (sel) sel.classList.remove('is-sel');
            sel = b; b.classList.add('is-sel'); return;
          }
          if (sel.dataset.key === b.dataset.key) {
            sel.classList.remove('is-sel'); sel.classList.add('is-right'); b.classList.add('is-right');
            sel.disabled = true; b.disabled = true; sel = null; solved++;
            if (solved === ex.pairs.length) { var ok = mistakes === 0; record(ex, ok); feedback(ok, ex, nextExercise); }
          } else {
            mistakes++;
            var a = sel; a.classList.remove('is-sel');
            a.classList.add('is-wrong'); b.classList.add('is-wrong');
            setTimeout(function () { a.classList.remove('is-wrong'); b.classList.remove('is-wrong'); }, 500);
            sel = null;
          }
        });
        return b;
      }
      shuffle(ex.pairs).forEach(function (p) { left.appendChild(item('l', p)); });
      shuffle(ex.pairs).forEach(function (p) { right.appendChild(item('r', p)); });
      grid.appendChild(left); grid.appendChild(right);
      stage.appendChild(grid);
    }

    function finish() {
      var pct = Math.round(100 * firstTry / Math.max(1, total));
      var passed = pct >= PASS * 100;
      var prev = state.done[key];
      state.done[key] = { best: Math.max(pct, prev ? prev.best : 0), passed: passed || !!(prev && prev.passed), at: new Date().toISOString().slice(0, 10) };
      state.xp += firstTry * 10;
      save();
      prog.value = total;
      stage.textContent = '';
      var card = el('div', 'cx-result ' + (passed ? 'is-ok' : 'is-bad'));
      card.appendChild(el('p', 'cx-result-big', pct + '%'));
      card.appendChild(el('h3', null, passed ? T.lessonDone : T.lessonFail));
      card.appendChild(el('p', 'muted', T.score + ': ' + firstTry + ' ' + T.of + ' ' + total + (passed ? '' : '. ' + T.needed)));
      var acts = el('div', 'cx-actions');
      acts.appendChild(btn(T.retry, 'btn-ghost', function () { renderLesson(level, unit); }));
      if (isTest && passed) {
        var cb = el('a', 'btn btn-red', T.certMake); cb.href = '#/' + level.id + '/cert';
        acts.appendChild(cb);
        state.cert = state.cert || {};
        state.cert[level.id] = state.cert[level.id] || { date: new Date().toISOString().slice(0, 10), score: pct };
        save();
      } else {
        var i = level.units.indexOf(unit);
        var nx = level.units[i + 1];
        if (nx) { var a = el('a', 'btn ' + (passed ? 'btn-red' : 'btn-blue'), T.nextLesson + ': ' + nx.title); a.href = '#/' + level.id + '/' + nx.id; acts.appendChild(a); }
      }
      var b2 = el('a', 'btn btn-ghost', T.back); b2.href = '#/'; acts.appendChild(b2);
      card.appendChild(acts);
      stage.appendChild(card);
    }
  }

  // ---------- Certificate --------------------------------------------------
  function renderCert(level) {
    root.textContent = '';
    var c = state.cert && state.cert[level.id];
    var wrap = el('section', 'cx-lesson');
    var back = el('a', 'cx-back', '← ' + T.back); back.href = '#/';
    wrap.appendChild(back);
    if (!c) {
      wrap.appendChild(el('p', 'cx-intro', 'Сертификат выдаётся после итогового теста уровня.'));
      root.appendChild(wrap); return;
    }
    var form = el('form', 'cx-type no-print');
    var input = el('input', 'cx-input'); input.type = 'text'; input.placeholder = T.certName; input.setAttribute('aria-label', T.certName);
    input.value = state.name || '';
    form.appendChild(input);
    var sb = btn(T.certMake, 'btn-blue'); sb.type = 'submit'; form.appendChild(sb);
    var cert = el('div', 'cx-cert');
    function draw() {
      cert.textContent = '';
      cert.appendChild(syr('ܡܕܪܫܬܐ', 'estrangela', 'cx-cert-script'));
      cert.appendChild(el('p', 'cx-cert-org', 'Школа современного ассирийского языка'));
      cert.appendChild(el('h2', null, 'Сертификат'));
      cert.appendChild(el('p', null, 'подтверждает, что'));
      cert.appendChild(el('p', 'cx-cert-name', state.name || '—'));
      cert.appendChild(el('p', null, 'успешно завершил(а) онлайн-курс современного ассирийского языка уровня ' + level.code + ' (' + level.title.toLowerCase() + ') по шкале CEFR, включая чтение в письменностях эстрангело, серто и маднхая.'));
      cert.appendChild(el('p', 'muted', 'Итоговый тест: ' + c.score + '% · ' + c.date));
    }
    form.addEventListener('submit', function (e) { e.preventDefault(); state.name = input.value.trim().slice(0, 80); save(); draw(); });
    draw();
    wrap.appendChild(form);
    wrap.appendChild(cert);
    var acts = el('div', 'cx-actions no-print');
    acts.appendChild(btn(T.print, 'btn-red', function () { window.print(); }));
    wrap.appendChild(acts);
    wrap.appendChild(el('p', 'fine-print no-print', 'Это сертификат о прохождении самостоятельного онлайн-курса, а не официальный экзамен.'));
    root.appendChild(wrap);
  }

  // ---------- Router -------------------------------------------------------
  function route() {
    setKeys(null);
    var parts = (window.location.hash || '').replace(/^#\/?/, '').split('/').filter(Boolean);
    var level = parts[0] && findLevel(parts[0]);
    if (level && parts[1] === 'cert') renderCert(level);
    else if (level && level.units && parts[1] && findUnit(level, parts[1])) renderLesson(level, findUnit(level, parts[1]));
    else renderOverview();
    if (parts.length) root.scrollIntoView({ block: 'start' });
  }
  window.addEventListener('hashchange', route);
  route();
})();
