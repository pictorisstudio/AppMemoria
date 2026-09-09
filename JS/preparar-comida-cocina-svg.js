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
  const scenario = getCurrentScenario();
  const step = getCurrentStep();
  const activeNoteId = step.id;
  const disabledHotspots = gameState.isStepLocked || gameState.screen !== "scene" ? "disabled" : "";
  const slots = scenario.kitchenSlots;
  const visualCueClass = scenario.visualCueMode ? " is-visual-cue-mode" : "";

  return `
    <div class="cooking-scene${visualCueClass}">
      <svg class="kitchen-art" viewBox="0 0 1320 680" aria-hidden="true" focusable="false">
        <rect class="kitchen-wall" x="0" y="0" width="1320" height="680" />
        <path class="kitchen-tile-lines" d="M0 120 H1320 M0 260 H1320 M190 0 V680 M380 0 V680 M570 0 V680 M760 0 V680 M950 0 V680 M1140 0 V680" />

        <g class="kitchen-cabinets">
          <rect x="120" y="34" width="210" height="118" rx="18" />
          <rect x="392" y="34" width="210" height="118" rx="18" />
          <line x1="225" y1="54" x2="225" y2="134" />
          <line x1="497" y1="54" x2="497" y2="134" />
        </g>

        <g class="fridge">
          <rect x="956" y="30" width="346" height="612" rx="34" />
          <line x1="956" y1="260" x2="1302" y2="260" />
          <line x1="1010" y1="116" x2="1010" y2="210" />
          <line x1="1010" y1="338" x2="1010" y2="502" />
        </g>

        <g class="elder-person">
          <circle class="person-head" cx="170" cy="318" r="46" />
          <path class="person-hair" d="M130 314 C138 260 206 250 218 312 C196 292 158 292 130 314 Z" />
          <path class="person-body" d="M112 384 C132 352 210 352 232 384 L250 540 H94 Z" />
          <path class="person-arm" d="M224 418 C280 416 318 396 354 360" />
          <circle class="person-hand" cx="356" cy="360" r="14" />
        </g>

        <g class="counter">
          <rect x="300" y="500" width="700" height="86" rx="20" />
          <rect x="320" y="200" width="640" height="370" rx="32" />
        </g>

        <g class="stove">
          <rect class="stove-base" x="348" y="230" width="600" height="310" rx="34" />
          <line class="stove-divider" x1="648" y1="244" x2="648" y2="526" />
          <line class="stove-divider" x1="362" y1="385" x2="934" y2="385" />

          ${renderBurnerSvg(slots.topLeft, 500, 312)}
          ${renderBurnerSvg(slots.topRight, 795, 312)}
          ${renderBurnerSvg(slots.bottomLeft, 500, 458)}
          ${renderBurnerSvg(slots.bottomRight, 795, 458)}
        </g>

        ${renderKitchenFoods(scenario.visualVariant, slots)}

        <g class="recipe-sheet">
          <rect x="18" y="118" width="274" height="450" rx="16" />
          <text class="recipe-title" x="155" y="164">Notas</text>
          ${scenario.recipeNotes
            .map(([id, y, lineOne, lineTwo]) => renderRecipeNote(id, y, lineOne, lineTwo, activeNoteId))
            .join("")}
        </g>

        <g class="phone ${gameState.screen === "scene" ? "is-target" : ""}">
          <rect class="phone-body" x="880" y="398" width="176" height="246" rx="34" />
          <rect class="phone-screen" x="898" y="418" width="140" height="204" rx="22" />
          <rect class="phone-speaker" x="944" y="432" width="48" height="12" rx="6" />
          <circle class="phone-camera" cx="1002" cy="438" r="4" />
          <path class="phone-glare" d="M902 608 C956 574 1000 506 1036 430 V622 H902 Z" />
          <text x="968" y="528">${getPhoneTimerText()}</text>
        </g>
      </svg>

      <button class="cooking-hotspot cooking-hotspot-top-left" type="button" data-cooking-target="${slots.topLeft}" ${disabledHotspots}>${slots.topLeft}</button>
      <button class="cooking-hotspot cooking-hotspot-top-right" type="button" data-cooking-target="${slots.topRight}" ${disabledHotspots}>${slots.topRight}</button>
      <button class="cooking-hotspot cooking-hotspot-bottom-left" type="button" data-cooking-target="${slots.bottomLeft}" ${disabledHotspots}>${slots.bottomLeft}</button>
      <button class="cooking-hotspot cooking-hotspot-bottom-right" type="button" data-cooking-target="${slots.bottomRight}" ${disabledHotspots}>${slots.bottomRight}</button>
    </div>
  `;
}

function getFoodFeedbackClass(targetId) {
  if (gameState.feedbackTarget === targetId) {
    if (gameState.feedbackType === "success") return "is-food-success";
    if (gameState.feedbackType === "error") return "is-food-error";
  }

  if (
    getCurrentScenario().visualCueMode &&
    gameState.screen === "scene" &&
    getCurrentStep().targetId === targetId
  ) {
    return "is-food-target";
  }

  return "";
}

