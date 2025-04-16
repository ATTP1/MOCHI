// Convertit les liens en balises <a> cliquables
function linkify(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, function (url) {
    return `<a href="${url}" target="_blank" style="color:#66aaff; text-decoration: underline;">${url}</a>`;
  });
}

// Envoie une question à l'IA et affiche la réponse formatée
async function sendPromptToAI(prompt) {
  const result = await window.api.sendPrompt(prompt);
  document.getElementById("result").innerHTML = linkify(result);
}

// Utilisé quand l'utilisateur envoie une question
async function ask() {
  const prompt = document.getElementById("prompt").value.trim();

  if (prompt === "") {
    // If input is empty, send a predefined fun fact request
    await sendPromptToAI(
      "Donne-moi un trivia sur tout les sujet , sauf animaux. Qui est amusant en 1 phrase."
    );
  } else {
    await sendPromptToAI(prompt);
  }
}

// Envoie la question "Qui es-tu ?" au lancement
window.addEventListener("DOMContentLoaded", () => {
  sendPromptToAI("Qui es-tu ?");
  showWeather(); // aussi déclenché au démarrage
});

// Active "Enter" pour envoyer
document.getElementById("prompt").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    ask();
  }
});

// Hover des lettres
const letters = ["M", "O", "C", "H", "I"];
letters.forEach((letter) => {
  const mainLetter = document.getElementById("letter" + letter);
  const hiddenText = document.getElementById("letter" + letter + "Text");

  if (mainLetter && hiddenText) {
    mainLetter.addEventListener("mouseenter", () => {
      hiddenText.style.color = "#959595";
    });

    mainLetter.addEventListener("mouseleave", () => {
      hiddenText.style.color = "transparent"; // ou transparent selon ton thème
    });
  }
});

function interpretWeatherCode(code) {
  if (code >= 0 && code <= 1) return "sunny";
  if (code === 2) return "mostlyClear";
  if (code === 3) return "partlyCloudy";
  if (code >= 4 && code <= 56) return "cloudy";
  if (code >= 57 && code <= 65) return "rain";
  if (code >= 66 && code <= 77) return "snow";
  if (code >= 95 && code <= 99) return "thunderstorm";
  return "unknown";
}

async function showWeather() {
  const lat = 45.5088;
  const lon = -73.5617;

  const weather = await window.weatherAPI.getCurrent(lat, lon);
  if (weather && !weather.error) {
    const emoji = interpretWeatherCode(weather.weathercode);
    document.querySelector(
      ".meteoSection #weatherTemp"
    ).innerHTML = `${weather.temperature}°C`;

    const iconName = interpretWeatherCode(weather.weathercode);
    document.querySelector(
      ".meteoSection #weatherState"
    ).innerHTML = `<img src="images/meteoIcons/${iconName}.png" alt="${iconName}" width="100" height="80" />`;
  } else {
    console.error("Erreur météo :", weather.message);
  }
}

showWeather();
weatherState;
