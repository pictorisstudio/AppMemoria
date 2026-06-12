const foodScreens = document.querySelectorAll(".medical-screen");
const foodModeTitle = document.getElementById("food-mode-title");
const foodEmptyTitle = document.getElementById("food-empty-title");
const foodEmptyDescription = document.getElementById("food-empty-description");
const cookingGameRoot = document.getElementById("cooking-game-root");

const cookingSteps = [
  {
    id: "sal-arroz",
    title: "Paso 1 de 5",
    instruction: "Agrega cuatro pizcas de sal al arroz.",
    targetId: "arroz",
    note: "Arroz: agregar 4 pizcas de sal.",
    success: "Sal agregada al arroz.",
    timer: "Faltan 10 min",
    progress: 20
  },
  {
    id: "carne",
    title: "Paso 2 de 5",
    instruction: "Enciende la hornilla de la carne molida.",
    targetId: "carne",
    note: "Carne molida: poner a freír.",
    success: "Carne encendida.",
    timer: "Faltan 8 min",
    progress: 40
  },
  {
    id: "guiso-on",
    title: "Paso 3 de 5",
    instruction: "Enciende la hornilla del guiso.",
    targetId: "guiso",
    note: "Guiso: sofreír 30 segundos.",
    success: "Guiso encendido.",
    timer: "Faltan 6 min",
    progress: 60
  },
  {
    id: "guiso-off",
    title: "Paso 4 de 5",
    instruction: "Apaga la hornilla del guiso.",
    targetId: "guiso",
    note: "Guiso: apagar de inmediato.",
    success: "Guiso apagado a tiempo.",
    timer: "Faltan 5 min",
    progress: 75
  },
  {
    id: "huevos",
    title: "Paso 5 de 5",
    instruction: "Enciende la hornilla de los huevos.",
    targetId: "huevos",
    note: "Huevos: poner a freír.",
    success: "Huevos encendidos.",
    timer: "Finalizando",
    progress: 100
  }
];

const burnerLabels = {
  arroz: "Arroz",
  carne: "Carne molida",
  guiso: "Guiso",
  huevos: "Huevos"
};

const foodState = {
  currentPhase: null,
  currentMode: null
};

const gameState = {
  screen: "intro",
  currentStepIndex: 0,
  startedAt: null,
  endedAt: null,
  stepStartedAt: null,
  correctSteps: 0,
  errors: 0,
  feedback: "",
  completedStepIds: [],
  stepTimings: [],
  burnersOn: {
    arroz: true,
    carne: false,
    guiso: false,
    huevos: false
  },
  lastResult: null
};

function showFoodScreen(screenId) {
  const targetScreen = document.getElementById(screenId);

  if (!targetScreen) return;

  foodScreens.forEach((screen) => {
    screen.classList.remove("is-active");
  });

  targetScreen.classList.add("is-active");
}

function showFoodModeSelection(phaseNumber) {
  foodState.currentPhase = Number(phaseNumber);
  foodState.currentMode = null;

  if (foodModeTitle) {
    foodModeTitle.textContent = `Fase ${foodState.currentPhase}`;
  }

  showFoodScreen("screen-food-mode-selection");
}

function showEmptyFoodActivity(mode) {
  foodState.currentMode = mode;

  if (foodState.currentPhase === 1 && mode === "simple") {
    resetGame();
    showFoodScreen("screen-food-game");
    return;
  }

  const modeText = mode === "double" ? "fase doble" : "fase simple";

  if (foodEmptyTitle) {
    foodEmptyTitle.textContent = `Fase ${foodState.currentPhase} - ${modeText}`;
  }

  if (foodEmptyDescription) {
    foodEmptyDescription.textContent =
      "Esta estructura queda lista para asignar funcionalidades.";
  }

  showFoodScreen("screen-food-empty-activity");
}

function resetGame() {
  gameState.screen = "intro";
  gameState.currentStepIndex = 0;
  gameState.startedAt = null;
  gameState.endedAt = null;
  gameState.stepStartedAt = null;
  gameState.correctSteps = 0;
  gameState.errors = 0;
  gameState.feedback = "";
  gameState.completedStepIds = [];
  gameState.stepTimings = [];
  gameState.burnersOn = {
    arroz: true,
    carne: false,
    guiso: false,
    huevos: false
  };
  gameState.lastResult = null;
  renderScreen();
}

function getCurrentStep() {
  return cookingSteps[gameState.currentStepIndex] || cookingSteps[0];
}

