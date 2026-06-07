const foodScreens = document.querySelectorAll(".medical-screen");
const foodModeTitle = document.getElementById("food-mode-title");
const foodEmptyTitle = document.getElementById("food-empty-title");
const foodEmptyDescription = document.getElementById("food-empty-description");
const cookingGameRoot = document.getElementById("cooking-game-root");

const correctShoppingList = [
  "Lentejas",
  "Garbanzos",
  "Tomates",
  "Cebollas",
  "Lechuga",
  "Espinaca"
];

const memoryOptions = [
  "Lentejas",
  "Garbanzos",
  "Tomates",
  "Cebollas",
  "Lechuga",
  "Espinaca",
  "Pan",
  "Arroz",
  "Leche"
];

const burners = [
  { id: "arroz", label: "Arroz", icon: "🍚", position: "Superior izquierda" },
  { id: "carne", label: "Carne", icon: "🥩", position: "Superior derecha" },
  { id: "guiso", label: "Guiso", icon: "🍅", position: "Inferior izquierda" },
  { id: "huevos", label: "Huevos", icon: "🥚", position: "Inferior derecha" }
];

const symbolicTimes = {
  intro: "5:00",
  recipe: "5:00",
  kitchen: "5:00",
  step1: "4:00",
  step2: "3:00",
  step3: "2:00",
  message: "2:00",
  step4: "1:00",
  review: "0:30",
  memory: "0:00",
  result: "0:00"
};

const progressByScreen = {
  intro: 0,
  recipe: 0,
  kitchen: 0,
  step1: 20,
  step2: 40,
  step3: 60,
  message: 60,
  step4: 80,
  review: 90,
  memory: 100,
  result: 100
};

const foodState = {
  currentPhase: null,
  currentMode: null
};

const gameState = {
  screen: "intro",
  step2Action: "turn-on",
  startedAt: null,
  endedAt: null,
  correctSteps: 0,
  errors: 0,
  hintsUsed: 0,
  feedback: "",
  selectedReadyFoods: [],
  selectedProducts: [],
  productsRemembered: 0,
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
  gameState.step2Action = "turn-on";
  gameState.startedAt = null;
  gameState.endedAt = null;
  gameState.correctSteps = 0;
  gameState.errors = 0;
  gameState.hintsUsed = 0;
  gameState.feedback = "";
  gameState.selectedReadyFoods = [];
  gameState.selectedProducts = [];
  gameState.productsRemembered = 0;
  gameState.lastResult = null;
  renderScreen();
}

function getElapsedSeconds() {
  if (!gameState.startedAt) return 0;

  const endTime = gameState.endedAt || Date.now();
  return Math.round((endTime - gameState.startedAt) / 1000);
}

function createShell(title, body, actions = "") {
  const time = symbolicTimes[gameState.screen] || "5:00";
  const progress = progressByScreen[gameState.screen] || 0;

  return `
    <header class="cooking-header">
      <button class="back-button medical-back" type="button" data-cooking-nav="phases" aria-label="Volver">
        ‹
      </button>
      <div>
        <h1>${title}</h1>
        <p>Práctica cotidiana de memoria, atención y organización.</p>
      </div>
    </header>

    <div class="cooking-status" aria-label="Cronómetro simbólico">
      <div>
        <span>Tiempo simbólico</span>
        <strong>${time}</strong>
      </div>
      <div class="cooking-progress" aria-hidden="true">
        <span style="width: ${progress}%"></span>
      </div>
    </div>

    <div class="cooking-body">
      ${body}
    </div>

    <div class="cooking-actions">
      ${actions}
    </div>

    <nav class="cooking-bottom-nav" aria-label="Navegación inferior">
      <a href="../index.html">Inicio</a>
      <button type="button" data-cooking-nav="phases">Pruebas</button>
      <button type="button" data-cooking-nav="history">Historial</button>
      <button type="button" data-cooking-nav="settings">Ajustes</button>
    </nav>
  `;
}

function recipeCards() {
  return burners
    .map(
      (burner) => `
        <article class="recipe-card">
          <span>${burner.icon}</span>
          <strong>${burner.label}</strong>
        </article>
      `
    )
    .join("");
}

function burnerGrid({ selectable = true, selectedFoods = [] } = {}) {
  return `
    <div class="burner-grid">
      ${burners
        .map((burner) => {
          const selected = selectedFoods.includes(burner.id) ? " is-selected" : "";
          const disabled = selectable ? "" : "disabled";

          return `
            <button
              class="burner-card${selected}"
              type="button"
              data-burner="${burner.id}"
              ${disabled}
            >
              <span class="burner-position">${burner.position}</span>
              <span class="burner-icon">${burner.icon}</span>
              <strong>${burner.label}</strong>
            </button>
          `;
        })
        .join("")}
    </div>
  `;
}

