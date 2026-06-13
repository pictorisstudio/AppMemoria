const sceneScreens = document.querySelectorAll(".scene-screen");
const sceneModeButtons = document.querySelectorAll("[data-scene-mode]");
const repeatInstructionButton = document.getElementById("repeat-instruction");
const restartSceneButton = document.getElementById("restart-scene");
const downloadSceneResultsButton = document.getElementById("download-scene-results");
const tableScene = document.getElementById("table-scene");
const tableHotspots = document.getElementById("table-hotspots");
const sceneStatus = document.getElementById("scene-status");
const sceneInstruction = document.getElementById("scene-instruction");
const sceneFoundCount = document.getElementById("scene-found-count");
const sceneSequence = document.getElementById("scene-sequence");
const weatherQuestion = document.getElementById("weather-question");
const weatherQuestionText = document.getElementById("weather-question-text");
const weatherFeedback = document.getElementById("weather-feedback");
const sceneInstructionAudio = new Audio();

const resultCorrect = document.getElementById("result-correct");
const resultErrors = document.getElementById("result-errors");
const resultTime = document.getElementById("result-time");

sceneInstructionAudio.preload = "auto";

const sceneConfig = {
  instruction:
    "Hija: ya tengo la carpeta y recuerdo la cita de las dos de la tarde. Busca la autorización médica y la nota con la ruta del bus.",
  audioSrc: "../Audio/CitaMedica/Fase4/estructura_b_simple_instruccion.mp3",
  targetIds: ["autorizacion", "nota-bus"],
  previewDelayMs: 900,
  previewGapMs: 1050,
  previewDurationMs: 1900,
  activationDelayAfterPreviewMs: 300,
  items: [
    { id: "florero", label: "Florero", x: 18, y: 33, width: 18, height: 43 },
    { id: "biblia", label: "Biblia", x: 17, y: 71, width: 16, height: 19 },
    { id: "hilos", label: "Colección de hilos", x: 37, y: 24, width: 14, height: 12 },
    { id: "hilos-arriba-dos", label: "Colección de hilos", x: 48, y: 24, width: 14, height: 12 },
    { id: "cable", label: "Cable USB", x: 46, y: 21, width: 20, height: 18 },
    { id: "lapicero", label: "Lapicero", x: 32, y: 33, width: 11, height: 22 },
    { id: "hilos-copia", label: "Colección de hilos", x: 58, y: 68, width: 13, height: 12 },
    { id: "hilos-abajo-dos", label: "Colección de hilos", x: 69, y: 68, width: 13, height: 12 },
    { id: "frutas", label: "Arreglo frutal", x: 68, y: 11, width: 25, height: 17 },
    { id: "revistas", label: "Pila de revistas", x: 68, y: 43, width: 23, height: 25 },
    { id: "gafas", label: "Gafas", x: 38, y: 56, width: 25, height: 14 },
    {
      id: "calendario-hora",
      label: "Calendario con hora de la cita",
      x: 39,
      y: 37,
      width: 11,
      height: 14
    },
    {
      id: "carpeta-documentos",
      label: "Carpeta con documentos",
      x: 82,
      y: 40,
      width: 19,
      height: 20
    },
    {
      id: "autorizacion",
      label: "Autorización médica",
      x: 82,
      y: 67,
      width: 11,
      height: 20,
      target: true
    },
    {
      id: "nota-bus",
      label: "Nota de la ruta del bus",
      x: 49,
      y: 72,
      width: 10,
      height: 10,
      target: true
    },
    { id: "panuelos", label: "Caja de panuelos", x: 35, y: 73, width: 11, height: 12 },
    { id: "cinta", label: "Cinta adhesiva", x: 43, y: 80, width: 11, height: 9 },
    { id: "calculadora", label: "Calculadora", x: 87, y: 56, width: 9, height: 18 },
    { id: "clips", label: "Clips", x: 63, y: 82, width: 11, height: 5 },
    { id: "llaves", label: "Llaves", x: 88, y: 79, width: 10, height: 14 }
  ]
};

