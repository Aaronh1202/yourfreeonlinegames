(() => {
  const B = G.$('#sp'), ov = G.$('#ov');
  const SUITS = ['♠', '♥', '♦', '♣'], RANKS = ['', 'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  let suits = G.cfg.suits || G.get('sp_suits', 1), st, hist = [], moves = 0, score = 500, won = false, L = {}, els = {}, slots = [];
  const timer = G.timer(s => G.$('#time').textContent = G.fmt(s));
  const top = a => a[a.length - 1];

  function deal() {
    B.innerHTML = ''; els = {}; slots = [];
    const suitSet = suits === 1 ? [0] : suits === 2 ? [0, 1] : [0, 1, 2, 3];
    const deck = []; let id = 0;
    for (let k = 0; k < 104 / (13 * suitSet.length); k++) suitSet.forEach(s => { for (let r = 1; r <= 13; r++) deck.push({ s, r, id: id++, up: false }); });
    G.shuffle(deck);
    st = { tab: Array.from({ length: 10 }, () => []), stock: [], done: [] };
    for (let i = 0; i < 54; i++) st.tab[i % 10].push(deck.pop());
    st.tab.forEach(c => top(c).up = true);
    st.stock = deck;
    for (let i = 0; i < 10; i++) { const e = document.createElement('div'); e.className = 'slot'; B.appendChild(e); slots.push(e); }
    deck.concat(...st.tab).forEach(c => mk(c));
    hist = []; moves = 0; score = 500; won = false; timer.reset(); ov.classList.add('hidden');
    layout(); render(); stats();
  }
  function mk(c) {
    const e = document.createElement('div'); e.className = 'cardx' + (c.s === 1 || c.s === 2 ? ' red' : ''); e.dataset.id = c.id;
    e.innerHTML = `<div class="c1">${RANKS[c.r]}<small>${SUITS[c.s]}</small></div><div class="c2">${SUITS[c.s]}</div>`;
    B.appendChild(e); els[c.id] = e;
  }
  function layout() {
    const W = B.clientWidth, gap = Math.max(3, W * .01), cw = (W - gap * 11) / 10, ch = cw * 1.4;
    L = { W, gap, cw, ch, top: gap, y0: gap * 2 + ch * .0, fd: ch * .1, fu: ch * .26 };
    L.y0 = gap; L.H = Math.max(ch * 6.2, Math.min(innerHeight * .85, ch * 8));
    B.style.height = L.H + 'px'; B.style.setProperty('--fs', (cw * .21) + 'px');
    slots.forEach((e, i) => Object.assign(e.style, { left: colX(i) + 'px', top: L.y0 + 'px', width: cw + 'px', height: ch + 'px' }));
    Object.values(els).forEach(e => { e.style.width = cw + 'px'; e.style.height = ch + 'px'; });
  }
  const colX = i => L.gap + i * (L.cw + L.gap);
  function offsets(col) {
    let fd = L.fd, fu = L.fu; const downs = col.filter(c => !c.up).length, ups = col.length - downs;
    const avail = L.H - L.y0 - 2 * L.ch - 3 * L.gap;
    if (downs * fd + (ups - 1) * fu > avail) { fd = Math.min(fd, L.ch * .06); fu = Math.max(L.ch * .12, (avail - downs * fd) / Math.max(1, ups - 1)); }
    let y = L.y0; return col.map(c => { const r = y; y += c.up ? fu : fd; return r; });
  }
  function render() {
    const put = (c, x, y, z) => { const e = els[c.id]; e.classList.toggle('back', !c.up); e.style.left = x + 'px'; e.style.top = y + 'px'; e.style.zIndex = z; e.style.display = ''; };
    // stock bottom-right, completed runs bottom-left
    const sy = L.H - L.ch - L.gap;
    st.stock.forEach((c, i) => put(c, L.W - L.gap - L.cw - Math.floor(i / 10) * L.cw * .18, sy, 10 + Math.floor(i / 10)));
    st.done.forEach((run, k) => run.forEach((c, j) => put(c, L.gap + k * L.cw * .3, sy, 20 + k * 13 + j)));
    st.tab.forEach((col, i) => { const ys = offsets(col); col.forEach((c, j) => put(c, colX(i), ys[j], 100 + j)); });
  }
  function stats() { G.$('#moves').textContent = moves; G.$('#score').textContent = score; G.$('#deals').textContent = st.stock.length / 10; G.$('#undo').disabled = !hist.length; }
  const push = () => { hist.push({ st: JSON.stringify(st), moves, score }); if (hist.length > 300) hist.shift(); };
  function undo() { const h = hist.pop(); if (!h || won) return; st = JSON.parse(h.st); moves = h.moves; score = h.score; render(); stats(); }
  // movable: run of same suit descending from idx to end
  function runOk(col, idx) {
    if (!col[idx] || !col[idx].up) return false;
    for (let j = idx; j < col.length - 1; j++) if (col[j].s !== col[j + 1].s || col[j].r !== col[j + 1].r + 1) return false;
    return true;
  }
  const canPut = (c, i) => { const t = st.tab[i]; return !t.length || top(t).r === c.r + 1; };
  function move(from, idx, to) {
    push(); const cards = st.tab[from].splice(idx); st.tab[to].push(...cards);
    const f = st.tab[from]; if (f.length && !top(f).up) top(f).up = true;
    moves++; score = Math.max(0, score - 1); if (!timer.running()) timer.start();
    checkRun(to); render(); stats(); checkWin();
  }
  function checkRun(i) {
    const col = st.tab[i]; if (col.length < 13) return;
    const k = col.length - 13; if (col[k].r !== 13 || !runOk(col, k)) return;
    st.done.push(col.splice(k)); score += 100;
    if (col.length && !top(col).up) top(col).up = true;
  }
  function checkWin() {
    if (st.done.length === 8) {
      won = true; timer.stop(); const t = Math.round(timer.sec()), k = 'sp_best_' + suits, b = G.get(k, null), rec = b === null || t < b; if (rec) G.set(k, t); setBest(); G.confetti();
      G.overlay(ov, 'You won! 🎉', `Time: <b>${G.fmt(t)}</b> · Moves: <b>${moves}</b> · Score: <b>${score}</b>${rec ? '<br>New best time!' : ''}`, 'Deal again', deal);
    }
  }
  function setBest() { const b = G.get('sp_best_' + suits, null); G.$('#best').textContent = b === null ? '—' : G.fmt(b); }
  function dealRow() {
    if (!st.stock.length || won) return;
    if (st.tab.some(c => !c.length)) { toast('Fill every empty column before dealing.'); return; }
    push();
    for (let i = 0; i < 10; i++) { const c = st.stock.pop(); c.up = true; st.tab[i].push(c); }
    moves++; if (!timer.running()) timer.start();
    for (let i = 0; i < 10; i++) checkRun(i);
    render(); stats(); checkWin();
  }
  function toast(msg) { const t = G.$('#toast'); t.textContent = msg; t.classList.remove('hidden'); clearTimeout(t._h); t._h = setTimeout(() => t.classList.add('hidden'), 2000); }
  function bestTarget(from, idx) {
    const c = st.tab[from][idx]; let empty = -1, any = -1;
    for (let i = 0; i < 10; i++) {
      if (i === from) continue; const t = st.tab[i];
      if (!t.length) { if (empty < 0 && idx > 0) empty = i; continue; }
      if (top(t).r === c.r + 1) { if (top(t).s === c.s) return i; if (any < 0) any = i; }
    }
    return any >= 0 ? any : empty;
  }
  function hint() {
    for (let i = 0; i < 10; i++) { const col = st.tab[i]; for (let j = 0; j < col.length; j++) if (runOk(col, j)) {
      const t = bestTarget(i, j); if (t >= 0 && st.tab[t].length && !(j > 0 && col[j - 1].up && col[j - 1].r === col[j].r + 1 && col[j - 1].s === col[j].s)) {
        [...col.slice(j), top(st.tab[t])].forEach(c => { const e = els[c.id]; e.classList.add('hl'); setTimeout(() => e.classList.remove('hl'), 1100); }); return; } break; } }
    toast(st.stock.length ? 'No moves found. Deal a new row from the stock.' : 'No moves left. Try Undo.');
  }
  // ---- input ----
  function locate(id) { for (let i = 0; i < 10; i++) { const j = st.tab[i].findIndex(c => c.id === id); if (j >= 0) return { i, j }; } return st.stock.some(c => c.id === id) ? 'stock' : null; }
  let drag = null;
  B.addEventListener('pointerdown', e => {
    if (won || e.button > 0) return; const ce = e.target.closest('.cardx'); if (!ce) return;
    const loc = locate(+ce.dataset.id); if (!loc) return; if (loc === 'stock') return dealRow();
    if (!runOk(st.tab[loc.i], loc.j)) { if (st.tab[loc.i][loc.j].up) shake(ce); return; }
    e.preventDefault();
    const cards = st.tab[loc.i].slice(loc.j);
    drag = { ...loc, cards, sx: e.clientX, sy: e.clientY, moved: false, orig: cards.map(c => ({ x: parseFloat(els[c.id].style.left), y: parseFloat(els[c.id].style.top) })) };
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
    if (!d.moved) { const t = bestTarget(d.i, d.j); if (t >= 0) move(d.i, d.j, t); else { shake(els[d.cards[0].id]); render(); } return; }
    const cx = d.orig[0].x + e.clientX - d.sx + L.cw / 2; let best = -1, bd = 1e9;
    for (let i = 0; i < 10; i++) { if (i === d.i || !canPut(d.cards[0], i)) continue; const dist = Math.abs(cx - colX(i) - L.cw / 2); if (dist < L.cw && dist < bd) { bd = dist; best = i; } }
    if (best >= 0) move(d.i, d.j, best); else render();
  });
  B.addEventListener('pointercancel', () => { if (drag) { drag.cards.forEach(c => els[c.id].classList.remove('drag')); drag = null; render(); } });
  function shake(el) { el.animate([{ transform: 'translateX(-4px)' }, { transform: 'translateX(4px)' }, { transform: 'none' }], { duration: 180 }); }

  G.$('#new').onclick = deal; G.$('#undo').onclick = undo; G.$('#hint').onclick = hint; G.$('#dealbtn').onclick = dealRow;
  addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); undo(); } if (e.key === 'h' || e.key === 'H') hint(); if (e.key === 'd' || e.key === 'D') dealRow(); });
  const sm = G.$('#suits'); G.$$('button', sm).forEach(b => b.classList.toggle('on', +b.dataset.v === suits));
  G.seg(sm, v => { suits = +v; G.set('sp_suits', suits); setBest(); deal(); });
  addEventListener('resize', () => { layout(); render(); });
  setBest(); deal();
})();
