# Gene Humphreys Brand System v2.4 — Web Application Edition

A reusable design system extracted from the CENTUM 100-day roadmap planner.
Apply it to any dashboard, planner, or operations interface.

> Aesthetic: HUD / technical · sci-fi UI overlay. Operations-first. Dark-first. No decoration for decoration's sake.

---

## Quick start

1. Copy `template.html` to your project as your starting point — it's a self-contained file with everything wired.
2. Or copy `tokens.css` into your stylesheet and follow the patterns below.
3. Always load the three Google Fonts: **Gemunu Libre**, **Geist**, **Geist Mono**.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Gemunu+Libre:wght@200;300;400;500;700&family=Geist:wght@200;300;400;500;700&family=Geist+Mono:wght@200;300;400;500;700&display=swap" rel="stylesheet">
```

---

## Identity

- **Tone:** minimal, masculine, controlled, intentional, premium
- **Emotion:** focus, discipline, clarity, pressure
- **Voice:** direct, minimal, commanding ("Execute.", "Day 47.")
- **Avoid:** hype, playfulness, decoration without purpose

---

## Color palette

```css
:root{
  --color-navy-bg:    #050912;  /* page base */
  --color-near-black: #0D0D0D;
  --color-signal-blue:#083584;  /* THE accent — punctuation only */
  --color-blue-soft:  #1551BC;
  --color-off-white:  #F9F9F9;
  --color-light-gray: #A7A7A7;
  --color-mid-gray:   #646464;
  --color-dark-gray:  #333333;
  --accent:        var(--color-signal-blue);
  --accent-soft:   rgba(8,53,132,0.18);
  --accent-glow:   rgba(8,53,132,0.40);
  --accent-bright: #2A6FD9;
}
```

### Color rules — enforced

- **Signal Blue is punctuation, not paint.** Use it on the most important element only — active state, primary CTA, progress fill, current/today indicator.
- **Navy mesh is the only background.** Don't add gradients on text or panels.
- **No bright colors.** Phase / category differentiation uses grayscale tones.

### Grayscale tone cycle

```js
const TONES = ['#F5F5F7', '#D4D4D7', '#A8A8AB', '#8E8E93', '#717174'];
```

---

## Typography

Three fonts. Three roles. **Do not mix them.**

```css
:root{
  --font-display: 'Gemunu Libre',sans-serif;  /* prose / display headlines, all caps */
  --font-graphic: 'Geist',sans-serif;         /* numbers, stats, graphic elements */
  --font:         'Geist Mono',monospace;     /* body, HUD chrome, labels */
}
```

| Use | Family | Weight | Size | Tracking | Transform |
|---|---|---|---|---|---|
| Display-XL (hero) | Gemunu Libre | 300 | 80–96px | -3.5px | UPPERCASE |
| Display-L (section) | Gemunu Libre | 300 | 42–64px | -2 to -3px | UPPERCASE |
| Headline | Gemunu Libre | 300 | 24–34px | -1px | UPPERCASE |
| Big number | Geist | 300 | 24–64px | -1 to -3px | tabular-nums |
| Body | Geist Mono | 400 | 13–14px | -0.5px | normal |
| HUD label | Geist Mono | 300 | 9–11px | +1.95px | UPPERCASE |

### Type rules

- **Gemunu Libre** = prose (sentences, statements, headlines). All caps.
- **Geist** = graphic numerics. Never for prose.
- **Geist Mono** = HUD chrome (labels, tags, status, meta) + body.
- All bold weights pulled to **light (300)** for refinement.
- HUD labels always have `+1.95px` letter-spacing.
- Numbers always use `font-variant-numeric: tabular-nums`.

---

## Spacing & surfaces

```css
:root{
  --space-xs: 8px; --space-sm: 16px; --space-md: 24px;
  --space-lg: 36px; --space-xl: 54px; --space-2xl: 72px;
  --r-pill: 999px; /* pills only — major containers stay hard-edged */
}
```

- Page edge padding: 36px desktop, 16px mobile
- Card padding: 18–32px
- **Hard edges everywhere.** No rounded corners on cards, panels, tables, calendar cells, gantt rows. Pills only.

---

## Background mesh

```css
body{
  background-color: var(--color-navy-bg);
  background-image:
    radial-gradient(ellipse 130% 130% at 45% 55%, transparent 0%, rgba(2,5,11,0.40) 55%, rgba(1,2,4,0.80) 100%),
    radial-gradient(ellipse 68% 54% at 72% 18%, rgba(10,32,80,0.55) 0%, rgba(6,18,49,0.22) 50%, transparent 100%),
    radial-gradient(ellipse 60% 48% at 2% 42%, rgba(24,72,168,0.55) 0%, rgba(14,46,120,0.30) 38%, transparent 100%),
    radial-gradient(ellipse 92% 74% at 30% 35%, rgba(12,42,102,0.55) 0%, rgba(7,24,64,0.25) 45%, transparent 100%);
  background-attachment: fixed;
}
```

---

## HUD chrome

### Section title prefix
```css
.section-title::before{ content:'▼ '; color: var(--color-signal-blue); }
```

### Tab bar with sliding indicator (signature pattern)

The tabs share a single sliding underline that animates between active states.

```html
<div class="tabs">
  <button class="tab active" onclick="switchTab('one')">Tab One</button>
  <button class="tab" onclick="switchTab('two')">Tab Two</button>
  <div class="tab-indicator" id="tab-indicator"></div>
