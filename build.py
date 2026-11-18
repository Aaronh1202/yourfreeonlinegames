import json, os, pathlib, shutil, re
OUT = pathlib.Path("public")
if OUT.exists(): shutil.rmtree(OUT)
OUT.mkdir()
for f in pathlib.Path("static").iterdir(): shutil.copy(f, OUT / f.name)
SITE = "YourFreeOnlineGames"
DOMAIN = "https://yourfreeonlinegames.com"
CONTACT = os.environ.get("CONTACT_EMAIL", "")
AUTHOR = "Aaron Hernandez"
UPDATED = "November 2026"

def pills(*items): return "".join(f'<div class="pill">{l}<b id="{i}">{d}</b></div>' for i, l, d in items)
def seg(id, opts, label): return f'<div class="seg" id="{id}" role="group" aria-label="{label}">' + "".join(f'<button data-v="{v}">{t}</button>' for v, t in opts) + "</div>"
OV = '<div class="overlay hidden" id="ov"></div>'

G = {}
G["solitaire"] = dict(
    emoji="🃏", color="#1d9a5b", name="Solitaire", short="Classic Klondike card game",
    title="Solitaire – Play Free Klondike Solitaire Online (No Download)",
    desc="Play classic Klondike Solitaire free online. Draw 1 or Draw 3, drag and drop or tap to move, unlimited undo and auto-finish. Works on phone, tablet and computer.",
    h1="Solitaire", sub="Classic Klondike solitaire. Tap a card to auto-move it, or drag it where you want.",
    js="solitaire.js",
    game=f'''<div class="bar">{pills(("time","Time","0:00"),("moves","Moves","0"),("score","Score","0"),("best","Best time","—"))}<div class="grow"></div>{seg("drawmode",[("1","Draw 1"),("3","Draw 3")],"Draw mode")}<button class="btn" id="undo">↶ Undo</button><button class="btn primary" id="new">New game</button></div>
<div class="stage" id="stagebox"><div id="sol"></div>{OV}</div>''',
    content="""<h2>How to play Solitaire</h2><p>The goal of Klondike Solitaire is to move all 52 cards onto the four <b>foundation</b> piles in the top right, one pile per suit, building up from Ace to King.</p>
<ul><li><b>Tableau:</b> the seven columns. Build them <b>down</b> in alternating colors, like a red 8 on a black 9.</li><li><b>Move stacks:</b> you can move a whole run of face-up cards together, as long as the top card of the run fits.</li><li><b>Empty columns:</b> only a King (or a run starting with a King) can go in an empty column.</li><li><b>Stock:</b> tap the deck in the top left to flip new cards. When it's empty, tap again to recycle the waste pile.</li></ul>
<h2>Draw 1 vs Draw 3</h2><p><b>Draw 1</b> flips one card at a time and is the easier, more relaxing way to play. <b>Draw 3</b> flips three at once and you can only play the top one, which makes it much harder and closer to the classic Windows version.</p>
<h2>Tips to win more often</h2><ol><li>Always flip face-down cards in the tableau when you can. They're what blocks most games.</li><li>Work on the longest columns first, since they hide the most cards.</li><li>Don't empty a column unless you have a King ready to move into it.</li><li>Don't rush cards to the foundation. Low cards like 2s and 3s are sometimes more useful left in the tableau.</li><li>Use <b>Undo</b> freely to test a different line of play.</li></ol>""",
    faq=[("Is this Solitaire free?", "Yes. It's 100% free with no download, no sign-up and no limits. It runs right in your browser on phones, tablets and computers."),
         ("Is every Solitaire game winnable?", "No. About 80% of Draw 1 Klondike deals can be won with perfect play, but some deals are impossible. If you're stuck, try Undo or deal a new game."),
         ("How does scoring work?", "You get 10 points for each card moved to a foundation, 5 points for moving a card from the waste pile to the tableau and 5 for turning over a face-down card. Moving a card back off a foundation costs 15 points, and recycling the deck in Draw 1 costs 100."),
         ("Can I play Solitaire on my phone?", "Yes. Just tap a card and it jumps to the best spot automatically, or drag it with your finger.")])

G["snake-game"] = dict(
    emoji="🐍", color="#22a35a", name="Snake", short="Eat apples, grow longer, don't crash",
    title="Snake Game – Play the Classic Snake Game Online Free",
    desc="Play the classic Snake game online for free. Eat the apples, grow longer and beat your high score. Three speeds, walls on or off, and swipe controls for mobile.",
    h1="Snake Game", sub="Eat the apples, grow longer and don't run into yourself.",
    js="snake.js",
    game=f'''<div class="bar">{pills(("score","Score","0"),("best","Best","0"))}<div class="grow"></div>{seg("speed",[("slow","Slow"),("normal","Normal"),("fast","Fast")],"Speed")}{seg("walls",[("on","Walls"),("off","No walls")],"Walls")}<button class="btn" id="pause">⏸ Pause</button><button class="btn primary" id="restart">Restart</button></div>
<div class="stage" id="stagebox"><canvas id="snake" width="560" height="560"></canvas>{OV}</div>
<div class="dpad"><button class="btn u" data-d="up" aria-label="Up">▲</button><button class="btn l" data-d="left" aria-label="Left">◀</button><button class="btn d" data-d="down" aria-label="Down">▼</button><button class="btn r" data-d="right" aria-label="Right">▶</button></div>
<p class="hint">Arrow keys or WASD to move · Space to pause · Swipe on mobile</p>''',
    content="""<h2>How to play Snake</h2><p>Guide the snake around the board to eat the red apples. Each apple adds one point and makes the snake one block longer. The snake starts slow and speeds up a little with every apple. The game ends if the snake runs into its own tail, or into a wall when walls are on.</p>
<ul><li><b>Computer:</b> arrow keys or W, A, S, D. Press Space to pause.</li><li><b>Phone or tablet:</b> swipe on the board or use the arrow buttons.</li><li><b>No walls mode:</b> the snake wraps around to the other side instead of crashing.</li></ul>
<h2>Snake tips and strategy</h2><ol><li><b>Hug the edges.</b> Moving along the walls keeps the middle open so you don't trap yourself.</li><li><b>Plan your exit.</b> Before grabbing an apple in a tight spot, make sure you have a way out.</li><li><b>Zig-zag when you're long.</b> Sweeping back and forth across the board in rows is the safest way to fill it.</li><li><b>Start on Slow</b> to learn the moves, then switch to Fast for a real challenge.</li></ol>
<h2>A little Snake history</h2><p>Snake started as an arcade game in the 1970s, but it became famous in 1997 when it came pre-installed on Nokia phones and was played by hundreds of millions of people. It's still one of the most played simple games in the world.</p>""",
    faq=[("What is the highest possible score in Snake?", "On this 20×20 board, a perfect game is 397 points, which is when the snake fills every square."),
         ("Does my high score save?", "Yes. Your best score is saved in your browser for each speed and wall setting, so you can come back and try to beat it."),
         ("Can I play Snake on my phone?", "Yes. Swipe on the board or use the arrow buttons under it."),
         ("Is this the Google Snake game?", "No. This is our own free version of classic Snake, with no download and no sign-up.")])

G["minesweeper"] = dict(
    emoji="💣", color="#4553b5", name="Minesweeper", short="Clear the board without hitting a mine",
    title="Minesweeper – Play Free Minesweeper Online (Classic Game)",
    desc="Play classic Minesweeper online for free. Beginner, Intermediate and Expert boards, a safe first click, flags, chording and best times. Works on desktop and mobile.",
    h1="Minesweeper", sub="Clear every safe square without setting off a mine. Your first click is always safe.",
    js="minesweeper.js",
    game=f'''<div class="bar">{pills(("mines","Mines","10"),("time","Time","0:00"),("best","Best","—"))}<div class="grow"></div>{seg("level",[("easy","Beginner"),("medium","Intermediate"),("hard","Expert")],"Difficulty")}<button class="btn" id="flagmode">🚩 Flag mode: OFF</button><button class="btn primary" id="new">New game</button></div>
<div class="stage"><div class="mswrap"><div class="ms" id="ms"></div></div>{OV}</div>
<p class="hint">Click to open · Right-click to flag · Click a number to clear around it · On mobile, long-press to flag</p>''',
    content="""<h2>How to play Minesweeper</h2><p>The board hides a number of mines. Click a square to open it. If it's safe, you'll see a number that tells you <b>how many mines touch that square</b>, including diagonals. Use those numbers to figure out where the mines are, and open every other square to win.</p>
<ul><li><b>Flag a mine:</b> right-click on a computer, or long-press (or turn on Flag mode) on a phone.</li><li><b>Chording:</b> click a number that already has the right number of flags around it to open all its other neighbors at once.</li><li><b>Safe start:</b> your first click is never a mine and always opens up an area.</li></ul>
<h2>Board sizes</h2><ul><li><b>Beginner:</b> 9×9 with 10 mines</li><li><b>Intermediate:</b> 16×16 with 40 mines</li><li><b>Expert:</b> 30×16 with 99 mines</li></ul>
<h2>Minesweeper strategy</h2><ol><li>A <b>1</b> touching only one closed square means that square is a mine.</li><li>Learn the <b>1-2-1</b> pattern along a wall: the mines are under the two 1s, and the square under the 2 is safe.</li><li>Learn the <b>1-2-2-1</b> pattern: the mines are under the two 2s.</li><li>Flag mines you're sure about, then chord to clear quickly.</li><li>When you're truly forced to guess, pick corners. They're more likely to open a big area.</li></ol>""",
    faq=[("Is the first click always safe?", "Yes. Mines are placed only after your first click, and never on or next to the square you clicked."),
         ("What's a good Minesweeper time?", "On Beginner, under 30 seconds is very good. On Intermediate, under 2 minutes is strong. On Expert, under 5 minutes is great. World records are far faster than that."),
         ("How do I flag on a phone?", "Long-press a square, or turn on Flag mode so every tap places a flag."),
         ("Do I have to guess sometimes?", "Sometimes. Most of the board can be solved with logic, but now and then the numbers leave a true 50/50 guess.")])

