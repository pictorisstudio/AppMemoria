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
const shoppingButtons = document.querySelectorAll("[data-shopping]");
const confirmShoppingButton = document.getElementById("confirm-shopping-selection");
const shoppingFeedback = document.getElementById("shopping-feedback");
const medicineButtons = document.querySelectorAll("[data-medicine]");
const confirmMedicineButton = document.getElementById("confirm-medicine-selection");
const medicineFeedback = document.getElementById("medicine-feedback");

const requiredFoods = [
  "tomates",
  "lechugas",
  "alverjas",
  "papas",
  "zanahorias",
  "cebollas",
  "ajo"
];

const requiredShoppingProducts = ["avena", "arroz", "lentejas"];
const requiredMedicines = ["antigripal", "anticoagulante", "pastilla-dormir"];
const multiAnswerFeedbackDelayMs = 3200;

const hourScreenTitle = document.getElementById("hour-screen-title");
const hourQuestionTitle = document.getElementById("hour-question-title");
const hourQuestionText = document.getElementById("hour-question-text");

const phaseButtons = document.querySelectorAll("[data-phase]");
const phaseModeButtons = document.querySelectorAll("[data-phase-mode-option]");
const fullPhaseButton = document.querySelector("[data-phase-mode='all']");
const phaseModeTitle = document.getElementById("phase-mode-title");
const phaseModeDescription = document.getElementById("phase-mode-description");
const appointmentConfirmationModal = document.getElementById("appointment-confirmation-modal");
const appointmentConfirmationDate = document.getElementById("appointment-confirmation-date");
const appointmentConfirmationTime = document.getElementById("appointment-confirmation-time");
const appointmentConfirmationContinue = document.getElementById("appointment-confirmation-continue");
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
    medicalAudio: "../Audio/EPS06Abril.mp3",
    daughterFlow: null
  },

  2: {
    year: 2026,
    month: 3,
    monthName: "Abril",
    correctDay: 6,
    medicalAudio: "../Audio/LlamadaMedica.mp3",
    daughterAudio: "../Audio/LlamadaHija.mp3",
    daughterAudioMorning: "../Audio/LlamaHijaRecuerdo21MayoManiana.mp3",
    daughterAudioAfternoon: "../Audio/LlamaHijaRecuerdo21MayoTarde.mp3",
    daughterFlow: "food"
  },

  3: {
    year: 2026,
    month: 5,
    monthName: "Junio",
    correctDay: 10,
    medicalAudio: "../Audio/EPS10Junio.mp3",
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

const phaseOneDoubleAppointment = {
  year: 2026,
  month: 4,
  monthName: "Mayo",
  correctDay: 13,
  weekdayName: "Miércoles",
  morningHour: "8:00 am",
  afternoonHour: "2:00 pm"
};

const phaseTwoSimpleAppointment = {
  year: 2026,
  month: 4,
  monthName: "Mayo",
  correctDay: 21,
  weekdayName: "Jueves",
  morningHour: "8:00 am",
  afternoonHour: "2:00 pm"
};

const phaseTwoDoubleAppointment = {
  year: 2026,
  month: 5,
  monthName: "Junio",
  correctDay: 2,
  weekdayName: "Martes",
  morningHour: "8:00 am",
  afternoonHour: "2:00 pm"
};

const phaseThreeStructureAAppointment = {
  year: 2026,
  month: 5,
  monthName: "Junio",
  correctDay: 10,
  weekdayName: "Miércoles",
  morningHour: "8:00 am",
  afternoonHour: "2:00 pm"
};

const phaseThreeStructureADoubleAppointment = {
  year: 2026,
  month: 5,
  monthName: "Junio",
  correctDay: 16,
  weekdayName: "Martes",
  morningHour: "8:00 am",
  afternoonHour: "2:00 pm"
};

const gameState = {
  currentPhase: null,
  selectedPhaseForMode: null,
  phaseMode: "single",
  correct: 0,
  errors: 0,
  totalQuestions: 4,
  hourSelectionMode: "first-hour",
  selectedFoods: [],
  selectedShoppingProducts: [],
  selectedMedicines: [],
  selectedDaughterDate: null,
  selectedDaughterHour: null,
  foodAnswerStatus: null,
  shoppingAnswerStatus: null,
  medicineAnswerStatus: null,
  daughterCallStage: null,
  selectedPreference: null,
  selectedHour: null,
  selectedDate: null,
  selectedFinalDate: null,
  selectedFinalHour: null,
  activeQuestionKey: null,
  activeQuestionStartedAt: null,
  questionResults: {},
  questionOrder: [],
  multiSelectTimings: {
    foods: {},
    shopping: {},
    medicines: {}
  },
  finalTimeMs: 0,
  startTime: null
};

let audioContext = null;
let audioEnabled = false;
let ringtoneInterval = null;
let currentUtterance = null;
let daughterCallPlaybackTimeout = null;

function isPhaseOneDouble() {
  return gameState.currentPhase === 1 && gameState.phaseMode === "double";
}

function isPhaseTwoSimple() {
  return gameState.currentPhase === 2 && gameState.phaseMode === "simple";
}

function isPhaseTwoDouble() {
  return gameState.currentPhase === 2 && gameState.phaseMode === "double";
}

function isPhaseThreeStructureA() {
  return gameState.currentPhase === 3;
}

function isPhaseThreeStructureASimple() {
  return gameState.currentPhase === 3 && gameState.phaseMode === "simple";
}

function isPhaseThreeStructureADouble() {
  return gameState.currentPhase === 3 && gameState.phaseMode === "double";
}

function isAppointmentConfirmationFlow() {
  return (
    isPhaseOneDouble() ||
    isPhaseTwoSimple() ||
    isPhaseTwoDouble() ||
    isPhaseThreeStructureA()
  );
}

function getCurrentAppointmentConfig() {
  if (isPhaseThreeStructureADouble()) return phaseThreeStructureADoubleAppointment;
  if (isPhaseThreeStructureA()) return phaseThreeStructureAAppointment;
  if (isPhaseTwoDouble()) return phaseTwoDoubleAppointment;
  if (isPhaseTwoSimple()) return phaseTwoSimpleAppointment;
  return phaseOneDoubleAppointment;
}

function applyCurrentAppointmentCalendarConfig() {
  const appointment = getCurrentAppointmentConfig();

  calendarState.year = appointment.year;
  calendarState.month = appointment.month;
  calendarState.monthName = appointment.monthName;
  calendarState.correctDay = appointment.correctDay;
}

function getAppointmentHourForPreference(preference) {
  const appointment = getCurrentAppointmentConfig();

  return preference === "afternoon"
    ? appointment.afternoonHour
    : appointment.morningHour;
}

function getAppointmentShiftLabel(preference) {
  return preference === "afternoon"
    ? "Jornada de la tarde"
    : "Jornada de la mañana";
}

function getHourButtonText(button) {
  const label = button.querySelector("span:last-child");
  return (label || button).textContent.trim();
}

function openAppointmentConfirmationModal(preference) {
  if (!appointmentConfirmationModal) return;

  const appointment = getCurrentAppointmentConfig();
  const hour = getAppointmentHourForPreference(preference);
  const dateText = `${appointment.weekdayName} ${appointment.correctDay} de ${appointment.monthName.toLowerCase()} de ${appointment.year}`;

  if (appointmentConfirmationDate) {
    appointmentConfirmationDate.textContent = dateText;
  }

  if (appointmentConfirmationTime) {
    appointmentConfirmationTime.textContent = hour;
  }

  appointmentConfirmationModal.classList.add("is-open");
  appointmentConfirmationModal.setAttribute("aria-hidden", "false");

  if (appointmentConfirmationContinue) {
    appointmentConfirmationContinue.focus();
  }
}

function closeAppointmentConfirmationModal() {
  if (!appointmentConfirmationModal) return;

  appointmentConfirmationModal.classList.remove("is-open");
  appointmentConfirmationModal.setAttribute("aria-hidden", "true");
}

function getPhaseTwoDoubleShoppingScript() {
  return "Hola mamá, te llamaba para contarte que amanecí bien. Hoy estoy organizando el almuerzo y luego voy a hacer mercado. Por favor recuerda comprar un paquete de avena, una libra de arroz, una libra de lentejas, azúcar, condimento, salsa de tomate y pan.";
}

function getPhaseTwoDoubleAppointmentScript() {
  const appointment = phaseTwoDoubleAppointment;
  const hour = getAppointmentHourForPreference(gameState.selectedPreference);

  return `Mamá, también me llegó una confirmación de tu cita médica. La cita quedó para el ${appointment.weekdayName.toLowerCase()} ${appointment.correctDay} de ${appointment.monthName.toLowerCase()} de ${appointment.year} a las ${hour}.`;
}

function getPhaseTwoDoubleDaughterScript() {
  return gameState.daughterCallStage === "shopping"
    ? getPhaseTwoDoubleShoppingScript()
    : getPhaseTwoDoubleAppointmentScript();
}

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

  if (screenId === "screen-question-shift") {
    startQuestionTimer("jornada_preferida");
  } else if (screenId === "screen-food-question") {
    startQuestionTimer("alimentos");
  } else if (screenId === "screen-shopping-question") {
    startQuestionTimer("compras");
  } else if (screenId === "screen-medicine-question") {
    startQuestionTimer("medicamentos");
  }
}

