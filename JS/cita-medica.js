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
const skipCallButton = document.getElementById("skip-call");
const answerDaughterCallButton = document.getElementById("answer-daughter-call");
const skipDaughterCallButton = document.getElementById("skip-daughter-call");
const daughterCallStatus = document.getElementById("daughter-call-status");

const foodButtons = document.querySelectorAll("[data-food]");
const confirmFoodButton = document.getElementById("confirm-food-selection");
const foodFeedback = document.getElementById("food-feedback");

const requiredFoods = [
  "tomates",
  "lechugas",
  "alverjas",
  "papas",
  "zanahorias",
  "cebollas",
  "ajo"
];

const hourScreenTitle = document.getElementById("hour-screen-title");
const hourQuestionTitle = document.getElementById("hour-question-title");
const hourQuestionText = document.getElementById("hour-question-text");

const phaseButtons = document.querySelectorAll("[data-phase]");
const fullPhaseButton = document.querySelector("[data-phase-mode='all']");
const llamadaMedicaAudio = new Audio("../Audio/LlamadaMedica.mp3");
const llamadaHijaAudio = new Audio("../Audio/LlamadaHija.mp3");
const calendarDaysContainer = document.getElementById("calendar-days");
const calendarMonthLabel = document.getElementById("calendar-month-label");
const calendarQuestionTitle = document.getElementById("calendar-question-title");
const calendarQuestionText = document.getElementById("calendar-question-text");
const calendarFeedback = document.getElementById("calendar-feedback");

const phaseConfigs = {
  1: {
    year: 2026,
    month: 3,
    monthName: "Abril",
    correctDay: 6,
    medicalAudio: "../Audio/LlamadaMedica.mp3",
    daughterFlow: null
  },

  2: {
    year: 2026,
    month: 3,
    monthName: "Abril",
    correctDay: 6,
    medicalAudio: "../Audio/LlamadaMedica.mp3",
    daughterAudio: "../Audio/LlamadaHija.mp3",
    daughterFlow: "food"
  },

  3: {
    year: 2026,
    month: 4,
    monthName: "Mayo",
    correctDay: 21,
    medicalAudio: "../Audio/LlamadaMedicaFase3.mp3",
    daughterAudioMorning: "../Audio/LlamadaHijaFase3Manana.mp3",
    daughterAudioAfternoon: "../Audio/LlamadaHijaFase3Tarde.mp3",
    daughterFlow: "reminder"
  }
};

llamadaMedicaAudio.preload = "auto";
llamadaHijaAudio.preload = "auto";

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
  totalQuestions: 4,
  hourSelectionMode: "first-hour",
  selectedFoods: [],
  selectedDaughterDate: null,
  selectedDaughterHour: null,
  foodAnswerStatus: null,
  selectedPreference: null,
  selectedHour: null,
  selectedDate: null,
  selectedFinalDate: null,
  selectedFinalHour: null,
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

