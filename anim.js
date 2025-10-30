// Bouncing Disk Animation Demo
document.addEventListener("DOMContentLoaded", () => {
  const animCanvas =
    document.getElementById("animConceptCanvas") ||
    document.getElementById("animConceptCanvas2");
  const animStartBtn =
    document.getElementById("animStartBtn2") ||
    document.getElementById("animStartBtn");
  const animStopBtn =
    document.getElementById("animStopBtn2") ||
    document.getElementById("animStopBtn");
  const animSteps =
    document.getElementById("anim-steps-2") ||
    document.getElementById("anim-steps");
  const demoStatus = document.getElementById("demoStatus");

  // Debug logging
  if (window.debug && window.debug.anim) {
    window.debug.anim("Animation Demo loaded");
    window.debug.anim("Canvas found: " + (animCanvas ? "YES" : "NO"));
    window.debug.anim("Start button found: " + (animStartBtn ? "YES" : "NO"));
    window.debug.anim("Stop button found: " + (animStopBtn ? "YES" : "NO"));
    window.debug.anim("Steps div found: " + (animSteps ? "YES" : "NO"));
  }

  if (!animCanvas || !animStartBtn || !animStopBtn || !animSteps) {
    if (window.debug && window.debug.anim)
      window.debug.anim("ERROR: Missing elements");
    if (demoStatus)
      demoStatus.textContent += " | Animation demo: missing elements";
    return;
  }

  const ctx = animCanvas.getContext("2d");
  let cssW = 0,
    cssH = 0,
    dpr = 1;

  function resize() {
    dpr = window.devicePixelRatio || 1;
    cssW = animCanvas.clientWidth || 300;
    cssH = animCanvas.clientHeight || 140;
    animCanvas.width = Math.max(1, Math.floor(cssW * dpr));
    animCanvas.height = Math.max(1, Math.floor(cssH * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (window.debug && window.debug.anim) {
      window.debug.anim(
        "Resize: cssW=" + cssW + ", cssH=" + cssH + ", dpr=" + dpr
      );
    }
  }

  let x = 40,
    vx = 2,
    radius = 12;
  let running = false;
  let raf = null;

  function draw() {
    // ensure canvas is sized
    if (!cssW || !cssH) {
      resize();
      return; // exit and let next frame draw
    }

    // clear using CSS coordinates
    ctx.clearRect(0, 0, cssW, cssH);
    // background
    ctx.fillStyle = "#fff7ed";
    ctx.fillRect(0, 0, cssW, cssH);
    // disk
    ctx.fillStyle = "#f59e0b";
    ctx.beginPath();
    ctx.arc(x, cssH / 2, radius, 0, Math.PI * 2);
    ctx.fill();

    animSteps.innerHTML =
      "Draw → Delay → Clear → Update<br>" +
      `Position: ${Math.round(x)}, Velocity: ${vx}`;

    x += vx;
    if (x + radius > cssW || x - radius < 0) vx = -vx;

    if (running) raf = requestAnimationFrame(draw);
  }

  animStartBtn.addEventListener("click", () => {
    if (window.debug && window.debug.anim)
      window.debug.anim("Start button clicked");
    if (running) return;
    running = true;
    if (!cssW || !cssH) {
      if (window.debug && window.debug.anim)
        window.debug.anim("ERROR: Canvas not sized!");
      resize();
    }
    x = Math.min(Math.max(radius + 2, x), cssW - radius - 2);
    if (window.debug && window.debug.anim)
      window.debug.anim("Animation starting...");
    raf = requestAnimationFrame(draw);
  });

  animStopBtn.addEventListener("click", () => {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = null;
  });

  window.addEventListener("resize", () => {
    const wasRunning = running;
    resize();
    if (!wasRunning) draw();
  });

  // initial layout
  setTimeout(() => {
    resize();
    draw();
    if (demoStatus) demoStatus.textContent += " | Animation demo ready";
  }, 50);
});