const questionLabels = {
  fecha_inicial: "Fecha inicial",
  jornada_preferida: "Jornada elegida",
  hora_preferida: "Hora elegida",
  fecha_confirmacion: "Fecha confirmada",
  hora_confirmacion: "Hora confirmada",
  alimentos: "Alimentos recordados",
  compras: "Compras recordadas",
  medicamentos: "Medicamentos recordados",
  fecha_recordada_hija: "Fecha final recordada",
  hora_recordada_hija: "Hora final recordada"
};

function startQuestionTimer(questionKey) {
  gameState.activeQuestionKey = questionKey;
  gameState.activeQuestionStartedAt = performance.now();
}

function finishQuestionTimer(questionKey, answer, result) {
  const activeQuestionKey = questionKey || gameState.activeQuestionKey;
  const startedAt = gameState.activeQuestionStartedAt;

  if (!activeQuestionKey) return;

  const responseTimeMs = startedAt
    ? Math.round(performance.now() - startedAt)
    : 0;

  if (!gameState.questionResults[activeQuestionKey]) {
    gameState.questionOrder.push(activeQuestionKey);
  }

  gameState.questionResults[activeQuestionKey] = {
    label: questionLabels[activeQuestionKey] || activeQuestionKey,
    answer,
    result,
    responseTimeMs
  };

  gameState.activeQuestionKey = null;
  gameState.activeQuestionStartedAt = null;
}