function instructionScreen({ title, text, expected, repeatText }) {
  const body = `
    <div class="cooking-instruction">
      <h2>${text}</h2>
      <p>Toca la hornilla correcta para continuar.</p>
    </div>
    ${burnerGrid()}
    ${gameState.feedback ? `<p class="cooking-feedback">${gameState.feedback}</p>` : ""}
  `;

  const actions = `
    <button class="memory-button button-two cooking-action-button" type="button" data-cooking-hint="${repeatText}">
      Repetir instrucción
    </button>
  `;

  return createShell(title, body, actions);
}

function renderIntro() {
  const body = `
    <section class="cooking-intro">
      <h2>Preparar una comida</h2>
      <p>Vas a preparar una receta sencilla. Sigue los pasos y recuerda la lista que te dirá tu hija.</p>
      <small>La actividad será corta y guiada.</small>
    </section>
  `;

  const actions = `
    <button class="memory-button button-one cooking-action-button" type="button" data-cooking-next="recipe">
      Iniciar
    </button>
  `;

  return createShell("Preparar comida", body, actions);
}

function renderRecipe() {
  const body = `
    <section class="cooking-instruction">
      <h2>Hoy prepararás</h2>
      <p>Observa bien dónde está cada alimento.</p>
    </section>
    <div class="recipe-grid">${recipeCards()}</div>
  `;

  const actions = `
    <button class="memory-button button-one cooking-action-button" type="button" data-cooking-next="kitchen">
      Continuar
    </button>
  `;

  return createShell("Receta del día", body, actions);
}

function renderKitchen() {
  const body = `
    <section class="cooking-instruction">
      <h2>Cocina</h2>
      <p>Revisa las cuatro hornillas antes de comenzar.</p>
    </section>
    ${burnerGrid({ selectable: false })}
  `;

  const actions = `
    <button class="memory-button button-one cooking-action-button" type="button" data-cooking-next="step1">
      Comenzar preparación
    </button>
  `;

  return createShell("Cocina", body, actions);
}

function renderMessage() {
  const body = `
    <section class="daughter-message-card">
      <h2>Mensaje de tu hija</h2>
      <p>Por favor recuerda comprar:</p>
      <ul>
        ${correctShoppingList.map((product) => `<li>${product}</li>`).join("")}
      </ul>
    </section>
  `;

  const actions = `
    <button class="memory-button button-one cooking-action-button" type="button" data-cooking-next="step4">
      Entendido
    </button>
  `;

  return createShell("Mensaje de tu hija", body, actions);
}

function renderReview() {
  const body = `
    <section class="cooking-instruction">
      <h2>Revisa la preparación</h2>
      <p>Toca los alimentos que ya están listos.</p>
    </section>
    ${burnerGrid({ selectedFoods: gameState.selectedReadyFoods })}
    ${gameState.feedback ? `<p class="cooking-feedback">${gameState.feedback}</p>` : ""}
  `;

  const actions = `
    <button class="memory-button button-one cooking-action-button" type="button" data-cooking-finish-kitchen>
      Finalizar cocina
    </button>
  `;

  return createShell("Revisa la preparación", body, actions);
}

function renderMemoryQuestion() {
  const body = `
    <section class="cooking-instruction">
      <h2>¿Qué te pidió recordar tu hija?</h2>
      <p>Selecciona 3 productos de la lista.</p>
    </section>
    <div class="memory-product-grid">
      ${memoryOptions
        .map((product) => {
          const selected = gameState.selectedProducts.includes(product) ? " is-selected" : "";

          return `
            <button class="memory-product${selected}" type="button" data-product="${product}">
              ${product}
            </button>
          `;
        })
        .join("")}
    </div>
    ${gameState.feedback ? `<p class="cooking-feedback">${gameState.feedback}</p>` : ""}
  `;

  const actions = `
    <button class="memory-button button-one cooking-action-button" type="button" data-cooking-confirm-products>
      Confirmar
    </button>
  `;

  return createShell("Pregunta de memoria", body, actions);
}