G["2048"] = dict(
    emoji="🔢", color="#ff9452", name="2048", short="Slide and merge tiles to reach 2048",
    title="2048 Game – Play 2048 Online Free (Original Puzzle)",
    desc="Play 2048 online for free. Slide the tiles, merge matching numbers and reach the 2048 tile. Undo, saved progress, best score and swipe controls for mobile.",
    h1="2048", sub="Slide the tiles. When two of the same number touch, they merge into one. Reach 2048 to win!",
    js="2048.js",
    game=f'''<div class="bar">{pills(("score","Score","0"),("best","Best","0"))}<div class="grow"></div><button class="btn" id="undo">↶ Undo</button><button class="btn primary" id="new">New game</button></div>
<div class="stage"><div class="g2048" id="g2048"><div class="cells">{"<i></i>"*16}</div><div class="tiles"></div>{OV}</div></div>
<p class="hint">Use the arrow keys or WASD · Swipe on mobile · Your game saves automatically</p>''',
    content="""<h2>How to play 2048</h2><p>Use the arrow keys (or swipe) to slide every tile on the board in one direction. When two tiles with the same number bump into each other, they <b>merge into one</b> with double the value: 2 + 2 = 4, 4 + 4 = 8, and so on. After every move a new 2 or 4 appears. Make a <b>2048</b> tile to win, then keep going for a higher score.</p>
<h2>The best 2048 strategy</h2><ol><li><b>Pick a corner</b> and keep your biggest tile in it the whole game.</li><li><b>Use mostly two directions</b>, like left and down. Use the third only when you have to, and avoid the fourth.</li><li><b>Build a chain</b> along one edge, with the numbers getting smaller as they move away from the corner (1024, 512, 256…).</li><li><b>Don't chase merges</b> in the middle of the board. A tidy board is worth more than one quick merge.</li><li>Made a mistake? Use <b>Undo</b> to take back your last move.</li></ol>""",
    faq=[("What happens after I reach 2048?", "You can keep playing to make 4096, 8192 and beyond, and push your score higher."),
         ("What's the highest tile possible?", "In theory the highest tile on a 4×4 board is 131,072, but reaching even 8192 is very rare."),
         ("Does my game save?", "Yes. Your current game and best score are saved in your browser, so you can close the page and come back later."),
         ("Who made 2048?", "The original 2048 was created by Gabriele Cirulli in 2014 and released as open source. This is our own free version of the game.")])

G["sudoku"] = dict(
    emoji="🧩", color="#7a5cf0", name="Sudoku", short="Unlimited free puzzles, easy to expert",
    title="Sudoku – Play Free Sudoku Online (Easy to Expert)",
    desc="Play free Sudoku online with unlimited new puzzles from Easy to Expert. Notes, hints, undo, mistake checking and a timer. Every puzzle has exactly one solution.",
    h1="Sudoku", sub="Fill the grid so every row, column and 3×3 box has the numbers 1 to 9 exactly once.",
    js="sudoku.js",
    game=f'''<div class="bar">{pills(("time","Time","0:00"),("mist","Mistakes","0"),("best","Best","—"))}<div class="grow"></div>{seg("level",[("easy","Easy"),("medium","Medium"),("hard","Hard"),("expert","Expert")],"Difficulty")}<button class="btn primary" id="new">New puzzle</button></div>
<div class="stage" style="display:block"><div class="sdk-layout"><div class="sdk" id="sdk"></div>
<div class="sdk-side"><div class="row" style="display:grid;grid-template-columns:1fr 1fr;gap:8px"><button class="btn" id="undo">↶ Undo</button><button class="btn" id="erase">⌫ Erase</button><button class="btn" id="notes">✏️ Notes: OFF</button><button class="btn" id="hint">💡 Hint</button></div>
<div class="pad">{"".join(f'<button class="btn" data-n="{n}">{n}</button>' for n in range(1,10))}</div></div></div>{OV}</div>
<p class="hint">Click a square, then a number · Keyboard: 1–9, arrows, Backspace, N for notes</p>''',
    content="""<h2>How to play Sudoku</h2><p>A Sudoku grid has 9 rows, 9 columns and nine 3×3 boxes. Some numbers are already filled in. Your job is to fill every empty square so that each <b>row</b>, each <b>column</b> and each <b>3×3 box</b> contains the numbers 1 through 9 exactly once. Every puzzle here has exactly one correct solution.</p>
<ul><li><b>Notes:</b> turn on Notes to pencil in small candidate numbers.</li><li><b>Mistakes:</b> wrong numbers turn red, so you can fix them right away.</li><li><b>Hint:</b> fills in the selected square (or a random one) with the right answer.</li></ul>
<h2>Sudoku strategies for beginners</h2><ol><li><b>Scan for singles:</b> look at one number, say 5, and check each box for the only square where a 5 can go.</li><li><b>Last empty square:</b> if a row, column or box is missing only one number, fill it in.</li><li><b>Use notes on harder puzzles:</b> write all possible numbers in a square, then erase them as you rule them out.</li><li><b>Pairs:</b> if two squares in a row can only be the same two numbers, those numbers can't go anywhere else in that row.</li></ol>
<h2>Difficulty levels</h2><p>Easy puzzles start with about 40 numbers filled in, Medium about 32, Hard about 27 and Expert about 24. Fewer starting numbers means you need more advanced logic.</p>""",
    faq=[("Are the puzzles really unlimited?", "Yes. Every puzzle is generated fresh in your browser, and each one is checked to have exactly one solution."),
         ("Do I need to guess in Sudoku?", "No. A proper Sudoku can always be solved with logic alone, without guessing."),
         ("Can I play Sudoku with my keyboard?", "Yes. Use the arrow keys to move, 1–9 to enter numbers, Backspace to erase and N to switch Notes on and off."),
         ("Is Sudoku good for your brain?", "Sudoku is a great way to practice logic, focus and memory, and many people play a puzzle a day to stay sharp.")])

G["dinosaur-game"] = dict(
    emoji="🦖", color="#2bb673", name="Dino Run", short="Jump cacti, duck birds, run forever",
    title="Dinosaur Game – Play Dino Run Online Free (Endless Runner)",
    desc="Play a free dinosaur game online. Jump over cacti, duck under birds and run as far as you can in this endless runner. Works offline-style in your browser on any device.",
    h1="Dinosaur Game", sub="Jump over cacti, duck under birds and see how far your dino can run.",
    js="dino.js",
    game=f'''<div class="bar">{pills(("score","Score","0"),("best","Best","0"))}</div>
<div class="stage"><canvas id="dino" width="900" height="300"></canvas>{OV}</div>
<div class="dinopad"><button class="btn" id="duck">⬇ Duck<small>hold</small></button><button class="btn primary" id="jump">⬆ Jump<small>tap</small></button></div>
<p class="hint">Space or ↑ to jump · ↓ to duck · On mobile: tap the game to jump, swipe down and hold to duck, or use the big buttons</p>''',
    content="""<h2>How to play the Dinosaur Game</h2><p>Your dino runs on its own, and it keeps getting faster. Press <b>Space</b> or the <b>Up arrow</b> to jump over cacti, and hold the <b>Down arrow</b> to duck under flying birds. On a phone, tap the game to jump, and swipe down and hold (or press and hold the big Duck button) to duck. The longer you survive, the higher your score.</p>
<h2>Tips for a high score</h2><ol><li><b>Jump a little early</b> as the game speeds up. The faster you go, the sooner you need to jump.</li><li><b>Duck to drop fast:</b> pressing down in the air makes your dino land quicker, which helps with close obstacles.</li><li><b>Watch bird height:</b> low birds must be jumped, high birds can be run under, and middle birds need a duck.</li><li><b>Stay relaxed.</b> Most runs end from jumping too early, not too late.</li></ol>
<h2>Day and night</h2><p>Every 700 points, the sky switches between day and night. How many cycles can you make it through?</p>""",
    faq=[("Is this the Chrome dinosaur game?", "No. It's our own free dinosaur runner inspired by the classic offline dino game, with its own dino, birds and day/night sky."),
         ("How do I duck on my phone?", "Swipe down on the game and keep your finger down, or press and hold the big Duck button under the game. Ducking in the air also makes your dino drop faster."),
         ("Is my best score saved?", "Yes. Your high score is saved in your browser."),
         ("Why does the game get faster?", "Speed goes up the farther you run, which makes every run harder the longer you last.")])