function getCalendarQuestionKey(mode) {
  if (mode === "final-calendar") return "fecha_confirmacion";
  if (mode === "daughter-final-calendar") return "fecha_recordada_hija";
  return "fecha_inicial";
}

function getHourQuestionKey(mode) {
  if (mode === "final-hour") return "hora_confirmacion";
  if (mode === "daughter-final-hour") return "hora_recordada_hija";
  return "hora_preferida";
}

function getElapsedQuestionTime() {
  return gameState.activeQuestionStartedAt
    ? Math.round(performance.now() - gameState.activeQuestionStartedAt)
    : 0;
}

function getOptionText(button) {
  const label = button.querySelector("span:last-child");
  return (label || button).textContent.trim();
}

function getMultiSelectQuestionKey(groupKey, value) {
  return `${groupKey}_${value.replaceAll("-", "_")}`;
}

function getMultiSelectQuestionLabel(groupLabel, optionText) {
  return `${groupLabel}: ${optionText}`;
}

function recordMultiSelectQuestion(questionKey, label, answer, result, responseTimeMs) {
  if (!gameState.questionResults[questionKey]) {
    gameState.questionOrder.push(questionKey);
  }

  gameState.questionResults[questionKey] = {
    label,
    answer,
    result,
    responseTimeMs
  };
}

function rememberMultiSelectTiming(timingGroup, value, isSelected) {
  if (!gameState.multiSelectTimings[timingGroup]) {
    gameState.multiSelectTimings[timingGroup] = {};
  }

  if (isSelected) {
    gameState.multiSelectTimings[timingGroup][value] = getElapsedQuestionTime();
  } else {
    delete gameState.multiSelectTimings[timingGroup][value];
  }
}

function evaluateMultiSelectItems({
  buttons,
  selectedValues,
  requiredValues,
  timingGroup,
  questionGroupKey,
  questionGroupLabel
}) {
  const selectedSet = new Set(selectedValues);
  const requiredSet = new Set(requiredValues);
  const timings = gameState.multiSelectTimings[timingGroup] || {};
  const confirmTimeMs = getElapsedQuestionTime();
  let correctCount = 0;
  let errorCount = 0;

  buttons.forEach((button) => {
    const value =
      button.dataset.food ||
      button.dataset.shopping ||
      button.dataset.medicine;
    const optionText = getOptionText(button);
    const wasSelected = selectedSet.has(value);
    const isRequired = requiredSet.has(value);

    if (wasSelected && isRequired) {
      correctCount++;
      recordMultiSelectQuestion(
        getMultiSelectQuestionKey(questionGroupKey, value),
        getMultiSelectQuestionLabel(questionGroupLabel, optionText),
        optionText,
        "Correcto",
        timings[value] ?? confirmTimeMs
      );
    } else if (wasSelected && !isRequired) {
      errorCount++;
      recordMultiSelectQuestion(
        getMultiSelectQuestionKey(questionGroupKey, value),
        getMultiSelectQuestionLabel(questionGroupLabel, optionText),
        optionText,
        "Incorrecto",
        timings[value] ?? confirmTimeMs
      );
    } else if (!wasSelected && isRequired) {
      errorCount++;
      recordMultiSelectQuestion(
        getMultiSelectQuestionKey(questionGroupKey, value),
        getMultiSelectQuestionLabel(questionGroupLabel, optionText),
        "No seleccionado",
        "Incorrecto",
        confirmTimeMs
      );
    }
  });

  gameState.correct += correctCount;
  gameState.errors += errorCount;
  gameState.activeQuestionKey = null;
  gameState.activeQuestionStartedAt = null;

  return {
    correctCount,
    errorCount
  };
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
  startQuestionTimer(getCalendarQuestionKey(mode));
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

  finishQuestionTimer(
    getCalendarQuestionKey(calendarState.mode),
    `${selectedDay} de ${calendarState.monthName}`,
    isCorrect ? "Correcto" : "Incorrecto"
  );

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
  if (isAppointmentConfirmationFlow()) {
    applyCurrentAppointmentCalendarConfig();
  }

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
    if (enableSoundButton) {
      enableSoundButton.disabled = false;
    }
  };

  llamadaMedicaAudio.play().catch((error) => {
    console.error("El navegador bloqueó la reproducción del audio:", error);
    callStatus.textContent = "Presione nuevamente para reproducir la llamada.";
    answerCallButton.disabled = false;
    if (enableSoundButton) {
      enableSoundButton.disabled = false;
    }
  });
}

