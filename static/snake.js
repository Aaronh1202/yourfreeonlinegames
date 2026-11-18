(() => {
  const N = 20, cv = G.$('#snake'), ctx = cv.getContext('2d'), ov = G.$('#ov');
  const SIZE = 560, dpr = Math.min(window.devicePixelRatio || 1, 2);
  cv.width = SIZE * dpr; cv.height = SIZE * dpr; ctx.scale(dpr, dpr);
  const C = SIZE / N;
  const speeds = { slow: 210, normal: 160, fast: 110 }, minMs = { slow: 130, normal: 85, fast: 60 };
  let speed = G.get('snake_speed', 'normal'), walls = G.get('snake_walls', 'on');
  let snake, dir, queue, food, score, best, state = 'ready', last = 0, acc = 0, eatFx = 0;

  const bestKey = () => 'snake_best_' + speed + '_' + walls;
  const setBest = () => { best = G.get(bestKey(), 0); G.$('#best').textContent = best; };

  function reset() {
    snake = [{ x: 8, y: 10 }, { x: 7, y: 10 }, { x: 6, y: 10 }];
    dir = { x: 1, y: 0 }; queue = []; score = 0; G.$('#score').textContent = 0; placeFood(); setBest(); draw();
  }
  function placeFood() {
    do { food = { x: G.rnd(N), y: G.rnd(N) }; } while (snake.some(s => s.x === food.x && s.y === food.y));
  }
  function turn(d) {
    const v = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } }[d];
    if (!v) return;
    if (state === 'ready' || state === 'over') { if (state === 'over') reset(); start(); }
    if (state === 'paused') { resume(); }
    const lastDir = queue.length ? queue[queue.length - 1] : dir;
    if (v.x === -lastDir.x && v.y === -lastDir.y) return;
    if (v.x === lastDir.x && v.y === lastDir.y) return;
    if (queue.length < 3) queue.push(v);
  }
  function start() { state = 'run'; ov.classList.add('hidden'); last = performance.now(); acc = 0; requestAnimationFrame(loop); }
  function pause() { if (state !== 'run') return; state = 'paused'; G.overlay(ov, 'Paused', 'Press Space or tap to keep going', 'Resume', resume); }
  function resume() { if (state !== 'paused') return; ov.classList.add('hidden'); state = 'run'; last = performance.now(); requestAnimationFrame(loop); }

  function step() {
    if (queue.length) dir = queue.shift();
    let h = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
    if (walls === 'off') { h.x = (h.x + N) % N; h.y = (h.y + N) % N; }
    const hitWall = h.x < 0 || h.y < 0 || h.x >= N || h.y >= N;
    const eating = h.x === food.x && h.y === food.y;
    const body = eating ? snake : snake.slice(0, -1);
    if (hitWall || body.some(s => s.x === h.x && s.y === h.y)) return gameOver();
    snake.unshift(h);
    if (eating) {
      score++; G.$('#score').textContent = score; eatFx = 1;
      if (score > best) { best = score; G.set(bestKey(), best); G.$('#best').textContent = best; }
      if (snake.length === N * N) return gameOver(true);
      placeFood();
    } else snake.pop();
  }
  function gameOver(won) {
    state = 'over'; draw();
    G.overlay(ov, won ? 'You filled the board!' : 'Game over', `Score: <b>${score}</b> · Best: <b>${best}</b>`, 'Play again', () => { reset(); start(); });
  }
  function loop(t) {
    if (state !== 'run') return;
    acc += t - last; last = t;
    const ms = Math.max(minMs[speed], speeds[speed] - score * 2.5);
    while (acc >= ms && state === 'run') { step(); acc -= ms; }
    draw(); if (state === 'run') requestAnimationFrame(loop);
  }
  function rr(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x, y, w, h, r) : ctx.rect(x, y, w, h); ctx.fill(); }
  function draw() {
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { ctx.fillStyle = (x + y) % 2 ? '#0d3326' : '#0f3a2b'; ctx.fillRect(x * C, y * C, C, C); }
    // food: apple
    const fx = food.x * C + C / 2, fy = food.y * C + C / 2;
    ctx.fillStyle = '#ff4d5e'; ctx.beginPath(); ctx.arc(fx, fy + 1, C * .36, 0, 7); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.45)'; ctx.beginPath(); ctx.arc(fx - C * .12, fy - C * .08, C * .09, 0, 7); ctx.fill();
    ctx.fillStyle = '#5be37a'; ctx.beginPath(); ctx.ellipse(fx + C * .12, fy - C * .32, C * .14, C * .07, -.6, 0, 7); ctx.fill();
    // snake
    const n = snake.length;
    snake.forEach((s, i) => {
      const k = 1 - i / Math.max(n, 12) * .45;
      ctx.fillStyle = `hsl(${140 + i * 1.5 % 40},75%,${Math.round(55 * k + 10)}%)`;
      const p = i === 0 ? 1 : 2.5; rr(s.x * C + p, s.y * C + p, C - p * 2, C - p * 2, C * .3);
    });
    // eyes
    const h = snake[0], ex = h.x * C + C / 2, ey = h.y * C + C / 2;
    const px = dir.y !== 0 ? C * .2 : 0, py = dir.x !== 0 ? C * .2 : 0;
    [[1], [-1]].forEach(([s]) => {
      const x = ex + dir.x * C * .15 + px * s, y = ey + dir.y * C * .15 + py * s;
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y, C * .13, 0, 7); ctx.fill();
      ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(x + dir.x * C * .04, y + dir.y * C * .04, C * .065, 0, 7); ctx.fill();
    });
    if (eatFx > 0) { ctx.fillStyle = `rgba(255,255,255,${eatFx * .12})`; ctx.fillRect(0, 0, SIZE, SIZE); eatFx -= .2; }
  }

  addEventListener('keydown', e => {
    if (e.target.closest('input,textarea,select')) return;
    const d = G.keyDir(e);
    if (d) { e.preventDefault(); turn(d); return; }
    if (e.key === ' ' || e.key === 'p' || e.key === 'P') {
      e.preventDefault();
      if (state === 'run') pause(); else if (state === 'paused') resume(); else if (state !== 'run') { if (state === 'over') reset(); start(); }
    }
  });
  G.swipe(G.$('#stagebox'), turn);
  G.$$('.dpad button').forEach(b => b.addEventListener('pointerdown', e => { e.preventDefault(); turn(b.dataset.d); }));
  G.$('#pause').onclick = () => state === 'run' ? pause() : resume();
  G.$('#restart').onclick = () => { reset(); start(); };
  const sp = G.$('#speed'), wl = G.$('#walls');
  G.$$('button', sp).forEach(b => b.classList.toggle('on', b.dataset.v === speed));
  G.$$('button', wl).forEach(b => b.classList.toggle('on', b.dataset.v === walls));
  G.seg(sp, v => { speed = v; G.set('snake_speed', v); setBest(); });
  G.seg(wl, v => { walls = v; G.set('snake_walls', v); setBest(); if (state === 'run') { reset(); start(); } });
  reset();
  G.overlay(ov, 'Snake', 'Use the arrow keys, WASD or swipe. Eat the apples and don\'t hit yourself!', 'Start game', start);
})();
