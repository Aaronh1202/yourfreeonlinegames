// Flappy Flyer: tap to flap through the gaps
(() => {
  const cv = G.$('#fl'), x = cv.getContext('2d'), ov = G.$('#ov'), W = cv.width, H = cv.height, GROUND = H - 60;
  let bird, pipes, score, state = 'ready', last, best = G.get('fl_best', 0), spawn;
  const GAP = 160, PW = 64, SPEED = 170, GRAV = 1300, FLAP = -400;
  function reset() { bird = { x: 110, y: H / 2 - 40, vy: 0 }; pipes = []; score = 0; spawn = 0; state = 'ready'; G.$('#score').textContent = 0; G.$('#best').textContent = best; ov.classList.add('hidden'); }
  function flap() {
    if (state === 'over') return;
    if (state === 'ready') state = 'play';
    bird.vy = FLAP;
  }
  function die() {
    if (state === 'over') return; state = 'over';
    const rec = score > best; if (rec) { best = score; G.set('fl_best', best); }
    G.$('#best').textContent = best;
    const medal = score >= 40 ? '🏆' : score >= 20 ? '🥇' : score >= 10 ? '🥈' : score >= 5 ? '🥉' : '';
    setTimeout(() => G.overlay(ov, 'Game over ' + medal, `Score: <b>${score}</b> · Best: <b>${best}</b>${rec && score ? '<br>🎉 New best!' : ''}`, 'Play again', reset), 400);
  }
  function step(dt) {
    if (state === 'ready') { bird.y = H / 2 - 40 + Math.sin(performance.now() / 250) * 8; return; }
    bird.vy += GRAV * dt; bird.y += bird.vy * dt;
    if (state === 'over') { if (bird.y > GROUND - 14) { bird.y = GROUND - 14; bird.vy = 0; } return; }
    spawn -= dt; if (spawn <= 0) { spawn = 1.45; const top = 70 + Math.random() * (GROUND - GAP - 140); pipes.push({ x: W + 10, top, scored: false }); }
    for (const p of pipes) {
      p.x -= SPEED * dt;
      if (!p.scored && p.x + PW < bird.x) { p.scored = true; score++; G.$('#score').textContent = score; }
      if (bird.x + 14 > p.x && bird.x - 14 < p.x + PW && (bird.y - 12 < p.top || bird.y + 12 > p.top + GAP)) die();
    }
    pipes = pipes.filter(p => p.x > -PW - 10);
    if (bird.y + 12 >= GROUND || bird.y < -40) die();
  }
  function draw() {
    const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#6cb6ff'); g.addColorStop(1, '#bfe3ff'); x.fillStyle = g; x.fillRect(0, 0, W, H);
    x.fillStyle = 'rgba(255,255,255,.7)'; [[60, 90], [260, 140], [330, 60]].forEach(([cx, cy]) => { x.beginPath(); x.arc(cx, cy, 22, 0, 7); x.arc(cx + 24, cy + 4, 18, 0, 7); x.arc(cx - 22, cy + 6, 16, 0, 7); x.fill(); });
    for (const p of pipes) { x.fillStyle = '#3ddc97'; x.fillRect(p.x, 0, PW, p.top); x.fillRect(p.x, p.top + GAP, PW, GROUND - p.top - GAP); x.fillStyle = '#22a35a'; x.fillRect(p.x - 4, p.top - 22, PW + 8, 22); x.fillRect(p.x - 4, p.top + GAP, PW + 8, 22); }
    x.fillStyle = '#d9b26f'; x.fillRect(0, GROUND, W, H - GROUND); x.fillStyle = '#7ccf5a'; x.fillRect(0, GROUND, W, 10);
    x.save(); x.translate(bird.x, bird.y); x.rotate(Math.max(-.5, Math.min(1.2, bird.vy / 600)));
    x.fillStyle = '#ffcc33'; x.beginPath(); x.ellipse(0, 0, 17, 13, 0, 0, 7); x.fill();
    x.fillStyle = '#fff'; x.beginPath(); x.arc(7, -4, 5, 0, 7); x.fill(); x.fillStyle = '#111'; x.beginPath(); x.arc(8.5, -4, 2.2, 0, 7); x.fill();
    x.fillStyle = '#ff7a2f'; x.beginPath(); x.moveTo(14, 1); x.lineTo(24, 4); x.lineTo(14, 8); x.fill();
    x.fillStyle = '#f5a623'; x.beginPath(); x.ellipse(-5, 3, 8, 5, -.4, 0, 7); x.fill(); x.restore();
    x.fillStyle = '#fff'; x.strokeStyle = '#0d1022'; x.lineWidth = 5; x.font = '800 44px system-ui'; x.textAlign = 'center';
    if (state !== 'ready') { x.strokeText(score, W / 2, 70); x.fillText(score, W / 2, 70); }
    else { x.font = '800 26px system-ui'; x.strokeText('Tap or press Space', W / 2, H / 2 + 60); x.fillText('Tap or press Space', W / 2, H / 2 + 60); }
  }
  function loop(t) { const dt = Math.min(.033, (t - (last || t)) / 1000); last = t; step(dt); draw(); requestAnimationFrame(loop); }
  cv.addEventListener('pointerdown', e => { e.preventDefault(); flap(); });
  addEventListener('keydown', e => { if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') { e.preventDefault(); if (state === 'over' && ov.classList.contains('hidden') === false) { ov.classList.add('hidden'); reset(); return; } flap(); } });
  reset(); requestAnimationFrame(loop);
})();
