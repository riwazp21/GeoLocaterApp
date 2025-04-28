let selectedCSV = "";

document.getElementById("uploadCSV").addEventListener("click", async () => {
  const filePath = await window.electronAPI.selectCSV();
  if (filePath) {
    selectedCSV = filePath;
    document.getElementById("fileName").textContent = filePath.split("/").pop();
  }
});

document.getElementById("geolocateBtn").addEventListener("click", async () => {
  const apiKey = document.getElementById("apiKey").value.trim();
  if (!apiKey || !selectedCSV) {
    alert("Please enter a valid API key and select a CSV file.");
    return;
  }

  const progress = document.getElementById("progressBar");
  progress.style.display = "block";
  progress.value = 0;

  // Simulated progress bar
  let fakeProgress = 0;
  const interval = setInterval(() => {
    if (fakeProgress < 90) {
      fakeProgress += 5;
      progress.value = fakeProgress;
    }
  }, 200);

  try {
    const outputPath = await window.electronAPI.geolocateCSV({
      filePath: selectedCSV,
      apiKey,
    });

    clearInterval(interval);
    progress.value = 100;

    const link = document.getElementById("downloadLink");
    link.href = `file://${outputPath}`;
    link.style.display = "block";
  } catch (err) {
    console.error(err);
    alert("Failed to geolocate.");
    progress.style.display = "none";
    document.getElementById("downloadLink").style.display = "none";
    alert(err.message || "An error occurred while processing.");
  }
});