function renderKitchenFoods(variant, slots) {
  if (variant === "phase4-double") return renderPhase3Foods(slots);
  if (variant === "phase4") return renderPhase4Foods(slots);
  if (variant === "phase3") return renderPhase3Foods(slots);
  if (variant === "phase2-double") return renderPhase2DoubleFoods(slots);
  if (variant === "phase2") return renderPhase2Foods(slots);
  if (variant === "phase1-double") return renderPhase1DoubleFoods(slots);
  return renderPhase1Foods(slots);
}

function renderCarnePieces(cx, cy, scale = 1) {
  return `
    <g class="food-carne-pieces" transform="translate(${cx} ${cy}) scale(${scale})">
      <path class="meat-cut meat-cut-one" d="M-36 -20 C-20 -50 24 -44 42 -10 C26 28 -26 26 -36 -20 Z" />
      <path class="meat-cut meat-cut-two" d="M-46 12 C-24 -16 18 -2 28 34 C4 58 -38 48 -46 12 Z" />
      <path class="meat-line" d="M-24 -24 C-10 -8 10 -2 34 -8 M-30 14 C-10 22 6 30 18 42 M-4 -36 C-16 -10 -22 12 -30 32" />
    </g>
  `;
}

function renderPorkChop(cx, cy, scale = 0.68) {
  return `
    <g class="pork-chop-mini" transform="translate(${cx} ${cy}) scale(${scale}) translate(-795 -458)">
      <path class="pork-chop-base" d="M746 474 C732 450 744 424 774 416 C792 412 804 416 820 406 C846 388 880 414 880 448 C880 490 846 518 798 518 C770 518 756 492 746 474 Z" />
      <path class="pork-chop-fat-edge" d="M746 474 C732 450 744 424 774 416 C792 412 804 416 820 406 C846 388 880 414 880 448 C880 490 846 518 798 518 C770 518 756 492 746 474 Z" />
      <path class="pork-chop-large-section" d="M810 426 C832 394 868 416 866 450 C864 486 838 502 802 500 C794 474 794 446 810 426 Z" />
      <path class="pork-chop-left-section" d="M756 438 C772 424 794 426 806 424 C792 446 778 458 758 468 C750 456 750 446 756 438 Z" />
      <path class="pork-chop-bottom-section" d="M766 484 C786 470 796 456 806 446 C806 464 808 480 812 500 C790 500 774 494 766 484 Z" />
      <path class="pork-chop-divider" d="M806 424 C788 446 776 458 758 468 M806 446 C806 466 808 482 812 500" />
    </g>
  `;
}

function renderGuisoBowl(cx, cy, scale = 1) {
  return `
    <g class="guiso-bowl" transform="translate(${cx} ${cy}) scale(${scale}) translate(-500 -458)">
      <circle class="guiso-pot" cx="500" cy="458" r="64" />
      <circle class="guiso-cream" cx="500" cy="458" r="50" />
      <circle class="guiso-base" cx="500" cy="458" r="42" />
      <path class="pot-side-handle" d="M438 458 C418 438 418 478 438 458" />
      <path class="pot-side-handle" d="M562 458 C582 438 582 478 562 458" />
      <circle class="tomato" cx="476" cy="444" r="10" />
      <circle class="tomato" cx="526" cy="474" r="10" />
      <circle class="onion" cx="506" cy="452" r="10" />
      <circle class="garlic-piece" cx="488" cy="476" r="7" />
      <circle class="garlic-piece" cx="532" cy="440" r="6" />
      <path class="guiso-strip" d="M470 470 l20 -18 M508 484 l24 -14 M490 438 l-18 -14" />
    </g>
  `;
}

function renderVegetablesMix(cx, cy, scale = 1) {
  return `
    <g class="vegetables-mix" transform="translate(${cx} ${cy}) scale(${scale})">
      <circle class="veggie-tomato" cx="-34" cy="-20" r="12" />
      <circle class="veggie-tomato" cx="36" cy="30" r="11" />
      <circle class="veggie-onion" cx="0" cy="6" r="14" />
      <circle class="veggie-corn" cx="32" cy="-18" r="9" />
      <circle class="veggie-olive" cx="-18" cy="40" r="10" />
      <path class="veggie-broccoli" d="M-54 28 C-70 20 -66 0 -48 -2 C-40 -18 -18 -12 -22 6 C-8 14 -16 34 -34 32 Z" />
      <path class="veggie-broccoli" d="M34 10 C18 2 22 -18 40 -18 C48 -34 70 -28 66 -8 C80 0 72 20 54 18 Z" />
      <rect class="carrot-piece" x="-24" y="-30" width="15" height="38" rx="6" transform="rotate(-36 -16 -11)" />
      <rect class="bell-pepper-piece" x="14" y="40" width="15" height="34" rx="6" transform="rotate(48 22 57)" />
      <rect class="green-bean" x="-58" y="4" width="11" height="46" rx="6" transform="rotate(30 -52 27)" />
    </g>
  `;
}

