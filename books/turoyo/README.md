# Turoyo textbook (A1–C2, Serto)

Builds three editions of the Turoyo book from the course data (`js/turoyo-data.js`, `js/turoyo-levels.js`):
English (`en`, no Cyrillic), Russian (`ru`, Cyrillic readings only, no Latin and no EN lines) and Ukrainian (`uk`, Ukrainian Cyrillic readings).

1. `node dump.js` writes `strings.json`, every Russian string of the course data.
   `en.js` and `uk.js` are index-aligned translations of it; update them when the data changes
   (the builder refuses to run if the counts differ or a string has no translation).
2. `node turoyo-book.js <abs-out-dir>` renders the book bodies `turoyo-body-{en,ru,uk}.pdf`.
3. `python3 covers.py <books/cover dir> <img dir> <final dir>` renders cover A («Лист») for each edition
   (cover templates from branch `claude/project-thread-lojqz1`) and writes
   `<final>/{en,ru,uk}/turoyo-a1-c2-serto-{en,ru,uk}.pdf`.

Course author: Michael Baddu.