async function answerCall() {
  answerCallButton.disabled = true;
  if (enableSoundButton) {
    enableSoundButton.disabled = true;
  }

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


function startDaughterCallScreen(stage = null) {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }

  if (daughterCallPlaybackTimeout) {
    clearTimeout(daughterCallPlaybackTimeout);
    daughterCallPlaybackTimeout = null;
  }

  gameState.daughterCallStage = stage;

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
    if (isPhaseTwoDouble() && stage === "shopping") {
      daughterCallStatus.textContent = "Llamada entrante de tu hija sobre el mercado...";
    } else if (isPhaseTwoDouble() && stage === "appointment-confirmation") {
      daughterCallStatus.textContent = "Nueva llamada de tu hija para confirmar la cita...";
    } else if (isPhaseThreeStructureADouble()) {
      daughterCallStatus.textContent = "Llamada entrante de tu hija sobre medicamentos...";
    } else {
      daughterCallStatus.textContent =
        gameState.currentPhase === 3 || isPhaseTwoSimple()
          ? "Llamada entrante de tu hija para confirmar la cita..."
          : "Llamada entrante de tu hija...";
    }
  }

  showMedicalScreen("screen-daughter-call");
  startCallSoundAutomatically();
}

function goAfterDaughterCall() {
  if (daughterCallStatus) {
    daughterCallStatus.textContent = "Llamada finalizada.";
  }

  if (isPhaseThreeStructureADouble()) {
    setTimeout(() => {
      showMedicalScreen("screen-medicine-question");
    }, 500);

    return;
  }

  if (isPhaseTwoDouble() && gameState.daughterCallStage === "shopping") {
    setTimeout(() => {
      startDaughterCallScreen("appointment-confirmation");
    }, 500);

    return;
  }

  if (isPhaseTwoDouble() && gameState.daughterCallStage === "appointment-confirmation") {
    goToShoppingQuestion();
    return;
  }

  if (isPhaseTwoSimple()) {
    applyCurrentAppointmentCalendarConfig();

    setTimeout(() => {
      startCalendarSelection({
        mode: "daughter-final-calendar",
        nextScreen: "screen-question-hour",
        title: "Recuerda el día de la cita",
        text: "Tu hija te confirmó la cita médica. Selecciona nuevamente el día en el calendario."
      });
    }, 500);

    return;
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
  if (
    isPhaseTwoDouble() &&
    !["shopping", "appointment-confirmation"].includes(gameState.daughterCallStage)
  ) {
    speakPhaseTwoDoubleDaughterCall();
    return;
  }

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

function speakPhaseTwoDoubleDaughterCall() {
  if (!("speechSynthesis" in window)) {
    if (daughterCallStatus) {
      daughterCallStatus.textContent = "Llamada reproducida. Continúa con la siguiente pantalla.";
    }

    setTimeout(() => {
      goAfterDaughterCall();
    }, 4500);

    return;
  }

  window.speechSynthesis.cancel();

  currentUtterance = new SpeechSynthesisUtterance(getPhaseTwoDoubleDaughterScript());
  currentUtterance.lang = "es-CO";
  currentUtterance.rate = 0.86;
  currentUtterance.pitch = 1;

  currentUtterance.onend = () => {
    playEndSound();
    goAfterDaughterCall();
  };

  currentUtterance.onerror = () => {
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

  window.speechSynthesis.speak(currentUtterance);
}

function goToFoodQuestion() {
  if (daughterCallStatus) {
    daughterCallStatus.textContent = "Llamada finalizada.";
  }

  setTimeout(() => {
    showMedicalScreen("screen-food-question");
  }, 500);
}

function goToShoppingQuestion() {
  if (daughterCallStatus) {
    daughterCallStatus.textContent = "Llamada finalizada.";
  }

  setTimeout(() => {
    showMedicalScreen("screen-shopping-question");
  }, 500);
}

async function answerDaughterCall() {
  if (answerDaughterCallButton) {
    answerDaughterCallButton.disabled = true;
    answerDaughterCallButton.classList.remove("is-ringing");
    answerDaughterCallButton.classList.add("is-connected");
  }

  if (skipDaughterCallButton) {
    skipDaughterCallButton.disabled = false;
  }

  if (daughterCallStatus) {
    daughterCallStatus.textContent =
      isPhaseThreeStructureADouble()
        ? "Llamada conectada... Escucha los medicamentos."
        : isPhaseTwoSimple()
        ? "Llamada conectada... Escucha la confirmación de la cita."
        : "Llamada conectada... Escucha el encargo.";
  }

  try {
    await unlockAudio();
  } catch (error) {
    console.warn("El navegador bloqueó el audio de la llamada de la hija.");
  }

  stopRingtone();
  playConnectSound();

  daughterCallPlaybackTimeout = setTimeout(() => {
    daughterCallPlaybackTimeout = null;
    playDaughterCallAudio();
  }, 850);
}

function skipDaughterCall() {

  stopRingtone();

  if (daughterCallPlaybackTimeout) {
    clearTimeout(daughterCallPlaybackTimeout);
    daughterCallPlaybackTimeout = null;
  }

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
      isPhaseThreeStructureADouble()
        ? "Llamada saltada. Continúa con los medicamentos."
        : gameState.currentPhase === 3 || isPhaseTwoSimple()
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

  rememberMultiSelectTiming(
    "foods",
    food,
    button.classList.contains("is-selected")
  );

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

  evaluateMultiSelectItems({
    buttons: foodButtons,
    selectedValues: selectedFoods,
    requiredValues: requiredFoods,
    timingGroup: "foods",
    questionGroupKey: "alimento",
    questionGroupLabel: "Alimento"
  });

  if (isCorrect) {
    gameState.foodAnswerStatus = "Correcto";

    if (foodFeedback) {
      foodFeedback.textContent = "Alimentos seleccionados correctamente.";
    }
  } else {
    gameState.foodAnswerStatus = "Incorrecto";

    if (foodFeedback) {
      foodFeedback.textContent = "Los alimentos correctos eran: tomates, lechugas, alverjas, papas, zanahorias, cebollas y ajo.";
    }
  }

  if (confirmFoodButton) {
    confirmFoodButton.disabled = true;
  }

  if (isPhaseOneDouble()) {
    applyCurrentAppointmentCalendarConfig();
  }

  setTimeout(() => {
    startCalendarSelection({
      mode: "daughter-final-calendar",
      nextScreen: "screen-question-hour",
      title: "Recuerda el día de la cita",
      text: "Después del encargo familiar, selecciona nuevamente el día de la cita médica."
    });
  }, multiAnswerFeedbackDelayMs);
}

function toggleShoppingSelection(button) {
  const product = button.dataset.shopping;

  button.classList.toggle("is-selected");

  if (button.classList.contains("is-selected")) {
    if (!gameState.selectedShoppingProducts.includes(product)) {
      gameState.selectedShoppingProducts.push(product);
    }
  } else {
    gameState.selectedShoppingProducts = gameState.selectedShoppingProducts.filter(
      (item) => item !== product
    );
  }

  rememberMultiSelectTiming(
    "shopping",
    product,
    button.classList.contains("is-selected")
  );

  if (confirmShoppingButton) {
    confirmShoppingButton.disabled = gameState.selectedShoppingProducts.length === 0;
  }

  if (shoppingFeedback) {
    shoppingFeedback.textContent = `${gameState.selectedShoppingProducts.length} producto(s) seleccionado(s).`;
  }
}

function validateShoppingSelection() {
  const selectedProducts = [...gameState.selectedShoppingProducts];
  const selectedSet = new Set(selectedProducts);
  const requiredSet = new Set(requiredShoppingProducts);

  const hasAllRequired = requiredShoppingProducts.every((product) => selectedSet.has(product));
  const hasOnlyRequired = selectedProducts.every((product) => requiredSet.has(product));
  const isCorrect =
    hasAllRequired &&
    hasOnlyRequired &&
    selectedProducts.length === requiredShoppingProducts.length;

  shoppingButtons.forEach((button) => {
    const product = button.dataset.shopping;
    const wasSelected = selectedSet.has(product);
    const isRequired = requiredSet.has(product);

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

  evaluateMultiSelectItems({
    buttons: shoppingButtons,
    selectedValues: selectedProducts,
    requiredValues: requiredShoppingProducts,
    timingGroup: "shopping",
    questionGroupKey: "compra",
    questionGroupLabel: "Compra"
  });

  if (isCorrect) {
    gameState.shoppingAnswerStatus = "Correcto";

    if (shoppingFeedback) {
      shoppingFeedback.textContent = "Productos seleccionados correctamente.";
    }
  } else {
    gameState.shoppingAnswerStatus = "Incorrecto";

    if (shoppingFeedback) {
      shoppingFeedback.textContent = "Los productos correctos eran: avena, arroz y lentejas.";
    }
  }

  if (confirmShoppingButton) {
    confirmShoppingButton.disabled = true;
  }

  applyCurrentAppointmentCalendarConfig();

  setTimeout(() => {
    startCalendarSelection({
      mode: "daughter-final-calendar",
      nextScreen: "screen-question-hour",
      title: "¿Qué día fue asignada la cita?",
      text: "Selecciona en el calendario el día que fue asignado para la cita."
    });
  }, multiAnswerFeedbackDelayMs);
}

function toggleMedicineSelection(button) {
  const medicine = button.dataset.medicine;

  button.classList.toggle("is-selected");

  if (button.classList.contains("is-selected")) {
    if (!gameState.selectedMedicines.includes(medicine)) {
      gameState.selectedMedicines.push(medicine);
    }
  } else {
    gameState.selectedMedicines = gameState.selectedMedicines.filter((item) => item !== medicine);
  }

  rememberMultiSelectTiming(
    "medicines",
    medicine,
    button.classList.contains("is-selected")
  );

  if (confirmMedicineButton) {
    confirmMedicineButton.disabled = gameState.selectedMedicines.length === 0;
  }

  if (medicineFeedback) {
    medicineFeedback.textContent = `${gameState.selectedMedicines.length} medicamento(s) seleccionado(s).`;
  }
}

function validateMedicineSelection() {
  const selectedMedicines = [...gameState.selectedMedicines];
  const selectedSet = new Set(selectedMedicines);
  const requiredSet = new Set(requiredMedicines);

  const hasAllRequired = requiredMedicines.every((medicine) => selectedSet.has(medicine));
  const hasOnlyRequired = selectedMedicines.every((medicine) => requiredSet.has(medicine));
  const isCorrect =
    hasAllRequired &&
    hasOnlyRequired &&
    selectedMedicines.length === requiredMedicines.length;

  medicineButtons.forEach((button) => {
    const medicine = button.dataset.medicine;
    const wasSelected = selectedSet.has(medicine);
    const isRequired = requiredSet.has(medicine);

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

  evaluateMultiSelectItems({
    buttons: medicineButtons,
    selectedValues: selectedMedicines,
    requiredValues: requiredMedicines,
    timingGroup: "medicines",
    questionGroupKey: "medicamento",
    questionGroupLabel: "Medicamento"
  });

  if (isCorrect) {
    gameState.medicineAnswerStatus = "Correcto";

    if (medicineFeedback) {
      medicineFeedback.textContent = "Medicamentos seleccionados correctamente.";
    }
  } else {
    gameState.medicineAnswerStatus = "Incorrecto";

    if (medicineFeedback) {
      medicineFeedback.textContent =
        "Los medicamentos correctos eran: antigripal, anticoagulante y pastilla para dormir.";
    }
  }

  if (confirmMedicineButton) {
    confirmMedicineButton.disabled = true;
  }

  applyCurrentAppointmentCalendarConfig();

  setTimeout(() => {
    startCalendarSelection({
      mode: "daughter-final-calendar",
      nextScreen: "screen-question-hour",
      title: "¿Qué día fue asignada la cita?",
      text: "Selecciona en el calendario el día que fue asignado para la cita."
    });
  }, multiAnswerFeedbackDelayMs);
}

function resetMedicalTest(targetScreen = "screen-phase-selection") {
  const shouldGoToCall = targetScreen === "screen-call";

  closeAppointmentConfirmationModal();

  gameState.correct = 0;
  gameState.errors = 0;
  gameState.hourSelectionMode = "first-hour";
  gameState.selectedPreference = null;
  gameState.selectedHour = null;
  gameState.selectedDate = null;
  gameState.selectedFinalDate = null;
  gameState.selectedFinalHour = null;
  gameState.activeQuestionKey = null;
  gameState.activeQuestionStartedAt = null;
  gameState.questionResults = {};
  gameState.questionOrder = [];
  gameState.multiSelectTimings = {
    foods: {},
    shopping: {},
    medicines: {}
  };
  gameState.finalTimeMs = 0;
  gameState.startTime = null;
  gameState.selectedFoods = [];
  gameState.selectedShoppingProducts = [];
  gameState.selectedMedicines = [];
  gameState.selectedDaughterDate = null;
  gameState.selectedDaughterHour = null;
  gameState.foodAnswerStatus = null;
  gameState.shoppingAnswerStatus = null;
  gameState.medicineAnswerStatus = null;

  if (!shouldGoToCall) {
    gameState.currentPhase = null;
    gameState.selectedPhaseForMode = null;
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

  shoppingButtons.forEach((button) => {
    button.disabled = false;
    button.classList.remove("is-selected", "is-correct", "is-wrong");
  });

  if (confirmShoppingButton) {
    confirmShoppingButton.disabled = true;
  }

  if (shoppingFeedback) {
    shoppingFeedback.textContent = "Selecciona tres productos y confirma tu respuesta.";
  }

  medicineButtons.forEach((button) => {
    button.disabled = false;
    button.classList.remove("is-selected", "is-correct", "is-wrong");
  });

  if (confirmMedicineButton) {
    confirmMedicineButton.disabled = true;
  }

  if (medicineFeedback) {
    medicineFeedback.textContent = "Selecciona tres medicamentos y confirma tu respuesta.";
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

function getTotalQuestionsForPhase(phaseNumber, phaseMode = gameState.phaseMode) {
  if (Number(phaseNumber) === 3 && phaseMode === "double") return 4;
  if (Number(phaseNumber) === 3) return 3;
  if (Number(phaseNumber) === 2 && phaseMode === "simple") return 3;
  if (Number(phaseNumber) === 2) return 7;
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

  if (isAppointmentConfirmationFlow()) {
    applyCurrentAppointmentCalendarConfig();
  }

  llamadaMedicaAudio.pause();
  llamadaMedicaAudio.currentTime = 0;
  if (isPhaseOneDouble()) {
    llamadaMedicaAudio.src = "../Audio/Eps13Mayo.mp3";
  } else if (isPhaseTwoSimple()) {
    llamadaMedicaAudio.src = "../Audio/Eps21Mayo.mp3";
  } else if (isPhaseTwoDouble()) {
    llamadaMedicaAudio.src = "../Audio/Eps02Junio.mp3";
  } else if (isPhaseThreeStructureADouble()) {
    llamadaMedicaAudio.src = "../Audio/Eps16Junio.mp3";
  } else {
    llamadaMedicaAudio.src = config.medicalAudio;
  }
  llamadaMedicaAudio.load();
}

function showPhaseModeSelection(phaseNumber) {
  const selectedPhase = Number(phaseNumber);
  const config = phaseConfigs[selectedPhase];

  if (!config) return;

  gameState.selectedPhaseForMode = selectedPhase;

  if (phaseModeTitle) {
    phaseModeTitle.textContent = `Fase ${selectedPhase}`;
  }

  if (phaseModeDescription) {
    phaseModeDescription.textContent = "Selecciona fase simple o fase doble para continuar.";
  }

  phaseModeButtons.forEach((button) => {
    const modeName = button.querySelector(".phase-number");

    if (!modeName) return;

    if (selectedPhase === 2) {
      modeName.textContent =
        button.dataset.phaseModeOption === "double"
          ? "Estructura B – tarea doble"
          : "Estructura B – tarea simple";
      return;
    }

    if (selectedPhase === 3) {
      modeName.textContent =
        button.dataset.phaseModeOption === "double"
          ? "Estructura A', tarea doble"
          : "Estructura A', tarea simple";
      return;
    }

    modeName.textContent =
      button.dataset.phaseModeOption === "double"
        ? "Estructura A – Fase doble"
        : "Estructura A – Fase simple";
  });

  showMedicalScreen("screen-phase-mode-selection");
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

  if (isPhaseOneDouble()) {
    llamadaHijaAudio.src = "../Audio/LlamadaHijaVerduras13Mayo.mp3";
  } else if (isPhaseTwoDouble() && gameState.daughterCallStage === "shopping") {
    llamadaHijaAudio.src = "../Audio/LlamaHijaCompras02Junio.mp3";
  } else if (isPhaseTwoDouble() && gameState.daughterCallStage === "appointment-confirmation") {
    llamadaHijaAudio.src =
      gameState.selectedPreference === "afternoon"
        ? "../Audio/LlamaHijaRecuerdo02JunioTarde.mp3"
        : "../Audio/LlamaHijaRecuerdo02JunioManania.mp3";
  } else if (isPhaseThreeStructureADouble()) {
    llamadaHijaAudio.src = "../Audio/LlamadaHijaMedicinas.mp3";
  } else if (gameState.currentPhase === 3 || isPhaseTwoSimple()) {
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

function startPhase(phaseNumber, phaseMode = "simple") {
  const selectedPhase = Number(phaseNumber);

  gameState.currentPhase = selectedPhase;
  gameState.selectedPhaseForMode = selectedPhase;
  gameState.phaseMode = phaseMode;

  resetMedicalTest("screen-call");

  gameState.currentPhase = selectedPhase;
  gameState.selectedPhaseForMode = selectedPhase;
  gameState.phaseMode = phaseMode;
  gameState.totalQuestions = getTotalQuestionsForPhase(selectedPhase, phaseMode);

  applyPhaseConfig(selectedPhase);
  startCallSoundAutomatically();
}

function formatMilliseconds(milliseconds) {
  return `${milliseconds} ms`;
}

function formatElapsedTime(milliseconds) {
  const safeMilliseconds = Math.max(0, Math.round(Number(milliseconds) || 0));
  const minutes = Math.floor(safeMilliseconds / 60000);
  const remainingMilliseconds = safeMilliseconds % 60000;
  const secondsText = (remainingMilliseconds / 1000)
    .toFixed(3)
    .replace(".", ",");

  if (minutes > 0) {
    const paddedSecondsText = secondsText.padStart(6, "0");
    return `${minutes} min ${paddedSecondsText} s`;
  }

  return `${secondsText} s`;
}

function showResults() {
  const finalTime = gameState.startTime
    ? Math.round(performance.now() - gameState.startTime)
    : 0;

  gameState.finalTimeMs = finalTime;
  gameState.totalQuestions = gameState.correct + gameState.errors;

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

function getPhaseStructureText() {
  if (gameState.currentPhase === 2) {
    return gameState.phaseMode === "double"
      ? "Estructura B - tarea doble"
      : "Estructura B - tarea simple";
  }

  if (gameState.currentPhase === 3) {
    return gameState.phaseMode === "double"
      ? "Estructura A' - tarea doble"
      : "Estructura A' - tarea simple";
  }

  return gameState.phaseMode === "double"
    ? "Estructura A - fase doble"
    : "Estructura A - fase simple";
}

function downloadCSVResults() {
  const now = new Date();
  const questionResults = gameState.questionOrder
    .map((questionKey) => gameState.questionResults[questionKey])
    .filter(Boolean);
  const questionHeaders = questionResults.flatMap((question) => [
    `${question.label} - respuesta`,
    `${question.label} - resultado`,
    `${question.label} - tiempo`
  ]);
  const questionValues = questionResults.flatMap((question) => [
    question.answer || "No registrado",
    question.result || "No registrado",
    formatElapsedTime(question.responseTimeMs)
  ]);

  const rows = [
    [
      "fecha_registro",
      "prueba",
      "fase",
      "estructura",
      "aciertos",
      "errores",
      "total_preguntas_evaluadas",
      "tiempo_total",
      ...questionHeaders
    ],
    [
      now.toLocaleString("es-CO"),
      "Cita médica",
      `Fase ${gameState.currentPhase || 1}`,
      getPhaseStructureText(),
      gameState.correct,
      gameState.errors,
      gameState.totalQuestions,
      formatElapsedTime(gameState.finalTimeMs),
      ...questionValues
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
  link.download = `resultado-cita-medica-fase-${gameState.currentPhase || 1}-${gameState.phaseMode}-${Date.now()}.csv`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

function showHourQuestion(mode = "first-hour") {
  gameState.hourSelectionMode = mode;

  const hourButtons = document.querySelectorAll("[data-hour]");
  const isPhaseOneDoubleFinalHour =
    isAppointmentConfirmationFlow() && mode === "daughter-final-hour";

  hourButtons.forEach((button) => {
    button.disabled = false;
    button.classList.remove("is-correct", "is-wrong", "is-selected");

    if (isPhaseOneDoubleFinalHour) {
      const label = button.querySelector("span:last-child");
      const hourText =
        button.dataset.hour === "afternoon"
          ? getCurrentAppointmentConfig().afternoonHour
          : getCurrentAppointmentConfig().morningHour;

      if (label) {
        label.textContent =
          button.dataset.hour === "afternoon"
            ? `Tarde - ${hourText}`
            : `Mañana - ${hourText}`;
      }
    } else {
      const label = button.querySelector("span:last-child");

      if (label) {
        label.textContent =
          button.dataset.hour === "afternoon" ? "4:00 pm" : "10:00 am";
      }
    }
  });

  if (isPhaseOneDoubleFinalHour) {
    if (hourScreenTitle) {
      hourScreenTitle.textContent = "Confirmación final";
    }

    if (hourQuestionTitle) {
      hourQuestionTitle.textContent = "¿Cuál era la jornada y hora de la cita?";
    }

    if (hourQuestionText) {
      hourQuestionText.textContent = "Selecciona la jornada y la hora que se agendó.";
    }
  } else if (mode === "final-hour" || mode === "daughter-final-hour") {
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
  startQuestionTimer(getHourQuestionKey(mode));
}



function handlePreferenceSelection(button) {
  gameState.selectedPreference = button.dataset.preference;
  const selectedPreference = button.dataset.preference;

  const groupButtons = button.parentElement.querySelectorAll("button");

  groupButtons.forEach((option) => {
    option.disabled = true;
  });

  button.classList.add("is-selected");

  finishQuestionTimer(
    "jornada_preferida",
    getPreferenceText(selectedPreference),
    "Registrado"
  );

  if (isAppointmentConfirmationFlow()) {
    const appointment = getCurrentAppointmentConfig();

    gameState.selectedHour =
      selectedPreference === "afternoon"
        ? `Tarde - ${appointment.afternoonHour}`
        : `Mañana - ${appointment.morningHour}`;

    openAppointmentConfirmationModal(selectedPreference);

    return;
  }

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
  const selectedHourText = getHourButtonText(button);
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

    finishQuestionTimer(
      getHourQuestionKey(currentHourMode),
      selectedHourText,
      isCorrect ? "Correcto" : "Incorrecto"
    );

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

  finishQuestionTimer(
    getHourQuestionKey(currentHourMode),
    selectedHourText,
    isCorrect ? "Correcto" : "Incorrecto"
  );

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
  const phaseModeButton = event.target.closest("[data-phase-mode-option]");
  const preferenceButton = event.target.closest("[data-preference]");
  const hourButton = event.target.closest("[data-hour]");
  const answerButton = event.target.closest("[data-correct]");
  const nextButton = event.target.closest("[data-next]");
  const calendarDayButton = event.target.closest("[data-calendar-day]");
  const foodButton = event.target.closest("[data-food]");
  const shoppingButton = event.target.closest("[data-shopping]");
  const medicineButton = event.target.closest("[data-medicine]");
  

  if (calendarDayButton) {
  handleCalendarDaySelection(calendarDayButton);
  return;
}

  if (phaseButton && !phaseButton.disabled) {
    showPhaseModeSelection(phaseButton.dataset.phase);
    return;
  }

  if (phaseModeButton && !phaseModeButton.disabled) {
    startPhase(
      gameState.selectedPhaseForMode || gameState.currentPhase || 1,
      phaseModeButton.dataset.phaseModeOption
    );
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

  if (shoppingButton) {
  toggleShoppingSelection(shoppingButton);
  return;
}

  if (medicineButton) {
  toggleMedicineSelection(medicineButton);
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

if (enableSoundButton) {
  enableSoundButton.addEventListener("click", async () => {
    try {
      await unlockAudio();
      enableSoundButton.textContent = "🔊 Sonido activo";
      startRingtone();
    } catch (error) {
      enableSoundButton.textContent = "Sonido no disponible";
    }
  });
}

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

if (confirmShoppingButton) {
  confirmShoppingButton.addEventListener("click", validateShoppingSelection);
}

if (confirmMedicineButton) {
  confirmMedicineButton.addEventListener("click", validateMedicineSelection);
}

if (appointmentConfirmationContinue) {
  appointmentConfirmationContinue.addEventListener("click", () => {
    closeAppointmentConfirmationModal();

    if (isPhaseThreeStructureASimple()) {
      setTimeout(() => {
        startCalendarSelection({
          mode: "daughter-final-calendar",
          nextScreen: "screen-question-hour",
          title: "¿Qué día fue asignada la cita?",
          text: "Selecciona en el calendario el día que fue asignado para la cita."
        });
      }, 250);

      return;
    }

    if (isPhaseThreeStructureADouble()) {
      setTimeout(() => {
        startDaughterCallScreen("medicines");
      }, 250);

      return;
    }

    if (isPhaseTwoDouble()) {
      setTimeout(() => {
        startDaughterCallScreen("shopping");
      }, 250);

      return;
    }

    setTimeout(() => {
      startDaughterCallScreen();
    }, 250);
  });
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