</div>
```

```css
.tabs{position:relative; display:flex; padding:0 36px; border-bottom:1px solid var(--color-dark-gray);}
.tab{
  padding:14px 22px;
  font-family:var(--font); font-weight:300; font-size:11px;
  letter-spacing:1.95px; text-transform:uppercase;
  cursor:pointer; border:none; background:transparent;
  color:var(--color-mid-gray);
  transition:color .22s ease, text-shadow .35s ease;
}
.tab:hover{color:var(--color-off-white);}
.tab.active{
  color:var(--color-off-white);
  text-shadow:
    0 0 14px rgba(21,81,188,0.75),
    0 0 28px rgba(21,81,188,0.50),
    0 0 48px rgba(21,81,188,0.30);
}
.tab-indicator{
  position:absolute; bottom:-1px; left:0; width:0; height:3px;
  background:var(--color-signal-blue);
  pointer-events:none; opacity:0;
  transition:
    left .42s cubic-bezier(.22,1,.36,1),
    width .42s cubic-bezier(.22,1,.36,1),
    opacity .25s ease;
  box-shadow:
    0 0 18px rgba(21,81,188,1),
    0 0 36px rgba(21,81,188,0.75),
    0 0 60px rgba(21,81,188,0.50),
    0 0 96px rgba(21,81,188,0.28);
}
.tab-indicator.ready{opacity:1;}
```

```js
function updateTabIndicator(){
  const indicator = document.getElementById('tab-indicator');
  const active = document.querySelector('.tab.active');
  if(!indicator || !active) return;
  const inset = 14;
  indicator.style.left = (active.offsetLeft + inset) + 'px';
  indicator.style.width = Math.max(0, active.offsetWidth - (inset*2)) + 'px';
  indicator.classList.add('ready');
}
function switchTab(name){
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  // ...activate the target tab...
  updateTabIndicator();
}
window.addEventListener('resize', updateTabIndicator);
setTimeout(updateTabIndicator, 50);
```

### Header
```html
<div class="header">
  <div class="header-titles">
    <h1>YOUR TITLE <span class="accent">ROADMAP</span></h1>
    <p>▼ Subtitle · Goes · Here</p>
  </div>
  <div class="stats">
    <div class="stat"><div class="stat-n">100</div><div class="stat-l">Days</div></div>
  </div>
</div>
```

```css
.header{
  position:sticky; top:0; z-index:100;
  background:rgba(5,9,18,0.82);
  backdrop-filter:saturate(180%) blur(20px);
  border-bottom:1px solid var(--color-dark-gray);
  padding:22px 36px;
  display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:16px;
}
.header h1{
  font-family:var(--font-display); font-weight:300;
  font-size:34px; line-height:0.90; letter-spacing:-1.5px;
  text-transform:uppercase; color:var(--color-off-white);
}
.header h1 .accent{color:var(--color-signal-blue);}
.header p{
  font-family:var(--font); font-weight:300; font-size:11px;
  letter-spacing:1.95px; text-transform:uppercase;
  color:var(--color-light-gray); margin-top:8px;
}
.stat{
  text-align:center; background:transparent;
  border:1px solid var(--color-dark-gray); border-right-width:0;
  padding:12px 20px; min-width:84px;
}
.stat:last-child{border-right-width:1px;}
.stat-n{
  font-family:var(--font-graphic); font-weight:300; font-size:26px;
  letter-spacing:-1.2px; line-height:1;
  color:var(--color-off-white); display:block;
}
.stat:first-child .stat-n{color:var(--color-signal-blue);}
.stat-l{
  font-family:var(--font); font-weight:300; font-size:9px;
  color:var(--color-mid-gray); letter-spacing:1.95px;
  margin-top:6px; display:block; text-transform:uppercase;
}
```

---

## Components

### Glowing progress ring (signature pattern)

```html
<div class="ring-wrap">
  <svg viewBox="0 0 200 200">
    <circle class="ring-bg" cx="100" cy="100" r="90"/>
    <circle class="ring-fill" id="ring-fill" cx="100" cy="100" r="90"
      stroke-dasharray="565.487" stroke-dashoffset="565.487"/>
  </svg>
  <div class="ring-center">
    <span class="ring-day" id="ring-day">42</span>
    <span class="ring-label">of 100</span>
  </div>
