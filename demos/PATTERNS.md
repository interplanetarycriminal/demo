# PATTERNS.md — the whole project at a glance
*Token-conservative knowledge index. Read THIS instead of re-reading demos. ~5k tokens buys you what ~2M tokens of file-reading learned across 222 demos, 60+ builder agents, and every QA round. Point any future subagent at the sections it needs.*

---

## 0 · INVENTORY (222 demos, one gallery)

| prefix | n | what | naming |
|---|---|---|---|
| *(none)* "core" | 112 | visual spectacle + algorithms + ML/AI + games + audio + 4 Foundations flagships | `galaxy.html`, `neural-net.html`, `bayes.html`… |
| `euclid-` | 7 | Euclid's Elements, parchment-on-black look | `euclid-i47.html` |
| `cc-` | 33 | Physics Cheat Codes (sensing physics, from the ESP32 atlas) | `cc-lockin.html` |
| `il-` | 65 | Physics & Chemistry Illusion Museum | `il-rupert-drop.html` |
| `three-` | 9 | Three.js scenes (ONLY files allowed a CDN importmap, pinned three@0.160.0) | `three-galaxy.html` |

- **Registry**: `index.html` → `const DEMOS=[ {f,e,t,g,d}, …]` (file, emoji, title, group-chip, one-liner). New demo = new line here or it's invisible.
- **Reconcile before every push** (zero dead cards, zero unwired):
  `grep -oE "f:'[^']+'" index.html | sed "s/f:'//;s/'//" | while read f; do [ -f "$f" ] || echo DEAD:$f; done` and the reverse loop for unwired files.
- **Deploy**: push to `main` → `.github/workflows/deploy-pages.yml` serves `demos/` at https://interplanetarycriminal.github.io/demo/ . Mirror-push `main:claude/visual-demos-sprint-2gtsok`. **Always curl-verify the LIVE site** (`grep -c "f:'"` on the fetched index + spot-check 200s) — local grep once masked a 22-commit stale-branch disaster.
- Side registries (scratchpad): `illusions.json`, `extra_demos.json` feed `build_illusions.py` / `build_evidence.py` → evidence HTML with base64 screenshots for SendUserFile.

## 1 · THE CANONICAL SKELETON (v2 — now with the mobile + beauty rules that eroded)

Every demo is ONE self-contained .html: inline CSS/JS, no CDN (except `three-*`), Canvas 2D (or raw WebGL with own compile helpers).

```html
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">  <!-- ① NEVER OMIT -->
<title>Name</title>
<style>
 html,body{margin:0;height:100%;overflow:hidden;background:#0a0a12}
 canvas{display:block;position:fixed;inset:0;touch-action:none}      <!-- ② touch-action -->
 #ui{position:fixed;top:10px;left:10px;z-index:10;
   font:12px/1.55 ui-monospace,Menlo,monospace;color:#cde;
   background:rgba(8,10,25,.55);padding:10px 13px;border:1px solid rgba(140,170,255,.25);
   border-radius:10px;backdrop-filter:blur(6px);
   width:min(340px,calc(100vw - 20px));max-height:45vh;overflow:auto} <!-- ③ phone-safe panel -->
   <!-- ③b panel CONTENT ORDER: title → 1-line mechanism → LIVE READOUTS → controls → lineage last in class="detail" — the 45vh clamp must only ever hide lineage, never readouts (learned: Euler-disk wave hid α/Ω below the fold in short windows) -->
 @media (max-width:640px){#ui{font-size:11px;max-height:38vh}
   #ui .detail{display:none}}                                        <!-- ④ collapse detail rows -->
 #ui a{color:#8cf;text-decoration:none}
</style>
<body>
<script>window.onerror=function(m,s,l){var p=document.createElement('pre');p.style.cssText='position:fixed;bottom:0;left:0;color:#f66;background:#000d;padding:8px;z-index:999;font:12px/1.4 monospace';p.textContent=m+' @ line '+l;document.body.appendChild(p)}</script>
<div id="ui"><b>NAME</b> · one-sentence mechanism · scientist+year · lineage ·
  controls · live readouts · <a href="index.html">← gallery</a></div>
<canvas id="c"></canvas>
<script>
const cv=document.getElementById('c'),ctx=cv.getContext('2d');let W,H,DPR;
function resize(){DPR=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;
  cv.width=W*DPR;cv.height=H*DPR;ctx.setTransform(DPR,0,0,DPR,0,0);}
addEventListener('resize',resize);resize();
// ⑤ POINTER events only (never mouse*): pointerdown/move/up + setPointerCapture → touch works free
// ⑥ wheel is BONUS-only; every wheel action needs a tap/drag/button equivalent
// ⑦ wall-clock-locked sim: fixed SUB=1/60 substeps, n=round(realDt/SUB), realDt capped 0.45s
// ⑧ auto-demo: phenomenon MID-ACTION at t≈4s (screenshot gate); loops forever
</script></body>
```

