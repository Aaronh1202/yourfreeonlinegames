// Word Guess: guess the 5-letter word in 6 tries (daily mode uses a date-based word)
(() => {
  const WORDS = ("about above actor adult after again agent agree ahead alarm album alert alive allow alone along alter angel anger angle angry apart apple apply arena argue arise armor arrow aside asset audio avoid award aware awful bacon badge baker basic beach beard beast begin being below bench berry birth black blade blame blank blast blaze blend bless blind block bloom board boast bonus boost booth bound brain brand brass brave bread break breed brick bride brief bring broad brook brown brush build bunch burst cabin cable camel candy cargo carry catch cause chain chair chalk charm chart chase cheap check cheek cheer chess chest chief child chill choir chunk civic claim class clean clear clerk click cliff climb clock close cloth cloud clown coach coast color comet coral couch count court cover crack craft crane crash crawl crazy cream crest crisp crowd crown crumb crush curve cycle daily dairy dance delay depth diary dodge doubt dough draft drain drama dream dress drift drill drink drive eagle early earth eight elbow elder empty enemy enjoy enter entry equal error event exact exist extra fable faith false fancy feast fence fever field fifth fifty fight final first flame flash fleet flock flood floor flour fluid flute focus force forge forth forty forum found frame fresh front frost fruit funny gauge ghost giant given glass globe glory glove goose grace grade grain grand grant grape graph grass great green greet grill gross group grove guard guess guest guide habit happy harsh heart heavy hedge hello hinge hobby honey honor horse hotel house human humor hurry ideal image index inner input issue ivory jelly jewel joint judge juice jumbo kayak knife knock label large laser later laugh layer learn lemon level light limit linen liver local lodge logic loose lucky lunar lunch magic major maker maple march match mayor medal media melon mercy merit metal meter might minor mixer model money month moral motor mount mouse mouth movie music nerve never night noble noise north novel nurse ocean offer often olive onion opera orbit order organ other otter outer owner paint panel panic paper party pasta patch pause peace peach pearl pedal penny phase phone photo piano piece pilot pitch pizza place plain plane plant plate plaza point polar porch pound power press price pride prime print prize proof proud pulse punch puppy queen quest quick quiet quilt quote radar radio raise ranch range rapid raven reach react ready realm relax relay reply rider ridge rifle right rival river roast robin robot rocky round route royal rugby ruler rural salad sauce scale scarf scene scent scoop score scout screw seize sense serve seven shade shake shape share shark sharp sheep shelf shell shift shine shirt shock shore short shout sight silly since skate skill skirt skull sleep slice slide slope small smart smile smoke snack snake solar solid solve sound south space spare spark speak speed spell spend spice spike spine spoon sport spray squad stack staff stage stair stamp stand start state steam steel steep stick still stock stone stool storm story stove straw strip study stuff style sugar suite sunny super sweet swift swing sword table taste teach teeth thank theme thick thing think third thorn three throw thumb tiger tight timer title toast today token tooth topic torch total touch tough tower toxic trace track trade trail train treat trend trial tribe trick truck truly trunk trust truth tulip twist uncle under union unity upper upset urban usual vague valid value vapor vault video vigor viral visit vital vivid vocal voice wagon waste watch water whale wheat wheel while white whole width witch woman world worry worth wound wrist write wrong yacht yield young youth zebra").split(' ').filter(w => w.length === 5);
  const grid = G.$('#wg'), kb = G.$('#wgkeys'), ov = G.$('#ov'), msgEl = G.$('#wgmsg');
  const daily = G.daily.setup('wordguess', G.cfg.more);
  let ans, rows, cur, over, stats = G.get('wg_stats', { p: 0, w: 0, s: 0, b: 0 });
  // each calendar day maps to a different word; no repeats until the whole list has been used
  const dayNum = () => { const d = new Date(); return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 864e5); };
  G.wordFor = n => WORDS[((n * 7919) % WORDS.length + WORDS.length) % WORDS.length];
  function msg(t) { msgEl.textContent = t || ''; if (t) { clearTimeout(msg.t); msg.t = setTimeout(() => msgEl.textContent = '', 1800); } }
  function score(g) {
    const r = Array(5).fill('b'), cnt = {};
    for (let i = 0; i < 5; i++) { if (g[i] === ans[i]) r[i] = 'g'; else cnt[ans[i]] = (cnt[ans[i]] || 0) + 1; }
    for (let i = 0; i < 5; i++) if (r[i] !== 'g' && cnt[g[i]] > 0) { r[i] = 'y'; cnt[g[i]]--; }
    return r;
  }
  function showStats() {
    G.$('#played').textContent = stats.p; G.$('#winpct').textContent = stats.p ? Math.round(stats.w / stats.p * 100) + '%' : '—';
    G.$('#streak').textContent = stats.s; G.$('#beststreak').textContent = stats.b;
  }
  function render() {
    let h = '';
    for (let r = 0; r < 6; r++) {
      const g = r < rows.length ? rows[r] : r === rows.length ? cur : '';
      const sc = r < rows.length ? score(rows[r]) : null;
      h += '<div class="wgrow">';
      for (let c = 0; c < 5; c++) { const ch = g[c] || ''; h += `<div class="wgc${sc ? ' ' + sc[c] : ch ? ' f' : ''}">${ch}</div>`; }
      h += '</div>';
    }
    grid.innerHTML = h;
    const rank = { b: 1, y: 2, g: 3 }, best = {};
    rows.forEach(w => { const s = score(w); [...w].forEach((ch, i) => { if (!best[ch] || rank[s[i]] > rank[best[ch]]) best[ch] = s[i]; }); });
    G.$$('button', kb).forEach(b => { const k = b.dataset.k; b.className = 'wgk' + (k.length > 1 ? ' wide' : '') + (best[k] ? ' ' + best[k] : ''); });
    showStats();
  }
  function save() { if (daily) G.set('wg_daily', { d: G.today(), rows, over }); }
  function end(won, already) {
    over = true;
    if (!already) {
      stats.p++; if (won) { stats.w++; stats.s++; stats.b = Math.max(stats.b, stats.s); } else stats.s = 0;
      G.set('wg_stats', stats); if (won) G.confetti();
      if (daily && won) { G.daily.record('wordguess', { tries: rows.length }); G.$('#dailystreak').textContent = G.daily.streak('wordguess'); }
    }
    save(); render();
    const word = `The word was <b>${ans.toUpperCase()}</b>.`;
    const title = won ? ['Genius! 🤯', 'Magnificent! 🎉', 'Impressive! 🎉', 'Splendid! 🎉', 'Great! 🎉', 'Phew! 😅'][rows.length - 1] : 'So close!';
    setTimeout(() => G.overlay(ov, title, (won ? `Solved in <b>${rows.length}</b> ${rows.length === 1 ? 'try' : 'tries'}. ` : '') + word + (daily ? (won ? G.daily.winText('wordguess') : '<br><span style="font-size:14px">A new word unlocks at midnight.</span>') : ''),
      daily ? 'Close' : 'Next word', daily ? null : newGame), already ? 0 : 900);
  }
  function submit() {
    if (cur.length < 5) { msg('Not enough letters'); grid.children[rows.length].classList.add('shake'); setTimeout(() => grid.children[rows.length] && grid.children[rows.length].classList.remove('shake'), 500); return; }
    rows.push(cur); cur = '';
    if (rows[rows.length - 1] === ans) return end(true);
    if (rows.length === 6) return end(false);
    save(); render();
  }
  function key(k) {
    if (over) return;
    if (k === 'enter') submit();
    else if (k === 'back') { cur = cur.slice(0, -1); render(); }
    else if (/^[a-z]$/.test(k) && cur.length < 5) { cur += k; render(); }
  }
  function newGame() {
    ans = daily ? G.wordFor(dayNum()) : WORDS[G.rnd(WORDS.length)];
    rows = []; cur = ''; over = false; ov.classList.add('hidden');
    if (daily) { const sv = G.get('wg_daily', null); if (sv && sv.d === G.today() && Array.isArray(sv.rows)) { rows = sv.rows; over = sv.over; } }
    render();
    if (daily && over) end(rows[rows.length - 1] === ans, true);
  }
  ['qwertyuiop', 'asdfghjkl', '+zxcvbnm-'].forEach(r => {
    const d = document.createElement('div'); d.className = 'wgkr';
    [...r].forEach(ch => { const b = document.createElement('button'); b.type = 'button'; b.dataset.k = ch === '+' ? 'enter' : ch === '-' ? 'back' : ch; b.textContent = ch === '+' ? 'Enter' : ch === '-' ? '⌫' : ch; b.onclick = () => { key(b.dataset.k); b.blur(); }; d.appendChild(b); });
    kb.appendChild(d);
  });
  addEventListener('keydown', e => { if (e.ctrlKey || e.metaKey || e.altKey) return; const k = e.key === 'Enter' ? 'enter' : e.key === 'Backspace' ? 'back' : e.key.toLowerCase(); if (k === 'enter' || k === 'back' || /^[a-z]$/.test(k)) { e.preventDefault(); key(k); } });
  const nb = G.$('#new'); if (nb) nb.onclick = () => newGame();
  // if the page is left open past midnight, load the new daily word
  if (daily) setInterval(() => { if (ans !== G.wordFor(dayNum())) location.reload(); }, 30000);
  newGame();
})();
