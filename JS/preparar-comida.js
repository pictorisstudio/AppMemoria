const foodScreens = document.querySelectorAll(".medical-screen");
const foodModeTitle = document.getElementById("food-mode-title");
const foodEmptyTitle = document.getElementById("food-empty-title");
const foodEmptyDescription = document.getElementById("food-empty-description");

const foodState = {
  currentPhase: null,
  currentMode: null
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

document.addEventListener("click", (event) => {
  const phaseButton = event.target.closest("[data-food-phase]");
  const modeButton = event.target.closest("[data-food-phase-mode]");
  const nextButton = event.target.closest("[data-next]");

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
  }
});