function getElapsedMilliseconds() {
  if (!gameState.startedAt) return 0;

  const endTime = gameState.endedAt || Date.now();
  return Math.max(0, endTime - gameState.startedAt);
}

function formatMilliseconds(milliseconds) {
  if (milliseconds === null || milliseconds === undefined) return "No aplica";

  const safeMilliseconds = Math.max(0, Math.round(Number(milliseconds) || 0));
  const secondsText = (safeMilliseconds / 1000).toFixed(3).replace(".", ",");
  return `${secondsText} s`;
}

function getSymbolicTime() {
  if (gameState.screen === "result") return "0:00";
  if (gameState.screen === "intro") return "20:00";
  return getCurrentStep().timer;
}

function getProgress() {
  if (gameState.screen === "result") return 100;
  if (gameState.screen === "intro") return 0;
  return getCurrentStep().progress;
}

function createShell(title, body, actions = "") {
  const actionsClass =
    gameState.screen === "result" ? "medical-actions" : "cooking-actions";
  const statusMarkup =
    gameState.screen === "scene"
      ? `
    <div class="cooking-status" aria-label="Cronómetro simbólico">
      <div>
        <span>Cronómetro del celular</span>
        <strong>${getSymbolicTime()}</strong>
      </div>
      <div class="cooking-progress" aria-hidden="true">
        <span style="width: ${getProgress()}%"></span>
      </div>
    </div>
  `
      : "";

  return `
    <header class="cooking-header">
      <button class="back-button medical-back" type="button" data-cooking-nav="phases" aria-label="Volver">
        ‹
      </button>
      <div>
        <h1>${title}</h1>
        <p>Fase 1 · Estructura A · Línea de base con tarea simple</p>
      </div>
    </header>

    ${statusMarkup}

    <div class="cooking-body">
      ${body}
    </div>

    <div class="${actionsClass}">
      ${actions}
    </div>
  `;
}

function getBurnerStateClass(burnerId) {
  const currentStep = getCurrentStep();
  const isTarget = gameState.screen === "scene" && currentStep.targetId === burnerId;
  const isOn = gameState.burnersOn[burnerId];

  return [
    isTarget ? "is-target" : "",
    isOn ? "is-on" : "",
    gameState.completedStepIds.includes(burnerId) ? "is-completed" : ""
  ]
    .filter(Boolean)
    .join(" ");
}