</div>
```

```css
.ring-wrap{position:relative; width:200px; height:200px;}
.ring-wrap svg{width:200px; height:200px; transform:rotate(-90deg); overflow:visible;}
.ring-bg{fill:none; stroke:var(--color-dark-gray); stroke-width:5;}
.ring-fill{
  fill:none; stroke:var(--color-signal-blue); stroke-width:5;
  stroke-linecap:round;
  filter:
    drop-shadow(0 0 6px rgba(21,81,188,0.85))
    drop-shadow(0 0 14px rgba(21,81,188,0.55))
    drop-shadow(0 0 28px rgba(21,81,188,0.35));
  transition: stroke-dashoffset 1.4s cubic-bezier(.22,1,.36,1);
}
```

```js
const r=90, CIRC=2*Math.PI*r;
function setRing(pct){
  const fill = document.getElementById('ring-fill');
  fill.setAttribute('stroke-dasharray', CIRC);
  fill.setAttribute('stroke-dashoffset', CIRC*(1-pct));
}
```

### Glowing progress bar

```html
<div class="progress-bar">
  <div class="progress-bar-fill" style="width:42%"></div>
</div>
```

```css
.progress-bar{
  position:relative; height:18px;
  background:#020716; border:1px solid #04081A;
  overflow:hidden;
}
.progress-bar-fill{
  height:100%;
  background:linear-gradient(90deg,
    rgba(8,53,132,0.30) 0%,
    rgba(8,53,132,0.80) 35%,
    rgba(21,81,188,0.95) 75%,
    var(--accent-bright) 100%);
  box-shadow:
    0 0 16px rgba(21,81,188,0.55),
    0 0 32px rgba(21,81,188,0.30),
    inset 0 1px 0 rgba(255,255,255,0.10);
  transition: width 1.4s cubic-bezier(.22,1,.36,1);
  border-right:1px solid rgba(255,255,255,0.30);
}
```

### Bar with progressive fill (Gantt pattern)

When you have a row of bars representing time ranges and want them to "light up" as time progresses.

```html
<div class="bar" data-start="1" data-end="7">
  <div class="bar-fill"></div>
  <span class="bar-label">Phase Name</span>
