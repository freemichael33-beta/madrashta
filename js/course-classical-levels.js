'use strict';

/*
  Levels A2–C2 of the Classical Syriac course. Loaded after
  course-classical-data.js; replaces the placeholder A2–C2 levels there.

  Every item has the East Syriac reading in tr and the West Syriac reading in
  r.west.tr (the engine shows the tradition the learner selects).
  Syriac is unpointed (only seyame on plurals) so it renders cleanly in Estrangela.

  Written from general knowledge, without checking sources: readings,
  translations and the Peshitta / liturgical lines must be reviewed by a
  specialist before publication. Texts marked "адаптированный" are composed
  for learners and are not quotations.
*/
(function () {
  var D = window.COURSE_DATA;
  if (!D) return;

  // Rough Latin → Cyrillic reading.
  function toCy(tr) {
    var s = String(tr).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[ʾʿ']/g, '');
    var pairs = [['kh', 'х'], ['sh', 'ш'], ['th', 'т'], ['dh', 'д'], ['gh', 'г'],
      ['ya', 'я'], ['yu', 'ю'], ['yo', 'йо'], ['ye', 'е'],
      ['a', 'а'], ['b', 'б'], ['v', 'в'], ['g', 'г'], ['d', 'д'], ['e', 'е'], ['z', 'з'], ['i', 'и'], ['y', 'й'], ['k', 'к'],
      ['l', 'л'], ['m', 'м'], ['n', 'н'], ['o', 'о'], ['p', 'п'], ['r', 'р'], ['s', 'с'], ['t', 'т'], ['u', 'у'], ['f', 'ф'],
      ['h', 'х'], ['q', 'к'], ['w', 'в']];
    var out = '';
    for (var i = 0; i < s.length;) {
      var hit = false;
      for (var j = 0; j < pairs.length; j++) {
        if (s.substr(i, pairs[j][0].length) === pairs[j][0]) { out += pairs[j][1]; i += pairs[j][0].length; hit = true; break; }
      }
      if (!hit) { out += s[i]; i++; }
    }
    return out;
  }
  function plain(tr) { return String(tr).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[ʾʿ'()]/g, ''); }
  // w(id, Syriac, East reading, West reading, Russian, [extra accepted answers])
  function w(id, syr, east, west, ru, alt) {
    return { id: id, syr: syr, tr: east, cy: toCy(east), ru: ru, alt: [plain(east), plain(west)].concat(alt || []),
      r: { west: { tr: west, cy: toCy(west) } } };
  }
  // s(Syriac, East reading, West reading, Russian)
  function s(syr, east, west, ru) { return { syr: syr, tr: east, ru: ru, r: { west: { tr: west } } }; }

  var W = D.words;

  // ---------------- A2 ----------------
  W.states = [
    w('malka-e', 'ܡܠܟܐ', 'malkā', 'malko', 'царь (эмфатическое состояние)'),
    w('melekh-a', 'ܡܠܟ', 'melekh', 'melekh', 'царь (абсолютное состояние)'),
    w('malkutha-e', 'ܡܠܟܘܬܐ', 'malkūthā', 'malkutho', 'царство'),
    w('bar-c', 'ܒܪ', 'bar', 'bar', 'сын (сопряжённое: «сын кого-то»)'),
    w('beth-c', 'ܒܝܬ', 'bēth', 'beth', 'дом (сопряжённое: «дом кого-то»)'),
    w('beth-malka', 'ܒܝܬ ܡܠܟܐ', 'bēth malkā', 'beth malko', 'дом царя'),
    w('bar-nasha', 'ܒܪ ܐܢܫܐ', 'bar nāshā', 'bar nosho', 'человек (букв. «сын человеческий»)'),
    w('taw-a', 'ܛܒ', 'ṭāw', 'ṭov', 'хорош (абсолютное: «он хорош»)', ['tav', 'tov']),
    w('shappir-a', 'ܫܦܝܪ', 'shappīr', 'shapir', 'прекрасен (абсолютное)')
  ];
  W.plural = [
    w('malke', 'ܡܠܟ̈ܐ', 'malkē', 'malke', 'цари'),
    w('ktawe', 'ܟܬܒ̈ܐ', 'ktāwē', 'ktove', 'книги', ['ktave']),
    w('bnayya', 'ܒܢ̈ܝܐ', 'bnayyā', 'bnayo', 'сыновья', ['bnaya']),
    w('bnatha', 'ܒܢ̈ܬܐ', 'bnāthā', 'bnotho', 'дочери', ['bnata', 'bnoto']),
    w('amme', 'ܥܡ̈ܡܐ', 'ʿammē', 'ʿame', 'народы', ['amme', 'ame']),
    w('nasha', 'ܐܢܫ̈ܐ', 'nāshā', 'nosho', 'люди'),
    w('yawmatha', 'ܝܘܡ̈ܬܐ', 'yawmāthā', 'yawmotho', 'дни', ['yawmata', 'yawmoto']),
    w('shmahe', 'ܫܡ̈ܗܐ', 'shmāhē', 'shmohe', 'имена'),
    w('mdinatha', 'ܡܕܝܢ̈ܬܐ', 'mdīnāthā', 'mdinotho', 'города', ['mdinata', 'mdinoto'])
  ];
  W.suffixes = [
    w('ktawy', 'ܟܬܒܝ', 'ktāw(y)', 'ktov(y)', 'моя книга', ['ktaw', 'ktov']),
    w('ktawakh', 'ܟܬܒܟ', 'ktāwākh', 'ktovokh', 'твоя книга (м.)', ['ktavakh']),
    w('ktaweh', 'ܟܬܒܗ', 'ktāweh', 'ktoveh', 'его книга', ['ktaveh']),
    w('ktawan', 'ܟܬܒܢ', 'ktāwan', 'ktovan', 'наша книга', ['ktavan']),
    w('ktawkhon', 'ܟܬܒܟܘܢ', 'ktāwkhōn', 'ktovkhun', 'ваша книга', ['ktavkhon']),
    w('ktawhon', 'ܟܬܒܗܘܢ', 'ktāwhōn', 'ktovhun', 'их книга', ['ktavhon']),
    w('bayty', 'ܒܝܬܝ', 'bayt(y)', 'bayt(y)', 'мой дом', ['bayt']),
    w('malkan', 'ܡܠܟܢ', 'malkan', 'malkan', 'наш царь'),
    w('maran', 'ܡܪܢ', 'māran', 'moran', 'наш Господь', ['maran', 'moran'])
  ];
  W.numbers2 = [
    w('hda', 'ܚܕܐ', 'ḥdā', 'ḥdo', 'одна (1, ж.)', ['hda', 'khda', 'hdo']),
    w('tarten', 'ܬܪܬܝܢ', 'tartēn', 'tarten', 'две (2, ж.)'),
    w('tlath', 'ܬܠܬ', 'tlāth', 'tloth', 'три (3, ж.)', ['tlat', 'tlot']),
    w('esar', 'ܥܣܪ', 'ʿsar', 'ʿsar', 'десять (10, ж.)', ['sar', 'esar']),
    w('esrin', 'ܥܣܪܝܢ', 'ʿesrīn', 'ʿesrin', 'двадцать (20)', ['esrin']),
    w('tlathin', 'ܬܠܬܝܢ', 'tlāthīn', 'tlothin', 'тридцать (30)', ['tlatin', 'tlotin']),
    w('mea', 'ܡܐܐ', 'mʾā', 'mʾo', 'сто (100)', ['ma', 'mo', 'mea']),
    w('alpa', 'ܐܠܦܐ', 'alpā', 'alfo', 'тысяча (1000)', ['alfa']),
    w('qadmaya', 'ܩܕܡܝܐ', 'qadmāyā', 'qadmoyo', 'первый'),
    w('trayyana', 'ܬܪܝܢܐ', 'trayyānā', 'trayono', 'второй', ['trayana'])
  ];

  // ---------------- B1 ----------------
  W.stems = [
    w('kthaw-p', 'ܟܬܒ', 'kthaw', 'kthav', 'он написал (пеаль)', ['ktaw', 'ktav']),
    w('ethkthew', 'ܐܬܟܬܒ', 'ethkthew', 'ethkthev', 'было написано (этпеэль)', ['etktew', 'etktev']),
    w('qtal', 'ܩܛܠ', 'qṭal', 'qṭal', 'он убил (пеаль)', ['qtal', 'ktal']),
    w('ethqtel', 'ܐܬܩܛܠ', 'ethqṭel', 'ethqṭel', 'он был убит (этпеэль)', ['etqtel']),
    w('qabbel', 'ܩܒܠ', 'qabbel', 'qabel', 'он принял (паэль)'),
    w('yelaf', 'ܝܠܦ', 'yelaf', 'yelaf', 'он выучил, научился (пеаль)'),
    w('allef', 'ܐܠܦ', 'allef', 'alef', 'он научил (паэль)', ['alef']),
    w('shammesh', 'ܫܡܫ', 'shammesh', 'shamesh', 'он служил (паэль)'),
    w('ashma', 'ܐܫܡܥ', 'ashmaʿ', 'ashmaʿ', 'он дал услышать, возвестил (афъель)', ['ashma'])
  ];
  W.weak = [
    w('nfaq', 'ܢܦܩ', 'nfaq', 'nfaq', 'он вышел', ['nfak']),
    w('nfal', 'ܢܦܠ', 'nfal', 'nfal', 'он упал'),
    w('ythew', 'ܝܬܒ', 'ythew', 'ythev', 'он сел', ['ytew', 'ytev']),
    w('yda', 'ܝܕܥ', 'ydaʿ', 'ydaʿ', 'он узнал', ['yda']),
    w('qam', 'ܩܡ', 'qām', 'qom', 'он встал', ['kam', 'kom']),
    w('mith', 'ܡܝܬ', 'mīth', 'mith', 'он умер', ['mit']),
    w('bna', 'ܒܢܐ', 'bnā', 'bno', 'он построил'),
    w('ekhal', 'ܐܟܠ', 'ekhal', 'ekhal', 'он съел'),
    w('shtha', 'ܫܬܐ', 'shthā', 'shtho', 'он выпил', ['shta', 'shto'])
  ];
  W.gospel = [
    w('yeshu', 'ܝܫܘܥ', 'Yeshūʿ', 'Yeshuʿ', 'Иисус', ['yeshu']),
    w('mshiha', 'ܡܫܝܚܐ', 'Mshīḥā', 'Mshiḥo', 'Мессия, Христос', ['mshikha', 'mshikho']),
    w('sbartha', 'ܣܒܪܬܐ', 'sbarthā', 'sbartho', 'весть, благая весть', ['sbarta', 'sbarto']),
    w('talmidha', 'ܬܠܡܝܕܐ', 'talmīdhā', 'talmidho', 'ученик', ['talmida', 'talmido']),
    w('mathla', 'ܡܬܠܐ', 'mathlā', 'mathlo', 'притча', ['matla', 'matlo']),
    w('zara', 'ܙܪܥܐ', 'zarʿā', 'zarʿo', 'семя', ['zara', 'zaro']),
    w('zaroa', 'ܙܪܘܥܐ', 'zārōʿā', 'zoruʿo', 'сеятель', ['zaroa', 'zorua']),
    w('pera', 'ܦܐܪܐ', 'pēʾrā', 'fiʾro', 'плод', ['pera', 'firo']),
    w('kensha', 'ܟܢܫܐ', 'kenshā', 'kensho', 'толпа, собрание'),
    w('urha', 'ܐܘܪܚܐ', 'urḥā', 'urḥo', 'дорога, путь', ['urkha', 'urkho'])
  ];

  // ---------------- B2 ----------------
  W.virtues = [
    w('haymanutha', 'ܗܝܡܢܘܬܐ', 'haymānūthā', 'haymonutho', 'вера', ['haymanuta']),
    w('hubba', 'ܚܘܒܐ', 'ḥubbā', 'ḥubo', 'любовь', ['khubba', 'hubba', 'hubo']),
    w('slotha', 'ܨܠܘܬܐ', 'ṣlōthā', 'ṣlutho', 'молитва', ['slota', 'sluto']),
    w('sawma', 'ܨܘܡܐ', 'ṣawmā', 'ṣawmo', 'пост', ['sawma', 'sawmo']),
    w('tyawutha', 'ܬܝܒܘܬܐ', 'tyāwūthā', 'tyovutho', 'покаяние', ['tyavuta']),
    w('hekhmtha', 'ܚܟܡܬܐ', 'ḥekhmthā', 'ḥekhmtho', 'мудрость', ['hekmta', 'khekhmtha']),
    w('shrara', 'ܫܪܪܐ', 'shrārā', 'shroro', 'истина'),
    w('hayye', 'ܚܝ̈ܐ', 'ḥayyē', 'ḥaye', 'жизнь', ['hayye', 'khaye']),
    w('mawtha', 'ܡܘܬܐ', 'mawthā', 'mawtho', 'смерть', ['mawta', 'mawto']),
    w('nafsha', 'ܢܦܫܐ', 'nafshā', 'nafsho', 'душа')
  ];
  W.hymns = [
    w('madrasha', 'ܡܕܪܫܐ', 'madrāshā', 'madrosho', 'мадраша (гимн со строфами)'),
    w('memra', 'ܡܐܡܪܐ', 'mēmrā', 'mimro', 'мимра (проповедь в стихах)', ['memra', 'mimra']),
    w('onitha', 'ܥܘܢܝܬܐ', 'ʿōnīthā', 'ʿunitho', 'припев, ответ хора', ['onita', 'unito']),
    w('qala', 'ܩܠܐ', 'qālā', 'qolo', 'голос; напев', ['kala', 'kolo']),
    w('zmara', 'ܙܡܪܐ', 'zmārā', 'zmoro', 'пение'),
    w('bthultha', 'ܒܬܘܠܬܐ', 'bthūltā', 'bthulto', 'дева', ['btulta']),
    w('raza', 'ܐܪܙܐ', 'rāzā', 'rozo', 'тайна; таинство'),
    w('pardaysa', 'ܦܪܕܝܣܐ', 'pardaysā', 'fardayso', 'рай', ['pardaysa', 'fardaysa']),
    w('marganitha', 'ܡܪܓܢܝܬܐ', 'margānīthā', 'marganitho', 'жемчужина', ['marganita']),
    w('shuwha', 'ܫܘܒܚܐ', 'shuwḥā', 'shubḥo', 'слава, хвала', ['shubha', 'shubho', 'shuwkha'])
  ];

  // ---------------- C1 ----------------
  W.theology = [
    w('ithutha', 'ܐܝܬܘܬܐ', 'ithūthā', 'ithutho', 'бытие, сущее', ['ituta']),
    w('qnoma', 'ܩܢܘܡܐ', 'qnōmā', 'qnumo', 'ипостась (кнома)', ['knoma', 'qnuma']),
    w('kyana', 'ܟܝܢܐ', 'kyānā', 'kyono', 'природа (кьяна)'),
    w('parsopa', 'ܦܪܨܘܦܐ', 'parṣōpā', 'farṣufo', 'лицо (парцопа)', ['parsopa', 'farsufo']),
    w('alahutha', 'ܐܠܗܘܬܐ', 'alāhūthā', 'alohutho', 'божество', ['alahuta']),
    w('barnashutha', 'ܒܪܢܫܘܬܐ', 'barnāshūthā', 'barnoshutho', 'человечество (человеческая природа)', ['barnashuta']),
    w('tlithayutha', 'ܬܠܝܬܝܘܬܐ', 'tlīthāyūthā', 'tlithoyutho', 'Троица', ['tlitayuta']),
    w('mhaymnana', 'ܡܗܝܡܢܐ', 'mhaymnā', 'mhaymno', 'верующий, верный'),
    w('mpashqana', 'ܡܦܫܩܢܐ', 'mpashqānā', 'mfashqono', 'толкователь (экзегет)'),
    w('pushshaqa', 'ܦܘܫܩܐ', 'pushshāqā', 'fushoqo', 'толкование', ['pushaqa'])
  ];
  W.grammar = [
    w('nuqza', 'ܢܘܩܙܐ', 'nuqzā', 'nuqzo', 'точка (диакритическая)', ['nukza']),
    w('rukkakha', 'ܪܘܟܟܐ', 'rukkākhā', 'rukokho', 'рукаха (мягкое произношение)', ['rukakha']),
    w('qushshaya', 'ܩܘܫܝܐ', 'qushshāyā', 'qushoyo', 'кушшая (твёрдое произношение)', ['qushaya']),
    w('zawa', 'ܙܘܥܐ', 'zawʿā', 'zawʿo', 'гласная (букв. «движение»)', ['zawa', 'zawo']),
    w('athwatha', 'ܐܬܘ̈ܬܐ', 'āthwāthā', 'othwotho', 'буквы', ['atwata', 'otwoto']),
    w('shersha', 'ܫܪܫܐ', 'shershā', 'shersho', 'корень'),
    w('qeryana', 'ܩܪܝܢܐ', 'qeryānā', 'qeryono', 'чтение; чтение Писания'),
    w('mashlmanutha', 'ܡܫܠܡܢܘܬܐ', 'mashlmānūthā', 'mashlmonutho', 'предание, традиция', ['mashlmanuta']),
    w('mafryana', 'ܡܦܪܝܢܐ', 'mafryānā', 'mafryono', 'мафриан (глава церкви на Востоке у западных сирийцев)'),
    w('dayra', 'ܕܝܪܐ', 'dayrā', 'dayro', 'монастырь')
  ];

  // ---------------- C2 ----------------
  W.manuscripts = [
    w('nusha', 'ܢܘܣܚܐ', 'nusḥā', 'nusḥo', 'список, рукопись', ['nuskha', 'nusha']),
    w('kathowa', 'ܟܬܘܒܐ', 'kāthōwā', 'kothuvo', 'писец', ['katowa', 'kotuvo']),
    w('dayraya', 'ܕܝܪܝܐ', 'dayrāyā', 'dayroyo', 'монах'),
    w('penqitha', 'ܦܢܩܝܬܐ', 'penqīthā', 'fenqitho', 'том, сборник (пенкита)', ['penqita', 'fenqito']),
    w('huttama', 'ܚܘܬܡܐ', 'ḥuttāmā', 'ḥutomo', 'окончание, колофон (букв. «печать»)', ['huttama', 'khutama']),
    w('shantha', 'ܫܢܬܐ', 'shantā', 'shanto', 'год'),
    w('eggartha', 'ܐܓܪܬܐ', 'eggarthā', 'egartho', 'послание, письмо', ['eggarta', 'egarto']),
    w('hattaya', 'ܚܛܝܐ', 'ḥaṭṭāyā', 'ḥaṭoyo', 'грешный, грешник', ['hattaya', 'khatoyo']),
    w('tupsa', 'ܛܘܦܣܐ', 'ṭupsā', 'ṭufso', 'образец, копия', ['tupsa', 'tufso'])
  ];
  W.versions = [
    w('pshitta', 'ܦܫܝܛܬܐ', 'Pshīṭtā', 'Pshiṭto', 'Пешитта (букв. «простая»)', ['pshitta', 'pshito']),
    w('harqlayta', 'ܚܪܩܠܝܬܐ', 'Ḥarqlāytā', 'Ḥarqloyto', 'Харклеянская (версия)', ['harqlayta', 'kharqloyto']),
    w('diatessaron', 'ܕܝܛܣܪܘܢ', 'Diyaṭessrōn', 'Diyaṭessrun', 'Диатессарон', ['diatessaron']),
    w('mappaqta', 'ܡܦܩܬܐ', 'mappaqtā', 'mafaqto', 'версия, издание (букв. «выведение»)', ['mapaqta']),
    w('mtargmana', 'ܡܬܪܓܡܢܐ', 'mtargmānā', 'mtargmono', 'переводчик'),
    w('dyatheqe', 'ܕܝܬܩܐ', 'dyāthēqē', 'dyothiqe', 'завет', ['dyateqe']),
    w('attiqtha', 'ܥܬܝܩܬܐ', 'ʿattīqtā', 'ʿatiqto', 'Ветхий (Завет)', ['attiqta', 'atiqto']),
    w('hdattha', 'ܚܕܬܐ', 'ḥdattā', 'ḥdatto', 'Новый (Завет)', ['hdatta', 'khdatta']),
    w('sapra', 'ܣܦܪܐ', 'sāprā', 'sofro', 'книжник, писатель', ['sofro'])
  ];

  var levels = [
    {
      id: 'a2', code: 'A2', cefr: 'Предпороговый уровень (Waystage)', title: 'Элементарный', status: 'open',
      can: 'Читаю простые предложения из Пешитты, различаю состояния имени и число, понимаю прошедшее и будущее время.',
      summary: 'Имя: состояния, число, суффиксы. Полное прошедшее, будущее и повелительное. Чтение: Быт 1:1–3.',
      units: [
        { id: 'u1', kind: 'words', words: 'states', title: 'Три состояния имени',
          intro: 'У сирийского существительного три «состояния». Эмфатическое (ܡܠܟܐ malkā / malko) — обычная словарная форма. Абсолютное (ܡܠܟ melekh) — в оборотах «хорош», «всякий», при числах. Сопряжённое (ܒܝܬ bēth / beth) — перед другим именем: ܒܝܬ ܡܠܟܐ bēth malkā «дом царя».',
          table: [['Эмфатическое', 'ܡܠܟܐ malkā / malko — «царь»'], ['Абсолютное', 'ܡܠܟ melekh — «царь» (без артикля)'], ['Сопряжённое', 'ܡܠܟ ܐܪܥܐ malk arʿā — «царь земли»']] },
        { id: 'u2', kind: 'words', words: 'plural', title: 'Множественное число и сяме (ܡܠܟ̈ܐ)',
          intro: 'Две точки над словом — сяме (ܣܝܡܐ syāmē / syome) — показывают множественное число, потому что без огласовок ܡܠܟܐ malkā «царь» и ܡܠܟ̈ܐ malkē «цари» пишутся одинаково. Мужской род: -ē / -e; женский: -āthā / -otho.' },
        { id: 'u3', kind: 'words', words: 'suffixes', title: 'Мой, твой, наш: притяжательные суффиксы',
          intro: 'Притяжательные местоимения — это окончания: ܟܬܒܝ ktāw(y) «моя книга», ܟܬܒܟ ktāwākh / ktovokh «твоя», ܟܬܒܗ ktāweh «его», ܟܬܒܢ ktāwan «наша». Конечная ܝ в «моя» пишется, но не читается.' },
        { id: 'u4', kind: 'sentences', title: 'Прошедшее время: все лица',
          intro: 'Прошедшее время (перфект) изменяется окончаниями: kthaw «он», kethbath «она», kthavt «ты», ktheveth «я», kthaw(w) «они», kthawnan «мы», kthawtōn / kthavtun «вы». Личное местоимение часто ставят рядом, чтобы снять неоднозначность письма.',
          table: [['ܗܘ ܟܬܒ', 'hū kthaw / hu kthav — он написал'], ['ܗܝ ܟܬܒܬ', 'hī kethbath — она написала'], ['ܐܢܐ ܟܬܒܬ', 'enā ktheveth / eno ktheveth — я написал'], ['ܚܢܢ ܟܬܒܢ', 'ḥnan kthawn — мы написали (короткая форма)'], ['ܐܢܘܢ ܟܬܒܘ', 'ennōn kthaw / enun kthav — они написали']],
          sentences: [
            s('ܡܠܟܐ ܟܬܒ ܐܓܪܬܐ', 'Malkā kthaw eggarthā.', 'Malko kthav egartho.', 'Царь написал письмо.'),
            s('ܐܢܐ ܟܬܒܬ ܟܬܒܐ', 'Enā ktheveth ktāwā.', 'Eno ktheveth ktovo.', 'Я написал книгу.'),
            s('ܗܝ ܐܙܠܬ ܠܡܕܝܢܬܐ', 'Hī ezlath lamdīttā.', 'Hi ezlath lamdito.', 'Она пошла в город.'),
            s('ܚܢܢ ܫܡܥܢ ܡܠܬܐ', 'Ḥnan shmaʿn melthā.', 'Ḥnan shmaʿn meltho.', 'Мы услышали слово.'),
            s('ܐܢܘܢ ܐܬܘ ܠܒܝܬܐ', 'Ennōn ethaw l-vaytā.', 'Enun ethaw l-vayto.', 'Они пришли домой.'),
            s('ܐܢܬܘܢ ܚܙܝܬܘܢ ܡܠܟܐ', 'Attōn ḥzaytōn malkā.', 'Atun ḥzaytun malko.', 'Вы увидели царя.')
          ] },
        { id: 'u5', kind: 'sentences', title: 'Будущее время и повелительное',
          intro: 'Имперфект (будущее, желание) образуется приставками: e- «я», ne- «он, мы», te- «ты, она»: ܐܟܬܘܒ ekhtōw «я напишу», ܢܟܬܘܒ nekhtōw «он напишет». Повелительное — короткая основа: ܟܬܘܒ ktōw / ktuv «напиши!», ܫܡܥ shmaʿ «слушай!».',
          sentences: [
            s('ܐܢܐ ܐܟܬܘܒ ܐܓܪܬܐ', 'Enā ekhtōw eggarthā.', 'Eno ekhtuv egartho.', 'Я напишу письмо.'),
            s('ܗܘ ܢܐܙܠ ܠܒܝܬܐ', 'Hū nēzal l-vaytā.', 'Hu nizal l-vayto.', 'Он пойдёт домой.'),
            s('ܚܢܢ ܢܫܡܥ ܡܠܬܟ', 'Ḥnan neshmaʿ melthākh.', 'Ḥnan neshmaʿ melthokh.', 'Мы услышим твоё слово.'),
            s('ܬܐ ܠܗܪܟܐ', 'Tā l-hārkā!', 'To l-horko!', 'Иди сюда!'),
            s('ܟܬܘܒ ܗܕܐ', 'Ktōw hādhē!', 'Ktuv hodhe!', 'Напиши это!'),
            s('ܫܡܥ ܐܝܣܪܝܠ', 'Shmaʿ Isrāʾēl!', 'Shmaʿ Isroʾil!', 'Слушай, Израиль!')
          ] },
        { id: 'u6', kind: 'words', words: 'numbers2', title: 'Числа: женский род, десятки, порядковые',
          intro: 'Числа 1–10 различают род, причём «обратно»: с мужскими именами — форма на -ā (ܬܠܬܐ tlāthā), с женскими — короткая (ܬܠܬ tlāth). Десятки оканчиваются на -īn: ܥܣܪܝܢ ʿesrīn «20».' },
        { id: 'u7', kind: 'reading', title: 'Чтение: «В начале» (Быт 1:1–3)',
          intro: 'Первые стихи Книги Бытия по Пешитте. Переключите «Чтение» вверху, чтобы сравнить восточное и западное произношение.',
          text: [
            s('ܒܪܫܝܬ ܒܪܐ ܐܠܗܐ ܝܬ ܫܡܝܐ ܘܝܬ ܐܪܥܐ', 'Brēshīth brā alāhā yāth shmayyā w-yāth arʿā.', 'Breshith bro aloho yoth shmayo w-yoth arʿo.', 'В начале сотворил Бог небо и землю.'),
            s('ܘܐܪܥܐ ܗܘܬ ܬܘܗ ܘܒܘܗ', 'W-arʿā hwāth tōh w-vōh.', 'W-arʿo hwoth tuh w-vuh.', 'Земля же была безвидна и пуста,'),
            s('ܘܚܫܘܟܐ ܥܠ ܐܦܝ ܬܗܘܡܐ', 'W-ḥeshōkhā ʿal appay thōmā.', 'W-ḥeshukho ʿal afay thumo.', 'и тьма над бездною,'),
            s('ܘܪܘܚܗ ܕܐܠܗܐ ܡܪܚܦܐ ܥܠ ܐܦܝ ܡܝܐ', 'W-rūḥeh d-alāhā mraḥḥpā ʿal appay mayyā.', 'W-ruḥeh d-aloho mraḥfo ʿal afay mayo.', 'и Дух Божий носился над водою.'),
            s('ܘܐܡܪ ܐܠܗܐ ܢܗܘܐ ܢܘܗܪܐ ܘܗܘܐ ܢܘܗܪܐ', 'W-emar alāhā nehwē nuhrā w-hwā nuhrā.', 'W-emar aloho nehwe nuhro w-hwo nuhro.', 'И сказал Бог: да будет свет. И стал свет.')
          ],
          questions: [
            { q: 'Что сотворил Бог в начале?', options: ['небо и землю', 'свет', 'воду', 'человека'] },
            { q: 'Какой была земля?', options: ['безвидной и пустой', 'зелёной', 'полной людей', 'светлой'] },
            { q: 'Над чем носился Дух Божий?', options: ['над водою', 'над горами', 'над городом', 'над пустыней'] },
            { q: 'Что сказал Бог?', options: ['да будет свет', 'да будет вода', 'да будет ночь', 'да будет царь'] }
          ] },
        { id: 'test', kind: 'test', title: 'Итоговый тест A2', intro: 'Двадцать вопросов по урокам уровня A2. Для сертификата нужно 70%.' }
      ]
    },
    {
      id: 'b1', code: 'B1', cefr: 'Пороговый уровень (Threshold)', title: 'Средний', status: 'open',
      can: 'Читаю повествовательные тексты Пешитты со словарём, узнаю породы глагола, слабые корни и причастия.',
      summary: 'Породы глагола, слабые корни, причастия, местоименные суффиксы. Чтение: притча о сеятеле.',
      units: [
        { id: 'u1', kind: 'words', words: 'stems', title: 'Породы глагола: пеаль, паэль, афъель',
          intro: 'Из одного корня образуются «породы» (ܙܢܝ̈ܐ znayyā): пеаль — простая основа (ܩܛܠ qṭal «убил»), паэль — с удвоением средней буквы (ܩܒܠ qabbel «принял»), афъель — с приставкой a- (ܐܫܡܥ ashmaʿ «дал услышать»). У каждой есть возвратно-страдательная пара с eth-: ܐܬܩܛܠ ethqṭel «был убит».',
          table: [['Пеаль / этпеэль', 'ܩܛܠ qṭal — ܐܬܩܛܠ ethqṭel'], ['Паэль / этпаал', 'ܩܒܠ qabbel — ܐܬܩܒܠ ethqabbal'], ['Афъель / эттафъаль', 'ܐܫܡܥ ashmaʿ — ܐܬܬܫܡܥ ettashmaʿ']] },
        { id: 'u2', kind: 'words', words: 'weak', title: 'Слабые корни',
          intro: 'Если в корне есть ܐ, ܘ, ܝ или ܢ, формы меняются: ܢ в начале часто выпадает (ܢܦܩ nfaq «вышел» → ܢܦܘܩ neppuq «выйдет»), полые корни теряют среднюю букву (ܩܡ qām / qom «встал»), корни на -ā оканчиваются на ܐ (ܒܢܐ bnā / bno «построил»).' },
        { id: 'u3', kind: 'sentences', title: 'Причастия и сложные времена с ܗܘܐ',
          intro: 'Действительное причастие (ܟܬܒ kāthew / kothev «пишущий») с местоимением выражает настоящее время: ܟܬܒ ܐܢܐ kāthewnā «я пишу». С ܗܘܐ (h)wā / wo оно даёт длительное прошедшее: ܐܡܪ ܗܘܐ āmar wā «он говорил».',
          sentences: [
            s('ܐܢܐ ܟܬܒ ܐܢܐ', 'Enā kāthewnā.', 'Eno kothevno.', 'Я пишу.'),
            s('ܗܘ ܐܡܪ ܗܘܐ', 'Hū āmar wā.', 'Hu omar wo.', 'Он говорил.'),
            s('ܚܢܢ ܝܠܦܝܢܢ', 'Ḥnan yālpīnan.', 'Ḥnan yolfinan.', 'Мы учимся.'),
            s('ܡܠܟܐ ܝܬܒ ܗܘܐ ܥܠ ܟܘܪܣܝܐ', 'Malkā yāthew wā ʿal kursyā.', 'Malko yothev wo ʿal kursyo.', 'Царь сидел на троне.'),
            s('ܬܠܡܝܕ̈ܐ ܫܡܥܝܢ ܗܘܘ', 'Talmīdhē shāmʿīn waw.', 'Talmidhe shomʿin waw.', 'Ученики слушали.'),
            s('ܐܢܬ ܩܪܐ ܐܢܬ', 'At qārē-at.', 'At qore-at.', 'Ты читаешь.')
          ] },
        { id: 'u4', kind: 'sentences', title: 'Местоименные суффиксы при глаголе',
          intro: 'Прямое дополнение-местоимение присоединяется к глаголу: ܩܛܠܗ qaṭleh «он убил его». Часто его дублируют предлогом ܠ: ܚܙܝܬܗ ܠܡܠܟܐ «я увидел (его) царя» — характерная сирийская конструкция.',
          sentences: [
            s('ܚܙܝܬܗ ܠܡܠܟܐ', 'Ḥzītheh l-malkā.', 'Ḥzitheh l-malko.', 'Я увидел царя.'),
            s('ܫܐܠܗ ܠܝܫܘܥ', 'Sheʾleh l-Yeshūʿ.', 'Sheʾleh l-Yeshuʿ.', 'Он спросил Иисуса.'),
            s('ܐܚܕܘܗܝ ܠܓܒܪܐ', 'Eḥdūhī l-gawrā.', 'Eḥduy l-gavro.', 'Они схватили мужчину.'),
            s('ܝܗܒ ܠܢ ܠܚܡܐ', 'Yhaw lan laḥmā.', 'Yhav lan laḥmo.', 'Он дал нам хлеб.'),
            s('ܐܡܪ ܠܗܘܢ ܡܬܠܐ', 'Emar lhōn mathlā.', 'Emar lhun mathlo.', 'Он сказал им притчу.')
          ] },
        { id: 'u5', kind: 'words', words: 'gospel', title: 'Слова Евангелия',
          intro: 'Лексика для чтения Евангелий по Пешитте. ܡܫܝܚܐ Mshīḥā / Mshiḥo — «Помазанник», то есть Мессия, Христос.' },
        { id: 'u6', kind: 'reading', title: 'Чтение: притча о сеятеле',
          intro: 'Адаптированный пересказ притчи о сеятеле (Мф 13:3–8) языком Пешитты. Это учебный текст, не точная цитата.',
          text: [
            s('ܗܐ ܢܦܩ ܙܪܘܥܐ ܠܡܙܪܥ', 'Hā nfaq zārōʿā l-mezraʿ.', 'Ho nfaq zoruʿo l-mezraʿ.', 'Вот, вышел сеятель сеять.'),
            s('ܘܟܕ ܙܪܥ ܐܝܬ ܕܢܦܠ ܥܠ ܝܕ ܐܘܪܚܐ', 'W-kad zraʿ ith d-nfal ʿal yad urḥā.', 'W-kad zraʿ ith d-nfal ʿal yad urḥo.', 'И когда он сеял, иное упало при дороге,'),
            s('ܘܐܬܘ ܦܪܚܬܐ ܘܐܟܠܘܗܝ', 'W-ethaw pāraḥtā w-ekhlūhī.', 'W-ethaw foraḥto w-ekhluy.', 'и прилетели птицы и склевали его.'),
            s('ܘܐܚܪܢܐ ܢܦܠ ܒܐܪܥܐ ܛܒܬܐ', 'W-ḥrēnā nfal b-arʿā ṭāwtā.', 'W-ḥreno nfal b-arʿo ṭovto.', 'А иное упало на добрую землю'),
            s('ܘܝܗܒ ܦܐܪ̈ܐ', 'W-yhaw pēʾrē.', 'W-yhav fiʾre.', 'и принесло плод.')
          ],
          questions: [
            { q: 'Кто вышел сеять?', options: ['сеятель', 'царь', 'ученик', 'писец'] },
            { q: 'Что сделали птицы?', options: ['склевали семя', 'принесли воду', 'построили гнездо', 'улетели'] },
            { q: 'Какое семя принесло плод?', options: ['упавшее на добрую землю', 'упавшее при дороге', 'упавшее в воду', 'никакое'] }
          ] },
        { id: 'test', kind: 'test', title: 'Итоговый тест B1', intro: 'Двадцать вопросов по урокам уровня B1. Для сертификата нужно 70%.' }
      ]
    },
    {
      id: 'b2', code: 'B2', cefr: 'Пороговый продвинутый уровень (Vantage)', title: 'Выше среднего', status: 'open',
      can: 'Читаю неогласованную прозу и гимны ранних авторов, понимаю придаточные и условные предложения.',
      summary: 'Частица ܕ и придаточные, условные предложения, язык Афраата и Ефрема Сирина.',
      units: [
        { id: 'u1', kind: 'sentences', title: 'Частица ܕ: «который», «что», «чтобы»',
          intro: 'Одна частица ܕ (d-) делает очень многое: вводит определение («который»), принадлежность (ܟܬܒܐ ܕܡܠܟܐ «книга царя»), изъяснительное («что») и цель («чтобы»). Часто имя заранее отмечено суффиксом: ܒܝܬܗ ܕܡܠܟܐ baytheh d-malkā «дом царя».',
          sentences: [
            s('ܓܒܪܐ ܕܐܬܐ ܐܚܝ ܗܘ', 'Gawrā d-ethā aḥ(y) hū.', 'Gavro d-etho aḥ(y) hu.', 'Человек, который пришёл, — мой брат.'),
            s('ܐܬܝܬ ܕܐܚܙܝܟ', 'Ethīth d-eḥzyākh.', 'Ethith d-eḥzyokh.', 'Я пришёл, чтобы увидеть тебя.'),
            s('ܒܝܬܗ ܕܡܠܟܐ', 'Baytheh d-malkā.', 'Baytheh d-malko.', 'Дом царя.'),
            s('ܡܢ ܕܫܡܥ ܢܗܝܡܢ', 'Man d-shmaʿ nhaymen.', 'Man d-shmaʿ nhaymen.', 'Кто услышал, пусть уверует.'),
            s('ܐܡܪ ܕܐܬܐ ܐܢܐ', 'Emar d-āthē-nā.', 'Emar d-othe-no.', 'Он сказал: «Я приду».')
          ] },
        { id: 'u2', kind: 'sentences', title: 'Условные предложения: ܐܢ и ܐܠܘ',
          intro: 'ܐܢ en «если» — реальное условие, ܐܠܘ ellū / elu «если бы» — нереальное. В главной части нереального условия стоит прошедшее с ܗܘܐ: «не умер бы».',
          sentences: [
            s('ܐܢ ܬܐܬܐ ܢܚܙܐ', 'En tēthē neḥzē.', 'En tithe neḥze.', 'Если придёшь, увидим.'),
            s('ܐܢ ܐܢܬ ܗܘ ܡܫܝܚܐ ܐܡܪ ܠܢ', 'En at hū Mshīḥā, emar lan.', 'En at hu Mshiḥo, emar lan.', 'Если Ты Христос, скажи нам.'),
            s('ܐܠܘ ܬܢܢ ܗܘܝܬ ܠܐ ܡܐܬ ܗܘܐ ܐܚܝ', 'Ellū tnān hwayt, lā mīth wā aḥ(y).', 'Elu tnon hwayt, lo mith wo aḥ(y).', 'Если бы Ты был здесь, не умер бы мой брат.'),
            s('ܐܢ ܠܐ ܬܬܘܒܘܢ', 'En lā tethūwūn…', 'En lo tethuvun…', 'Если не покаетесь…'),
            s('ܐܢ ܨܒܐ ܐܢܬ', 'En ṣāwē-at…', 'En ṣove-at…', 'Если хочешь…')
          ] },
        { id: 'u3', kind: 'words', words: 'virtues', title: 'Вера, любовь, молитва: язык Афраата',
          intro: 'Афраат, «Персидский мудрец» (IV в.), написал 23 «Наставления» (ܬܚܘܝܬܐ taḥwyāthā) о вере, любви, посте и молитве — первую большую прозу на сирийском. Отвлечённые имена часто оканчиваются на -ūthā / -utho.' },
        { id: 'u4', kind: 'reading', title: 'Чтение: вера подобна дому',
          intro: 'Адаптированный текст по образу «Наставления о вере» Афраата, где вера сравнивается со зданием. Учебный текст, не цитата.',
          text: [
            s('ܗܝܡܢܘܬܐ ܐܝܟ ܒܝܬܐ ܗܝ', 'Haymānūthā akh baytā hī.', 'Haymonutho akh bayto hi.', 'Вера подобна дому.'),
            s('ܫܬܐܣܬܗ ܕܒܝܬܐ ܡܫܝܚܐ ܗܘ', 'Shetāsteh d-vaytā Mshīḥā hū.', 'Shetosteh d-vayto Mshiḥo hu.', 'Основание дома — Христос.'),
            s('ܘܥܠ ܫܬܐܣܬܐ ܡܬܒܢܐ ܒܝܬܐ', 'W-ʿal shetāstā methbnē baytā.', 'W-ʿal shetosto methbne bayto.', 'И на основании строится дом.'),
            s('ܨܠܘܬܐ ܘܨܘܡܐ ܘܚܘܒܐ ܟܐܦ̈ܐ ܐܢܝܢ ܕܒܝܬܐ', 'Ṣlōthā w-ṣawmā w-ḥubbā kēʾpē ennēn d-vaytā.', 'Ṣlutho w-ṣawmo w-ḥubo kifē enin d-vayto.', 'Молитва, пост и любовь — камни дома.'),
            s('ܒܪ ܐܢܫܐ ܕܡܗܝܡܢ ܗܝܟܠܐ ܗܘ ܕܐܠܗܐ', 'Bar nāshā da-mhaymen haykhlā hū d-alāhā.', 'Bar nosho da-mhaymen haykhlo hu d-aloho.', 'Верующий человек — храм Божий.')
          ],
          questions: [
            { q: 'Чему подобна вера?', options: ['дому', 'реке', 'дереву', 'дороге'] },
            { q: 'Что является основанием дома?', options: ['Христос', 'молитва', 'камень', 'закон'] },
            { q: 'Что названо камнями дома?', options: ['молитва, пост и любовь', 'золото и серебро', 'книги', 'слова царя'] },
            { q: 'Кем назван верующий человек?', options: ['храмом Божьим', 'царём', 'писцом', 'странником'] }
          ] },
        { id: 'u5', kind: 'words', words: 'hymns', title: 'Мадраша и мимра: язык Ефрема Сирина',
          intro: 'Ефрем Сирин (IV в.) — величайший сирийский поэт. Его мадраши (ܡܕܪܫ̈ܐ madrāshē) — гимны со строфами и припевом (ܥܘܢܝܬܐ ʿōnīthā), которые пел хор; мимры (ܡܐܡܪ̈ܐ mēmrē) — стихотворные проповеди одним размером.' },
        { id: 'u6', kind: 'reading', title: 'Чтение: гимн о свете',
          intro: 'Короткий учебный гимн в духе мадраш Ефрема (с его любимыми образами света и жемчужины). Не цитата.',
          text: [
            s('ܒܪܝܟ ܗܘ ܕܐܬܐ ܠܘܬܢ', 'Brīkh hū d-ethā lwāthan.', 'Brikh hu d-etho lwothan.', 'Благословен Тот, кто пришёл к нам.'),
            s('ܢܘܗܪܐ ܕܢܚ ܒܥܠܡܐ', 'Nuhrā dnaḥ b-ʿālmā.', 'Nuhro dnaḥ b-ʿolmo.', 'Свет воссиял в мире.'),
            s('ܡܪܓܢܝܬܐ ܐܪܙܐ ܗܝ', 'Margānīthā rāzā hī.', 'Marganitho rozo hi.', 'Жемчужина — это тайна.'),
            s('ܘܒܬܘܠܬܐ ܝܠܕܬ ܢܘܗܪܐ', 'W-vthūltā yeldath nuhrā.', 'W-vthulto yeldath nuhro.', 'И Дева родила Свет.'),
            s('ܫܘܒܚܐ ܠܟ ܡܪܢ', 'Shuwḥā lākh māran!', 'Shubḥo lokh moran!', 'Слава Тебе, Господь наш!')
          ],
          questions: [
            { q: 'Что воссияло в мире?', options: ['свет', 'тьма', 'звезда', 'огонь'] },
            { q: 'Что названо тайной?', options: ['жемчужина', 'книга', 'дом', 'море'] },
            { q: 'Кто родил Свет?', options: ['Дева', 'царь', 'земля', 'народ'] },
            { q: 'Кому возносится слава?', options: ['Господу', 'царю', 'поэту', 'народу'] }
          ] },
        { id: 'test', kind: 'test', title: 'Итоговый тест B2', intro: 'Двадцать вопросов по урокам уровня B2. Для сертификата нужно 70%.' }
      ]
    },
    {
      id: 'c1', code: 'C1', cefr: 'Уровень профессионального владения (Effective Operational Proficiency)', title: 'Продвинутый', status: 'open',
      can: 'Свободно читаю богословскую прозу и литургические тексты, понимаю терминологию обеих традиций и сирийскую грамматическую традицию.',
      summary: 'Богословский словарь, Символ веры, литургия, Бар Эбрая и язык грамматистов.',
      units: [
        { id: 'u1', kind: 'words', words: 'theology', title: 'Богословский словарь',
          intro: 'Сирийское богословие пользуется собственными терминами: ܟܝܢܐ kyānā / kyono «природа», ܩܢܘܡܐ qnōmā / qnumo «ипостась», ܦܪܨܘܦܐ parṣōpā / farṣufo «лицо». Церковь Востока говорит о двух природах и двух кномах в одном парцопе, Сирийская православная церковь — об одной природе воплощённого Слова. Курс объясняет термины, а не спор.' },
        { id: 'u2', kind: 'reading', title: 'Чтение: Символ веры (начало)',
          intro: 'Начало Никео-Константинопольского Символа веры в сирийском литургическом переводе. Формулировки в изданиях восточной и западной церквей немного различаются.',
          text: [
            s('ܡܗܝܡܢܝܢܢ ܒܚܕ ܐܠܗܐ', 'Mhaymnīnan b-ḥad alāhā,', 'Mhaymninan b-ḥad aloho,', 'Веруем во единого Бога,'),
            s('ܐܒܐ ܐܚܝܕ ܟܠ', 'abbā aḥīdh kōl,', 'abo aḥidh kul,', 'Отца Вседержителя,'),
            s('ܥܒܘܕܐ ܕܫܡܝܐ ܘܕܐܪܥܐ', 'ʿāwōdhā da-shmayyā w-d-arʿā,', 'ʿovudho da-shmayo w-d-arʿo,', 'Творца неба и земли,'),
            s('ܘܒܚܕ ܡܪܝܐ ܝܫܘܥ ܡܫܝܚܐ', 'w-va-ḥad māryā Yeshūʿ Mshīḥā,', 'w-va-ḥad moryo Yeshuʿ Mshiḥo,', 'и во единого Господа Иисуса Христа,'),
            s('ܒܪܗ ܕܐܠܗܐ ܝܚܝܕܝܐ', 'breh d-alāhā yḥīdhāyā.', 'breh d-aloho yḥidhoyo.', 'Сына Божия Единородного.')
          ],
          questions: [
            { q: 'Во что исповедуется вера в первой строке?', options: ['во единого Бога', 'в царя', 'в закон', 'в мир'] },
            { q: 'Как назван Отец?', options: ['Вседержителем', 'Учителем', 'Царём земли', 'Судьёй'] },
            { q: 'Творцом чего назван Бог?', options: ['неба и земли', 'моря', 'людей', 'книг'] },
            { q: 'Как назван Сын?', options: ['Единородным', 'Первым', 'Младшим', 'Новым'] }
          ] },
        { id: 'u3', kind: 'sentences', title: 'Литургические возгласы',
          intro: 'Возгласы, общие для восточного и западного обрядов. Трисвятое (ܩܕܝܫܐ ܐܠܗܐ) звучит в обеих традициях.',
          sentences: [
            s('ܫܠܡܐ ܥܡܟܘܢ', 'Shlāmā ʿammkhōn.', 'Shlomo ʿamkhun.', 'Мир вам.'),
            s('ܘܥܡ ܪܘܚܟ', 'W-ʿam rūḥākh.', 'W-ʿam ruḥokh.', 'И духови твоему.'),
            s('ܩܕܝܫܐ ܐܠܗܐ', 'Qaddīshā alāhā,', 'Qadisho aloho,', 'Святый Боже,'),
            s('ܩܕܝܫܐ ܚܝܠܬܢܐ', 'Qaddīshā ḥaylthānā,', 'Qadisho ḥaylthono,', 'Святый Крепкий,'),
            s('ܩܕܝܫܐ ܠܐ ܡܝܘܬܐ ܐܬܪܚܡ ܥܠܝܢ', 'Qaddīshā lā māyōthā, ethraḥam ʿlayn.', 'Qadisho lo moyutho, ethraḥam ʿlayn.', 'Святый Бессмертный, помилуй нас.'),
            s('ܫܘܒܚܐ ܠܐܒܐ ܘܠܒܪܐ ܘܠܪܘܚܐ ܕܩܘܕܫܐ', 'Shuwḥā l-abbā w-la-vrā w-la-rūḥā d-qudshā.', 'Shubḥo l-abo w-la-vro w-la-ruḥo d-qudsho.', 'Слава Отцу и Сыну и Святому Духу.')
          ] },
        { id: 'u4', kind: 'words', words: 'grammar', title: 'Язык грамматистов и масоры',
          intro: 'Сирийские грамматисты (Иаков Эдесский, Илия Собский, Бар Эбрая) описали язык своими терминами. Масора — традиция правильного чтения Писания — по-разному сложилась у восточных и западных сирийцев; от неё и две системы огласовок.' },
        { id: 'u5', kind: 'reading', title: 'Чтение: Бар Эбрая',
          intro: 'Учебный текст о Григории Бар Эбрае (1226–1286), учёном и главе Сирийской православной церкви на Востоке.',
          text: [
            s('ܓܪܝܓܘܪܝܘܣ ܒܪ ܥܒܪܝܐ ܡܦܪܝܢܐ ܗܘܐ', 'Grīgōriyōs Bar ʿEwrāyā mafryānā wā.', 'Grigoriyos Bar ʿEbroyo mafryono wo.', 'Григорий Бар Эбрая был мафрианом.'),
            s('ܟܬܒ ܟܬܒ̈ܐ ܣܓܝܐ̈ܐ', 'Kthaw ktāwē saggīʾē.', 'Kthav ktove sagiʾe.', 'Он написал много книг.'),
            s('ܟܬܒ ܥܠ ܓܪܡܛܝܩܝ ܘܥܠ ܬܫܥܝܬܐ', 'Kthaw ʿal grammaṭīqī w-ʿal tashʿīthā.', 'Kthav ʿal grammaṭiqi w-ʿal tashʿitho.', 'Он писал о грамматике и об истории.'),
            s('ܡܝܬ ܒܡܪܓܐ', 'Mīth b-Marāghā.', 'Mith b-Moragho.', 'Он умер в Мараге.'),
            s('ܘܐܬܩܒܪ ܒܕܝܪܐ ܕܡܪܝ ܡܬܝ', 'W-ethqbar b-dayrā d-Mār Mattay.', 'W-ethqbar b-dayro d-Mor Mattay.', 'И был похоронен в монастыре Мар Маттай.')
          ],
          questions: [
            { q: 'Кем был Бар Эбрая?', options: ['мафрианом', 'царём', 'писцом', 'купцом'] },
            { q: 'О чём он писал?', options: ['о грамматике и истории', 'только о медицине', 'о море', 'только стихи'] },
            { q: 'Где он умер?', options: ['в Мараге', 'в Эдессе', 'в Нисибине', 'в Антиохии'] },
            { q: 'Где он похоронен?', options: ['в монастыре Мар Маттай', 'в Иерусалиме', 'в Константинополе', 'в Урмии'] }
          ] },
        { id: 'test', kind: 'test', title: 'Итоговый тест C1', intro: 'Двадцать вопросов по урокам уровня C1. Для сертификата нужно 70%.' }
      ]
    },
    {
      id: 'c2', code: 'C2', cefr: 'Уровень владения в совершенстве (Mastery)', title: 'В совершенстве', status: 'open',
      can: 'Читаю рукописи и разные версии Писания, понимаю колофоны, перевожу и сам пишу на классическом сирийском.',
      summary: 'Рукописи и колофоны, версии Писания, пролог Евангелия от Иоанна, сочинение на классическом сирийском.',
      units: [
        { id: 'u1', kind: 'words', words: 'manuscripts', title: 'Мир рукописей',
          intro: 'Большая часть сирийской литературы дошла в рукописях, переписанных в монастырях. В конце писец оставлял колофон (ܚܘܬܡܐ ḥuttāmā): кто, где и когда переписал книгу, с просьбой помолиться о нём.' },
        { id: 'u2', kind: 'reading', title: 'Чтение: колофон писца',
          intro: 'Учебный колофон, составленный по образцу типичных колофонов сирийских рукописей. Не цитата из конкретной рукописи.',
          text: [
            s('ܫܠܡ ܟܬܒܐ ܗܢܐ', 'Shlem ktāwā hānā.', 'Shlem ktovo hono.', 'Окончена эта книга'),
            s('ܒܝܕ ܟܬܘܒܐ ܚܛܝܐ', 'B-yad kāthōwā ḥaṭṭāyā,', 'B-yad kothuvo ḥaṭoyo,', 'рукой грешного писца'),
            s('ܒܕܝܪܐ ܕܡܪܝ ܓܒܪܐܝܠ', 'b-dayrā d-Mār Gawriʾēl.', 'b-dayro d-Mor Gabriʾel.', 'в монастыре Мар Габриэль.'),
            s('ܟܠ ܕܩܪܐ ܢܨܠܐ ܥܠ ܟܬܘܒܐ', 'Kul d-qārē nṣallē ʿal kāthōwā.', 'Kul d-qore nṣale ʿal kothuvo.', 'Всякий, кто читает, пусть помолится о писце.'),
            s('ܘܐܠܗܐ ܢܫܒܘܩ ܠܗ ܚܛܗ̈ܘܗܝ', 'W-alāhā neshboq leh ḥṭāhaw.', 'W-aloho neshbuq leh ḥṭohaw.', 'И пусть Бог простит ему грехи его.')
          ],
          questions: [
            { q: 'Что сообщает первая строка?', options: ['что книга окончена', 'что книга начата', 'что книга продана', 'что книга утеряна'] },
            { q: 'Как писец называет себя?', options: ['грешным', 'великим', 'мудрым', 'старым'] },
            { q: 'Где переписана книга?', options: ['в монастыре Мар Габриэль', 'в Риме', 'в Багдаде', 'в Эдессе'] },
            { q: 'О чём просит писец читателя?', options: ['помолиться о нём', 'вернуть книгу', 'заплатить', 'переписать книгу'] }
          ] },
        { id: 'u3', kind: 'words', words: 'versions', title: 'Версии Писания',
          intro: 'Сирийская Библия существует в нескольких версиях: Пешитта (ܦܫܝܛܬܐ «простая») — общая для всех сирийских церквей; Диатессарон Татиана — свод четырёх Евангелий; Харклеянская (616 г.) — дословный перевод с греческого.' },
        { id: 'u4', kind: 'reading', title: 'Чтение: пролог Иоанна (Ин 1:1–5)',
          intro: 'Пролог Евангелия от Иоанна по Пешитте. Сравните чтение в обеих традициях.',
          text: [
            s('ܒܪܫܝܬ ܐܝܬܘܗܝ ܗܘܐ ܡܠܬܐ', 'Brēshīth ithawhī wā melthā,', 'Breshith ithaw(hi) wo meltho,', 'В начале было Слово,'),
            s('ܘܗܘ ܡܠܬܐ ܐܝܬܘܗܝ ܗܘܐ ܠܘܬ ܐܠܗܐ', 'w-hū melthā ithawhī wā lwāth alāhā,', 'w-hu meltho ithaw(hi) wo lwoth aloho,', 'и Слово было у Бога,'),
            s('ܘܐܠܗܐ ܐܝܬܘܗܝ ܗܘܐ ܗܘ ܡܠܬܐ', 'w-alāhā ithawhī wā hū melthā.', 'w-aloho ithaw(hi) wo hu meltho.', 'и Бог был Слово.'),
            s('ܟܠ ܒܐܝܕܗ ܗܘܐ', 'Kul b-īdeh hwā.', 'Kul b-ideh hwo.', 'Всё через Него начало быть.'),
            s('ܒܗ ܚܝ̈ܐ ܗܘܘ', 'Beh ḥayyē waw,', 'Beh ḥaye waw,', 'В Нём была жизнь,'),
            s('ܘܗܘ ܢܘܗܪܐ ܒܚܫܘܟܐ ܡܢܗܪ', 'w-hū nuhrā b-ḥeshōkhā manhar.', 'w-hu nuhro b-ḥeshukho manhar.', 'и свет во тьме светит.')
          ],
          questions: [
            { q: 'Что было в начале?', options: ['Слово', 'свет', 'земля', 'вода'] },
            { q: 'У кого было Слово?', options: ['у Бога', 'у царя', 'у людей', 'у учеников'] },
            { q: 'Что было в Нём?', options: ['жизнь', 'тьма', 'закон', 'смерть'] },
            { q: 'Где светит свет?', options: ['во тьме', 'на небе', 'в доме', 'в городе'] }
          ] },
        { id: 'u5', kind: 'sentences', title: 'Сочинение: пишем на классическом сирийском',
          intro: 'Итог курса: предложения, в которых сходится вся грамматика — причастие с местоимением, ܕ, условие, паэль, имперфект. Попробуйте собрать их сами, а потом составить свои.',
          sentences: [
            s('ܐܢܐ ܝܠܦ ܐܢܐ ܠܫܢܐ ܣܘܪܝܝܐ', 'Enā yālefnā leshānā suryāyā.', 'Eno yolefno leshono suryoyo.', 'Я изучаю сирийский язык.'),
            s('ܠܫܢܐ ܣܘܪܝܝܐ ܠܫܢܐ ܕܥܕܬܐ ܗܘ', 'Leshānā suryāyā leshānā d-ʿēdtā hū.', 'Leshono suryoyo leshono d-ʿito hu.', 'Сирийский — язык Церкви.'),
            s('ܟܕ ܩܪܐ ܐܢܐ ܒܟܬܒܐ ܚܕܐ ܐܢܐ', 'Kad qārē-nā b-ktāwā, ḥādhē-nā.', 'Kad qore-no b-ktovo, ḥodhe-no.', 'Когда я читаю книгу, я радуюсь.'),
            s('ܐܢ ܬܐܠܦ ܬܫܟܚ', 'En tēlaf teshkaḥ.', 'En tilaf teshkaḥ.', 'Если будешь учиться, обретёшь.'),
            s('ܡܠܦܢܐ ܐܠܦ ܠܬܠܡܝܕܘܗܝ', 'Malpānā allef l-thalmīdhaw.', 'Malpono alef l-thalmidhaw.', 'Учитель учил своих учеников.'),
            s('ܐܦ ܚܢܢ ܢܟܬܘܒ ܒܠܫܢܐ ܗܢܐ', 'Ap ḥnan nekhtōw b-leshānā hānā.', 'Af ḥnan nekhtuv b-leshono hono.', 'И мы будем писать на этом языке.')
          ] },
        { id: 'test', kind: 'test', title: 'Итоговый экзамен C2', intro: 'Двадцать вопросов по урокам уровня C2. Для сертификата нужно 70%.' }
      ]
    }
  ];

  levels.forEach(function (lv) {
    for (var i = 0; i < D.levels.length; i++) if (D.levels[i].id === lv.id) { D.levels[i] = lv; return; }
    D.levels.push(lv);
  });
})();
