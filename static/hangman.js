(() => {
  const CATS = {
    Animals: 'ALLIGATOR BUTTERFLY CHEETAH DOLPHIN ELEPHANT FLAMINGO GIRAFFE HAMSTER JAGUAR KANGAROO LEOPARD MONGOOSE OSTRICH PANTHER PORCUPINE RACCOON SQUIRREL TORTOISE WALRUS ZEBRA PENGUIN OCTOPUS GORILLA HEDGEHOG',
    Food: 'AVOCADO BROCCOLI CHOCOLATE DUMPLING ENCHILADA GUACAMOLE HAMBURGER LASAGNA MEATBALL OMELETTE PANCAKE PRETZEL QUESADILLA SANDWICH SPAGHETTI STRAWBERRY WATERMELON PINEAPPLE BLUEBERRY CUPCAKE BURRITO POPCORN',
    Countries: 'ARGENTINA AUSTRALIA BRAZIL CANADA DENMARK EGYPT FINLAND GERMANY GREECE ICELAND INDONESIA IRELAND JAMAICA KENYA MEXICO MOROCCO NORWAY PORTUGAL SWEDEN THAILAND VIETNAM COLOMBIA JAPAN',
    Sports: 'BASKETBALL BADMINTON BASEBALL BOWLING CYCLING FOOTBALL GYMNASTICS HOCKEY LACROSSE MARATHON SKATEBOARD SNOWBOARD SOFTBALL SWIMMING TENNIS VOLLEYBALL WRESTLING ARCHERY',
    Movies: 'ADVENTURE ANIMATION BLOCKBUSTER CINEMA COMEDY DIRECTOR DOCUMENTARY FANTASY HOLLYWOOD MUSICAL POPCORN PREMIERE ROMANCE SCREENPLAY SEQUEL SOUNDTRACK THRILLER TRAILER WESTERN',
    Nature: 'AVALANCHE CANYON DESERT GLACIER HURRICANE ISLAND JUNGLE LAGOON MEADOW MOUNTAIN RAINFOREST SUNFLOWER THUNDERSTORM TORNADO VOLCANO WATERFALL WILDFLOWER RAINBOW',
    Jobs: 'ACCOUNTANT ARCHITECT ASTRONAUT CARPENTER DETECTIVE ELECTRICIAN FIREFIGHTER JOURNALIST LIBRARIAN MECHANIC MUSICIAN PHARMACIST PHOTOGRAPHER PROGRAMMER SCIENTIST VETERINARIAN',
    Things: 'BACKPACK BICYCLE CALENDAR CAMERA COMPUTER ENVELOPE FLASHLIGHT HEADPHONES KEYBOARD LADDER MICROWAVE NOTEBOOK PILLOW REFRIGERATOR SCISSORS TELESCOPE UMBRELLA WHISTLE'
  };
  const MAX = 6;
  let word, cat, guessed, wrong, over, streak = G.get('hm_streak', 0), bestStreak = G.get('hm_best', 0), pick = 'random';
  const parts = G.$$('#hm svg .part');
  function start() {
    const names = Object.keys(CATS); cat = pick === 'random' ? names[G.rnd(names.length)] : pick;
    const ws = CATS[cat].split(' '); word = ws[G.rnd(ws.length)];
    guessed = new Set(); wrong = 0; over = false; G.$('#cat').textContent = cat; G.$('#msg').textContent = 'Guess a letter'; G.$('#msg').className = 'hmmsg';
    G.$('#again').classList.add('hidden'); draw();
  }
  function draw() {
    G.$('#word').innerHTML = word.split('').map(ch => `<span class="${guessed.has(ch) || over ? 'shown' : ''}${over && !guessed.has(ch) ? ' miss' : ''}">${guessed.has(ch) || over ? ch : ''}</span>`).join('');
    parts.forEach((p, i) => p.classList.toggle('on', i < wrong));
    G.$('#lives').textContent = MAX - wrong; G.$('#streak').textContent = streak; G.$('#beststreak').textContent = bestStreak;
    G.$$('#keys button').forEach(b => { const l = b.dataset.l; b.disabled = guessed.has(l) || over; b.classList.toggle('good', guessed.has(l) && word.includes(l)); b.classList.toggle('bad', guessed.has(l) && !word.includes(l)); });
  }
  function guess(l) {
    if (over || guessed.has(l)) return; guessed.add(l);
    if (!word.includes(l)) wrong++;
    const won = word.split('').every(ch => guessed.has(ch));
    if (won) { over = true; streak++; if (streak > bestStreak) { bestStreak = streak; G.set('hm_best', bestStreak); } G.set('hm_streak', streak); G.$('#msg').textContent = 'You got it! 🎉'; G.$('#msg').className = 'hmmsg win'; G.confetti(); }
    else if (wrong >= MAX) { over = true; streak = 0; G.set('hm_streak', 0); G.$('#msg').textContent = `Out of guesses! The word was ${word}.`; G.$('#msg').className = 'hmmsg lose'; }
    else G.$('#msg').textContent = word.includes(l) ? `Yes! ${l} is in the word.` : `No ${l}. ${MAX - wrong} ${MAX - wrong === 1 ? 'guess' : 'guesses'} left.`;
    if (over) G.$('#again').classList.remove('hidden');
    draw();
  }
  function hint() {
    if (over || wrong >= MAX - 1) { if (!over) G.$('#msg').textContent = 'No hints on your last guess!'; return; }
    const left = [...new Set(word.split(''))].filter(ch => !guessed.has(ch)); if (!left.length) return;
    wrong++; guess(left[G.rnd(left.length)]); if (!over) G.$('#msg').textContent = 'Hint used: it cost one guess.';
  }
  G.$('#keys').innerHTML = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'].map(r => '<div>' + r.split('').map(l => `<button class="btn" data-l="${l}">${l}</button>`).join('') + '</div>').join('');
  G.$('#keys').addEventListener('click', e => { const b = e.target.closest('button'); if (b) guess(b.dataset.l); });
  addEventListener('keydown', e => { if (e.ctrlKey || e.metaKey || e.altKey || e.target.closest('select')) return; if (/^[a-z]$/i.test(e.key)) guess(e.key.toUpperCase()); if (e.key === 'Enter' && over) start(); });
  G.$('#again').onclick = start; G.$('#new').onclick = () => { if (!over && guessed.size) { streak = 0; G.set('hm_streak', 0); } start(); }; G.$('#hint').onclick = hint;
  const sel = G.$('#catsel'); sel.innerHTML = '<option value="random">🎲 Random category</option>' + Object.keys(CATS).map(c => `<option>${c}</option>`).join('');
  sel.onchange = () => { pick = sel.value; start(); };
  start();
})();
