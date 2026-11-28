const path=require('path'); global.window={};
const R='/home/user/madrashta/js/';
require(R+'turoyo-data.js'); require(R+'turoyo-levels.js');
const D=window.COURSE_DATA; const out=new Set(); const add=s=>{if(s&&/[А-яЁё]/.test(s))out.add(s)};
D.levels.forEach(l=>{['title','cefr','summary','can'].forEach(k=>add(l[k])); (l.units||[]).forEach(u=>{add(u.title);add(u.intro);(u.table||[]).forEach(r=>r.forEach(add));(u.sentences||[]).forEach(x=>add(x.ru));(u.text||[]).forEach(x=>add(x.ru));(u.questions||[]).forEach(q=>{add(q.q);q.options.forEach(add)})})});
Object.values(D.words).forEach(l=>l.forEach(x=>add(x.ru)));Object.values(D.phrases).forEach(l=>l.forEach(x=>add(x.ru)));
D.letters.forEach(l=>{add(l.tr);add(l.sound)});D.vowels.forEach(v=>{add(v.name);add(v.note)});
const a=[...out]; require('fs').writeFileSync('strings.json',JSON.stringify(a,null,1)); console.log(a.length, a.join('').length);
