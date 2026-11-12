/* Stories: read aloud, text size, tonight's story, filter, recently read. Needs site.js (window.SYG). */
(function () {
  'use strict';
  var d = document, $ = function (s, r) { return (r || d).querySelector(s); }, $$ = function (s, r) { return [].slice.call((r || d).querySelectorAll(s)); };
  var esc = function (s) { return SYG.esc(s); };

  /* story page */
  var story = $('#story');
  if (story) {
    var size = 0;
    try { size = +localStorage.getItem('syg-story-size') || 0; } catch (e) {}
    var apply = function () { story.style.fontSize = (1.08 + size * 0.14) + 'rem'; };
    apply();
    d.addEventListener('click', function (e) {
      var b = e.target.closest('[data-size]');
      if (!b) return;
      size = Math.max(-1, Math.min(4, size + (+b.getAttribute('data-size'))));
      try { localStorage.setItem('syg-story-size', size); } catch (e2) {}
      apply();
    });
    var btn = $('#aloud'), synth = window.speechSynthesis, parts = [], pi = 0, on = false;
    if (!synth || !window.SpeechSynthesisUtterance) btn.hidden = true;
    var stop = function () { on = false; synth.cancel(); btn.textContent = '▶ Read aloud'; $$('.now', story).forEach(function (p) { p.classList.remove('now'); }); };
    var next = function () {
      if (!on || pi >= parts.length) { stop(); return; }
      var p = parts[pi++], u = new SpeechSynthesisUtterance(p.textContent);
      u.lang = story.getAttribute('lang') === 'hi' ? 'hi-IN' : 'en-IN'; u.rate = 0.88;
      $$('.now', story).forEach(function (x) { x.classList.remove('now'); }); p.classList.add('now');
      u.onend = next; u.onerror = function () { stop(); };
      synth.speak(u);
    };
    btn.addEventListener('click', function () {
      if (on) { stop(); return; }
      parts = [$('h1')].concat($$('p', story)); pi = 0; on = true; btn.textContent = '■ Stop reading'; synth.cancel(); next();
    });
    window.addEventListener('pagehide', function () { if (synth) synth.cancel(); });
    SYG.recent('syg-stories-recent', { u: location.pathname, t: $('h1').textContent });
  }

  /* home: filter + tonight's story + recently read */
  var chips = $('#sfilter');
  if (chips) {
    chips.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      $$('button', chips).forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      var v = b.value, n = 0;
      $$('.scard').forEach(function (c) { var ok = !v || c.getAttribute('data-type') === v || c.getAttribute('data-lang') === v; c.hidden = !ok; if (ok) n++; });
      $('#scount').textContent = n + (n === 1 ? ' story' : ' stories');
    });
    var cards = $$('.scard'), day = Math.floor(Date.now() / 86400000 + 5.5 / 24), bed = cards.filter(function (c) { return c.getAttribute('data-type') === 'bedtime'; });
    var pick = (bed.length ? bed : cards)[day % (bed.length || cards.length)], tn = $('#tonight');
    if (pick && tn) { var a = $('a', pick); tn.innerHTML = '<h2>Tonight\'s bedtime story</h2><p class="pk">' + esc($('b', a).textContent) + '</p><p>' + esc($('span', a).textContent) + '</p><p><a class="btn" href="' + a.getAttribute('href') + '">Read it now</a></p>'; tn.hidden = false; }
    var rec = SYG.recent('syg-stories-recent'), rb = $('#recent');
    if (rec.length && rb) { rb.innerHTML = '<h2>Read recently on this device</h2><div class="chips">' + rec.map(function (r) { return '<a href="' + esc(r.u) + '">' + esc(r.t) + '</a>'; }).join('') + '</div>'; rb.hidden = false; }
  }
})();