function renderWholePotatoes(cx, cy, scale = 1) {
  return `
    <g class="potatoes-in-pot" transform="translate(${cx} ${cy}) scale(${scale})">
      <g transform="translate(-38 -28) rotate(-18)">
        <path class="whole-potato potato-in-pot" d="M0 20 C2 4 22 -4 36 8 C50 20 44 44 26 50 C10 54 -4 38 0 20 Z" />
        <path class="potato-skin-mark potato-skin-mark-small" d="M10 38 C18 40 25 39 32 35" />
      </g>
      <g transform="translate(8 -38) rotate(14)">
        <path class="whole-potato whole-potato-back potato-in-pot" d="M0 18 C4 2 24 -3 38 8 C54 21 48 45 30 51 C12 56 -4 36 0 18 Z" />
        <path class="potato-skin-mark potato-skin-mark-small" d="M28 37 C36 33 40 27 42 20" />
      </g>
      <g transform="translate(-28 14) rotate(20)">
        <path class="whole-potato whole-potato-front potato-in-pot" d="M0 18 C5 2 25 -3 39 8 C52 20 47 43 30 50 C12 56 -5 36 0 18 Z" />
        <path class="potato-skin-mark potato-skin-mark-small" d="M9 36 C17 39 26 38 34 34" />
      </g>
      <g transform="translate(22 16) rotate(-10)">
        <path class="whole-potato potato-in-pot" d="M0 17 C4 2 22 -4 36 7 C50 19 45 42 28 49 C12 55 -4 35 0 17 Z" />
        <path class="potato-skin-mark potato-skin-mark-small" d="M27 36 C35 32 39 26 41 19" />
      </g>
    </g>
  `;
}

function renderPlantainSlices(cx, cy, scale = 1) {
  return `
    <g class="plantain-slices" transform="translate(${cx} ${cy}) scale(${scale})">
      <ellipse class="plantain-slice" cx="-29" cy="-20" rx="14" ry="26" transform="rotate(-34 -29 -20)" />
      <ellipse class="plantain-slice" cx="-5" cy="-10" rx="14" ry="26" transform="rotate(-14 -5 -10)" />
      <ellipse class="plantain-slice" cx="21" cy="-8" rx="14" ry="25" transform="rotate(14 21 -8)" />
      <ellipse class="plantain-slice plantain-front" cx="-15" cy="24" rx="15" ry="27" transform="rotate(60 -15 24)" />
      <ellipse class="plantain-slice plantain-front" cx="29" cy="22" rx="15" ry="27" transform="rotate(48 29 22)" />
      <path class="plantain-seeds" d="M-29 -20 l5 5 M-5 -10 l5 5 M21 -8 l5 5 M-15 24 l5 5 M29 22 l5 5" />
    </g>
  `;
}

function renderPhase1Foods(slots) {
  return `
    <g class="food-pan food-arroz ${getFoodFeedbackClass(slots.topLeft)}">
      <circle class="pot-handle" cx="438" cy="312" r="18" />
      <circle class="pot-handle" cx="562" cy="312" r="18" />
      <circle class="pot-rim" cx="500" cy="312" r="65" />
      <circle class="pot-inner" cx="500" cy="312" r="51" />
      ${renderRiceGrains(500, 312)}
    </g>

    <g class="food-pan food-huevos ${getFoodFeedbackClass(slots.topRight)}">
      <path class="pan-handle angled-handle" d="M843 354 L927 430" />
      <circle class="pan-rim black-pan" cx="795" cy="312" r="66" />
      <circle class="pan-inner tomato-sauce" cx="795" cy="312" r="48" />
      <path class="egg-white egg-blob" d="M759 288 C779 272 803 290 795 312 C789 334 753 330 745 306 C741 296 747 290 759 288 Z" />
      <path class="egg-white egg-blob" d="M815 319 C833 308 853 322 847 342 C839 364 807 358 801 338 C799 330 805 322 815 319 Z" />
      <path class="egg-white egg-blob" d="M768 338 C785 324 809 340 803 360 C795 382 761 376 755 354 C753 348 759 342 768 338 Z" />
      <circle class="egg-yolk" cx="775" cy="302" r="10" />
      <circle class="egg-yolk" cx="828" cy="338" r="10" />
      <circle class="egg-yolk" cx="781" cy="356" r="10" />
      <path class="herb" d="M747 322 l12 -6 M751 314 l5 14 M827 302 l13 -7 M833 296 l5 14 M809 368 l12 -8 M815 360 l4 14" />
    </g>

    <g class="food-pan food-guiso ${getFoodFeedbackClass(slots.bottomLeft)}">
      <circle class="guiso-pot" cx="500" cy="458" r="64" />
      <circle class="guiso-cream" cx="500" cy="458" r="50" />
      <circle class="guiso-base" cx="500" cy="458" r="42" />
      <path class="pot-side-handle" d="M438 458 C418 438 418 478 438 458" />
      <path class="pot-side-handle" d="M562 458 C582 438 582 478 562 458" />
      <circle class="tomato" cx="478" cy="448" r="10" />
      <circle class="tomato" cx="524" cy="472" r="10" />
      <circle class="pepper" cx="506" cy="432" r="9" />
      <circle class="pepper" cx="487" cy="480" r="9" />
      <circle class="onion" cx="518" cy="449" r="10" />
      <circle class="guiso-corn" cx="495" cy="462" r="6" />
      <circle class="guiso-olive" cx="536" cy="438" r="8" />
      <path class="guiso-strip" d="M470 470 l20 -18 M508 484 l24 -14 M490 438 l-18 -14" />
    </g>

    <g class="food-pan food-carne ${getFoodFeedbackClass(slots.bottomRight)}">
      <circle class="plate-rim" cx="795" cy="458" r="65" />
      <circle class="plate-inner" cx="795" cy="458" r="52" />
      ${renderCarnePieces(795, 458)}
    </g>
  `;
}

