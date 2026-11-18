(() => {
  const board = G.$('#g2048'), tilesEl = G.$('.tiles', board), ov = G.$('#ov');
  let grid, score, best = G.get('2048_best', 0), prev = null, won = false, keepGoing = false, id = 0, busy = false;
  G.$('#best').textContent = best;

  const empty = () => Array.from({ length: 4 }, () => Array(4).fill(null));
  function addRandom() {
    const free = [];
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) if (!grid[r][c]) free.push([r, c]);
    if (!free.length) return;
    const [r, c] = free[G.rnd(free.length)];
    grid[r][c] = { v: Math.random() < .9 ? 2 : 4, id: ++id, isNew: true };
  }
  function newGame() {
    grid = empty(); score = 0; prev = null; won = false; keepGoing = false;
    addRandom(); addRandom(); ov.classList.add('hidden'); render(); save();
  }
  function save() { G.set('2048_state', { grid: grid.map(r => r.map(t => t && t.v)), score, won, keepGoing }); }
  function load() {
    const s = G.get('2048_state', null);
    if (!s || !s.grid) return false;
    grid = s.grid.map(r => r.map(v => v ? { v, id: ++id } : null)); score = s.score; won = s.won; keepGoing = s.keepGoing;
    render(); return true;
  }
  function render() {
    const alive = new Set();
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
      const t = grid[r][c]; if (!t) continue; alive.add(String(t.id));
      let el = tilesEl.querySelector(`[data-id="${t.id}"]`);
      if (!el) { el = document.createElement('div'); el.dataset.id = t.id; tilesEl.appendChild(el); }
      el.className = 'tile ' + (t.v <= 2048 ? 't' + t.v : 'tbig') + (t.isNew ? ' new' : '') + (t.merged ? ' merged' : '');
      el.textContent = t.v;
      el.style.left = `calc(${c} * (100% + var(--gap)) / 4)`;
      el.style.top = `calc(${r} * (100% + var(--gap)) / 4)`;
      t.isNew = false; t.merged = false;
    }
    [...tilesEl.children].forEach(el => { if (!alive.has(el.dataset.id)) el.remove(); });
    G.$('#score').textContent = score;
    if (score > best) { best = score; G.set('2048_best', best); }
    G.$('#best').textContent = best;
    G.$('#undo').disabled = !prev;
  }
  function move(dir) {
    if (busy || !ov.classList.contains('hidden')) return;
    const snap = { grid: grid.map(r => r.map(t => t && { v: t.v, id: t.id })), score };
    let moved = false;
    const vec = { left: [0, -1], right: [0, 1], up: [-1, 0], down: [1, 0] }[dir];
    const rows = [0, 1, 2, 3], cols = [0, 1, 2, 3];
    if (vec[0] === 1) rows.reverse(); if (vec[1] === 1) cols.reverse();
    const mergedIds = new Set(), removed = [];
    for (const r of rows) for (const c of cols) {
      const t = grid[r][c]; if (!t) continue;
      let nr = r, nc = c;
      while (true) {
        const tr = nr + vec[0], tc = nc + vec[1];
        if (tr < 0 || tr > 3 || tc < 0 || tc > 3) break;
        const o = grid[tr][tc];
        if (!o) { nr = tr; nc = tc; continue; }
        if (o.v === t.v && !mergedIds.has(o.id)) { nr = tr; nc = tc; }
        break;
      }
      if (nr === r && nc === c) continue;
      moved = true;
      const o = grid[nr][nc];
      grid[r][c] = null;
      if (o) {
        // slide t under o, then remove; o doubles
        removed.push({ t, r: nr, c: nc });
        o.v *= 2; o.merged = true; mergedIds.add(o.id); score += o.v;
        if (o.v === 2048 && !won) won = true;
      } else grid[nr][nc] = t;
    }
    if (!moved) return;
    prev = snap;
    // animate removed tiles sliding into place
    removed.forEach(({ t, r, c }) => {
      const el = tilesEl.querySelector(`[data-id="${t.id}"]`);
      if (el) { el.style.left = `calc(${c} * (100% + var(--gap)) / 4)`; el.style.top = `calc(${r} * (100% + var(--gap)) / 4)`; el.style.zIndex = 0; el.dataset.dead = 1; }
    });
    busy = true;
    // first move survivors, then pop merged + add new
    const keepIds = new Set(); grid.flat().forEach(t => t && keepIds.add(String(t.id)));
    const mergedNow = grid.flat().filter(t => t && t.merged);
    mergedNow.forEach(t => t.merged = false);
    renderPositions();
    setTimeout(() => {
      mergedNow.forEach(t => t.merged = true);
      G.$$('[data-dead]', tilesEl).forEach(el => el.remove());
      addRandom(); render(); save(); busy = false;
      if (won && !keepGoing) { keepGoing = true; save(); G.confetti(); G.overlay(ov, 'You made 2048! 🎉', `Score: <b>${score}</b>`, 'Keep going', null); addNewBtn(); }
      else if (!canMove()) { G.overlay(ov, 'Game over', `Score: <b>${score}</b> · Best: <b>${best}</b>`, 'Try again', newGame); }
    }, 110);
  }
  function addNewBtn() {
    const b = document.createElement('button'); b.className = 'btn'; b.textContent = 'New game'; b.onclick = newGame; ov.appendChild(b);
  }
  function renderPositions() {
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
      const t = grid[r][c]; if (!t) continue;
      const el = tilesEl.querySelector(`[data-id="${t.id}"]`);
      if (el) { el.style.left = `calc(${c} * (100% + var(--gap)) / 4)`; el.style.top = `calc(${r} * (100% + var(--gap)) / 4)`; }
    }
  }
  function canMove() {
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
      const t = grid[r][c]; if (!t) return true;
      if (c < 3 && grid[r][c + 1] && grid[r][c + 1].v === t.v) return true;
      if (r < 3 && grid[r + 1][c] && grid[r + 1][c].v === t.v) return true;
    }
    return false;
  }
  function undo() {
    if (!prev || busy) return;
    tilesEl.innerHTML = '';
    grid = prev.grid; score = prev.score; prev = null; ov.classList.add('hidden'); render(); save();
  }
  addEventListener('keydown', e => {
    if (e.target.closest('input,textarea,select')) return;
    const d = G.keyDir(e); if (d) { e.preventDefault(); move(d); }
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); undo(); }
  });
  G.swipe(board, move);
  G.$('#new').onclick = newGame;
  G.$('#undo').onclick = undo;
  if (!load()) newGame();
})();