G["mahjong"] = dict(
    emoji="🀄", color="#1e8a6e", name="Mahjong", short="Match free tiles to clear the board",
    title="Mahjong – Play Free Mahjong Solitaire Online (No Download)",
    desc="Play free Mahjong Solitaire online. Match pairs of free tiles to clear all 144 tiles. Every deal is solvable, with hints, shuffle, undo and a timer. Works on any device.",
    h1="Mahjong Solitaire", sub="Match pairs of identical free tiles until the board is clear. Every deal can be solved.",
    js="mahjong.js",
    game=f'''<div class="bar">{pills(("left","Tiles left","144"),("pairs","Moves","0"),("time","Time","0:00"),("best","Best","—"))}<div class="grow"></div><button class="btn" id="hint">💡 Hint</button><button class="btn" id="shuffle">🔀 Shuffle</button><button class="btn" id="undo">↶ Undo</button><button class="btn primary" id="new">New game</button></div>
<div class="stage"><div id="mj"></div>{OV}</div>
<p class="hint">Click two matching free tiles · Press H for a hint · Ctrl+Z to undo</p>''',
    content="""<h2>How to play Mahjong Solitaire</h2><p>The goal is to clear all 144 tiles by removing them in matching pairs. You can only pick tiles that are <b>free</b>, which means:</p>
<ul><li>No tile is sitting on top of it, and</li><li>It has an open side on the <b>left or right</b>.</li></ul><p>Free tiles look bright. Blocked tiles look darker. Click one free tile, then a matching free tile, and both disappear.</p>
<h2>Which tiles match?</h2><ul><li><b>Dots, Bamboo and Characters:</b> match the same suit and number (like 5 Dots with 5 Dots).</li><li><b>Winds and Dragons:</b> match the exact same tile.</li><li><b>Flowers</b> (🌸🌼🌺🌷) match <b>any</b> other flower, and <b>Seasons</b> (🌱☀️🍂❄️) match any other season.</li></ul>
<h2>Mahjong strategy tips</h2><ol><li><b>Clear the top and the long rows first.</b> Tiles stacked high and at the ends of long rows block the most others.</li><li><b>When all four of a kind are free</b>, remove them all. There's no risk.</li><li><b>Think before matching</b> when only 3 of a kind are free. Pick the pair that unlocks more tiles.</li><li><b>Stuck?</b> Use Hint, Undo, or Shuffle to mix up the tiles that are left.</li></ol>
<h2>Is this real Mahjong?</h2><p>This is <b>Mahjong Solitaire</b>, the single-player tile-matching game most people mean when they search for Mahjong online. Traditional Mahjong is a four-player game with very different rules.</p>""",
    faq=[("Is every Mahjong game winnable?", "Yes. Every deal is generated so it can be fully cleared. If you get stuck it's because of the order you picked, so try Undo or Shuffle."),
         ("What is a free tile?", "A tile with nothing on top of it and an open side on its left or right. Free tiles are bright, and blocked tiles are darker."),
         ("Do flowers and seasons match?", "Any flower matches any other flower, and any season matches any other season, even though the pictures are different."),
         ("Can I play Mahjong on my phone?", "Yes. Just tap the tiles. Turning your phone sideways gives you bigger tiles.")])

G["checkers"] = dict(
    emoji="🔴", color="#c0392b", name="Checkers", short="Beat the computer or a friend",
    title="Checkers – Play Free Checkers Online vs Computer or 2 Player",
    desc="Play free checkers online against the computer (easy, medium or hard) or with a friend on the same device. Official rules with forced jumps, multi-jumps and kings.",
    h1="Checkers", sub="Play against the computer or a friend. Jump your opponent's pieces and get kings to win.",
    js="checkers.js",
    game=f'''<div class="bar">{pills(("red","Red","12"),("black","Black","12"),("wins","Wins","0"),("losses","Losses","0"))}<div class="grow"></div>{seg("mode",[("cpu","vs Computer"),("pvp","2 Players")],"Mode")}{seg("level",[("easy","Easy"),("medium","Medium"),("hard","Hard")],"Difficulty")}<button class="btn" id="undo">↶ Undo</button><button class="btn primary" id="new">New game</button></div>
<p class="ckstatus" id="turn">Your turn (red)</p>
<div class="stage"><div class="ck" id="ck"></div>{OV}</div>
<p class="hint">Click a piece, then click where to move it · Esc to cancel · Ctrl+Z to undo</p>''',
    content="""<h2>How to play Checkers</h2><p>Each player starts with 12 pieces on the dark squares. You play <b>red</b> and move first. Pieces move <b>diagonally forward</b> one square at a time.</p>
<ul><li><b>Jumping:</b> if an opponent's piece is diagonally next to yours with an empty square behind it, jump over it to capture it.</li><li><b>Jumps are required:</b> if you can jump, you must. If you can keep jumping after landing, you must keep going (a multi-jump).</li><li><b>Kings:</b> reach the far side of the board and your piece becomes a king ♛. Kings can move and jump backward too.</li><li><b>Winning:</b> capture all your opponent's pieces, or leave them with no legal moves.</li></ul>
<h2>Checkers strategy</h2><ol><li><b>Control the center.</b> Pieces in the middle have more options and are harder to trap.</li><li><b>Keep your back row</b> filled as long as you can. It stops your opponent from getting kings.</li><li><b>Move in groups.</b> Pieces that back each other up can't be jumped easily.</li><li><b>Use forced jumps.</b> Because jumping is required, you can offer one piece to set up a double jump of your own.</li><li><b>Trade when ahead.</b> If you have more pieces, even trades bring you closer to winning.</li></ol>""",
    faq=[("Do I have to jump in checkers?", "Yes. Under official American checkers rules, if a jump is available you must take it, and you must finish every jump in a multi-jump."),
         ("How hard is the computer?", "Easy makes mistakes on purpose, Medium thinks a few moves ahead, and Hard looks six moves deep, so it's a real challenge."),
         ("Can two people play on one device?", "Yes. Pick 2 Players and take turns on the same phone, tablet or computer."),
         ("Can a regular piece move backward?", "No. Only kings can move backward. Regular pieces move and jump forward only.")])

TOAST = '<div class="toast hidden" id="toast"></div>'
G["spider-solitaire"] = dict(
    emoji="🕷️", color="#3d4fc9", name="Spider Solitaire", short="1, 2 or 4 suits, the classic two-deck game",
    title="Spider Solitaire – Play Free Spider Solitaire Online (1, 2 & 4 Suits)",
    desc="Play Spider Solitaire free online with 1, 2 or 4 suits. Drag or tap to move, unlimited undo, hints and best times. No download, works on phone and computer.",
    h1="Spider Solitaire", sub="Build full runs from King down to Ace in the same suit to clear them off the table.",
    js="spider.js",
    game=f'''<div class="bar">{pills(("time","Time","0:00"),("moves","Moves","0"),("score","Score","500"),("deals","Deals left","5"),("best","Best","—"))}<div class="grow"></div>{seg("suits",[("1","1 Suit"),("2","2 Suits"),("4","4 Suits")],"Suits")}<button class="btn" id="hint">💡 Hint</button><button class="btn" id="dealbtn">🂠 Deal</button><button class="btn" id="undo">↶ Undo</button><button class="btn primary" id="new">New game</button></div>
<div class="stage"><div id="sp"></div>{OV}</div>{TOAST}
<p class="hint">Tap a card to auto-move it, or drag it · Tap the stock (bottom right) to deal a new row · H for hint, D to deal</p>''',
    content="""<h2>How to play Spider Solitaire</h2><p>Spider is played with two decks (104 cards) dealt into 10 columns. Your goal is to build complete runs from <b>King down to Ace in the same suit</b>. When a full run is made, it's removed from the table. Clear all 8 runs to win.</p>
<ul><li><b>Moving cards:</b> any card can go on a card one rank higher, of any suit. For example, a 7 can go on any 8.</li><li><b>Moving groups:</b> you can only move several cards together if they're in order <b>and the same suit</b>.</li><li><b>Empty columns:</b> any card or same-suit run can go in an empty column.</li><li><b>Dealing:</b> tap the stock in the bottom right to deal one new card onto every column. Every column must have at least one card first.</li></ul>
<h2>1 suit, 2 suits or 4 suits?</h2><p><b>1 Suit</b> uses only spades and is the best place to start. Most games can be won. <b>2 Suits</b> adds hearts and is much more challenging. <b>4 Suits</b> is expert level, where only a small share of games are won.</p>
<h2>Spider Solitaire tips</h2><ol><li><b>Empty a column</b> as early as you can. It's the most powerful tool in the game.</li><li><b>Build in the same suit</b> whenever you have a choice. Mixed-suit stacks are hard to move later.</li><li><b>Uncover face-down cards</b> before dealing from the stock.</li><li><b>Before dealing</b>, make as many moves as possible, since a new row covers everything.</li><li>Use <b>Undo</b> and <b>Hint</b> freely while you learn.</li></ol>""",
    faq=[("Is Spider Solitaire free here?", "Yes. It's completely free with no download or sign-up, and it works on phones, tablets and computers."),
         ("How is Spider Solitaire scored?", "You start with 500 points. Each move costs 1 point, and each completed King-to-Ace run earns 100 points."),
         ("Why can't I deal new cards?", "In Spider Solitaire, every column must have at least one card before you can deal a new row. Move a card into any empty column first."),
         ("Which version is easiest?", "1 Suit is the easiest and most relaxing. 2 Suits is a good next step, and 4 Suits is for experts.")])

G["freecell"] = dict(
    emoji="🂡", color="#2a7fbf", name="FreeCell", short="Every card face up, pure strategy",
    title="FreeCell – Play Free FreeCell Solitaire Online",
    desc="Play FreeCell Solitaire free online. All cards face up, four free cells, smart auto-move to the foundations, unlimited undo and best times. No download needed.",
    h1="FreeCell", sub="All 52 cards are face up. Use the four free cells to sort every card onto the foundations.",
    js="freecell.js",
    game=f'''<div class="bar">{pills(("time","Time","0:00"),("moves","Moves","0"),("best","Best","—"),("gno","Game","#"))}<div class="grow"></div><button class="btn" id="restart">⟲ Restart</button><button class="btn" id="undo">↶ Undo</button><button class="btn primary" id="new">New game</button></div>
<div class="stage"><div id="fc"></div>{OV}</div>{TOAST}
<p class="hint">Tap a card to auto-move it, or drag it · Top left: 4 free cells · Top right: foundations</p>''',
    content="""<h2>How to play FreeCell</h2><p>All 52 cards are dealt face up into 8 columns. The goal is to move every card onto the four <b>foundations</b> (top right), one per suit, from Ace up to King.</p>
<ul><li><b>Tableau:</b> build columns down in alternating colors, like a black 6 on a red 7.</li><li><b>Free cells:</b> the four spaces in the top left can each hold one card for later.</li><li><b>Empty columns:</b> any card can go in an empty column.</li><li><b>Moving groups:</b> you can move a run of cards at once if you have enough free cells and empty columns to do it one card at a time. The game does that math for you.</li></ul>
<h2>FreeCell strategy</h2><ol><li><b>Free the Aces and 2s</b> first. Cards that are safe to send home are moved automatically.</li><li><b>Keep free cells open.</b> Each empty cell doubles how many cards you can move at once with an empty column.</li><li><b>Empty columns are gold.</b> An empty column is worth more than a free cell.</li><li><b>Plan a few moves ahead.</b> Since every card is visible, almost every deal can be solved with careful play.</li></ol>""",
    faq=[("Can every FreeCell game be won?", "Almost. Over 99.99% of FreeCell deals can be solved. If you get stuck, use Undo or Restart to try a different plan."),
         ("How many cards can I move at once?", "With F empty free cells and E empty columns, you can move (F + 1) × 2^E cards at once. Moving into an empty column counts one fewer empty column."),
         ("Why do some cards move by themselves?", "When a card is safe to send to its foundation and can't be needed in the tableau anymore, it moves there automatically to save you time."),
         ("What's the difference between FreeCell and Solitaire?", "In classic Klondike Solitaire many cards start face down. In FreeCell every card is face up from the start, so it's a game of skill and planning rather than luck.")])

