const medicalScreens = document.querySelectorAll(".medical-screen");

const resultCorrect = document.getElementById("result-correct");
const resultErrors = document.getElementById("result-errors");
const resultTime = document.getElementById("result-time");

const restartButton = document.getElementById("restart-test");
const downloadResultsButton = document.getElementById("download-results");
const answerCallButton = document.getElementById("answer-call");
const enableSoundButton = document.getElementById("enable-sound");
const repeatMessageButton = document.getElementById("repeat-message");
const continueAfterCallButton = document.getElementById("continue-after-call");
const callStatus = document.getElementById("call-status");
const phaseButtons = document.querySelectorAll("[data-phase]");
const fullPhaseButton = document.querySelector("[data-phase-mode='all']");
const llamadaMedicaAudio = new Audio("../Audio/LlamadaMedica.mp3");
const calendarDaysContainer = document.getElementById("calendar-days");
const calendarMonthLabel = document.getElementById("calendar-month-label");
const calendarQuestionTitle = document.getElementById("calendar-question-title");
const calendarQuestionText = document.getElementById("calendar-question-text");
const calendarFeedback = document.getElementById("calendar-feedback");

llamadaMedicaAudio.preload = "auto";

const calendarState = {
  year: 2026,
  month: 3, // Abril. En JS enero es 0, abril es 3.
  monthName: "Abril",
  correctDay: 6,
  selectedDay: null,
  nextScreen: "screen-question-shift",
  mode: "first-calendar"
};

const gameState = {
  currentPhase: null,
  phaseMode: "single",
  correct: 0,
  errors: 0,
  totalQuestions: 2,
  selectedPreference: null,
  selectedHour: null,
  selectedDate: null,
  selectedFinalDate: null,
  finalTimeMs: 0,
  startTime: null
};

let audioContext = null;
let audioEnabled = false;
let ringtoneInterval = null;
let currentUtterance = null;

function showMedicalScreen(screenId) {
  const targetScreen = document.getElementById(screenId);

  if (!targetScreen) {
    console.error(`No existe la pantalla: ${screenId}`);
    return;
  }

  medicalScreens.forEach((screen) => {
    screen.classList.remove("is-active");
  });

  targetScreen.classList.add("is-active");
}

function renderCalendar() {
  if (!calendarDaysContainer || !calendarMonthLabel) return;

  calendarDaysContainer.innerHTML = "";

  calendarMonthLabel.textContent = `${calendarState.monthName} ${calendarState.year}`;

  const firstDayOfMonth = new Date(calendarState.year, calendarState.month, 1).getDay();

  // Ajuste para que la semana empiece en lunes.
  // getDay(): domingo = 0, lunes = 1...
  const emptyDaysBeforeStart = (firstDayOfMonth + 6) % 7;

  const totalDaysInMonth = new Date(
    calendarState.year,
    calendarState.month + 1,
    0
  ).getDate();

  for (let i = 0; i < emptyDaysBeforeStart; i++) {
    const emptyDay = document.createElement("div");
    emptyDay.className = "calendar-empty-day";
    calendarDaysContainer.appendChild(emptyDay);
  }

  for (let day = 1; day <= totalDaysInMonth; day++) {
    const dayButton = document.createElement("button");

    dayButton.className = "calendar-day";
    dayButton.type = "button";
    dayButton.textContent = day;
    dayButton.dataset.calendarDay = day;

    dayButton.setAttribute("aria-label", `Seleccionar ${day} de ${calendarState.monthName}`);

    calendarDaysContainer.appendChild(dayButton);
  }
}

function startCalendarSelection({
  mode = "first-calendar",
  nextScreen = "screen-question-shift",
  title = "Selecciona el día de la cita",
  text = "Marca en el calendario la fecha que escuchaste durante la llamada."
} = {}) {
  calendarState.mode = mode;
  calendarState.nextScreen = nextScreen;
  calendarState.selectedDay = null;

  if (calendarQuestionTitle) {
    calendarQuestionTitle.textContent = title;
  }

  if (calendarQuestionText) {
    calendarQuestionText.textContent = text;
  }

  if (calendarFeedback) {
    calendarFeedback.textContent = "Selecciona un día para continuar.";
  }

  renderCalendar();
  showMedicalScreen("screen-calendar-date");
}

