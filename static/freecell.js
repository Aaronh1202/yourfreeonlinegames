(() => {
  const B = G.$('#fc'), ov = G.$('#ov');
  const SUITS = ['♠', '♥', '♦', '♣'], RANKS = ['', 'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const red = c => c.s === 1 || c.s === 2, top = a => a[a.length - 1];
  let st, hist = [], moves = 0, won = false, L = {}, els = {}, slots = [], gameNo = 0;
  const timer = G.timer(s => G.$('#time').textContent = G.fmt(s));

  function build() {
    for (let s = 0; s < 4; s++) for (let r = 1; r <= 13; r++) {
      const id = s * 13 + r, e = document.createElement('div');
      e.className = 'cardx' + (s === 1 || s === 2 ? ' red' : ''); e.dataset.id = id;
      e.innerHTML = `<div class="c1">${RANKS[r]}<small>${SUITS[s]}</small></div><div class="c2">${SUITS[s]}</div>`;
      els[id] = e;
    }
    for (let i = 0; i < 16; i++) { const e = document.createElement('div'); e.className = 'slot'; if (i >= 4 && i < 8) e.textContent = SUITS[i - 4]; B.appendChild(e); slots.push(e); }
    Object.values(els).forEach(e => B.appendChild(e));
  }
  function deal() {
    const deck = []; for (let s = 0; s < 4; s++) for (let r = 1; r <= 13; r++) deck.push({ s, r, id: s * 13 + r });
    G.shuffle(deck); gameNo = 1 + G.rnd(999999);
    st = { cells: [null, null, null, null], found: [[], [], [], []], tab: Array.from({ length: 8 }, () => []) };
    deck.forEach((c, i) => st.tab[i % 8].push(c));
    hist = []; moves = 0; won = false; timer.reset(); ov.classList.add('hidden'); G.$('#gno').textContent = '#' + gameNo;
    layout(); render(); stats(); setTimeout(autoPlay, 300);
  }
  function layout() {
    const W = B.clientWidth, gap = Math.max(3, W * .012), cw = (W - gap * 9) / 8, ch = cw * 1.4;
    L = { W, gap, cw, ch, top: gap, y0: gap * 2.5 + ch, fu: ch * .27 };
    L.H = L.y0 + ch + Math.max(ch * 2.4, L.fu * 12);
    B.style.height = L.H + 'px'; B.style.setProperty('--fs', (cw * .2) + 'px');
    const pl = (e, x, y) => Object.assign(e.style, { left: x + 'px', top: y + 'px', width: cw + 'px', height: ch + 'px' });
    slots.forEach((e, i) => i < 8 ? pl(e, colX(i), L.top) : pl(e, colX(i - 8), L.y0));
    Object.values(els).forEach(e => { e.style.width = cw + 'px'; e.style.height = ch + 'px'; });
  }
  const colX = i => L.gap + i * (L.cw + L.gap);
  function offs(col) { let fu = L.fu; const avail = L.H - L.y0 - L.ch - L.gap; if ((col.length - 1) * fu > avail) fu = avail / (col.length - 1); return col.map((_, j) => L.y0 + j * fu); }
  function render() {
    const put = (c, x, y, z) => { const e = els[c.id]; e.style.left = x + 'px'; e.style.top = y + 'px'; e.style.zIndex = z; };
    st.cells.forEach((c, i) => c && put(c, colX(i), L.top, 5));
    st.found.forEach((f, i) => f.forEach((c, j) => put(c, colX(4 + i), L.top, 5 + j)));
    st.tab.forEach((col, i) => { const ys = offs(col); col.forEach((c, j) => put(c, colX(i), ys[j], 100 + j)); });
  }
  function stats() { G.$('#moves').textContent = moves; G.$('#undo').disabled = !hist.length; }
  const push = () => { hist.push({ st: JSON.stringify(st), moves }); };
  function undo() { const h = hist.pop(); if (!h || won) return; st = JSON.parse(h.st); moves = h.moves; render(); stats(); }
  // ---- rules ----
  const canFound = (c, i) => { const f = st.found[i]; return f.length ? top(f).s === c.s && top(f).r === c.r - 1 : c.r === 1; };
  const canTab = (c, i) => { const t = st.tab[i]; return !t.length || (red(top(t)) !== red(c) && top(t).r === c.r + 1); };
  function maxMove(toEmpty) {
    const free = st.cells.filter(c => !c).length, empty = st.tab.filter(t => !t.length).length - (toEmpty ? 1 : 0);
    return (free + 1) * Math.pow(2, Math.max(0, empty));
  }
  function seqOk(col, idx) { for (let j = idx; j < col.length - 1; j++) if (red(col[j]) === red(col[j + 1]) || col[j].r !== col[j + 1].r + 1) return false; return true; }
  function cardsAt(src) { return src.from === 'cell' ? [st.cells[src.i]] : st.tab[src.i].slice(src.j); }
  function takeFrom(src) { if (src.from === 'cell') { const c = st.cells[src.i]; st.cells[src.i] = null; return [c]; } return st.tab[src.i].splice(src.j); }
  function legal(src, dst) {
    const cards = cardsAt(src), c = cards[0];
    if (dst.to === 'found') return cards.length === 1 && canFound(c, dst.i);
    if (dst.to === 'cell') return cards.length === 1 && !st.cells[dst.i];
    if (src.from === 'tab' && src.i === dst.i) return false;
    return canTab(c, dst.i) && cards.length <= maxMove(!st.tab[dst.i].length);
  }
  function doMove(src, dst, auto) {
    push(); const cards = takeFrom(src);
    if (dst.to === 'found') st.found[dst.i].push(cards[0]); else if (dst.to === 'cell') st.cells[dst.i] = cards[0]; else st.tab[dst.i].push(...cards);
    moves++; if (!timer.running()) timer.start();
    render(); stats(); if (!auto) setTimeout(autoPlay, 160); checkWin();
  }
  // auto-move cards that are safe to send home
  function safe(c) {
    if (c.r <= 2) return true;
    const opp = red(c) ? [0, 3] : [1, 2];
    return opp.every(s => st.found.some(f => f.length && top(f).s === s && top(f).r >= c.r - 1));
  }
  function autoPlay() {
    if (won) return;
    const srcs = [...st.cells.map((c, i) => c && { from: 'cell', i }), ...st.tab.map((t, i) => t.length && { from: 'tab', i, j: t.length - 1 })].filter(Boolean);
    for (const s of srcs) { const c = cardsAt(s)[0]; if (!safe(c)) continue; for (let f = 0; f < 4; f++) if (canFound(c, f)) { doMove(s, { to: 'found', i: f }, true); hist.pop(); setTimeout(autoPlay, 110); return; } }
  }
  function checkWin() {
    if (won || !st.found.every(f => f.length === 13)) return;
    won = true; timer.stop(); const t = Math.round(timer.sec()), b = G.get('fc_best', null), rec = b === null || t < b; if (rec) G.set('fc_best', t); setBest(); G.confetti();
    G.overlay(ov, 'You won! 🎉', `Time: <b>${G.fmt(t)}</b> · Moves: <b>${moves}</b>${rec ? '<br>New best time!' : ''}`, 'Deal again', deal);
  }
  function setBest() { const b = G.get('fc_best', null); G.$('#best').textContent = b === null ? '—' : G.fmt(b); }
  function bestTarget(src) {
    const c = cardsAt(src)[0], n = cardsAt(src).length;
    if (n === 1) for (let i = 0; i < 4; i++) if (canFound(c, i)) return { to: 'found', i };
    for (let i = 0; i < 8; i++) if (st.tab[i].length && legal(src, { to: 'tab', i })) return { to: 'tab', i };
    if (!(src.from === 'tab' && src.j === 0)) for (let i = 0; i < 8; i++) if (!st.tab[i].length && legal(src, { to: 'tab', i })) return { to: 'tab', i };
    if (n === 1 && src.from === 'tab') for (let i = 0; i < 4; i++) if (!st.cells[i]) return { to: 'cell', i };
    return null;
  }
  // ---- input ----
  function locate(id) {
    const ci = st.cells.findIndex(c => c && c.id === id); if (ci >= 0) return { from: 'cell', i: ci };
    for (let i = 0; i < 8; i++) { const j = st.tab[i].findIndex(c => c.id === id); if (j >= 0) return { from: 'tab', i, j }; }
    return null;
  }
  let drag = null;
  B.addEventListener('pointerdown', e => {
    if (won || e.button > 0) return; const ce = e.target.closest('.cardx'); if (!ce) return;
    const src = locate(+ce.dataset.id); if (!src) return;
    if (src.from === 'tab' && !seqOk(st.tab[src.i], src.j)) return shake(ce);
    e.preventDefault(); const cards = cardsAt(src);
    drag = { src, cards, sx: e.clientX, sy: e.clientY, moved: false, orig: cards.map(c => ({ x: parseFloat(els[c.id].style.left), y: parseFloat(els[c.id].style.top) })) };
    B.setPointerCapture(e.pointerId);
  });
  B.addEventListener('pointermove', e => {
    if (!drag) return; const dx = e.clientX - drag.sx, dy = e.clientY - drag.sy;
    if (!drag.moved && Math.hypot(dx, dy) < 6) return;
    if (!drag.moved) { drag.moved = true; drag.cards.forEach((c, k) => { els[c.id].classList.add('drag'); els[c.id].style.zIndex = 1000 + k; }); }
    drag.cards.forEach((c, k) => { els[c.id].style.left = drag.orig[k].x + dx + 'px'; els[c.id].style.top = drag.orig[k].y + dy + 'px'; });
  });
  B.addEventListener('pointerup', e => {
    if (!drag) return; const d = drag; drag = null; d.cards.forEach(c => els[c.id].classList.remove('drag'));
    if (!d.moved) { const t = bestTarget(d.src); if (t) doMove(d.src, t); else { shake(els[d.cards[0].id]); render(); } return; }
    const cx = d.orig[0].x + e.clientX - d.sx + L.cw / 2, cy = d.orig[0].y + e.clientY - d.sy + L.ch / 2;
    let best = null, bd = 1e9;
    const tryT = (t, x) => { const dist = Math.abs(cx - x - L.cw / 2); if (dist < L.cw && dist < bd && legal(d.src, t)) { bd = dist; best = t; } };
    if (cy < L.y0) { for (let i = 0; i < 4; i++) tryT({ to: 'cell', i }, colX(i)); for (let i = 0; i < 4; i++) tryT({ to: 'found', i }, colX(4 + i)); }
    else for (let i = 0; i < 8; i++) tryT({ to: 'tab', i }, colX(i));
    if (best) doMove(d.src, best); else { if (d.cards.length > maxMove(false)) toast(`You can move up to ${maxMove(false)} cards right now. Free up cells or columns to move more.`); render(); }
  });
  B.addEventListener('pointercancel', () => { if (drag) { drag.cards.forEach(c => els[c.id].classList.remove('drag')); drag = null; render(); } });
  function shake(el) { el.animate([{ transform: 'translateX(-4px)' }, { transform: 'translateX(4px)' }, { transform: 'none' }], { duration: 180 }); }
  function toast(m) { const t = G.$('#toast'); t.textContent = m; t.classList.remove('hidden'); clearTimeout(t._h); t._h = setTimeout(() => t.classList.add('hidden'), 2400); }

  G.$('#new').onclick = deal; G.$('#undo').onclick = undo;
  G.$('#restart').onclick = () => { if (!hist.length) return; st = JSON.parse(hist[0].st); hist = []; moves = 0; won = false; ov.classList.add('hidden'); timer.reset(); render(); stats(); };
  addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); undo(); } });
  addEventListener('resize', () => { layout(); render(); });
  build(); setBest(); deal();
})();
