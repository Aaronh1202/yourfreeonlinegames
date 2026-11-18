(() => {
  const el = G.$('#ttt'), msg = G.$('#turn');
  const LINES = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  let b, turn, over, mode = G.get('ttt_mode', 'cpu'), level = G.get('ttt_level', 'hard'), first = 'X', tally = G.get('ttt_tally', { x: 0, o: 0, d: 0 });
  const winner = bd => { for (const l of LINES) if (bd[l[0]] && bd[l[0]] === bd[l[1]] && bd[l[1]] === bd[l[2]]) return { p: bd[l[0]], l }; return bd.every(Boolean) ? { p: 'D' } : null; };
  function mm(bd, me, ai) {
    const w = winner(bd); if (w) return w.p === ai ? 10 : w.p === 'D' ? 0 : -10;
    let best = me === ai ? -99 : 99;
    for (let i = 0; i < 9; i++) if (!bd[i]) { bd[i] = me; const v = mm(bd, me === 'X' ? 'O' : 'X', ai); bd[i] = null; best = me === ai ? Math.max(best, v - (v > 0 ? 0 : 0)) : Math.min(best, v); }
    return best;
  }
  function aiPick() {
    const free = b.map((v, i) => v ? -1 : i).filter(i => i >= 0);
    const rnd = level === 'easy' ? .75 : level === 'medium' ? .3 : 0;
    if (Math.random() < rnd) return free[G.rnd(free.length)];
    let best = -99, picks = [];
    for (const i of free) { b[i] = 'O'; const v = mm(b, 'X', 'O'); b[i] = null; if (v > best) { best = v; picks = [i]; } else if (v === best) picks.push(i); }
    return picks[G.rnd(picks.length)];
  }
  function start() {
    b = Array(9).fill(null); over = false; turn = first; render(); setMsg();
    if (mode === 'cpu' && turn === 'O') setTimeout(cpu, 400);
  }
  function setMsg(t) {
    if (t) { msg.textContent = t; return; }
    msg.textContent = mode === 'cpu' ? (turn === 'X' ? 'Your turn (X)' : 'Computer is thinking…') : `${turn}’s turn`;
  }
  function render(line) {
    [...el.children].forEach((d, i) => { d.textContent = b[i] || ''; d.className = 'tc' + (b[i] ? ' ' + b[i].toLowerCase() : '') + (line && line.includes(i) ? ' win' : ''); });
    G.$('#sx').textContent = tally.x; G.$('#so').textContent = tally.o; G.$('#sd').textContent = tally.d;
  }
  function place(i) {
    if (over || b[i]) return;
    b[i] = turn; const w = winner(b);
    if (w) {
      over = true; render(w.l);
      if (w.p === 'D') { tally.d++; setMsg("It's a draw!"); }
      else { tally[w.p.toLowerCase()]++; setMsg(mode === 'cpu' ? (w.p === 'X' ? 'You win! 🎉' : 'Computer wins!') : `${w.p} wins! 🎉`); if (mode !== 'cpu' || w.p === 'X') G.confetti(); }
      G.set('ttt_tally', tally); render(w.l);
      first = first === 'X' ? 'O' : 'X'; // alternate who starts
      setTimeout(() => G.$('#again').classList.remove('hidden'), 300);
      return;
    }
    turn = turn === 'X' ? 'O' : 'X'; render(); setMsg();
    if (mode === 'cpu' && turn === 'O') setTimeout(cpu, 420);
  }
  function cpu() { if (!over) place(aiPick()); }
  for (let i = 0; i < 9; i++) { const d = document.createElement('button'); d.className = 'tc'; d.setAttribute('aria-label', 'square ' + (i + 1)); d.onclick = () => { if (mode === 'cpu' && turn !== 'X') return; place(i); }; el.appendChild(d); }
  addEventListener('keydown', e => { if (/^[1-9]$/.test(e.key) && !(mode === 'cpu' && turn !== 'X')) { const k = +e.key; place([6, 7, 8, 3, 4, 5, 0, 1, 2][k - 1]); } });
  G.$('#again').onclick = () => { G.$('#again').classList.add('hidden'); start(); };
  G.$('#reset').onclick = () => { tally = { x: 0, o: 0, d: 0 }; G.set('ttt_tally', tally); first = 'X'; G.$('#again').classList.add('hidden'); start(); };
  const md = G.$('#mode'), lv = G.$('#level');
  G.$$('button', md).forEach(x => x.classList.toggle('on', x.dataset.v === mode));
  G.$$('button', lv).forEach(x => x.classList.toggle('on', x.dataset.v === level));
  const showLv = () => { lv.classList.toggle('hidden', mode !== 'cpu'); G.$('#lo').textContent = mode === 'cpu' ? 'Computer (O)' : 'O wins'; G.$('#lx').textContent = mode === 'cpu' ? 'You (X)' : 'X wins'; };
  G.seg(md, v => { mode = v; G.set('ttt_mode', v); first = 'X'; showLv(); G.$('#again').classList.add('hidden'); start(); });
  G.seg(lv, v => { level = v; G.set('ttt_level', v); first = 'X'; G.$('#again').classList.add('hidden'); start(); });
  showLv(); start();
})();
