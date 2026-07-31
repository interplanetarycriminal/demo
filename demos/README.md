# ⚡ Visual Demo Sprint

### ▶ Live gallery: **https://interplanetarycriminal.github.io/demo/**

117 interactive, ultra-visual web demos — raymarched fractals, GPU sims, strange attractors,
playable neon games, and a large set of algorithm / ML / AI visualizers — built across three
rapid sprints by fleets of Claude agents working in parallel.

Use the filter chips on the gallery to jump to **Algorithms** (pathfinding, spanning trees,
DP, recursion, complexity) or **ML/AI** (neural nets, optimizers, clustering, convolution,
diffusion, genetic algorithms).

## Run it

```bash
python3 -m http.server 8000
# open http://localhost:8000/demos/
```

(Opening `demos/index.html` directly from disk works too — the hover previews and a few demos just behave better over http.)

## What's inside

| Demo | Tech | What it is |
|---|---|---|
| `raymarch-fractal.html` | raw WebGL | Raymarched 3D fractal, drag to orbit |
| `galaxy.html` | raw WebGL | 80k-star spiral galaxy, additive point sprites |
| `plasma.html` | raw WebGL | fbm plasma, cursor domain-warping, palette cycling |
| `reaction-diffusion.html` | raw WebGL | Gray-Scott sim, GPU ping-pong buffers, paintable |
| `metaballs.html` | raw WebGL | Iridescent shader metaballs chasing the cursor |
| `kaleidoscope.html` | raw WebGL | Polar-fold kaleidoscope, mouse-driven symmetry |
| `mandelbrot.html` | raw WebGL | Deep-zoom Mandelbrot / Julia morph explorer |
| `three-bloom.html` | Three.js | Chrome torus knot + UnrealBloomPass |
| `three-morph.html` | Three.js | 30k particles morphing between shapes |
| `three-terrain.html` | Three.js | Endless synthwave wireframe terrain |
| `warp.html` | Canvas 2D | Hyperspace starfield, hold to warp |
| `gravity.html` | Canvas 2D | N-body slingshot orbit sandbox |
| `aurora.html` | Canvas 2D | Stirrable northern lights with solar flares |
| `lightning.html` | Canvas 2D | Fractal storm, click-to-strike |
| `matrix-rain.html` | Canvas 2D | Digital rain with cursor repulsion |
| `boids.html` | Canvas 2D | Emergent flocking, mouse attract/repel |
| `text-particles.html` | Canvas 2D | Particles form words, type your own |
| `game-of-life.html` | Canvas 2D | Age-colored Conway, drag-to-paint |
| `raycaster.html` | Canvas 2D | Wolfenstein-style neon maze, WASD |
| `physics.html` | Matter.js | Grab-and-fling rigid body playground |
| `gsap-scroll.html` | GSAP + ScrollTrigger | Cinematic scroll-driven scenes |
| `d3-graph.html` | D3 v7 | Living force-directed network |
| `p5-flowfield.html` | p5.js | Perlin flow-field particle painting |
| `audio-viz.html` | WebAudio | Self-generating synth + radial FFT |
| `css-3d.html` | pure CSS | 3D glass card carousel |

`index.html` is the gallery — filter chips by tech, live iframe previews on hover.

Everything is a single self-contained file; the library-based demos (Three.js, GSAP, D3, Matter.js, p5.js) pull their one dependency from jsDelivr.
