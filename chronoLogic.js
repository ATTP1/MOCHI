document.addEventListener("DOMContentLoaded", () => {
  alert("✅ JS chargé");

  let timer = null;
  let time = 0;
  let isRunning = false;

  const timeDisplay = document.getElementById("timeDisplay");
  const startBtn = document.getElementById("startStopBtn");

  const saveBtn = document.getElementById("saveBtn");
  const companySelect = document.getElementById("companySelect");
  const descInput = document.getElementById("taskDescription");

  function formatTime(seconds) {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");

    return `${h}:${m}:${s}`;
  }

  function updateDisplay() {
    timeDisplay.textContent = formatTime(time);
  }

  function startTimer() {
    if (isRunning) return;
    isRunning = true;
    timer = setInterval(() => {
      time++;
      updateDisplay();
      setRingProgress(time); // met à jour l'animation du cercle
    }, 1000);
  }

  function pauseTimer() {
    isRunning = false;
    clearInterval(timer);
  }

  function resetTimer() {
    time = 0;
    updateDisplay();
  }

  function saveTask() {
    const desc = descInput.value.trim();
    const company = companySelect.value;
    if (!desc) return alert("Ajoute une description.");
    const date = new Date().toLocaleString();

    const task = {
      description: desc,
      duration: formatTime(time),
      company,
      date,
    };

    const tasks = JSON.parse(localStorage.getItem("mochiTasks") || "[]");
    tasks.push(task);
    localStorage.setItem("mochiTasks", JSON.stringify(tasks));

    alert("Tâche sauvegardée !");
    resetTimer();
    descInput.value = "";
  }

  timeDisplay.addEventListener("click", () => {
    console.log("🟢 Time clicked");
    if (isRunning) {
      pauseTimer();
      timeDisplay.style.color = "#ffffff"; // facultatif : changement visuel
    } else {
      startTimer();
      timeDisplay.style.color = "#66ff66"; // facultatif : changement visuel
    }
  });

  saveBtn.addEventListener("click", saveTask);

  // 📒 Vue Journal
  function showLogView() {
    const container = document.getElementById("taskListContainer");
    const tasks = JSON.parse(localStorage.getItem("mochiTasks") || "[]");
    container.innerHTML = "";

    if (tasks.length === 0) {
      container.innerHTML = "<p>Aucune tâche enregistrée.</p>";
      return;
    }

    tasks.forEach((task, index) => {
      const div = document.createElement("div");
      div.innerHTML = `
      <p>${task.date} | ${task.company} | ${task.description} - ${task.duration}
        <button onclick="deleteTask(${index})">🗑️</button>
      </p>`;
      container.appendChild(div);
    });

    document.getElementById("chronoView").style.display = "none";
    document.getElementById("logView").style.display = "block";
  }

  function clearLogView() {
    document.getElementById("logView").style.display = "none";
    document.getElementById("chronoView").style.display = "block";
  }

  document.getElementById("goToLogBtn").addEventListener("click", showLogView);

  // 🗑️ Supprimer une tâche
  function deleteTask(index) {
    const tasks = JSON.parse(localStorage.getItem("mochiTasks") || "[]");
    tasks.splice(index, 1);
    localStorage.setItem("mochiTasks", JSON.stringify(tasks));
    showLogView(); // refresh
  }

  // 📤 Export CSV
  function exportToCSV() {
    const tasks = JSON.parse(localStorage.getItem("mochiTasks") || "[]");
    if (tasks.length === 0) return alert("Aucune tâche à exporter.");

    const header = "Date;Entreprise;Description;Durée\n";
    const rows = tasks
      .map((t) => `${t.date};${t.company};${t.description};${t.duration}`)
      .join("\n");

    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "taches_mochi.csv");
    link.click();
  }

  const ring = document.querySelector(".progress-ring");
  const radius = ring.r.baseVal.value;
  const circumference = 2 * Math.PI * radius;

  ring.style.strokeDasharray = `${circumference} ${circumference}`;
  ring.style.strokeDashoffset = circumference;

  function setRingProgress(seconds) {
    const percent = Math.min(seconds / 3600, 1); // 1h max
    const offset = circumference - percent * circumference;
    ring.style.strokeDashoffset = offset;
  }
});
