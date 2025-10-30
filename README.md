# Interactive Guide to Turbo-C Graphics

This README documents the small interactive web project on the Graphics with Turbo-C. The project provides browser-based demos that illustrate classic Turbo‑C graphics concepts (primitives, transformations, animation loops, saving/loading images) using HTML5 Canvas and plain JavaScript. It also includes short Turbo‑C code examples shown by the site to explain the original library usage.

This document covers:

- Project structure and files
- How each demo works (high level and important implementation details)
- Explanation of the Turbo‑C/C code snippets used in the viewer
- Key concepts (coordinate systems, transforms, devicePixelRatio, animation loop, image saving/loading, Towers of Hanoi algorithm)
- Troubleshooting and notes

## Project files

- `index.html` — The main single-page site containing the layout, navigation, and anchors for the demos. Page uses Tailwind classes and plain JavaScript for behavior.
- `anim.js` — Bouncing disk animation demo (HTML5 Canvas). Demonstrates animation loop, canvas sizing, DPR scaling, and start/stop controls.
- `saveload.js` — Save/Load demo. Draws a sample scene on a canvas, implements "Save" (downloads PNG from canvas) and "Load" (reads image file and draws it back onto the canvas).
- `hanoi.js` — Towers of Hanoi visualization. Generates the sequence of moves recursively and animates moving disks between pegs.
- `codeviewer.js` — Shows small Turbo‑C program examples in a code area when user clicks "Show Code" buttons. The examples are provided as text strings inside this file.

## How the single page is organized

The site is a single long page (Home → Fundamentals → Core Concepts → Applications). A sticky navigation bar at top contains links to each section (anchors). The page uses an Intersection Observer in `index.html` to watch which section is in view and automatically highlight the corresponding nav link as the user scrolls.

For mobile responsiveness the nav buttons use smaller padding on small screens and restore larger padding on `md` (medium) and above.

## Implementation notes & per-file explanation

(These are the important pieces to understand each demo and their code.)

1. index.html

---

- Layout: HTML section blocks with ids: `home`, `fundamentals`, `concepts`, `applications`.
- Navigation: top sticky nav with links `<a href="#concepts">...` — clicking scrolls to target section because of `scroll-behavior: smooth` CSS.
- Intersection Observer: JavaScript sets nav active state automatically when a section intersects viewport.
- Canvas containers: `.chart-container` elements give canvases visible CSS width/height. Each canvas is inside a container with a CSS `height: 140px` by default. CSS rule `canvas { width: 100%; height: 100%; display:block; }` ensures the canvas uses that space.

Why styling matters: Canvas DOM element has two distinct sizes:

- the CSS size (what the layout system uses), accessible by `element.clientWidth` and `element.clientHeight`.
- the backing bitmap size (`canvas.width`, `canvas.height`) which determines actual pixel resolution.

To keep visuals crisp on high-DPI displays we multiply the CSS size by `window.devicePixelRatio` when setting `canvas.width/height` and then call `ctx.setTransform(dpr, 0, 0, dpr, 0, 0)` so 1 canvas CSS pixel maps to 1 unit in drawing coordinates.

2. anim.js — Bouncing disk (key points)

---

Purpose: illustrate a simple animation loop and the sequence Draw → Delay → Clear → Update.

Key behaviors:

- On DOMContentLoaded it locates required elements: `animConceptCanvas`, `animStartBtn2`, `animStopBtn2`, `anim-steps-2`.
- `resize()` sets up the canvas backing-size and the context transform using `devicePixelRatio`.
  - Fallback sizes are used if `clientWidth/clientHeight` are 0 to avoid drawing into zero-sized canvas during initial layout.
- `draw()` draws the background and a disk at x coordinate `x`. It updates `x` by `vx`, flips the sign of `vx` when the disk hits canvas edges, and re-schedules itself via `requestAnimationFrame` when running.
- `Start` button sets `running = true` and calls `requestAnimationFrame(draw)`; `Stop` cancels the RAF.

Important implementation details and protections:

- Guarding `cssW/cssH` before drawing prevents errors when layout hasn't been measured yet.
- Using DPR scaling ensures crisp rendering on high DPI screens.

3. saveload.js — Save / Load demo (key points)

---

Purpose: show a simple drawn scene, provide a "Save" button to download the canvas as PNG and a "Load" control to draw a user-chosen image on the canvas.

Key behaviors:

- Identifies `saveLoadCanvas2`, `saveImgBtn2`, `loadImgInput2`.
- `resize()` same pattern as anim.js: compute CSS size with fallback, set canvas bitmap size to `Math.floor(cssW * dpr)` and call `ctx.setTransform`.
- `drawSample()` draws a simple scene (background, rectangle, circle, text) using CSS coordinates.
- Save: uses `saveCanvas.toDataURL('image/png')` and creates a temporary `<a>` element that clicks to download the image.
- Load: reads a `File` from the file input, creates an object URL, loads the image into an `Image` object, and draws it using `ctx.drawImage(img, 0, 0, cssW, cssH)`. After drawing we call `URL.revokeObjectURL()` to free the blob.

Security note: If the canvas draws cross-origin image data (e.g., an image from another domain) without proper CORS headers, `toDataURL()` will throw a security error (canvas is "tainted"). This project only uses local drawn content and user-selected files so tainting is not expected.

