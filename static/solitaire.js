(() => {
  const B = G.$('#sol'), ov = G.$('#ov');
  const SUITS = ['♠', '♥', '♦', '♣'], RANKS = ['', 'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const red = c => c.s === 1 || c.s === 2;
  let st, hist = [], drawN = G.get('sol_draw', 1), moves = 0, score = 0, won = false, L = {}, els = {}, auto = false;
  const timer = G.timer(s => G.$('#time').textContent = G.fmt(s));

  // ----- card elements -----
  for (let s = 0; s < 4; s++) for (let r = 1; r <= 13; r++) {
    const id = s * 13 + r, e = document.createElement('div');
    e.className = 'cardx' + (s === 1 || s === 2 ? ' red' : ''); e.dataset.id = id;
    e.innerHTML = `<div class="c1">${RANKS[r]}<small>${SUITS[s]}</small></div><div class="c2">${SUITS[s]}</div>`;
    els[id] = e;
  }
  const slots = [];
  function mkSlot(txt) { const e = document.createElement('div'); e.className = 'slot'; e.textContent = txt; B.appendChild(e); slots.push(e); return e; }
  const stockSlot = mkSlot('↻'), fSlots = [0, 1, 2, 3].map(i => mkSlot(SUITS[i])), tSlots = [0, 1, 2, 3, 4, 5, 6].map(() => mkSlot(''));
  Object.values(els).forEach(e => B.appendChild(e));

  function deal() {
    const deck = []; for (let s = 0; s < 4; s++) for (let r = 1; r <= 13; r++) deck.push({ s, r, id: s * 13 + r, up: false });
    G.shuffle(deck);
    st = { stock: [], waste: [], found: [[], [], [], []], tab: [[], [], [], [], [], [], []] };
    for (let i = 0; i < 7; i++) for (let j = i; j < 7; j++) { const c = deck.pop(); c.up = i === j; st.tab[j].push(c); }
    st.stock = deck; hist = []; moves = 0; score = 0; won = false; auto = false;
    timer.reset(); ov.classList.add('hidden'); stats(); layout(); render();
  }
  const snap = () => JSON.stringify(st);
  function push() { hist.push({ st: snap(), score, moves }); if (hist.length > 200) hist.shift(); }
  function undo() { const h = hist.pop(); if (!h || won) return; st = JSON.parse(h.st); score = h.score; moves = h.moves; stats(); render(); }
  function stats() { G.$('#moves').textContent = moves; G.$('#score').textContent = score; G.$('#undo').disabled = !hist.length; }
  function act() { moves++; if (!timer.running()) timer.start(); }

  // ----- layout -----
  function layout() {
    const W = B.clientWidth, gap = Math.max(4, W * .014), cw = (W - gap * 8) / 7, ch = cw * 1.4;
    L = { W, gap, cw, ch, top: gap * 1.2, y0: gap * 2.4 + ch, fd: ch * .11, fu: ch * .27 };
    L.H = L.y0 + ch + Math.max(ch * 2.6, L.fu * 12);
    B.style.height = L.H + 'px'; B.style.setProperty('--fs', (cw * .2) + 'px');
    const place = (e, x, y) => { Object.assign(e.style, { left: x + 'px', top: y + 'px', width: cw + 'px', height: ch + 'px' }); };
    place(stockSlot, L.gap, L.top);
    fSlots.forEach((e, i) => place(e, colX(3 + i), L.top));
    tSlots.forEach((e, i) => place(e, colX(i), L.y0));
    Object.values(els).forEach(e => { e.style.width = cw + 'px'; e.style.height = ch + 'px'; });
  }
  const colX = i => L.gap + i * (L.cw + L.gap);
  function colOffsets(col) {
    // compress if too tall
    let fd = L.fd, fu = L.fu;
    const downs = col.filter(c => !c.up).length, ups = col.length - downs;
    const need = downs * fd + Math.max(0, ups - 1) * fu + L.ch, avail = L.H - L.y0 - L.gap;
    if (need > avail && ups > 1) fu = Math.max(L.ch * .14, (avail - L.ch - downs * fd) / (ups - 1));
    let y = L.y0; return col.map(c => { const r = y; y += c.up ? fu : fd; return r; });
  }
  function render() {
    let z = 1;
    const put = (c, x, y, zz) => { const e = els[c.id]; e.classList.toggle('back', !c.up); e.style.left = x + 'px'; e.style.top = y + 'px'; e.style.zIndex = zz; };
    st.stock.forEach((c, i) => put(c, L.gap, L.top - Math.min(i, 6) * .0, z++));
    const wx = colX(1), wn = st.waste.length;
    st.waste.forEach((c, i) => { const fan = drawN === 3 ? Math.max(0, i - (wn - 3)) : 0; put(c, wx + fan * L.cw * .24, L.top, z++); });
    st.found.forEach((f, i) => f.forEach(c => put(c, colX(3 + i), L.top, z++)));
    st.tab.forEach((col, i) => { const ys = colOffsets(col); col.forEach((c, j) => put(c, colX(i), ys[j], 100 + j)); });
    stockSlot.textContent = st.stock.length ? '' : (st.waste.length ? '↻' : '');
  }

  // ----- rules -----
  const top = a => a[a.length - 1];
  function canFound(c, i) { const f = st.found[i]; return f.length ? (top(f).s === c.s && top(f).r === c.r - 1) : c.r === 1; }
  function canTab(c, i) { const t = st.tab[i]; if (!t.length) return c.r === 13; const tc = top(t); return tc.up && red(tc) !== red(c) && tc.r === c.r + 1; }
  function take(src) {
    if (src.from === 'waste') return st.waste.splice(-1);
    if (src.from === 'found') return st.found[src.i].splice(-1);
    return st.tab[src.i].splice(src.idx);
  }
  function peek(src) {
    if (src.from === 'waste') return st.waste.slice(-1);
    if (src.from === 'found') return st.found[src.i].slice(-1);
    return st.tab[src.i].slice(src.idx);
  }
  function doMove(src, dst) {
    push(); const cards = take(src);
    if (dst.to === 'found') { st.found[dst.i].push(...cards); score += src.from === 'found' ? 0 : 10; }
    else { st.tab[dst.i].push(...cards); if (src.from === 'waste') score += 5; if (src.from === 'found') score = Math.max(0, score - 15); }
    if (src.from === 'tab') { const t = st.tab[src.i]; if (t.length && !top(t).up) { top(t).up = true; score += 5; } }
    act(); stats(); render(); afterMove();
  }
  function bestTarget(src) {
    const cards = peek(src); if (!cards.length) return null; const c = cards[0];
    if (cards.length === 1 && src.from !== 'found') for (let i = 0; i < 4; i++) if (canFound(c, i)) return { to: 'found', i };
    const order = [];
    for (let i = 0; i < 7; i++) if (!(src.from === 'tab' && src.i === i) && st.tab[i].length) order.push(i);
    for (let i = 0; i < 7; i++) if (!(src.from === 'tab' && src.i === i) && !st.tab[i].length) order.push(i);
    for (const i of order) {
      if (!canTab(c, i)) continue;
      if (!st.tab[i].length && src.from === 'tab' && src.idx === 0) continue; // pointless king shuffle
      return { to: 'tab', i };
    }
    return null;
  }
  function drawStock() {
    if (won || auto) return;
    push();
    if (!st.stock.length) {
      if (!st.waste.length) { hist.pop(); return; }
      st.stock = st.waste.reverse().map(c => (c.up = false, c)); st.waste = [];
      if (drawN === 1) score = Math.max(0, score - 100);
    } else {
      for (let k = 0; k < drawN && st.stock.length; k++) { const c = st.stock.pop(); c.up = true; st.waste.push(c); }
    }
    act(); stats(); render();
  }
  function afterMove() {
    if (st.found.every(f => f.length === 13)) return win();
    const allUp = !st.stock.length && !st.waste.length && st.tab.every(t => t.every(c => c.up));
    if (allUp && !auto) { auto = true; autoFinish(); }
  }
  function autoFinish() {
    for (let i = 0; i < 7; i++) {
      const t = st.tab[i]; if (!t.length) continue; const c = top(t);
      for (let f = 0; f < 4; f++) if (canFound(c, f)) { st.found[f].push(t.pop()); score += 10; moves++; stats(); render(); if (st.found.every(x => x.length === 13)) return win(); return setTimeout(autoFinish, 70); }
    }
  }
  function win() {
    won = true; timer.stop(); const t = Math.round(timer.sec());
    const k = 'sol_best_' + drawN, b = G.get(k, null), rec = b === null || t < b; if (rec) G.set(k, t);
    G.set('sol_wins', G.get('sol_wins', 0) + 1); setBest();
    G.confetti();
    G.overlay(ov, 'You won! 🎉', `Time: <b>${G.fmt(t)}</b> · Moves: <b>${moves}</b> · Score: <b>${score}</b>${rec ? '<br>New best time!' : ''}`, 'Deal again', deal);
  }
  function setBest() { const b = G.get('sol_best_' + drawN, null); G.$('#best').textContent = b === null ? '—' : G.fmt(b); }

  // ----- input -----
  function locate(id) {
    if (top(st.waste) && top(st.waste).id === id) return { from: 'waste' };
    for (let i = 0; i < 4; i++) if (top(st.found[i]) && top(st.found[i]).id === id) return { from: 'found', i };
    for (let i = 0; i < 7; i++) { const idx = st.tab[i].findIndex(c => c.id === id); if (idx >= 0) return st.tab[i][idx].up ? { from: 'tab', i, idx } : null; }
    if (st.stock.some(c => c.id === id)) return { from: 'stock' };
    return null;
  }
  let drag = null;
  B.addEventListener('pointerdown', e => {
    if (won || auto || e.button > 0) return;
    const ce = e.target.closest('.cardx');
    if (!ce) { if (e.target === stockSlot) drawStock(); return; }
    const src = locate(+ce.dataset.id); if (!src) return;
    if (src.from === 'stock') { drawStock(); return; }
    e.preventDefault();
    const cards = peek(src), r = B.getBoundingClientRect();
    drag = { src, cards, sx: e.clientX, sy: e.clientY, moved: false, r, orig: cards.map(c => ({ x: parseFloat(els[c.id].style.left), y: parseFloat(els[c.id].style.top) })) };
    B.setPointerCapture(e.pointerId);
  });
  B.addEventListener('pointermove', e => {
    if (!drag) return;
    const dx = e.clientX - drag.sx, dy = e.clientY - drag.sy;
    if (!drag.moved && Math.hypot(dx, dy) < 6) return;
    if (!drag.moved) { drag.moved = true; drag.cards.forEach((c, k) => { const el = els[c.id]; el.classList.add('drag'); el.style.zIndex = 1000 + k; }); }
    drag.cards.forEach((c, k) => { const el = els[c.id]; el.style.left = drag.orig[k].x + dx + 'px'; el.style.top = drag.orig[k].y + dy + 'px'; });
    highlight(dropTarget(drag.orig[0].x + dx, drag.orig[0].y + dy));
  });
  function dropTarget(x, y) {
    const c = drag.cards[0], cx = x + L.cw / 2, cy = y + L.ch / 2; let best = null, bd = 1e9;
    const consider = (t, tx, ty) => { const d = Math.hypot(cx - (tx + L.cw / 2), cy - ty); if (d < bd) { bd = d; best = t; } };
    if (drag.cards.length === 1) for (let i = 0; i < 4; i++) if (canFound(c, i) && Math.abs(cx - (colX(3 + i) + L.cw / 2)) < L.cw && cy < L.y0 + L.ch * .3) consider({ to: 'found', i }, colX(3 + i), L.top + L.ch / 2);
    for (let i = 0; i < 7; i++) {
      if (drag.src.from === 'tab' && drag.src.i === i) continue;
      if (!canTab(c, i) || Math.abs(cx - (colX(i) + L.cw / 2)) > L.cw * .9 || cy < L.y0 - L.ch * .5) continue;
      const ys = colOffsets(st.tab[i]); consider({ to: 'tab', i }, colX(i), (ys.length ? ys[ys.length - 1] : L.y0) + L.ch / 2);
    }
    return best;
  }
  function highlight(t) {
    slots.forEach(s => s.style.borderColor = ''); Object.values(els).forEach(e => e.classList.remove('hl'));
    if (!t) return;
    if (t.to === 'found') { const f = st.found[t.i]; f.length ? els[top(f).id].classList.add('hl') : fSlots[t.i].style.borderColor = '#ffcc33'; }
    else { const col = st.tab[t.i]; col.length ? els[top(col).id].classList.add('hl') : tSlots[t.i].style.borderColor = '#ffcc33'; }
  }
  B.addEventListener('pointerup', e => {
    if (!drag) return; const d = drag; drag = null; highlight(null);
    d.cards.forEach(c => els[c.id].classList.remove('drag'));
    if (!d.moved) { const t = bestTarget(d.src); if (t) doMove(d.src, t); else { shake(d.cards); render(); } return; }
    const dx = e.clientX - d.sx, dy = e.clientY - d.sy;
    drag = d; const t = dropTarget(d.orig[0].x + dx, d.orig[0].y + dy); drag = null;
    if (t) doMove(d.src, t); else render();
  });
  B.addEventListener('pointercancel', () => { if (drag) { drag.cards.forEach(c => els[c.id].classList.remove('drag')); drag = null; highlight(null); render(); } });
  function shake(cards) { cards.forEach(c => { const el = els[c.id]; el.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-5px)' }, { transform: 'translateX(5px)' }, { transform: 'translateX(0)' }], { duration: 200 }); }); }

  G.$('#new').onclick = deal;
  G.$('#undo').onclick = undo;
  addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); undo(); } });
  const dm = G.$('#drawmode');
  G.$$('button', dm).forEach(b => b.classList.toggle('on', +b.dataset.v === drawN));
  G.seg(dm, v => { drawN = +v; G.set('sol_draw', drawN); setBest(); deal(); });
  addEventListener('resize', () => { layout(); render(); });
  setBest(); deal();
})();
