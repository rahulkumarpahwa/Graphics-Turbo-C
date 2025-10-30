// Towers of Hanoi Demo - Working implementation
document.addEventListener("DOMContentLoaded", () => {
  const hanoiCanvas = document.getElementById("hanoiCanvas2");
  const hanoiCtx = hanoiCanvas ? hanoiCanvas.getContext("2d") : null;
  const hanoiBtn = document.getElementById("animateHanoiBtn2");
  const hanoiStatus = document.getElementById("demoStatus");
  const hanoiStepsDiv = document.getElementById("hanoi-steps-2");

  // Debug logging
  if (window.debug && window.debug.hanoi) {
    window.debug.hanoi("Hanoi Demo loaded");
    window.debug.hanoi("Canvas found: " + (hanoiCanvas ? "YES" : "NO"));
    window.debug.hanoi("Button found: " + (hanoiBtn ? "YES" : "NO"));
    window.debug.hanoi("Steps div found: " + (hanoiStepsDiv ? "YES" : "NO"));
  }

  if (!hanoiCanvas || !hanoiCtx || !hanoiBtn || !hanoiStepsDiv) {
    if (window.debug && window.debug.hanoi)
      window.debug.hanoi("ERROR: Missing elements");
    if (hanoiStatus)
      hanoiStatus.textContent += " | Hanoi demo: missing elements";
    return;
  }

  const numDisks = 3;
  const diskColors = ["#F44336", "#FF9800", "#4CAF50", "#2196F3", "#9C27B0"];
  const pegWidth = 10;
  const diskHeight = 30;
  const pegNames = ["Source (A)", "Auxiliary (B)", "Destination (C)"];

  let canvasW, canvasH;
  let pegs = [];
  let moves = [];
  let animationInterval = null;
  let isAnimating = false;

  function initializeHanoi() {
    if (animationInterval) {
      clearInterval(animationInterval);
    }
    isAnimating = false;
    hanoiBtn.disabled = false;
    hanoiBtn.textContent = "Animate (3 Disks)";
    moves = [];
    pegs = [Array.from({ length: numDisks }, (_, i) => numDisks - i), [], []];
    hanoiStepsDiv.innerHTML = 'Click "Animate" to start the simulation.';
    resizeHanoiCanvas();
  }

  function resizeHanoiCanvas() {
    hanoiCanvas.width = hanoiCanvas.clientWidth || 300;
    hanoiCanvas.height = hanoiCanvas.clientHeight || 140;
    canvasW = hanoiCanvas.width;
    canvasH = hanoiCanvas.height;
    if (window.debug && window.debug.hanoi) {
      window.debug.hanoi("Canvas resized: " + canvasW + "x" + canvasH);
    }
    drawHanoi();
  }

  function drawHanoi() {
    hanoiCtx.clearRect(0, 0, canvasW, canvasH);
    hanoiCtx.fillStyle = "#FAFAFA";
    hanoiCtx.fillRect(0, 0, canvasW, canvasH);

    const pegH = canvasH * 0.7;
    const pegY = canvasH * 0.9;
    const baseW = canvasW * 0.9;
    const baseH = 15;

    hanoiCtx.fillStyle = "#607D8B";
    hanoiCtx.fillRect((canvasW - baseW) / 2, pegY, baseW, baseH);

    for (let i = 0; i < 3; i++) {
      const pegX = canvasW * (0.2 + i * 0.3);
      hanoiCtx.fillRect(pegX - pegWidth / 2, pegY - pegH, pegWidth, pegH);

      hanoiCtx.fillStyle = "#263238";
      hanoiCtx.font = "14px sans-serif";
      hanoiCtx.textAlign = "center";
      hanoiCtx.fillText(pegNames[i], pegX, pegY + baseH + 15);

      pegs[i].forEach((diskSize, j) => {
        drawDisk(i, j, diskSize, pegX, pegY, baseH);
      });
    }
  }

  function drawDisk(pegIndex, diskIndex, diskSize, pegX, pegY, baseH) {
    const maxDiskW = (canvasW / 3.5) * 0.7;
    const minDiskW = 20;
    const diskW =
      minDiskW + ((maxDiskW - minDiskW) * (diskSize - 1)) / (numDisks - 1);

    hanoiCtx.fillStyle = diskColors[diskSize - 1] || "#333";
    hanoiCtx.shadowColor = "rgba(0,0,0,0.3)";
    hanoiCtx.shadowBlur = 4;
    hanoiCtx.shadowOffsetY = 2;

    hanoiCtx.fillRect(
      pegX - diskW / 2,
      pegY - baseH - (diskIndex + 1) * diskHeight,
      diskW,
      diskHeight
    );

    hanoiCtx.shadowBlur = 0;
    hanoiCtx.shadowOffsetY = 0;

    hanoiCtx.fillStyle = "white";
    hanoiCtx.font = "bold 16px sans-serif";
    hanoiCtx.textAlign = "center";
    hanoiCtx.textBaseline = "middle";
    hanoiCtx.fillText(
      diskSize,
      pegX,
      pegY - baseH - (diskIndex + 1) * diskHeight + diskHeight / 2
    );
  }

  function hanoi(n, from, to, aux) {
    if (n > 0) {
      hanoi(n - 1, from, aux, to);
      moves.push({ from, to });
      hanoi(n - 1, aux, to, from);
    }
  }

  function animateHanoi() {
    if (!moves.length) {
      isAnimating = false;
      hanoiBtn.disabled = false;
      hanoiBtn.textContent = "Reset";
      if (animationInterval) clearInterval(animationInterval);
      return;
    }

    const move = moves.shift();
    const disk = pegs[move.from].pop();
    pegs[move.to].push(disk);

    drawHanoi();

    const stepText = `Move Disk ${disk} from ${pegNames[move.from]} to ${
      pegNames[move.to]
    }`;
    hanoiStepsDiv.innerHTML += stepText + "<br>";
    hanoiStepsDiv.scrollTop = hanoiStepsDiv.scrollHeight;
  }

  hanoiBtn.addEventListener("click", () => {
    if (window.debug && window.debug.hanoi)
      window.debug.hanoi("Animate button clicked");
    if (isAnimating) return;

    if (hanoiBtn.textContent === "Reset") {
      if (window.debug && window.debug.hanoi)
        window.debug.hanoi("Resetting...");
      initializeHanoi();
      return;
    }

    if (window.debug && window.debug.hanoi)
      window.debug.hanoi("Starting animation...");
    initializeHanoi();
    hanoi(numDisks, 0, 2, 1);
    if (window.debug && window.debug.hanoi)
      window.debug.hanoi("Generated " + moves.length + " moves");

    isAnimating = true;
    hanoiBtn.disabled = true;
    hanoiBtn.textContent = "Animating...";
    hanoiStepsDiv.innerHTML = "";

    animationInterval = setInterval(animateHanoi, 1500);
  });

  window.addEventListener("resize", resizeHanoiCanvas);

  // delay initialization to ensure DOM is ready
  setTimeout(() => {
    initializeHanoi();
    if (hanoiStatus) hanoiStatus.textContent += " | Towers of Hanoi demo ready";
  }, 50);
});