4. hanoi.js — Towers of Hanoi visualization (key points)

---

Purpose: Show recursive algorithm steps and animate disks moving between pegs.

Key behaviors:

- The UI elements are `hanoiCanvas2`, `animateHanoiBtn2`, `hanoi-steps-2`.
- `initializeHanoi()` resets state, builds the `pegs` array (source contains disks [3..1] for `numDisks=3`) and calls `resizeHanoiCanvas()`.
- `resizeHanoiCanvas()` sets canvas size (with fallback) and calls `drawHanoi()`.
- `hanoi(n, from, to, aux)` is a standard recursive function that pushes move objects onto a `moves` queue: first move `n-1` from source to auxiliary, then move disk n from `from` to `to`, then move `n-1` from auxiliary to `to`.
- Animation loop: the code uses `setInterval(animateHanoi, interval)` to pop the next move from the `moves` queue, move the disk in the `pegs` model (pop and push) and re-draw. Steps are appended as text into the steps area.

Visualization details:

- Disk widths scale with size; disks are drawn as filled rectangles with soft shadow and a white disk-number label.
- The animation is discrete (one move per interval) for clarity.

5. codeviewer.js — C/Turbo-C examples (key points)

---

Purpose: When the user clicks a "Show Code" control, the site shows short C/Turbo‑C programs illustrating the same idea in classic `graphics.h` style.

Examples included in the viewer (short summary):

- `anim`: shows how to draw a disk and update its X position in a simple loop using `initgraph()`, `circle()`, `floodfill()` and `delay()` in old Turbo-C style.
- `save`: pseudo-code showing drawing a sample scene, getting a region via `getimage()`, and putimage/restore. This snippet contains comments about writing the image buffer to file — it's illustrative and platform-specific (old DOS environment examples).
- `hanoi`: a short recursive pseudocode example of Towers of Hanoi.

Important: These are examples meant for teaching—some lines are platform-dependent or pseudo-code (e.g., capturing screen memory and writing to file). The site shows them for historical/contextual explanation only.

## Explanation of the Turbo‑C / C code patterns shown

Here are the concepts shown by those C snippets and how they map to the JavaScript implementations:

1. initgraph / closegraph

   - `initgraph(&gd,&gm,"")` in Turbo‑C initializes the graphics driver and mode. The equivalent in HTML5 is setting up a `<canvas>` and a 2D rendering context via `canvas.getContext('2d')`.

2. Drawing primitives

   - `putpixel(x,y,color)`, `line(x1,y1,x2,y2)`, `rectangle(x1,y1,x2,y2)`, `circle(x,y,r)` — these are direct analogs of the Canvas `ctx.fillRect`, `ctx.moveTo/lineTo/stroke`, `ctx.rect` and `ctx.arc` calls.

3. Animation loop

   - Turbo‑C: loop with `delay(ms)` and manual screen updates (draw, delay, clear, update variables).
   - JS: `requestAnimationFrame` for smooth animation and better power/performance characteristics. The pattern remains Draw → Update → Schedule Next Frame.

4. Image capture and save

   - Turbo‑C: `getimage()` would copy raw pixel data into memory; writing that block to disk would create a binary image file. `putimage()` would paste it back.
   - JS: The canvas API provides `toDataURL('image/png')` for exporting a PNG image (encoded string), and `drawImage()` to draw image data back onto a canvas (the `Image` object or another canvas).

5. Recursion (Towers of Hanoi)
   - The recursive `hanoi(n, from, to, aux)` pattern is identical. The difference is JS uses a moves queue to animate discretely while the C example might synchronously call draw routines between recursive calls.

## Core graphics and CS concepts explained

- Coordinate systems: Canvas uses a top-left origin (0,0). X increases rightwards, Y increases downwards. Many Turbo‑C examples have the same coordinate convention.

- Transformations:

  - Translation: (x', y') = (x + tx, y + ty)
  - Scaling about a center (cx,cy): (x', y') = (cx + sx*(x-cx), cy + sy*(y-cy))
  - Rotation about a center (cx,cy):
    (x', y') = (cx + (x-cx)*cosθ - (y-cy)*sinθ,
    cy + (x-cx)*sinθ + (y-cy)*cosθ)
    These are shown in the `index.html` content and the transformed coordinates are used when implementing more advanced drawing (not required for the simple demos but presented for learning).

- DevicePixelRatio (DPR) and crisp rendering:
  Modern screens often have more physical pixels than CSS pixels. Multiplying the canvas bitmap size by `devicePixelRatio` and scaling the context via `setTransform(dpr,0,0,dpr,0,0)` ensures sharp rendering on high-DPI displays.

- Canvas sizing pitfalls:
  If `canvas.width` / `canvas.height` are not set to match CSS size \* DPR, the canvas will render blurry or stretched. Also, reading `clientWidth` / `clientHeight` may return 0 if layout hasn't finished; the demos use fallbacks (300×140) and `setTimeout`-delayed initialization to reduce race conditions.

- Saving / tainting: If you draw a cross-origin image into canvas without proper CORS headers, the canvas becomes tainted and `toDataURL()` throws. Use local files or images served with correct CORS policies to avoid this.


