(() => {
  const LV = { easy: [9, 9, 10], medium: [16, 16, 40], hard: [30, 16, 99] };
  const el = G.$('#ms'), ov = G.$('#ov');
  let level = G.cfg.level || G.get('ms_level', 'easy'), W, H, M, cells, started, over, flags, opened, flagMode = false;
  const timer = G.timer(s => G.$('#time').textContent = G.fmt(s));

  function sizeCells() {
    const avail = Math.min(G.$('.mswrap').clientWidth - 16, 900);
    const cs = Math.max(26, Math.min(38, Math.floor(avail / W) - 2));
    el.style.setProperty('--cs', cs + 'px');
  }
  function newGame() {
    [W, H, M] = LV[level];
    cells = Array.from({ length: W * H }, () => ({ mine: false, n: 0, open: false, flag: false }));
    started = false; over = false; flags = 0; opened = 0; timer.reset(); ov.classList.add('hidden');
    el.style.gridTemplateColumns = `repeat(${W}, var(--cs))`;
    el.innerHTML = '';
    cells.forEach((c, i) => { const b = document.createElement('button'); b.dataset.i = i; b.setAttribute('aria-label', 'cell'); el.appendChild(b); });
    sizeCells(); updateCount(); setBest();
  }
  const nb = i => { const x = i % W, y = (i / W) | 0, r = []; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { if (!dx && !dy) continue; const nx = x + dx, ny = y + dy; if (nx >= 0 && ny >= 0 && nx < W && ny < H) r.push(ny * W + nx); } return r; };
  function plant(safe) {
    const banned = new Set([safe, ...nb(safe)]);
    const pool = cells.map((_, i) => i).filter(i => !banned.has(i));
    G.shuffle(pool).slice(0, M).forEach(i => cells[i].mine = true);
    cells.forEach((c, i) => c.n = nb(i).filter(j => cells[j].mine).length);
  }
  function btn(i) { return el.children[i]; }
  function paint(i) {
    const c = cells[i], b = btn(i);
    b.className = c.open ? 'open' + (c.n && !c.mine ? ' n' + c.n : '') : '';
    b.textContent = c.open ? (c.mine ? '💣' : (c.n || '')) : (c.flag ? '🚩' : '');
  }
  function open(i) {
    const c = cells[i]; if (c.open || c.flag) return;
    if (!started) { plant(i); started = true; timer.start(); }
    if (c.mine) return lose(i);
    const stack = [i];
    while (stack.length) {
      const j = stack.pop(), d = cells[j];
      if (d.open || d.flag) continue;
      d.open = true; opened++; paint(j);
      if (d.n === 0) nb(j).forEach(k => { if (!cells[k].open) stack.push(k); });
    }
    if (opened === W * H - M) win();
  }
  function chord(i) {
    const c = cells[i]; if (!c.open || !c.n) return;
    const around = nb(i);
    if (around.filter(j => cells[j].flag).length !== c.n) return;
    around.forEach(j => { if (!over) open(j); });
  }
  function toggleFlag(i) {
    const c = cells[i]; if (c.open || over) return;
    c.flag = !c.flag; flags += c.flag ? 1 : -1; paint(i); updateCount();
  }
  function updateCount() { G.$('#mines').textContent = M - flags; }
  function lose(i) {
    over = true; timer.stop();
    cells.forEach((c, j) => { if (c.mine && !c.flag) { c.open = true; paint(j); } else if (c.flag && !c.mine) btn(j).textContent = '❌'; });
    btn(i).classList.add('boom');
    setTimeout(() => G.overlay(ov, '💥 Boom!', 'You hit a mine. Want another go?', 'Play again', newGame), 600);
  }
  function win() {
    over = true; timer.stop();
    cells.forEach((c, j) => { if (c.mine && !c.flag) { c.flag = true; paint(j); } });
    flags = M; updateCount();
    const t = Math.round(timer.sec()), key = 'ms_best_' + level, b = G.get(key, null);
    const rec = b === null || t < b; if (rec) G.set(key, t); setBest();
    G.confetti();
    G.overlay(ov, 'You win! 🎉', `Time: <b>${G.fmt(t)}</b>${rec ? ' · New best!' : ''}`, 'Play again', newGame);
  }
  function setBest() { const b = G.get('ms_best_' + level, null); G.$('#best').textContent = b === null ? '—' : G.fmt(b); }

  // input: left click open/chord, right click flag, long press flag on touch
  let pressT = null, longFired = false;
  el.addEventListener('contextmenu', e => { e.preventDefault(); const b = e.target.closest('button'); if (b && !longFired) toggleFlag(+b.dataset.i); });
  el.addEventListener('pointerdown', e => {
    const b = e.target.closest('button'); if (!b || over) return;
    longFired = false;
    if (e.pointerType !== 'mouse') pressT = setTimeout(() => { longFired = true; toggleFlag(+b.dataset.i); if (navigator.vibrate) navigator.vibrate(30); }, 380);
  });
  const cancel = () => clearTimeout(pressT);
  el.addEventListener('pointerup', cancel); el.addEventListener('pointerleave', cancel); el.addEventListener('pointercancel', cancel);
  el.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b || over) return;
    if (longFired) { longFired = false; return; }
    const i = +b.dataset.i;
    if (cells[i].open) return chord(i);
    if (flagMode) return toggleFlag(i);
    open(i);
  });
  const lv = G.$('#level');
  G.$$('button', lv).forEach(b => b.classList.toggle('on', b.dataset.v === level));
  G.seg(lv, v => { level = v; G.set('ms_level', v); newGame(); });
  G.$('#new').onclick = newGame;
  const fm = G.$('#flagmode');
  fm.onclick = () => { flagMode = !flagMode; fm.classList.toggle('on', flagMode); fm.textContent = flagMode ? '🚩 Flag mode: ON' : '🚩 Flag mode: OFF'; };
  addEventListener('resize', sizeCells);
  newGame();
})();