const doubleTaskConfig = {
  targetIds: [
    "calendario-hora",
    "carpeta-documentos",
    "autorizacion",
    "nota-bus"
  ],
  cueGapAfterPreviewMs: 450,
  distractorDurationMs: 7600,
  distractorText:
    "Noticias del clima: esta tarde se esperan fuertes lluvias en la ciudad, con viento moderado y calles mojadas. Se recomienda salir con paraguas y caminar con cuidado.",
  distractorAudioSrc: "../Audio/CitaMedica/Fase4/estructura_b_doble_05_noticia_clima.mp3",
  weatherQuestionAudioSrc: "",
  weatherQuestionText: "¿Cómo va a estar el clima en la ciudad?",
  weatherCorrectAnswer: "lluvias",
  weatherQuestionDelayAfterAnswerMs: 850,
  recallInstruction:
    "La hija ya no está detrás de ti. Busca en la mesa los objetos que debes llevar.",
  cues: [
    {
      targetId: "calendario-hora",
      instruction: "Hija: ¿recuerdas la hora de la cita?",
      audioSrc: "../Audio/CitaMedica/Fase4/estructura_b_doble_01_hora_cita.mp3",
      status: "Observa la hora de la cita."
    },
    {
      targetId: "carpeta-documentos",
      instruction: "Hija: ¿tienes la carpeta con los documentos?",
      audioSrc: "../Audio/CitaMedica/Fase4/estructura_b_doble_02_carpeta_documentos.mp3",
      status: "Observa dónde está la carpeta."
    },
    {
      targetId: "autorizacion",
      instruction: "Hija: ¿recuerdas la autorización pendiente de llevar?",
      audioSrc: "../Audio/CitaMedica/Fase4/estructura_b_doble_03_autorizacion_medica.mp3",
      status: "Observa dónde está la autorización."
    },
    {
      targetId: "nota-bus",
      instruction: "Hija: ¿recuerdas dónde está la nota con la ruta del bus?",
      audioSrc: "../Audio/CitaMedica/Fase4/estructura_b_doble_04_nota_ruta_bus.mp3",
      status: "Observa dónde está la nota de la ruta."
    }
  ]
};

const sceneState = {
  mode: "simple",
  currentInstruction: sceneConfig.instruction,
  currentAudioSrc: sceneConfig.audioSrc,
  startedAt: null,
  lastFoundAt: null,
  found: [],
  errors: 0,
  selections: [],
  isActive: false,
  finalTimeMs: 0,
  phase: "idle",
  currentCueIndex: null,
  weatherQuestionStartedAt: null,
  weatherAnswer: null,
  weatherAnswerLabel: "No registrado",
  weatherAnswerResult: "No aplica",
  weatherAnswerTimeMs: null
};

let sceneRunId = 0;
let sceneTimers = [];
let instructionRunId = 0;
const liftedSvgObjects = new Map();

function showSceneScreen(screenId) {
  const targetScreen = document.getElementById(screenId);

  if (!targetScreen) return;

  sceneScreens.forEach((screen) => {
    screen.classList.remove("is-active");
  });

  targetScreen.classList.add("is-active");
}

function updateTableModeClass() {
  if (!tableScene) return;

  tableScene.classList.toggle("is-simple-mode", sceneState.mode !== "double");
  tableScene.classList.toggle("is-double-mode", sceneState.mode === "double");
}

function scheduleSceneTimer(callback, delayMs) {
  const timerId = window.setTimeout(callback, delayMs);
  sceneTimers.push(timerId);
  return timerId;
}

function clearSceneTimers() {
  sceneTimers.forEach((timerId) => {
    window.clearTimeout(timerId);
  });
  sceneTimers = [];
}

function resetWeatherQuestion() {
  if (weatherQuestionText) {
    weatherQuestionText.textContent = doubleTaskConfig.weatherQuestionText;
  }

  if (weatherFeedback) {
    weatherFeedback.textContent = "";
  }

  document.querySelectorAll("[data-weather-answer]").forEach((button) => {
    button.disabled = false;
    button.classList.remove("is-correct", "is-wrong");
  });
}

function showWeatherQuestion(runId) {
  if (runId !== sceneRunId) return;

  sceneState.phase = "weather-question";
  sceneState.currentInstruction = doubleTaskConfig.weatherQuestionText;
  sceneState.currentAudioSrc = doubleTaskConfig.weatherQuestionAudioSrc;
  sceneState.weatherQuestionStartedAt = performance.now();

  if (weatherQuestionText) {
    weatherQuestionText.textContent = doubleTaskConfig.weatherQuestionText;
  }

  showSceneScreen("screen-scene-weather-question");

  if (sceneState.currentAudioSrc) {
    playInstruction({ runId });
  }
}