G["pyramid-solitaire"] = dict(
    emoji="🔺", color="#d9822b", name="Pyramid Solitaire", short="Pair cards that add up to 13",
    title="Pyramid Solitaire – Play Free Pyramid Solitaire Online",
    desc="Play Pyramid Solitaire free online. Remove pairs of cards that add up to 13 to clear the pyramid. Undo, score, win streaks and 3 passes through the deck.",
    h1="Pyramid Solitaire", sub="Remove pairs that add up to 13. Kings go on their own. Clear the whole pyramid to win.",
    js="pyramid.js",
    game=f'''<div class="bar">{pills(("left","Pyramid","28"),("score","Score","0"),("passes","Recycles","2"),("time","Time","0:00"),("streak","Streak","0"))}<div class="grow"></div><button class="btn" id="undo">↶ Undo</button><button class="btn primary" id="new">New game</button></div>
<div class="stage"><div id="py"></div>{OV}</div>
<p class="hint">Click two cards that add up to 13 · Kings remove on their own · Click the deck (or press Space) to draw</p>''',
    content="""<h2>How to play Pyramid Solitaire</h2><p>28 cards are dealt in a pyramid of 7 rows. Remove cards in <b>pairs that add up to 13</b>. Clear the entire pyramid to win.</p>
<ul><li><b>Card values:</b> Ace = 1, number cards are their number, Jack = 11, Queen = 12, King = 13.</li><li><b>Pairs that make 13:</b> A+Q, 2+J, 3+10, 4+9, 5+8 and 6+7. A <b>King</b> is 13 by itself, so it's removed alone.</li><li><b>Free cards:</b> you can only use cards that aren't covered by a card in the row below.</li><li><b>The deck:</b> click the deck to flip a card onto the waste pile. The top waste card can pair with a free pyramid card. You can recycle the deck twice.</li></ul>
<h2>Pyramid tips</h2><ol><li><b>Work from the bottom up</b> and try to uncover cards evenly on both sides.</li><li><b>Don't rush pairs</b> with the waste pile if a pyramid card could use that match.</li><li><b>Count the cards.</b> There are four of each rank, so if all four 6s are buried, plan how to reach them.</li></ol>""",
    faq=[("What adds up to 13 in Pyramid Solitaire?", "Ace + Queen, 2 + Jack, 3 + 10, 4 + 9, 5 + 8 and 6 + 7. Kings are worth 13 on their own."),
         ("How many times can I go through the deck?", "Three times in total: your first pass plus two recycles."),
         ("Is Pyramid Solitaire hard?", "Yes. It depends a lot on the deal, and only a small share of games can be fully cleared, so a win streak is something to be proud of."),
         ("Can I undo a move?", "Yes. Use Undo, or press Ctrl+Z on a computer.")])

G["chess"] = dict(
    emoji="♟️", color="#5b6bb5", name="Chess", short="Play the computer or a friend",
    title="Chess – Play Free Chess Online vs Computer or 2 Player",
    desc="Play free chess online against the computer (easy, medium or hard) or a friend on the same device. Full rules: castling, en passant, promotion, check and checkmate.",
    h1="Chess", sub="Play White against the computer, or play a friend on the same device.",
    js="chess.js",
    game=f'''<div class="bar">{pills(("wins","Wins","0"),("losses","Losses","0"))}<div class="grow"></div>{seg("mode",[("cpu","vs Computer"),("pvp","2 Players")],"Mode")}{seg("level",[("easy","Easy"),("medium","Medium"),("hard","Hard")],"Difficulty")}<button class="btn" id="undo">↶ Undo</button><button class="btn primary" id="new">New game</button></div>
<p class="ckstatus" id="turn">Your move (White)</p>
<div class="stage"><div class="chesswrap"><div class="capline" id="capb"></div><div class="chess" id="chess"></div><div class="capline" id="capw"></div><div id="promo" class="hidden"></div></div>{OV}</div>
<p class="hint">Click a piece, then click a highlighted square · Esc to cancel · Ctrl+Z to undo</p>''',
    content="""<h2>How to play chess</h2><p>Each player starts with 16 pieces. The goal is to <b>checkmate</b> the other king, which means attacking it so it has no way to escape.</p>
<ul><li><b>King:</b> one square in any direction.</li><li><b>Queen:</b> any number of squares in a straight line or diagonal.</li><li><b>Rook:</b> any number of squares in a straight line.</li><li><b>Bishop:</b> any number of squares diagonally.</li><li><b>Knight:</b> moves in an L shape and can jump over pieces.</li><li><b>Pawn:</b> moves forward one square (or two on its first move) and captures diagonally. Reach the last row to <b>promote</b> it to a queen, rook, bishop or knight.</li></ul>
<h2>Special moves</h2><ul><li><b>Castling:</b> move the king two squares toward a rook, and the rook jumps to the other side. Neither piece can have moved, and the king can't be in or pass through check.</li><li><b>En passant:</b> if a pawn moves two squares and lands beside your pawn, you can capture it as if it had moved one square, but only on the very next move.</li></ul>
<h2>Chess tips for beginners</h2><ol><li><b>Control the center</b> with your pawns and pieces early.</li><li><b>Develop knights and bishops</b> before moving the same piece twice.</li><li><b>Castle early</b> to keep your king safe.</li><li><b>Before every move</b>, check what your opponent is threatening.</li><li><b>Don't give away pieces.</b> Make sure every piece you move is protected.</li></ol>""",
    faq=[("How strong is the computer?", "Easy makes plenty of mistakes and is great for learning. Medium plays solid, sensible moves. Hard looks several moves ahead and punishes blunders."),
         ("Can I play chess with a friend?", "Yes. Choose 2 Players and take turns on the same device."),
         ("When is a chess game a draw?", "When the player to move has no legal moves but isn't in check (stalemate), when the same position happens three times, after 50 moves each with no capture or pawn move, or when neither side has enough pieces left to checkmate."),
         ("Can I take back a move?", "Yes. Press Undo or Ctrl+Z. Against the computer, it takes back both your move and the computer's reply.")])

G["tic-tac-toe"] = dict(
    emoji="⭕", color="#e0457b", name="Tic Tac Toe", short="Get three in a row to win",
    title="Tic Tac Toe – Play Free Tic Tac Toe Online (vs Computer or 2 Player)",
    desc="Play Tic Tac Toe free online against the computer (easy, medium or unbeatable) or with a friend. Get three X's or O's in a row to win. Score keeps track of every game.",
    h1="Tic Tac Toe", sub="Get three in a row (across, down or diagonally) before your opponent does.",
    js="tictactoe.js",
    game=f'''<div class="bar"><div class="pill"><span id="lx">You (X)</span><b id="sx">0</b></div><div class="pill">Draws<b id="sd">0</b></div><div class="pill"><span id="lo">Computer (O)</span><b id="so">0</b></div><div class="grow"></div>{seg("mode",[("cpu","vs Computer"),("pvp","2 Players")],"Mode")}{seg("level",[("easy","Easy"),("medium","Medium"),("hard","Unbeatable")],"Difficulty")}<button class="btn" id="reset">Reset score</button></div>
<p class="ckstatus" id="turn">Your turn (X)</p>
<div class="stage" style="flex-direction:column;align-items:center;gap:14px"><div class="ttt" id="ttt"></div><button class="btn primary hidden" id="again">Play again</button></div>
<p class="hint">Click a square · On a keyboard, use the number pad (1–9)</p>''',
    content="""<h2>How to play Tic Tac Toe</h2><p>Two players take turns placing an <b>X</b> or an <b>O</b> on a 3×3 grid. The first player to get <b>three of their marks in a row</b>, across, down or diagonally, wins. If all nine squares fill up with no winner, the game is a draw.</p>
<h2>How to win at Tic Tac Toe</h2><ol><li><b>Start in a corner.</b> It gives your opponent the most ways to go wrong.</li><li><b>If they start in a corner, take the center.</b> It's the safest reply.</li><li><b>Make a fork.</b> Set up two ways to win at once so your opponent can only block one.</li><li><b>Always block</b> when your opponent has two in a row.</li></ol>
<h2>Can you beat the computer?</h2><p>On <b>Unbeatable</b>, the computer plays perfectly, so the best you can do is a draw. Try <b>Easy</b> or <b>Medium</b> to practice your forks. Players take turns going first after every game.</p>""",
    faq=[("Can you always win Tic Tac Toe?", "No. If both players play perfectly, Tic Tac Toe always ends in a draw. You can only win if your opponent makes a mistake."),
         ("Is the Unbeatable computer really unbeatable?", "Yes. It checks every possible move, so it never loses. The best you can get against it is a draw."),
         ("Can two people play?", "Yes. Choose 2 Players and take turns on the same device."),
         ("Who goes first?", "X goes first in the first game, and then the starting player switches after every game to keep it fair.")])

