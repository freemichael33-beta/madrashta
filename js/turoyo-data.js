'use strict';

/*
  Online course content: Turoyo (Ṣurayt), the Neo-Aramaic language of Tur Abdin,
  CEFR levels A1–C2. Runs on the shared engine js/course.js (see docs/course.md).
  Syriac words are stored once in Unicode without vowel points, so they render in
  all three scripts (Serto, Estrangela, Madnhaya); Serto is the default here,
  as Turoyo is traditionally written in Serto. West Syriac (Greek-letter)
  vowels are taught separately.
  Reading: tr = Latin (common Turoyo Latin spelling), cy = Cyrillic.
  Spelling in Syriac script follows the usual etymological (Classical) spelling.
  Course author: Michael Baddu.
  All Turoyo vocabulary here must be checked by a native speaker before release.
*/
window.COURSE_DATA = (function () {
  var meta = {
    id: 'turoyo',
    storeKey: 'madrashta-turoyo-v1',
    defaultScript: 'serto',
    vowelScript: 'serto',
    exportName: 'madrashta-turoyo-progress.json',
    certOrg: 'Школа современного ассирийского языка',
    certCourse: 'онлайн-курс языка туройо',
    courseName: 'Туройо',
    author: 'Michael Baddu'
  };

  // 22 letters with West Syriac names. join: false = does not connect to the left.
  var letters = [
    { id: 'alap', ch: 'ܐ', tr: 'ʾ (немая)', name: 'Olaf', cy: 'олаф', join: false, num: 1, sound: 'гласная опора (немая буква перед гласной), в конце слова часто «о»' },
    { id: 'bet', ch: 'ܒ', tr: 'b', name: 'Beṯ', cy: 'бет', join: true, num: 2, sound: '«б», после гласной может звучать как «в»' },
    { id: 'gamal', ch: 'ܓ', tr: 'g', name: 'Gomal', cy: 'гомал', join: true, num: 3, sound: '«г»' },
    { id: 'dalat', ch: 'ܕ', tr: 'd', name: 'Dolaṯ', cy: 'долат', join: false, num: 4, sound: '«д»; точка под буквой' },
    { id: 'he', ch: 'ܗ', tr: 'h', name: 'He', cy: 'хе', join: false, num: 5, sound: 'лёгкое «h»' },
    { id: 'waw', ch: 'ܘ', tr: 'w', name: 'Waw', cy: 'вав', join: false, num: 6, sound: '«в/w», а также гласные «у» и «о»' },
    { id: 'zayn', ch: 'ܙ', tr: 'z', name: 'Zayn', cy: 'зайн', join: false, num: 7, sound: '«з»' },
    { id: 'het', ch: 'ܚ', tr: 'ḥ', name: 'Ḥeṯ', cy: 'хет', join: true, num: 8, sound: 'глубокое гортанное «х» (как в арабском ح)' },
    { id: 'tet', ch: 'ܛ', tr: 'ṭ', name: 'Ṭeṯ', cy: 'тет', join: true, num: 9, sound: 'твёрдое (эмфатическое) «т»' },
    { id: 'yud', ch: 'ܝ', tr: 'y', name: 'Yudh', cy: 'юд', join: true, num: 10, sound: '«й», а также гласные «и» и «е»' },
    { id: 'kap', ch: 'ܟ', tr: 'k', name: 'Kof', cy: 'коф', join: true, num: 20, sound: '«к», после гласной может звучать как «х»' },
    { id: 'lamad', ch: 'ܠ', tr: 'l', name: 'Lomad', cy: 'ломад', join: true, num: 30, sound: '«л»' },
    { id: 'mim', ch: 'ܡ', tr: 'm', name: 'Mim', cy: 'мим', join: true, num: 40, sound: '«м»' },
    { id: 'nun', ch: 'ܢ', tr: 'n', name: 'Nun', cy: 'нун', join: true, num: 50, sound: '«н»' },
    { id: 'semkat', ch: 'ܣ', tr: 's', name: 'Semkaṯ', cy: 'семкат', join: true, num: 60, sound: '«с»' },
    { id: 'e', ch: 'ܥ', tr: 'ʿ (гортанная)', name: 'ʿE', cy: 'э', join: true, num: 70, sound: 'гортанный звук ʿ; в туройо он произносится (как арабский ع)' },
    { id: 'pe', ch: 'ܦ', tr: 'f / p', name: 'Fe', cy: 'фе', join: true, num: 80, sound: '«ф», в части слов «п»' },
    { id: 'sade', ch: 'ܨ', tr: 'ṣ', name: 'Ṣode', cy: 'соде', join: false, num: 90, sound: 'твёрдое (эмфатическое) «с»' },
    { id: 'qop', ch: 'ܩ', tr: 'q', name: 'Qof', cy: 'коф', join: true, num: 100, sound: 'глубокое «к» (из горла)' },
    { id: 'resh', ch: 'ܪ', tr: 'r', name: 'Riš', cy: 'риш', join: false, num: 200, sound: '«р»; точка над буквой' },
    { id: 'shin', ch: 'ܫ', tr: 'š', name: 'Šin', cy: 'шин', join: true, num: 300, sound: '«ш»' },
    { id: 'taw', ch: 'ܬ', tr: 't / ṯ', name: 'Taw', cy: 'тав', join: false, num: 400, sound: '«т», после гласной в части говоров звучит как английское th' }
  ];

  // West Syriac (Greek-letter) vowel signs on the carrier ܒ (b).
  var vowels = [
    { id: 'ptoho', syl: 'ܒܰ', mark: 'ܰ', name: 'Птохо', tr: 'ba', cy: 'ба', note: 'маленькая греческая альфа над буквой: «а»' },
    { id: 'zqofo', syl: 'ܒܳ', mark: 'ܳ', name: 'Зкофо', tr: 'bo', cy: 'бо', note: 'маленький омикрон над буквой: «о» (в западной традиции долгое «а» читается как «о»)' },
    { id: 'rboso', syl: 'ܒܶ', mark: 'ܶ', name: 'Рбосо', tr: 'be', cy: 'бе', note: 'маленький эпсилон над буквой: «е»' },
    { id: 'hboso', syl: 'ܒܺ', mark: 'ܺ', name: 'Хбосо', tr: 'bi', cy: 'би', note: 'маленькая эта над буквой: «и»' },
    { id: 'esoso', syl: 'ܒܽ', mark: 'ܽ', name: 'Эсосо', tr: 'bu', cy: 'бу', note: 'маленький ипсилон над буквой: «у»' }
  ];

  function w(id, syr, tr, cy, ru, alt) {
    return { id: id, syr: syr, tr: tr, cy: cy, ru: ru, alt: alt || [] };
  }

  var words = {
    greet: [
      w('shlomo', 'ܫܠܡܐ', 'šlomo', 'шломо', 'мир; привет', ['shlomo']),
      w('shlomo-alux', 'ܫܠܡܐ ܥܠܘܟ', 'šlomo ʿalux', 'шломо алух', 'привет (мужчине)', ['shlomo alux', 'shlomo alukh', 'shlomo ʿalux']),
      w('shlomo-alax', 'ܫܠܡܐ ܥܠܟܝ', 'šlomo ʿalax', 'шломо алах', 'привет (женщине)', ['shlomo alax', 'shlomo alakh', 'shlomo ʿalax']),
      w('shlomo-alayxu', 'ܫܠܡܐ ܥܠܝܟܘܢ', 'šlomo ʿalayxu', 'шломо алайху', 'привет (многим)', ['shlomo alayxu', 'shlomo alaykhu', 'shlomo ʿalayxu']),
      w('aydarbo', 'ܐܝܕܪܒܐ', 'aydarbo', 'айдарбо', 'как? (как дела?)', ['aydarbo']),
      w('tawdi', 'ܬܘܕܝ', 'tawdi', 'тавди', 'спасибо', ['tawdi']),
      w('e', 'ܐܝ', 'e', 'э', 'да', ['e', 'ee']),
      w('lo', 'ܠܐ', 'lo', 'ло', 'нет', ['lo'])
    ],
    people: [
      w('ono', 'ܐܢܐ', 'ono', 'оно', 'я', ['ono', 'ʾono']),
      w('hat', 'ܗܬ', 'hat', 'хат', 'ты', ['hat']),
      w('huwe', 'ܗܘ', 'huwe', 'хуве', 'он', ['huwe']),
      w('hiya', 'ܗܝ', 'hiya', 'хия', 'она', ['hiya', 'hiye']),
      w('ahna', 'ܐܚܢܢ', 'aḥna', 'ахна', 'мы', ['ahna', 'akhna', 'hna']),
      w('hatu', 'ܗܬܘܢ', 'hatu', 'хату', 'вы', ['hatu']),
      w('hinne', 'ܗܢܘܢ', 'hinne', 'хинне', 'они', ['hinne', 'hene']),
      w('shemo', 'ܫܡܐ', 'šəmo', 'шемо', 'имя', ['shemo', 'shmo', 'šemo'])
    ],
    family: [
      w('babo', 'ܒܒܐ', 'babo', 'бабо', 'отец, папа', ['babo']),
      w('emo', 'ܐܡܐ', 'emo', 'эмо', 'мать, мама', ['emo', 'imo']),
      w('ahuno', 'ܐܚܘܢܐ', 'aḥuno', 'ахуно', 'брат', ['ahuno', 'akhuno']),
      w('hoto', 'ܚܬܐ', 'ḥoṯo', 'хото', 'сестра', ['hoto', 'hotho', 'khoto']),
      w('abro', 'ܐܒܪܐ', 'abro', 'абро', 'сын', ['abro']),
      w('barto', 'ܒܪܬܐ', 'barṯo', 'барто', 'дочь', ['barto', 'bartho']),
      w('sowo', 'ܣܒܐ', 'sowo', 'сово', 'дедушка', ['sowo', 'sobo']),
      w('bayto', 'ܒܝܬܐ', 'bayto', 'байто', 'дом', ['bayto', 'baytho', 'bayṯo'])
    ],
    numbers: [
      w('ha', 'ܚܕ', 'ḥa', 'ха', 'один (1)', ['ha', 'kha']),
      w('tre', 'ܬܪܝܢ', 'tre', 'тре', 'два (2)', ['tre']),
      w('tloto', 'ܬܠܬܐ', 'tloṯo', 'тлото', 'три (3)', ['tloto', 'tlotho']),
      w('arbo', 'ܐܪܒܥܐ', 'arbʿo', 'арбо', 'четыре (4)', ['arbo', 'arbʿo', 'arba']),
      w('hamsho', 'ܚܡܫܐ', 'ḥamšo', 'хамшо', 'пять (5)', ['hamsho', 'khamsho', 'hamšo']),
      w('ishto', 'ܐܫܬܐ', 'išto', 'ишто', 'шесть (6)', ['ishto', 'išto', 'eshto']),
      w('shawo', 'ܫܒܥܐ', 'šawʿo', 'шаво', 'семь (7)', ['shawo', 'shawʿo', 'šawʿo']),
      w('tmone', 'ܬܡܢܝܐ', 'tmone', 'тмоне', 'восемь (8)', ['tmone']),
      w('icho', 'ܬܫܥܐ', 'ičʿo', 'ичо', 'девять (9)', ['icho', 'ichʿo', 'ičʿo', 'ečʿo']),
      w('asro', 'ܥܣܪܐ', 'ʿasro', 'асро', 'десять (10)', ['asro', 'ʿasro'])
    ],
    world: [
      w('mayo', 'ܡܝܐ', 'mayo', 'майо', 'вода', ['mayo']),
      w('lahmo', 'ܠܚܡܐ', 'laḥmo', 'лахмо', 'хлеб', ['lahmo', 'lakhmo']),
      w('halwo', 'ܚܠܒܐ', 'ḥalwo', 'халво', 'молоко', ['halwo', 'khalwo']),
      w('ktowo', 'ܟܬܒܐ', 'ktowo', 'ктово', 'книга', ['ktowo', 'ktobo']),
      w('taro', 'ܬܪܥܐ', 'tarʿo', 'таро', 'дверь', ['taro', 'tarʿo']),
      w('kalbo', 'ܟܠܒܐ', 'kalbo', 'калбо', 'собака', ['kalbo']),
      w('shimsho', 'ܫܡܫܐ', 'šimšo', 'шимшо', 'солнце', ['shimsho', 'šimšo']),
      w('sahro', 'ܣܗܪܐ', 'sahro', 'сахро', 'луна', ['sahro']),
      w('kawkwo', 'ܟܘܟܒܐ', 'kawkwo', 'кавкво', 'звезда', ['kawkwo', 'kawkbo']),
      w('madrashto', 'ܡܕܪܫܬܐ', 'madrašto', 'мадрашто', 'школа', ['madrashto', 'madrašto']),
      w('malfono', 'ܡܠܦܢܐ', 'malfono', 'малфоно', 'учитель', ['malfono']),
      w('talmido', 'ܬܠܡܝܕܐ', 'talmido', 'талмидо', 'ученик', ['talmido']),
      w('leshono', 'ܠܫܢܐ', 'lešono', 'лешоно', 'язык (речь)', ['leshono', 'lešono']),
      w('turo', 'ܛܘܪܐ', 'ṭuro', 'туро', 'гора', ['turo', 'ṭuro'])
    ],
    colors: [
      w('summoqo', 'ܣܘܡܩܐ', 'summoqo', 'суммоко', 'красный', ['summoqo', 'sumoqo', 'summoko']),
      w('heworo', 'ܚܘܪܐ', 'ḥeworo', 'хеворо', 'белый', ['heworo', 'khewaro', 'heworo']),
      w('ukomo', 'ܐܘܟܡܐ', 'ukomo', 'укомо', 'чёрный', ['ukomo']),
      w('yaroqo', 'ܝܪܘܩܐ', 'yaroqo', 'яроко', 'зелёный', ['yaroqo', 'yaroko']),
      w('tawo', 'ܛܒܐ', 'ṭawo', 'таво', 'хороший', ['tawo', 'ṭawo']),
      w('rabo', 'ܪܒܐ', 'rabo', 'рабо', 'большой', ['rabo', 'rabbo']),
      w('naimo', 'ܢܥܝܡܐ', 'naʿimo', 'наимо', 'маленький', ['naimo', 'naʿimo']),
      w('shafiro', 'ܫܦܝܪܐ', 'šafiro', 'шафиро', 'красивый', ['shafiro', 'šafiro'])
    ]
  };

  var phrases = {
    intro: [
      { syr: 'ܫܠܡܐ ܥܠܘܟ', tr: 'Šlomo ʿalux!', ru: 'Привет! (мужчине)' },
      { syr: 'ܥܠܘܟ ܫܠܡܐ', tr: 'ʿAlux šlomo!', ru: 'И тебе привет! (ответ мужчине)' },
      { syr: 'ܐܝܕܪܒܐ ܗܬ', tr: 'Aydarbo hat?', ru: 'Как ты? Как дела?' },
      { syr: 'ܫܡܝ ܡܝܟܐܝܠ', tr: 'Šəmi Mixaʾil.', ru: 'Меня зовут Михаил.' },
      { syr: 'ܬܘܕܝ', tr: 'Tawdi!', ru: 'Спасибо!' }
    ]
  };

  var levels = [
    {
      id: 'a1', code: 'A1', cefr: 'Уровень выживания (Breakthrough)', can: 'Понимаю и употребляю знакомые повседневные выражения и простые фразы, могу представиться и ответить на простые вопросы о себе.', title: 'Начальный', status: 'open',
      summary: 'Алфавит в серто (и ещё двух письменностях), западные огласовки, приветствия, местоимения, семья, числа и первые фразы на туройо.',
      units: [
        { id: 'u1', kind: 'letters', title: 'Алфавит 1: ܐ ܒ ܓ ܕ ܗ ܘ', letters: ['alap', 'bet', 'gamal', 'dalat', 'he', 'waw'],
          intro: 'Туройо (сурайт) — новоарамейский язык Тур-Абдина на юго-востоке Турции; сегодня на нём говорят и в общинах Швеции, Германии, Нидерландов и других стран. Традиционно на туройо пишут западным письмом серто, справа налево. В алфавите 22 согласные буквы, гласные обозначаются маленькими греческими буквами или опускаются. Серто стоит в курсе по умолчанию, но вы можете переключиться на эстрангело или маднхая и сравнить.' },
        { id: 'u2', kind: 'letters', title: 'Алфавит 2: ܙ ܚ ܛ ܝ ܟ ܠ', letters: ['zayn', 'het', 'tet', 'yud', 'kap', 'lamad'],
          intro: 'В туройо хорошо слышны гортанные звуки: ܚ (глубокое «х») отличается от ܟ, которое после гласной звучит как обычное «х». ܛ — твёрдое «т», ܬ — обычное.' },
        { id: 'u3', kind: 'letters', title: 'Алфавит 3: ܡ ܢ ܣ ܥ ܦ ܨ', letters: ['mim', 'nun', 'semkat', 'e', 'pe', 'sade'],
          intro: 'В отличие от восточного сурэт, в туройо буква ܥ произносится: это гортанный звук, как арабский ع. ܦ в туройо обычно читается как «ф».' },
        { id: 'u4', kind: 'letters', title: 'Алфавит 4: ܩ ܪ ܫ ܬ', letters: ['qop', 'resh', 'shin', 'taw'],
          intro: 'Буквы ܕ и ܪ отличаются только точкой: у ܕ (д) она снизу, у ܪ (р) сверху. В серто эта пара особенно похожа, следите за точкой.' },
        { id: 'u5', kind: 'joining', title: 'Как соединяются буквы', letters: ['alap', 'dalat', 'he', 'waw', 'zayn', 'sade', 'resh', 'taw', 'bet', 'lamad', 'mim', 'nun', 'kap', 'shin'],
          intro: 'Большинство букв соединяются с обеих сторон. Восемь букв (ܐ ܕ ܗ ܘ ܙ ܨ ܪ ܬ) соединяются только со стороны предыдущей буквы, после них в слове разрыв. В серто конечная ܐ пишется вертикальной чертой, а ܠ и ܐ в конце слова часто сливаются в лигатуру ܠܐ.' },
        { id: 'u6', kind: 'vowels', title: 'Огласовки (западная система)',
          intro: 'В западной традиции, которой следует туройо, гласные обозначают пятью маленькими греческими буквами над или под согласной. Обратите внимание: знак зкофо читается как «о». Именно поэтому восточное «шлама» в туройо звучит «шломо». В повседневном письме огласовки часто опускают.' },
        { id: 'u7', kind: 'numbers', title: 'Буквы-числа', letters: ['alap', 'bet', 'gamal', 'dalat', 'he', 'waw', 'zayn', 'het', 'tet', 'yud'],
          intro: 'Буквы алфавита служат и цифрами: ܐ = 1, ܒ = 2 … ܝ = 10, ܟ = 20, ܩ = 100. Так нумеруют главы, псалмы и страницы в церковных книгах.' },
        { id: 'u8', kind: 'words', title: 'Приветствия', words: 'greet', phrases: 'intro',
          intro: 'Главное приветствие — «шломо», то есть «мир». Мужчине говорят «шломо алух», женщине «шломо алах», нескольким людям «шломо алайху». В ответ слова меняют местами: «алух шломо». «Как дела?» — «айдарбо хат?»' },
        { id: 'u9', kind: 'words', title: 'Я, ты, он: местоимения', words: 'people',
          intro: 'Местоимение «ты» в туройо одно для мужчины и женщины: ܗܬ хат. «Меня зовут…» звучит как «шеми…» (буквально «моё имя»).' },
        { id: 'u10', kind: 'words', title: 'Семья и дом', words: 'family',
          intro: 'Существительные в туройо обычно оканчиваются на -о: бабо «отец», байто «дом». Женский род часто имеет окончание -то: барто «дочь».' },
        { id: 'u11', kind: 'words', title: 'Числа от 1 до 10', words: 'numbers',
          intro: 'Это формы для счёта. У некоторых чисел есть отдельные формы мужского и женского рода, о них — на уровне A2.' },
        { id: 'u12', kind: 'words', title: 'Мир вокруг: вода, хлеб, школа', words: 'world',
          intro: 'Слово ܛܘܪܐ туро «гора» есть в названии самого языка: ṭuroyo значит «горный», то есть язык Тур-Абдина («горы слуг Божьих»).' },
        { id: 'u13', kind: 'words', title: 'Цвета и качества', words: 'colors',
          intro: 'Прилагательное стоит после существительного: ܒܝܬܐ ܪܒܐ байто рабо «большой дом», ܟܠܒܐ ܐܘܟܡܐ калбо укомо «чёрная собака».' },
        { id: 'test', kind: 'test', title: 'Итоговый тест A1',
          intro: 'Двадцать вопросов по всем урокам уровня. Для сертификата нужно ответить верно хотя бы на 70%.' }
      ]
    },
    {
      id: 'a2', code: 'A2', cefr: 'Предпороговый уровень (Waystage)', can: 'Понимаю частые выражения на темы семьи, покупок и работы, могу общаться в простых бытовых ситуациях.', title: 'Элементарный', status: 'soon',
      summary: 'Повседневные ситуации и первые глаголы.',
      plan: ['Дополнительные звуки туройо: č, ǧ, ž, x и их обозначение в серто', 'Латинский алфавит туройо', 'Настоящее время с приставкой k-', 'Притяжательные окончания', 'Числа до 100, время и дни недели', 'Еда, рынок, деревня и город']
    },
    {
      id: 'b1', code: 'B1', cefr: 'Пороговый уровень (Threshold)', can: 'Понимаю главное в чёткой речи на знакомые темы, могу рассказать о событиях, планах и объяснить своё мнение.', title: 'Средний', status: 'soon',
      summary: 'Самостоятельное общение на знакомые темы.',
      plan: ['Прошедшее время', 'Будущее время с частицей gd-', 'Повелительное наклонение', 'Письма и сообщения', 'Путешествия, работа, здоровье', 'Чтение адаптированных рассказов']
    },
    {
      id: 'b2', code: 'B2', cefr: 'Пороговый продвинутый уровень (Vantage)', can: 'Понимаю сложные тексты, свободно говорю с носителями и могу подробно высказаться на разные темы.', title: 'Выше среднего', status: 'soon',
      summary: 'Свободное общение, тексты СМИ, история Тур-Абдина.',
      plan: ['Условные предложения', 'Сложные предложения', 'Новости и передачи на туройо', 'Песни и сказки Тур-Абдина', 'История общин в диаспоре']
    },
    {
      id: 'c1', code: 'C1', cefr: 'Уровень профессионального владения (Effective Operational Proficiency)', can: 'Понимаю объёмные сложные тексты, говорю бегло и точно, пользуюсь языком в учёбе и работе.', title: 'Продвинутый', status: 'soon',
      summary: 'Литературный язык и говоры.',
      plan: ['Говоры: мидьятский и деревенские', 'Заимствования из классического сирийского, курдского, арабского и турецкого', 'Стилистика и эссе', 'Перевод']
    },
    {
      id: 'c2', code: 'C2', cefr: 'Уровень владения в совершенстве (Mastery)', can: 'Понимаю практически всё, что слышу и читаю, выражаюсь спонтанно, точно и с тонкими оттенками смысла.', title: 'В совершенстве', status: 'soon',
      summary: 'Фольклор, поэзия и литература на туройо.',
      plan: ['Устная поэзия и фольклор', 'Современная литература на туройо', 'Литературный перевод', 'Итоговый экзамен уровня C2']
    }
  ];

  // Serto first: it is the traditional script of Turoyo.
  var scripts = [
    { id: 'serto', name: 'Серто', syr: 'ܣܪܛܐ', note: 'западное письмо: им традиционно пишут туройо' },
    { id: 'estrangela', name: 'Эстрангело', syr: 'ܐܣܛܪܢܓܠܐ', note: 'древнейшее «круглое» письмо Эдессы; сегодня в заголовках и надписях' },
    { id: 'madnhaya', name: 'Маднхая', syr: 'ܡܕܢܚܝܐ', note: 'восточное письмо: им пишут современный ассирийский (сурэт)' }
  ];

  return { meta: meta, letters: letters, vowels: vowels, words: words, phrases: phrases, levels: levels, scripts: scripts };
})();
