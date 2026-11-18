(() => {
  const el = G.$('#sdk'), ov = G.$('#ov');
  const CLUES = { easy: 40, medium: 32, hard: 27, expert: 24 };
  let level = G.cfg.level || G.get('sdk_level', 'easy'), sol, puzzle, cur, notes, sel = -1, noteMode = false, mistakes = 0, done = false, hist = [];
  const timer = G.timer(s => G.$('#time').textContent = G.fmt(s));
  const row = i => (i / 9) | 0, col = i => i % 9, box = i => ((row(i) / 3) | 0) * 3 + ((col(i) / 3) | 0);
  const peers = i => { const r = []; for (let j = 0; j < 81; j++) if (j !== i && (row(j) === row(i) || col(j) === col(i) || box(j) === box(i))) r.push(j); return r; };
  const PEERS = Array.from({ length: 81 }, (_, i) => peers(i));
  const ok = (g, i, v) => PEERS[i].every(j => g[j] !== v);

  function fill(g) {
    const i = g.indexOf(0); if (i < 0) return true;
    for (const v of G.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])) if (ok(g, i, v)) { g[i] = v; if (fill(g)) return true; g[i] = 0; }
    return false;
  }
  function count(g, limit) {
    // count solutions up to limit, choosing cell with fewest candidates
    let best = -1, bestC = null;
    for (let i = 0; i < 81; i++) if (!g[i]) {
      const c = []; for (let v = 1; v <= 9; v++) if (ok(g, i, v)) c.push(v);
      if (!c.length) return 0;
      if (!bestC || c.length < bestC.length) { best = i; bestC = c; if (c.length === 1) break; }
    }
    if (best < 0) return 1;
    let n = 0;
    for (const v of bestC) { g[best] = v; n += count(g, limit - n); if (n >= limit) break; }
    g[best] = 0; return n;
  }
  function generate(clues) {
    const g = Array(81).fill(0); fill(g); const s = g.slice();
    let filled = 81;
    for (const i of G.shuffle([...Array(81).keys()])) {
      if (filled <= clues) break;
      const keep = g[i]; g[i] = 0;
      if (count(g.slice(), 2) !== 1) g[i] = keep; else filled--;
    }
    return { s, p: g };
  }
  const daily = G.daily.setup('sudoku', G.cfg.more);
  if (daily) level = 'medium';
  function newGame() {
    const { s, p } = daily ? G.withSeed('sudoku-' + G.today(), () => generate(CLUES.medium)) : generate(CLUES[level]);
    sol = s; puzzle = p; cur = p.slice(); notes = Array.from({ length: 81 }, () => new Set());
    sel = -1; mistakes = 0; done = false; hist = []; ov.classList.add('hidden');
    timer.reset(); timer.start(); G.$('#mist').textContent = 0; setBest(); render();
  }
  function setBest() { const b = G.get('sdk_best_' + (daily ? 'daily' : level), null); G.$('#best').textContent = b === null ? '—' : G.fmt(b); }
  function render() {
    const sv = sel >= 0 ? cur[sel] : 0;
    for (let i = 0; i < 81; i++) {
      const d = el.children[i], v = cur[i];
      let cls = puzzle[i] ? 'given' : (v ? 'user' : '');
      if (sel >= 0) { if (i === sel) cls += ' sel'; else if (sv && v === sv) cls += ' same'; else if (PEERS[sel].includes(i)) cls += ' peer'; }
      if (v && !puzzle[i] && v !== sol[i]) cls += ' err';
      d.className = cls;
      if (v) d.textContent = v;
      else if (notes[i].size) d.innerHTML = '<span class="notes">' + [1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => `<i>${notes[i].has(n) ? n : ''}</i>`).join('') + '</span>';
      else d.textContent = '';
    }
    // dim completed numbers on pad
    G.$$('.pad button[data-n]').forEach(b => { const n = +b.dataset.n; b.style.opacity = cur.filter(v => v === n).length >= 9 ? .35 : 1; });
  }
  function input(n) {
    if (sel < 0 || done || puzzle[sel]) return;
    hist.push({ i: sel, v: cur[sel], notes: new Set(notes[sel]) });
    if (noteMode && n) { cur[sel] = 0; notes[sel].has(n) ? notes[sel].delete(n) : notes[sel].add(n); render(); return; }
    cur[sel] = cur[sel] === n ? 0 : n; notes[sel].clear();
    if (n && cur[sel] === n) {
      if (n !== sol[sel]) { mistakes++; G.$('#mist').textContent = mistakes; }
      else PEERS[sel].forEach(j => notes[j].delete(n));
    }
    render(); check();
  }
  function check() {
    if (cur.every((v, i) => v === sol[i])) {
      done = true; timer.stop(); const t = Math.round(timer.sec()), k = 'sdk_best_' + (daily ? 'daily' : level), b = G.get(k, null);
      const rec = b === null || t < b; if (rec) G.set(k, t); setBest(); G.confetti();
      if (daily) { G.daily.record('sudoku', { t, mistakes }); G.$('#dailystreak').textContent = G.daily.streak('sudoku'); G.overlay(ov, 'Daily Sudoku solved! 🎉', `Time: <b>${G.fmt(t)}</b> · Mistakes: <b>${mistakes}</b>${G.daily.winText('sudoku')}`, 'Close', null); return; }
      G.overlay(ov, 'Solved! 🎉', `Time: <b>${G.fmt(t)}</b> · Mistakes: <b>${mistakes}</b>${rec ? ' · New best!' : ''}`, 'New puzzle', newGame);
    }
  }
  function hint() {
    if (done) return;
    let i = sel >= 0 && cur[sel] !== sol[sel] ? sel : -1;
    if (i < 0) { const open = []; for (let j = 0; j < 81; j++) if (cur[j] !== sol[j]) open.push(j); if (!open.length) return; i = open[G.rnd(open.length)]; }
    hist.push({ i, v: cur[i], notes: new Set(notes[i]) });
    cur[i] = sol[i]; notes[i].clear(); sel = i; render(); check();
  }
  function undo() { const h = hist.pop(); if (!h || done) return; cur[h.i] = h.v; notes[h.i] = h.notes; sel = h.i; render(); }

  for (let i = 0; i < 81; i++) { const d = document.createElement('div'); d.dataset.i = i; el.appendChild(d); }
  el.addEventListener('pointerdown', e => { const d = e.target.closest('[data-i]'); if (!d) return; sel = +d.dataset.i; render(); });
  G.$('.pad').addEventListener('click', e => { const b = e.target.closest('button'); if (b && b.dataset.n) input(+b.dataset.n); });
  G.$('#erase').onclick = () => input(0);
  G.$('#hint').onclick = hint;
  G.$('#undo').onclick = undo;
  const nm = G.$('#notes');
  const setNote = v => { noteMode = v; nm.classList.toggle('on', v); nm.textContent = v ? '✏️ Notes: ON' : '✏️ Notes: OFF'; };
  nm.onclick = () => setNote(!noteMode);
  G.$('#new').onclick = newGame;
  addEventListener('keydown', e => {
    if (e.target.closest('input,textarea,select')) return;
    if (/^[1-9]$/.test(e.key)) { input(+e.key); return; }
    if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') { e.preventDefault(); input(0); return; }
    if (e.key === 'n' || e.key === 'N') { setNote(!noteMode); return; }
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); undo(); return; }
    const d = G.keyDir(e); if (!d || e.key.length === 1) return;
    e.preventDefault(); if (sel < 0) sel = 0;
    else { let r = row(sel), c = col(sel); if (d === 'up') r = (r + 8) % 9; if (d === 'down') r = (r + 1) % 9; if (d === 'left') c = (c + 8) % 9; if (d === 'right') c = (c + 1) % 9; sel = r * 9 + c; }
    render();
  });
  const lv = G.$('#level');
  G.$$('button', lv).forEach(b => b.classList.toggle('on', b.dataset.v === level));
  G.seg(lv, v => { level = v; G.set('sdk_level', v); newGame(); });
  newGame();
  if (daily) { const d = G.daily.doneToday('sudoku'); if (d) { timer.stop(); G.overlay(ov, '✅ Solved today', `You finished today's Sudoku${d.t ? ' in <b>' + G.fmt(d.t) + '</b>' : ''}.${G.daily.winText('sudoku')}`, 'Play it again', () => { timer.reset(); timer.start(); }); } }
})();