G["word-search"] = dict(
    emoji="🔤", color="#16a3a3", name="Word Search", short="Find hidden words in fun themes",
    title="Word Search – Play Free Word Search Puzzles Online",
    desc="Play free word search puzzles online. Pick a theme like animals, food or sports, choose easy to hard, and drag to find every hidden word. New puzzle every time.",
    h1="Word Search", sub="Find every hidden word in the grid. Drag across the letters to circle a word.",
    js="wordsearch.js",
    game=f'''<div class="bar">{pills(("count","Found","0/0"),("time","Time","0:00"),("best","Best","—"))}<div class="grow"></div><select class="sel" id="theme" aria-label="Theme"></select>{seg("level",[("easy","Easy"),("medium","Medium"),("hard","Hard")],"Difficulty")}<button class="btn" id="hint">💡 Hint</button><button class="btn primary" id="new">New puzzle</button></div>
<div class="stage" style="display:block"><div class="wslayout"><div class="ws" id="ws"></div><div class="wsside"><b>Theme: <span id="themename"></span></b><ul id="words"></ul></div></div>{OV}</div>
<p class="hint">Press on the first letter and drag to the last letter of a word</p>''',
    content="""<h2>How to play Word Search</h2><p>Words from the list are hidden in the grid of letters. Find each one and drag from its first letter to its last letter. Found words get colored in and crossed off the list. Find them all to win!</p>
<h2>Difficulty levels</h2><ul><li><b>Easy:</b> 10×10 grid, 8 words, only across and down.</li><li><b>Medium:</b> 12×12 grid, 10 words, adds diagonals.</li><li><b>Hard:</b> 14×14 grid, 13 words, words can go in any direction, including backwards.</li></ul>
<h2>Word search tips</h2><ol><li><b>Look for rare letters</b> like Q, Z, X, J and K. They're quick to spot.</li><li><b>Scan for the first two letters</b> of a word together, not just the first one.</li><li><b>Go row by row</b> when you're stuck, then column by column.</li><li><b>Search for double letters</b> like the "LL" in GORILLA or "OO" in BALLOON.</li></ol>
<h2>Themes</h2><p>Choose from Animals, Food, Sports, Space, Ocean, Weather, Jobs, Colors, Holidays and Music, or let the game pick a random theme. Every puzzle is new.</p>""",
    faq=[("Are the word search puzzles free?", "Yes. They're unlimited and free, and every puzzle is generated fresh."),
         ("Can words go backwards?", "Only on Hard. Easy has words across and down, and Medium adds diagonals."),
         ("Does word search work on phones?", "Yes. Press on the first letter of a word and slide your finger to the last letter."),
         ("Is word search good for kids?", "Yes. Word searches build spelling, vocabulary and focus. Easy mode is great for younger players.")])

G["hangman"] = dict(
    emoji="🪢", color="#8a5cf6", name="Hangman", short="Guess the word one letter at a time",
    title="Hangman – Play Free Hangman Game Online",
    desc="Play the classic Hangman word game free online. Pick a category, guess letters with your keyboard or on screen, and build your win streak. Hundreds of words.",
    h1="Hangman", sub="Guess the hidden word one letter at a time. You can make 6 wrong guesses.",
    js="hangman.js",
    game=f'''<div class="bar">{pills(("lives","Guesses left","6"),("streak","Streak","0"),("beststreak","Best streak","0"))}<div class="grow"></div><select class="sel" id="catsel" aria-label="Category"></select><button class="btn" id="hint">💡 Hint</button><button class="btn primary" id="new">New word</button></div>
<div class="stage" style="display:block" id="hm"><p class="ckstatus">Category: <span id="cat"></span></p>
<div class="hm"><svg viewBox="0 0 200 220"><line class="base" x1="20" y1="210" x2="140" y2="210"/><line class="base" x1="50" y1="210" x2="50" y2="20"/><line class="base" x1="50" y1="20" x2="130" y2="20"/><line class="base" x1="130" y1="20" x2="130" y2="45"/>
<circle class="part" cx="130" cy="65" r="20"/><line class="part" x1="130" y1="85" x2="130" y2="140"/><line class="part" x1="130" y1="100" x2="105" y2="122"/><line class="part" x1="130" y1="100" x2="155" y2="122"/><line class="part" x1="130" y1="140" x2="110" y2="178"/><line class="part" x1="130" y1="140" x2="150" y2="178"/></svg>
<div style="flex:1;min-width:260px"><div class="hmword" id="word"></div><p class="hmmsg" id="msg"></p><div style="text-align:center"><button class="btn primary hidden" id="again">Next word ➜</button></div></div></div>
<div id="keys"></div></div>
<p class="hint">Type letters on your keyboard or tap them on screen · Press Enter for the next word</p>''',
    content="""<h2>How to play Hangman</h2><p>A secret word is hidden behind blank spaces, one for each letter. Guess one letter at a time. If the letter is in the word, it appears in every spot it belongs. If it isn't, another part of the figure is drawn. Guess the whole word before the figure is complete, which takes <b>6 wrong guesses</b>.</p>
<h2>Hangman tips</h2><ol><li><b>Start with vowels:</b> E, A, O and I appear in almost every word.</li><li><b>Then try common consonants:</b> R, S, T, L and N.</li><li><b>Use the category</b> to narrow it down. A country or an animal is much easier to guess when you know which it is.</li><li><b>Look at the word's shape:</b> double letters and endings like -ING or -TION are big clues.</li><li><b>Hints</b> reveal a letter but cost one guess, so save them for when you're stuck.</li></ol>
<h2>Categories</h2><p>Pick from Animals, Food, Countries, Sports, Movies, Nature, Jobs and Things, or play with a random category each round.</p>""",
    faq=[("How many wrong guesses do I get?", "Six. Each wrong letter adds one part to the figure: head, body, two arms and two legs."),
         ("Can I type my guesses?", "Yes. On a computer, just type letters on your keyboard. On a phone, tap the letters on screen."),
         ("What is a win streak?", "Your streak counts how many words in a row you've guessed correctly. It resets when you miss one, and your best streak is saved."),
         ("Is Hangman good for learning?", "Yes. It's a fun way to practice spelling and vocabulary for kids and adults.")])

DAILYBAR = '<p class="dailybar">📅 <span id="dailydate"></span> · 🔥 Daily streak: <b id="dailystreak">0</b></p>'
V = {}
V["daily-sudoku"] = dict(base="sudoku", daily=True, cfg={"daily": True}, emoji="📅", name="Daily Sudoku", short="One new Sudoku every day",
    title="Daily Sudoku – Free New Sudoku Puzzle Every Day",
    desc="Play today's free daily Sudoku. A brand-new puzzle every day, the same for everyone. Keep your daily streak going with notes, hints and a timer.",
    h1="Daily Sudoku", sub="A new puzzle every day at midnight. Solve it to keep your streak alive.",
    content="""<h2>Today's Sudoku puzzle</h2><p>Every day there's one new <b>Daily Sudoku</b>, and everyone who plays today gets the exact same puzzle. That makes it perfect for comparing times with friends and family. A new puzzle unlocks at midnight your local time.</p>
<p>The daily puzzle is <b>Medium</b> difficulty: challenging enough to make you think, but always solvable with logic, no guessing needed.</p>
<h2>Build a daily streak</h2><p>Solve the puzzle every day to grow your 🔥 streak. Miss a day and it starts over. Your streak and finish times are saved on your device.</p>
<h2>Want more?</h2><p>Finished today's puzzle? Play unlimited puzzles on our main <a href="sudoku">Sudoku</a> page, or jump straight to <a href="easy-sudoku">Easy</a>, <a href="hard-sudoku">Hard</a> or <a href="expert-sudoku">Expert Sudoku</a>.</p>""",
    faq=[("When does the daily Sudoku change?", "A new puzzle unlocks every day at midnight in your own time zone."),
         ("Does everyone get the same puzzle?", "Yes. Everyone playing on the same date gets the same Daily Sudoku, so you can compare times."),
         ("How does the daily streak work?", "Each day you solve the daily puzzle adds one to your streak. If you skip a day, it resets to zero.")])
V["daily-word-search"] = dict(base="word-search", daily=True, cfg={"daily": True}, emoji="📅", name="Daily Word Search", short="A fresh word search every day",
    title="Daily Word Search – Free New Word Search Puzzle Every Day",
    desc="Play today's free daily word search. A new themed puzzle every day, the same for everyone. Find all the words and keep your daily streak going.",
    h1="Daily Word Search", sub="A new themed word search every day. Find all the words to keep your streak going.",
    content="""<h2>Today's word search</h2><p>Every day there's a brand-new <b>Daily Word Search</b> with a surprise theme. Everyone who plays today gets the same puzzle, so you can race friends and family for the fastest time. It resets at midnight your local time.</p>
<p>The daily puzzle has 10 hidden words on a 12×12 grid. Words run across, down and diagonally.</p>
<h2>Keep your streak alive</h2><p>Find every word each day to build your 🔥 daily streak. Your streak and times are saved right in your browser.</p>
<h2>Play more word games</h2><p>Want another puzzle? Play unlimited puzzles on our <a href="word-search">Word Search</a> page, or try <a href="hangman">Hangman</a>.</p>""",
    faq=[("How often is there a new daily word search?", "Every day. A new puzzle with a new theme unlocks at midnight in your time zone."),
         ("Can I replay today's puzzle?", "Yes. You can play it again as many times as you want, and your streak still counts once per day."),
         ("Is the daily word search free?", "Yes. It's completely free with no sign-up.")])
V["daily-solitaire"] = dict(base="solitaire", daily=True, cfg={"daily": True}, emoji="📅", name="Daily Solitaire", short="Today's deal, the same for everyone",
    title="Daily Solitaire – Play Today's Free Solitaire Deal",
    desc="Play today's Daily Solitaire. Everyone gets the same Klondike deal each day, so you can compare times. Draw 1, undo, auto-finish and a daily win streak.",
    h1="Daily Solitaire", sub="Everyone gets the same deal today. Can you beat it?",
    content="""<h2>Today's Solitaire deal</h2><p><b>Daily Solitaire</b> gives everyone the exact same Klondike deal each day, so you can compare times and moves with friends. A new deal arrives at midnight your local time.</p>
<p>The daily game uses <b>Draw 1</b> rules: flip one card at a time from the stock, and recycle the deck as many times as you need. Most deals can be won with careful play, but not every one, so if today's is tough, use Undo to try another plan.</p>
<h2>Win streaks</h2><p>Win the daily deal to add to your 🔥 streak. Skip a day and the streak resets.</p>
<h2>Keep playing</h2><p>Play unlimited deals on the main <a href="solitaire">Solitaire</a> page, try the harder <a href="solitaire-turn-3">Solitaire Turn 3</a>, or switch it up with <a href="spider-solitaire">Spider Solitaire</a> and <a href="freecell">FreeCell</a>.</p>""",
    faq=[("Is the Daily Solitaire the same for everyone?", "Yes. Everyone playing on the same date gets the same deal."),
         ("Can every daily deal be won?", "Not always. About 4 out of 5 Draw 1 deals can be won, so some days are harder than others."),
         ("When is the next daily deal?", "A new deal starts at midnight in your time zone.")])

