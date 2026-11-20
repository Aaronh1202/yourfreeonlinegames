// Sliding Puzzle: put the numbered tiles back in order
(() => {
  const el = G.$('#sp'), ov = G.$('#ov');
  let n = +G.get('sp_size', 4), t, blank, moves, done;
  const timer = G.timer(s => G.$('#time').textContent = G.fmt(s));
  function setBest() { const b = G.get('sp_best_' + n, null); G.$('#best').textContent = b ? `${b.m} moves` : '—'; }
  const nb = i => { const r = Math.floor(i / n), c = i % n, o = []; if (r > 0) o.push(i - n); if (r < n - 1) o.push(i + n); if (c > 0) o.push(i - 1); if (c < n - 1) o.push(i + 1); return o; };
  function shuffle() {
    t = Array.from({ length: n * n }, (_, i) => (i + 1) % (n * n)); blank = n * n - 1; let prev = -1;
    for (let k = 0; k < 60 * n * n; k++) { const opts = nb(blank).filter(x => x !== prev); const j = opts[G.rnd(opts.length)]; [t[blank], t[j]] = [t[j], t[blank]]; prev = blank; blank = j; }
    if (solved()) shuffle();
  }
  const solved = () => t.every((v, i) => v === (i + 1) % (n * n));
  function render() {
    el.style.gridTemplateColumns = `repeat(${n},1fr)`; el.dataset.n = n;
    el.innerHTML = t.map((v, i) => v ? `<button class="spt${v === i + 1 ? ' ok' : ''}" data-i="${i}">${v}</button>` : '<span class="spt blank"></span>').join('');
    G.$('#moves').textContent = moves;
  }
  function slide(i) {
    if (done || i === blank) return;
    const br = Math.floor(blank / n), bc = blank % n, r = Math.floor(i / n), c = i % n;
    if (r !== br && c !== bc) return;
    if (!timer.running()) timer.start();
    const step = r === br ? (c > bc ? 1 : -1) : (r > br ? n : -n);
    while (blank !== i) { const j = blank + step; t[blank] = t[j]; t[j] = 0; blank = j; moves++; }
    render();
    if (solved()) {
      done = true; timer.stop(); const s = Math.round(timer.sec()), k = 'sp_best_' + n, b = G.get(k, null), rec = !b || moves < b.m || (moves === b.m && s < b.t);
      if (rec) G.set(k, { m: moves, t: s }); setBest(); G.confetti();
      setTimeout(() => G.overlay(ov, 'Solved! 🎉', `Moves: <b>${moves}</b> · Time: <b>${G.fmt(s)}</b>${rec ? '<br>🏆 New best!' : ''}`, 'Play again', start), 400);
    }
  }
  function start() { shuffle(); moves = 0; done = false; timer.reset(); ov.classList.add('hidden'); render(); setBest(); }
  el.addEventListener('click', e => { const d = e.target.closest('.spt'); if (d && d.dataset.i) slide(+d.dataset.i); });
  addEventListener('keydown', e => {
    const d = G.keyDir(e); if (!d || done) return; e.preventDefault();
    const r = Math.floor(blank / n), c = blank % n;
    // arrow moves the tile next to the gap in that direction into the gap
    const tgt = { up: r < n - 1 ? blank + n : -1, down: r > 0 ? blank - n : -1, left: c < n - 1 ? blank + 1 : -1, right: c > 0 ? blank - 1 : -1 }[d];
    if (tgt >= 0) slide(tgt);
  });
  G.$('#new').onclick = start;
  const sz = G.$('#size'); G.$$('button', sz).forEach(x => x.classList.toggle('on', +x.dataset.v === n));
  G.seg(sz, v => { n = +v; G.set('sp_size', n); start(); });
  start();
})();
