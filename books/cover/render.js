#!/usr/bin/env node
/* Render Madrashta book covers to PNG (preview) and one-page A4 PDF.
 *   node render.js                 -> all books, all variants
 *   node render.js a suret-serto   -> variant "a" for one book
 * Output: books/cover/out/<book>-<variant>.{png,pdf}
 * The one-page PDF can be prepended to a textbook PDF (e.g. with pdfunite/qpdf). */
const path = require("path");
const fs = require("fs");
const { pathToFileURL } = require("url");
const { chromium } = require("playwright");

const dir = __dirname;
const out = path.join(dir, "out");
fs.mkdirSync(out, { recursive: true });

global.window = {};
require(path.join(dir, "covers.js"));
const books = window.COVER_BOOKS.map(b => b.id);

const [vArg, bArg] = process.argv.slice(2);
const variants = vArg ? [vArg] : ["a", "b", "c"];
const which = bArg ? [bArg] : books;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 2 });
  for (const v of variants) for (const id of which) {
    const url = pathToFileURL(path.join(dir, "cover.html")).href + `?book=${id}&v=${v}`;
    await page.goto(url);
    await page.evaluate(() => document.fonts.ready);
    const base = path.join(out, `${id}-${v}`);
    await page.screenshot({ path: base + ".png" });
    await page.pdf({ path: base + ".pdf", width: "210mm", height: "297mm", printBackground: true, pageRanges: "1" });
    console.log("wrote", path.relative(dir, base) + ".{png,pdf}");
  }
  await browser.close();
})();