V["spider-solitaire-1-suit"] = dict(base="spider-solitaire", cfg={"suits": 1}, emoji="🕷️", name="Spider Solitaire 1 Suit", short="The easiest Spider, spades only",
    title="Spider Solitaire 1 Suit – Play Free Online (Easy Spider)",
    desc="Play Spider Solitaire with 1 suit free online. All spades, so it's the easiest and most relaxing way to play Spider. Undo, hints and best times included.",
    h1="Spider Solitaire 1 Suit", sub="The easiest version of Spider. Every card is a spade, so any run can move together.",
    content="""<h2>What is 1 suit Spider Solitaire?</h2><p>In <b>1 suit Spider</b>, all 104 cards are spades. Since every card is the same suit, any run of cards in order can be moved as a group. That makes it the friendliest version of Spider and the best place for beginners to learn.</p>
<h2>How to win at 1 suit Spider</h2><ol><li><b>Turn over face-down cards</b> as fast as you can. They're what hold you back.</li><li><b>Empty a column early.</b> An empty column lets you rearrange long runs.</li><li><b>Make all your moves before dealing.</b> A new row covers every column.</li><li><b>Build long runs</b> from King down. Each full King-to-Ace run clears itself off the table.</li></ol>
<p>Most 1 suit games can be won. Once you're winning regularly, step up to <a href="spider-solitaire-2-suits">Spider Solitaire 2 Suits</a>.</p>""",
    faq=[("Is 1 suit Spider Solitaire easy?", "It's the easiest version of Spider. With careful play, most games can be won."),
         ("How many cards are in 1 suit Spider?", "104 cards, all spades: eight complete sets of Ace to King."),
         ("What should I play after 1 suit?", "Try 2 suits next. It adds hearts and makes planning much more important.")])
V["spider-solitaire-2-suits"] = dict(base="spider-solitaire", cfg={"suits": 2}, emoji="🕷️", name="Spider Solitaire 2 Suits", short="Spades and hearts, a real challenge",
    title="Spider Solitaire 2 Suits – Play Free Online",
    desc="Play Spider Solitaire with 2 suits free online. Spades and hearts make it a real challenge. Drag or tap to move, unlimited undo, hints and best times.",
    h1="Spider Solitaire 2 Suits", sub="Spades and hearts. Only same-suit runs move together, so plan ahead.",
    content="""<h2>What is 2 suit Spider Solitaire?</h2><p><b>2 suit Spider</b> uses spades and hearts. You can still place any card on one rank higher, but you can only move a <b>group</b> of cards if they're all the same suit. That one rule makes it far trickier than 1 suit.</p>
<h2>2 suit Spider strategy</h2><ol><li><b>Prefer same-suit moves.</b> When you have a choice, put a spade on a spade and a heart on a heart.</li><li><b>Mixed runs are traps.</b> A red 7 on a black 8 is fine short-term, but that stack can't move as a group later.</li><li><b>Guard your empty columns.</b> Use them to untangle mixed runs, then free them up again.</li><li><b>Use Undo to explore.</b> In 2 suit, trying a different order often turns a loss into a win.</li></ol>
<p>Want something easier? Try <a href="spider-solitaire-1-suit">1 suit Spider</a>. Ready for the ultimate test? Play <a href="spider-solitaire-4-suits">4 suit Spider</a>.</p>""",
    faq=[("Is 2 suit Spider hard?", "It's a big step up from 1 suit. Many experienced players win a solid share of games, but it takes planning."),
         ("What suits are used in 2 suit Spider?", "Spades and hearts, with four of each set of Ace to King."),
         ("Can I move a mixed-suit run?", "Not as a group. You can only move several cards together when they're in order and the same suit.")])
V["spider-solitaire-4-suits"] = dict(base="spider-solitaire", cfg={"suits": 4}, emoji="🕷️", name="Spider Solitaire 4 Suits", short="Expert Spider with all four suits",
    title="Spider Solitaire 4 Suits – Play Free Online (Expert)",
    desc="Play 4 suit Spider Solitaire free online, the hardest version of Spider. All four suits, unlimited undo and hints. Can you beat it?",
    h1="Spider Solitaire 4 Suits", sub="The expert version. Spades, hearts, diamonds and clubs make every move count.",
    content="""<h2>The hardest Spider Solitaire</h2><p><b>4 suit Spider</b> uses all four suits, two decks' worth. Just like other versions, you can place a card on any card one rank higher, but only same-suit runs move as a group, and with four suits those runs are hard to build. Only a small share of games are won, which makes each victory special.</p>
<h2>Tips for 4 suit Spider</h2><ol><li><b>Be patient.</b> Look at every option before each move.</li><li><b>Never waste an empty column.</b> It's your most valuable tool for sorting suits.</li><li><b>Avoid burying low cards</b> under mixed-suit stacks.</li><li><b>Use Undo heavily.</b> Even experts rewind a lot in 4 suit Spider.</li></ol>
<p>Need a warm-up? Start with <a href="spider-solitaire-1-suit">1 suit</a> or <a href="spider-solitaire-2-suits">2 suit Spider</a>.</p>""",
    faq=[("Can 4 suit Spider Solitaire be won?", "Yes, but it's very hard. Without undo, only a small share of games are won, even by skilled players."),
         ("What's the best strategy for 4 suits?", "Keep columns empty when you can, build same-suit runs whenever possible, and plan several moves ahead."),
         ("Is 4 suit Spider the same as regular Spider?", "Yes. The original Spider Solitaire uses all four suits. The 1 and 2 suit versions are easier variations.")])
V["solitaire-turn-3"] = dict(base="solitaire", cfg={"draw": 3}, emoji="🃏", name="Solitaire Turn 3", short="Classic Klondike, three cards at a time",
    title="Solitaire Turn 3 – Play Free Draw 3 Klondike Solitaire Online",
    desc="Play Solitaire Turn 3 (Draw 3 Klondike) free online. Flip three cards at a time for the classic, harder version. Undo, auto-finish and best times.",
    h1="Solitaire Turn 3", sub="Classic Klondike, flipping three cards at a time. Only the top card can be played.",
    content="""<h2>What is Turn 3 Solitaire?</h2><p>In <b>Turn 3</b> (also called Draw 3), you flip three cards from the stock at once, but you can only play the top one. That means the cards underneath stay locked until you use the top card, so you have to plan your deck order. It's the traditional way Klondike was played and much harder than <a href="solitaire">Turn 1</a>.</p>
<h2>Turn 3 strategy</h2><ol><li><b>Count through the deck.</b> Notice which cards show up each pass, since the order changes as you play cards from it.</li><li><b>Play a waste card to shift the deck.</b> Using one card changes which cards appear next time through.</li><li><b>Focus on the tableau first.</b> Uncovering face-down cards is usually worth more than playing from the deck.</li><li><b>Use Undo</b> to test a different line when you get stuck.</li></ol>""",
    faq=[("Is Turn 3 Solitaire harder than Turn 1?", "Yes. Because only every third card is playable, far fewer Turn 3 games can be won."),
         ("Can I switch back to Turn 1?", "Yes. Use the Draw 1 button above the game, or play on our main Solitaire page."),
         ("Why is it called Turn 3?", "Because you turn over three cards from the stock at a time instead of one.")])
V["easy-sudoku"] = dict(base="sudoku", cfg={"level": "easy"}, emoji="🧩", name="Easy Sudoku", short="Gentle puzzles for beginners",
    title="Easy Sudoku – Play Free Easy Sudoku Puzzles Online",
    desc="Play free easy Sudoku puzzles online, perfect for beginners. Unlimited new puzzles with about 40 starting numbers, notes, hints and mistake checking.",
    h1="Easy Sudoku", sub="Relaxing puzzles with plenty of starting numbers. Perfect for beginners.",
    content="""<h2>Easy Sudoku for beginners</h2><p>Our <b>easy Sudoku</b> puzzles start with about 40 numbers already filled in, so you can solve them using simple logic. Every puzzle has exactly one solution and never needs guessing.</p>
<h2>How to solve easy Sudoku</h2><ol><li><b>Find the missing number.</b> Look for a row, column or box with only one or two empty squares.</li><li><b>Scan one number at a time.</b> Pick a number like 1 and check which boxes still need it, then see where it can go.</li><li><b>Use the highlights.</b> Tap a number and every matching number lights up, so it's easy to see where it can't go.</li></ol>
<p>Getting fast? Move up to <a href="sudoku">Medium</a>, <a href="hard-sudoku">Hard</a> or try the <a href="daily-sudoku">Daily Sudoku</a>.</p>""",
    faq=[("How many numbers does an easy Sudoku start with?", "About 40 of the 81 squares are already filled in."),
         ("Are easy Sudoku puzzles good for kids?", "Yes. They're a great way for kids and beginners to learn Sudoku logic."),
         ("How long does an easy Sudoku take?", "Most people finish in 5 to 15 minutes. With practice, you can get under 5.")])
