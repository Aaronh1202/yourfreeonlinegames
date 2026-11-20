// 4 in a Row: drop discs, connect four. vs computer (3 levels) or 2 players
(() => {
  const C = 7, R = 6, el = G.$('#c4'), st = G.$('#turn');
  let b, turn, over, mode = G.cfg.mode || G.get('c4_mode', 'cpu'), level = G.get('c4_level', 'medium'), first = 1, tally = G.get('c4_tally', { a: 0, b: 0, d: 0 }), busy = false;
  const top = (bd, c) => { for (let r = 0; r < R; r++) if (!bd[c][r]) return r; return -1; };
  function win(bd) {
    const D = [[1, 0], [0, 1], [1, 1], [1, -1]];
    for (let c = 0; c < C; c++) for (let r = 0; r < R; r++) { const p = bd[c][r]; if (!p) continue;
      for (const [dc, dr] of D) { const cells = [[c, r]]; for (let k = 1; k < 4; k++) { const cc = c + dc * k, rr = r + dr * k; if (cc < 0 || cc >= C || rr < 0 || rr >= R || bd[cc][rr] !== p) break; cells.push([cc, rr]); } if (cells.length === 4) return { p, cells }; } }
    return bd.every(col => col[R - 1]) ? { p: 0 } : null;
  }
  function evalWin(a, me) { let s = 0; const o = 3 - me, n = a.filter(x => x === me).length, m = a.filter(x => x === o).length;
    if (n && m) return 0; if (n === 3) s += 50; else if (n === 2) s += 10; if (m === 3) s -= 80; else if (m === 2) s -= 10; return s; }
  function heur(bd, me) {
    let s = 0; for (let r = 0; r < R; r++) { if (bd[3][r] === me) s += 6; else if (bd[3][r]) s -= 6; }
    for (let c = 0; c < C; c++) for (let r = 0; r < R; r++) for (const [dc, dr] of [[1, 0], [0, 1], [1, 1], [1, -1]]) {
      const ec = c + dc * 3, er = r + dr * 3; if (ec < 0 || ec >= C || er < 0 || er >= R) continue;
      s += evalWin([0, 1, 2, 3].map(k => bd[c + dc * k][r + dr * k]), me); }
    return s;
  }
  const ORDERC = [3, 2, 4, 1, 5, 0, 6];
  function nega(bd, depth, a, bt, me) {
    const w = win(bd); if (w) return w.p === 0 ? 0 : (w.p === me ? 100000 + depth : -100000 - depth);
    if (depth === 0) return heur(bd, me);
    let best = -Infinity;
    for (const c of ORDERC) { const r = top(bd, c); if (r < 0) continue; bd[c][r] = me; const v = -nega(bd, depth - 1, -bt, -a, 3 - me); bd[c][r] = 0; if (v > best) best = v; if (v > a) a = v; if (a >= bt) break; }
    return best;
  }
  function aiMove() {
    const free = ORDERC.filter(c => top(b, c) >= 0);
    if (level === 'easy' && Math.random() < .5) return free[G.rnd(free.length)];
    const depth = level === 'easy' ? 2 : level === 'medium' ? 4 : 6;
    let best = -Infinity, picks = [];
    for (const c of free) { const r = top(b, c); b[c][r] = 2; const v = -nega(b, depth - 1, -Infinity, Infinity, 1); b[c][r] = 0; if (v > best) { best = v; picks = [c]; } else if (v === best) picks.push(c); }
    return picks[G.rnd(picks.length)];
  }
  const name = p => mode === 'cpu' ? (p === 1 ? 'You' : 'Computer') : (p === 1 ? 'Red' : 'Yellow');
  function setMsg(t) { st.textContent = t || (mode === 'cpu' ? (turn === 1 ? 'Your turn (red)' : 'Computer is thinking…') : `${name(turn)}'s turn`); }
  function render(cells) {
    const hl = new Set((cells || []).map(([c, r]) => c + ',' + r));
    el.innerHTML = '';
    for (let r = R - 1; r >= 0; r--) for (let c = 0; c < C; c++) {
      const d = document.createElement('button'); d.className = 'c4c' + (b[c][r] ? ' p' + b[c][r] : '') + (hl.has(c + ',' + r) ? ' win' : ''); d.dataset.c = c; d.setAttribute('aria-label', 'column ' + (c + 1)); el.appendChild(d);
    }
    G.$('#sa').textContent = tally.a; G.$('#sb').textContent = tally.b; G.$('#sd').textContent = tally.d;
  }
  function drop(c) {
    if (over || busy) return; const r = top(b, c); if (r < 0) return;
    b[c][r] = turn; const w = win(b);
    if (w) {
      over = true;
      if (w.p === 0) { tally.d++; setMsg("It's a draw!"); }
      else { w.p === 1 ? tally.a++ : tally.b++; setMsg(mode === 'cpu' ? (w.p === 1 ? 'You win! 🎉' : 'Computer wins!') : `${name(w.p)} wins! 🎉`); if (mode !== 'cpu' || w.p === 1) G.confetti(); }
      G.set('c4_tally', tally); render(w.cells); first = 3 - first; G.$('#again').classList.remove('hidden'); return;
    }
    turn = 3 - turn; render(); setMsg();
    if (mode === 'cpu' && turn === 2) { busy = true; setTimeout(() => { busy = false; drop(aiMove()); }, 350); }
  }
  function start() {
    b = Array.from({ length: C }, () => Array(R).fill(0)); over = false; busy = false; turn = first; G.$('#again').classList.add('hidden'); render(); setMsg();
    if (mode === 'cpu' && turn === 2) { busy = true; setTimeout(() => { busy = false; drop(aiMove()); }, 400); }
  }
  el.addEventListener('click', e => { const d = e.target.closest('.c4c'); if (!d) return; if (mode === 'cpu' && turn !== 1) return; drop(+d.dataset.c); });
  addEventListener('keydown', e => { if (/^[1-7]$/.test(e.key) && !(mode === 'cpu' && turn !== 1)) drop(+e.key - 1); });
  G.$('#again').onclick = start;
  G.$('#reset').onclick = () => { tally = { a: 0, b: 0, d: 0 }; G.set('c4_tally', tally); first = 1; start(); };
  const md = G.$('#mode'), lv = G.$('#level');
  G.$$('button', md).forEach(x => x.classList.toggle('on', x.dataset.v === mode));
  G.$$('button', lv).forEach(x => x.classList.toggle('on', x.dataset.v === level));
  const labels = () => { lv.classList.toggle('hidden', mode !== 'cpu'); G.$('#la').textContent = mode === 'cpu' ? 'You' : 'Red'; G.$('#lb').textContent = mode === 'cpu' ? 'Computer' : 'Yellow'; };
  G.seg(md, v => { mode = v; G.set('c4_mode', v); first = 1; labels(); start(); });
  G.seg(lv, v => { level = v; G.set('c4_level', v); first = 1; start(); });
  labels(); start();
})();
