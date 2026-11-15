'use strict';

// Progressive enhancement only: every page works without JavaScript.
document.addEventListener('DOMContentLoaded', function () {
  // "Copy the template" on the How to get listed page (CSP-safe, no inline handlers).
  document.querySelectorAll('button[data-copy]').forEach(function (btn) {
    var source = document.getElementById(btn.getAttribute('data-copy'));
    if (!source || !navigator.clipboard) return;
    btn.hidden = false;
    var label = btn.textContent;
    btn.addEventListener('click', function () {
      navigator.clipboard.writeText(source.textContent).then(function () {
        btn.textContent = btn.getAttribute('data-copied');
        window.setTimeout(function () { btn.textContent = label; }, 2000);
      });
    });
  });

  // Close open <details> menus when clicking outside or pressing Escape.
  var menus = document.querySelectorAll('details.lang-switch, details.mobile-menu');
  document.addEventListener('click', function (event) {
    menus.forEach(function (d) {
      if (d.open && !d.contains(event.target)) d.open = false;
    });
  });
  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;
    menus.forEach(function (d) {
      if (d.open) {
        d.open = false;
        d.querySelector('summary').focus();
      }
    });
  });

  // Static HTML export: no server, so directory filters run in the browser.
  if (document.documentElement.hasAttribute('data-static')) {
    var grid = document.querySelector('.listing-grid');
    var params = new URLSearchParams(window.location.search);
    var q = (params.get('q') || '').trim().toLowerCase();
    var type = params.get('type') || '';
    var country = params.get('country') || '';
    var dialect = params.get('dialect') || '';
    ['q', 'type', 'country', 'dialect'].forEach(function (name) {
      var el = document.getElementById(name);
      if (el && params.get(name)) el.value = params.get(name);
    });
    if (grid && (q || type || country || dialect)) {
      var shown = 0;
      grid.querySelectorAll('.listing-card').forEach(function (card) {
        var ok = (!type || card.getAttribute('data-type') === type) &&
          (!country || card.getAttribute('data-country') === country) &&
          (!dialect || card.getAttribute('data-dialect') === dialect || card.getAttribute('data-dialect') === 'both') &&
          (!q || card.getAttribute('data-search').indexOf(q) !== -1);
        card.hidden = !ok;
        if (ok) shown += 1;
      });
      var count = document.querySelector('.results-count');
      if (count) count.textContent = count.textContent.replace(/\d+/, String(shown));
    }
  }
});
