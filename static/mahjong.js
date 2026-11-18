(() => {
  const B = G.$('#mj'), ov = G.$('#ov');
  // ---- layout (half-tile units; a tile covers 2x2) ----
  function buildLayout() {
    const P = [];
    for (let y = 0; y < 7; y++) for (let x = 0; x < 12; x++) P.push({ x: x * 2, y: y * 2, z: 0 });
    for (let y = 0; y < 5; y++) for (let x = 0; x < 10; x++) P.push({ x: 2 + x * 2, y: 2 + y * 2, z: 1 });
    for (let y = 0; y < 2; y++) for (let x = 0; x < 4; x++) P.push({ x: 8 + x * 2, y: 5 + y * 2, z: 2 });
    for (let x = 0; x < 2; x++) P.push({ x: 10 + x * 2, y: 6, z: 3 });
    return P; // 84 + 50 + 8 + 2 = 144
  }
  // ---- tile set: 34 kinds x4 + 4 flowers + 4 seasons ----
  const KINDS = [];
  ['dot', 'bam', 'chr'].forEach(s => { for (let n = 1; n <= 9; n++) KINDS.push({ s, n, m: s + n }); });
  ['東', '南', '西', '北'].forEach(w => KINDS.push({ s: 'wind', t: w, m: 'w' + w }));
  [['中', '#d62839'], ['發', '#1f8a4c'], ['', '#3a6ee8']].forEach(([t, c], i) => KINDS.push({ s: 'drg', t, c, m: 'd' + i }));
  const FLOW = ['🌸', '🌼', '🌺', '🌷'].map(t => ({ s: 'flw', t, m: 'flower' })), SEAS = ['🌱', '☀️', '🍂', '❄️'].map(t => ({ s: 'sea', t, m: 'season' }));
  function deck() { const d = []; KINDS.forEach(k => { for (let i = 0; i < 4; i++) d.push(k); }); return d.concat(FLOW, SEAS); }
  function face(k) {
    if (k.s === 'dot') { const cols = ['#d62839', '#1f6fd6', '#1f8a4c']; return `<div class="pips d${k.n}">` + Array.from({ length: k.n }, (_, i) => `<i style="background:${cols[i % 3]}"></i>`).join('') + '</div>'; }
    if (k.s === 'bam') return `<div class="pips b${k.n}">` + Array.from({ length: k.n }, (_, i) => `<b style="background:${i % 4 === 0 && k.n > 1 ? '#d62839' : '#1f8a4c'}"></b>`).join('') + '</div>';
    if (k.s === 'chr') return `<div class="chr"><span>${'一二三四五六七八九'[k.n - 1]}</span><em>萬</em></div>`;
    if (k.s === 'wind') return `<div class="big">${k.t}</div>`;
    if (k.s === 'drg') return k.t ? `<div class="big" style="color:${k.c}">${k.t}</div>` : `<div class="wbox"></div>`;
    return `<div class="emo">${k.t}</div>`;
  }
  // ---- rules ----
  let tiles = [], sel = null, hist = [], over = false, layoutName = 'pyramid';
  const timer = G.timer(s => G.$('#time').textContent = G.fmt(s));
  const overlaps = (a, b) => Math.abs(a.x - b.x) < 2 && Math.abs(a.y - b.y) < 2;
  function isFree(t, list) {
    let left = false, right = false;
    for (const o of list) {
      if (o === t || o.gone) continue;
      if (o.z === t.z + 1 && overlaps(o, t)) return false;
      if (o.z === t.z && Math.abs(o.y - t.y) < 2) { if (o.x === t.x - 2) left = true; if (o.x === t.x + 2) right = true; }
    }
    return !(left && right);
  }
  // solvable deal: assign pairs by simulating removal of free positions
  function assign(positions, kinds) {
    const pairs = []; const pool = kinds.slice();
    // group into matching pairs
    const byM = {}; pool.forEach(k => (byM[k.m] = byM[k.m] || []).push(k));
    Object.values(byM).forEach(a => { G.shuffle(a); for (let i = 0; i < a.length; i += 2) pairs.push([a[i], a[i + 1]]); });
    G.shuffle(pairs);
    for (let tries = 0; tries < 200; tries++) {
      const left = positions.map(p => ({ ...p, gone: false })); let ok = true; const out = [];
      for (const pr of pairs) {
        const live = left.filter(p => !p.gone), free = live.filter(p => isFree(p, live));
        if (free.length < 2) { ok = false; break; }
        G.shuffle(free); const [a, b] = free;
        a.gone = b.gone = true; out.push({ ...a, k: pr[0] }, { ...b, k: pr[1] });
      }
      if (ok) return out.map((t, i) => ({ ...t, id: i, gone: false }));
    }
    return null;
  }
  const match = (a, b) => a.k.m === b.k.m;
  function newGame() {
    tiles = assign(buildLayout(), deck()); sel = null; hist = []; over = false;
    timer.reset(); ov.classList.add('hidden'); draw(); status();
  }
  function live() { return tiles.filter(t => !t.gone); }
  function pairsAvailable() {
    const L = live(), F = L.filter(t => isFree(t, L)); let n = 0, first = null;
    for (let i = 0; i < F.length; i++) for (let j = i + 1; j < F.length; j++) if (match(F[i], F[j])) { n++; if (!first) first = [F[i], F[j]]; }
    return { n, first };
  }
  function status() {
    const L = live().length; G.$('#left').textContent = L;
    const { n } = pairsAvailable(); G.$('#pairs').textContent = n;
    G.$('#undo').disabled = !hist.length;
    if (!L) return win();
    if (!n && !over) G.overlay(ov, 'No more moves', 'Shuffle the remaining tiles to keep playing.', 'Shuffle', shuffle);
  }
  function win() {
    over = true; timer.stop(); const t = Math.round(timer.sec()), b = G.get('mj_best', null), rec = b === null || t < b;
    if (rec) G.set('mj_best', t); setBest(); G.confetti();
    G.overlay(ov, 'You cleared the board! 🎉', `Time: <b>${G.fmt(t)}</b>${rec ? ' · New best!' : ''}`, 'Play again', newGame);
  }
  function setBest() { const b = G.get('mj_best', null); G.$('#best').textContent = b === null ? '—' : G.fmt(b); }
  function shuffle() {
    const L = live(); if (!L.length) return;
    hist.push(tiles.map(t => ({ ...t })));
    const re = assign(L.map(t => ({ x: t.x, y: t.y, z: t.z })), L.map(t => t.k));
    if (!re) return;
    const gone = tiles.filter(t => t.gone);
    tiles = gone.concat(re.map((t, i) => ({ ...t, id: 1000 + Math.random() }))).map((t, i) => ({ ...t, id: i }));
    sel = null; draw(); status();
  }
  function undo() { const h = hist.pop(); if (!h || over) return; tiles = h; sel = null; ov.classList.add('hidden'); draw(); status(); }
  function hint() {
    const { first } = pairsAvailable(); if (!first) return;
    first.forEach(t => { const e = B.querySelector(`[data-id="${t.id}"]`); if (e) { e.classList.add('hint'); setTimeout(() => e.classList.remove('hint'), 1200); } });
  }
  // ---- drawing ----
  let U = 0;
  function draw() {
    const W = B.clientWidth;
    // board spans 24 half-units wide + depth offset
    U = Math.min(W / 25.2, innerHeight * .72 / 19.6); const ox = (W - U * 25.2) / 2; const tw = U * 2, th = U * 2 * 1.3, dz = U * .28;
    B.style.height = (14 * U * 1.3 + 3 * dz + U * .8) + 'px';
    B.style.setProperty('--tw', tw + 'px'); B.style.setProperty('--th', th + 'px'); B.style.setProperty('--fs', (tw * .5) + 'px');
    B.innerHTML = '';
    const L = live();
    tiles.slice().sort((a, b) => a.z - b.z || a.x - b.x || a.y - b.y).forEach(t => {
      if (t.gone) return;
      const e = document.createElement('div');
      e.className = 'mt' + (isFree(t, L) ? ' free' : '') + (sel && sel.id === t.id ? ' sel' : '');
      e.dataset.id = t.id;
      e.style.left = (ox + U * .4 + t.x * U - t.z * dz + 3 * dz) + 'px';
      e.style.top = (U * .2 + t.y * U * 1.3 - t.z * dz + 3 * dz) + 'px';
      e.style.zIndex = t.z * 1000 + t.x + t.y * 30;
      e.innerHTML = face(t.k);
      B.appendChild(e);
    });
  }
  B.addEventListener('click', e => {
    const el = e.target.closest('.mt'); if (!el || over) return;
    const t = tiles.find(x => x.id === +el.dataset.id); if (!t || t.gone) return;
    if (!isFree(t, live())) { el.animate([{ transform: 'translateX(-3px)' }, { transform: 'translateX(3px)' }, { transform: 'none' }], { duration: 160 }); return; }
    if (!timer.running()) timer.start();
    if (!sel) { sel = t; draw(); return; }
    if (sel.id === t.id) { sel = null; draw(); return; }
    if (match(sel, t)) { hist.push(tiles.map(x => ({ ...x }))); sel.gone = t.gone = true; sel = null; draw(); status(); }
    else { sel = t; draw(); }
  });
  G.$('#new').onclick = newGame; G.$('#undo').onclick = undo; G.$('#hint').onclick = hint; G.$('#shuffle').onclick = shuffle;
  addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); undo(); } if (e.key === 'h' || e.key === 'H') hint(); });
  addEventListener('resize', draw);
  setBest(); newGame();
})();
