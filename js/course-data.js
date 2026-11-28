'use strict';

/*
  Online course content: Modern Assyrian (Sureth), CEFR levels A1–C2.
  Syriac words are written without vowel points so they render correctly in
  all three scripts (Estrangela, Serto, Madnhaya): the script is a font choice
  over the same Unicode text. Vowel points are taught separately in A1.
  Reading (tr = Latin, cy = Cyrillic) follows the common Iraqi koine.
  Glosses are Russian (ru); add another key (en, de, ...) to localise.
*/
window.COURSE_DATA = (function () {
  // 22 letters of the Syriac alphabet. join: false = does not connect to the left.
  var letters = [
    { id: 'alap', ch: 'ܐ', tr: 'ʾ (немая)', name: 'Ālap', cy: 'алап', join: false, num: 1, sound: 'гласная опора (немая буква перед гласной), в конце слова часто «а»' },
    { id: 'bet', ch: 'ܒ', tr: 'b', name: 'Bēt', cy: 'бет', join: true, num: 2, sound: '«б», после гласной может звучать как «в»' },
    { id: 'gamal', ch: 'ܓ', tr: 'g', name: 'Gāmal', cy: 'гамал', join: true, num: 3, sound: '«г»' },
    { id: 'dalat', ch: 'ܕ', tr: 'd', name: 'Dālat', cy: 'далат', join: false, num: 4, sound: '«д»; точка под буквой' },
    { id: 'he', ch: 'ܗ', tr: 'h', name: 'Hē', cy: 'хе', join: false, num: 5, sound: 'лёгкое «h»' },
    { id: 'waw', ch: 'ܘ', tr: 'w', name: 'Waw', cy: 'вав', join: false, num: 6, sound: '«в/w», а также гласные «у» и «о»' },
    { id: 'zayn', ch: 'ܙ', tr: 'z', name: 'Zayn', cy: 'зайн', join: false, num: 7, sound: '«з»' },
    { id: 'het', ch: 'ܚ', tr: 'ḥ', name: 'Ḥēt', cy: 'хет', join: true, num: 8, sound: 'глубокое «х»' },
    { id: 'tet', ch: 'ܛ', tr: 'ṭ', name: 'Ṭēt', cy: 'тет', join: true, num: 9, sound: 'твёрдое (эмфатическое) «т»' },
    { id: 'yud', ch: 'ܝ', tr: 'y', name: 'Yūd', cy: 'юд', join: true, num: 10, sound: '«й», а также гласная «и»' },
    { id: 'kap', ch: 'ܟ', tr: 'k', name: 'Kāp', cy: 'кап', join: true, num: 20, sound: '«к», после гласной может звучать как «х»' },
    { id: 'lamad', ch: 'ܠ', tr: 'l', name: 'Lāmad', cy: 'ламад', join: true, num: 30, sound: '«л»' },
    { id: 'mim', ch: 'ܡ', tr: 'm', name: 'Mīm', cy: 'мим', join: true, num: 40, sound: '«м»' },
    { id: 'nun', ch: 'ܢ', tr: 'n', name: 'Nūn', cy: 'нун', join: true, num: 50, sound: '«н»' },
    { id: 'semkat', ch: 'ܣ', tr: 's', name: 'Semkat', cy: 'семкат', join: true, num: 60, sound: '«с»' },
    { id: 'e', ch: 'ܥ', tr: 'ʿ (гортанная)', name: 'ʿĒ', cy: 'э', join: true, num: 70, sound: 'гортанный звук; в сурэт обычно звучит как гласная' },
    { id: 'pe', ch: 'ܦ', tr: 'p', name: 'Pē', cy: 'пе', join: true, num: 80, sound: '«п», после гласной может звучать как «ф»' },
    { id: 'sade', ch: 'ܨ', tr: 'ṣ', name: 'Ṣādē', cy: 'саде', join: false, num: 90, sound: 'твёрдое (эмфатическое) «с»' },
    { id: 'qop', ch: 'ܩ', tr: 'q', name: 'Qōp', cy: 'коп', join: true, num: 100, sound: 'глубокое «к» (из горла)' },
    { id: 'resh', ch: 'ܪ', tr: 'r', name: 'Rēsh', cy: 'реш', join: false, num: 200, sound: '«р»; точка над буквой' },
    { id: 'shin', ch: 'ܫ', tr: 'sh', name: 'Shīn', cy: 'шин', join: true, num: 300, sound: '«ш»' },
    { id: 'taw', ch: 'ܬ', tr: 't', name: 'Taw', cy: 'тав', join: false, num: 400, sound: '«т», после гласной может звучать мягче' }
  ];

  // East Syriac vowel points on the carrier ܒ (b).
  var vowels = [
    { id: 'ptaha', syl: 'ܒܲ', mark: 'ܲ', name: 'Птаха', tr: 'ba', cy: 'ба', note: 'две точки сверху наискосок: краткое «а»' },
    { id: 'zqapa', syl: 'ܒܵ', mark: 'ܵ', name: 'Зкапа', tr: 'bā', cy: 'ба:', note: 'две точки сверху по вертикали: долгое «а»' },
    { id: 'zlama-p', syl: 'ܒܸ', mark: 'ܸ', name: 'Злама пшика', tr: 'bi', cy: 'би', note: 'две точки снизу горизонтально: краткое «и/э»' },
    { id: 'zlama-y', syl: 'ܒܹ', mark: 'ܹ', name: 'Злама яриха', tr: 'bē', cy: 'бе', note: 'две точки снизу наискосок: «е»' },
    { id: 'rwasa', syl: 'ܒܘܼ', mark: 'ܘܼ', name: 'Рваса', tr: 'bu', cy: 'бу', note: 'вав с точкой снизу: «у»' },
    { id: 'rwaha', syl: 'ܒܘܿ', mark: 'ܘܿ', name: 'Рваха', tr: 'bo', cy: 'бо', note: 'вав с точкой сверху: «о»' },
    { id: 'hwasa', syl: 'ܒܝܼ', mark: 'ܝܼ', name: 'Хваса', tr: 'bī', cy: 'би:', note: 'юд с точкой снизу: долгое «и»' }
  ];

  function w(id, syr, tr, cy, ru, alt) {
    return { id: id, syr: syr, tr: tr, cy: cy, ru: ru, alt: alt || [] };
  }

  var words = {
    greet: [
      w('shlama', 'ܫܠܡܐ', 'shlāmā', 'шлама', 'мир; привет', ['shlama']),
      w('shlama-lokh', 'ܫܠܡܐ ܠܘܟ', 'shlāmā lōkh', 'шлама лох', 'привет (мужчине)', ['shlama lokh', 'shlama lukh']),
      w('shlama-lakh', 'ܫܠܡܐ ܠܟ', 'shlāmā lākh', 'шлама лах', 'привет (женщине)', ['shlama lakh']),
      w('shlama-lokhun', 'ܫܠܡܐ ܠܘܟܘܢ', 'shlāmā lōkhun', 'шлама лохун', 'привет (многим)', ['shlama lokhun', 'shlama lukhun']),
      w('bshayna', 'ܒܫܝܢܐ', 'bshaynā', 'бшайна', 'добро пожаловать', ['bshayna']),
      w('tawdi', 'ܬܘܕܝ', 'tawdī', 'тавди', 'спасибо', ['tawdi', 'tawdy']),
      w('brikh-sapra', 'ܒܪܝܟ ܨܦܪܐ', 'brīkh ṣaprā', 'брих сапра', 'доброе утро', ['brikh sapra']),
      w('ramsha-tawa', 'ܪܡܫܐ ܛܒܐ', 'ramshā ṭāwā', 'рамша тава', 'добрый вечер', ['ramsha tawa']),
      w('la', 'ܠܐ', 'lā', 'ла', 'нет', ['la'])
    ],
    people: [
      w('ana', 'ܐܢܐ', 'ānā', 'ана', 'я', ['ana']),
      w('at', 'ܐܢܬ', 'at', 'ат', 'ты (м.)', ['at', 'aht']),
      w('ati', 'ܐܢܬܝ', 'atī', 'ати', 'ты (ж.)', ['ati', 'ahti']),
      w('awa', 'ܗܘ', 'āwā', 'ава', 'он', ['awa']),
      w('aya', 'ܗܝ', 'āyā', 'ая', 'она', ['aya']),
      w('akhnan', 'ܐܚܢܢ', 'aḥnan', 'ахнан', 'мы', ['akhnan', 'ahnan']),
      w('akhtun', 'ܐܚܬܘܢ', 'aḥtun', 'ахтун', 'вы', ['akhtun', 'ahtun']),
      w('ani', 'ܐܢܝ', 'ānī', 'ани', 'они', ['ani']),
      w('shimma', 'ܫܡܐ', 'shimmā', 'шимма', 'имя', ['shimma', 'shima'])
    ],
    family: [
      w('baba', 'ܒܒܐ', 'bābā', 'баба', 'отец, папа', ['baba']),
      w('yimma', 'ܝܡܐ', 'yimmā', 'йимма', 'мать, мама', ['yimma', 'yima']),
      w('akhona', 'ܐܚܘܢܐ', 'aḥōnā', 'ахона', 'брат', ['akhona', 'ahona']),
      w('khata', 'ܚܬܐ', 'ḥātā', 'хата', 'сестра', ['khata', 'hata']),
      w('brona', 'ܒܪܘܢܐ', 'brōnā', 'брона', 'сын', ['brona', 'bruna']),
      w('brata', 'ܒܪܬܐ', 'brātā', 'брата', 'дочь', ['brata']),
      w('sawa', 'ܣܒܐ', 'sāwā', 'сава', 'дедушка', ['sawa']),
      w('yala', 'ܝܠܐ', 'yālā', 'яла', 'ребёнок', ['yala']),
      w('baytha', 'ܒܝܬܐ', 'baytā', 'бейта', 'дом', ['bayta', 'baytha', 'beta'])
    ],
    numbers: [
      w('kha', 'ܚܕ', 'ḥa', 'ха', 'один (1)', ['kha', 'ha']),
      w('treh', 'ܬܪܝܢ', 'treh', 'трех', 'два (2)', ['treh', 'tre']),
      w('tlatha', 'ܬܠܬܐ', 'tlātā', 'тлата', 'три (3)', ['tlatha', 'tlata']),
      w('arba', 'ܐܪܒܥܐ', 'arbā', 'арба', 'четыре (4)', ['arba']),
      w('khamsha', 'ܚܡܫܐ', 'ḥamshā', 'хамша', 'пять (5)', ['khamsha', 'hamsha']),
      w('ishta', 'ܫܬܐ', 'ishtā', 'ишта', 'шесть (6)', ['ishta']),
      w('shoa', 'ܫܒܥܐ', 'shōā', 'шоа', 'семь (7)', ['shoa', 'showa']),
      w('tmanya', 'ܬܡܢܝܐ', 'tmānyā', 'тманья', 'восемь (8)', ['tmanya']),
      w('ichcha', 'ܬܫܥܐ', 'ichchā', 'ичча', 'девять (9)', ['ichcha', 'ichha', 'ishsha']),
      w('asra', 'ܥܣܪܐ', 'asrā', 'асра', 'десять (10)', ['asra'])
    ],
    world: [
      w('maya', 'ܡܝܐ', 'mayyā', 'мая', 'вода', ['maya', 'mayya']),
      w('lakhma', 'ܠܚܡܐ', 'laḥmā', 'лахма', 'хлеб', ['lakhma', 'lahma']),
      w('khalwa', 'ܚܠܒܐ', 'ḥalwā', 'халва', 'молоко', ['khalwa', 'halwa']),
      w('ktawa', 'ܟܬܒܐ', 'ktāwā', 'ктава', 'книга', ['ktawa', 'ktaba']),
      w('tara', 'ܬܪܥܐ', 'tarʿā', 'тара', 'дверь', ['tara', 'tar a', 'tarʿa']),
      w('kalba', 'ܟܠܒܐ', 'kalbā', 'калба', 'собака', ['kalba']),
      w('qatu', 'ܩܛܘ', 'qaṭu', 'кату', 'кошка', ['qatu', 'katu']),
      w('shimsha', 'ܫܡܫܐ', 'shimshā', 'шимша', 'солнце', ['shimsha']),
      w('sahra', 'ܣܗܪܐ', 'sahrā', 'сахра', 'луна', ['sahra']),
      w('kokhwa', 'ܟܘܟܒܐ', 'kōkhwā', 'кохва', 'звезда', ['kokhwa', 'kokhba']),
      w('madrashta', 'ܡܕܪܫܬܐ', 'madrashtā', 'мадрашта', 'школа', ['madrashta']),
      w('malpana', 'ܡܠܦܢܐ', 'malpānā', 'малпана', 'учитель', ['malpana']),
      w('talmida', 'ܬܠܡܝܕܐ', 'talmīdā', 'талмида', 'ученик', ['talmida']),
      w('lishana', 'ܠܫܢܐ', 'lishānā', 'лишана', 'язык (речь)', ['lishana', 'leshana'])
    ],
    colors: [
      w('smoqa', 'ܣܡܘܩܐ', 'smōqā', 'смока', 'красный', ['smoqa', 'smoka']),
      w('khwara', 'ܚܘܪܐ', 'ḥwārā', 'хвара', 'белый', ['khwara', 'hwara', 'khiwara']),
      w('koma', 'ܟܘܡܐ', 'kōmā', 'кома', 'чёрный', ['koma']),
      w('yaroqa', 'ܝܪܘܩܐ', 'yārōqā', 'ярока', 'зелёный', ['yaroqa', 'yaroka']),
      w('zarda', 'ܙܪܕܐ', 'zardā', 'зарда', 'жёлтый', ['zarda']),
      w('tawa', 'ܛܒܐ', 'ṭāwā', 'тава', 'хороший', ['tawa']),
      w('rabba', 'ܪܒܐ', 'rabbā', 'рабба', 'большой', ['rabba', 'raba']),
      w('zora', 'ܙܥܘܪܐ', 'zōʿrā', 'зора', 'маленький', ['zora', 'zoura']),
      w('shapira', 'ܫܦܝܪܐ', 'shapīrā', 'шапира', 'красивый', ['shapira'])
    ]
  };

  // Short phrases for reading practice (shown with a reading and translation).
  var phrases = {
    intro: [
      { syr: 'ܫܠܡܐ ܠܘܟ', tr: 'Shlāmā lōkh!', ru: 'Привет! (мужчине)' },
      { syr: 'ܫܡܝ ܡܝܟܐܝܠ', tr: 'Shimmī Mīkhāʾīl.', ru: 'Меня зовут Михаил.' },
      { syr: 'ܐܢܐ ܬܠܡܝܕܐ ܝܘܢ', tr: 'Ānā talmīdā īwen.', ru: 'Я ученик. (говорит мужчина)' },
      { syr: 'ܬܘܕܝ', tr: 'Tawdī!', ru: 'Спасибо!' }
    ]
  };

  var levels = [
    {
      id: 'a1', code: 'A1', cefr: 'Уровень выживания (Breakthrough)', can: 'Понимаю и употребляю знакомые повседневные выражения и простые фразы, могу представиться и ответить на простые вопросы о себе.', title: 'Начальный', status: 'open',
      summary: 'Алфавит в трёх письменностях, огласовки, приветствия, местоимения, семья, числа и первые фразы.',
      units: [
        { id: 'u1', kind: 'letters', title: 'Алфавит 1: ܐ ܒ ܓ ܕ ܗ ܘ', letters: ['alap', 'bet', 'gamal', 'dalat', 'he', 'waw'],
          intro: 'Сирийское письмо читается справа налево. В алфавите 22 согласные буквы; гласные обозначаются точками или опускаются. Одна и та же буква выглядит по-разному в трёх письменностях: эстрангело (древнее, «круглое»), серто (западное, им пишут туройо и западносирийская церковь) и маднхая (восточное, им пишут современный ассирийский).' },
        { id: 'u2', kind: 'letters', title: 'Алфавит 2: ܙ ܚ ܛ ܝ ܟ ܠ', letters: ['zayn', 'het', 'tet', 'yud', 'kap', 'lamad'],
          intro: 'Обратите внимание на пары похожих звуков: ܚ (глубокое «х») и ܟ (которое после гласной тоже может звучать как «х»), ܛ (твёрдое «т») и ܬ (обычное «т»).' },
        { id: 'u3', kind: 'letters', title: 'Алфавит 3: ܡ ܢ ܣ ܥ ܦ ܨ', letters: ['mim', 'nun', 'semkat', 'e', 'pe', 'sade'],
          intro: 'ܡ, ܢ и ܟ имеют особую форму в конце слова. Буква ܥ в современном ассирийском почти не произносится, но в написании слов сохраняется.' },
        { id: 'u4', kind: 'letters', title: 'Алфавит 4: ܩ ܪ ܫ ܬ', letters: ['qop', 'resh', 'shin', 'taw'],
          intro: 'Буквы ܕ и ܪ отличаются только точкой: у ܕ (д) она снизу, у ܪ (р) сверху. Это одна из главных ловушек для начинающих.' },
        { id: 'u5', kind: 'joining', title: 'Как соединяются буквы', letters: ['alap', 'dalat', 'he', 'waw', 'zayn', 'sade', 'resh', 'taw', 'bet', 'lamad', 'mim', 'nun', 'kap', 'shin'],
          intro: 'Большинство букв соединяются с обеих сторон, как в рукописном тексте. Восемь букв (ܐ ܕ ܗ ܘ ܙ ܨ ܪ ܬ) соединяются только со стороны предыдущей буквы, то есть после них в слове появляется разрыв. У каждой буквы может быть до четырёх форм: отдельная, начальная, срединная и конечная.' },
        { id: 'u6', kind: 'vowels', title: 'Огласовки (восточная система)',
          intro: 'В учебниках и детских книгах современного ассирийского над и под буквами ставят точки-огласовки. Это восточная система; в серто вместо точек используют маленькие греческие буквы, о них — на уровне A2. В повседневном письме огласовки часто опускают.' },
        { id: 'u7', kind: 'numbers', title: 'Буквы-числа', letters: ['alap', 'bet', 'gamal', 'dalat', 'he', 'waw', 'zayn', 'het', 'tet', 'yud'],
          intro: 'Буквы сирийского алфавита служат и цифрами: ܐ = 1, ܒ = 2 … ܝ = 10, ܟ = 20, ܩ = 100. Так нумеруют главы книг, псалмы и страницы.' },
        { id: 'u8', kind: 'words', title: 'Приветствия', words: 'greet', phrases: 'intro',
          intro: 'Главное ассирийское приветствие — «шлама», то есть «мир». После него добавляют «лох» мужчине, «лах» женщине и «лохун» нескольким людям.' },
        { id: 'u9', kind: 'words', title: 'Я, ты, он: местоимения', words: 'people',
          intro: 'В сурэт различают «ты» для мужчины (ܐܢܬ ат) и для женщины (ܐܢܬܝ ати). «Я ученик» звучит как «ана талмида ивен», а «меня зовут…» — «шимми…».' },
        { id: 'u10', kind: 'words', title: 'Семья и дом', words: 'family',
          intro: 'Многие существительные мужского рода оканчиваются на -а (ܐ), а женского — на -та (ܬܐ): ܒܪܘܢܐ брона «сын», ܒܪܬܐ брата «дочь».' },
        { id: 'u11', kind: 'words', title: 'Числа от 1 до 10', words: 'numbers',
          intro: 'Это формы для счёта. Позже (A2) вы узнаете, что у некоторых чисел есть мужская и женская форма.' },
        { id: 'u12', kind: 'words', title: 'Мир вокруг: вода, хлеб, школа', words: 'world',
          intro: 'Обратите внимание на ܡܕܪܫܬܐ мадрашта «школа» — это слово есть в названии нашего сайта.' },
        { id: 'u13', kind: 'words', title: 'Цвета и качества', words: 'colors',
          intro: 'Прилагательное стоит после существительного: ܒܝܬܐ ܪܒܐ бейта рабба «большой дом», ܟܠܒܐ ܟܘܡܐ калба кома «чёрная собака».' },
        { id: 'test', kind: 'test', title: 'Итоговый тест A1',
          intro: 'Двадцать вопросов по всем урокам уровня. Для сертификата нужно ответить верно хотя бы на 70%.' }
      ]
    }
    // Levels A2–C2 are defined in course-levels.js.
  ];

  var scripts = [
    { id: 'estrangela', name: 'Эстрангело', syr: 'ܐܣܛܪܢܓܠܐ', note: 'древнейшее «круглое» письмо Эдессы; сегодня в заголовках и надписях' },
    { id: 'serto', name: 'Серто', syr: 'ܣܪܛܐ', note: 'западное письмо: туройо и западносирийская церковь' },
    { id: 'madnhaya', name: 'Маднхая', syr: 'ܡܕܢܚܝܐ', note: 'восточное письмо: им пишут современный ассирийский' }
  ];

  return { letters: letters, vowels: vowels, words: words, phrases: phrases, levels: levels, scripts: scripts };
})();
