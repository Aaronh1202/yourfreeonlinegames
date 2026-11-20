"""Eight more games for YourFreeOnlineGames (Nov 2026)."""

NEW = ["word-guess", "four-in-a-row", "memory-game", "brick-breaker", "flappy-flyer", "falling-blocks", "reversi", "sliding-puzzle"]


def register(G, V, pills, seg, OV):
    G["word-guess"] = dict(
        emoji="🟩", color="#22a35a", name="Word Guess", short="Guess the 5-letter word in 6 tries",
        title="Word Guess – Guess the 5-Letter Word in 6 Tries (Free Word Game)",
        desc="Play Word Guess free online. Guess the hidden 5-letter word in six tries with green and yellow clues. Unlimited words plus a new daily word every day.",
        h1="Word Guess", sub="Find the hidden 5-letter word in 6 tries. Colors show how close each guess is.",
        js="wordguess.js",
        game=f'''<div class="bar">{pills(("played","Played","0"),("winpct","Win %","—"),("streak","Streak","0"),("beststreak","Best streak","0"))}<div class="grow"></div><button class="btn primary" id="new">New word</button></div>
<div class="stage" style="flex-direction:column;align-items:center"><p class="wgmsg" id="wgmsg"></p><div class="wg" id="wg"></div>{OV}</div>
<div class="wgkeys" id="wgkeys"></div>
<p class="hint">Type on your keyboard or tap the letters · Enter to guess · Backspace to delete</p>''',
        content="""<h2>How to play Word Guess</h2><p>There's a secret five-letter word. Type any five letters and press <b>Enter</b>. After each guess, the tiles change color to show how close you are:</p>
<ul><li><b style="color:#3ddc97">Green</b>: the letter is in the word and in the right spot.</li><li><b style="color:#e8c547">Yellow</b>: the letter is in the word but in a different spot.</li><li><b>Gray</b>: the letter isn't in the word.</li></ul>
<p>Use the clues to narrow it down. You have six guesses. The on-screen keyboard colors letters too, so you can see which ones you've ruled out.</p>
<h2>Tips for solving in fewer guesses</h2><ol><li><b>Start with common letters.</b> Words like <i>crane</i>, <i>slate</i> or <i>raise</i> test popular letters at once.</li><li><b>Don't reuse gray letters.</b> Each new guess should test new letters.</li><li><b>Move yellow letters.</b> A yellow letter belongs somewhere else, so try it in a new position.</li><li><b>Watch for double letters.</b> Words like <i>sheep</i> or <i>apple</i> repeat a letter.</li></ol>
<h2>Daily word</h2><p>Want the same challenge as everyone else? Play the <a href="daily-word-guess">Daily Word Guess</a>: one new word every day, with a streak to keep alive.</p>""",
        faq=[("Is Word Guess free?", "Yes. Play as many words as you like, free, with no sign-up or download."),
             ("How many guesses do I get?", "Six. Each guess must be five letters long."),
             ("What do the colors mean?", "Green means right letter, right spot. Yellow means the letter is in the word but in another spot. Gray means it isn't in the word."),
             ("Are my stats saved?", "Yes. Games played, win percentage and streaks are saved in your browser.")])

    G["four-in-a-row"] = dict(
        emoji="🔴", color="#2747c9", name="4 in a Row", short="Drop discs and connect four",
        title="4 in a Row – Play Free Connect Four Style Game Online",
        desc="Play 4 in a Row free online against the computer (easy, medium or hard) or a friend. Drop discs and be the first to connect four in a row. No download.",
        h1="4 in a Row", sub="Drop your discs and be first to line up four, across, down or diagonally.",
        js="connect4.js",
        game=f'''<div class="bar"><div class="pill"><span id="la">You</span><b id="sa">0</b></div><div class="pill">Draws<b id="sd">0</b></div><div class="pill"><span id="lb">Computer</span><b id="sb">0</b></div><div class="grow"></div>{seg("mode",[("cpu","vs Computer"),("pvp","2 Players")],"Mode")}{seg("level",[("easy","Easy"),("medium","Medium"),("hard","Hard")],"Difficulty")}<button class="btn" id="reset">Reset score</button></div>
<p class="ckstatus" id="turn">Your turn</p>
<div class="stage" style="flex-direction:column;align-items:center;gap:14px"><div class="c4" id="c4"></div><button class="btn primary hidden" id="again">Play again</button></div>
<p class="hint">Click or tap a column to drop a disc · Keys 1–7 also work</p>''',
        content="""<h2>How to play 4 in a Row</h2><p>Players take turns dropping a disc into one of the seven columns. The disc falls to the lowest empty space. The first player to line up <b>four of their discs in a row</b>, horizontally, vertically or diagonally, wins. If the board fills up first, it's a draw.</p>
<h2>Strategy tips</h2><ol><li><b>Take the center.</b> The middle column is part of the most possible lines, so it's the strongest place to play.</li><li><b>Block early.</b> Watch for three in a row with an open end and block it before it's too late.</li><li><b>Make double threats.</b> Set up two ways to win at once; your opponent can only block one.</li><li><b>Think about the row below.</b> Don't play a disc that lets your opponent drop a winning disc on top of it.</li></ol>
<h2>Difficulty levels</h2><p><b>Easy</b> makes plenty of mistakes, <b>Medium</b> looks a few moves ahead and <b>Hard</b> plans six moves deep. The starting player switches every game.</p>""",
        faq=[("Can you always win 4 in a Row?", "With perfect play, the player who goes first can always win by starting in the middle column. In practice, few people play perfectly."),
             ("Can I play with a friend?", "Yes. Choose 2 Players and take turns on the same device."),
             ("Who goes first?", "You go first in the first game, then the starting player switches every game.")])

    G["memory-game"] = dict(
        emoji="🧠", color="#e0457b", name="Memory Match", short="Flip cards and find the pairs",
        title="Memory Game – Play Free Memory Match Card Game Online",
        desc="Play Memory Match free online. Flip cards, remember where they are and find every matching pair in as few moves as possible. Four levels, great for kids and adults.",
        h1="Memory Match", sub="Flip two cards at a time. Find every matching pair in as few moves as you can.",
        js="memory.js",
        game=f'''<div class="bar">{pills(("moves","Moves","0"),("pairs","Pairs","0/8"),("time","Time","0:00"),("best","Best","—"))}<div class="grow"></div>{seg("level",[("easy","Easy"),("medium","Medium"),("hard","Hard"),("expert","Expert")],"Difficulty")}<button class="btn primary" id="new">New game</button></div>
<div class="stage"><div class="mem" id="mem"></div>{OV}</div>
<p class="hint">Tap or click a card to flip it</p>''',
        content="""<h2>How to play Memory Match</h2><p>All the cards start face down. Flip any two. If they match, they stay face up. If they don't, they flip back over, so try to remember what was under each one. Keep going until you've found every pair.</p>
<h2>Levels</h2><ul><li><b>Easy:</b> 12 cards (6 pairs), great for young kids.</li><li><b>Medium:</b> 16 cards (8 pairs).</li><li><b>Hard:</b> 24 cards (12 pairs).</li><li><b>Expert:</b> 36 cards (18 pairs).</li></ul>
<h2>Tips for a better score</h2><ol><li><b>Work in order.</b> Flip cards row by row so it's easier to remember where things are.</li><li><b>Say it out loud.</b> Naming each card ("cat, top left") helps it stick.</li><li><b>Use what you know.</b> When the first card of a turn matches one you've seen, go straight to it.</li></ol>
<h2>Good for your brain</h2><p>Memory games exercise short-term and visual memory and concentration. They're a fun brain workout for kids, adults and seniors.</p>""",
        faq=[("What's a perfect score?", "The fewest possible moves equals the number of pairs, but that takes luck. Finishing Medium in under 20 moves is very good."),
             ("Is it good for kids?", "Yes. Easy mode with 6 pairs is perfect for young children."),
             ("Is my best score saved?", "Yes, for each level, in your browser.")])

    G["brick-breaker"] = dict(
        emoji="🧱", color="#ff9452", name="Brick Breaker", short="Bounce the ball and smash bricks",
        title="Brick Breaker – Play Free Brick Breaker Game Online",
        desc="Play Brick Breaker free online. Move the paddle, bounce the ball and smash every brick. Endless levels, tougher bricks and a saved high score.",
        h1="Brick Breaker", sub="Bounce the ball with your paddle and break every brick. Don't let it fall!",
        js="breakout.js",
        game=f'''<div class="bar">{pills(("score","Score","0"),("lives","Lives","❤️❤️❤️"),("lvl","Level","1"),("best","Best","0"))}<div class="grow"></div><button class="btn primary" id="new">New game</button></div>
<div class="stage" id="stagebox"><canvas id="bb" width="560" height="440"></canvas>{OV}</div>
<p class="hint">Move with the mouse, your finger or the arrow keys · Click, tap or press Space to launch</p>''',
        content="""<h2>How to play Brick Breaker</h2><p>Launch the ball and bounce it off your paddle to break the bricks at the top. Clear every brick to move to the next level. You have three lives; you lose one each time the ball falls past your paddle.</p>
<ul><li><b>Computer:</b> move the mouse or use the arrow keys. Press Space to launch.</li><li><b>Phone or tablet:</b> drag your finger on the game to move the paddle, and tap to launch.</li></ul>
<h2>Aim with the paddle</h2><p>Where the ball hits the paddle changes its angle. Hit it near the middle to send it straight up, or near an edge for a sharp angle. Use the edges to reach bricks in the corners.</p>
<h2>Levels</h2><p>Each level adds more rows and a faster ball. From level 3, bricks with a white outline take two hits.</p>""",
        faq=[("Is Brick Breaker free?", "Yes, free with no download or sign-up."),
             ("How do I aim?", "Hit the ball with the edges of the paddle for steeper angles and the center for straighter shots."),
             ("Is my high score saved?", "Yes. Your best score is saved in your browser.")])

    G["flappy-flyer"] = dict(
        emoji="🐤", color="#6cb6ff", name="Flappy Flyer", short="Tap to fly through the gaps",
        title="Flappy Flyer – Free Flappy Bird Style Game Online",
        desc="Play Flappy Flyer free online. Tap or press Space to flap through the gaps between the pipes. Simple to learn, hard to master. Beat your high score!",
        h1="Flappy Flyer", sub="Tap, click or press Space to flap. Fly through the gaps and don't touch the pipes.",
        js="flappy.js",
        game=f'''<div class="bar">{pills(("score","Score","0"),("best","Best","0"))}</div>
<div class="stage" id="stagebox"><canvas id="fl" width="400" height="600"></canvas>{OV}</div>
<p class="hint">Tap the game, click or press Space / ↑ to flap</p>''',
        content="""<h2>How to play Flappy Flyer</h2><p>Your little bird falls all the time. Tap, click or press Space to flap upward. Guide it through the gaps between the pipes. Every pipe you pass scores a point, and touching a pipe or the ground ends the game.</p>
<h2>Tips for a higher score</h2><ol><li><b>Tap in a steady rhythm.</b> Short, regular taps are easier to control than big flaps.</li><li><b>Aim for the middle.</b> Line up with the center of the next gap as early as you can.</li><li><b>Stay low.</b> It's easier to flap up into a gap than to fall into one.</li><li><b>Relax.</b> Tense, fast tapping makes you overshoot.</li></ol>
<h2>Medals</h2><p>Score 5 for bronze 🥉, 10 for silver 🥈, 20 for gold 🥇 and 40 for the trophy 🏆.</p>""",
        faq=[("Is this the original Flappy Bird?", "No. Flappy Flyer is our own free game inspired by the classic tap-to-fly style."),
             ("Does it work on phones?", "Yes. Just tap the game screen to flap."),
             ("Is my high score saved?", "Yes, in your browser.")])

    G["falling-blocks"] = dict(
        emoji="🟦", color="#22d3ee", name="Falling Blocks", short="Rotate pieces and clear lines",
        title="Falling Blocks – Free Block Puzzle Game Online (Classic Style)",
        desc="Play Falling Blocks free online. Rotate and drop the pieces to complete lines and clear them. Speeds up as you level up. Keyboard and touch controls.",
        h1="Falling Blocks", sub="Move and rotate the falling pieces to fill complete lines. Full lines disappear.",
        js="blocks.js",
        game=f'''<div class="bar">{pills(("score","Score","0"),("lines","Lines","0"),("lvl","Level","1"),("best","Best","0"))}<div class="grow"></div><button class="btn" id="pause">⏸ Pause</button><button class="btn primary" id="new">New game</button></div>
<div class="stage" style="gap:14px;align-items:flex-start"><canvas id="fb" width="300" height="600"></canvas><div class="fbside"><span class="hint" style="margin:0">Next</span><canvas id="fbnext" width="96" height="96"></canvas></div>{OV}</div>
<div class="fbpad" id="fbpad"><button class="btn" data-a="l" aria-label="Left">◀</button><button class="btn" data-a="u" aria-label="Rotate">⟳</button><button class="btn" data-a="r" aria-label="Right">▶</button><button class="btn" data-a="d" aria-label="Down">▼</button><button class="btn" data-a="h" aria-label="Drop">⤓</button></div>
<p class="hint">← → move · ↑ rotate · ↓ soft drop · Space hard drop · P pause · On mobile, swipe or use the buttons</p>''',
        content="""<h2>How to play Falling Blocks</h2><p>Pieces made of four blocks fall from the top. Move and rotate them so they fit together. When a row is completely filled, it clears and you score points. The game ends when the pieces stack up to the top.</p>
<h2>Controls</h2><ul><li><b>← →</b> move, <b>↑</b> rotate, <b>↓</b> drop faster, <b>Space</b> drop instantly, <b>P</b> pause.</li><li>On phones: swipe left or right to move, swipe down to drop, tap to rotate, or use the buttons.</li></ul>
<h2>Scoring</h2><p>Clearing 1 line scores 100 points, 2 lines 300, 3 lines 500 and 4 lines at once 800, all multiplied by your level. Every 10 lines you level up and the pieces fall faster.</p>
<h2>Tips</h2><ol><li><b>Keep the stack flat</b> and low.</li><li><b>Leave one column open</b> on the side for the long piece to clear four lines at once.</li><li><b>Watch the Next box</b> to plan where each piece will go.</li><li>The faint shadow shows exactly where the piece will land.</li></ol>""",
        faq=[("Is this Tetris?", "No. Falling Blocks is our own free block puzzle game in the classic falling-blocks style."),
             ("How do I clear four lines at once?", "Build up the stack leaving one column empty, then drop the long straight piece into it."),
             ("Is my high score saved?", "Yes, in your browser.")])

    G["reversi"] = dict(
        emoji="⚫", color="#14894c", name="Reversi", short="Flip discs and own the board",
        title="Reversi – Play Free Reversi Online (vs Computer or 2 Player)",
        desc="Play Reversi free online against the computer or a friend. Outflank your opponent's discs to flip them to your color. Valid moves are shown. No download.",
        h1="Reversi", sub="Place a disc so it traps your opponent's discs in a line. Trapped discs flip to your color.",
        js="reversi.js",
        game=f'''<div class="bar"><div class="pill"><span id="la">You ⚫</span><b id="sa">2</b></div><div class="pill"><span id="lb">Computer ⚪</span><b id="sb">2</b></div><div class="grow"></div>{seg("mode",[("cpu","vs Computer"),("pvp","2 Players")],"Mode")}{seg("level",[("easy","Easy"),("medium","Medium"),("hard","Hard")],"Difficulty")}<button class="btn primary" id="new">New game</button></div>
<p class="ckstatus" id="turn">Your turn (black)</p>
<div class="stage" style="flex-direction:column;align-items:center;gap:14px"><div class="rv" id="rv"></div><button class="btn primary hidden" id="again">Play again</button></div>
<p class="hint">Small dots show where you can play</p>''',
        content="""<h2>How to play Reversi</h2><p>Black moves first. On your turn, place a disc so that one or more of your opponent's discs are trapped in a straight line (across, down or diagonally) between your new disc and another of yours. All the trapped discs flip to your color. If you can't make a legal move, your turn is skipped. When neither player can move, the player with the most discs wins.</p>
<h2>Reversi strategy</h2><ol><li><b>Corners are gold.</b> A disc in a corner can never be flipped.</li><li><b>Avoid the squares next to corners</b> early on: they often hand your opponent the corner.</li><li><b>Fewer discs can be better</b> in the middle game. Limiting your opponent's moves matters more than flipping lots of discs.</li><li><b>Edges are strong</b>, especially when connected to a corner.</li></ol>
<h2>Difficulty levels</h2><p><b>Easy</b> plays loosely, <b>Medium</b> knows the value of corners and edges, and <b>Hard</b> looks four moves ahead.</p>""",
        faq=[("Is Reversi the same as Othello?", "They're nearly identical. Othello is a trademarked version of Reversi with a fixed starting position, which is the setup used here."),
             ("What happens if I have no moves?", "Your turn is skipped and your opponent plays again. The game ends when neither player can move."),
             ("Can two people play?", "Yes. Choose 2 Players and take turns on the same device.")])

    G["sliding-puzzle"] = dict(
        emoji="🔢", color="#c39bff", name="Sliding Puzzle", short="Slide the tiles back in order",
        title="Sliding Puzzle – Play the Free 15 Puzzle Online (3×3, 4×4, 5×5)",
        desc="Play the classic sliding puzzle free online. Slide the numbered tiles into order from 1 to 15. Choose 3×3, 4×4 or 5×5 and beat your best moves and time.",
        h1="Sliding Puzzle", sub="Slide the tiles into the empty space until they're in order, 1 to the last number.",
        js="sliding.js",
        game=f'''<div class="bar">{pills(("moves","Moves","0"),("time","Time","0:00"),("best","Best","—"))}<div class="grow"></div>{seg("size",[("3","3×3"),("4","4×4"),("5","5×5")],"Size")}<button class="btn primary" id="new">Shuffle</button></div>
<div class="stage"><div class="sp" id="sp"></div>{OV}</div>
<p class="hint">Click a tile in the same row or column as the gap to slide it · Arrow keys work too</p>''',
        content="""<h2>How to play the sliding puzzle</h2><p>The tiles are shuffled with one empty space. Click a tile next to the gap (or anywhere in the same row or column) to slide it. Put the numbers back in order, left to right and top to bottom, with the empty space in the bottom-right corner.</p>
<h2>How to solve it</h2><ol><li><b>Solve the top row first</b>, then the second row. Once a row is done, don't touch it.</li><li><b>Solve the last two rows column by column</b>, from left to right.</li><li><b>For the last tile in a row</b>, place it below its spot first, then rotate it in with the tile beside it.</li></ol>
<h2>Sizes</h2><p><b>3×3</b> (the 8 puzzle) is quick, <b>4×4</b> is the classic 15 puzzle and <b>5×5</b> (the 24 puzzle) is a real test of patience. Every shuffle is guaranteed to be solvable.</p>""",
        faq=[("Is every sliding puzzle solvable?", "Yes. The tiles are shuffled using real slides from the solved position, so every puzzle can be solved."),
             ("What's a good time for the 15 puzzle?", "Under 2 minutes is good for most people. Speedsolvers finish in under 10 seconds."),
             ("Are my best scores saved?", "Yes, for each size, in your browser.")])

    V["daily-word-guess"] = dict(base="word-guess", daily=True, cfg={"daily": True}, emoji="📅", name="Daily Word Guess", short="One new word every day",
        title="Daily Word Guess – Today's Free 5-Letter Word Puzzle",
        desc="Play today's Daily Word Guess. One new 5-letter word every day, the same for everyone. Guess it in six tries and keep your daily streak going.",
        h1="Daily Word Guess", sub="Everyone gets the same word today. Can you get it in six?",
        content="""<h2>Today's word</h2><p><b>Daily Word Guess</b> gives everyone the same secret 5-letter word each day. A new word unlocks at midnight in your time zone, and no word repeats until the whole list has been played.</p>
<p>Green tiles are the right letter in the right spot, yellow tiles are in the word but in a different spot, and gray letters aren't in the word.</p>
<h2>Keep your streak</h2><p>Solve the daily word to add to your 🔥 streak. Your guesses are saved, so you can close the page and come back to finish. Want more? Play unlimited words in <a href="word-guess">Word Guess</a>.</p>""",
        faq=[("When does the daily word change?", "At midnight in your own time zone."),
             ("Is it the same word for everyone?", "Yes. Everyone playing on the same date gets the same word."),
             ("Can I play more than one word a day?", "The daily word is once a day, but you can play unlimited words on the main Word Guess page.")])