function finishWeatherQuestion(runId) {
  if (runId !== sceneRunId) return;

  showSceneScreen("screen-scene-table");
  activateRecall(runId);
}

function handleWeatherAnswerSelection(button) {
  if (sceneState.phase !== "weather-question" || button.disabled) {
    return;
  }

  const answeredAt = performance.now();
  const answer = button.dataset.weatherAnswer;
  const isCorrect = answer === doubleTaskConfig.weatherCorrectAnswer;

  sceneState.weatherAnswer = answer;
  sceneState.weatherAnswerLabel = button.textContent.trim();
  sceneState.weatherAnswerResult = isCorrect ? "Correcto" : "Incorrecto";
  sceneState.weatherAnswerTimeMs = Math.round(
    answeredAt - (sceneState.weatherQuestionStartedAt || answeredAt)
  );

  document.querySelectorAll("[data-weather-answer]").forEach((answerButton) => {
    answerButton.disabled = true;
  });

  button.classList.add(isCorrect ? "is-correct" : "is-wrong");

  if (weatherFeedback) {
    weatherFeedback.textContent = isCorrect
      ? "Respuesta registrada."
      : "Respuesta registrada. La noticia hablaba de fuertes lluvias.";
  }

  const currentRunId = sceneRunId;
  scheduleSceneTimer(() => {
    finishWeatherQuestion(currentRunId);
  }, doubleTaskConfig.weatherQuestionDelayAfterAnswerMs);
}

function getSvgObject(itemId) {
  if (!tableScene) return null;

  return tableScene.querySelector(`[data-svg-item="${itemId}"]`);
}

function liftSvgObject(itemId, stateClass) {
  const svgObject = getSvgObject(itemId);

  if (!svgObject || !svgObject.parentElement) return;

  if (!liftedSvgObjects.has(itemId)) {
    liftedSvgObjects.set(itemId, {
      parent: svgObject.parentElement,
      nextSibling: svgObject.nextSibling
    });
  }

  svgObject.classList.add(stateClass);
  svgObject.parentElement.appendChild(svgObject);
}

function returnSvgObjectToOriginalPlace(svgObject, originalPlace) {
  if (!svgObject || !originalPlace?.parent) return;

  if (originalPlace.nextSibling?.parentNode === originalPlace.parent) {
    originalPlace.parent.insertBefore(svgObject, originalPlace.nextSibling);
    return;
  }

  originalPlace.parent.appendChild(svgObject);
}

function restoreSvgObject(itemId, stateClass) {
  const svgObject = getSvgObject(itemId);
  const originalPlace = liftedSvgObjects.get(itemId);

  if (!svgObject || !originalPlace || svgObject.classList.contains("is-svg-found")) {
    return;
  }

  svgObject.classList.remove(stateClass);
  returnSvgObjectToOriginalPlace(svgObject, originalPlace);
  liftedSvgObjects.delete(itemId);
}

function markSvgObjectFound(itemId) {
  const svgObject = getSvgObject(itemId);

  liftSvgObject(itemId, "is-svg-found");

  if (svgObject) {
    svgObject.classList.remove("is-svg-previewed");
    svgObject.classList.add("is-svg-found");
  }
}

function resetSvgObjectLayers() {
  liftedSvgObjects.forEach((originalPlace, itemId) => {
    const svgObject = getSvgObject(itemId);

    if (!svgObject) return;

    svgObject.classList.remove("is-svg-previewed", "is-svg-found");
    returnSvgObjectToOriginalPlace(svgObject, originalPlace);
  });

  liftedSvgObjects.clear();
}

function resetSceneState() {
  sceneRunId++;
  clearSceneTimers();

  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }

  sceneInstructionAudio.pause();
  sceneInstructionAudio.currentTime = 0;
  sceneInstructionAudio.onended = null;
  sceneInstructionAudio.onerror = null;

  sceneState.startedAt = null;
  sceneState.lastFoundAt = null;
  sceneState.found = [];
  sceneState.errors = 0;
  sceneState.selections = [];
  sceneState.isActive = false;
  sceneState.finalTimeMs = 0;
  sceneState.phase = "idle";
  sceneState.currentInstruction = sceneConfig.instruction;
  sceneState.currentAudioSrc = sceneConfig.audioSrc;
  sceneState.currentCueIndex = null;
  sceneState.weatherQuestionStartedAt = null;
  sceneState.weatherAnswer = null;
  sceneState.weatherAnswerLabel = "No registrado";
  sceneState.weatherAnswerResult = "No aplica";
  sceneState.weatherAnswerTimeMs = null;
  resetSvgObjectLayers();

  resetWeatherQuestion();

  if (sceneStatus) {
    sceneStatus.textContent = "Observa la mesa.";
  }

  updateSceneProgress();
  renderHotspots();
}