function renderPhase1DoubleFoods(slots) {
  return `
    <g class="food-pan food-sopa ${getFoodFeedbackClass(slots.topLeft)}">
      <circle class="pot-handle" cx="438" cy="312" r="18" />
      <circle class="pot-handle" cx="562" cy="312" r="18" />
      <circle class="pot-rim" cx="500" cy="312" r="65" />
      <circle class="pasta-water" cx="500" cy="312" r="50" />
      <circle class="tomato" cx="478" cy="300" r="9" />
      <circle class="pepper" cx="520" cy="326" r="8" />
      <circle class="guiso-corn" cx="502" cy="306" r="6" />
      <path class="herb" d="M462 324 l18 -9 M508 286 l16 -8 M530 312 l20 -7" />
      <path class="pasta-noodles-light" d="M456 314 C480 296 510 332 540 306 M464 336 C494 318 512 346 540 328" />
    </g>

    <g class="food-pan food-carne-doble ${getFoodFeedbackClass(slots.topRight)}">
      <path class="pan-handle angled-handle" d="M843 354 L927 430" />
      <circle class="pan-rim black-pan" cx="795" cy="312" r="66" />
      <circle class="pan-inner tomato-sauce" cx="795" cy="312" r="48" />
      ${renderCarnePieces(795, 312, 0.9)}
    </g>

    <g class="food-pan food-verdura ${getFoodFeedbackClass(slots.bottomLeft)}">
      <path class="pan-handle" d="M438 458 H390" />
      <circle class="pan-rim vegetable-pan" cx="500" cy="458" r="64" />
      <circle class="pan-inner vegetable-base" cx="500" cy="458" r="46" />
      ${renderVegetablesMix(500, 458, 0.72)}
    </g>

    <g class="food-pan food-cerdo ${getFoodFeedbackClass(slots.bottomRight)}">
      <circle class="plate-rim" cx="795" cy="458" r="65" />
      <circle class="plate-inner" cx="795" cy="458" r="52" />
      ${renderPorkChop(795, 458, 0.68)}
    </g>
  `;
}

function renderPhase2Foods(slots) {
  return `
    <g class="food-pan food-pasta ${getFoodFeedbackClass(slots.topLeft)}">
      <circle class="pot-handle" cx="438" cy="312" r="18" />
      <circle class="pot-handle" cx="562" cy="312" r="18" />
      <circle class="pot-rim" cx="500" cy="312" r="65" />
      <circle class="pasta-water" cx="500" cy="312" r="50" />
      <path class="pasta-noodles pasta-noodles-back" d="M456 306 C474 280 502 292 512 276 C536 282 548 306 528 322 C506 340 472 334 456 306 Z" />
      <path class="pasta-noodles" d="M456 312 C478 286 506 302 532 282 M462 330 C490 296 518 340 542 310 M466 292 C490 318 522 286 544 306 M474 342 C498 320 522 350 538 328 M454 324 C488 336 508 288 542 296" />
      <path class="pasta-noodles-light" d="M468 304 C488 292 514 306 534 292 M474 324 C494 310 516 330 538 316 M486 286 C502 304 520 292 534 302" />
      <circle class="lemon-slice" cx="502" cy="314" r="13" />
      <path class="lemon-lines" d="M502 301 V327 M490 314 H515 M493 305 L511 323 M511 305 L493 323" />
      <ellipse class="basil-leaf" cx="476" cy="294" rx="9" ry="17" transform="rotate(-28 476 294)" />
      <ellipse class="basil-leaf" cx="530" cy="294" rx="8" ry="15" transform="rotate(28 530 294)" />
      <ellipse class="basil-leaf" cx="486" cy="340" rx="8" ry="15" transform="rotate(62 486 340)" />
      <ellipse class="basil-leaf" cx="526" cy="336" rx="7" ry="13" transform="rotate(-52 526 336)" />
    </g>

    <g class="food-pan food-pollo ${getFoodFeedbackClass(slots.topRight)}">
      <path class="pan-handle angled-handle" d="M843 354 L927 430" />
      <circle class="pan-rim black-pan" cx="795" cy="312" r="66" />
      <circle class="pan-inner oil-pan" cx="795" cy="312" r="48" />
      <path class="grill-line" d="M754 288 H836 M750 312 H840 M756 336 H834" />
      <path class="chicken-cut chicken-cut-left" d="M758 306 C754 282 776 266 798 280 C806 296 798 326 780 342 C762 332 758 318 758 306 Z" />
      <path class="chicken-cut chicken-cut-center" d="M796 306 C794 282 818 266 834 286 C850 312 838 342 812 348 C798 336 794 320 796 306 Z" />
      <path class="chicken-cut chicken-cut-right" d="M832 304 C826 280 852 266 870 284 C878 308 862 338 842 344 C828 330 832 316 832 304 Z" />
      <path class="chicken-line" d="M770 292 L792 318 M764 314 L782 334 M810 292 L834 318 M806 316 L824 338 M844 292 L866 318 M840 314 L858 334" />
    </g>

    <g class="food-pan food-verduras ${getFoodFeedbackClass(slots.bottomLeft)}">
      <path class="pan-handle" d="M438 458 H390" />
      <circle class="pan-rim vegetable-pan" cx="500" cy="458" r="64" />
      <circle class="pan-inner vegetable-base" cx="500" cy="458" r="46" />
      <circle class="veggie-tomato" cx="478" cy="440" r="9" />
      <circle class="veggie-tomato" cx="526" cy="474" r="8" />
      <circle class="veggie-onion" cx="504" cy="454" r="10" />
      <circle class="veggie-corn" cx="522" cy="438" r="7" />
      <circle class="veggie-olive" cx="486" cy="478" r="8" />
      <path class="veggie-broccoli" d="M466 468 C454 462 456 448 470 446 C476 434 492 438 490 452 C500 458 494 472 480 470 Z" />
      <path class="veggie-broccoli" d="M526 458 C514 452 516 438 530 438 C536 426 552 430 550 446 C560 452 554 466 540 464 Z" />
      <rect class="carrot-piece" x="490" y="426" width="12" height="28" rx="5" transform="rotate(-36 496 440)" />
      <rect class="carrot-piece" x="508" y="472" width="12" height="27" rx="5" transform="rotate(48 514 486)" />
      <rect class="green-bean" x="470" y="452" width="9" height="34" rx="5" transform="rotate(30 474 469)" />
      <rect class="green-bean" x="536" y="446" width="9" height="32" rx="5" transform="rotate(-42 540 462)" />
    </g>

    <g class="food-pan food-platano ${getFoodFeedbackClass(slots.bottomRight)}">
      <path class="pan-handle angled-handle" d="M843 500 L922 574" />
      <circle class="pan-rim black-pan" cx="795" cy="458" r="66" />
      <circle class="pan-inner oil-pan" cx="795" cy="458" r="48" />
      <ellipse class="plantain-slice" cx="766" cy="438" rx="14" ry="26" transform="rotate(-34 766 438)" />
      <ellipse class="plantain-slice" cx="790" cy="448" rx="14" ry="26" transform="rotate(-14 790 448)" />
      <ellipse class="plantain-slice" cx="816" cy="450" rx="14" ry="25" transform="rotate(14 816 450)" />
      <ellipse class="plantain-slice plantain-front" cx="780" cy="482" rx="15" ry="27" transform="rotate(60 780 482)" />
      <ellipse class="plantain-slice plantain-front" cx="824" cy="480" rx="15" ry="27" transform="rotate(48 824 480)" />
      <path class="plantain-seeds" d="M766 438 l5 5 M790 448 l5 5 M816 450 l5 5 M780 482 l5 5 M824 480 l5 5" />
    </g>
  `;
}