</div>
```

```css
.bar{
  position:relative; height:22px;
  display:flex; align-items:center; padding:0 12px;
  background:rgba(255,255,255,0.04);
  border:1px solid var(--color-dark-gray);
  color:var(--color-light-gray);
  overflow:hidden;
}
.bar-fill{
  position:absolute; left:0; top:0; bottom:0; width:0;
  background:linear-gradient(90deg,
    rgba(8,53,132,0.25) 0%, rgba(8,53,132,0.75) 35%,
    rgba(21,81,188,0.95) 75%, var(--accent-bright) 100%);
  box-shadow:0 0 8px rgba(21,81,188,0.55), 0 0 18px rgba(21,81,188,0.30);
  border-right:1px solid rgba(255,255,255,0.30);
  transition: width 1.2s cubic-bezier(.22,1,.36,1);
}
.bar.complete .bar-fill{border-right:none;}
.bar-label{position:relative; z-index:2; color:var(--color-off-white);}
```

```js
function lightUpBars(currentDay){
  document.querySelectorAll('.bar[data-start]').forEach(bar=>{
    const start=+bar.dataset.start, end=+bar.dataset.end;
    let pct=0;
    if(currentDay>=end+1) pct=100;
    else if(currentDay>=start) pct=((currentDay-start+1)/(end-start+1))*100;
    bar.querySelector('.bar-fill').style.width=pct+'%';
    bar.classList.toggle('complete', pct>=100);
  });
}
```

### Day grid (calendar)

```css
.day-grid{
  display:grid; grid-template-columns:repeat(10,1fr); gap:1px;
  background:#020716; border:1px solid #020716;
}
.day-cell{
  padding:10px 6px 8px; background:#0C1B45;
  text-align:center; min-height:88px;
  display:flex; flex-direction:column; align-items:center; gap:2px;
  cursor:pointer; transition:background .15s ease;
  position:relative; overflow:hidden;
}
.day-cell:hover{background:#173072;}
.day-cell.selected{
  background:var(--color-signal-blue);
  box-shadow:
    0 0 0 1px var(--color-signal-blue),
    0 0 24px rgba(8,53,132,0.55),
    0 0 56px rgba(8,53,132,0.30);
  z-index:2;
}
.day-cell.today{
  background:rgba(8,53,132,0.18);
  box-shadow:inset 0 0 0 1px var(--color-signal-blue);
}
.day-cell.today::before{
  content:'TODAY';
  position:absolute; top:-9px; left:50%; transform:translateX(-50%);
  background:var(--color-signal-blue); color:var(--color-off-white);
  font-family:var(--font); font-weight:300; font-size:8px;
  letter-spacing:1.95px; padding:3px 8px; text-transform:uppercase;
}
.day-cell.past{opacity:.32; background:#06091B;}
.day-cell.past::after{
  content:''; position:absolute;
  left:14%; right:14%; top:50%; height:1px;
  background:var(--color-mid-gray); opacity:.7;
  transform:rotate(-18deg);
}
```

### Floating sticky horizontal scrollbar

For wide tables that need to scroll horizontally — pins to viewport bottom so users always see the affordance.

```html
<div class="floating-hscroll" id="floating-hscroll">
  <div class="floating-hscroll-inner" id="floating-hscroll-inner"></div>
</div>
```

```css
.floating-hscroll{
  position:fixed; left:0; right:0; bottom:0;
  height:14px;
  overflow-x:scroll; overflow-y:hidden;
  background:rgba(5,9,18,0.92);
  backdrop-filter:saturate(180%) blur(20px);
  border-top:1px solid var(--color-signal-blue);
  z-index:80; display:none;
}
.floating-hscroll.visible{display:block;}
.floating-hscroll::-webkit-scrollbar{height:14px;}
.floating-hscroll::-webkit-scrollbar-thumb{
  background:var(--color-signal-blue);
  border:1px solid rgba(255,255,255,0.20);
}
.floating-hscroll-inner{height:1px;}
```

```js
let activeWrap=null, syncing=false;
function updateFloatingScroll(){
  const float = document.getElementById('floating-hscroll');
  const inner = document.getElementById('floating-hscroll-inner');
  const wrap = document.querySelector('.scrollable-wide-content');
  if(!wrap){ float.classList.remove('visible'); return; }
  const inner_el = wrap.firstElementChild;
  const hasOverflow = inner_el.scrollWidth > wrap.clientWidth + 1;
  if(!hasOverflow){ float.classList.remove('visible'); return; }
  inner.style.width = inner_el.scrollWidth + 'px';
  float.classList.add('visible');
  activeWrap = wrap;
}
document.getElementById('floating-hscroll').addEventListener('scroll', () => {
  if(syncing || !activeWrap) return;
  syncing = true;
  activeWrap.scrollLeft = document.getElementById('floating-hscroll').scrollLeft;
  syncing = false;
});
// Add scroll listener to the wide content too for bidirectional sync
```

### Buttons

```css
.btn-primary{
  background:var(--color-signal-blue); color:var(--color-off-white);
  border:1px solid var(--color-signal-blue);
  padding:14px 28px; cursor:pointer;
  font-family:var(--font); font-weight:300; font-size:11px;
  letter-spacing:1.95px; text-transform:uppercase;
}
.btn-primary:hover{background:var(--color-blue-soft);}

.btn-outline{
  background:transparent; color:var(--color-light-gray);
  border:1px solid var(--color-dark-gray);
  padding:10px 18px; cursor:pointer;
  font-family:var(--font); font-weight:300; font-size:10px;
  letter-spacing:1.95px; text-transform:uppercase;
}
.btn-outline:hover{color:var(--color-off-white); border-color:var(--color-off-white);}
```

### Inputs

```css
.input{
  background:transparent; border:1px solid var(--color-dark-gray);
  padding:14px 18px; color:var(--color-off-white);
  font-family:var(--font); font-size:13px; font-weight:400;
  letter-spacing:-0.5px; outline:none; width:100%;
}
.input:focus{border-color:var(--color-signal-blue);}
.input::placeholder{
  color:var(--color-mid-gray); font-weight:300;
  font-size:10px; letter-spacing:1.5px; text-transform:uppercase;
}
```

### Pills / segmented control

```css
.pills{display:flex; gap:0; border:1px solid var(--color-dark-gray);}
.pill{
  padding:10px 16px;
  border:none; border-right:1px solid var(--color-dark-gray);
  background:transparent; color:var(--color-mid-gray);
  font-family:var(--font); font-weight:300; font-size:10px;
  letter-spacing:1.95px; text-transform:uppercase;
  cursor:pointer; transition:color .15s ease;
}
.pill:last-child{border-right:none;}
.pill.active{background:var(--color-signal-blue); color:var(--color-off-white);}
```

### Checkbox row

```css
.check-row{
  display:flex; align-items:flex-start; gap:10px;
  cursor:pointer; padding:8px 0; line-height:1.5;
  font-family:var(--font); font-weight:400;
  color:var(--color-off-white);
}
.check-row.done{opacity:.45;}
.check-row.done .check-text{
  text-decoration:line-through;
  text-decoration-color:var(--color-signal-blue);
}
.check-box{
  flex-shrink:0; width:14px; height:14px;
  border:1.5px solid var(--color-light-gray);
  margin-top:2px;
  display:inline-flex; align-items:center; justify-content:center;
  font-size:10px; color:transparent; transition:all .15s ease;
}
.check-row.done .check-box{
  background:var(--color-signal-blue);
  border-color:var(--color-signal-blue);
  color:var(--color-off-white);
}
```

### Big section heading band

```css
.section-band{
  padding:32px 28px 24px;
  border-top:1px solid var(--color-dark-gray);
  border-bottom:1px solid var(--color-dark-gray);
  background:rgba(255,255,255,0.015);
  display:flex; justify-content:space-between; align-items:baseline;
}
.section-band-title{
  font-family:var(--font-display); font-weight:300;
  font-size:48px; line-height:0.9; letter-spacing:-2.4px;
  text-transform:uppercase; color:var(--color-off-white);
}
.section-band-meta{
  font-family:var(--font); font-weight:300; font-size:10px;
  letter-spacing:1.95px; text-transform:uppercase;
  color:var(--color-light-gray);
}
```

---

## Icon system

Thin-line SVG icons. **No emojis in chrome.**

```js
function iconHtml(svgPath, size){
  size = size || 16;
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
    style="width:${size}px;height:${size}px;display:inline-block;vertical-align:middle">
    ${svgPath}
  </svg>`;
}
```

Style rules: `stroke="currentColor"`, `stroke-width="1.5"`, no fill (use `fill="currentColor"` only on small accent dots inside icons). 24×24 viewBox.

---

## Mobile responsive

```css
@media(max-width: 760px){
  .header{padding:14px 16px; flex-direction:column; align-items:flex-start;}
  .header h1{font-size:22px;}
  .tabs{padding:0 12px; overflow-x:auto; flex-wrap:nowrap;}
  .tab{padding:12px 14px; font-size:10px; flex-shrink:0;}
  .main{padding:18px 14px;}
  /* Tables get horizontal scroll with min-width:800px */
  .scrollable-table{overflow-x:auto;}
  .scrollable-table table{min-width:800px;}
}
```

---

## Hard rules — enforced

**DO:**
- Dark navy background (`#050912`) always
- One signal blue element per section
- Gemunu Libre for all headline prose
- Geist Mono for all body and labels
- Geist for graphic numerics only
- All caps for HUD labels
- Tabular numerals on all numbers
- Hard edges on cards / panels / grids

**NEVER:**
- Multiple bright colors / blues
- Blue used as background fill (unless the surface IS the moment)
- Italic text
- Rounded corners on major containers
- Decorative gradients beyond the mesh + the signature glow
- Emojis in chrome (data content can keep them)
- Hype language
- Bold (`font-weight: 700`). Use light (`300`) for refinement.

---

## File map

```
design-system/
├── README.md       — this file (full reference)
├── tokens.css      — copy-paste CSS variables + base reset + mesh background
└── template.html   — self-contained starter HTML you can fork
```