function renderKitchenSvg() {
  const step = getCurrentStep();
  const activeNoteId = step.id;

  return `
    <div class="cooking-scene">
      <svg class="kitchen-art" viewBox="0 0 1120 680" aria-hidden="true" focusable="false">
        <rect class="kitchen-wall" x="0" y="0" width="1120" height="680" />
        <path class="kitchen-tile-lines" d="M0 120 H1120 M0 260 H1120 M190 0 V680 M380 0 V680 M570 0 V680 M760 0 V680 M950 0 V680" />

        <g class="kitchen-cabinets">
          <rect x="120" y="34" width="210" height="118" rx="18" />
          <rect x="392" y="34" width="210" height="118" rx="18" />
          <line x1="225" y1="54" x2="225" y2="134" />
          <line x1="497" y1="54" x2="497" y2="134" />
        </g>

        <g class="fridge">
          <rect x="806" y="60" width="246" height="512" rx="28" />
          <line x1="806" y1="252" x2="1052" y2="252" />
          <line x1="852" y1="124" x2="852" y2="196" />
          <line x1="852" y1="320" x2="852" y2="456" />
        </g>

        <g class="elder-person">
          <circle class="person-head" cx="170" cy="318" r="46" />
          <path class="person-hair" d="M130 314 C138 260 206 250 218 312 C196 292 158 292 130 314 Z" />
          <path class="person-body" d="M112 384 C132 352 210 352 232 384 L250 540 H94 Z" />
          <path class="person-arm" d="M224 418 C280 416 318 396 354 360" />
          <circle class="person-hand" cx="356" cy="360" r="14" />
        </g>

        <g class="counter">
          <rect x="220" y="476" width="660" height="86" rx="20" />
          <rect x="248" y="220" width="580" height="310" rx="32" />
        </g>

        <g class="stove">
          <rect class="stove-base" x="278" y="250" width="514" height="248" rx="30" />
          <line class="stove-divider" x1="535" y1="260" x2="535" y2="490" />
          <line class="stove-divider" x1="292" y1="374" x2="778" y2="374" />

          ${renderBurnerSvg("arroz", 408, 316)}
          ${renderBurnerSvg("huevos", 662, 316)}
          ${renderBurnerSvg("guiso", 408, 430)}
          ${renderBurnerSvg("carne", 662, 430)}
        </g>

        <g class="food-pan food-arroz">
          <path class="pan-handle" d="M346 316 H306" />
          <circle class="pan-rim" cx="408" cy="316" r="62" />
          <circle class="pan-inner" cx="408" cy="316" r="43" />
          <circle class="rice-water" cx="408" cy="316" r="31" />
          <text x="408" y="326">Arroz</text>
        </g>

        <g class="food-pan food-huevos">
          <path class="pan-handle" d="M724 316 H766" />
          <circle class="pan-rim" cx="662" cy="316" r="62" />
          <circle class="pan-inner" cx="662" cy="316" r="43" />
          <circle class="egg-white" cx="640" cy="302" r="15" />
          <circle class="egg-white" cx="682" cy="302" r="15" />
          <circle class="egg-white" cx="640" cy="340" r="15" />
          <circle class="egg-white" cx="682" cy="340" r="15" />
          <circle class="egg-yolk" cx="640" cy="302" r="7" />
          <circle class="egg-yolk" cx="682" cy="302" r="7" />
          <circle class="egg-yolk" cx="640" cy="340" r="7" />
          <circle class="egg-yolk" cx="682" cy="340" r="7" />
        </g>

        <g class="food-pan food-guiso">
          <path class="pan-handle" d="M346 430 H306" />
          <circle class="pan-rim" cx="408" cy="430" r="62" />
          <circle class="pan-inner" cx="408" cy="430" r="43" />
          <circle class="tomato" cx="386" cy="424" r="11" />
          <circle class="pepper" cx="414" cy="434" r="11" />
          <circle class="onion" cx="440" cy="424" r="10" />
          <circle class="tomato" cx="423" cy="410" r="8" />
        </g>

        <g class="food-pan food-carne">
          <path class="pan-handle" d="M724 430 H766" />
          <circle class="pan-rim" cx="662" cy="430" r="62" />
          <circle class="pan-inner" cx="662" cy="430" r="43" />
          <path class="meat" d="M625 422 C644 398 688 402 704 430 C684 454 642 452 625 422 Z" />
          <path class="oil" d="M622 446 C648 456 688 456 712 446" />
        </g>

        <g class="recipe-sheet">
          <rect x="56" y="160" width="244" height="330" rx="16" />
          <text class="recipe-title" x="178" y="200">Notas</text>
          ${renderRecipeNote("sal-arroz", 236, "Sal", "al arroz", activeNoteId)}
          ${renderRecipeNote("carne", 286, "Freír", "carne", activeNoteId)}
          ${renderRecipeNote("guiso-on", 336, "Sofreír", "guiso", activeNoteId)}
          ${renderRecipeNote("guiso-off", 386, "Apagar", "guiso", activeNoteId)}
          ${renderRecipeNote("huevos", 436, "Freír", "huevos", activeNoteId)}
        </g>

        <g class="phone ${gameState.screen === "scene" ? "is-target" : ""}">
          <rect x="850" y="438" width="156" height="204" rx="24" />
          <rect class="phone-screen" x="874" y="470" width="108" height="102" rx="10" />
          <text x="928" y="530">${getSymbolicTime()}</text>
          <circle cx="928" cy="610" r="12" />
        </g>
      </svg>

      <button class="cooking-hotspot cooking-hotspot-arroz" type="button" data-cooking-target="arroz">Arroz</button>
      <button class="cooking-hotspot cooking-hotspot-huevos" type="button" data-cooking-target="huevos">Huevos</button>
      <button class="cooking-hotspot cooking-hotspot-guiso" type="button" data-cooking-target="guiso">Guiso</button>
      <button class="cooking-hotspot cooking-hotspot-carne" type="button" data-cooking-target="carne">Carne</button>
    </div>
  `;
}

function renderBurnerSvg(id, cx, cy) {
  return `
    <g class="burner-svg ${getBurnerStateClass(id)}">
      <circle cx="${cx}" cy="${cy}" r="64" />
      <circle cx="${cx}" cy="${cy}" r="42" />
      <path class="burner-flame" d="M${cx - 24} ${cy + 58} C${cx - 8} ${cy + 24} ${cx + 8} ${cy + 24} ${cx + 24} ${cy + 58}" />
    </g>
  `;
}

