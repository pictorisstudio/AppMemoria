const screens = document.querySelectorAll(".screen");
const helpButton = document.getElementById("help-button");
const helpModal = document.getElementById("help-modal");
const closeHelpButton = document.getElementById("close-help");
const screenWipe = document.getElementById("screen-wipe");

function showScreen(screenId) {
  const targetScreen = document.getElementById(screenId);

  if (!targetScreen) {
    console.error(`No existe la pantalla: ${screenId}`);
    return;
  }

  screens.forEach((screen) => {
    screen.classList.remove("is-active");
  });

  targetScreen.classList.add("is-active");
}

function showScreenWithWipe(screenId) {
  if (!screenWipe) {
    showScreen(screenId);
    return;
  }

  screenWipe.classList.remove("is-active");

  void screenWipe.offsetWidth;

  screenWipe.classList.add("is-active");

  setTimeout(() => {
    showScreen(screenId);
  }, 430);

  setTimeout(() => {
    screenWipe.classList.remove("is-active");
  }, 950);
}

document.addEventListener("click", (event) => {
  const element = event.target.closest("[data-screen]");

  if (!element) return;

  const screenId = element.dataset.screen;
  showScreen(screenId);
});

helpButton.addEventListener("click", () => {
  helpModal.classList.add("is-open");
});

closeHelpButton.addEventListener("click", () => {
  helpModal.classList.remove("is-open");
});

helpModal.addEventListener("click", (event) => {
  if (event.target === helpModal) {
    helpModal.classList.remove("is-open");
  }
});

window.addEventListener("load", () => {
  setTimeout(() => {
    showScreenWithWipe("screen-home");
  }, 1200);
});