V["hard-sudoku"] = dict(base="sudoku", cfg={"level": "hard"}, emoji="🧩", name="Hard Sudoku", short="Tough puzzles that need real strategy",
    title="Hard Sudoku – Play Free Hard Sudoku Puzzles Online",
    desc="Play free hard Sudoku puzzles online. Unlimited challenging puzzles with about 27 starting numbers, notes, hints and a timer. Every puzzle has one solution.",
    h1="Hard Sudoku", sub="Fewer clues and trickier logic. Notes are your best friend here.",
    content="""<h2>Hard Sudoku puzzles</h2><p><b>Hard Sudoku</b> puzzles start with only about 27 numbers. You'll need more than simple scanning to solve them, but every puzzle still has exactly one solution and can be solved without guessing.</p>
<h2>Strategies for hard Sudoku</h2><ol><li><b>Turn on Notes.</b> Write every possible number in each empty square, then erase as you go.</li><li><b>Naked pairs:</b> if two squares in a row can only be the same two numbers, remove those numbers from the rest of the row.</li><li><b>Pointing pairs:</b> if a number in a box can only go in one row, it can't go anywhere else in that row outside the box.</li><li><b>Hidden singles:</b> a number that has only one possible spot in a row, column or box goes there, even if that square has other candidates.</li></ol>
<p>Want an even bigger challenge? Try <a href="expert-sudoku">Expert Sudoku</a>.</p>""",
    faq=[("What makes a Sudoku hard?", "Fewer starting numbers and the need for advanced techniques like pairs and pointing to make progress."),
         ("Do hard Sudoku puzzles need guessing?", "No. Every puzzle here has one solution that can be found with logic."),
         ("How long does a hard Sudoku take?", "Usually 20 to 45 minutes, though experienced solvers can be much faster.")])
V["expert-sudoku"] = dict(base="sudoku", cfg={"level": "expert"}, emoji="🧩", name="Expert Sudoku", short="The toughest puzzles we have",
    title="Expert Sudoku – Play Free Expert Sudoku Puzzles Online",
    desc="Play free expert Sudoku puzzles online. Our hardest puzzles, with only about 24 starting numbers. Notes, hints, undo and best times included.",
    h1="Expert Sudoku", sub="Our hardest Sudoku. Very few clues and no easy starts.",
    content="""<h2>Expert-level Sudoku</h2><p><b>Expert Sudoku</b> puzzles start with just about 24 numbers. That's close to the fewest clues a Sudoku can have and still have one solution (the minimum ever proven is 17). Expect to need notes and advanced techniques from the very first move.</p>
<h2>Expert techniques</h2><ol><li><b>Fill in all candidates</b> with Notes before you start.</li><li><b>X-Wing:</b> when a number can only go in the same two columns in two different rows, it can be removed from those columns everywhere else.</li><li><b>Hidden pairs and triples:</b> look for two or three numbers that can only fit in the same two or three squares of a unit.</li><li><b>Take breaks.</b> A fresh look often reveals a move you missed.</li></ol>
<p>Need a breather? Try <a href="hard-sudoku">Hard Sudoku</a> or the <a href="daily-sudoku">Daily Sudoku</a>.</p>""",
    faq=[("How hard is expert Sudoku?", "Very. Expert puzzles have very few clues and usually need advanced techniques like X-Wing and hidden pairs."),
         ("What's the fewest clues a Sudoku can have?", "17. It has been proven that no valid Sudoku with a single solution has fewer than 17 starting numbers."),
         ("Can I use hints?", "Yes. The Hint button reveals one correct number whenever you're stuck.")])
V["minesweeper-expert"] = dict(base="minesweeper", cfg={"level": "hard"}, emoji="💣", name="Expert Minesweeper", short="30×16 board with 99 mines",
    title="Expert Minesweeper – Play Free Minesweeper Expert Online (99 Mines)",
    desc="Play Expert Minesweeper free online: the classic 30×16 board with 99 mines. Safe first click, chording, flags and best times. Can you beat it?",
    h1="Expert Minesweeper", sub="The classic expert board: 30 columns, 16 rows and 99 mines.",
    content="""<h2>Expert Minesweeper</h2><p>The <b>Expert</b> board is the ultimate Minesweeper challenge: 480 squares hiding 99 mines. That's about one mine in every five squares, so you'll need every pattern you know and quick chording to post a good time.</p>
<h2>Tips for Expert</h2><ol><li><b>Learn the patterns.</b> 1-2-1 and 1-2-2-1 along a wall solve themselves once you know them.</li><li><b>Chord constantly.</b> Click a number with all its mines flagged to open every neighbor at once. It's the key to fast times.</li><li><b>Work the edges</b> of open areas instead of starting new spots.</li><li><b>Guess smart.</b> If you must guess, choose squares that would open the most information.</li></ol>
<p>Want to warm up first? Play <a href="minesweeper">Beginner or Intermediate</a>.</p>""",
    faq=[("How many mines are on Expert Minesweeper?", "99 mines on a 30×16 board of 480 squares."),
         ("What's a good Expert Minesweeper time?", "Under 5 minutes is great for most players. Top players finish in well under a minute."),
         ("Can I play Expert on a phone?", "Yes, but the board is wide, so you may need to scroll sideways. Turning your phone sideways helps.")])
V["chess-2-player"] = dict(base="chess", cfg={"mode": "pvp"}, emoji="♟️", name="Chess 2 Player", short="Play a friend on one device",
    title="Chess 2 Player – Play Free Two Player Chess Online",
    desc="Play 2 player chess online for free with a friend on the same device. Full chess rules with castling, en passant, promotion and check. No sign-up needed.",
    h1="2 Player Chess", sub="Play a friend on the same phone, tablet or computer. White moves first.",
    content="""<h2>Two player chess on one device</h2><p>Sit next to a friend and take turns. White moves first, then pass the device. The game handles every rule for you: legal moves are highlighted, check is shown, and the game spots checkmate, stalemate and draws automatically.</p>
<h2>Quick rules refresher</h2><ul><li>Click a piece to see where it can go, then click a highlighted square.</li><li><b>Castling:</b> click your king, then the square two spaces toward the rook.</li><li><b>Promotion:</b> when a pawn reaches the last row, choose a queen, rook, bishop or knight.</li><li><b>Undo</b> takes back the last move if someone slips.</li></ul>
<p>No one to play with? Challenge the <a href="chess">computer</a> on Easy, Medium or Hard.</p>""",
    faq=[("Can two people play chess on one computer?", "Yes. Take turns making moves on the same device. White always moves first."),
         ("Do I need an account to play 2 player chess?", "No. Just open the page and start playing."),
         ("Does it check for checkmate?", "Yes. The game detects check, checkmate, stalemate and other draws automatically.")])
V["checkers-2-player"] = dict(base="checkers", cfg={"mode": "pvp"}, emoji="🔴", name="Checkers 2 Player", short="Play a friend on one device",
    title="Checkers 2 Player – Play Free Two Player Checkers Online",
    desc="Play 2 player checkers online for free on the same device. Official rules with forced jumps, multi-jumps and kings. No download or sign-up needed.",
    h1="2 Player Checkers", sub="Take turns with a friend on the same device. Red moves first.",
    content="""<h2>Two player checkers</h2><p>Play a friend side by side on one phone, tablet or computer. Red moves first. Click a piece to see its legal moves, then click where to go. The game enforces official American checkers rules, so no arguments about forced jumps!</p>
<h2>Rules at a glance</h2><ul><li>Pieces move diagonally forward on the dark squares.</li><li>If you can jump, you <b>must</b> jump, and keep jumping if you can.</li><li>Reach the far row to become a <b>king</b>, which can move backward too.</li><li>Win by capturing every piece or leaving your opponent with no moves.</li></ul>
<p>Playing alone? Take on the <a href="checkers">computer</a> instead.</p>""",
    faq=[("Can two people play checkers on one device?", "Yes. Choose 2 Players and take turns on the same screen."),
         ("Who goes first in checkers?", "Red moves first."),
         ("Are jumps required?", "Yes. Under official rules, you must take a jump when one is available.")])
V["tic-tac-toe-2-player"] = dict(base="tic-tac-toe", cfg={"mode": "pvp"}, emoji="⭕", name="Tic Tac Toe 2 Player", short="X vs O with a friend",
    title="Tic Tac Toe 2 Player – Play Free Two Player Tic Tac Toe Online",
    desc="Play 2 player Tic Tac Toe online for free with a friend on the same device. Score keeps track of X wins, O wins and draws. Players take turns going first.",
    h1="2 Player Tic Tac Toe", sub="X versus O on the same device. First to three in a row wins.",
    content="""<h2>Tic Tac Toe with a friend</h2><p>Grab a friend and take turns tapping squares. X goes first in the first round, and the starting player switches every game so it stays fair. The scoreboard keeps track of X wins, O wins and draws.</p>
<h2>Tips to beat your friend</h2><ol><li><b>Take a corner</b> when you go first.</li><li><b>Set up a fork</b>, two ways to win at once.</li><li><b>Always block</b> two in a row.</li></ol>
<p>Want a challenge? Try to beat our <a href="tic-tac-toe">unbeatable computer</a>.</p>""",
    faq=[("How do you play Tic Tac Toe with 2 players?", "Take turns placing X and O on the same device. The first to get three in a row wins."),
         ("Who goes first?", "X starts the first game, then the first player switches every game."),
         ("Does it keep score?", "Yes. X wins, O wins and draws are tracked until you reset the score.")])
DAILY = ["daily-sudoku", "daily-word-search", "daily-solitaire"]

ORDER = ["solitaire", "spider-solitaire", "freecell", "pyramid-solitaire", "mahjong", "chess", "checkers", "snake-game", "minesweeper", "2048", "sudoku", "word-search", "hangman", "tic-tac-toe", "dinosaur-game"]
NAV = ["solitaire", "spider-solitaire", "mahjong", "chess", "snake-game", "sudoku", "minesweeper"]

ICON = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='%23ffcc33'/><stop offset='1' stop-color='%23ff5c8a'/></linearGradient></defs><rect width='100' height='100' rx='26' fill='url(%23g)'/><text x='50' y='70' font-size='56' text-anchor='middle'>🎮</text></svg>"
LOGO = '<a class="logo" href="./"><span class="mark">🎮</span><span>YourFree<em>OnlineGames</em></span></a>'