function renderPhase2DoubleFoods(slots) {
  return `
    <g class="food-pan food-papas ${getFoodFeedbackClass(slots.topLeft)}">
      <circle class="pot-handle" cx="438" cy="312" r="18" />
      <circle class="pot-handle" cx="562" cy="312" r="18" />
      <circle class="pot-rim" cx="500" cy="312" r="65" />
      <circle class="potato-pot-fill" cx="500" cy="312" r="50" />
      ${renderWholePotatoes(500, 312, 0.62)}
    </g>

    <g class="food-pan food-pollo ${getFoodFeedbackClass(slots.topRight)}">
      <path class="pan-handle angled-handle" d="M843 354 L927 430" />
      <circle class="pan-rim black-pan" cx="795" cy="312" r="66" />
      <circle class="pan-inner oil-pan" cx="795" cy="312" r="48" />
      <path class="grill-line" d="M754 288 H836 M750 312 H840 M756 336 H834" />
      <path class="chicken-cut chicken-cut-left" d="M758 306 C754 282 776 266 798 280 C806 296 798 326 780 342 C762 332 758 318 758 306 Z" />
      <path class="chicken-cut chicken-cut-center" d="M796 306 C794 282 818 266 834 286 C850 312 838 342 812 348 C798 336 794 320 796 306 Z" />
      <path class="chicken-line" d="M770 292 L792 318 M764 314 L782 334 M810 292 L834 318 M806 316 L824 338" />
      <circle class="seasoning-dot" cx="782" cy="286" r="4" />
      <circle class="seasoning-dot" cx="824" cy="334" r="4" />
      <circle class="seasoning-dot" cx="840" cy="300" r="3" />
    </g>

    <g class="food-pan food-guiso ${getFoodFeedbackClass(slots.bottomLeft)}">
      <circle class="guiso-pot" cx="500" cy="458" r="64" />
      <circle class="guiso-cream" cx="500" cy="458" r="50" />
      <circle class="guiso-base" cx="500" cy="458" r="42" />
      <path class="pot-side-handle" d="M438 458 C418 438 418 478 438 458" />
      <path class="pot-side-handle" d="M562 458 C582 438 582 478 562 458" />
      <circle class="tomato" cx="476" cy="444" r="10" />
      <circle class="tomato" cx="526" cy="474" r="10" />
      <circle class="onion" cx="506" cy="452" r="10" />
      <circle class="garlic-piece" cx="488" cy="476" r="7" />
      <circle class="garlic-piece" cx="532" cy="440" r="6" />
      <path class="guiso-strip" d="M470 470 l20 -18 M508 484 l24 -14 M490 438 l-18 -14" />
    </g>

    <g class="food-pan food-platano-doble ${getFoodFeedbackClass(slots.bottomRight)}">
      <path class="pan-handle angled-handle" d="M843 500 L922 574" />
      <circle class="pan-rim black-pan" cx="795" cy="458" r="66" />
      <circle class="pan-inner oil-pan" cx="795" cy="458" r="48" />
      ${renderPlantainSlices(795, 458)}
    </g>
  `;
}

