(() => {
  const el = G.$('#chess'), ov = G.$('#ov');
  const GLYPH = { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' };
  const VAL = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 0 };
  // piece-square tables (white's view, row 0 = rank 8)
  const PST = {
    p: [0,0,0,0,0,0,0,0, 50,50,50,50,50,50,50,50, 10,10,20,30,30,20,10,10, 5,5,10,25,25,10,5,5, 0,0,0,20,20,0,0,0, 5,-5,-10,0,0,-10,-5,5, 5,10,10,-20,-20,10,10,5, 0,0,0,0,0,0,0,0],
    n: [-50,-40,-30,-30,-30,-30,-40,-50, -40,-20,0,0,0,0,-20,-40, -30,0,10,15,15,10,0,-30, -30,5,15,20,20,15,5,-30, -30,0,15,20,20,15,0,-30, -30,5,10,15,15,10,5,-30, -40,-20,0,5,5,0,-20,-40, -50,-40,-30,-30,-30,-30,-40,-50],
    b: [-20,-10,-10,-10,-10,-10,-10,-20, -10,0,0,0,0,0,0,-10, -10,0,5,10,10,5,0,-10, -10,5,5,10,10,5,5,-10, -10,0,10,10,10,10,0,-10, -10,10,10,10,10,10,10,-10, -10,5,0,0,0,0,5,-10, -20,-10,-10,-10,-10,-10,-10,-20],
    r: [0,0,0,0,0,0,0,0, 5,10,10,10,10,10,10,5, -5,0,0,0,0,0,0,-5, -5,0,0,0,0,0,0,-5, -5,0,0,0,0,0,0,-5, -5,0,0,0,0,0,0,-5, -5,0,0,0,0,0,0,-5, 0,0,0,5,5,0,0,0],
    q: [-20,-10,-10,-5,-5,-10,-10,-20, -10,0,0,0,0,0,0,-10, -10,0,5,5,5,5,0,-10, -5,0,5,5,5,5,0,-5, 0,0,5,5,5,5,0,-5, -10,5,5,5,5,5,0,-10, -10,0,5,0,0,0,0,-10, -20,-10,-10,-5,-5,-10,-10,-20],
    k: [-30,-40,-40,-50,-50,-40,-40,-30, -30,-40,-40,-50,-50,-40,-40,-30, -30,-40,-40,-50,-50,-40,-40,-30, -30,-40,-40,-50,-50,-40,-40,-30, -20,-30,-30,-40,-40,-30,-30,-20, -10,-20,-20,-20,-20,-20,-20,-10, 20,20,0,0,0,0,20,20, 20,30,10,0,0,10,30,20]
  };
  const isW = p => p && p === p.toUpperCase(), col = p => p ? (isW(p) ? 'w' : 'b') : null;
  const N8 = [-17, -15, -10, -6, 6, 10, 15, 17], KD = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
  const on = (r, c) => r >= 0 && r < 8 && c >= 0 && c < 8;
  let S, hist, mode = G.cfg.mode || G.get('ch_mode', 'cpu'), level = G.get('ch_level', 'medium'), sel = -1, targets = [], over = false, thinking = false, lastMv = null, keys = {};

  function init() {
    const row = 'rnbqkbnr';
    const b = Array(64).fill(null);
    for (let c = 0; c < 8; c++) { b[c] = row[c]; b[8 + c] = 'p'; b[48 + c] = 'P'; b[56 + c] = row[c].toUpperCase(); }
    S = { b, turn: 'w', castle: { K: 1, Q: 1, k: 1, q: 1 }, ep: -1, half: 0 };
    hist = []; sel = -1; targets = []; over = false; thinking = false; lastMv = null; keys = {}; bump(S);
    ov.classList.add('hidden'); render(); status();
  }
  const key = s => s.b.map(p => p || '.').join('') + s.turn + JSON.stringify(s.castle) + s.ep;
  const bump = s => { const k = key(s); keys[k] = (keys[k] || 0) + 1; };

  function attacked(b, sq, by) {
    const r = sq >> 3, c = sq & 7;
    // pawns
    const pr = by === 'w' ? r + 1 : r - 1, P = by === 'w' ? 'P' : 'p';
    for (const dc of [-1, 1]) if (on(pr, c + dc) && b[pr * 8 + c + dc] === P) return true;
    const Nn = by === 'w' ? 'N' : 'n';
    for (const [dr, dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]) if (on(r + dr, c + dc) && b[(r + dr) * 8 + c + dc] === Nn) return true;
    const K = by === 'w' ? 'K' : 'k';
    for (const [dr, dc] of KD) if (on(r + dr, c + dc) && b[(r + dr) * 8 + c + dc] === K) return true;
    const ray = (dirs, set) => { for (const [dr, dc] of dirs) { let rr = r + dr, cc = c + dc; while (on(rr, cc)) { const p = b[rr * 8 + cc]; if (p) { if (col(p) === by && set.includes(p.toLowerCase())) return true; break; } rr += dr; cc += dc; } } return false; };
    return ray([[-1,0],[1,0],[0,-1],[0,1]], 'rq') || ray([[-1,-1],[-1,1],[1,-1],[1,1]], 'bq');
  }
  function pseudo(s) {
    const b = s.b, me = s.turn, ms = [];
    for (let sq = 0; sq < 64; sq++) {
      const p = b[sq]; if (!p || col(p) !== me) continue;
      const t = p.toLowerCase(), r = sq >> 3, c = sq & 7;
      const add = (to, extra) => ms.push({ from: sq, to, p, cap: b[to], ...extra });
      if (t === 'p') {
        const d = me === 'w' ? -1 : 1, start = me === 'w' ? 6 : 1, last = me === 'w' ? 0 : 7;
        const one = (r + d) * 8 + c;
        if (on(r + d, c) && !b[one]) {
          if (r + d === last) ['q', 'r', 'b', 'n'].forEach(pr => add(one, { promo: pr })); else add(one);
          const two = (r + 2 * d) * 8 + c; if (r === start && !b[two]) add(two, { dbl: true });
        }
        for (const dc of [-1, 1]) {
          if (!on(r + d, c + dc)) continue; const to = (r + d) * 8 + c + dc;
          if (b[to] && col(b[to]) !== me) { if (r + d === last) ['q', 'r', 'b', 'n'].forEach(pr => add(to, { promo: pr })); else add(to); }
          else if (to === s.ep) add(to, { epCap: r * 8 + c + dc, cap: b[r * 8 + c + dc] });
        }
      } else if (t === 'n') {
        for (const [dr, dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]) { const rr = r + dr, cc = c + dc; if (on(rr, cc) && col(b[rr * 8 + cc]) !== me) add(rr * 8 + cc); }
      } else if (t === 'k') {
        for (const [dr, dc] of KD) { const rr = r + dr, cc = c + dc; if (on(rr, cc) && col(b[rr * 8 + cc]) !== me) add(rr * 8 + cc); }
        const opp = me === 'w' ? 'b' : 'w', home = me === 'w' ? 60 : 4;
        if (sq === home && !attacked(b, home, opp)) {
          const [ks, qs] = me === 'w' ? ['K', 'Q'] : ['k', 'q'];
          if (s.castle[ks] && !b[home + 1] && !b[home + 2] && !attacked(b, home + 1, opp) && !attacked(b, home + 2, opp)) add(home + 2, { castle: 'k' });
          if (s.castle[qs] && !b[home - 1] && !b[home - 2] && !b[home - 3] && !attacked(b, home - 1, opp) && !attacked(b, home - 2, opp)) add(home - 2, { castle: 'q' });
        }
      } else {
        const dirs = t === 'r' ? [[-1,0],[1,0],[0,-1],[0,1]] : t === 'b' ? [[-1,-1],[-1,1],[1,-1],[1,1]] : KD;
        for (const [dr, dc] of dirs) { let rr = r + dr, cc = c + dc; while (on(rr, cc)) { const q = b[rr * 8 + cc]; if (q && col(q) === me) break; add(rr * 8 + cc); if (q) break; rr += dr; cc += dc; } }
      }
    }
    return ms;
  }
  function make(s, m) {
    const b = s.b.slice(), me = s.turn;
    b[m.to] = m.promo ? (me === 'w' ? m.promo.toUpperCase() : m.promo) : m.p; b[m.from] = null;
    if (m.epCap !== undefined) b[m.epCap] = null;
    if (m.castle) { const home = me === 'w' ? 60 : 4; if (m.castle === 'k') { b[home + 1] = b[home + 3]; b[home + 3] = null; } else { b[home - 1] = b[home - 4]; b[home - 4] = null; } }
    const c = { ...s.castle };
    if (m.p === 'K') c.K = c.Q = 0; if (m.p === 'k') c.k = c.q = 0;
    [[63, 'K'], [56, 'Q'], [7, 'k'], [0, 'q']].forEach(([sq, f]) => { if (m.from === sq || m.to === sq) c[f] = 0; });
    return { b, turn: me === 'w' ? 'b' : 'w', castle: c, ep: m.dbl ? (m.from + m.to) / 2 : -1, half: (m.p.toLowerCase() === 'p' || m.cap) ? 0 : s.half + 1 };
  }
  function kingSq(b, c) { const K = c === 'w' ? 'K' : 'k'; return b.indexOf(K); }
  function legal(s) { return pseudo(s).filter(m => { const n = make(s, m); return !attacked(n.b, kingSq(n.b, s.turn), n.turn); }); }
  const inCheck = s => attacked(s.b, kingSq(s.b, s.turn), s.turn === 'w' ? 'b' : 'w');

  // ---- AI ----
  function evaluate(s) {
    let v = 0;
    for (let i = 0; i < 64; i++) { const p = s.b[i]; if (!p) continue; const t = p.toLowerCase(); if (isW(p)) v += VAL[t] + PST[t][i]; else v -= VAL[t] + PST[t][(7 - (i >> 3)) * 8 + (i & 7)]; }
    return s.turn === 'w' ? v : -v;
  }
  let nodes = 0;
  const order = ms => ms.sort((a, b) => ((b.cap ? VAL[b.cap.toLowerCase()] * 10 - VAL[b.p.toLowerCase()] : 0) + (b.promo ? 800 : 0)) - ((a.cap ? VAL[a.cap.toLowerCase()] * 10 - VAL[a.p.toLowerCase()] : 0) + (a.promo ? 800 : 0)));
  function quiesce(s, a, bt, d) {
    nodes++; const stand = evaluate(s); if (stand >= bt) return bt; if (a < stand) a = stand; if (d <= 0) return a;
    for (const m of order(pseudo(s).filter(m => m.cap))) {
      const n = make(s, m); if (attacked(n.b, kingSq(n.b, s.turn), n.turn)) continue;
      const v = -quiesce(n, -bt, -a, d - 1); if (v >= bt) return bt; if (v > a) a = v;
    }
    return a;
  }
  function negamax(s, depth, a, bt, ply) {
    nodes++;
    if (depth === 0) return quiesce(s, a, bt, 4);
    const ms = order(legal(s));
    if (!ms.length) return inCheck(s) ? -100000 + ply : 0;
    for (const m of ms) { const v = -negamax(make(s, m), depth - 1, -bt, -a, ply + 1); if (v >= bt) return bt; if (v > a) a = v; }
    return a;
  }
  function think() {
    const ms = order(legal(S)); nodes = 0;
    const depth = { easy: 1, medium: 2, hard: 3 }[level];
    let best = null, bv = -Infinity;
    for (const m of ms) {
      let v = -negamax(make(S, m), depth - 1, -Infinity, -bv === Infinity ? Infinity : -bv, 1);
      if (level === 'easy') v += Math.random() * 180 - 90;
      if (v > bv || !best) { bv = v; best = m; }
    }
    return best;
  }
  // ---- game flow ----
  function play(m) {
    hist.push({ S, lastMv, keys: { ...keys } });
    S = make(S, m); lastMv = m; bump(S); sel = -1; targets = [];
    render(); if (end()) return; status();
    if (mode === 'cpu' && S.turn === 'b') {
      thinking = true; status();
      setTimeout(() => { const am = think(); thinking = false; if (am) play(am); }, 60);
    }
  }
  function insufficient(b) {
    const ps = b.filter(Boolean).map(p => p.toLowerCase()).filter(p => p !== 'k');
    return ps.length === 0 || (ps.length === 1 && (ps[0] === 'n' || ps[0] === 'b'));
  }
  function end() {
    const ms = legal(S); let msg = null, sub = '';
    if (!ms.length) {
      if (inCheck(S)) { const winner = S.turn === 'w' ? 'Black' : 'White'; msg = 'Checkmate!'; sub = mode === 'cpu' ? (winner === 'White' ? 'You win! 🎉' : 'The computer wins.') : `${winner} wins! 🎉`;
        if (mode === 'cpu') { const k = winner === 'White' ? 'ch_wins' : 'ch_losses'; G.set(k, G.get(k, 0) + 1); tally(); if (winner === 'White') G.confetti(); } }
      else { msg = 'Stalemate'; sub = "It's a draw."; }
    } else if (S.half >= 100) { msg = 'Draw'; sub = '50 moves without a capture or pawn move.'; }
    else if (keys[key(S)] >= 3) { msg = 'Draw'; sub = 'The same position happened 3 times.'; }
    else if (insufficient(S.b)) { msg = 'Draw'; sub = 'Not enough pieces left to checkmate.'; }
    if (msg) { over = true; status(); G.overlay(ov, msg, sub, 'Play again', init); return true; }
    return false;
  }
  function tally() { G.$('#wins').textContent = G.get('ch_wins', 0); G.$('#losses').textContent = G.get('ch_losses', 0); }
  function status() {
    const t = G.$('#turn');
    if (over) { t.textContent = 'Game over'; return; }
    if (thinking) { t.textContent = 'Computer is thinking…'; return; }
    const who = S.turn === 'w' ? (mode === 'cpu' ? 'Your move (White)' : 'White to move') : (mode === 'cpu' ? 'Computer’s move' : 'Black to move');
    t.textContent = who + (inCheck(S) ? ' · Check!' : '');
    // captured
    const start = { p: 8, n: 2, b: 2, r: 2, q: 1 }, cnt = {}; S.b.forEach(p => { if (p) cnt[p] = (cnt[p] || 0) + 1; });
    const lost = side => Object.keys(start).map(t => (side === 'w' ? t.toUpperCase() : t)).map(p => GLYPH[p.toLowerCase()].repeat(Math.max(0, start[p.toLowerCase()] - (cnt[p] || 0)))).join('');
    G.$('#capw').textContent = lost('b'); G.$('#capb').textContent = lost('w');
  }
  function render() {
    const ck = inCheck(S) ? kingSq(S.b, S.turn) : -1;
    el.innerHTML = '';
    for (let i = 0; i < 64; i++) {
      const r = i >> 3, c = i & 7, d = document.createElement('div');
      d.className = 'cq ' + ((r + c) % 2 ? 'dk' : 'lt') + (lastMv && (lastMv.from === i || lastMv.to === i) ? ' last' : '') + (i === sel ? ' sel' : '') + (i === ck ? ' check' : '');
      d.dataset.i = i;
      const t = targets.find(m => m.to === i); if (t) d.classList.add(S.b[i] || t.epCap !== undefined ? 'cap' : 'mv');
      const p = S.b[i]; if (p) { const s = document.createElement('span'); s.className = 'cp ' + (isW(p) ? 'w' : 'b'); s.textContent = GLYPH[p.toLowerCase()] + '︎'; d.appendChild(s); }
      if (c === 0) d.insertAdjacentHTML('beforeend', `<i class="rk">${8 - r}</i>`);
      if (r === 7) d.insertAdjacentHTML('beforeend', `<i class="fl">${'abcdefgh'[c]}</i>`);
      el.appendChild(d);
    }
  }
  function promoPick(ms) {
    const box = G.$('#promo'); box.innerHTML = ''; box.classList.remove('hidden');
    ['q', 'r', 'b', 'n'].forEach(pr => { const b = document.createElement('button'); b.className = 'btn'; b.textContent = GLYPH[pr] + '︎'; b.onclick = () => { box.classList.add('hidden'); play(ms.find(m => m.promo === pr)); }; box.appendChild(b); });
  }
  el.addEventListener('click', e => {
    const d = e.target.closest('.cq'); if (!d || over || thinking) return;
    if (mode === 'cpu' && S.turn !== 'w') return;
    const i = +d.dataset.i;
    const hits = targets.filter(m => m.to === i);
    if (hits.length) { if (hits.length > 1) return promoPick(hits); return play(hits[0]); }
    if (S.b[i] && col(S.b[i]) === S.turn) { sel = i; targets = legal(S).filter(m => m.from === i); }
    else { sel = -1; targets = []; }
    render();
  });
  function undo() {
    if (thinking || !hist.length) return;
    let h = hist.pop(); if (mode === 'cpu' && h.S.turn === 'b' && hist.length) h = hist.pop();
    S = h.S; lastMv = h.lastMv; keys = h.keys; over = false; sel = -1; targets = []; ov.classList.add('hidden'); G.$('#promo').classList.add('hidden'); render(); status();
  }
  G.$('#new').onclick = init; G.$('#undo').onclick = undo;
  addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); undo(); } if (e.key === 'Escape') { sel = -1; targets = []; render(); } });
  const md = G.$('#mode'), lv = G.$('#level');
  G.$$('button', md).forEach(x => x.classList.toggle('on', x.dataset.v === mode));
  G.$$('button', lv).forEach(x => x.classList.toggle('on', x.dataset.v === level));
  const showLv = () => lv.classList.toggle('hidden', mode !== 'cpu');
  G.seg(md, v => { mode = v; G.set('ch_mode', v); showLv(); init(); });
  G.seg(lv, v => { level = v; G.set('ch_level', v); init(); });
  // expose for tests
  window.__chess = { perft: (d, s = S) => { if (!d) return 1; let n = 0; for (const m of legal(s)) n += window.__chess.perft(d - 1, make(s, m)); return n; } };
  showLv(); tally(); init();
})();