function handleCalendarDaySelection(button) {
  const selectedDay = Number(button.dataset.calendarDay);
  const isCorrect = selectedDay === calendarState.correctDay;

  calendarState.selectedDay = selectedDay;

if (calendarState.mode === "first-calendar") {
  gameState.selectedDate = `${selectedDay} de ${calendarState.monthName}`;
}

if (calendarState.mode === "final-calendar") {
  gameState.selectedFinalDate = `${selectedDay} de ${calendarState.monthName}`;
}

  const calendarButtons = calendarDaysContainer.querySelectorAll(".calendar-day");

  calendarButtons.forEach((calendarButton) => {
    calendarButton.disabled = true;
  });

  if (isCorrect) {
    gameState.correct++;
    button.classList.add("is-correct");

    if (calendarFeedback) {
      calendarFeedback.textContent = "Fecha seleccionada correctamente.";
    }
  } else {
    gameState.errors++;
    button.classList.add("is-wrong");

    if (calendarFeedback) {
      calendarFeedback.textContent = `La fecha correcta era el ${calendarState.correctDay} de ${calendarState.monthName}.`;
    }
  }

  setTimeout(() => {
    showMedicalScreen(calendarState.nextScreen);
  }, 1200);
}

function createAudioContext() {
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContextClass();
  }

  return audioContext;
}

async function unlockAudio() {
  const context = createAudioContext();

  if (context.state === "suspended") {
    await context.resume();
  }

  audioEnabled = true;
}

function playTone(frequency, duration, delay = 0, volume = 0.14, type = "sine") {
  if (!audioEnabled || !audioContext || audioContext.state !== "running") return;

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  const startTime = audioContext.currentTime + delay;
  const endTime = startTime + duration;

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startTime);

  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, endTime);

  oscillator.connect(gain);
  gain.connect(audioContext.destination);

  oscillator.start(startTime);
  oscillator.stop(endTime + 0.04);
}

function playRingtonePattern() {
  playTone(440, 0.34, 0, 0.13, "sine");
  playTone(480, 0.34, 0.42, 0.13, "sine");

  playTone(440, 0.34, 0.95, 0.13, "sine");
  playTone(480, 0.34, 1.37, 0.13, "sine");
}

function startRingtone() {
  if (!audioEnabled) return;

  stopRingtone();
  playRingtonePattern();

  ringtoneInterval = setInterval(() => {
    playRingtonePattern();
  }, 3000);
}

function stopRingtone() {
  if (ringtoneInterval) {
    clearInterval(ringtoneInterval);
    ringtoneInterval = null;
  }
}

function playConnectSound() {
  playTone(700, 0.12, 0, 0.12, "sine");
  playTone(900, 0.12, 0.16, 0.1, "sine");
}

function playEndSound() {
  playTone(380, 0.16, 0, 0.1, "sine");
}

function playMedicalCallAudio({ goToMessageScreen = false } = {}) {
  if (!continueAfterCallButton) return;

  continueAfterCallButton.disabled = true;

  llamadaMedicaAudio.pause();
  llamadaMedicaAudio.currentTime = 0;

  llamadaMedicaAudio.onended = () => {
    playEndSound();

if (goToMessageScreen) {
  startCalendarSelection({
    mode: "first-calendar",
    nextScreen: "screen-question-shift",
    title: "Selecciona el día de la cita",
    text: "Marca en el calendario la fecha que escuchaste durante la llamada."
  });
}

    continueAfterCallButton.disabled = false;
  };

  llamadaMedicaAudio.onerror = () => {
    console.error("No se pudo cargar el audio LlamadaMedica.mp3");
    callStatus.textContent = "No se pudo reproducir el audio.";
    answerCallButton.disabled = false;
    enableSoundButton.disabled = false;
  };

  llamadaMedicaAudio.play().catch((error) => {
    console.error("El navegador bloqueó la reproducción del audio:", error);
    callStatus.textContent = "Presione nuevamente para reproducir la llamada.";
    answerCallButton.disabled = false;
    enableSoundButton.disabled = false;
  });
}