if (calendarState.mode === "daughter-final-calendar") {
  gameState.selectedDaughterDate = `${selectedDay} de ${calendarState.monthName}`;
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
    if (
      calendarState.mode === "final-calendar" &&
      calendarState.nextScreen === "screen-question-hour"
    ) {
      showHourQuestion("final-hour");
    } else if (
      calendarState.mode === "daughter-final-calendar" &&
      calendarState.nextScreen === "screen-question-hour"
    ) {
      showHourQuestion("daughter-final-hour");
    } else {
      showMedicalScreen(calendarState.nextScreen);
    }
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

async function startCallSoundAutomatically() {
  try {
    await unlockAudio();

    if (enableSoundButton) {
      enableSoundButton.textContent = "🔊 Sonido activo";
    }

    startRingtone();
  } catch (error) {
    console.warn("El navegador no permitió activar el audio automáticamente.");
  }
}

function playConnectSound() {
  playTone(700, 0.12, 0, 0.12, "sine");
  playTone(900, 0.12, 0.16, 0.1, "sine");
}

function playEndSound() {
  playTone(380, 0.16, 0, 0.1, "sine");
}

function goToFirstCalendar() {
  startCalendarSelection({
    mode: "first-calendar",
    nextScreen: "screen-question-shift",
    title: "Selecciona el día de la cita",
    text: "Marca en el calendario la fecha que escuchaste durante la llamada."
  });
}

function skipMedicalCall() {
  stopRingtone();

  llamadaMedicaAudio.pause();
  llamadaMedicaAudio.currentTime = 0;
  llamadaMedicaAudio.onended = null;
  llamadaMedicaAudio.onerror = null;

  if (!gameState.startTime) {
    gameState.startTime = performance.now();
  }

  if (answerCallButton) {
    answerCallButton.disabled = true;
    answerCallButton.classList.remove("is-ringing");
    answerCallButton.classList.add("is-connected");
  }

  if (enableSoundButton) {
    enableSoundButton.disabled = true;
  }

  if (skipCallButton) {
    skipCallButton.disabled = true;
  }

  if (callStatus) {
    callStatus.textContent = "Llamada saltada. Continúa con la selección de fecha.";
  }

  setTimeout(() => {
    goToFirstCalendar();
  }, 500);
}

function playMedicalCallAudio({ goToMessageScreen = false } = {}) {
  if (!continueAfterCallButton) return;

  continueAfterCallButton.disabled = true;

  llamadaMedicaAudio.pause();
  llamadaMedicaAudio.currentTime = 0;

  llamadaMedicaAudio.onended = () => {
    playEndSound();

if (goToMessageScreen) {
  goToFirstCalendar();
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


function startDaughterCallScreen() {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }

  setDaughterAudioForCurrentPhase();

  llamadaHijaAudio.pause();
  llamadaHijaAudio.currentTime = 0;
  llamadaHijaAudio.onended = null;
  llamadaHijaAudio.onerror = null;

  if (answerDaughterCallButton) {
    answerDaughterCallButton.disabled = false;
    answerDaughterCallButton.classList.add("is-ringing");
    answerDaughterCallButton.classList.remove("is-connected");
  }

  if (skipDaughterCallButton) {
    skipDaughterCallButton.disabled = false;
  }

  if (daughterCallStatus) {
    daughterCallStatus.textContent =
      gameState.currentPhase === 3
        ? "Llamada entrante de tu hija para recordarte la cita..."
        : "Llamada entrante de tu hija...";
  }

  showMedicalScreen("screen-daughter-call");
  startCallSoundAutomatically();
}

function goAfterDaughterCall() {
  if (daughterCallStatus) {
    daughterCallStatus.textContent = "Llamada finalizada.";
  }

  if (gameState.currentPhase === 3) {
    setTimeout(() => {
      startCalendarSelection({
        mode: "daughter-final-calendar",
        nextScreen: "screen-question-hour",
        title: "Recuerda el día de la cita",
        text: "Tu hija te recordó la cita médica. Selecciona nuevamente el día en el calendario."
      });
    }, 500);

    return;
  }

  goToFoodQuestion();
}

function playDaughterCallAudio() {
  llamadaHijaAudio.pause();
  llamadaHijaAudio.currentTime = 0;

  llamadaHijaAudio.onended = () => {
    playEndSound();
    goAfterDaughterCall();
  };

  llamadaHijaAudio.onerror = () => {
    console.error("No se pudo cargar el audio LlamadaHija.mp3");

    if (daughterCallStatus) {
      daughterCallStatus.textContent = "No se pudo reproducir la llamada de tu hija.";
    }

    if (answerDaughterCallButton) {
      answerDaughterCallButton.disabled = false;
    }

    if (skipDaughterCallButton) {
      skipDaughterCallButton.disabled = false;
    }
  };

  llamadaHijaAudio.play().catch((error) => {
    console.error("El navegador bloqueó la llamada de la hija:", error);

    if (daughterCallStatus) {
      daughterCallStatus.textContent = "Presiona nuevamente para escuchar la llamada.";
    }

    if (answerDaughterCallButton) {
      answerDaughterCallButton.disabled = false;
    }

    if (skipDaughterCallButton) {
      skipDaughterCallButton.disabled = false;
    }
  });
}

function goToFoodQuestion() {
  if (daughterCallStatus) {
    daughterCallStatus.textContent = "Llamada finalizada.";
  }

  setTimeout(() => {
    showMedicalScreen("screen-food-question");
  }, 500);
}

async function answerDaughterCall() {
  if (answerDaughterCallButton) {
    answerDaughterCallButton.disabled = true;
    answerDaughterCallButton.classList.remove("is-ringing");
    answerDaughterCallButton.classList.add("is-connected");
  }

  if (skipDaughterCallButton) {
    skipDaughterCallButton.disabled = true;
  }

  if (daughterCallStatus) {
    daughterCallStatus.textContent = "Llamada conectada... Escucha el encargo.";
  }

  try {
    await unlockAudio();
  } catch (error) {
    console.warn("El navegador bloqueó el audio de la llamada de la hija.");
  }

  stopRingtone();
  playConnectSound();

  setTimeout(() => {
    playDaughterCallAudio();
  }, 850);
}

function skipDaughterCall() {

  stopRingtone();

llamadaHijaAudio.pause();
llamadaHijaAudio.currentTime = 0;
llamadaHijaAudio.onended = null;
llamadaHijaAudio.onerror = null;

  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }

  if (answerDaughterCallButton) {
    answerDaughterCallButton.disabled = true;
    answerDaughterCallButton.classList.remove("is-ringing");
    answerDaughterCallButton.classList.add("is-connected");
  }

  if (skipDaughterCallButton) {
    skipDaughterCallButton.disabled = true;
  }

  if (daughterCallStatus) {
    daughterCallStatus.textContent =
      gameState.currentPhase === 3
        ? "Llamada saltada. Continúa con la fecha de la cita."
        : "Llamada saltada. Continúa con los alimentos.";
  }

  goAfterDaughterCall();
}

function toggleFoodSelection(button) {
  const food = button.dataset.food;

  button.classList.toggle("is-selected");

  if (button.classList.contains("is-selected")) {
    if (!gameState.selectedFoods.includes(food)) {
      gameState.selectedFoods.push(food);
    }
  } else {
    gameState.selectedFoods = gameState.selectedFoods.filter((item) => item !== food);
  }

  if (confirmFoodButton) {
    confirmFoodButton.disabled = gameState.selectedFoods.length === 0;
  }

  if (foodFeedback) {
    foodFeedback.textContent = `${gameState.selectedFoods.length} alimento(s) seleccionado(s).`;
  }
}

function validateFoodSelection() {
  const selectedFoods = [...gameState.selectedFoods];
  const selectedSet = new Set(selectedFoods);
  const requiredSet = new Set(requiredFoods);

  const hasAllRequired = requiredFoods.every((food) => selectedSet.has(food));
  const hasOnlyRequired = selectedFoods.every((food) => requiredSet.has(food));
  const isCorrect = hasAllRequired && hasOnlyRequired && selectedFoods.length === requiredFoods.length;

  foodButtons.forEach((button) => {
    const food = button.dataset.food;
    const wasSelected = selectedSet.has(food);
    const isRequired = requiredSet.has(food);

    button.disabled = true;

    if (wasSelected && isRequired) {
      button.classList.add("is-correct");
    }

    if (wasSelected && !isRequired) {
      button.classList.add("is-wrong");
    }

    if (!wasSelected && isRequired) {
      button.classList.add("is-wrong");
    }
  });

  if (isCorrect) {
    gameState.correct++;
    gameState.foodAnswerStatus = "Correcto";

    if (foodFeedback) {
      foodFeedback.textContent = "Alimentos seleccionados correctamente.";
    }
  } else {
    gameState.errors++;
    gameState.foodAnswerStatus = "Incorrecto";

    if (foodFeedback) {
      foodFeedback.textContent = "Los alimentos correctos eran: tomates, lechugas, alverjas, papas, zanahorias, cebollas y ajo.";
    }
  }

  if (confirmFoodButton) {
    confirmFoodButton.disabled = true;
  }

  setTimeout(() => {
    startCalendarSelection({
      mode: "daughter-final-calendar",
      nextScreen: "screen-question-hour",
      title: "Recuerda el día de la cita",
      text: "Después del encargo familiar, selecciona nuevamente el día de la cita médica."
    });
  }, 1400);
}

function resetMedicalTest(targetScreen = "screen-phase-selection") {
  const shouldGoToCall = targetScreen === "screen-call";

  gameState.correct = 0;
  gameState.errors = 0;
  gameState.hourSelectionMode = "first-hour";
  gameState.selectedPreference = null;
  gameState.selectedHour = null;
  gameState.selectedDate = null;
  gameState.selectedFinalDate = null;
  gameState.selectedFinalHour = null;
  gameState.finalTimeMs = 0;
  gameState.startTime = null;
  gameState.selectedFoods = [];
  gameState.selectedDaughterDate = null;
  gameState.selectedDaughterHour = null;
  gameState.foodAnswerStatus = null;

  if (!shouldGoToCall) {
    gameState.currentPhase = null;
    gameState.phaseMode = "single";
  }

const buttons = document.querySelectorAll("[data-correct], [data-preference], [data-hour]");  buttons.forEach((button) => {
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

  if (skipCallButton) {
  skipCallButton.disabled = false;
  }

  if (continueAfterCallButton) {
    continueAfterCallButton.disabled = true;
  }

  if (callStatus) {
    callStatus.textContent = "Llamada entrante...";
  }


  foodButtons.forEach((button) => {
  button.disabled = false;
  button.classList.remove("is-selected", "is-correct", "is-wrong");
  });

  if (confirmFoodButton) {
    confirmFoodButton.disabled = true;
  }

  if (foodFeedback) {
    foodFeedback.textContent = "Selecciona los alimentos y confirma tu respuesta.";
  }

  if (answerDaughterCallButton) {
    answerDaughterCallButton.disabled = false;
    answerDaughterCallButton.classList.add("is-ringing");
    answerDaughterCallButton.classList.remove("is-connected");
  }

  if (skipDaughterCallButton) {
    skipDaughterCallButton.disabled = false;
  }

  if (daughterCallStatus) {
    daughterCallStatus.textContent = "Llamada entrante de tu hija...";
  }

  stopRingtone();

  llamadaMedicaAudio.pause();
  llamadaMedicaAudio.currentTime = 0;
  llamadaMedicaAudio.onended = null;
  llamadaMedicaAudio.onerror = null;

  llamadaHijaAudio.pause();
  llamadaHijaAudio.currentTime = 0;
  llamadaHijaAudio.onended = null;
  llamadaHijaAudio.onerror = null;

  if (audioEnabled && shouldGoToCall) {
    startRingtone();
  }

  showMedicalScreen(targetScreen);
}

function getTotalQuestionsForPhase(phaseNumber) {
  if (Number(phaseNumber) === 2) return 7;
  if (Number(phaseNumber) === 3) return 6;
  return 4;
}

function getCurrentPhaseConfig() {
  return phaseConfigs[gameState.currentPhase] || phaseConfigs[1];
}

function applyPhaseConfig(phaseNumber) {
  const config = phaseConfigs[phaseNumber] || phaseConfigs[1];

  calendarState.year = config.year;
  calendarState.month = config.month;
  calendarState.monthName = config.monthName;
  calendarState.correctDay = config.correctDay;

  llamadaMedicaAudio.pause();
  llamadaMedicaAudio.currentTime = 0;
  llamadaMedicaAudio.src = config.medicalAudio;
  llamadaMedicaAudio.load();
}

function getSelectedShiftText() {
  if (gameState.selectedPreference === "morning") return "mañana";
  if (gameState.selectedPreference === "afternoon") return "tarde";
  return "jornada seleccionada";
}

function setDaughterAudioForCurrentPhase() {
  const config = getCurrentPhaseConfig();

  llamadaHijaAudio.pause();
  llamadaHijaAudio.currentTime = 0;

  if (gameState.currentPhase === 3) {
    const daughterAudio =
      gameState.selectedPreference === "afternoon"
        ? config.daughterAudioAfternoon
        : config.daughterAudioMorning;

    llamadaHijaAudio.src = daughterAudio;
  } else {
    llamadaHijaAudio.src = config.daughterAudio || "../Audio/LlamadaHija.mp3";
  }

  llamadaHijaAudio.load();
}

function startPhase(phaseNumber) {
  const selectedPhase = Number(phaseNumber);

  gameState.currentPhase = selectedPhase;
  gameState.phaseMode = "single";

  resetMedicalTest("screen-call");

  gameState.currentPhase = selectedPhase;
  gameState.phaseMode = "single";
  gameState.totalQuestions = getTotalQuestionsForPhase(selectedPhase);

  applyPhaseConfig(selectedPhase);
  startCallSoundAutomatically();
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
      "fase",
      "preferencia_jornada",
      "horario_elegido",
      "dia_elegido_calendario_1",
      "dia_elegido_calendario_2",
      "hora_final_elegida",
      "alimentos_seleccionados",
      "alimentos_correctos",
      "resultado_alimentos",
      "dia_elegido_calendario_3",
      "hora_final_fase_2",
      "aciertos",
      "errores",
      "total_preguntas_evaluadas",
      "tiempo_milisegundos"
    ],
    [
      now.toLocaleString("es-CO"),
      "Cita médica",
      `Fase ${gameState.currentPhase || 1}`,
      getPreferenceText(gameState.selectedPreference),
      gameState.selectedHour || "No registrado",
      gameState.selectedDate || "No registrado",
      gameState.selectedFinalDate || "No registrado",
      gameState.selectedFinalHour || "No registrado",
      gameState.selectedFoods.join(", ") || "No registrado",
      requiredFoods.join(", "),
      gameState.foodAnswerStatus || "No aplica",
      gameState.selectedDaughterDate || "No aplica",
      gameState.selectedDaughterHour || "No aplica",
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

function showHourQuestion(mode = "first-hour") {
  gameState.hourSelectionMode = mode;

  const hourButtons = document.querySelectorAll("[data-hour]");

  hourButtons.forEach((button) => {
    button.disabled = false;
    button.classList.remove("is-correct", "is-wrong", "is-selected");
  });

  if (mode === "final-hour" || mode === "daughter-final-hour") {
    if (hourScreenTitle) {
      hourScreenTitle.textContent =
        mode === "daughter-final-hour"
          ? "Confirmación final"
          : "Última pregunta";
    }

    if (hourQuestionTitle) {
      hourQuestionTitle.textContent =
        mode === "daughter-final-hour"
          ? "¿Qué hora tenía la cita recordada por tu hija?"
          : "¿Qué hora escogió para la cita?";
    }

    if (hourQuestionText) {
      hourQuestionText.textContent =
        mode === "daughter-final-hour"
          ? "Selecciona la misma hora que habías elegido anteriormente."
          : "Selecciona la misma hora que elegiste anteriormente.";
    }
  } else {
    if (hourScreenTitle) {
      hourScreenTitle.textContent = "Pregunta 2";
    }

    if (hourQuestionTitle) {
      hourQuestionTitle.textContent = "¿En qué horario prefiere?";
    }

    if (hourQuestionText) {
      hourQuestionText.textContent = "Selecciona el horario de la cita.";
    }
  }

  showMedicalScreen("screen-question-hour");
}



function handlePreferenceSelection(button) {
  gameState.selectedPreference = button.dataset.preference;

  const groupButtons = button.parentElement.querySelectorAll("button");

  groupButtons.forEach((option) => {
    option.disabled = true;
  });

  button.classList.add("is-selected");

  setTimeout(() => {
    if (button.dataset.next === "screen-question-hour") {
      showHourQuestion("first-hour");
    } else {
      showMedicalScreen(button.dataset.next);
    }
  }, 500);
}

function handleHourSelection(button) {
  const selectedHourPeriod = button.dataset.hour;
  const selectedHourText = button.textContent.trim();
  const currentHourMode = gameState.hourSelectionMode;

  const groupButtons = button.parentElement.querySelectorAll("button");

  groupButtons.forEach((option) => {
    option.disabled = true;
  });

  if (currentHourMode === "final-hour" || currentHourMode === "daughter-final-hour") {
    const isCorrect = selectedHourText === gameState.selectedHour;

    if (currentHourMode === "daughter-final-hour") {
      gameState.selectedDaughterHour = selectedHourText;
    } else {
      gameState.selectedFinalHour = selectedHourText;
    }

    if (isCorrect) {
      gameState.correct++;
      button.classList.add("is-correct");
    } else {
      gameState.errors++;
      button.classList.add("is-wrong");
    }

    setTimeout(() => {
      if (currentHourMode === "final-hour" &&    (gameState.currentPhase === 2 || gameState.currentPhase === 3) ) {
        startDaughterCallScreen();
      } else {
        showResults();
      }
    }, 700);

    return;
  }

  gameState.selectedHour = selectedHourText;

  const isCorrect = selectedHourPeriod === gameState.selectedPreference;

  if (isCorrect) {
    gameState.correct++;
    button.classList.add("is-correct");
  } else {
    gameState.errors++;
    button.classList.add("is-wrong");
  }

  setTimeout(() => {
    startCalendarSelection({
      mode: "final-calendar",
      nextScreen: "screen-question-hour",
      title: "Confirma el día de la cita",
      text: "Selecciona nuevamente en el calendario el día de la cita médica."
    });
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
  const foodButton = event.target.closest("[data-food]");
  

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

  if (foodButton) {
  toggleFoodSelection(foodButton);
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

skipCallButton.addEventListener("click", skipMedicalCall);

if (answerDaughterCallButton) {
  answerDaughterCallButton.addEventListener("click", answerDaughterCall);
}

if (skipDaughterCallButton) {
  skipDaughterCallButton.addEventListener("click", skipDaughterCall);
}

if (confirmFoodButton) {
  confirmFoodButton.addEventListener("click", validateFoodSelection);
}

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

  llamadaHijaAudio.pause();
  llamadaHijaAudio.currentTime = 0;
});

window.addEventListener("load", () => {
  resetMedicalTest("screen-phase-selection");
});