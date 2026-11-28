# Renders cover A («Лист») for the Turoyo book in en/ru/uk and puts it in front of the book body.
import shutil, re, subprocess, os, sys
from pypdf import PdfReader, PdfWriter
S = os.path.dirname(os.path.abspath(__file__))
SRC = sys.argv[1]            # extracted books/cover dir (branch claude/project-thread-lojqz1)
IMG = sys.argv[2]            # extracted img dir
FINAL = sys.argv[3]          # output dir root (books/)
ED = {
  'en': dict(seriesLine='School of the Assyrian Language', levelsLine='Textbook for levels A1–C2 · English edition', title='Turoyo', greeting='Shlomo!', script='Serto', word='script'),
  'ru': dict(seriesLine='Школа ассирийского языка', levelsLine='Учебник для уровней A1–C2 · русское издание', title='Язык туройо', greeting='Шломо!', script='Серто', word='письмо'),
  'uk': dict(seriesLine='Школа ассирійської мови', levelsLine='Підручник для рівнів A1–C2 · українське видання', title='Мова туройо', greeting='Шломо!', script='Серто', word='письмо'),
}
for ed, o in ED.items():
    d = os.path.join(S, 'cov-' + ed)
    shutil.rmtree(d, ignore_errors=True); shutil.copytree(SRC, d)
    cj = os.path.join(d, 'covers.js'); c = open(cj, encoding='utf-8').read()
    c = re.sub(r'seriesLine: "[^"]*"', 'seriesLine: "%s"' % o['seriesLine'], c)
    c = re.sub(r'levelsLine: "[^"]*"', 'levelsLine: "%s"' % o['levelsLine'], c)
    c = re.sub(r'(id: "turoyo",\s*word: "[^"]*", greeting: )"[^"]*"', r'\1"%s"' % o['greeting'], c)
    c = re.sub(r'(greeting: "%s",\s*title: )"[^"]*"' % re.escape(o['greeting']), r'\1"%s"' % o['title'], c)
    c = re.sub(r'(title: "%s", subtitle: "",\s*script: )"[^"]*"' % re.escape(o['title']), r'\1"%s"' % o['script'], c)
    assert o['title'] in c, ed
    open(cj, 'w', encoding='utf-8').write(c)
    hp = os.path.join(d, 'cover.html'); h = open(hp, encoding='utf-8').read()
    h = h.replace('· письмо <span', '· %s <span' % o['word']).replace('<html lang="ru">', '<html lang="%s">' % ed)
    h = h.replace('../../img/', 'file://' + IMG + '/')
    open(hp, 'w', encoding='utf-8').write(h)
    subprocess.run(['node', os.path.join(d, 'render.js'), 'a', 'turoyo'], check=True, capture_output=True)
    w = PdfWriter()
    w.append(os.path.join(d, 'out', 'turoyo-a.pdf'))
    w.append(os.path.join(S, 'out', 'turoyo-body-%s.pdf' % ed))
    out = os.path.join(FINAL, ed, 'turoyo-a1-c2-serto-%s.pdf' % ed)
    os.makedirs(os.path.dirname(out), exist_ok=True)
    w.write(out); print(out, len(PdfReader(out).pages))
    shutil.copy(os.path.join(d, 'out', 'turoyo-a.png'), os.path.join(S, 'out', 'cover-%s.png' % ed))
