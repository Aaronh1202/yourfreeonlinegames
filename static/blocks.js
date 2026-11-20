// Falling Blocks: rotate and drop pieces to clear lines
(() => {
  const cv = G.$('#fb'), x = cv.getContext('2d'), nx = G.$('#fbnext').getContext('2d'), ov = G.$('#ov');
  const COLS = 10, ROWS = 20, S = cv.width / COLS;
  const P = {
    I: { c: '#22d3ee', m: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]] }, O: { c: '#ffcc33', m: [[1, 1], [1, 1]] },
    T: { c: '#c39bff', m: [[0, 1, 0], [1, 1, 1], [0, 0, 0]] }, S: { c: '#3ddc97', m: [[0, 1, 1], [1, 1, 0], [0, 0, 0]] },
    Z: { c: '#ff5c5c', m: [[1, 1, 0], [0, 1, 1], [0, 0, 0]] }, J: { c: '#6cb6ff', m: [[1, 0, 0], [1, 1, 1], [0, 0, 0]] }, L: { c: '#ff9452', m: [[0, 0, 1], [1, 1, 1], [0, 0, 0]] }
  };
  let board, cur, next, bag = [], score, lines, level, dropT, last, state = 'play', best = G.get('fb_best', 0);
  const take = () => { if (!bag.length) bag = G.shuffle(Object.keys(P)); const k = bag.pop(); return { k, m: P[k].m.map(r => r.slice()), x: 0, y: 0 }; };
  const rot = m => m[0].map((_, i) => m.map(r => r[i]).reverse());
  const fits = (m, px, py) => m.every((r, y) => r.every((v, xx) => !v || (px + xx >= 0 && px + xx < COLS && py + y < ROWS && (py + y < 0 || !board[py + y][px + xx]))));
  const interval = () => Math.max(70, 800 - (level - 1) * 70);
  function spawn() { cur = next || take(); next = take(); cur.x = Math.floor((COLS - cur.m[0].length) / 2); cur.y = cur.k === 'I' ? -1 : 0; if (!fits(cur.m, cur.x, cur.y)) over(); drawNext(); }
  function pills() { G.$('#score').textContent = score; G.$('#lines').textContent = lines; G.$('#lvl').textContent = level; G.$('#best').textContent = best; }
  function start() { board = Array.from({ length: ROWS }, () => Array(COLS).fill(null)); score = 0; lines = 0; level = 1; dropT = 0; next = null; bag = []; state = 'play'; ov.classList.add('hidden'); spawn(); pills(); G.$('#pause').textContent = '⏸ Pause'; }
  function over() { state = 'over'; const rec = score > best; if (rec) { best = score; G.set('fb_best', best); } pills(); G.overlay(ov, 'Game over', `Score: <b>${score}</b> · Lines: <b>${lines}</b>${rec && score ? '<br>🏆 New best!' : ''}`, 'Play again', start); }
  function lock() {
    cur.m.forEach((r, y) => r.forEach((v, xx) => { if (v && cur.y + y >= 0) board[cur.y + y][cur.x + xx] = P[cur.k].c; }));
    if (cur.m.some((r, y) => r.some(v => v) && cur.y + y < 0)) return over();
    let n = 0; for (let y = ROWS - 1; y >= 0; y--) if (board[y].every(Boolean)) { board.splice(y, 1); board.unshift(Array(COLS).fill(null)); n++; y++; }
    if (n) { score += [0, 100, 300, 500, 800][n] * level; lines += n; level = 1 + Math.floor(lines / 10); }
    pills(); spawn();
  }
  function move(dx) { if (state === 'play' && fits(cur.m, cur.x + dx, cur.y)) cur.x += dx; }
  function down(soft) { if (state !== 'play') return; if (fits(cur.m, cur.x, cur.y + 1)) { cur.y++; if (soft) { score++; pills(); } } else lock(); dropT = 0; }
  function hard() { if (state !== 'play') return; let n = 0; while (fits(cur.m, cur.x, cur.y + 1)) { cur.y++; n++; } score += n * 2; lock(); dropT = 0; }
  function turn() { if (state !== 'play') return; const m = rot(cur.m); for (const k of [0, -1, 1, -2, 2]) if (fits(m, cur.x + k, cur.y)) { cur.m = m; cur.x += k; return; } }
  function pause() { if (state === 'over') return; state = state === 'pause' ? 'play' : 'pause'; G.$('#pause').textContent = state === 'pause' ? '▶ Resume' : '⏸ Pause'; }
  function cell(cx, px, py, c, s) { cx.fillStyle = c; cx.fillRect(px * s + 1, py * s + 1, s - 2, s - 2); cx.fillStyle = 'rgba(255,255,255,.25)'; cx.fillRect(px * s + 1, py * s + 1, s - 2, 4); }
  function draw() {
    x.fillStyle = '#0a0d1f'; x.fillRect(0, 0, cv.width, cv.height);
    x.strokeStyle = 'rgba(255,255,255,.04)'; for (let i = 1; i < COLS; i++) { x.beginPath(); x.moveTo(i * S, 0); x.lineTo(i * S, cv.height); x.stroke(); }
    board.forEach((r, y) => r.forEach((c, xx) => c && cell(x, xx, y, c, S)));
    if (cur && state !== 'over') {
      let gy = cur.y; while (fits(cur.m, cur.x, gy + 1)) gy++;
      x.globalAlpha = .22; cur.m.forEach((r, y) => r.forEach((v, xx) => v && cell(x, cur.x + xx, gy + y, P[cur.k].c, S))); x.globalAlpha = 1;
      cur.m.forEach((r, y) => r.forEach((v, xx) => v && cur.y + y >= 0 && cell(x, cur.x + xx, cur.y + y, P[cur.k].c, S)));
    }
    if (state === 'pause') { x.fillStyle = 'rgba(0,0,0,.55)'; x.fillRect(0, 0, cv.width, cv.height); x.fillStyle = '#fff'; x.font = '800 28px system-ui'; x.textAlign = 'center'; x.fillText('Paused', cv.width / 2, cv.height / 2); }
  }
  function drawNext() { nx.clearRect(0, 0, 96, 96); const m = next.m, s = 20, ox = (96 - m[0].length * s) / 2, oy = (96 - m.length * s) / 2; m.forEach((r, y) => r.forEach((v, xx) => { if (v) { nx.fillStyle = P[next.k].c; nx.fillRect(ox + xx * s + 1, oy + y * s + 1, s - 2, s - 2); } })); }
  function loop(t) { const dt = t - (last || t); last = t; if (state === 'play') { dropT += dt; if (dropT >= interval()) down(false); } draw(); requestAnimationFrame(loop); }
  addEventListener('keydown', e => {
    const k = e.key;
    if (['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', ' '].includes(k)) e.preventDefault();
    if (k === 'ArrowLeft' || k === 'a') move(-1); else if (k === 'ArrowRight' || k === 'd') move(1);
    else if (k === 'ArrowDown' || k === 's') down(true); else if (k === 'ArrowUp' || k === 'w' || k === 'x') turn();
    else if (k === ' ') hard(); else if (k === 'p' || k === 'P' || k === 'Escape') pause();
  });
  G.$$('#fbpad button').forEach(b => {
    const act = { l: () => move(-1), r: () => move(1), d: () => down(true), u: turn, h: hard }[b.dataset.a];
    let rep; const stop = () => { clearInterval(rep); clearTimeout(rep); };
    b.addEventListener('pointerdown', e => { e.preventDefault(); act(); if ('lrd'.includes(b.dataset.a)) rep = setTimeout(() => rep = setInterval(act, 70), 220); });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => b.addEventListener(ev, stop));
  });
  let sx, sy, moved; cv.addEventListener('touchstart', e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; moved = false; }, { passive: true });
  cv.addEventListener('touchmove', e => { e.preventDefault(); const t = e.touches[0], dx = t.clientX - sx, dy = t.clientY - sy, step = cv.getBoundingClientRect().width / COLS;
    if (Math.abs(dx) > step) { move(dx > 0 ? 1 : -1); sx = t.clientX; moved = true; } else if (dy > step) { down(true); sy = t.clientY; moved = true; } }, { passive: false });
  cv.addEventListener('touchend', e => { if (!moved) turn(); });
  G.$('#pause').onclick = e => { pause(); e.target.blur(); };
  G.$('#new').onclick = e => { start(); e.target.blur(); };
  start(); requestAnimationFrame(loop);
})();