function getActiveTargetIds() {
  return sceneState.mode === "double"
    ? doubleTaskConfig.targetIds
    : sceneConfig.targetIds;
}

function getActiveStructureText() {
  return sceneState.mode === "double"
    ? "Estructura B - tarea doble visoespacial"
    : "Estructura B - tarea simple visoespacial";
}

function getRecallInstruction() {
  return sceneState.mode === "double"
    ? doubleTaskConfig.recallInstruction
    : sceneConfig.instruction;
}

function isActiveTarget(itemId) {
  return getActiveTargetIds().includes(itemId);
}

function renderHotspots() {
  if (!tableHotspots) return;

  tableHotspots.innerHTML = "";

  sceneConfig.items.forEach((item) => {
    const isDoubleOnlyItem =
      doubleTaskConfig.targetIds.includes(item.id) &&
      !sceneConfig.targetIds.includes(item.id);

    if (sceneState.mode !== "double" && isDoubleOnlyItem) {
      return;
    }

    const button = document.createElement("button");

    button.className = "scene-object";
    button.type = "button";
    button.dataset.itemId = item.id;
    button.style.setProperty("--item-x", `${item.x}%`);
    button.style.setProperty("--item-y", `${item.y}%`);
    button.style.setProperty("--item-width", `${item.width}%`);
    button.style.setProperty("--item-height", `${item.height}%`);
    button.setAttribute("aria-label", item.label);
    button.textContent = item.label;

    tableHotspots.appendChild(button);
  });
}

function getInstructionFallbackDelayMs() {
  const wordCount = sceneState.currentInstruction.trim().split(/\s+/).length;
  return Math.max(2800, wordCount * 360);
}

function playInstruction({ onComplete, runId = sceneRunId } = {}) {
  instructionRunId++;
  const currentInstructionRunId = instructionRunId;

  if (sceneInstruction) {
    sceneInstruction.textContent = sceneState.currentInstruction;
  }

  let completed = false;

  function completeInstruction() {
    if (
      completed ||
      runId !== sceneRunId ||
      currentInstructionRunId !== instructionRunId
    ) {
      return;
    }

    completed = true;

    if (typeof onComplete === "function") {
      onComplete();
    }
  }

  sceneInstructionAudio.pause();
  sceneInstructionAudio.currentTime = 0;
  sceneInstructionAudio.onended = null;
  sceneInstructionAudio.onerror = null;

  if (sceneState.currentAudioSrc) {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    sceneInstructionAudio.src = sceneState.currentAudioSrc;
    sceneInstructionAudio.onended = completeInstruction;
    sceneInstructionAudio.onerror = () => {
      sceneInstructionAudio.onended = null;
      sceneInstructionAudio.onerror = null;

      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(sceneState.currentInstruction);
        utterance.lang = "es-CO";
        utterance.rate = 0.92;
        utterance.pitch = 1;
        utterance.onend = completeInstruction;
        utterance.onerror = completeInstruction;
        window.speechSynthesis.speak(utterance);
        return;
      }

      scheduleSceneTimer(completeInstruction, getInstructionFallbackDelayMs());
    };

    sceneInstructionAudio.play().catch(() => {
      sceneInstructionAudio.onerror();
    });
    return;
  }

  if (!("speechSynthesis" in window)) {
    scheduleSceneTimer(completeInstruction, getInstructionFallbackDelayMs());
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(sceneState.currentInstruction);
  utterance.lang = "es-CO";
  utterance.rate = 0.92;
  utterance.pitch = 1;
  utterance.onend = completeInstruction;
  utterance.onerror = completeInstruction;

  window.speechSynthesis.speak(utterance);
}