function renderPhase3Foods(slots) {
  return `
    <g class="food-pan food-arroz ${getFoodFeedbackClass(slots.topLeft)}">
      <circle class="pot-handle" cx="438" cy="312" r="18" />
      <circle class="pot-handle" cx="562" cy="312" r="18" />
      <circle class="pot-rim" cx="500" cy="312" r="65" />
      <circle class="rice-water" cx="500" cy="312" r="51" />
      ${renderRiceGrains(500, 312)}
    </g>

    <g class="food-pan food-carne-res ${getFoodFeedbackClass(slots.topRight)}">
      <path class="pan-handle angled-handle" d="M843 354 L927 430" />
      <circle class="pan-rim black-pan" cx="795" cy="312" r="66" />
      <circle class="pan-inner oil-pan" cx="795" cy="312" r="48" />
      ${renderCarnePieces(795, 312, 0.86)}
      <circle class="seasoning-dot" cx="790" cy="288" r="4" />
      <circle class="seasoning-dot" cx="836" cy="344" r="4" />
    </g>

    <g class="food-pan food-verduras-salteadas ${getFoodFeedbackClass(slots.bottomLeft)}">
      <path class="pan-handle" d="M438 458 H390" />
      <circle class="pan-rim vegetable-pan" cx="500" cy="458" r="64" />
      <circle class="pan-inner vegetable-base" cx="500" cy="458" r="46" />
      ${renderVegetablesMix(500, 458, 0.72)}
      <path class="veggie-steam-line" d="M474 430 C466 418 482 414 476 402 M510 428 C502 416 518 412 512 400 M538 436 C530 424 546 420 540 408" />
    </g>

    <g class="food-pan food-papa-rodajas ${getFoodFeedbackClass(slots.bottomRight)}">
      <path class="pan-handle angled-handle" d="M843 500 L922 574" />
      <circle class="pan-rim black-pan" cx="795" cy="458" r="66" />
      <circle class="pan-inner oil-pan" cx="795" cy="458" r="48" />
      ${renderWholePotatoes(795, 458, 0.62)}
    </g>
  `;
}

