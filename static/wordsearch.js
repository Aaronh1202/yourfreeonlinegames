(() => {
  const THEMES = {
    Animals: 'TIGER ELEPHANT GIRAFFE ZEBRA MONKEY RABBIT DOLPHIN PENGUIN KANGAROO CHEETAH BEAR WOLF FOX HORSE TURTLE OWL EAGLE SHARK LION KOALA PANDA OTTER CAMEL MOOSE',
    Food: 'PIZZA BURGER TACO PASTA SALAD BANANA APPLE CHEESE BREAD COOKIE DONUT WAFFLE PANCAKE NOODLES SUSHI CARROT ORANGE MANGO GRAPES BACON MUFFIN BURRITO PEPPER HONEY',
    Sports: 'SOCCER TENNIS HOCKEY BASEBALL FOOTBALL GOLF BOXING RUGBY CRICKET KARATE SURFING SKIING CYCLING ROWING BOWLING ARCHERY FENCING DIVING HURDLES VOLLEYBALL',
    Space: 'PLANET COMET GALAXY ORBIT ROCKET ASTEROID NEBULA SATURN JUPITER MARS VENUS MERCURY NEPTUNE URANUS MOON STAR METEOR ECLIPSE GRAVITY SHUTTLE TELESCOPE COSMOS',
    Ocean: 'WHALE CORAL WAVE TIDE SEAWEED OCTOPUS SQUID CRAB LOBSTER STARFISH JELLYFISH OYSTER CLAM SEAL REEF ANCHOR ISLAND HARBOR SAILOR SHELL SHRIMP STINGRAY',
    Weather: 'RAIN SNOW STORM THUNDER LIGHTNING CLOUD SUNNY WINDY FOGGY HAIL SLEET RAINBOW TORNADO HURRICANE BREEZE DRIZZLE FROST BLIZZARD HUMID FORECAST CLIMATE',
    Jobs: 'DOCTOR NURSE TEACHER PILOT CHEF FARMER BAKER DENTIST LAWYER PAINTER PLUMBER ENGINEER FIREFIGHTER POLICE SCIENTIST WRITER ACTOR SINGER DRIVER BANKER',
    Colors: 'RED BLUE GREEN YELLOW PURPLE ORANGE PINK BROWN BLACK WHITE GRAY SILVER GOLD VIOLET INDIGO CRIMSON TEAL MAROON BEIGE LAVENDER TURQUOISE MAGENTA',
    Holidays: 'GIFTS CANDY TURKEY PUMPKIN FIREWORKS PARADE COSTUME STOCKING WREATH LANTERN FEAST PARTY CAKE CANDLES BALLOONS MUSIC FAMILY SNOWMAN HOLLY CAROLS',
    Music: 'GUITAR PIANO DRUMS VIOLIN TRUMPET FLUTE CELLO HARP BANJO TUBA SAXOPHONE MELODY RHYTHM CHORUS TEMPO CONCERT ORCHESTRA BAND SONG LYRICS HARMONY'
  };
  const LV = { easy: { n: 10, w: 8, dirs: [[0, 1], [1, 0]] }, medium: { n: 12, w: 10, dirs: [[0, 1], [1, 0], [1, 1], [-1, 1]] }, hard: { n: 14, w: 13, dirs: [[0, 1], [1, 0], [1, 1], [-1, 1], [0, -1], [-1, 0], [-1, -1], [1, -1]] } };
  const COLORS = ['#ff6b8b', '#ffb347', '#ffd84d', '#6ee7a8', '#5ec8ff', '#a78bfa', '#f472b6', '#34d399', '#fb923c', '#60a5fa', '#c084fc', '#facc15', '#2dd4bf', '#f87171'];
  const el = G.$('#ws'), list = G.$('#words'), ov = G.$('#ov');
  let level = G.cfg.level || G.get('ws_level', 'medium'), theme = 'random', N, grid, words, found, sel = null, cur = [];
  const timer = G.timer(s => G.$('#time').textContent = G.fmt(s));

  const daily = G.daily.setup('wordsearch', G.cfg.more);
  if (daily) level = 'medium';
  function generate() { if (daily) return G.withSeed('ws-' + G.today(), gen); return gen(); }
  function gen() {
    const cfg = LV[level]; N = cfg.n;
    const names = Object.keys(THEMES), th = theme === 'random' ? names[G.rnd(names.length)] : theme;
    G.$('#themename').textContent = th;
    for (let attempt = 0; attempt < 40; attempt++) {
      grid = Array.from({ length: N }, () => Array(N).fill(''));
      const pool = G.shuffle(THEMES[th].split(' ').filter(w => w.length <= N)); words = [];
      for (const w of pool) {
        if (words.length >= cfg.w) break;
        let placed = false;
        for (let t = 0; t < 150 && !placed; t++) {
          const [dr, dc] = cfg.dirs[G.rnd(cfg.dirs.length)], r = G.rnd(N), c = G.rnd(N);
          const er = r + dr * (w.length - 1), ec = c + dc * (w.length - 1);
          if (er < 0 || er >= N || ec < 0 || ec >= N) continue;
          let ok = true; for (let k = 0; k < w.length; k++) { const ch = grid[r + dr * k][c + dc * k]; if (ch && ch !== w[k]) { ok = false; break; } }
          if (!ok) continue;
          for (let k = 0; k < w.length; k++) grid[r + dr * k][c + dc * k] = w[k];
          words.push({ w, cells: Array.from({ length: w.length }, (_, k) => (r + dr * k) * N + c + dc * k) }); placed = true;
        }
      }
      if (words.length >= cfg.w) break;
    }
    const A = 'ABCDEFGHIJKLMNOPRSTUVWY';
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (!grid[r][c]) grid[r][c] = A[G.rnd(A.length)];
    words.sort((a, b) => a.w.localeCompare(b.w)); found = new Map();
    timer.reset(); ov.classList.add('hidden'); draw();
  }
  function draw() {
    el.style.gridTemplateColumns = `repeat(${N}, 1fr)`; el.style.setProperty('--n', N);
    el.innerHTML = '';
    for (let i = 0; i < N * N; i++) { const d = document.createElement('div'); d.textContent = grid[(i / N) | 0][i % N]; d.dataset.i = i; el.appendChild(d); }
    paint(); listDraw();
  }
  function paint() {
    const color = {}; found.forEach((ci, w) => words.find(x => x.w === w).cells.forEach(i => color[i] = COLORS[ci % COLORS.length]));
    [...el.children].forEach((d, i) => { d.style.background = color[i] || ''; d.classList.toggle('on', cur.includes(i)); d.classList.toggle('got', !!color[i]); });
  }
  function listDraw() {
    list.innerHTML = words.map(x => `<li class="${found.has(x.w) ? 'done' : ''}" style="${found.has(x.w) ? `--c:${COLORS[found.get(x.w) % COLORS.length]}` : ''}">${x.w}</li>`).join('');
    G.$('#count').textContent = `${found.size}/${words.length}`;
  }
  function line(a, b) {
    const ar = (a / N) | 0, ac = a % N, br = (b / N) | 0, bc = b % N, dr = br - ar, dc = bc - ac;
    const len = Math.max(Math.abs(dr), Math.abs(dc));
    if (len === 0) return [a];
    // snap to nearest of 8 directions
    const ang = Math.atan2(dr, dc), step = Math.round(ang / (Math.PI / 4)), sr = Math.round(Math.sin(step * Math.PI / 4)), sc = Math.round(Math.cos(step * Math.PI / 4));
    const out = []; for (let k = 0; k <= len; k++) { const r = ar + sr * k, c = ac + sc * k; if (r < 0 || r >= N || c < 0 || c >= N) break; out.push(r * N + c); }
    return out;
  }
  const cellAt = (x, y) => { const d = document.elementFromPoint(x, y); return d && d.parentElement === el ? +d.dataset.i : null; };
  el.addEventListener('pointerdown', e => { const i = cellAt(e.clientX, e.clientY); if (i === null) return; e.preventDefault(); el.setPointerCapture(e.pointerId); sel = i; cur = [i]; paint(); if (!timer.running()) timer.start(); });
  el.addEventListener('pointermove', e => { if (sel === null) return; const i = cellAt(e.clientX, e.clientY); if (i === null) return; cur = line(sel, i); paint(); });
  el.addEventListener('pointerup', () => {
    if (sel === null) return; sel = null;
    const s = cur.map(i => grid[(i / N) | 0][i % N]).join(''), rev = s.split('').reverse().join('');
    const hit = words.find(x => !found.has(x.w) && (x.w === s || x.w === rev) && (x.cells.join() === cur.join() || x.cells.join() === cur.slice().reverse().join()))
      || words.find(x => !found.has(x.w) && (x.w === s || x.w === rev));
    cur = [];
    if (hit) { found.set(hit.w, found.size); listDraw(); if (found.size === words.length) win(); }
    paint();
  });
  function win() {
    timer.stop(); const t = Math.round(timer.sec()), k = 'ws_best_' + (daily ? 'daily' : level), b = G.get(k, null), rec = b === null || t < b; if (rec) G.set(k, t); setBest(); G.confetti();
    if (daily) { G.daily.record('wordsearch', { t }); G.$('#dailystreak').textContent = G.daily.streak('wordsearch'); G.overlay(ov, 'Daily Word Search done! 🎉', `Time: <b>${G.fmt(t)}</b>${G.daily.winText('wordsearch')}`, 'Close', null); return; }
    G.overlay(ov, 'All words found! 🎉', `Time: <b>${G.fmt(t)}</b>${rec ? ' · New best!' : ''}`, 'New puzzle', generate);
  }
  function setBest() { const b = G.get('ws_best_' + (daily ? 'daily' : level), null); G.$('#best').textContent = b === null ? '—' : G.fmt(b); }
  G.$('#hint').onclick = () => { const left = words.filter(x => !found.has(x.w)); if (!left.length) return; const x = left[G.rnd(left.length)]; const d = el.children[x.cells[0]]; d.animate([{ transform: 'scale(1)', background: '#ffcc33' }, { transform: 'scale(1.35)', background: '#ffcc33' }, { transform: 'scale(1)' }], { duration: 700, iterations: 2 }); };
  G.$('#new').onclick = generate;
  const th = G.$('#theme'); th.innerHTML = '<option value="random">🎲 Random theme</option>' + Object.keys(THEMES).map(t => `<option>${t}</option>`).join('');
  th.onchange = () => { theme = th.value; generate(); };
  const lv = G.$('#level'); G.$$('button', lv).forEach(x => x.classList.toggle('on', x.dataset.v === level));
  G.seg(lv, v => { level = v; G.set('ws_level', v); setBest(); generate(); });
  setBest(); generate();
  if (daily) { const d = G.daily.doneToday('wordsearch'); if (d) G.overlay(ov, '✅ Done for today', `You found every word in today's puzzle${d.t ? ' in <b>' + G.fmt(d.t) + '</b>' : ''}.${G.daily.winText('wordsearch')}`, 'Play it again', null); }
})();
