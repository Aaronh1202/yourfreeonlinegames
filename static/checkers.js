(() => {
  // board: 64 squares, 1=red man, 2=red king, -1=black man, -2=black king. Red (player) starts at bottom and moves up.
  const el = G.$('#ck'), ov = G.$('#ov');
  let b, turn, sel = null, prefix = [], legal = [], mode = G.get('ck_mode', 'cpu'), level = G.get('ck_level', 'medium'), hist = [], quiet = 0, thinking = false, over = false, lastMove = null;
  const rc = i => [(i / 8) | 0, i % 8], idx = (r, c) => r * 8 + c, on = (r, c) => r >= 0 && r < 8 && c >= 0 && c < 8;
  const sideOf = v => Math.sign(v);

  function start() {
    b = Array(64).fill(0);
    for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) if ((r + c) % 2 === 1) { if (r < 3) b[idx(r, c)] = -1; if (r > 4) b[idx(r, c)] = 1; }
    turn = 1; sel = null; prefix = []; hist = []; quiet = 0; over = false; lastMove = null; thinking = false;
    ov.classList.add('hidden'); legal = moves(b, turn); render(); setStatus();
  }
  function dirs(v) { const k = Math.abs(v) === 2; return k ? [[-1, -1], [-1, 1], [1, -1], [1, 1]] : (v > 0 ? [[-1, -1], [-1, 1]] : [[1, -1], [1, 1]]); }
  function moves(B, side) {
    const caps = [], simple = [];
    for (let i = 0; i < 64; i++) {
      const v = B[i]; if (sideOf(v) !== side) continue;
      const [r, c] = rc(i);
      // captures (DFS)
      const dfs = (pos, piece, path, taken) => {
        const [pr, pc] = rc(pos); let ext = false;
        for (const [dr, dc] of dirs(piece)) {
          const mr = pr + dr, mc = pc + dc, lr = pr + 2 * dr, lc = pc + 2 * dc;
          if (!on(lr, lc)) continue;
          const m = idx(mr, mc), l = idx(lr, lc);
          if (sideOf(B[m]) !== -side || taken.includes(m) || (B[l] !== 0 && l !== i)) continue;
          ext = true;
          const crown = Math.abs(piece) === 1 && (lr === 0 || lr === 7);
          if (crown) caps.push({ from: i, path: [...path, l], caps: [...taken, m], crown: true });
          else dfs(l, piece, [...path, l], [...taken, m]);
        }
        if (!ext && path.length) caps.push({ from: i, path, caps: taken });
      };
      dfs(i, v, [], []);
      for (const [dr, dc] of dirs(v)) { const nr = r + dr, nc = c + dc; if (on(nr, nc) && B[idx(nr, nc)] === 0) simple.push({ from: i, path: [idx(nr, nc)], caps: [] }); }
    }
    return caps.length ? caps : simple;
  }
  function apply(B, m) {
    const N = B.slice(), v = N[m.from]; N[m.from] = 0; m.caps.forEach(c => N[c] = 0);
    const to = m.path[m.path.length - 1], [r] = rc(to);
    N[to] = (Math.abs(v) === 1 && (r === 0 || r === 7)) ? 2 * Math.sign(v) : v;
    return N;
  }
  // ---- AI ----
  function evalB(B) {
    let s = 0;
    for (let i = 0; i < 64; i++) {
      const v = B[i]; if (!v) continue; const [r, c] = rc(i);
      let w = Math.abs(v) === 2 ? 175 : 100;
      if (Math.abs(v) === 1) w += (v > 0 ? 7 - r : r) * 4;           // advancement
      if (c >= 2 && c <= 5 && r >= 2 && r <= 5) w += 6;               // center
      if (Math.abs(v) === 1 && ((v > 0 && r === 7) || (v < 0 && r === 0))) w += 8; // back rank guard
      s += w * Math.sign(v);
    }
    return s; // positive = good for red
  }
  function search(B, side, depth, a, bt) {
    const ms = moves(B, side);
    if (!ms.length) return -100000 - depth;
    if (depth === 0) return evalB(B) * side;
    let best = -Infinity;
    for (const m of ms) {
      const v = -search(apply(B, m), -side, depth - 1, -bt, -a);
      if (v > best) best = v; if (v > a) a = v; if (a >= bt) break;
    }
    return best;
  }
  function aiMove() {
    const ms = moves(b, turn); if (!ms.length) return;
    if (level === 'easy' && Math.random() < .45) return ms[G.rnd(ms.length)];
    const depth = { easy: 2, medium: 4, hard: 6 }[level];
    let best = -Infinity, pick = [];
    for (const m of G.shuffle(ms.slice())) {
      const v = -search(apply(b, m), -turn, depth - 1, -Infinity, Infinity);
      if (v > best) { best = v; pick = [m]; } else if (v === best) pick.push(m);
    }
    return pick[0];
  }
  // ---- play ----
  function commit(m) {
    hist.push({ b: b.slice(), turn, quiet, lastMove });
    const wasMan = Math.abs(b[m.from]) === 1;
    b = apply(b, m); lastMove = m;
    quiet = (m.caps.length || wasMan) ? 0 : quiet + 1;
    turn = -turn; sel = null; prefix = []; legal = moves(b, turn);
    render(); setStatus();
    if (checkEnd()) return;
    if (mode === 'cpu' && turn === -1) { thinking = true; setStatus(); setTimeout(() => { const am = aiMove(); thinking = false; if (am) commit(am); }, 380); }
  }
  function checkEnd() {
    if (!legal.length) {
      over = true; const winner = -turn;
      const youWon = mode === 'cpu' ? winner === 1 : null;
      if (mode === 'cpu') { const k = youWon ? 'ck_wins' : 'ck_losses'; G.set(k, G.get(k, 0) + 1); score(); if (youWon) G.confetti(); }
      G.overlay(ov, mode === 'cpu' ? (youWon ? 'You win! 🎉' : 'Computer wins') : (winner === 1 ? 'Red wins! 🎉' : 'Black wins! 🎉'), mode === 'cpu' && !youWon ? 'Want a rematch?' : '', 'Play again', start);
      return true;
    }
    if (quiet >= 80) { over = true; G.overlay(ov, 'Draw', 'No captures or man moves for 40 turns each.', 'Play again', start); return true; }
    return false;
  }
  function score() { G.$('#wins').textContent = G.get('ck_wins', 0); G.$('#losses').textContent = G.get('ck_losses', 0); }
  function setStatus() {
    const t = G.$('#turn');
    if (over) return;
    if (thinking) t.textContent = 'Computer is thinking…';
    else if (mode === 'cpu') t.textContent = turn === 1 ? 'Your turn (red)' + (legal[0] && legal[0].caps.length ? ' · you must jump!' : '') : 'Computer’s turn';
    else t.textContent = (turn === 1 ? 'Red' : 'Black') + '’s turn' + (legal[0] && legal[0].caps.length ? ' · must jump!' : '');
    const red = b.filter(v => v > 0).length, blk = b.filter(v => v < 0).length;
    G.$('#red').textContent = red; G.$('#black').textContent = blk;
  }
  function candidates() { return legal.filter(m => m.from === sel && prefix.every((p, i) => m.path[i] === p)); }
  function render() {
    const cand = sel !== null ? candidates() : [];
    const targets = new Set(cand.map(m => m.path[prefix.length]));
    const movable = new Set((!over && !thinking && (mode === 'pvp' || turn === 1)) ? legal.map(m => m.from) : []);
    const lm = lastMove ? new Set([lastMove.from, ...lastMove.path]) : new Set();
    el.innerHTML = '';
    for (let i = 0; i < 64; i++) {
      const [r, c] = rc(i), d = document.createElement('div');
      d.className = 'sq ' + ((r + c) % 2 ? 'dk' : 'lt') + (lm.has(i) ? ' last' : '') + (targets.has(i) ? ' tgt' : '');
      d.dataset.i = i;
      // during multi-jump show the piece at the current prefix square
      let v = b[i];
      if (sel !== null && prefix.length) { if (i === sel) v = 0; if (i === prefix[prefix.length - 1]) v = b[sel]; }
      if (v) {
        const p = document.createElement('span');
        p.className = 'pc ' + (v > 0 ? 'red' : 'blk') + (Math.abs(v) === 2 ? ' king' : '') + ((i === sel && !prefix.length) || (prefix.length && i === prefix[prefix.length - 1]) ? ' sel' : '') + (movable.has(i) && sel === null ? ' can' : '');
        d.appendChild(p);
      }
      el.appendChild(d);
    }
  }
  el.addEventListener('click', e => {
    const d = e.target.closest('.sq'); if (!d || over || thinking) return;
    if (mode === 'cpu' && turn !== 1) return;
    const i = +d.dataset.i;
    if (sel !== null) {
      const cand = candidates(), next = cand.filter(m => m.path[prefix.length] === i);
      if (next.length) {
        const done = next.find(m => m.path.length === prefix.length + 1);
        if (done) return commit(done);
        prefix.push(i); render(); return;
      }
      if (prefix.length) return; // mid-jump: must continue
    }
    if (sideOf(b[i]) === turn && legal.some(m => m.from === i)) { sel = i; prefix = []; render(); }
    else if (sideOf(b[i]) === turn) { d.firstChild && d.firstChild.animate([{ transform: 'translateX(-3px)' }, { transform: 'translateX(3px)' }, { transform: 'none' }], { duration: 160 }); }
    else { sel = null; prefix = []; render(); }
  });
  function undo() {
    if (thinking || !hist.length) return;
    let h = hist.pop();
    if (mode === 'cpu' && h.turn === -1 && hist.length) h = hist.pop(); // undo computer + your move
    b = h.b; turn = h.turn; quiet = h.quiet; lastMove = h.lastMove; over = false; sel = null; prefix = []; ov.classList.add('hidden');
    legal = moves(b, turn); render(); setStatus();
  }
  G.$('#new').onclick = start; G.$('#undo').onclick = undo;
  addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); undo(); } if (e.key === 'Escape') { sel = null; prefix = []; render(); } });
  const md = G.$('#mode'), lv = G.$('#level');
  G.$$('button', md).forEach(x => x.classList.toggle('on', x.dataset.v === mode));
  G.$$('button', lv).forEach(x => x.classList.toggle('on', x.dataset.v === level));
  const showLv = () => lv.classList.toggle('hidden', mode !== 'cpu');
  G.seg(md, v => { mode = v; G.set('ck_mode', v); showLv(); start(); });
  G.seg(lv, v => { level = v; G.set('ck_level', v); start(); });
  showLv(); score(); start();
})();
