(() => {
  const B = G.$('#py'), ov = G.$('#ov');
  const SUITS = ['♠', '♥', '♦', '♣'], RANKS = ['', 'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  let pyr, stock, waste, sel = null, hist = [], passes = 0, score = 0, won = false, els = {}, L = {}, streak = G.get('py_streak', 0);
  const MAXPASS = 3; // 2 recycles
  const timer = G.timer(s => G.$('#time').textContent = G.fmt(s));
  const top = a => a[a.length - 1];
  const stockSlot = document.createElement('div'); stockSlot.className = 'slot'; stockSlot.textContent = '↻'; B.appendChild(stockSlot);
  const wasteSlot = document.createElement('div'); wasteSlot.className = 'slot'; B.appendChild(wasteSlot);
  for (let s = 0; s < 4; s++) for (let r = 1; r <= 13; r++) {
    const id = s * 13 + r, e = document.createElement('div');
    e.className = 'cardx' + (s === 1 || s === 2 ? ' red' : ''); e.dataset.id = id;
    e.innerHTML = `<div class="c1">${RANKS[r]}<small>${SUITS[s]}</small></div><div class="c2">${SUITS[s]}</div>`;
    B.appendChild(e); els[id] = e;
  }
  // pyramid index: row r (0..6), pos k (0..r) -> i = r*(r+1)/2 + k
  const pIdx = (r, k) => r * (r + 1) / 2 + k;
  function deal() {
    const deck = []; for (let s = 0; s < 4; s++) for (let r = 1; r <= 13; r++) deck.push({ s, r, id: s * 13 + r });
    G.shuffle(deck);
    pyr = deck.splice(0, 28); stock = deck; waste = []; sel = null; hist = []; passes = 1; score = 0; won = false;
    timer.reset(); ov.classList.add('hidden'); layout(); render(); stats();
  }
  function layout() {
    const W = B.clientWidth, cw = Math.min(W / 7.6, 96), ch = cw * 1.4, gap = cw * .08;
    L = { W, cw, ch, gap, rowH: ch * .5 };
    L.H = L.rowH * 6 + ch + gap * 4 + ch + gap; B.style.height = L.H + 'px'; B.style.setProperty('--fs', (cw * .2) + 'px');
    const sy = L.rowH * 6 + ch + gap * 3;
    Object.assign(stockSlot.style, { left: (W / 2 - cw - gap * 2) + 'px', top: sy + 'px', width: cw + 'px', height: ch + 'px' });
    Object.assign(wasteSlot.style, { left: (W / 2 + gap * 2) + 'px', top: sy + 'px', width: cw + 'px', height: ch + 'px' });
    L.sy = sy;
    Object.values(els).forEach(e => { e.style.width = cw + 'px'; e.style.height = ch + 'px'; });
  }
  const covered = i => {
    const r = Math.floor((Math.sqrt(8 * i + 1) - 1) / 2), k = i - r * (r + 1) / 2;
    if (r === 6) return false;
    return !!(pyr[pIdx(r + 1, k)] || pyr[pIdx(r + 1, k + 1)]);
  };
  function render() {
    Object.values(els).forEach(e => e.style.display = 'none');
    const show = (c, x, y, z, back, free) => { const e = els[c.id]; e.style.display = ''; e.style.left = x + 'px'; e.style.top = y + 'px'; e.style.zIndex = z; e.classList.toggle('back', !!back); e.classList.toggle('hl', sel && sel.id === c.id); e.classList.toggle('dim', free === false); };
    for (let r = 0; r < 7; r++) for (let k = 0; k <= r; k++) {
      const i = pIdx(r, k), c = pyr[i]; if (!c) continue;
      const x = L.W / 2 - (r + 1) * (L.cw + L.gap) / 2 + k * (L.cw + L.gap) + L.gap / 2;
      show(c, x, L.gap + r * L.rowH, 10 + r, false, !covered(i));
    }
    stock.forEach((c, j) => show(c, parseFloat(stockSlot.style.left), L.sy, 100 + j, true));
    waste.slice(-3).forEach((c, j, a) => show(c, parseFloat(wasteSlot.style.left), L.sy, 200 + j, false));
    stockSlot.textContent = stock.length ? '' : (passes < MAXPASS && waste.length ? '↻' : '✕');
  }
  function stats() { G.$('#score').textContent = score; G.$('#left').textContent = pyr.filter(Boolean).length; G.$('#passes').textContent = Math.max(0, MAXPASS - passes); G.$('#undo').disabled = !hist.length; G.$('#streak').textContent = streak; }
  const push = () => hist.push(JSON.stringify({ pyr, stock, waste, passes, score }));
  function undo() { const h = hist.pop(); if (!h || won) return; ({ pyr, stock, waste, passes, score } = JSON.parse(h)); sel = null; ov.classList.add('hidden'); render(); stats(); }
  function where(id) {
    const i = pyr.findIndex(c => c && c.id === id); if (i >= 0) return covered(i) ? null : { at: 'pyr', i };
    if (top(waste) && top(waste).id === id) return { at: 'waste' };
    if (stock.some(c => c.id === id)) return { at: 'stock' };
    return null;
  }
  const cardOf = p => p.at === 'pyr' ? pyr[p.i] : top(waste);
  function remove(ps) { push(); ps.forEach(p => { if (p.at === 'pyr') pyr[p.i] = null; else waste.pop(); }); score += ps.length * 5 + (ps.some(p => p.at === 'pyr' && p.i === 0) ? 500 : 0); if (!timer.running()) timer.start(); sel = null; render(); stats(); check(); }
  function draw() {
    if (won) return;
    if (stock.length) { push(); waste.push(stock.pop()); }
    else if (passes < MAXPASS && waste.length) { push(); stock = waste.reverse(); waste = []; passes++; }
    else return;
    sel = null; if (!timer.running()) timer.start(); render(); stats(); check();
  }
  function anyMove() {
    const free = []; pyr.forEach((c, i) => c && !covered(i) && free.push(c)); if (top(waste)) free.push(top(waste));
    if (free.some(c => c.r === 13)) return true;
    for (let a = 0; a < free.length; a++) for (let b = a + 1; b < free.length; b++) if (free[a].r + free[b].r === 13) return true;
    // could a stock/waste card pair with a free pyramid card?
    const rest = stock.concat(passes < MAXPASS ? waste : []);
    return rest.length > 0 && (stock.length > 0 || passes < MAXPASS);
  }
  function check() {
    if (!pyr[0]) {
      won = true; timer.stop(); streak++; G.set('py_streak', streak); stats(); G.confetti();
      G.overlay(ov, 'You cleared the pyramid! 🎉', `Score: <b>${score}</b> · Time: <b>${G.fmt(timer.sec())}</b>`, 'Deal again', deal); return;
    }
    if (!anyMove()) { streak = 0; G.set('py_streak', 0); stats(); G.overlay(ov, 'No more moves', `You cleared <b>${28 - pyr.filter(Boolean).length}</b> of 28 pyramid cards.`, 'Deal again', deal); }
  }
  B.addEventListener('click', e => {
    if (won) return;
    const ce = e.target.closest('.cardx');
    if (!ce) { if (e.target === stockSlot) draw(); return; }
    const p = where(+ce.dataset.id); if (!p) { ce.animate([{ transform: 'translateX(-3px)' }, { transform: 'translateX(3px)' }, { transform: 'none' }], { duration: 160 }); return; }
    if (p.at === 'stock') return draw();
    const c = cardOf(p);
    if (c.r === 13) return remove([p]);
    if (!sel) { sel = { ...p, id: c.id }; render(); return; }
    if (sel.id === c.id) { sel = null; render(); return; }
    const sc = cardOf(sel);
    if (sc.r + c.r === 13) remove([sel, p]); else { sel = { ...p, id: c.id }; render(); }
  });
  G.$('#new').onclick = deal; G.$('#undo').onclick = undo;
  addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); undo(); } if (e.key === ' ') { e.preventDefault(); draw(); } });
  addEventListener('resize', () => { layout(); render(); });
  deal();
})();