function previewTarget(targetId, delayMs) {
  scheduleSceneTimer(() => {
    const target = tableHotspots.querySelector(`[data-item-id="${targetId}"]`);

    if (!target) return;

    target.classList.add("is-previewed");
    liftSvgObject(targetId, "is-svg-previewed");

    scheduleSceneTimer(() => {
      target.classList.remove("is-previewed");
      restoreSvgObject(targetId, "is-svg-previewed");
    }, sceneConfig.previewDurationMs);
  }, delayMs);
}

function startTargetPreviewSequence(runId) {
  if (runId !== sceneRunId) return;

  sceneState.phase = "preview";
  if (sceneStatus) {
    sceneStatus.textContent = "Observa los objetos que se resaltan.";
  }

  getActiveTargetIds().forEach((targetId, index) => {
    previewTarget(targetId, sceneConfig.previewDelayMs + index * sceneConfig.previewGapMs);
  });

  const finalPreviewDelay =
    sceneConfig.previewDelayMs +
    (getActiveTargetIds().length - 1) * sceneConfig.previewGapMs +
    sceneConfig.previewDurationMs +
    sceneConfig.activationDelayAfterPreviewMs;

  scheduleSceneTimer(() => {
    activateRecall(runId);
  }, finalPreviewDelay);
}

function activateRecall(runId) {
  if (runId !== sceneRunId) return;

  sceneState.startedAt = performance.now();
  sceneState.isActive = true;
  sceneState.phase = "active";
  sceneState.currentInstruction = getRecallInstruction();
  sceneState.currentAudioSrc = "";

  if (sceneInstruction) {
    sceneInstruction.textContent = sceneState.currentInstruction;
  }

  if (sceneStatus) {
    sceneStatus.textContent =
      sceneState.mode === "double"
        ? "Busca los cuatro elementos que debes llevar."
        : "Toca los dos objetos que hacen falta.";
  }

  updateSceneProgress();
}

function runDoubleCueStep(stepIndex, runId) {
  if (runId !== sceneRunId) return;

  const cue = doubleTaskConfig.cues[stepIndex];

  if (!cue) {
    sceneState.currentCueIndex = null;
    startDistractor(runId);
    return;
  }

  sceneState.phase = "cue-instruction";
  sceneState.currentCueIndex = stepIndex;
  sceneState.currentInstruction = cue.instruction;
  sceneState.currentAudioSrc = cue.audioSrc;

  if (sceneStatus) {
    sceneStatus.textContent = "Escucha la indicación completa.";
  }

  playInstruction({
    runId,
    onComplete: () => {
      if (runId !== sceneRunId) return;

      sceneState.phase = "cue-preview";

      if (sceneStatus) {
        sceneStatus.textContent = cue.status;
      }

      previewTarget(cue.targetId, 0);

      scheduleSceneTimer(() => {
        runDoubleCueStep(stepIndex + 1, runId);
      }, sceneConfig.previewDurationMs + doubleTaskConfig.cueGapAfterPreviewMs);
    }
  });
}

function startDistractor(runId) {
  if (runId !== sceneRunId) return;

  sceneState.phase = "distractor";
  sceneState.isActive = false;
  resetWeatherQuestion();

  showSceneScreen("screen-scene-distractor");
  sceneState.currentInstruction = doubleTaskConfig.distractorText;
  sceneState.currentAudioSrc = doubleTaskConfig.distractorAudioSrc;
  playInstruction({
    runId,
    onComplete: () => showWeatherQuestion(runId)
  });
}

function startSimpleSceneActivity(runId) {
  sceneState.phase = "instruction";
  sceneState.currentInstruction = sceneConfig.instruction;
  sceneState.currentAudioSrc = sceneConfig.audioSrc;

  if (sceneStatus) {
    sceneStatus.textContent = "Escucha la indicación completa.";
  }

  playInstruction({
    runId,
    onComplete: () => startTargetPreviewSequence(runId)
  });
}

function startSceneActivity(mode = sceneState.mode || "simple") {
  resetSceneState();
  sceneState.mode = mode;
  updateTableModeClass();
  renderHotspots();
  showSceneScreen("screen-scene-table");
  updateSceneProgress();

  const currentRunId = sceneRunId;

  if (sceneState.mode === "double") {
    runDoubleCueStep(0, currentRunId);
    return;
  }

  startSimpleSceneActivity(currentRunId);
}

function getItemConfig(itemId) {
  return sceneConfig.items.find((item) => item.id === itemId);
}