def page(slug, title, desc, body, faq=None, ld_extra=None, cur=None, cfg=None):
    url = DOMAIN + "/" + ("" if slug == "index" else slug)
    nav = "".join(f'<a href="{s}"{" class=on" if s == cur else ""}>{G[s]["emoji"]} {G[s]["name"]}</a>' for s in NAV) + '<a href="./#daily">📅 Daily</a><a href="./#games">🎮 All games</a>'
    ld = [{"@context": "https://schema.org", "@type": "WebSite", "name": SITE, "url": DOMAIN + "/", "publisher": {"@type": "Person", "name": AUTHOR}}]
    if ld_extra: ld.append(ld_extra)
    if faq: ld.append({"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faq]})
    foot = "".join(f'<a href="{s}">{G[s]["name"]}</a>' for s in ORDER)
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{url}">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:type" content="website">
<meta property="og:url" content="{url}">
<meta name="theme-color" content="#0d1022">
<link rel="icon" href="{ICON}">
<link rel="stylesheet" href="style.css">
<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>
</head>
<body>
<header class="top"><div class="wrap">{LOGO}<nav class="games" aria-label="Games">{nav}</nav></div></header>
<main class="wrap">{body}</main>
<footer><div class="wrap"><div><b>{SITE}</b><br>Free classic games, no download or sign-up.<br>Made by {AUTHOR} · © 2026</div><div>{foot}<br><a href="about">About</a><a href="privacy">Privacy</a></div></div></footer>
</body>
</html>"""

def card(s):
    g = G[s]
    return f'<a class="card" href="{s}" style="--c:{g["color"]}"><span class="play">▶ PLAY</span><div class="art">{g["emoji"]}</div><div class="txt"><h3>{g["name"]}</h3><p>{g["short"]}</p></div></a>'

def dcard(v):
    d = V[v]
    return f'<a class="card" href="{v}" style="--c:{G[d["base"]]["color"]}"><span class="play">NEW TODAY</span><div class="art">{G[d["base"]]["emoji"]}</div><div class="txt"><h3>{d["name"]}</h3><p>{d["short"]}</p></div></a>'
pages = {}
home = f'''<section class="hero"><h1>Play <span>Free Online Games</span></h1><p>The classics you love, ready to play instantly. No downloads, no sign-up and no limits. Works on your phone, tablet and computer.</p></section>
<h2 class="sectionh" id="daily">📅 Daily puzzles</h2><div class="cards daily">{"".join(dcard(v) for v in DAILY)}</div>
<h2 class="sectionh" id="games">🎮 All games</h2><div class="cards">{"".join(card(s) for s in ORDER)}</div>
<div class="content"><h2>Free games, right in your browser</h2><p>{SITE} brings together the most popular classic games in one fast, clean place. Every game loads in seconds, saves your best scores, and works just as well with a touchscreen as with a mouse and keyboard.</p>
<ul><li><b>Card games:</b> <a href="solitaire">Klondike Solitaire</a>, <a href="spider-solitaire">Spider Solitaire</a>, <a href="freecell">FreeCell</a> and <a href="pyramid-solitaire">Pyramid Solitaire</a>.</li><li><b>Tile games:</b> <a href="mahjong">Mahjong Solitaire</a>.</li><li><b>Board games:</b> <a href="chess">Chess</a>, <a href="checkers">Checkers</a> and <a href="tic-tac-toe">Tic Tac Toe</a>.</li><li><b>Word games:</b> <a href="word-search">Word Search</a> and <a href="hangman">Hangman</a>.</li><li><b>Puzzle games:</b> <a href="sudoku">Sudoku</a>, <a href="2048">2048</a> and <a href="minesweeper">Minesweeper</a>.</li><li><b>Arcade games:</b> the classic <a href="snake-game">Snake game</a> and the <a href="dinosaur-game">Dinosaur game</a>.</li></ul>
<h2>Popular ways to play</h2><div class="more">{"".join(f'<a href="{v}"><span>{V[v]["emoji"]}</span>{V[v]["name"]}</a>' for v in V if v not in DAILY)}</div>
<p>New games are added regularly, so check back soon.</p></div>'''
home_faq = [("Are these games really free?", "Yes. Every game is free to play with no download, no account and no time limits."),
            ("Do the games work on mobile?", "Yes. Every game supports touch controls like tapping and swiping, and the layout adapts to your screen."),
            ("Do I need to download anything?", "No. All the games run instantly in your web browser.")]
pages["index"] = page("index", "Free Online Games – Play Solitaire, Spider Solitaire, Mahjong, Chess & More",
    "Play 15 free online games instantly: Solitaire, Spider Solitaire, FreeCell, Mahjong, Chess, Checkers, Sudoku, Snake and more. No download or sign-up. Works on phone, tablet and computer.",
    home + '<div class="content"><h2>Frequently asked questions</h2><div class="faq">' + "".join(f"<details><summary>{q}</summary><p>{a}</p></details>" for q, a in home_faq) + "</div></div>", faq=home_faq)

PREVIEW = os.environ.get("PREVIEW")
def variants_of(base): return [v for v in V if V[v]["base"] == base]
def game_page(slug, g, base_slug, cfg=None, daily=False):
    others = [o for o in ORDER if o != base_slug]
    ways = variants_of(base_slug)
    waysh = ""
    if ways or slug != base_slug:
        links = ([(base_slug, G[base_slug])] if slug != base_slug else []) + [(v, V[v]) for v in ways if v != slug]
        waysh = '<h2>More ways to play</h2><div class="more">' + "".join(f'<a href="{v}"><span>{d["emoji"]}</span>{d["name"]}</a>' for v, d in links) + "</div>"
    more = waysh + '<h2>More free games</h2><div class="more">' + "".join(f'<a href="{o}"><span>{G[o]["emoji"]}</span>{G[o]["name"]}</a>' for o in others) + "</div>"
    faqhtml = '<h2>Frequently asked questions</h2><div class="faq">' + "".join(f"<details><summary>{q}</summary><p>{a}</p></details>" for q, a in g["faq"]) + "</div>"
    gm = G[base_slug]["game"]
    if daily: gm = DAILYBAR + gm
    cfgjs = ""
    if cfg:
        c = dict(cfg); c["more"] = base_slug + (".html" if PREVIEW else "")
        cfgjs = f"<script>window.GAMECFG={json.dumps(c)}</script>"
    body = f'''<div class="gamehead"><div><h1>{g["emoji"]} {g["h1"]}</h1><p>{g["sub"]}</p></div></div>
<div class="panel">{gm}</div>
<article class="content">{g["content"]}{faqhtml}{more}<p class="hint" style="text-align:left;margin-top:30px">Updated {UPDATED} by {AUTHOR}</p></article>
{cfgjs}<script src="common.js"></script><script src="{G[base_slug]["js"]}"></script>'''
    ld = {"@context": "https://schema.org", "@type": "VideoGame", "name": g["name"], "url": f"{DOMAIN}/{slug}", "description": g["desc"], "genre": "Casual", "gamePlatform": ["Web browser", "Mobile", "Desktop"], "applicationCategory": "Game", "operatingSystem": "Any", "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD"}, "author": {"@type": "Person", "name": AUTHOR}}
    return page(slug, g["title"], g["desc"], body, faq=g["faq"], ld_extra=ld, cur=base_slug)
for s in ORDER: pages[s] = game_page(s, G[s], s)
for v, d in V.items(): pages[v] = game_page(v, d, d["base"], cfg=d["cfg"], daily=d.get("daily"))

contact = f"<p>Questions, ideas or a game you'd like to see? Email <a href=\"mailto:{CONTACT}\">{CONTACT}</a>.</p>" if CONTACT else ""
pages["about"] = page("about", f"About {SITE}", f"About {SITE}, a free collection of classic online games made by {AUTHOR}.",
    f'''<article class="content"><h1>About {SITE}</h1><p>Hi, I'm {AUTHOR}. I built {SITE} because I wanted one simple place to play the classic games everyone loves, without pop-up downloads, sign-up walls or cluttered pages.</p>
<p>Every game here is built from scratch to load fast, play smoothly on phones and computers, and save your best scores right in your browser.</p>
<h2>What you'll find here</h2><ul>{"".join(f'<li><a href="{s}">{G[s]["name"]}</a>: {G[s]["short"].lower()}</li>' for s in ORDER)}</ul>
<p>More games are on the way.</p>{contact}</article>''')
pages["privacy"] = page("privacy", f"Privacy Policy – {SITE}", f"Privacy policy for {SITE}.",
    f'''<article class="content"><h1>Privacy Policy</h1><p>Last updated: {UPDATED}</p>
<h2>Game data</h2><p>Your scores, best times, settings and saved games are stored only in your own browser (local storage). They are never sent to our servers, and you can clear them at any time by clearing your browser data.</p>
<h2>Advertising</h2><p>This site may show ads from Google and other partners to keep the games free. These partners may use cookies to show ads based on your visits to this and other websites. You can opt out of personalized ads at <a href="https://www.google.com/settings/ads" rel="nofollow">Google Ads Settings</a>.</p>
<h2>Analytics</h2><p>We may use privacy-friendly analytics to count page visits. This data is aggregated and is not used to identify you.</p>
<h2>Children</h2><p>Our games are suitable for all ages. We don't knowingly collect personal information from anyone.</p>{contact}</article>''')

for slug, html in pages.items():
    if PREVIEW:
        html = re.sub(r'href="(%s)"' % "|".join(re.escape(s) for s in list(pages) if s != "index"), r'href="\1.html"', html)
        html = html.replace('href="./"', 'href="index.html"').replace('href="./#games"', 'href="index.html#games"')
    (OUT / f"{slug}.html").write_text(html)
urls = "".join(f"<url><loc>{DOMAIN}/{'' if s == 'index' else s}</loc></url>" for s in pages)
(OUT / "sitemap.xml").write_text(f'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">{urls}</urlset>')
(OUT / "robots.txt").write_text(f"User-agent: *\nAllow: /\nSitemap: {DOMAIN}/sitemap.xml\n")
print("built", len(pages), "pages")
