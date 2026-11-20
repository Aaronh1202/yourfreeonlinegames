// Brick Breaker: bounce the ball, break every brick
(() => {
  const cv = G.$('#bb'), x = cv.getContext('2d'), ov = G.$('#ov'), W = cv.width, H = cv.height;
  const COLS = 10, BW = W / COLS, BH = 18, TOP = 50, COLORS = ['#ff5c8a', '#ff9452', '#ffcc33', '#3ddc97', '#6cb6ff', '#c39bff'];
  let pad, ball, bricks, score, lives, level, stuck, running, last, keys = {}, best = G.get('bb_best', 0);
  const pills = () => { G.$('#score').textContent = score; G.$('#lives').textContent = '❤️'.repeat(Math.max(0, lives)) || '—'; G.$('#lvl').textContent = level; G.$('#best').textContent = best; };
  function layout() {
    const rows = Math.min(4 + level, 8); bricks = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < COLS; c++) bricks.push({ x: c * BW + 2, y: TOP + r * (BH + 4), w: BW - 4, h: BH, c: COLORS[r % COLORS.length], hp: level >= 3 && r < level - 2 ? 2 : 1 });
  }
  function resetBall() { stuck = true; ball = { x: pad.x + pad.w / 2, y: H - 40, r: 7, vx: 0, vy: 0 }; }
  function launch() { if (!stuck) return; stuck = false; const sp = 300 + level * 30, a = (-Math.PI / 2) + (Math.random() - .5) * .8; ball.vx = Math.cos(a) * sp; ball.vy = Math.sin(a) * sp; ov.classList.add('hidden'); }
  function start() { score = 0; lives = 3; level = 1; pad = { w: 90, h: 12, x: W / 2 - 45 }; layout(); resetBall(); pills(); running = true; ov.classList.add('hidden'); }
  function lose() {
    lives--; pills();
    if (lives <= 0) {
      running = false; if (score > best) { best = score; G.set('bb_best', best); } pills();
      G.overlay(ov, 'Game over', `Score: <b>${score}</b> · Level <b>${level}</b>`, 'Play again', start); return;
    }
    resetBall();
  }
  function step(dt) {
    const ps = 520; if (keys.left) pad.x -= ps * dt; if (keys.right) pad.x += ps * dt;
    pad.x = Math.max(0, Math.min(W - pad.w, pad.x));
    if (stuck) { ball.x = pad.x + pad.w / 2; ball.y = H - 30 - ball.r; return; }
    ball.x += ball.vx * dt; ball.y += ball.vy * dt;
    if (ball.x < ball.r) { ball.x = ball.r; ball.vx = Math.abs(ball.vx); }
    if (ball.x > W - ball.r) { ball.x = W - ball.r; ball.vx = -Math.abs(ball.vx); }
    if (ball.y < ball.r) { ball.y = ball.r; ball.vy = Math.abs(ball.vy); }
    const py = H - 30;
    if (ball.vy > 0 && ball.y + ball.r >= py && ball.y + ball.r <= py + pad.h + 8 && ball.x >= pad.x - ball.r && ball.x <= pad.x + pad.w + ball.r) {
      const hit = (ball.x - (pad.x + pad.w / 2)) / (pad.w / 2), sp = Math.hypot(ball.vx, ball.vy) * 1.01, a = -Math.PI / 2 + hit * 1.05;
      ball.vx = Math.cos(a) * sp; ball.vy = Math.sin(a) * sp; ball.y = py - ball.r;
    }
    if (ball.y > H + 20) return lose();
    for (const b of bricks) {
      if (b.hp <= 0) continue;
      if (ball.x + ball.r > b.x && ball.x - ball.r < b.x + b.w && ball.y + ball.r > b.y && ball.y - ball.r < b.y + b.h) {
        const ox = Math.min(ball.x + ball.r - b.x, b.x + b.w - (ball.x - ball.r)), oy = Math.min(ball.y + ball.r - b.y, b.y + b.h - (ball.y - ball.r));
        if (ox < oy) ball.vx = -ball.vx; else ball.vy = -ball.vy;
        b.hp--; if (b.hp <= 0) score += 10 * level; pills(); break;
      }
    }
    if (bricks.every(b => b.hp <= 0)) { level++; layout(); resetBall(); pills(); G.overlay(ov, `Level ${level}! 🎉`, 'Tap, click or press Space to launch', null); }
  }
  function draw() {
    x.clearRect(0, 0, W, H);
    for (const b of bricks) if (b.hp > 0) { x.fillStyle = b.c; x.globalAlpha = b.hp > 1 ? 1 : .85; x.beginPath(); x.roundRect ? x.roundRect(b.x, b.y, b.w, b.h, 4) : x.rect(b.x, b.y, b.w, b.h); x.fill(); if (b.hp > 1) { x.strokeStyle = '#fff'; x.lineWidth = 2; x.stroke(); } }
    x.globalAlpha = 1; x.fillStyle = '#eef0ff'; x.beginPath(); x.roundRect ? x.roundRect(pad.x, H - 30, pad.w, pad.h, 6) : x.rect(pad.x, H - 30, pad.w, pad.h); x.fill();
    x.fillStyle = '#ffcc33'; x.beginPath(); x.arc(ball.x, ball.y, ball.r, 0, 7); x.fill();
    if (stuck && running) { x.fillStyle = '#a3a8d6'; x.font = '600 16px system-ui'; x.textAlign = 'center'; x.fillText('Click, tap or press Space to launch', W / 2, H / 2 + 60); }
  }
  function loop(t) { const dt = Math.min(.033, (t - (last || t)) / 1000); last = t; if (running && ov.classList.contains('hidden') || (running && stuck)) step(dt); draw(); requestAnimationFrame(loop); }
  const toX = cx => { const r = cv.getBoundingClientRect(); return (cx - r.left) * W / r.width; };
  cv.addEventListener('mousemove', e => { pad.x = toX(e.clientX) - pad.w / 2; });
  cv.addEventListener('touchmove', e => { e.preventDefault(); pad.x = toX(e.touches[0].clientX) - pad.w / 2; }, { passive: false });
  cv.addEventListener('touchstart', e => { pad.x = toX(e.touches[0].clientX) - pad.w / 2; if (running) launch(); }, { passive: true });
  cv.addEventListener('click', () => { if (running) launch(); });
  G.$('#stagebox').addEventListener('click', e => { if (running && !ov.classList.contains('hidden') && stuck && !e.target.closest('button')) launch(); });
  addEventListener('keydown', e => { if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = true; if (e.key === 'ArrowRight' || e.key === 'd') keys.right = true; if (e.key === ' ') { e.preventDefault(); if (running) launch(); } });
  addEventListener('keyup', e => { if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = false; if (e.key === 'ArrowRight' || e.key === 'd') keys.right = false; });
  G.$('#new').onclick = () => { start(); };
  start(); requestAnimationFrame(loop);
})();