**Layout law**: stage fills the canvas; panel never covers the action; every canvas-drawn label gets a collision check (stagger or offset — label overprint was the #1 QA reject).

## 2 · STEAL-FROM-HERE INDEX (technique → best-in-repo exemplar)

*Open the named file only when you need the actual code; each is ~300-500 lines, self-contained.*

**Rendering / perf**
- Pre-rendered radial-gradient glow **sprites blitted additively** (NEVER per-particle shadowBlur — it collapsed headless fps to ~6 and desynced sim-vs-wall clock): `il-vortex-rings.html`
- Offscreen **trail canvas** (`destination-out` fade + `lighter` composite): `il-vortex-rings.html`; cheap variant = translucent fillRect fade: `fireworks.html`, `attractors.html`
- **ImageData-grid sims** scaled up (fluid/heat/RD at ~⅓ res, putImageData): `ripples.html` (wave eq), `fluid.html` (Stam solver), `slime.html` (physarum trail), `cc-heat-transit.html` (FD diffusion)
- Raw **WebGL fullscreen-triangle shader** boilerplate + cosine palettes + fbm: `blackhole.html`, `tunnel.html`, `clouds.html`, `cc-everything-glows.html` (Planck)
- Scrolling **spectrogram** via offscreen canvas shift (not 15k fillRects): `cc-eigenfrequency.html`
- Glossy **liquid-metal / metaball** rendering with guarded gradients: `il-beating-heart.html`; glossy milk/crown: `il-crown-splash.html`; photoelastic stress colours: `il-rupert-drop.html`, `il-photoelastic.html`
- Three.js scene+bloom+resize (composer) pattern & pinned importmap: `three-galaxy.html`, `euclid-solids.html`

**Math / physics engines**
- Real **FFT** + windowing (Blackman-Harris beats Hann for sub-corner leakage): `cc-noise-bestiary.html`; Goertzel single-bin: `cc-prestress-pitch.html`
- **1-D waveguide with correct reflection/transmission** (Kelly–Lochbaum, R=(Z₂−Z₁)/(Z₂+Z₁), polarity lessons): `cc-impedance-echo.html`
- **Verlet** cloth/chain + constraints: `cloth.html`; chain-fountain reduced model: `il-chain-fountain.html`
- **Reaction-diffusion / excitable media** (tearable spirals): `il-bz-reaction.html`, `reaction-diffusion.html`
- **Reduced ODE oscillators** (relaxation/limit-cycle with phase portrait): `il-beating-heart.html`, `il-briggs-rauscher.html`; Rayleigh-Plesset-ish bubble: `il-sonoluminescence.html`
- Ray tracing through **graded n** (mirage integrator), layered ducting: `il-mirage.html`, `il-fata-morgana.html`; Snell/TIR facet tracing + dispersion: `il-diamond-fire.html`; annular cloak: `il-cloak.html`
- **2-D point-vortex dynamics** (Biot–Savart pairs, image vortices at walls): `il-vortex-rings.html`
- Compass-and-straightedge **geometric constructions** with per-step justification engine: `euclid-i1.html`; area-preserving shear animation (proof-as-motion): `euclid-i47.html`
- MLP trained live by backprop, decision-boundary heatmap: `neural-net.html`; optimizer race (SGD/momentum/RMSProp/Adam): `gradient-descent.html`; tabular Q-learning heatmap: `qlearning.html`; UCB1-Tuned bandit (textbook √2 LOSES at 6 arms — keep Tuned): `bandit.html`
- **Lock-in detection / matched filter / dither** reference implementations (the DSP trinity): `cc-lockin.html`, `cc-matched-filter.html` (primitive LFSR taps matter), `cc-dither.html` (1 bit per 4× N, optimum ≈1 LSB)
- Poisson stats with **c4 small-sample correction** + inverse-variance fits: `cc-sqrt-n.html`
- **WebAudio synthesis** behind click-to-start splash (autoplay-safe), gentle master gain: `sequencer.html`, `theremin.html`, `plinko.html`

**Interaction patterns**
- Draggable-anything with recompute-everything (proof-grade): `euclid-i1.html`, `eigen.html` (drag basis vectors = the matrix)
- Mechanism-dissection toggles (turn causes on/off, watch effect die — the "control experiment" as UI): `il-mpemba.html`, `il-jumping-ring.html` (slit ring), `il-kelvin-dropper.html` (uncross wiring)
- A/B ghost overlay ("what intuition says" vs reality): `il-tea-leaves.html`
- Story/timeline staging with captions: `il-poisson-spot.html` (Poisson's sneer→Arago's lamp)

## 3 · AESTHETIC SYSTEM (the beauty that eroded — restore it)

**Why early demos looked better**: core-era files are art-first (one big phenomenon, minimal chrome, strong palette identity, generous glow); cc/il-era drifted instrument-first (340-380px dense monospace dashboards, stage squeezed, palette defaulting to the same cyan-on-navy). Fix = keep the physics rig but re-assert the rules below.

- **One palette per demo, 2-3 accents max, named identity**: gold/parchment on near-black (`euclid-*` — the best-looking collection: `#e9c46a` gold, `#d8c9a3` parchment, `#7fd4ff` cyan accent, radial parchment vignette `rgba(60,45,20,.16)`); neon-on-void for spectacle (core); deep-navy + data-orange/cyan pairs for rigs (`il-dead-water.html`, `il-kelvin-dropper.html` — the two best-composed rigs; copy their balance).
- **Glow recipe**: 2-pass stroke (wide low-alpha halo + tight bright core) or pre-rendered sprite; background never pure black — add a subtle radial vignette or aurora orb (see `index.html` orbs).
- **Lookbook** (screenshot-proven stunners to imitate): `blackhole.html`, `il-rupert-drop.html`, `il-ferrofluid.html`, `il-kelvin-dropper.html`, `il-dead-water.html`, `cc-everything-glows.html`, `euclid-i47.html`, `three-galaxy.html`.
- **Composition minimums (the QA gate)**: phenomenon mid-action at t≈4s cold load; panel clear of stage; no label collisions; no dead half-screens; error box empty. Screenshot QA caught 5/12 recent demos violating these — assume drift, always gate.
- Typography: monospace UI at 12px (11px <640px), title letter-spaced caps, `clamp()` for hero text.

## 4 · MOBILE AUDIT (measured 2026-08 — the regression, quantified)

| era | viewport meta | pointer events | touch-action | fixed panel ≥300px | @media |
|---|---|---|---|---|---|
| core (112) | **69%** | 34% (+29% mouse-only) | 13% | 43% | 0 |
| cc- (33) | **9%** | 39% (+30% mouse-only) | 0 | **100%** | 0 |
| il- (65) | **20%** | 43% (+25% mouse-only) | 0 | **86%** | 0 |

**Diagnosis**: recent demos dropped the viewport meta (phone renders at ~980px virtual width → microscopic text) and standardized a ≥340px fixed panel (covers the whole stage on a 390px phone). Mouse-only handlers broke drags on touch; missing `touch-action:none` makes the page scroll-fight the canvas.

**Codex era (2026-08-25):** +18 explainers from the AppliedInteractive UX/UI Codex and AI-Era Programming Codex — prefixes `ux-` (9, chip UX Lab: Fitts/Hick/Doherty rigs that MEASURE the user with a ghost-hand idle mode; preattentive/change-blindness/gestalt; ot-crdt/presence/modes) and `sys-` (9, chip Systems: retry-storm/herd/breaker feedback loops; split-brain/consistency/merkle agreement; tail-latency/backpressure/shuffle-shard). Codex source distilled to scratchpad codex-sections/*.txt (66 files) — read those, never the 600KB pages. New standing brief rules born this wave: stage headers/chips NEVER behind the overlay and always on separate rows (chip-overprint was the #1 QA failure, 6 of 9 fix rounds); experiment rigs must persist trial HISTORY on the stage; a queue/growth mechanism should GROW into empty stage space (the emptiness wastes the demo's own argument); dynamic chip placement must clamp away from header/banner bands.

**Retrofit status (2026-08-22):** cc- era DONE 33/33 (viewport+touch-action+responsive panel+@media; pointer where trivially safe). il- era DONE 61/61 (2 window-level-mouse files skipped ⑤: newton-rings, soap-film). Known residue — canvas-INTERNAL layout still desktop-tuned, needs per-demo stage passes: cc-noise-bestiary, cc-dither, cc-everything-glows (plot placement), il-vortex-rings (fixed-px sim world flies off 390px frame), il-iodine-clock (slider row overlaps labels), edge-label clips in il-diamond-fire/il-jumping-ring. Core era last.

**The 6-line retrofit** (apply to any demo; it's skeleton items ①-⑥): add viewport meta · `touch-action:none` on canvas · panel `width:min(340px,calc(100vw-20px));max-height:45vh;overflow:auto` · `@media(max-width:640px)` shrink/collapse · s/mouse/pointer events/ + `setPointerCapture` · tap-alternatives for wheel-only controls.

## 5 · BUG BESTIARY (every real bug caught here — never re-pay for these)

1. **shadowBlur-per-particle** → headless fps ≈6 → rAF-dt sim ran at 0.2× wall clock (demo "worked" but screenshots caught it pre-action). Fix: sprite blitting + wall-clock substeps. (`il-vortex-rings`)
2. **Sign conventions**: inverted vorticity pair = rings fly the wrong way (`il-vortex-rings`); wrong Fresnel/pulse polarity inverted every echo (`cc-impedance-echo`); servo sign inverted (`cc-null-measurement`); II.11 construction direction (G toward A, not away — `euclid-golden`).
3. **Hoisting/init NaN**: `var S={r:RMIN}` before `RMIN` assigned → NaN → `createRadialGradient` throws → rAF chain dies frame 1. Guard all gradient args with isFinite; try/catch the draw loop; init state before first render. (`il-beating-heart`)
4. Physics constants/claims: rice-cooker numbers swapped kPa/m vs m/atm (the atlas itself!); dodecahedron edge÷radius passed off as edge÷diameter (`euclid-solids`); fall time ∝ B²σ not 1/B²σ (my own brief, caught by builder); textbook UCB1 c=√2 loses to ε-greedy at 6 arms (use UCB1-Tuned); ½-bit-per-4×N dither folklore is wrong (1 bit per 4×).
5. **Averaging pitfalls**: flicker noise must be common-mode across repeats below the corner; signal phase must be locked across averaged records or the signal itself averages away; sample-σ needs c4 correction or your √N slope reads −0.53. (`cc-noise-bestiary`, `cc-sqrt-n`)
6. Venturi drove absolute pressure below vacuum at extreme sliders — anchor to absolute P with a supply head. (`cc-bernoulli`)
7. Rate models: rubber's rate multiplier went NEGATIVE below 0.85 Hz (energy injection!) — power laws, not linear extrapolation. (`cc-hysteresis`)
8. Frame-rate-dependent detection (flip thresholds sampled per-frame) — bisect on the detector, or lock to wall clock. (`cc-reynolds`)
9. Layout: fixed-px labels/cards under the overlay panel; giant counters overprinting captions — the most common QA reject. Always offset/stagger canvas text.
10. LFSR tap sets must be primitive polynomials or your "PRN" is degenerate (matched filter drops 20 dB). (`cc-matched-filter`)

- **Rebound sign glued stone to waterline** (il-stone-skipping): post-bounce `vy=-vn·sin(a)` (downward) → re-impact next substep → machine-gun mm-bounces, no arcs; builder verify PASSED because bounce count still peaked at 20°. Rule: verify trajectories LEAVE the surface (vy_out>0), not just that scalar laws peak in the right place.

## 6 · VERIFICATION PLAYBOOK (what made quality possible)

- **Extract the real code from the HTML** for node tests (regex the `<script>` body or mark `/*PHYS-START*/` blocks) — verify the shipped math, not a re-derivation.
- Lean node check per demo: 3-8 assertions on the core law (scaling exponent fits, conservation, threshold sign flips, control-experiment ablations "effect dies when cause off" — the strongest test class).
- Stubbed-DOM soak for runtime: fake canvas ctx, run 300-900 frames × viewports × control sweeps, assert zero non-finite draw args + rAF alive.
- **Screenshot QA loop** (user-mandated, keep forever): builder self-shoots → orchestrator Reads jpg → verdict vs §3 minimums → SendMessage concrete fixes → re-shoot until approved. Only approved demos get wired.
- Pipeline: `node scratchpad/shoot.js <outdir> <files…>` (chromium at `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`, 880×560, mouse-nudge, t≈4.2s capture, JPEG q58). Evidence: `build_illusions.py` / `build_evidence.py` embed base64 → SendUserFile (render) — works on mobile, not an Artifact.

## 7 · ORCHESTRATION ECONOMY (what each demo costs)

Opus builder trio ≈ 60-130k tokens (build+verify+self-shoot); a QA fix round ≈ +100k. Keep briefs ≤450 words/demo with the skeleton by reference ("PATTERNS.md §1"), lean-verify only the core law, forbid exploration/narration. Fable orchestrates: brief → sweep-commit rolling (protects against container restarts — one restart cost 24 demos) → QA gate → wire → push both branches → **curl-verify live** → evidence.