function updateSceneProgress() {
  const totalTargets = getActiveTargetIds().length;
  const foundCount = sceneState.found.length;

  if (sceneFoundCount) {
    sceneFoundCount.textContent = `${foundCount}/${totalTargets} objetos encontrados`;
  }

  if (sceneSequence) {
    const sequenceText = sceneState.found.length
      ? sceneState.found.map((entry) => entry.label).join(" -> ")
      : "pendiente";

    sceneSequence.textContent = `Secuencia: ${sequenceText}`;
  }
}

function handleSceneObjectSelection(button) {
  const itemId = button.dataset.itemId;
  const item = getItemConfig(itemId);

  if (!item || !sceneState.isActive || button.classList.contains("is-found")) {
    return;
  }

  const selectedAt = performance.now();
  const latencyMs = Math.round(selectedAt - sceneState.startedAt);
  const timeFromPreviousMs = sceneState.lastFoundAt
    ? Math.round(selectedAt - sceneState.lastFoundAt)
    : null;

  if (isActiveTarget(item.id)) {
    const foundEntry = {
      id: item.id,
      label: item.label,
      latencyMs,
      timeFromPreviousMs
    };

    sceneState.found.push(foundEntry);
    sceneState.selections.push({ ...foundEntry, result: "Correcto" });
    sceneState.lastFoundAt = selectedAt;
    button.classList.add("is-found");
    button.disabled = true;
    markSvgObjectFound(item.id);

    updateSceneProgress();

    if (sceneState.found.length === getActiveTargetIds().length) {
      sceneState.isActive = false;
      sceneState.phase = "results";
      sceneState.finalTimeMs = Math.round(selectedAt - sceneState.startedAt);
      window.setTimeout(showSceneResults, 700);
    }

    return;
  }

  sceneState.errors++;
  sceneState.selections.push({
    id: item.id,
    label: item.label,
    latencyMs,
    timeFromPreviousMs,
    result: "Incorrecto"
  });

  button.classList.add("is-error");

  window.setTimeout(() => {
    button.classList.remove("is-error");
  }, 550);

  if (sceneStatus) {
    sceneStatus.textContent = "Ese objeto no hace falta. Sigue buscando.";
  }
}

