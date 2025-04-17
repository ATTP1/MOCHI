document.addEventListener("DOMContentLoaded", () => {
  //alert("✅ JS chargé");

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
    timeDisplay.classList.remove("pulse");
    timer = setInterval(() => {
      time++;
      updateDisplay();
      setRingProgress(time);
      updateIndicator(time);
    }, 1000);
  }

  function pauseTimer() {
    isRunning = false;
    clearInterval(timer);
    timeDisplay.classList.add("pulse");
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

    // ✅ STOP et RESET propre, même si en pause
    pauseTimer(); // stoppe le timer s'il roule
    timeDisplay.classList.remove("pulse"); // enlève le clignotement si actif
    resetTimer(); // remet le timer à 0
    timeDisplay.style.color = "#959595"; // couleur repos
  }

  timeDisplay.addEventListener("click", () => {
    console.log("🟢 Time clicked");
    if (isRunning) {
      pauseTimer();
      timeDisplay.style.color = "#ffffff"; // facultatif : changement visuel
    } else {
      startTimer();
      timeDisplay.style.color = "#6385b7"; // facultatif : changement visuel
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
      const taskDiv = document.createElement("div");
      taskDiv.className = "log-task";
      taskDiv.innerHTML = `
        <input type="checkbox" class="log-checkbox" data-index="${index}">
        <div>
          <strong>${task.date}</strong><br/>
          Compagnie : ${task.company}<br/>
          Description : ${task.description}<br/>
          Temps : ${task.duration}
        </div>
      `;
      container.appendChild(taskDiv);
    });

    // 👇 Masquer tout dans appWrapper sauf logView
    Array.from(document.getElementById("appWrapper").children).forEach(
      (child) => {
        if (child.id !== "logView") {
          child.style.display = "none";
        } else {
          child.style.display = "block";
        }
      }
    );
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

  // 🧼 Efface sélectionnées
  document.getElementById("deleteSelectedBtn").addEventListener("click", () => {
    const checkboxes = document.querySelectorAll(".log-checkbox:checked");
    let tasks = JSON.parse(localStorage.getItem("mochiTasks") || "[]");

    const indexesToDelete = Array.from(checkboxes).map((cb) =>
      parseInt(cb.dataset.index)
    );
    tasks = tasks.filter((_, i) => !indexesToDelete.includes(i));

    localStorage.setItem("mochiTasks", JSON.stringify(tasks));
    showLogView(); // refresh
  });

  // 🔙 Retour chrono
  document.getElementById("backToChronoBtn").addEventListener("click", () => {
    // Affiche tous les enfants
    Array.from(document.getElementById("appWrapper").children).forEach(
      (child) => {
        child.style.display = "";
      }
    );

    // Cache uniquement le logView
    document.getElementById("logView").style.display = "none";
  });
});
const indicator = document.getElementById("progress-indicator");
const centerX = 175;
const centerY = 175;
const radiusIndicator = 165;

function updateIndicator(seconds) {
  const angle = (seconds / 3600) * 360; // rotation sur 1h
  const rad = angle * (Math.PI / 180); // décalage pour commencer à 12h
  const x = centerX + radiusIndicator * Math.cos(rad);
  const y = centerY + radiusIndicator * Math.sin(rad);

  indicator.setAttribute("cx", x);
  indicator.setAttribute("cy", y);
}
