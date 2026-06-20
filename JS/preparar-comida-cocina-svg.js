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
  const disabledHotspots = gameState.isStepLocked ? "disabled" : "";
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
      <path class="meat-cut meat-cut-one" d="M759 438 C775 408 819 414 837 448 C821 486 769 484 759 438 Z" />
      <path class="meat-cut meat-cut-two" d="M749 466 C769 442 807 454 817 486 C793 510 753 500 749 466 Z" />
      <path class="meat-line" d="M771 432 C783 446 801 452 827 448 M765 468 C783 476 797 484 807 496 M789 422 C779 446 773 466 765 484" />
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
      <path class="meat-cut meat-cut-one" d="M758 296 C774 270 820 276 838 308 C822 344 770 342 758 296 Z" />
      <path class="meat-cut meat-cut-two" d="M748 324 C770 300 808 312 818 344 C792 368 754 358 748 324 Z" />
      <path class="meat-line" d="M770 290 C786 306 804 312 828 308 M764 326 C784 334 800 342 810 352 M790 282 C780 306 774 326 766 344" />
    </g>

    <g class="food-pan food-verdura ${getFoodFeedbackClass(slots.bottomLeft)}">
      <circle class="guiso-pot" cx="500" cy="458" r="64" />
      <circle class="guiso-cream" cx="500" cy="458" r="50" />
      <circle class="guiso-base" cx="500" cy="458" r="42" />
      <path class="pot-side-handle" d="M438 458 C418 438 418 478 438 458" />
      <path class="pot-side-handle" d="M562 458 C582 438 582 478 562 458" />
      <circle class="pepper" cx="476" cy="444" r="10" />
      <circle class="onion" cx="524" cy="468" r="10" />
      <circle class="guiso-olive" cx="510" cy="436" r="8" />
      <path class="herb" d="M466 472 l25 -16 M500 484 l32 -18 M488 438 l-24 -14 M520 450 l24 -12" />
    </g>

    <g class="food-pan food-cerdo ${getFoodFeedbackClass(slots.bottomRight)}">
      <circle class="plate-rim" cx="795" cy="458" r="65" />
      <circle class="plate-inner" cx="795" cy="458" r="52" />
      <path class="meat-cut meat-cut-one" d="M756 440 C776 410 820 416 842 448 C824 486 770 486 756 440 Z" />
      <path class="meat-cut meat-cut-two" d="M750 466 C770 444 808 454 820 486 C794 510 754 500 750 466 Z" />
      <circle class="egg-yolk" cx="820" cy="436" r="7" />
      <path class="meat-line" d="M770 432 C788 448 804 452 830 448 M764 468 C784 476 800 484 810 496 M792 422 C782 446 774 466 766 484" />
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
      <circle class="papa-water" cx="500" cy="312" r="50" />
      <ellipse class="potato-piece" cx="476" cy="296" rx="15" ry="20" transform="rotate(-22 476 296)" />
      <ellipse class="potato-piece" cx="510" cy="292" rx="16" ry="21" transform="rotate(28 510 292)" />
      <ellipse class="potato-piece" cx="528" cy="322" rx="15" ry="20" transform="rotate(-18 528 322)" />
      <ellipse class="potato-piece" cx="490" cy="334" rx="16" ry="21" transform="rotate(22 490 334)" />
      <circle class="water-bubble" cx="468" cy="324" r="5" />
      <circle class="water-bubble" cx="538" cy="304" r="4" />
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
      <ellipse class="plantain-slice" cx="766" cy="438" rx="14" ry="26" transform="rotate(-34 766 438)" />
      <ellipse class="plantain-slice" cx="790" cy="448" rx="14" ry="26" transform="rotate(-14 790 448)" />
      <ellipse class="plantain-slice" cx="816" cy="450" rx="14" ry="25" transform="rotate(14 816 450)" />
      <ellipse class="plantain-slice plantain-front" cx="780" cy="482" rx="15" ry="27" transform="rotate(60 780 482)" />
      <ellipse class="plantain-slice plantain-front" cx="824" cy="480" rx="15" ry="27" transform="rotate(48 824 480)" />
      <path class="plantain-seeds" d="M766 438 l5 5 M790 448 l5 5 M816 450 l5 5 M780 482 l5 5 M824 480 l5 5" />
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
      <path class="beef-piece" d="M760 298 C772 274 806 276 818 300 C806 326 770 328 760 298 Z" />
      <path class="beef-piece beef-piece-two" d="M810 322 C824 298 856 304 864 332 C846 354 816 348 810 322 Z" />
      <path class="beef-piece beef-piece-three" d="M766 342 C782 322 812 334 812 360 C792 374 766 366 766 342 Z" />
      <path class="beef-line" d="M772 296 C788 306 800 310 812 304 M820 324 C836 330 848 332 858 326 M778 344 C790 352 800 354 808 350" />
      <circle class="seasoning-dot" cx="790" cy="288" r="4" />
      <circle class="seasoning-dot" cx="836" cy="344" r="4" />
    </g>

    <g class="food-pan food-verduras-salteadas ${getFoodFeedbackClass(slots.bottomLeft)}">
      <path class="pan-handle" d="M438 458 H390" />
      <circle class="pan-rim vegetable-pan" cx="500" cy="458" r="64" />
      <circle class="pan-inner vegetable-base" cx="500" cy="458" r="46" />
      <rect class="carrot-piece" x="466" y="438" width="13" height="30" rx="5" transform="rotate(-34 472 453)" />
      <rect class="carrot-piece" x="512" y="470" width="13" height="28" rx="5" transform="rotate(48 518 484)" />
      <circle class="veggie-onion" cx="498" cy="452" r="10" />
      <circle class="veggie-onion" cx="526" cy="472" r="8" />
      <rect class="bell-pepper-piece" x="526" y="438" width="12" height="30" rx="5" transform="rotate(-32 532 453)" />
      <rect class="bell-pepper-piece" x="482" y="472" width="12" height="27" rx="5" transform="rotate(38 488 486)" />
      <path class="veggie-steam-line" d="M474 430 C466 418 482 414 476 402 M510 428 C502 416 518 412 512 400 M538 436 C530 424 546 420 540 408" />
    </g>

    <g class="food-pan food-papa-rodajas ${getFoodFeedbackClass(slots.bottomRight)}">
      <path class="pan-handle angled-handle" d="M843 500 L922 574" />
      <circle class="pan-rim black-pan" cx="795" cy="458" r="66" />
      <circle class="pan-inner oil-pan" cx="795" cy="458" r="48" />
      <ellipse class="fried-potato-slice" cx="766" cy="438" rx="14" ry="26" transform="rotate(-34 766 438)" />
      <ellipse class="fried-potato-slice" cx="790" cy="448" rx="14" ry="26" transform="rotate(-14 790 448)" />
      <ellipse class="fried-potato-slice" cx="816" cy="450" rx="14" ry="25" transform="rotate(14 816 450)" />
      <ellipse class="fried-potato-slice" cx="780" cy="482" rx="15" ry="27" transform="rotate(60 780 482)" />
      <ellipse class="fried-potato-slice" cx="824" cy="480" rx="15" ry="27" transform="rotate(48 824 480)" />
      <path class="potato-fry-marks" d="M766 438 l5 5 M790 448 l5 5 M816 450 l5 5 M780 482 l5 5 M824 480 l5 5" />
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
      <path class="plantain-strip" d="M756 438 C770 420 792 424 798 448 C786 470 762 466 756 438 Z" />
      <path class="plantain-strip plantain-strip-front" d="M802 440 C818 422 842 430 846 456 C832 478 808 468 802 440 Z" />
      <path class="plantain-strip" d="M770 478 C786 458 810 464 816 490 C800 510 776 502 770 478 Z" />
      <path class="plantain-strip plantain-strip-front" d="M818 482 C832 462 856 470 860 496 C846 516 822 506 818 482 Z" />
      <path class="plantain-brown-line" d="M764 440 C774 450 784 454 794 450 M810 444 C822 454 834 458 842 454 M780 480 C792 490 802 494 812 490 M826 486 C838 496 848 500 856 496" />
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
