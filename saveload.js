// Save/Load Demo
document.addEventListener("DOMContentLoaded", () => {
  const saveCanvas =
    document.getElementById("saveLoadCanvas2") ||
    document.getElementById("saveLoadCanvas");
  const saveBtn =
    document.getElementById("saveImgBtn2") ||
    document.getElementById("saveImgBtn");
  const loadInput =
    document.getElementById("loadImgInput2") ||
    document.getElementById("loadImgInput");
  const demoStatus = document.getElementById("demoStatus");

  // Debug logging
  if (window.debug && window.debug.saveload) {
    window.debug.saveload("Save/Load Demo loaded");
    window.debug.saveload("Canvas found: " + (saveCanvas ? "YES" : "NO"));
    window.debug.saveload("Save button found: " + (saveBtn ? "YES" : "NO"));
    window.debug.saveload("Load input found: " + (loadInput ? "YES" : "NO"));
  }

  if (!saveCanvas || !saveBtn || !loadInput) {
    if (window.debug && window.debug.saveload)
      window.debug.saveload("ERROR: Missing elements");
    if (demoStatus)
      demoStatus.textContent += " | Save/Load demo: missing elements";
    return;
  }

  const ctxS = saveCanvas.getContext("2d");
  let cssW = 0,
    cssH = 0,
    dpr = 1;

  function resize() {
    dpr = window.devicePixelRatio || 1;
    cssW = saveCanvas.clientWidth || 300;
    cssH = saveCanvas.clientHeight || 140;
    saveCanvas.width = Math.max(1, Math.floor(cssW * dpr));
    saveCanvas.height = Math.max(1, Math.floor(cssH * dpr));
    ctxS.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (window.debug && window.debug.saveload) {
      window.debug.saveload(
        "Resize: cssW=" + cssW + ", cssH=" + cssH + ", dpr=" + dpr
      );
    }
    drawSample();
  }

  function drawSample() {
    // ensure sizes are set
    if (!cssW || !cssH) {
      cssW = saveCanvas.clientWidth || 300;
      cssH = saveCanvas.clientHeight || 140;
    }

    // draw example using CSS coordinates
    ctxS.clearRect(0, 0, cssW, cssH);
    ctxS.fillStyle = "#eef2ff";
    ctxS.fillRect(0, 0, cssW, cssH);
    ctxS.fillStyle = "#f97316";
    ctxS.fillRect(20, 20, 80, 50);
    ctxS.fillStyle = "#06b6d4";
    ctxS.beginPath();
    ctxS.arc(cssW - 60, 50, 30, 0, Math.PI * 2);
    ctxS.fill();
    ctxS.fillStyle = "#111827";
    ctxS.font = "bold 14px sans-serif";
    ctxS.fillText("Sample Scene", 20, cssH - 20);
  }

  saveBtn.addEventListener("click", () => {
    try {
      const data = saveCanvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = data;
      a.download = "canvas-image.png";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error("Save failed:", err);
      if (demoStatus)
        demoStatus.textContent += " | Save failed (canvas may be tainted)";
    }
  });

  // load user-provided file
  loadInput.addEventListener("change", (ev) => {
    const file = ev.target.files && ev.target.files[0];
    if (!file) {
      console.error("No file selected");
      return;
    }
    const img = new Image();
    img.onload = () => {
      // ensure canvas is sized
      if (!cssW || !cssH) {
        cssW = saveCanvas.clientWidth || 300;
        cssH = saveCanvas.clientHeight || 140;
      }
      ctxS.clearRect(0, 0, cssW, cssH);
      ctxS.drawImage(img, 0, 0, cssW, cssH);
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => {
      console.error("Image load failed");
      if (demoStatus)
        demoStatus.textContent += " | Could not load chosen image";
    };
    img.src = URL.createObjectURL(file);
  });

  window.addEventListener("resize", resize);

  // delay initialization
  setTimeout(() => {
    resize();
    if (demoStatus) demoStatus.textContent += " | Save/Load demo ready";
  }, 50);
});