function formatMilliseconds(milliseconds) {
  if (milliseconds === null || milliseconds === undefined) return "No aplica";
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

function getSceneCorrectCount() {
  return sceneState.found.length;
}

function getWeatherQuestionCorrectCount() {
  if (sceneState.mode !== "double") return 0;
  return sceneState.weatherAnswerResult === "Correcto" ? 1 : 0;
}

function getTotalCorrectCount() {
  return getSceneCorrectCount() + getWeatherQuestionCorrectCount();
}

function getTotalQuestionCount() {
  return getSceneTotalTargets() + (sceneState.mode === "double" ? 1 : 0);
}

function getWeatherQuestionErrorCount() {
  if (sceneState.mode !== "double") return 0;
  return sceneState.weatherAnswerResult === "Incorrecto" ? 1 : 0;
}

function getTotalErrorCount() {
  return sceneState.errors + getWeatherQuestionErrorCount();
}

function getSceneTotalTargets() {
  return getActiveTargetIds().length;
}

function getFirstFoundObjectLabel() {
  return sceneState.found[0]?.label || "No registrado";
}

function getFoundSequenceText() {
  return sceneState.found.length
    ? sceneState.found.map((entry) => entry.label).join(" -> ")
    : "No registrado";
}

function getTimeBetweenTargetsMs() {
  return sceneState.found[1]?.timeFromPreviousMs ?? null;
}

function showSceneResults() {
  if (resultCorrect) {
    resultCorrect.textContent = `${getTotalCorrectCount()}/${getTotalQuestionCount()}`;
  }

  if (resultErrors) {
    resultErrors.textContent = getTotalErrorCount();
  }

  if (resultTime) {
    resultTime.textContent = formatMilliseconds(sceneState.finalTimeMs);
  }

  showSceneScreen("screen-scene-results");
}

function escapeCSV(value) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

function getSelectionCSVFields(selection, index) {
  return [
    `seleccion_${index + 1}_objeto`,
    `seleccion_${index + 1}_resultado`,
    `seleccion_${index + 1}_latencia`,
    `seleccion_${index + 1}_tiempo_desde_anterior`
  ];
}

function getSelectionCSVValues(selection) {
  return [
    selection.label,
    selection.result,
    formatMilliseconds(selection.latencyMs),
    formatMilliseconds(selection.timeFromPreviousMs)
  ];
}

function downloadSceneCSVResults() {
  const now = new Date();
  const selectionHeaders = sceneState.selections.flatMap(getSelectionCSVFields);
  const selectionValues = sceneState.selections.flatMap(getSelectionCSVValues);
  const foundLatencyHeaders = sceneState.found.map(
    (entry) => `${entry.label} - latencia`
  );
  const foundLatencyValues = sceneState.found.map((entry) =>
    formatMilliseconds(entry.latencyMs)
  );

  const rows = [
    [
      "fecha_registro",
      "prueba",
      "fase",
      "estructura",
      "aciertos",
      "aciertos_objetos",
      "errores",
      "errores_objetos",
      "total_preguntas",
      "total_objetivos",
      "tiempo_total",
      "primer_objeto",
      "secuencia",
      "tiempo_entre_objetos",
      "pregunta_clima",
      "respuesta_clima",
      "resultado_clima",
      "tiempo_respuesta_clima",
      ...foundLatencyHeaders,
      ...selectionHeaders
    ],
    [
      now.toLocaleString("es-CO"),
      "Cita médica",
      "Fase 4",
      getActiveStructureText(),
      getTotalCorrectCount(),
      getSceneCorrectCount(),
      getTotalErrorCount(),
      sceneState.errors,
      getTotalQuestionCount(),
      getSceneTotalTargets(),
      formatMilliseconds(sceneState.finalTimeMs),
      getFirstFoundObjectLabel(),
      getFoundSequenceText(),
      formatMilliseconds(getTimeBetweenTargetsMs()),
      sceneState.mode === "double"
        ? doubleTaskConfig.weatherQuestionText
        : "No aplica",
      sceneState.mode === "double"
        ? sceneState.weatherAnswerLabel
        : "No aplica",
      sceneState.mode === "double"
        ? sceneState.weatherAnswerResult
        : "No aplica",
      sceneState.mode === "double"
        ? formatMilliseconds(sceneState.weatherAnswerTimeMs)
        : "No aplica",
      ...foundLatencyValues,
      ...selectionValues
    ]
  ];

  const csvContent = rows
    .map((row) => row.map(escapeCSV).join(";"))
    .join("\n");

  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;"
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `resultado-cita-medica-fase-4-visoespacial-${Date.now()}.csv`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

document.addEventListener("click", (event) => {
  const nextScreenButton = event.target.closest("[data-scene-screen]");
  const sceneObject = event.target.closest("[data-item-id]");
  const weatherAnswer = event.target.closest("[data-weather-answer]");

  if (weatherAnswer) {
    handleWeatherAnswerSelection(weatherAnswer);
    return;
  }

  if (nextScreenButton) {
    resetSceneState();
    showSceneScreen(nextScreenButton.dataset.sceneScreen);
    return;
  }

  if (sceneObject) {
    handleSceneObjectSelection(sceneObject);
  }
});

sceneModeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    startSceneActivity(button.dataset.sceneMode || "simple");
  });
});

if (repeatInstructionButton) {
  repeatInstructionButton.addEventListener("click", () => {
    if (sceneState.phase === "instruction") {
      clearSceneTimers();

      const currentRunId = sceneRunId;
      playInstruction({
        runId: currentRunId,
        onComplete: () => startTargetPreviewSequence(currentRunId)
      });

      return;
    }

    if (
      sceneState.phase === "cue-instruction" &&
      sceneState.currentCueIndex !== null
    ) {
      clearSceneTimers();
      runDoubleCueStep(sceneState.currentCueIndex, sceneRunId);
      return;
    }

    if (sceneState.phase === "weather-question") {
      if (sceneState.currentAudioSrc) {
        playInstruction();
      }
      return;
    }

    playInstruction();
  });
}

if (restartSceneButton) {
  restartSceneButton.addEventListener("click", () => {
    startSceneActivity(sceneState.mode || "simple");
  });
}

if (downloadSceneResultsButton) {
  downloadSceneResultsButton.addEventListener("click", downloadSceneCSVResults);
}

window.addEventListener("beforeunload", () => {
  clearSceneTimers();

  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }

  sceneInstructionAudio.pause();
  sceneInstructionAudio.currentTime = 0;
});

window.addEventListener("load", resetSceneState);
