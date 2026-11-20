// Reversi: outflank and flip your opponent's discs
(() => {
  const el = G.$('#rv'), st = G.$('#turn');
  const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
  const WT = [[100, -20, 10, 5, 5, 10, -20, 100], [-20, -50, -2, -2, -2, -2, -50, -20], [10, -2, 1, 1, 1, 1, -2, 10], [5, -2, 1, 0, 0, 1, -2, 5], [5, -2, 1, 0, 0, 1, -2, 5], [10, -2, 1, 1, 1, 1, -2, 10], [-20, -50, -2, -2, -2, -2, -50, -20], [100, -20, 10, 5, 5, 10, -20, 100]];
  let b, turn, over, busy, mode = G.cfg.mode || G.get('rv_mode', 'cpu'), level = G.get('rv_level', 'medium'), wins = G.get('rv_wins', { a: 0, b: 0 }), lastMove = null;
  const flips = (bd, r, c, p) => { if (bd[r][c]) return []; const out = []; for (const [dr, dc] of DIRS) { const run = []; let y = r + dr, x = c + dc; while (y >= 0 && y < 8 && x >= 0 && x < 8 && bd[y][x] === 3 - p) { run.push([y, x]); y += dr; x += dc; } if (run.length && y >= 0 && y < 8 && x >= 0 && x < 8 && bd[y][x] === p) out.push(...run); } return out; };
  const moves = (bd, p) => { const m = []; for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) { const f = flips(bd, r, c, p); if (f.length) m.push({ r, c, f }); } return m; };
  const count = (bd, p) => bd.flat().filter(v => v === p).length;
  const apply = (bd, m, p) => { const n = bd.map(r => r.slice()); n[m.r][m.c] = p; m.f.forEach(([y, x]) => n[y][x] = p); return n; };
  function evalB(bd, p) { let s = 0; for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) if (bd[r][c] === p) s += WT[r][c]; else if (bd[r][c]) s -= WT[r][c]; return s + (moves(bd, p).length - moves(bd, 3 - p).length) * 4; }
  function search(bd, p, d, a, bt) {
    if (d === 0) return evalB(bd, p);
    const ms = moves(bd, p); if (!ms.length) { if (!moves(bd, 3 - p).length) return (count(bd, p) - count(bd, 3 - p)) * 1000; return -search(bd, 3 - p, d - 1, -bt, -a); }
    let best = -Infinity; for (const m of ms) { const v = -search(apply(bd, m, p), 3 - p, d - 1, -bt, -a); if (v > best) best = v; if (v > a) a = v; if (a >= bt) break; } return best;
  }
  function aiPick() {
    const ms = moves(b, 2);
    if (level === 'easy') return Math.random() < .6 ? ms[G.rnd(ms.length)] : ms.reduce((x, y) => y.f.length > x.f.length ? y : x);
    const d = level === 'medium' ? 2 : 4; let best = -Infinity, pick = ms[0];
    for (const m of G.shuffle(ms.slice())) { const v = -search(apply(b, m, 2), 1, d - 1, -Infinity, Infinity); if (v > best) { best = v; pick = m; } }
    return pick;
  }
  const nm = p => mode === 'cpu' ? (p === 1 ? 'You' : 'Computer') : (p === 1 ? 'Black' : 'White');
  function render() {
    const valid = over || (mode === 'cpu' && turn === 2) ? [] : moves(b, turn), vs = new Set(valid.map(m => m.r * 8 + m.c));
    el.innerHTML = '';
    for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
      const d = document.createElement('button'); d.className = 'rvc' + (vs.has(r * 8 + c) ? ' ok' : '') + (lastMove && lastMove[0] === r && lastMove[1] === c ? ' last' : ''); d.dataset.i = r * 8 + c;
      if (b[r][c]) { const s = document.createElement('i'); s.className = b[r][c] === 1 ? 'k' : 'w'; d.appendChild(s); }
      d.setAttribute('aria-label', `row ${r + 1} column ${c + 1}`); el.appendChild(d);
    }
    G.$('#sa').textContent = count(b, 1); G.$('#sb').textContent = count(b, 2);
  }
  function finish() {
    over = true; const a = count(b, 1), c = count(b, 2);
    if (a > c) { wins.a++; st.textContent = mode === 'cpu' ? `You win ${a}–${c}! 🎉` : `Black wins ${a}–${c}! 🎉`; G.confetti(); }
    else if (c > a) { wins.b++; st.textContent = mode === 'cpu' ? `Computer wins ${c}–${a}` : `White wins ${c}–${a}! 🎉`; if (mode !== 'cpu') G.confetti(); }
    else st.textContent = `It's a draw, ${a}–${c}`;
    G.set('rv_wins', wins); G.$('#again').classList.remove('hidden'); render();
  }
  function next() {
    turn = 3 - turn;
    if (!moves(b, turn).length) { if (!moves(b, 3 - turn).length) return finish(); st.textContent = `${nm(turn)} ${mode === 'cpu' && turn === 1 ? 'have' : 'has'} no moves, so ${nm(3 - turn)} ${mode === 'cpu' && turn === 2 ? 'go' : 'goes'} again.`; turn = 3 - turn; render(); if (mode === 'cpu' && turn === 2) cpu(); return; }
    st.textContent = mode === 'cpu' ? (turn === 1 ? 'Your turn (black)' : 'Computer is thinking…') : `${nm(turn)}'s turn`;
    render(); if (mode === 'cpu' && turn === 2) cpu();
  }
  function cpu() { busy = true; setTimeout(() => { busy = false; if (over) return; const m = aiPick(); b = apply(b, m, 2); lastMove = [m.r, m.c]; next(); }, 450); }
  function play(i) {
    if (over || busy || (mode === 'cpu' && turn === 2)) return; const r = Math.floor(i / 8), c = i % 8, f = flips(b, r, c, turn); if (!f.length) return;
    b = apply(b, { r, c, f }, turn); lastMove = [r, c]; next();
  }
  function start() {
    b = Array.from({ length: 8 }, () => Array(8).fill(0)); b[3][3] = b[4][4] = 2; b[3][4] = b[4][3] = 1; turn = 2; over = false; busy = false; lastMove = null; G.$('#again').classList.add('hidden'); next();
  }
  el.addEventListener('click', e => { const d = e.target.closest('.rvc'); if (d) play(+d.dataset.i); });
  G.$('#again').onclick = start; G.$('#new').onclick = start;
  const md = G.$('#mode'), lv = G.$('#level');
  G.$$('button', md).forEach(x => x.classList.toggle('on', x.dataset.v === mode));
  G.$$('button', lv).forEach(x => x.classList.toggle('on', x.dataset.v === level));
  const labels = () => { lv.classList.toggle('hidden', mode !== 'cpu'); G.$('#la').textContent = mode === 'cpu' ? 'You ⚫' : 'Black ⚫'; G.$('#lb').textContent = mode === 'cpu' ? 'Computer ⚪' : 'White ⚪'; };
  G.seg(md, v => { mode = v; G.set('rv_mode', v); labels(); start(); });
  G.seg(lv, v => { level = v; G.set('rv_level', v); start(); });
  labels(); start();
})();