function renderRecipeNote(id, y, lineOne, lineTwo, activeNoteId) {
  const activeClass = id === activeNoteId ? " is-active-note" : "";

  return `
    <g class="recipe-note${activeClass}">
      <rect x="88" y="${y - 32}" width="180" height="42" rx="8" />
      <text x="178" y="${y - 14}">${lineOne}</text>
      <text x="178" y="${y + 5}">${lineTwo}</text>
    </g>
  `;
}

function renderIntro() {
  const body = `
    <section class="cooking-intro">
      <h2>Preparar una comida</h2>
      <p>Observa la cocina y sigue una secuencia corta: sal al arroz, carne, guiso y huevos.</p>
      <small>La simulación representa 20 minutos de cocción en una actividad breve.</small>
    </section>
  `;

  const actions = `
    <button class="memory-button button-one cooking-action-button" type="button" data-cooking-start>
      Iniciar
    </button>
  `;

  return createShell("Preparar comida", body, actions);
}

function renderScene() {
  const step = getCurrentStep();
  const body = `
    <section class="cooking-instruction">
      <h2>${step.instruction}</h2>
      <p>${step.note}</p>
    </section>
    ${renderKitchenSvg()}
    ${gameState.feedback ? `<p class="cooking-feedback">${gameState.feedback}</p>` : ""}
  `;

  const actions = `
    <button class="memory-button button-two cooking-action-button" type="button" data-cooking-repeat-instruction>
      Repetir instrucción
    </button>
  `;

  return createShell(step.title, body, actions);
}

function renderResult() {
  const result = gameState.lastResult;
  const body = `
    <section class="results-box cooking-result">
      <div class="result-trophy" aria-hidden="true">🏆</div>
      <p><strong>Aciertos:</strong> ${result.correctSteps}/${cookingSteps.length}</p>
      <p><strong>Errores:</strong> ${result.errors}</p>
      <p><strong>Tiempo:</strong> ${formatMilliseconds(result.totalTimeMs)}</p>
    </section>
  `;

  const actions = `
    <button class="memory-button button-one medical-action-button" type="button" data-cooking-repeat>
      Repetir actividad
    </button>
    <button class="memory-button button-two medical-action-button" type="button" data-cooking-nav="phases">
      Volver a pruebas
    </button>
    <button class="memory-button button-one medical-action-button" type="button" data-cooking-export>
      Exportar CSV
    </button>
  `;

  return createShell("Resultado", body, actions);
}

function renderScreen() {
  if (!cookingGameRoot) return;

  const screens = {
    intro: renderIntro,
    scene: renderScene,
    result: renderResult
  };

  cookingGameRoot.dataset.cookingScreen = gameState.screen;
  cookingGameRoot.closest(".cooking-card")?.setAttribute("data-cooking-screen", gameState.screen);
  cookingGameRoot.innerHTML = screens[gameState.screen]();
}

function startGame() {
  gameState.screen = "scene";
  gameState.startedAt = Date.now();
  gameState.stepStartedAt = Date.now();
  gameState.feedback = "";
  renderScreen();
}

function recordStepTiming(step, responseTimeMs) {
  gameState.stepTimings.push({
    id: step.id,
    label: step.instruction,
    responseTimeMs
  });
}

function applyStepEffect(step) {
  if (step.id === "carne") {
    gameState.burnersOn.carne = true;
  }

  if (step.id === "guiso-on") {
    gameState.burnersOn.guiso = true;
  }

  if (step.id === "guiso-off") {
    gameState.burnersOn.guiso = false;
  }

  if (step.id === "huevos") {
    gameState.burnersOn.huevos = true;
  }
}

function handleCookingTarget(targetId) {
  if (gameState.screen !== "scene") return;

  const step = getCurrentStep();
  const answeredAt = Date.now();
  const responseTimeMs = answeredAt - (gameState.stepStartedAt || answeredAt);

  if (targetId !== step.targetId) {
    gameState.errors++;
    gameState.feedback = `Intenta de nuevo. Busca ${burnerLabels[step.targetId]}.`;
    renderScreen();
    return;
  }

  gameState.correctSteps++;
  gameState.completedStepIds.push(step.targetId);
  gameState.feedback = `✓ ${step.success}`;
  recordStepTiming(step, responseTimeMs);
  applyStepEffect(step);
  renderScreen();

  window.setTimeout(() => {
    if (gameState.currentStepIndex >= cookingSteps.length - 1) {
      finishGame();
      return;
    }

    gameState.currentStepIndex++;
    gameState.stepStartedAt = Date.now();
    gameState.feedback = "";
    renderScreen();
  }, 650);
}

