(() => {
  const cv = G.$('#dino'), ctx = cv.getContext('2d'), ov = G.$('#ov');
  let W, H, GY, dpr = Math.min(window.devicePixelRatio || 1, 2);
  function size() {
    const r = cv.getBoundingClientRect(); W = 900; H = Math.round(W * r.height / r.width) || 300;
    cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); GY = H - 50;
  }
  size(); addEventListener('resize', () => { size(); draw(); });

  let best = G.get('dino_best', 0), state = 'ready', last = 0, t = 0;
  let dino, obs, clouds, speed, dist, spawnIn, ducking, night;
  G.$('#best').textContent = best;
  function reset() {
    dino = { y: 0, vy: 0, onGround: true }; obs = []; speed = 7; dist = 0; spawnIn = 60; ducking = false; night = false;
    clouds = Array.from({ length: 4 }, (_, i) => ({ x: i * 260 + G.rnd(120), y: 30 + G.rnd(70) }));
    G.$('#score').textContent = 0;
  }
  function jump() {
    if (state !== 'run') { if (state === 'over') reset(); start(); return; }
    if (dino.onGround) { dino.vy = -15.5; dino.onGround = false; }
  }
  function start() { state = 'run'; ov.classList.add('hidden'); last = performance.now(); requestAnimationFrame(loop); }
  function spawn() {
    const big = Math.random() < .35, bird = dist > 600 && Math.random() < .25;
    if (bird) { const hy = [GY - 28, GY - 62, GY - 95][G.rnd(3)]; obs.push({ type: 'bird', x: W + 20, y: hy, w: 46, h: 28 }); }
    else { const n = 1 + G.rnd(big ? 2 : 3); obs.push({ type: 'cactus', x: W + 20, n, big, w: n * (big ? 26 : 18) + (n - 1) * 4, h: big ? 58 : 40 }); }
    spawnIn = Math.max(38, 70 + G.rnd(60) - speed * 2);
  }
  function hitbox() {
    const h = ducking && dino.onGround ? 34 : 60, w = ducking && dino.onGround ? 66 : 50;
    return { x: 60 + 6, y: GY - h + dino.y + 4, w: w - 12, h: h - 8 };
  }
  function update(k) {
    t += k; dist += speed * k * .1; speed = Math.min(16, 7 + dist / 400);
    if (!dino.onGround || dino.y < 0) { dino.vy += (ducking ? 2.2 : 0.8) * k; dino.y += dino.vy * k; if (dino.y >= 0) { dino.y = 0; dino.vy = 0; dino.onGround = true; } }
    obs.forEach(o => o.x -= speed * k * (o.type === 'bird' ? 1.1 : 1));
    obs = obs.filter(o => o.x + o.w > -10);
    if ((spawnIn -= k) <= 0) spawn();
    clouds.forEach(c => { c.x -= speed * .2 * k; if (c.x < -100) { c.x = W + G.rnd(200); c.y = 30 + G.rnd(70); } });
    const s = Math.floor(dist); G.$('#score').textContent = s;
    night = Math.floor(s / 700) % 2 === 1;
    const d = hitbox();
    for (const o of obs) {
      const oy = o.type === 'bird' ? o.y : GY - o.h;
      if (d.x < o.x + o.w - 4 && d.x + d.w > o.x + 4 && d.y < oy + o.h - 4 && d.y + d.h > oy + 4) return over();
    }
  }
  function over() {
    state = 'over'; const s = Math.floor(dist);
    if (s > best) { best = s; G.set('dino_best', best); G.$('#best').textContent = best; }
    draw();
    G.overlay(ov, 'Game over', `Score: <b>${s}</b> · Best: <b>${best}</b>`, 'Run again', () => { reset(); start(); });
  }
  function loop(now) {
    if (state !== 'run') return;
    const k = Math.min(3, (now - last) / 16.67); last = now;
    update(k); draw(); if (state === 'run') requestAnimationFrame(loop);
  }
  function rr(x, y, w, h, r, c) { ctx.fillStyle = c; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x, y, w, h, r) : ctx.rect(x, y, w, h); ctx.fill(); }
  function drawDino() {
    const duck = ducking && dino.onGround, x = 60, base = GY + dino.y, run = dino.onGround ? Math.floor(t / 5) % 2 : 0;
    const body = '#2bb673', dark = '#1e8a56', belly = '#b8f0c8';
    if (duck) {
      rr(x + 2, base - 32, 52, 26, 13, body);           // body
      rr(x + 40, base - 38, 30, 22, 10, body);          // head
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x + 60, base - 30, 4.5, 0, 7); ctx.fill();
      ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(x + 61.5, base - 30, 2.2, 0, 7); ctx.fill();
      rr(x - 10, base - 26, 18, 8, 4, body);            // tail
      rr(x + 12 + run * 10, base - 8, 8, 8, 3, dark); rr(x + 32 - run * 10, base - 8, 8, 8, 3, dark);
      return;
    }
    rr(x - 14, base - 40, 24, 11, 5, body);              // tail
    rr(x, base - 48, 38, 38, 16, body);                 // body
    rr(x + 8, base - 38, 22, 24, 10, belly);            // belly
    rr(x + 20, base - 70, 34, 28, 13, body);            // head
    rr(x + 12, base - 54, 18, 14, 6, body);             // neck
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x + 42, base - 60, 5, 0, 7); ctx.fill();
    ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(x + 43.5, base - 60, 2.5, 0, 7); ctx.fill();
    ctx.fillStyle = dark; ctx.fillRect(x + 40, base - 49, 12, 2.5); // smile
    rr(x + 30, base - 34, 10, 5, 2, dark);              // arm
    // back spikes
    ctx.fillStyle = '#ffb703'; [[x + 4, base - 46], [x + 12, base - 50], [x + 22, base - 72]].forEach(([sx, sy]) => { ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + 5, sy - 8); ctx.lineTo(sx + 10, sy); ctx.fill(); });
    const l1 = dino.onGround ? (run ? 4 : 0) : 0, l2 = dino.onGround ? (run ? 0 : 4) : 0;
    rr(x + 8, base - 14 - l1, 9, 14, 3, dark); rr(x + 24, base - 14 - l2, 9, 14, 3, dark);
  }
  function drawCactus(o) {
    const c = night ? '#7bd389' : '#3a9d5d', h = o.h, cw = o.big ? 26 : 18;
    for (let i = 0; i < o.n; i++) {
      const x = o.x + i * (cw + 4), top = GY - h + (i % 2 ? 6 : 0);
      rr(x + cw * .3, top, cw * .4, GY - top, cw * .2, c);
      rr(x, top + h * .3, cw * .25, h * .32, 4, c); rr(x, top + h * .5, cw * .45, cw * .2, 3, c);
      rr(x + cw * .75, top + h * .2, cw * .25, h * .3, 4, c); rr(x + cw * .55, top + h * .42, cw * .45, cw * .2, 3, c);
    }
  }
  function drawBird(o) {
    const flap = Math.floor(t / 8) % 2, c = night ? '#ffadc6' : '#8c5bd6';
    rr(o.x + 10, o.y + 10, 30, 12, 6, c);
    ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(o.x + 18, o.y + 14); ctx.lineTo(o.x + 30, flap ? o.y - 4 : o.y + 30); ctx.lineTo(o.x + 34, o.y + 14); ctx.fill();
    ctx.fillStyle = '#ffb703'; ctx.beginPath(); ctx.moveTo(o.x + 10, o.y + 14); ctx.lineTo(o.x, o.y + 17); ctx.lineTo(o.x + 10, o.y + 19); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(o.x + 15, o.y + 14, 2.5, 0, 7); ctx.fill();
  }
  function draw() {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    if (night) { g.addColorStop(0, '#141a3c'); g.addColorStop(1, '#2a2f66'); } else { g.addColorStop(0, '#bfe6ff'); g.addColorStop(1, '#fff3d6'); }
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    if (night) { ctx.fillStyle = '#fff8d6'; ctx.beginPath(); ctx.arc(W - 90, 50, 22, 0, 7); ctx.fill(); }
    else { ctx.fillStyle = '#ffd166'; ctx.beginPath(); ctx.arc(W - 90, 50, 26, 0, 7); ctx.fill(); }
    ctx.fillStyle = night ? 'rgba(255,255,255,.25)' : 'rgba(255,255,255,.9)';
    clouds.forEach(c => { ctx.beginPath(); ctx.arc(c.x, c.y, 16, 0, 7); ctx.arc(c.x + 20, c.y - 8, 20, 0, 7); ctx.arc(c.x + 42, c.y, 15, 0, 7); ctx.fill(); });
    ctx.fillStyle = night ? '#3b3f7a' : '#e9c88f'; ctx.fillRect(0, GY, W, H - GY);
    ctx.fillStyle = night ? '#4a4f90' : '#d4ab6a';
    const off = (dist * 10) % 40; for (let x = -off; x < W; x += 40) ctx.fillRect(x, GY + 12 + (x / 40 % 3) * 8 | 0, 14, 3);
    ctx.fillStyle = night ? '#5a60a8' : '#c9995a'; ctx.fillRect(0, GY, W, 3);
    obs.forEach(o => o.type === 'bird' ? drawBird(o) : drawCactus(o));
    drawDino();
  }
  const down = e => {
    if (['ArrowUp', ' ', 'w', 'W'].includes(e.key)) { e.preventDefault(); jump(); }
    if (['ArrowDown', 's', 'S'].includes(e.key)) { e.preventDefault(); ducking = true; }
  };
  addEventListener('keydown', e => { if (!e.target.closest('input,textarea,select')) down(e); });
  addEventListener('keyup', e => { if (['ArrowDown', 's', 'S'].includes(e.key)) ducking = false; });
  // touch: tap top/anywhere = jump, swipe down / hold bottom button = duck
  cv.addEventListener('pointerdown', e => { e.preventDefault(); jump(); });
  const dk = G.$('#duck');
  dk.addEventListener('pointerdown', e => { e.preventDefault(); ducking = true; });
  ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => dk.addEventListener(ev, () => ducking = false));
  G.$('#jump').addEventListener('pointerdown', e => { e.preventDefault(); jump(); });
  reset(); draw();
  G.overlay(ov, 'Dino Run', 'Press Space or tap to jump. Press ↓ to duck under birds.', 'Start running', start);
})();