function renderResult() {
  const result = gameState.lastResult;
  const body = `
    <section class="cooking-result">
      <h2>Resultado de la actividad</h2>
      <p><strong>Pasos correctos:</strong> ${result.correctSteps}</p>
      <p><strong>Errores:</strong> ${result.errors}</p>
      <p><strong>Productos recordados:</strong> ${result.productsRemembered}/3</p>
      <p><strong>Tiempo real total:</strong> ${result.totalTimeSeconds} s</p>
      <p><strong>Ayudas usadas:</strong> ${result.hintsUsed}</p>
    </section>
  `;

  const actions = `
    <button class="memory-button button-one cooking-action-button" type="button" data-cooking-repeat>
      Repetir actividad
    </button>
    <button class="memory-button button-two cooking-action-button" type="button" data-cooking-nav="phases">
      Volver a pruebas
    </button>
    <button class="memory-button button-one cooking-action-button" type="button" data-cooking-export>
      Exportar resultados
    </button>
  `;

  return createShell("Resultado", body, actions);
}

function renderScreen() {
  if (!cookingGameRoot) return;

  const screens = {
    intro: renderIntro,
    recipe: renderRecipe,
    kitchen: renderKitchen,
    step1: () =>
      instructionScreen({
        title: "Paso 1 de 5",
        text: "Agrega sal al arroz.",
        expected: "arroz",
        repeatText: "Agrega sal al arroz."
      }),
    step2: () =>
      instructionScreen({
        title: "Paso 2 de 5",
        text:
          gameState.step2Action === "turn-on"
            ? "Enciende el guiso."
            : "Ahora apaga el guiso para que no se queme.",
        expected: "guiso",
        repeatText:
          gameState.step2Action === "turn-on"
            ? "Enciende el guiso."
            : "Ahora apaga el guiso para que no se queme."
      }),
    step3: () =>
      instructionScreen({
        title: "Paso 3 de 5",
        text: "Ahora enciende la carne molida.",
        expected: "carne",
        repeatText: "Ahora enciende la carne molida."
      }),
    message: renderMessage,
    step4: () =>
      instructionScreen({
        title: "Paso 4 de 5",
        text: "Ahora pon a freír los huevos.",
        expected: "huevos",
        repeatText: "Ahora pon a freír los huevos."
      }),
    review: renderReview,
    memory: renderMemoryQuestion,
    result: renderResult
  };

  cookingGameRoot.innerHTML = screens[gameState.screen]();
}

function startRealTimerIfNeeded() {
  if (!gameState.startedAt) {
    gameState.startedAt = Date.now();
  }
}

function goToCookingScreen(screen) {
  startRealTimerIfNeeded();
  gameState.screen = screen;
  gameState.feedback = "";
  renderScreen();
}

function completeCurrentStep(message, nextScreen) {
  gameState.correctSteps++;
  gameState.feedback = `✓ ${message}`;
  renderScreen();

  setTimeout(() => {
    gameState.screen = nextScreen;
    gameState.feedback = "";
    renderScreen();
  }, 750);
}

function handleBurnerSelection(burnerId) {
  if (gameState.screen === "review") {
    if (gameState.selectedReadyFoods.includes(burnerId)) {
      gameState.selectedReadyFoods = gameState.selectedReadyFoods.filter(
        (food) => food !== burnerId
      );
    } else {
      gameState.selectedReadyFoods.push(burnerId);
    }

    renderScreen();
    return;
  }

  const expectedByScreen = {
    step1: "arroz",
    step2: "guiso",
    step3: "carne",
    step4: "huevos"
  };

  const expected = expectedByScreen[gameState.screen];

  if (burnerId !== expected) {
    gameState.errors++;
    gameState.feedback =
      gameState.screen === "step1"
        ? "✕ Intenta de nuevo. Busca el arroz."
        : `✕ Intenta de nuevo. Busca ${expected}.`;
    renderScreen();
    return;
  }

  if (gameState.screen === "step1") {
    completeCurrentStep("Muy bien. Agregaste sal al arroz.", "step2");
  }

  if (gameState.screen === "step2") {
    if (gameState.step2Action === "turn-on") {
      gameState.correctSteps++;
      gameState.step2Action = "turn-off";
      gameState.feedback = "✓ Encendiste el guiso.";
      renderScreen();
      return;
    }

    completeCurrentStep("Muy bien. Apagaste el guiso a tiempo.", "step3");
  }

  if (gameState.screen === "step3") {
    completeCurrentStep("La carne está cocinándose.", "message");
  }

  if (gameState.screen === "step4") {
    completeCurrentStep("Los huevos están en preparación.", "review");
  }
}

function repeatInstruction(text) {
  gameState.hintsUsed++;
  gameState.feedback = `↻ ${text}`;
  renderScreen();
}

