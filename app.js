let activeTime = 0;
    let totalTime = 0;
    let lastInteraction = Date.now();

    const canvas = document.getElementById("activityCanvas");
    const ctx = canvas.getContext("2d");

    function drawProgress() {
      const progress = activeTime / totalTime;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#4caf50";
      ctx.fillRect(0, 0, canvas.width * progress, canvas.height);
    }

    function updateDisplay() {
      document.getElementById("timeDisplay").textContent = `Active Time: ${activeTime}s`;
      document.getElementById("idleDisplay").textContent = `Idle Time: ${totalTime - activeTime}s`;
    }

    function simulateBackgroundTask() {
      if ("scheduler" in window) {
        scheduler.postTask(() => {
          console.log("[BackgroundTask] Synced active time:", activeTime);
        });
      } else {
        console.log("[Fallback Sync] Active time:", activeTime);
      }
    }

    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
      const netText = connection.effectiveType.includes("2g") || connection.effectiveType.includes("3g")
        ? "🚫 Slow network detected. Sync delayed."
        : `✅ Connected via ${connection.effectiveType}`;
      document.getElementById("networkStatus").textContent = netText;
    } else {
      document.getElementById("networkStatus").textContent = "ℹ️ Network info not supported.";
    }

    const markActive = () => {
      lastInteraction = Date.now();
    };
    window.addEventListener("mousemove", markActive);
    window.addEventListener("keydown", markActive);
    window.addEventListener("scroll", markActive);

    setInterval(() => {
      totalTime++;
      if (Date.now() - lastInteraction < 5000) {
        activeTime++;
      }
      updateDisplay();
      drawProgress();
      if (totalTime % 15 === 0) simulateBackgroundTask();
    }, 1000);

    document.getElementById("toggleDarkMode").addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
    });

    document.getElementById("exportCSV").addEventListener("click", () => {
      const data = `Active Time,Idle Time\n${activeTime},${totalTime - activeTime}`;
      const blob = new Blob([data], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'screen_time_log.csv';
      a.click();
      URL.revokeObjectURL(url);
    });