function repeatCurrentInstruction() {
  const step = getCurrentStep();
  gameState.feedback = `↻ ${step.instruction}`;
  renderScreen();
}

function finishGame() {
  gameState.endedAt = Date.now();

  const result = {
    game: "preparar_comida",
    phase: "Fase 1",
    taskType: "estructura_a_tarea_simple",
    startedAt: new Date(gameState.startedAt).toISOString(),
    endedAt: new Date(gameState.endedAt).toISOString(),
    totalTimeMs: getElapsedMilliseconds(),
    correctSteps: gameState.correctSteps,
    errors: gameState.errors,
    stepTimings: [...gameState.stepTimings],
    completed: true
  };

  const sessions = JSON.parse(localStorage.getItem("preparar_comida_sessions") || "[]");
  sessions.push(result);
  localStorage.setItem("preparar_comida_sessions", JSON.stringify(sessions));

  gameState.lastResult = result;
  gameState.screen = "result";
  renderScreen();
}

function escapeCSV(value) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

function getStepTiming(stepId) {
  return gameState.lastResult?.stepTimings.find((entry) => entry.id === stepId);
}

function exportResultsCSV() {
  const sessions = JSON.parse(localStorage.getItem("preparar_comida_sessions") || "[]");
  const rows = [
    [
      "fecha_inicio",
      "fecha_fin",
      "prueba",
      "fase",
      "estructura",
      "aciertos",
      "errores",
      "tiempo_total",
      "tiempo_sal_arroz",
      "tiempo_carne",
      "tiempo_guiso_encender",
      "tiempo_guiso_apagar",
      "tiempo_huevos"
    ],
    ...sessions.map((session) => [
      session.startedAt,
      session.endedAt,
      "Preparar comida",
      session.phase || "Fase 1",
      session.taskType || "estructura_a_tarea_simple",
      session.correctSteps,
      session.errors,
      formatMilliseconds(session.totalTimeMs),
      formatMilliseconds(session.stepTimings?.find((entry) => entry.id === "sal-arroz")?.responseTimeMs),
      formatMilliseconds(session.stepTimings?.find((entry) => entry.id === "carne")?.responseTimeMs),
      formatMilliseconds(session.stepTimings?.find((entry) => entry.id === "guiso-on")?.responseTimeMs),
      formatMilliseconds(session.stepTimings?.find((entry) => entry.id === "guiso-off")?.responseTimeMs),
      formatMilliseconds(session.stepTimings?.find((entry) => entry.id === "huevos")?.responseTimeMs)
    ])
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
  link.download = `resultado-preparar-comida-fase-1-${Date.now()}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

document.addEventListener("click", (event) => {
  const phaseButton = event.target.closest("[data-food-phase]");
  const modeButton = event.target.closest("[data-food-phase-mode]");
  const nextButton = event.target.closest("[data-next]");
  const startButton = event.target.closest("[data-cooking-start]");
  const cookingTarget = event.target.closest("[data-cooking-target]");
  const repeatInstructionButton = event.target.closest("[data-cooking-repeat-instruction]");
  const repeatButton = event.target.closest("[data-cooking-repeat]");
  const exportButton = event.target.closest("[data-cooking-export]");
  const navButton = event.target.closest("[data-cooking-nav]");

  if (phaseButton) {
    showFoodModeSelection(phaseButton.dataset.foodPhase);
    return;
  }

  if (modeButton) {
    showEmptyFoodActivity(modeButton.dataset.foodPhaseMode);
    return;
  }

  if (nextButton) {
    showFoodScreen(nextButton.dataset.next);
    return;
  }

  if (startButton) {
    startGame();
    return;
  }

  if (cookingTarget) {
    handleCookingTarget(cookingTarget.dataset.cookingTarget);
    return;
  }

  if (repeatInstructionButton) {
    repeatCurrentInstruction();
    return;
  }

  if (repeatButton) {
    resetGame();
    return;
  }

  if (exportButton) {
    exportResultsCSV();
    return;
  }

  if (navButton) {
    if (navButton.dataset.cookingNav === "phases") {
      resetGame();
      showFoodScreen("screen-food-phase-selection");
      return;
    }

  }
});