function finishKitchenReview() {
  const requiredFoods = burners.map((burner) => burner.id);
  const selectedSet = new Set(gameState.selectedReadyFoods);
  const isComplete = requiredFoods.every((food) => selectedSet.has(food));

  if (!isComplete || gameState.selectedReadyFoods.length !== requiredFoods.length) {
    gameState.errors++;
    gameState.feedback = "✕ Selecciona arroz, guiso, carne y huevos.";
    renderScreen();
    return;
  }

  gameState.correctSteps++;
  gameState.screen = "memory";
  gameState.feedback = "";
  renderScreen();
}

function toggleProduct(product) {
  if (gameState.selectedProducts.includes(product)) {
    gameState.selectedProducts = gameState.selectedProducts.filter((item) => item !== product);
    renderScreen();
    return;
  }

  if (gameState.selectedProducts.length >= 3) {
    gameState.feedback = "Solo puedes seleccionar 3 productos.";
    renderScreen();
    return;
  }

  gameState.selectedProducts.push(product);
  gameState.feedback = "";
  renderScreen();
}

function confirmProducts() {
  if (gameState.selectedProducts.length !== 3) {
    gameState.errors++;
    gameState.feedback = "Selecciona exactamente 3 productos.";
    renderScreen();
    return;
  }

  gameState.productsRemembered = gameState.selectedProducts.filter((product) =>
    correctShoppingList.includes(product)
  ).length;

  finishGame();
}

function finishGame() {
  gameState.endedAt = Date.now();

  const result = {
    game: "preparar_comida",
    taskType: "linea_base_tarea_doble",
    startedAt: new Date(gameState.startedAt).toISOString(),
    endedAt: new Date(gameState.endedAt).toISOString(),
    totalTimeSeconds: getElapsedSeconds(),
    correctSteps: gameState.correctSteps,
    errors: gameState.errors,
    hintsUsed: gameState.hintsUsed,
    selectedProducts: [...gameState.selectedProducts],
    productsRemembered: gameState.productsRemembered,
    symbolicTimerCompleted: true,
    completed: true
  };

  const sessions = JSON.parse(localStorage.getItem("preparar_comida_sessions") || "[]");
  sessions.push(result);
  localStorage.setItem("preparar_comida_sessions", JSON.stringify(sessions));

  gameState.lastResult = result;
  gameState.screen = "result";
  renderScreen();
}

function exportResultsJSON() {
  const sessions = JSON.parse(localStorage.getItem("preparar_comida_sessions") || "[]");
  const blob = new Blob([JSON.stringify(sessions, null, 2)], {
    type: "application/json;charset=utf-8"
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `resultados-preparar-comida-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function showHistoryMessage() {
  const sessions = JSON.parse(localStorage.getItem("preparar_comida_sessions") || "[]");
  gameState.feedback = `Historial guardado: ${sessions.length} sesión(es).`;
  renderScreen();
}

document.addEventListener("click", (event) => {
  const phaseButton = event.target.closest("[data-food-phase]");
  const modeButton = event.target.closest("[data-food-phase-mode]");
  const nextButton = event.target.closest("[data-next]");
  const cookingNextButton = event.target.closest("[data-cooking-next]");
  const burnerButton = event.target.closest("[data-burner]");
  const hintButton = event.target.closest("[data-cooking-hint]");
  const finishKitchenButton = event.target.closest("[data-cooking-finish-kitchen]");
  const productButton = event.target.closest("[data-product]");
  const confirmProductsButton = event.target.closest("[data-cooking-confirm-products]");
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

  if (cookingNextButton) {
    goToCookingScreen(cookingNextButton.dataset.cookingNext);
    return;
  }

  if (burnerButton) {
    handleBurnerSelection(burnerButton.dataset.burner);
    return;
  }

  if (hintButton) {
    repeatInstruction(hintButton.dataset.cookingHint);
    return;
  }

  if (finishKitchenButton) {
    finishKitchenReview();
    return;
  }

  if (productButton) {
    toggleProduct(productButton.dataset.product);
    return;
  }

  if (confirmProductsButton) {
    confirmProducts();
    return;
  }

  if (repeatButton) {
    resetGame();
    return;
  }

  if (exportButton) {
    exportResultsJSON();
    return;
  }

  if (navButton) {
    if (navButton.dataset.cookingNav === "phases") {
      resetGame();
      showFoodScreen("screen-food-phase-selection");
      return;
    }

    if (navButton.dataset.cookingNav === "history") {
      showHistoryMessage();
      return;
    }

    if (navButton.dataset.cookingNav === "settings") {
      gameState.feedback = "Ajustes disponibles en una siguiente versión.";
      renderScreen();
    }
  }
});