function renderPhase4Foods(slots) {
  return `
    <g class="food-pan food-lentejas ${getFoodFeedbackClass(slots.topLeft)}">
      <circle class="pot-handle" cx="438" cy="312" r="18" />
      <circle class="pot-handle" cx="562" cy="312" r="18" />
      <circle class="pot-rim" cx="500" cy="312" r="65" />
      <circle class="lentil-water" cx="500" cy="312" r="51" />
      ${renderLentils(500, 312)}
    </g>

    <g class="food-pan food-pollo-f4 ${getFoodFeedbackClass(slots.topRight)}">
      <path class="pan-handle angled-handle" d="M843 354 L927 430" />
      <circle class="pan-rim black-pan" cx="795" cy="312" r="66" />
      <circle class="pan-inner oil-pan" cx="795" cy="312" r="48" />
      <path class="chicken-cut chicken-cut-left" d="M758 306 C754 282 776 266 798 280 C806 296 798 326 780 342 C762 332 758 318 758 306 Z" />
      <path class="chicken-cut chicken-cut-center" d="M804 310 C802 284 830 270 846 292 C862 318 848 348 820 350 C808 338 802 324 804 310 Z" />
      <path class="chicken-line" d="M770 292 L792 318 M764 314 L782 334 M818 294 L842 320 M812 318 L830 340" />
      <circle class="seasoning-dot" cx="784" cy="286" r="4" />
      <circle class="seasoning-dot" cx="838" cy="334" r="4" />
      <circle class="seasoning-dot" cx="812" cy="304" r="3" />
    </g>

    <g class="food-pan food-guiso-f4 ${getFoodFeedbackClass(slots.bottomLeft)}">
      <circle class="guiso-pot" cx="500" cy="458" r="64" />
      <circle class="guiso-cream" cx="500" cy="458" r="50" />
      <circle class="guiso-base" cx="500" cy="458" r="42" />
      <path class="pot-side-handle" d="M438 458 C418 438 418 478 438 458" />
      <path class="pot-side-handle" d="M562 458 C582 438 582 478 562 458" />
      <circle class="tomato" cx="476" cy="444" r="10" />
      <circle class="tomato" cx="526" cy="474" r="10" />
      <circle class="onion" cx="506" cy="452" r="10" />
      <circle class="garlic-piece" cx="488" cy="476" r="7" />
      <circle class="garlic-piece" cx="532" cy="440" r="6" />
      <path class="guiso-strip" d="M470 470 l20 -18 M508 484 l24 -14 M490 438 l-18 -14" />
    </g>

    <g class="food-pan food-platano-tajadas ${getFoodFeedbackClass(slots.bottomRight)}">
      <path class="pan-handle angled-handle" d="M843 500 L922 574" />
      <circle class="pan-rim black-pan" cx="795" cy="458" r="66" />
      <circle class="pan-inner oil-pan" cx="795" cy="458" r="48" />
      ${renderPlantainSlices(795, 458)}
    </g>
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

function renderFoodPreviewSvg(foodId) {
  const kind = getPreviewFoodKind(foodId);
  const potFoods = ["arroz", "pasta", "papas", "lentejas", "sopa"];
  const content = renderPreviewFoodContent(kind);

  if (kind === "guiso") {
    return `
      <svg class="food-preview-svg" viewBox="0 0 300 230" aria-hidden="true" focusable="false">
        <g class="food-pan food-preview-guiso">
          ${renderGuisoBowl(150, 112, 1.22)}
        </g>
      </svg>
    `;
  }

  return `
    <svg class="food-preview-svg" viewBox="0 0 300 230" aria-hidden="true" focusable="false">
      <g class="food-pan food-preview-${kind}">
        ${
          potFoods.includes(kind)
            ? `
              <circle class="pot-handle" cx="72" cy="112" r="18" />
              <circle class="pot-handle" cx="228" cy="112" r="18" />
              <circle class="pot-rim" cx="150" cy="112" r="82" />
              <circle class="${kind === "papas" ? "potato-pot-fill" : kind === "lentejas" ? "lentil-water" : kind === "pasta" ? "pasta-water" : "pot-inner"}" cx="150" cy="112" r="66" />
            `
            : `
              <path class="pan-handle angled-handle" d="M212 165 L278 216" />
              <circle class="pan-rim black-pan" cx="150" cy="112" r="84" />
              <circle class="pan-inner ${kind === "guiso" || kind === "verduras" ? "vegetable-base" : "oil-pan"}" cx="150" cy="112" r="63" />
            `
        }
        ${content}
      </g>
    </svg>
  `;
}

function getPreviewFoodKind(foodId) {
  const aliases = {
    arroz: "arroz",
    "arroz-f3": "arroz",
    "arroz-f4-doble": "arroz",
    sopa: "sopa",
    pasta: "pasta",
    papas: "papas",
    "papas-f3-doble": "papas",
    "papas-f4-doble": "papas",
    "papa-rodajas": "papas",
    lentejas: "lentejas",
    huevos: "huevos",
    carne: "carne",
    "carne-doble": "carne",
    cerdo: "cerdo",
    "carne-res": "carne",
    "carne-f4-doble": "carne",
    pollo: "pollo",
    "pollo-filetes": "pollo",
    "pollo-f4": "pollo",
    "pechuga-f3-doble": "pollo",
    guiso: "guiso",
    "guiso-cebolla": "guiso",
    "guiso-f3-doble": "guiso",
    "guiso-f4": "guiso",
    verdura: "verduras",
    verduras: "verduras",
    "verduras-salteadas": "verduras",
    "verduras-f4-doble": "verduras",
    platano: "platano",
    "platano-doble": "platano",
    "platano-f3-doble": "platano",
    "platano-tajadas": "platano"
  };

  return aliases[foodId] || "verduras";
}

function renderPreviewFoodContent(kind) {
  if (kind === "arroz") return renderRiceGrains(150, 112);
  if (kind === "lentejas") return renderLentils(150, 112);

  if (kind === "sopa") {
    return `
      <circle class="tomato" cx="124" cy="100" r="10" />
      <circle class="pepper" cx="174" cy="130" r="9" />
      <circle class="guiso-corn" cx="150" cy="108" r="7" />
      <path class="herb" d="M110 132 l24 -10 M156 82 l22 -10 M182 112 l26 -8" />
      <path class="pasta-noodles-light" d="M104 116 C132 94 166 134 198 104 M112 138 C146 118 166 152 198 132" />
    `;
  }

  if (kind === "pasta") {
    return `
      <path class="pasta-noodles pasta-noodles-back" d="M96 104 C120 72 152 92 168 72 C202 84 214 118 184 140 C152 164 112 150 96 104 Z" />
      <path class="pasta-noodles" d="M94 112 C124 80 156 102 198 78 M102 136 C138 94 166 150 204 112 M108 88 C138 126 176 84 204 108 M116 154 C146 126 174 164 196 138 M94 130 C132 146 160 84 204 96" />
      <path class="pasta-noodles-light" d="M110 106 C134 90 166 108 194 92 M118 128 C142 112 168 140 200 120 M134 84 C150 108 174 90 194 106" />
      <circle class="lemon-slice" cx="154" cy="116" r="14" />
      <ellipse class="basil-leaf" cx="116" cy="92" rx="9" ry="17" transform="rotate(-28 116 92)" />
      <ellipse class="basil-leaf" cx="192" cy="96" rx="8" ry="15" transform="rotate(28 192 96)" />
      <ellipse class="basil-leaf" cx="134" cy="154" rx="8" ry="15" transform="rotate(62 134 154)" />
      <ellipse class="basil-leaf" cx="186" cy="148" rx="7" ry="13" transform="rotate(-52 186 148)" />
    `;
  }

  if (kind === "papas") {
    return renderWholePotatoes(150, 112, 0.85);
  }

  if (kind === "huevos") {
    return `
      <circle class="pan-inner tomato-sauce" cx="150" cy="112" r="63" />
      <path class="egg-white egg-blob" d="M102 86 C126 66 156 88 146 116 C138 144 96 136 88 106 C84 96 92 88 102 86 Z" />
      <path class="egg-white egg-blob" d="M166 120 C190 102 218 122 208 150 C198 178 158 170 150 142 C148 132 156 124 166 120 Z" />
      <circle class="egg-yolk" cx="122" cy="104" r="13" />
      <circle class="egg-yolk" cx="180" cy="142" r="13" />
      <path class="herb" d="M92 126 l18 -10 M98 116 l6 18 M186 94 l20 -10 M194 86 l6 18" />
    `;
  }

  if (kind === "pollo") {
    return `
      <path class="grill-line" d="M92 82 H208 M86 112 H214 M96 142 H204" />
      <path class="chicken-cut chicken-cut-left" d="M102 112 C96 82 124 62 152 82 C162 104 150 144 128 164 C106 150 102 128 102 112 Z" />
      <path class="chicken-cut chicken-cut-center" d="M152 108 C150 78 180 62 202 86 C222 120 206 158 174 166 C158 150 150 128 152 108 Z" />
      <path class="chicken-line" d="M118 92 L146 124 M108 122 L132 150 M170 92 L198 124 M164 122 L190 152" />
      <circle class="seasoning-dot" cx="132" cy="86" r="5" />
      <circle class="seasoning-dot" cx="198" cy="140" r="5" />
    `;
  }

  if (kind === "carne") {
    return renderCarnePieces(150, 112, 1);
  }

  if (kind === "cerdo") {
    return renderPorkChop(150, 112, 0.86);
  }

  if (kind === "platano") {
    return renderPlantainSlices(150, 112, 1.28);
  }

  if (kind === "verduras") {
    return renderVegetablesMix(150, 112, 1);
  }

  return `
    <circle class="veggie-tomato" cx="116" cy="86" r="12" />
    <circle class="veggie-tomato" cx="186" cy="136" r="11" />
    <circle class="veggie-onion" cx="150" cy="112" r="14" />
    <circle class="veggie-corn" cx="182" cy="88" r="9" />
    <circle class="veggie-olive" cx="132" cy="146" r="10" />
    <path class="veggie-broccoli" d="M96 134 C80 126 84 106 102 104 C110 88 132 94 128 112 C142 120 134 140 116 138 Z" />
    <path class="veggie-broccoli" d="M184 116 C168 108 172 88 190 88 C198 72 220 78 216 98 C230 106 222 126 204 124 Z" />
    <rect class="carrot-piece" x="126" y="74" width="15" height="38" rx="6" transform="rotate(-36 133 93)" />
    <rect class="bell-pepper-piece" x="164" y="144" width="15" height="34" rx="6" transform="rotate(48 171 161)" />
    <rect class="green-bean" x="92" y="110" width="11" height="46" rx="6" transform="rotate(30 98 133)" />
  `;
}

function renderRiceGrains(cx, cy) {
  const grains = [
    [-30, -24, 14, -22], [-12, -30, 5, -17], [14, -28, 28, -18],
    [-42, -8, -26, 0], [-18, -8, -4, 4], [6, -10, 22, 4],
    [30, -6, 42, 8], [-34, 18, -18, 26], [-8, 18, 8, 28],
    [18, 16, 34, 26], [-42, 8, -28, 18], [34, 12, 46, 22],
    [-22, -20, -8, -12], [0, -22, 14, -12], [22, -18, 36, -8],
    [-30, 2, -14, 10], [-4, 4, 12, 14], [16, 2, 30, 12],
    [-22, 30, -8, 36], [4, 32, 18, 38], [-2, -2, 10, 8]
  ];

  return `
    <circle class="rice-bed" cx="${cx}" cy="${cy}" r="45" />
    <g class="rice-grains">
      ${grains
        .map(
          ([x1, y1, x2, y2]) =>
            `<line x1="${cx + x1}" y1="${cy + y1}" x2="${cx + x2}" y2="${cy + y2}" />`
        )
        .join("")}
    </g>
  `;
}

function renderLentils(cx, cy) {
  const lentils = [
    [-30, -26], [-10, -30], [14, -28], [32, -18], [-38, -8],
    [-18, -8], [4, -10], [26, -4], [40, 10], [-30, 12],
    [-8, 14], [14, 12], [32, 24], [-22, 30], [4, 32],
    [22, 34], [-42, 22], [40, -18], [-2, -24], [18, -8],
    [-20, 4], [6, 4], [24, 8], [-6, 24], [12, 24]
  ];

  return `
    <g class="lentil-dots">
      ${lentils
        .map(([x, y]) => `<circle cx="${cx + x}" cy="${cy + y}" r="5" />`)
        .join("")}
    </g>
  `;
}

function getPhoneTimerText() {
  const symbolicTime = getSymbolicTime();
  if (symbolicTime === "Finalizando") return "0 min";
  return symbolicTime
    .replace("Faltan ", "")
    .replace(/\bsegundos?\b/, "seg.");
}

function renderRecipeNote(id, y, lineOne, lineTwo, activeNoteId) {
  const activeClass = id === activeNoteId ? " is-active-note" : "";

  return `
    <g class="recipe-note${activeClass}">
      <rect x="48" y="${y - 38}" width="214" height="54" rx="8" />
      <text x="155" y="${y - 15}">${lineOne}</text>
      <text x="155" y="${y + 12}">${lineTwo}</text>
    </g>
  `;
}