async function answerCall() {
  answerCallButton.disabled = true;
  enableSoundButton.disabled = true;

  try {
    await unlockAudio();
  } catch (error) {
    console.warn("El navegador bloqueó el audio automático.");
  }

  stopRingtone();
  playConnectSound();

  gameState.startTime = performance.now();

  callStatus.textContent = "Llamada conectada... Escuche la información completa.";

  answerCallButton.classList.remove("is-ringing");
  answerCallButton.classList.add("is-connected");

  if ("vibrate" in navigator) {
    navigator.vibrate([70, 40, 70]);
  }

  setTimeout(() => {
    playMedicalCallAudio({
      goToMessageScreen: true
    });
  }, 850);
}

function resetMedicalTest(targetScreen = "screen-phase-selection") {
  const shouldGoToCall = targetScreen === "screen-call";

  gameState.correct = 0;
  gameState.errors = 0;
  gameState.selectedPreference = null;
  gameState.selectedHour = null;
  gameState.selectedDate = null;
  gameState.selectedFinalDate = null;
  gameState.finalTimeMs = 0;
  gameState.startTime = null;

  if (!shouldGoToCall) {
    gameState.currentPhase = null;
    gameState.phaseMode = "single";
  }

  const buttons = document.querySelectorAll("[data-correct], [data-preference], [data-hour]");

  buttons.forEach((button) => {
    button.disabled = false;
    button.classList.remove("is-correct", "is-wrong", "is-selected");
  });

  if (answerCallButton) {
    answerCallButton.disabled = false;
    answerCallButton.classList.add("is-ringing");
    answerCallButton.classList.remove("is-connected");
  }

  if (enableSoundButton) {
    enableSoundButton.disabled = false;
    enableSoundButton.textContent = audioEnabled ? "🔊 Sonido activo" : "🔊 Activar sonido";
  }

  if (continueAfterCallButton) {
    continueAfterCallButton.disabled = true;
  }

  if (callStatus) {
    callStatus.textContent = "Llamada entrante...";
  }

  stopRingtone();

  llamadaMedicaAudio.pause();
  llamadaMedicaAudio.currentTime = 0;
  llamadaMedicaAudio.onended = null;
  llamadaMedicaAudio.onerror = null;

  if (audioEnabled && shouldGoToCall) {
    startRingtone();
  }

  showMedicalScreen(targetScreen);
}

function startPhase(phaseNumber) {
  gameState.currentPhase = Number(phaseNumber);
  gameState.phaseMode = "single";

  resetMedicalTest("screen-call");

  gameState.currentPhase = Number(phaseNumber);
}

function formatMilliseconds(milliseconds) {
  return `${milliseconds} ms`;
}

function showResults() {
  const finalTime = gameState.startTime
    ? Math.round(performance.now() - gameState.startTime)
    : 0;

  gameState.finalTimeMs = finalTime;

  resultCorrect.textContent = `${gameState.correct}/${gameState.totalQuestions}`;
  resultErrors.textContent = gameState.errors;
  resultTime.textContent = formatMilliseconds(finalTime);

  showMedicalScreen("screen-results");
}

function getPreferenceText(preference) {
  if (preference === "morning") return "Mañana";
  if (preference === "afternoon") return "Tarde";
  return "No registrado";
}

function escapeCSV(value) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

