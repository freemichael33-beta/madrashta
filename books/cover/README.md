# Обложки учебников Madrashta

Минималистичная серия обложек A4 для книг курса (сурэт ×3 письма, туройо, классический сирийский).

- `covers.js` — все тексты и цвета (названия рабочие: меняются здесь).
- `cover.html?book=<id>&v=a|b|c` — шаблон, три варианта: A «Лист», B «Восход», C «Буква».
- `node render.js [вариант] [book-id]` — PNG-превью и одностраничный PDF в `out/`.
  Одностраничный PDF можно поставить первой страницей учебника: `pdfunite out/suret-serto-a.pdf suret-a1-c2-serto.pdf book.pdf`.

Шрифты: Noto Sans Syriac (эстрангело / Western / Eastern), Inter, Noto Serif — SIL OFL, лежат в `fonts/`.
