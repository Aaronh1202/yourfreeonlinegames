// Shared helpers for all games
const G = {
  get(k, d) { try { const v = localStorage.getItem('yfog_' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('yfog_' + k, JSON.stringify(v)); } catch (e) {} },
  $(s, r) { return (r || document).querySelector(s); },
  $$(s, r) { return [...(r || document).querySelectorAll(s)]; },
  fmt(sec) { sec = Math.floor(sec); const m = Math.floor(sec / 60), s = sec % 60; return m + ':' + String(s).padStart(2, '0'); },
  rnd(n) { return Math.floor(Math.random() * n); },
  shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; },
  // swipe detection on an element; cb('up'|'down'|'left'|'right')
  swipe(el, cb) {
    let sx = 0, sy = 0, on = false;
    el.addEventListener('touchstart', e => { const t = e.touches[0]; sx = t.clientX; sy = t.clientY; on = true; }, { passive: true });
    el.addEventListener('touchmove', e => { if (on) e.preventDefault(); }, { passive: false });
    el.addEventListener('touchend', e => {
      if (!on) return; on = false;
      const t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
      cb(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'));
    });
  },
  keyDir(e) {
    return ({ ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', w: 'up', s: 'down', a: 'left', d: 'right', W: 'up', S: 'down', A: 'left', D: 'right' })[e.key];
  },
  // simple timer
  timer(onTick) {
    let start = 0, acc = 0, id = null;
    return {
      start() { if (id) return; start = performance.now(); id = setInterval(() => onTick(this.sec()), 250); },
      stop() { if (!id) return; acc += performance.now() - start; clearInterval(id); id = null; },
      reset() { this.stop(); acc = 0; onTick(0); },
      sec() { return (acc + (id ? performance.now() - start : 0)) / 1000; },
      running() { return !!id; }
    };
  },
  confetti() {
    const c = document.createElement('canvas'); c.className = 'confetti'; document.body.appendChild(c);
    const x = c.getContext('2d'); c.width = innerWidth; c.height = innerHeight;
    const cols = ['#ffcc33', '#ff5c8a', '#3ddc97', '#6cb6ff', '#c39bff'];
    const P = Array.from({ length: 160 }, () => ({ x: Math.random() * c.width, y: -20 - Math.random() * c.height * .5, vx: (Math.random() - .5) * 4, vy: 2 + Math.random() * 4, r: Math.random() * 6.28, s: 5 + Math.random() * 6, c: cols[G.rnd(5)] }));
    let f = 0;
    (function loop() {
      x.clearRect(0, 0, c.width, c.height);
      P.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += .05; p.r += .1; x.save(); x.translate(p.x, p.y); x.rotate(p.r); x.fillStyle = p.c; x.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); x.restore(); });
      if (++f < 220) requestAnimationFrame(loop); else c.remove();
    })();
  },
  seg(el, cb) {
    el.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      G.$$('button', el).forEach(x => x.classList.toggle('on', x === b)); cb(b.dataset.v);
    });
  },
  overlay(el, title, text, btn, cb) {
    el.innerHTML = `<h2>${title}</h2>${text ? `<p>${text}</p>` : ''}${btn ? `<button class="btn primary">${btn}</button>` : ''}`;
    el.classList.remove('hidden');
    const b = G.$('button', el); if (b) b.onclick = e => { e.stopPropagation(); el.classList.add('hidden'); cb && cb(); };
  }
};