function downloadCSVResults() {
  const now = new Date();

  const rows = [
    [
      "fecha_registro",
      "prueba",
      "preferencia_jornada",
      "horario_elegido",
      "dia_elegido",
      "aciertos",
      "errores",
      "total_preguntas_evaluadas",
      "tiempo_milisegundos"
    ],
    [
      now.toLocaleString("es-CO"),
      "Cita médica",
      getPreferenceText(gameState.selectedPreference),
      gameState.selectedHour || "No registrado",
      gameState.selectedDate || "No registrado",
      gameState.correct,
      gameState.errors,
      gameState.totalQuestions,
      gameState.finalTimeMs
    ]
  ];

  const csvContent = rows
    .map((row) => row.map(escapeCSV).join(";"))
    .join("\n");

  const bom = "\uFEFF";
  const blob = new Blob([bom + csvContent], {
    type: "text/csv;charset=utf-8;"
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `resultado-cita-medica-${Date.now()}.csv`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

function handlePreferenceSelection(button) {
  gameState.selectedPreference = button.dataset.preference;

  const groupButtons = button.parentElement.querySelectorAll("button");

  groupButtons.forEach((option) => {
    option.disabled = true;
  });

  button.classList.add("is-selected");

  setTimeout(() => {
    showMedicalScreen(button.dataset.next);
  }, 500);
}

function handleHourSelection(button) {
  const selectedHour = button.dataset.hour;
  const nextScreen = button.dataset.next;

  gameState.selectedHour = button.textContent.trim();

  const isCorrect = selectedHour === gameState.selectedPreference;

  const groupButtons = button.parentElement.querySelectorAll("button");

  groupButtons.forEach((option) => {
    option.disabled = true;
  });

  if (isCorrect) {
    gameState.correct++;
    button.classList.add("is-correct");
  } else {
    gameState.errors++;
    button.classList.add("is-wrong");
  }

  setTimeout(() => {
    if (nextScreen === "screen-question-date") {
      startCalendarSelection({
        mode: "final-calendar",
        nextScreen: "screen-results",
        title: "Confirma el día de la cita",
        text: "Selecciona nuevamente en el calendario el día de la cita médica."
      });
    } else {
      showMedicalScreen(nextScreen);
    }
  }, 700);
}

function handleCorrectAnswer(button) {
  const isCorrect = button.dataset.correct === "true";
  const nextScreen = button.dataset.next;

  gameState.selectedDate = button.textContent.trim();

  const groupButtons = button.parentElement.querySelectorAll("button");
  groupButtons.forEach((option) => {
    option.disabled = true;
  });

  if (isCorrect) {
    gameState.correct++;
    button.classList.add("is-correct");
  } else {
    gameState.errors++;
    button.classList.add("is-wrong");
  }

  setTimeout(() => {
    if (nextScreen === "screen-results") {
      showResults();
    } else {
      showMedicalScreen(nextScreen);
    }
  }, 700);
}

document.addEventListener("click", (event) => {
  const phaseButton = event.target.closest("[data-phase]");
  const preferenceButton = event.target.closest("[data-preference]");
  const hourButton = event.target.closest("[data-hour]");
  const answerButton = event.target.closest("[data-correct]");
  const nextButton = event.target.closest("[data-next]");
  const calendarDayButton = event.target.closest("[data-calendar-day]");

  if (calendarDayButton) {
  handleCalendarDaySelection(calendarDayButton);
  return;
}

  if (phaseButton && !phaseButton.disabled) {
    startPhase(phaseButton.dataset.phase);
    return;
  }

  if (preferenceButton) {
    handlePreferenceSelection(preferenceButton);
    return;
  }

  if (hourButton) {
    handleHourSelection(hourButton);
    return;
  }

  if (answerButton) {
    handleCorrectAnswer(answerButton);
    return;
  }

  if (nextButton) {
    showMedicalScreen(nextButton.dataset.next);
  }
});

enableSoundButton.addEventListener("click", async () => {
  try {
    await unlockAudio();
    enableSoundButton.textContent = "🔊 Sonido activo";
    startRingtone();
  } catch (error) {
    enableSoundButton.textContent = "Sonido no disponible";
  }
});

answerCallButton.addEventListener("click", answerCall);

repeatMessageButton.addEventListener("click", () => {
  playMedicalCallAudio({
    goToMessageScreen: false
  });
});

restartButton.addEventListener("click", () => {
  resetMedicalTest("screen-call");
});
downloadResultsButton.addEventListener("click", downloadCSVResults);

window.addEventListener("beforeunload", () => {
  stopRingtone();

  llamadaMedicaAudio.pause();
  llamadaMedicaAudio.currentTime = 0;
});

window.addEventListener("load", () => {
  resetMedicalTest("screen-phase-selection");
});