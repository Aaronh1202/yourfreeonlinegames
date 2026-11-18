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

ORDER = ["solitaire", "mahjong", "snake-game", "minesweeper", "2048", "sudoku", "checkers", "dinosaur-game"]

ICON = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='%23ffcc33'/><stop offset='1' stop-color='%23ff5c8a'/></linearGradient></defs><rect width='100' height='100' rx='26' fill='url(%23g)'/><text x='50' y='70' font-size='56' text-anchor='middle'>🎮</text></svg>"
LOGO = '<a class="logo" href="./"><span class="mark">🎮</span><span>YourFree<em>OnlineGames</em></span></a>'

def page(slug, title, desc, body, faq=None, ld_extra=None, cur=None):
    url = DOMAIN + "/" + ("" if slug == "index" else slug)
    nav = "".join(f'<a href="{s}"{" class=on" if s == cur else ""}>{G[s]["emoji"]} {G[s]["name"]}</a>' for s in ORDER)
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

pages = {}
home = f'''<section class="hero"><h1>Play <span>Free Online Games</span></h1><p>The classics you love, ready to play instantly. No downloads, no sign-up and no limits. Works on your phone, tablet and computer.</p></section>
<div class="cards">{"".join(card(s) for s in ORDER)}</div>
<div class="content"><h2>Free games, right in your browser</h2><p>{SITE} brings together the most popular classic games in one fast, clean place. Every game loads in seconds, saves your best scores, and works just as well with a touchscreen as with a mouse and keyboard.</p>
<ul><li><b>Card & tile games:</b> <a href="solitaire">Klondike Solitaire</a> and <a href="mahjong">Mahjong Solitaire</a>.</li><li><b>Board games:</b> <a href="checkers">Checkers</a> against the computer or a friend.</li><li><b>Puzzle games:</b> <a href="sudoku">Sudoku</a>, <a href="2048">2048</a> and <a href="minesweeper">Minesweeper</a>.</li><li><b>Arcade games:</b> the classic <a href="snake-game">Snake game</a> and the <a href="dinosaur-game">Dinosaur game</a>.</li></ul>
<p>New games are added regularly, so check back soon.</p></div>'''
home_faq = [("Are these games really free?", "Yes. Every game is free to play with no download, no account and no time limits."),
            ("Do the games work on mobile?", "Yes. Every game supports touch controls like tapping and swiping, and the layout adapts to your screen."),
            ("Do I need to download anything?", "No. All the games run instantly in your web browser.")]
pages["index"] = page("index", "Free Online Games – Play Solitaire, Mahjong, Checkers & More (No Download)",
    "Play free online games instantly: Solitaire, Mahjong, Checkers, Snake, Minesweeper, 2048, Sudoku and the Dinosaur game. No download or sign-up. Works on phone, tablet and computer.",
    home + '<div class="content"><h2>Frequently asked questions</h2><div class="faq">' + "".join(f"<details><summary>{q}</summary><p>{a}</p></details>" for q, a in home_faq) + "</div></div>", faq=home_faq)

for s in ORDER:
    g = G[s]
    more = '<h2>More free games</h2><div class="more">' + "".join(f'<a href="{o}"><span>{G[o]["emoji"]}</span>{G[o]["name"]}</a>' for o in ORDER if o != s) + "</div>"
    faqhtml = '<h2>Frequently asked questions</h2><div class="faq">' + "".join(f"<details><summary>{q}</summary><p>{a}</p></details>" for q, a in g["faq"]) + "</div>"
    body = f'''<div class="gamehead"><div><h1>{g["emoji"]} {g["h1"]}</h1><p>{g["sub"]}</p></div></div>
<div class="panel">{g["game"]}</div>
<article class="content">{g["content"]}{faqhtml}{more}<p class="hint" style="text-align:left;margin-top:30px">Updated {UPDATED} by {AUTHOR}</p></article>
<script src="common.js"></script><script src="{g["js"]}"></script>'''
    ld = {"@context": "https://schema.org", "@type": "VideoGame", "name": g["name"], "url": f"{DOMAIN}/{s}", "description": g["desc"], "genre": "Casual", "gamePlatform": ["Web browser", "Mobile", "Desktop"], "applicationCategory": "Game", "operatingSystem": "Any", "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD"}, "author": {"@type": "Person", "name": AUTHOR}}
    pages[s] = page(s, g["title"], g["desc"], body, faq=g["faq"], ld_extra=ld, cur=s)

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

PREVIEW = os.environ.get("PREVIEW")
for slug, html in pages.items():
    if PREVIEW:
        html = re.sub(r'href="(%s)"' % "|".join(re.escape(s) for s in list(pages) if s != "index"), r'href="\1.html"', html)
        html = html.replace('href="./"', 'href="index.html"')
    (OUT / f"{slug}.html").write_text(html)
urls = "".join(f"<url><loc>{DOMAIN}/{'' if s == 'index' else s}</loc></url>" for s in pages)
(OUT / "sitemap.xml").write_text(f'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">{urls}</urlset>')
(OUT / "robots.txt").write_text(f"User-agent: *\nAllow: /\nSitemap: {DOMAIN}/sitemap.xml\n")
print("built", len(pages), "pages")
