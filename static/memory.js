// Memory Match: flip cards and find all the pairs
(() => {
  const EMO = ['🐶', '🐱', '🦊', '🐼', '🐸', '🦁', '🐵', '🐧', '🦄', '🐙', '🐢', '🦋', '🍓', '🍉', '🍕', '🌵', '⚽', '🚀'];
  const LV = { easy: [4, 3], medium: [4, 4], hard: [6, 4], expert: [6, 6] };
  const el = G.$('#mem'), ov = G.$('#ov');
  let level = G.get('mem_level', 'medium'), cards, open, moves, found, lock;
  const timer = G.timer(s => G.$('#time').textContent = G.fmt(s));
  function setBest() { const b = G.get('mem_best_' + level, null); G.$('#best').textContent = b ? `${b.m} moves` : '—'; }
  function start() {
    const [cols, rows] = LV[level], n = cols * rows / 2;
    cards = G.shuffle(G.shuffle(EMO.slice()).slice(0, n).flatMap(e => [e, e])).map(e => ({ e, up: false, done: false }));
    open = []; moves = 0; found = 0; lock = false; timer.reset(); ov.classList.add('hidden');
    el.style.gridTemplateColumns = `repeat(${cols},1fr)`; el.dataset.cols = cols;
    el.innerHTML = cards.map((c, i) => `<button class="mc" data-i="${i}" aria-label="card"><span class="mf">${c.e}</span></button>`).join('');
    G.$('#moves').textContent = 0; G.$('#pairs').textContent = `0/${n}`; setBest();
  }
  function flip(i) {
    const c = cards[i], d = el.children[i]; if (lock || c.up || c.done) return;
    if (!timer.running()) timer.start();
    c.up = true; d.classList.add('up'); open.push(i);
    if (open.length < 2) return;
    moves++; G.$('#moves').textContent = moves;
    const [a, b] = open; open = [];
    if (cards[a].e === cards[b].e) {
      cards[a].done = cards[b].done = true; found++;
      setTimeout(() => { el.children[a].classList.add('done'); el.children[b].classList.add('done'); }, 250);
      const n = cards.length / 2; G.$('#pairs').textContent = `${found}/${n}`;
      if (found === n) {
        timer.stop(); const t = Math.round(timer.sec()), k = 'mem_best_' + level, best = G.get(k, null), rec = !best || moves < best.m || (moves === best.m && t < best.t);
        if (rec) G.set(k, { m: moves, t }); setBest(); G.confetti();
        setTimeout(() => G.overlay(ov, 'You found them all! 🎉', `Moves: <b>${moves}</b> · Time: <b>${G.fmt(t)}</b>${rec ? '<br>🏆 New best!' : ''}`, 'Play again', start), 600);
      }
    } else {
      lock = true;
      setTimeout(() => { [a, b].forEach(x => { cards[x].up = false; el.children[x].classList.remove('up'); }); lock = false; }, 850);
    }
  }
  el.addEventListener('click', e => { const d = e.target.closest('.mc'); if (d) flip(+d.dataset.i); });
  G.$('#new').onclick = start;
  const lv = G.$('#level'); G.$$('button', lv).forEach(x => x.classList.toggle('on', x.dataset.v === level));
  G.seg(lv, v => { level = v; G.set('mem_level', v); start(); });
  start();
})();
