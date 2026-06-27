const foodScreens = document.querySelectorAll(".medical-screen");
const foodModeTitle = document.getElementById("food-mode-title");
const foodEmptyTitle = document.getElementById("food-empty-title");
const foodEmptyDescription = document.getElementById("food-empty-description");
const cookingGameRoot = document.getElementById("cooking-game-root");
const cookingAudioPlayer = new Audio();
const foodModeCards = {
  simple: document.querySelector('[data-food-phase-mode="simple"]'),
  double: document.querySelector('[data-food-phase-mode="double"]')
};
const openingStepCountdownSeconds = 25;
const phaseOneSimpleStepDeadlinesMs = {
  "sal-arroz": 5000,
  carne: 10000,
  "guiso-on": 15000,
  "guiso-off": 18000,
  huevos: 25000
};
const phaseOneDoubleStepDeadlinesMs = {
  "sal-sopa": 5000,
  cerdo: 10000,
  "verdura-on": 15000,
  "verdura-off": 18000,
  "carne-doble": 25000
};
const phaseTwoSimpleStepDeadlinesMs = {
  "sal-pasta": 37000,
  "verduras-on": 48000,
  "pollo-on": 60000,
  "verduras-off": 69000,
  "platano-on": 81000
};
const phaseTwoDoubleStepDeadlinesMs = {
  "sal-papas": 42000,
  "guiso-cebolla-on": 55000,
  "pollo-filetes-on": 66000,
  "guiso-cebolla-off": 75000,
  "platano-doble-on": 89000
};
const phaseThreeSimpleStepDeadlinesMs = {
  "sal-arroz-f3": 5000,
  "verduras-salteadas-on": 10000,
  "carne-res-on": 15000,
  "verduras-salteadas-off": 18000,
  "papa-rodajas-on": 25000
};
const phaseThreeDoubleStepDeadlinesMs = {
  "sal-papas-f3-doble": 5000,
  "pechuga-f3-doble-on": 10000,
  "guiso-f3-doble-on": 15000,
  "guiso-f3-doble-off": 18000,
  "platano-f3-doble-on": 25000
};
const phaseFourSimpleStepDeadlinesMs = {
  "sal-lentejas": 5000,
  "guiso-f4-on": 10000,
  "pollo-f4-on": 15000,
  "guiso-f4-off": 18000,
  "platano-tajadas-on": 25000
};
const phaseFourDoubleStepDeadlinesMs = {
  "sal-arroz-f4-doble": 5000,
  "verduras-f4-doble-on": 10000,
  "carne-f4-doble-on": 15000,
  "verduras-f4-doble-off": 18000,
  "papas-f4-doble-on": 25000
};

const foodPhaseModeCopy = {
  1: {
    structure: "Estructura A",
    simpleDescription: "Línea base con arroz, carne molida, guiso y huevos.",
    doubleDescription: "Línea base con la misma receta y una lista de compras para recordar."
  },
  2: {
    structure: "Estructura B",
    simpleDescription: "Claves auditivo-verbales para pasta, pechuga, verduras y plátano.",
    doubleDescription: "Claves auditivas con papas, pollo, guiso, huevos e interferencia de compras."
  },
  3: {
    structure: "Estructura A",
    simpleDescription: "Línea base con arroz, carne de res, verduras salteadas y rodajas de papa.",
    doubleDescription: "Línea base con la misma receta y recuerdo de alimentos durante la cocción."
  },
  4: {
    structure: "Estructura B",
    simpleDescription: "Claves visoespaciales para lentejas, pollo, guiso y tajadas de plátano.",
    doubleDescription: "Claves visoespaciales con arroz, verduras, carne, papas e interferencia visual."
  }
};

const cookingSteps = [
  {
    id: "sal-arroz",
    title: "Paso 1 de 5",
    instruction: "Agrega cuatro pizcas de sal al arroz.",
    targetId: "arroz",
    note: "Arroz: agregar 4 pizcas de sal.",
    success: "Sal agregada al arroz.",
    timer: "Faltan 30 segundos",
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
    progress: 40,
    turnOn: "carne"
  },
  {
    id: "guiso-on",
    title: "Paso 3 de 5",
    instruction: "Enciende la hornilla del guiso.",
    targetId: "guiso",
    note: "Guiso: sofreír 30 segundos.",
    success: "Guiso encendido.",
    timer: "Faltan 6 min",
    progress: 60,
    turnOn: "guiso"
  },
  {
    id: "guiso-off",
    title: "Paso 4 de 5",
    instruction: "Apaga la hornilla del guiso.",
    targetId: "guiso",
    note: "Guiso: apagar de inmediato.",
    success: "Guiso apagado a tiempo.",
    timer: "Faltan 5 min",
    progress: 75,
    turnOff: "guiso"
  },
  {
    id: "huevos",
    title: "Paso 5 de 5",
    instruction: "Enciende la hornilla de los huevos.",
    targetId: "huevos",
    note: "Huevos: poner a freír.",
    success: "Huevos encendidos.",
    timer: "Finalizando",
    progress: 100,
    turnOn: "huevos"
  }
];

const phaseOneDoubleSteps = [
  {
    id: "sal-sopa",
    title: "Paso 1 de 5",
    instruction: "Agrega cuatro pizcas de sal a la sopa.",
    targetId: "sopa",
    note: "Sopa: agregar 4 pizcas de sal.",
    success: "Sal agregada a la sopa.",
    timer: "Faltan 25 segundos",
    progress: 20
  },
  {
    id: "cerdo",
    title: "Paso 2 de 5",
    instruction: "Enciende la hornilla del cerdo.",
    targetId: "cerdo",
    note: "Cerdo: poner a freír.",
    success: "Cerdo encendido.",
    timer: "Faltan 15 segundos",
    progress: 40,
    turnOn: "cerdo"
  },
  {
    id: "verdura-on",
    title: "Paso 3 de 5",
    instruction: "Enciende la hornilla de la verdura.",
    targetId: "verdura",
    note: "Verdura: sofreír.",
    success: "Verdura encendida.",
    timer: "Faltan 10 segundos",
    progress: 60,
    turnOn: "verdura"
  },
  {
    id: "verdura-off",
    title: "Paso 4 de 5",
    instruction: "Apaga la hornilla de la verdura.",
    targetId: "verdura",
    note: "Verdura: apagar a tiempo.",
    success: "Verdura apagada a tiempo.",
    timer: "Faltan 7 segundos",
    progress: 75,
    turnOff: "verdura"
  },
  {
    id: "carne-doble",
    title: "Paso 5 de 5",
    instruction: "Enciende la hornilla de la carne.",
    targetId: "carne-doble",
    note: "Carne: poner a freír.",
    success: "Carne encendida.",
    timer: "Finalizando",
    progress: 100,
    turnOn: "carne-doble"
  }
];

const phase2SimpleSteps = [
  {
    id: "sal-pasta",
    title: "Paso 1 de 5",
    instruction: "Agrega cuatro pizcas de sal a la pasta.",
    targetId: "pasta",
    note: "Pasta: agregar 4 pizcas de sal.",
    success: "Sal agregada a la pasta.",
    timer: "Faltan 10 min",
    progress: 20,
    audioSrc: "../Audio/PrepararComida/Fase2/F2_B_SIMPLE_02_sal_pasta.mp3",
    audioText:
      "Soy tu hija. La pasta está arriba a la izquierda y ya lleva cinco minutos. Agrega cuatro pizcas de sal y mantén el fuego medio."
  },
  {
    id: "verduras-on",
    title: "Paso 2 de 5",
    instruction: "Enciende la hornilla de las verduras para sofreírlas.",
    targetId: "verduras",
    note: "Verduras: sofreír 1 minuto.",
    success: "Verduras encendidas.",
    timer: "Faltan 8 min",
    progress: 40,
    turnOn: "verduras",
    audioSrc: "../Audio/PrepararComida/Fase2/F2_B_SIMPLE_03_encender_verduras.mp3",
    audioText:
      "Ahora debes sofreír las verduras por un minuto: zanahoria, habichuela y cebolla. Están abajo a la izquierda."
  },
  {
    id: "pollo-on",
    title: "Paso 3 de 5",
    instruction: "Enciende la hornilla de la pechuga de pollo.",
    targetId: "pollo",
    note: "Pechuga: comenzar a freír.",
    success: "Pechuga encendida.",
    timer: "Faltan 7 min",
    progress: 60,
    turnOn: "pollo",
    audioSrc: "../Audio/PrepararComida/Fase2/F2_B_SIMPLE_04_encender_pollo.mp3",
    audioText:
      "Antes de que termine el minuto de las verduras, comienza a freír la pechuga arriba a la derecha y sigue pendiente de la pasta."
  },
  {
    id: "verduras-off",
    title: "Paso 4 de 5",
    instruction: "Apaga la hornilla de las verduras.",
    targetId: "verduras",
    note: "Verduras: apagar a tiempo.",
    success: "Verduras apagadas a tiempo.",
    timer: "Faltan 6 min",
    progress: 75,
    turnOff: "verduras",
    audioSrc: "../Audio/PrepararComida/Fase2/F2_B_SIMPLE_05_apagar_verduras.mp3",
    audioText:
      "Recuerda apagar las verduras casi de inmediato. Deben sofreírse solo un minuto."
  },
  {
    id: "platano-on",
    title: "Paso 5 de 5",
    instruction: "Enciende la hornilla del plátano.",
    targetId: "platano",
    note: "Plátano: comenzar a freír.",
    success: "Plátano encendido.",
    timer: "Faltan 4 min",
    progress: 100,
    turnOn: "platano",
    audioSrc: "../Audio/PrepararComida/Fase2/F2_B_SIMPLE_06_encender_platano.mp3",
    audioText:
      "Cuando falten cuatro minutos para que la pasta esté lista, comienza a freír las rodajas de plátano abajo a la derecha."
  }
];

const phase2DoubleSteps = [
  {
    id: "sal-papas",
    title: "Paso 1 de 5",
    instruction: "Agrega una pizca de sal a las papas.",
    targetId: "papas",
    note: "Papas: agregar 1 pizca de sal.",
    success: "Sal agregada a las papas.",
    timer: "Faltan 42 segundos",
    progress: 20,
    audioSrc: "../Audio/PrepararComida/Fase2/F2_B_DOBLE_02_sal_papas.mp3",
    audioText:
      "Soy tu hija. Las papas están arriba a la izquierda. Antes de que el cronómetro llegue a cuarenta y dos segundos, agrega una pizca de sal."
  },
  {
    id: "guiso-cebolla-on",
    title: "Paso 2 de 5",
    instruction: "Enciende la hornilla del guiso por aproximadamente un minuto.",
    targetId: "guiso-cebolla",
    note: "Guiso: sofreír 1 minuto.",
    success: "Guiso encendido.",
    timer: "Faltan 55 segundos",
    progress: 40,
    turnOn: "guiso-cebolla",
    audioSrc: "../Audio/PrepararComida/Fase2/F2_B_DOBLE_03_encender_guiso.mp3",
    audioText:
      "Enciende el guiso de cebolla, tomate y ajo. Está abajo a la izquierda y debe empezar a sofreírse antes de cincuenta y cinco segundos."
  },
  {
    id: "pollo-filetes-on",
    title: "Paso 3 de 5",
    instruction: "Enciende la hornilla de los filetes de pollo.",
    targetId: "pollo-filetes",
    note: "Pollo: comenzar a freír.",
    success: "Filetes de pollo encendidos.",
    timer: "Faltan 66 segundos",
    progress: 60,
    turnOn: "pollo-filetes",
    audioSrc: "../Audio/PrepararComida/Fase2/F2_B_DOBLE_04_encender_pollo.mp3",
    audioText:
      "Enciende los filetes de pollo de arriba a la derecha antes de que el cronómetro llegue a un minuto con seis segundos."
  },
  {
    id: "guiso-cebolla-off",
    title: "Paso 4 de 5",
    instruction: "Apaga la hornilla del guiso.",
    targetId: "guiso-cebolla",
    note: "Guiso: apagar pasado el minuto.",
    success: "Guiso apagado a tiempo.",
    timer: "Faltan 75 segundos",
    progress: 78,
    turnOff: "guiso-cebolla",
    audioSrc: "../Audio/PrepararComida/Fase2/F2_B_DOBLE_05_apagar_guiso.mp3",
    audioText:
      "Después de responder la compra, vuelve a la cocina y apaga el guiso antes de un minuto con quince segundos."
  },
  {
    id: "platano-doble-on",
    title: "Paso 5 de 5",
    instruction: "Enciende la hornilla para freír el plátano.",
    targetId: "platano-doble",
    note: "Plátano: comenzar a freír.",
    success: "Plátano encendido.",
    timer: "Faltan 89 segundos",
    progress: 100,
    turnOn: "platano-doble",
    audioSrc: "../Audio/PrepararComida/Fase2/F2_B_DOBLE_06_encender_huevos.mp3",
    audioText:
      "Antes de un minuto con veintinueve segundos, comienza a freír las rodajas de plátano abajo a la derecha."
  }
];

const phase3SimpleSteps = [
  {
    id: "sal-arroz-f3",
    title: "Paso 1 de 5",
    instruction: "Agrega una pizca de sal al arroz.",
    targetId: "arroz-f3",
    note: "Arroz: agregar 1 pizca de sal.",
    success: "Sal agregada al arroz.",
    timer: "Faltan 10 min",
    progress: 20
  },
  {
    id: "verduras-salteadas-on",
    title: "Paso 2 de 5",
    instruction: "Enciende la hornilla para sofreír las verduras.",
    targetId: "verduras-salteadas",
    note: "Verduras: sofreír 1 minuto.",
    success: "Verduras encendidas.",
    timer: "Faltan 9 min",
    progress: 40,
    turnOn: "verduras-salteadas"
  },
  {
    id: "carne-res-on",
    title: "Paso 3 de 5",
    instruction: "Enciende la hornilla para freír la carne.",
    targetId: "carne-res",
    note: "Carne: comenzar a freír.",
    success: "Carne encendida.",
    timer: "Faltan 8 min",
    progress: 60,
    turnOn: "carne-res"
  },
  {
    id: "verduras-salteadas-off",
    title: "Paso 4 de 5",
    instruction: "Apaga la hornilla de las verduras.",
    targetId: "verduras-salteadas",
    note: "Verduras: apagar pasado el minuto.",
    success: "Verduras apagadas a tiempo.",
    timer: "Faltan 7 min",
    progress: 78,
    turnOff: "verduras-salteadas"
  },
  {
    id: "papa-rodajas-on",
    title: "Paso 5 de 5",
    instruction: "Enciende la hornilla para freír las rodajas de papa.",
    targetId: "papa-rodajas",
    note: "Papas: comenzar a freír.",
    success: "Rodajas de papa encendidas.",
    timer: "Faltan 4 min",
    progress: 100,
    turnOn: "papa-rodajas"
  }
];

const phase3DoubleSteps = [
  {
    id: "sal-papas-f3-doble",
    title: "Paso 1 de 5",
    instruction: "Agrega una pizca de sal a las papas.",
    targetId: "papas-f3-doble",
    note: "Papas: agregar 1 pizca de sal.",
    success: "Sal agregada a las papas.",
    timer: "Faltan 5 segundos",
    progress: 20
  },
  {
    id: "pechuga-f3-doble-on",
    title: "Paso 2 de 5",
    instruction: "Enciende la hornilla para freír la pechuga.",
    targetId: "pechuga-f3-doble",
    note: "Pechuga: comenzar a freír.",
    success: "Pechuga encendida.",
    timer: "Faltan 10 segundos",
    progress: 40,
    turnOn: "pechuga-f3-doble"
  },
  {
    id: "guiso-f3-doble-on",
    title: "Paso 3 de 5",
    instruction: "Enciende la hornilla para sofreír el guiso.",
    targetId: "guiso-f3-doble",
    note: "Guiso: sofreír.",
    success: "Guiso encendido.",
    timer: "Faltan 15 segundos",
    progress: 60,
    turnOn: "guiso-f3-doble"
  },
  {
    id: "guiso-f3-doble-off",
    title: "Paso 4 de 5",
    instruction: "Apaga la hornilla del guiso.",
    targetId: "guiso-f3-doble",
    note: "Guiso: apagar a tiempo.",
    success: "Guiso apagado a tiempo.",
    timer: "Faltan 18 segundos",
    progress: 78,
    turnOff: "guiso-f3-doble"
  },
  {
    id: "platano-f3-doble-on",
    title: "Paso 5 de 5",
    instruction: "Enciende la hornilla para freír los plátanos.",
    targetId: "platano-f3-doble",
    note: "Plátanos: comenzar a freír.",
    success: "Plátanos encendidos.",
    timer: "Finalizando",
    progress: 100,
    turnOn: "platano-f3-doble"
  }
];

const phase4SimpleSteps = [
  {
    id: "sal-lentejas",
    title: "Paso 1 de 5",
    instruction: "Agrega una pizca de sal a las lentejas.",
    targetId: "lentejas",
    note: "Lentejas: agregar 1 pizca de sal.",
    success: "Sal agregada a las lentejas.",
    timer: "Faltan 10 min",
    progress: 20
  },
  {
    id: "guiso-f4-on",
    title: "Paso 2 de 5",
    instruction: "Enciende la hornilla del guiso.",
    targetId: "guiso-f4",
    note: "Guiso: sofreír 1 minuto.",
    success: "Guiso encendido.",
    timer: "Faltan 9 min",
    progress: 40,
    turnOn: "guiso-f4"
  },
  {
    id: "pollo-f4-on",
    title: "Paso 3 de 5",
    instruction: "Enciende la hornilla del pollo.",
    targetId: "pollo-f4",
    note: "Pollo: comenzar a freír.",
    success: "Pollo encendido.",
    timer: "Faltan 8 min",
    progress: 60,
    turnOn: "pollo-f4"
  },
  {
    id: "guiso-f4-off",
    title: "Paso 4 de 5",
    instruction: "Apaga la hornilla del guiso.",
    targetId: "guiso-f4",
    note: "Guiso: apagar a tiempo.",
    success: "Guiso apagado a tiempo.",
    timer: "Faltan 6 min",
    progress: 78,
    turnOff: "guiso-f4"
  },
  {
    id: "platano-tajadas-on",
    title: "Paso 5 de 5",
    instruction: "Enciende la hornilla para freír las tajadas de plátano.",
    targetId: "platano-tajadas",
    note: "Plátano: comenzar a freír.",
    success: "Tajadas de plátano encendidas.",
    timer: "Faltan 4 min",
    progress: 100,
    turnOn: "platano-tajadas"
  }
];

const phase4DoubleSteps = [
  {
    id: "sal-arroz-f4-doble",
    title: "Paso 1 de 5",
    instruction: "Agrega una pizca de sal al arroz.",
    targetId: "arroz-f4-doble",
    note: "Arroz: agregar 1 pizca de sal.",
    success: "Sal agregada al arroz.",
    timer: "Faltan 10 min",
    progress: 20
  },
  {
    id: "verduras-f4-doble-on",
    title: "Paso 2 de 5",
    instruction: "Enciende la hornilla para sofreír las verduras.",
    targetId: "verduras-f4-doble",
    note: "Verduras: sofreír 1 minuto.",
    success: "Verduras encendidas.",
    timer: "Faltan 9 min",
    progress: 40,
    turnOn: "verduras-f4-doble"
  },
  {
    id: "carne-f4-doble-on",
    title: "Paso 3 de 5",
    instruction: "Enciende la hornilla para freír los pedazos de carne.",
    targetId: "carne-f4-doble",
    note: "Carne: comenzar a freír.",
    success: "Carne encendida.",
    timer: "Faltan 8 min",
    progress: 60,
    turnOn: "carne-f4-doble"
  },
  {
    id: "verduras-f4-doble-off",
    title: "Paso 4 de 5",
    instruction: "Apaga la hornilla de las verduras.",
    targetId: "verduras-f4-doble",
    note: "Verduras: apagar pasado el minuto.",
    success: "Verduras apagadas a tiempo.",
    timer: "Faltan 6 min",
    progress: 78,
    turnOff: "verduras-f4-doble"
  },
  {
    id: "papas-f4-doble-on",
    title: "Paso 5 de 5",
    instruction: "Enciende la hornilla para freír las papas.",
    targetId: "papas-f4-doble",
    note: "Papas: comenzar a freír.",
    success: "Papas encendidas.",
    timer: "Faltan 4 min",
    progress: 100,
    turnOn: "papas-f4-doble"
  }
];

const burnerLabels = {
  arroz: "Arroz",
  carne: "Carne molida",
  guiso: "Guiso",
  huevos: "Huevos"
};

const daughterShoppingList = [
  "Lentejas",
  "Garbanzos",
  "Tomates",
  "Cebollas",
  "Lechuga",
  "Espinaca",
  "Menudencias"
];

const memoryProductOptions = [
  "Lentejas",
  "Arroz",
  "Garbanzos",
  "Tomates",
  "Pan",
  "Cebollas",
  "Lechuga",
  "Espinaca",
  "Leche",
  "Menudencias",
  "Queso",
  "Papas"
];

const phase2ShoppingList = [
  "Cebollas",
  "Pan",
  "Azúcar",
  "Sal",
  "Envueltos",
  "Tomates",
  "Papas"
];

const phase2ShoppingOptions = [
  "Cebollas",
  "Pan",
  "Azúcar",
  "Arroz",
  "Sal",
  "Lechuga",
  "Envueltos",
  "Tomates",
  "Papas",
  "Lentejas",
  "Pollo",
  "Huevos"
];

const phase4VehicleOptions = [
  {
    id: "auto_azul",
    label: "Auto azul",
    imageSrc: "../assets/interferencia-autos/opcion-auto-azul.png"
  },
  {
    id: "auto_rojo",
    label: "Auto rojo",
    imageSrc: "../assets/interferencia-autos/opcion-auto-rojo.png"
  },
  {
    id: "auto_amarillo",
    label: "Auto amarillo",
    imageSrc: "../assets/interferencia-autos/opcion-auto-amarillo.png"
  },
  {
    id: "auto_verde",
    label: "Auto verde",
    imageSrc: "../assets/interferencia-autos/opcion-auto-verde.png"
  },
  {
    id: "auto_blanco",
    label: "Auto blanco",
    imageSrc: "../assets/interferencia-autos/opcion-auto-blanco.png"
  },
  {
    id: "auto_gris",
    label: "Auto gris",
    imageSrc: "../assets/interferencia-autos/opcion-auto-gris.png"
  }
];

const cookingScenarioConfigs = {
  "1-simple": {
    enabled: true,
    phaseNumber: 1,
    structure: "Estructura A",
    taskLabel: "Tarea simple",
    taskType: "estructura_a_tarea_simple",
    introTitle: "Preparar una comida",
    introCopy: "Observa la cocina y sigue una secuencia corta: sal al arroz, carne, guiso y huevos.",
    introSmall: "La simulación representa 20 minutos de cocción en una actividad breve.",
    steps: cookingSteps,
    burnerLabels,
    temporal: {
      countdownSeconds: 25,
      stepDeadlinesMs: phaseOneSimpleStepDeadlinesMs,
      mandatoryStepId: "guiso-on",
      mandatoryDeadlineMs: 15000
    },
    visualVariant: "phase1",
    kitchenSlots: {
      topLeft: "arroz",
      topRight: "huevos",
      bottomLeft: "guiso",
      bottomRight: "carne"
    },
    recipeNotes: [
      ["sal-arroz", 220, "Sal", "al arroz"],
      ["carne", 294, "Freír", "carne"],
      ["guiso-on", 368, "Sofreír", "guiso"],
      ["guiso-off", 442, "Apagar", "guiso"],
      ["huevos", 516, "Freír", "huevos"]
    ],
    initialBurnersOn: {
      arroz: true,
      carne: false,
      guiso: false,
      huevos: false
    },
    memory: null,
    timeColumns: [
      ["tiempo_sal_arroz", "sal-arroz"],
      ["tiempo_carne", "carne"],
      ["tiempo_guiso_encender", "guiso-on"],
      ["tiempo_guiso_apagar", "guiso-off"],
      ["tiempo_huevos", "huevos"]
    ]
  },
  "1-double": {
    enabled: true,
    phaseNumber: 1,
    structure: "Estructura A",
    taskLabel: "Tarea doble",
    taskType: "estructura_a_tarea_doble",
    introTitle: "Preparar una comida",
    introCopy: "Observa la cocina, sigue la secuencia y recuerda la lista que te dirá tu hija.",
    introSmall: "Durante la cocina escucharás una compra de víveres y la responderás de inmediato.",
    steps: phaseOneDoubleSteps,
    burnerLabels: {
      sopa: "Sopa",
      cerdo: "Cerdo",
      verdura: "Verdura",
      "carne-doble": "Carne"
    },
    temporal: {
      countdownSeconds: 25,
      stepDeadlinesMs: phaseOneDoubleStepDeadlinesMs,
      mandatoryStepId: "verdura-on",
      mandatoryDeadlineMs: 15000
    },
    visualVariant: "phase1-double",
    kitchenSlots: {
      topLeft: "sopa",
      topRight: "carne-doble",
      bottomLeft: "verdura",
      bottomRight: "cerdo"
    },
    recipeNotes: [
      ["sal-sopa", 220, "Sal", "a sopa"],
      ["cerdo", 294, "Freír", "cerdo"],
      ["verdura-on", 368, "Sofreír", "verdura"],
      ["verdura-off", 442, "Apagar", "verdura"],
      ["carne-doble", 516, "Freír", "carne"]
    ],
    initialBurnersOn: {
      sopa: true,
      cerdo: false,
      verdura: false,
      "carne-doble": false
    },
    memory: {
      title: "Mensaje de tu hija",
      prompt: "Escucha y recuerda esta lista para responderla de inmediato.",
      question: "¿Qué productos pidió recordar tu hija?",
      instruction: "Selecciona todos los productos que recuerdes de la lista.",
      audioSrc: "../Audio/PrepararComida/Fase1/fase 1 tarea doble comida preparar.mp3",
      audioText:
        "Hola, recuerda comprar una libra de lentejas, dos de garbanzo, cinco tomates, dos cebollas, una cabeza de lechuga, espinaca y menudencias en carnicería.",
      list: daughterShoppingList,
      options: memoryProductOptions,
      interruptAfterStepId: "verdura-on",
      askAfterInterrupt: true,
      immediateQuestionAfterAudio: true
    },
    timeColumns: [
      ["tiempo_sal_sopa", "sal-sopa"],
      ["tiempo_cerdo", "cerdo"],
      ["tiempo_verdura_encender", "verdura-on"],
      ["tiempo_verdura_apagar", "verdura-off"],
      ["tiempo_carne", "carne-doble"]
    ]
  },
  "2-simple": {
    enabled: true,
    phaseNumber: 2,
    structure: "Estructura B",
    taskLabel: "Tarea simple",
    taskType: "estructura_b_tarea_simple",
    introTitle: "Preparar comida con claves",
    introCopy:
      "La cocina se guiará por claves de significado auditivo-verbal sobre ubicación, orden y tiempo de cocción.",
    introSmall:
      "Se prepararán pasta, pechuga, verduras y plátano con apoyo de avisos escritos y audio grabado.",
    steps: phase2SimpleSteps,
    burnerLabels: {
      pasta: "Pasta",
      pollo: "Pechuga",
      verduras: "Verduras",
      platano: "Plátano"
    },
    temporal: {
      countdownSeconds: 82,
      stepDeadlinesMs: phaseTwoSimpleStepDeadlinesMs,
      mandatoryStepId: "pollo-on",
      mandatoryDeadlineMs: 60000
    },
    visualVariant: "phase2",
    kitchenSlots: {
      topLeft: "pasta",
      topRight: "pollo",
      bottomLeft: "verduras",
      bottomRight: "platano"
    },
    recipeNotes: [
      ["sal-pasta", 220, "Sal a", "pasta"],
      ["verduras-on", 294, "Sofreír", "verduras"],
      ["pollo-on", 368, "Freír", "pollo"],
      ["verduras-off", 442, "Apagar", "verduras"],
      ["platano-on", 516, "Freír", "plátano"]
    ],
    initialBurnersOn: {
      pasta: true,
      pollo: false,
      verduras: false,
      platano: false
    },
    openingAudioText:
      "Hola, soy tu hija. Recuerda: la pasta está arriba a la izquierda a fuego medio. A su derecha está la pechuga esperando que la enciendas. Abajo a la izquierda están las verduras para sofreír: zanahoria, habichuela y cebolla. Abajo a la derecha están las rodajas de plátano para freír cuando sea el momento.",
    openingAudioSrc: "../Audio/PrepararComida/Fase2/F2_B_SIMPLE_01_pista_inicial_hija.mp3",
    memory: null,
    timeColumns: [
      ["tiempo_sal_pasta", "sal-pasta"],
      ["tiempo_verduras_encender", "verduras-on"],
      ["tiempo_pollo_encender", "pollo-on"],
      ["tiempo_verduras_apagar", "verduras-off"],
      ["tiempo_platano_encender", "platano-on"]
    ]
  },
  "2-double": {
    enabled: true,
    phaseNumber: 2,
    structure: "Estructura B",
    taskLabel: "Tarea doble",
    taskType: "estructura_b_tarea_doble",
    introTitle: "Preparar comida con claves y compras",
    introCopy:
      "Escucha las claves de la hija, cocina las papas, el guiso, el pollo y el plátano, y responde una interrupción de compras.",
    introSmall:
      "La pregunta de compras aparece inmediatamente después del audio y luego la cocina continúa con la secuencia.",
    steps: phase2DoubleSteps,
    burnerLabels: {
      papas: "Papas",
      "pollo-filetes": "Filetes de pollo",
      "guiso-cebolla": "Guiso",
      "platano-doble": "Plátano"
    },
    temporal: {
      countdownSeconds: 91,
      stepDeadlinesMs: phaseTwoDoubleStepDeadlinesMs,
      mandatoryStepId: "pollo-filetes-on",
      mandatoryDeadlineMs: 66000
    },
    visualVariant: "phase2-double",
    kitchenSlots: {
      topLeft: "papas",
      topRight: "pollo-filetes",
      bottomLeft: "guiso-cebolla",
      bottomRight: "platano-doble"
    },
    recipeNotes: [
      ["sal-papas", 220, "Sal a", "papas"],
      ["guiso-cebolla-on", 294, "Sofreír", "guiso"],
      ["pollo-filetes-on", 368, "Freír", "pollo"],
      ["guiso-cebolla-off", 442, "Apagar", "guiso"],
      ["platano-doble-on", 516, "Freír", "plátano"]
    ],
    initialBurnersOn: {
      papas: true,
      "pollo-filetes": false,
      "guiso-cebolla": false,
      "platano-doble": false
    },
    openingAudioText:
      "Hola, soy tu hija. Recuerda: arriba a la izquierda están las papas. Arriba a la derecha están los filetes de pollo. Abajo a la izquierda está el guiso de cebolla, tomate y ajo. Abajo a la derecha están las rodajas de plátano. El cronómetro corre desde ahora.",
    openingAudioSrc: "../Audio/PrepararComida/Fase2/F2_B_DOBLE_01_pista_inicial_hija.mp3",
    memory: {
      title: "Interferencia de compras",
      prompt: "Escucha el mensaje del familiar y recuerda los productos para responder ahora.",
      question: "¿Qué productos pidió comprar el familiar?",
      instruction: "Selecciona todos los productos mencionados en el mensaje.",
      audioSrc: "../Audio/PrepararComida/Fase2/F2_B_DOBLE_07_interferencia_familiar.mp3",
      audioText:
        "Hola, soy yo. Pasaba por aquí para recordarte que hay que comprar para mañana cebollas, pan, azúcar, sal, envueltos, tomates y papas.",
      list: phase2ShoppingList,
      options: phase2ShoppingOptions,
      interruptAfterStepId: "pollo-filetes-on",
      askAfterInterrupt: true,
      immediateQuestionAfterAudio: true
    },
    timeColumns: [
      ["tiempo_sal_papas", "sal-papas"],
      ["tiempo_guiso_encender", "guiso-cebolla-on"],
      ["tiempo_pollo_encender", "pollo-filetes-on"],
      ["tiempo_guiso_apagar", "guiso-cebolla-off"],
      ["tiempo_platano_encender", "platano-doble-on"]
    ]
  },
  "3-simple": {
    enabled: true,
    phaseNumber: 3,
    structure: "Estructura A",
    taskLabel: "Tarea simple",
    taskType: "fase_3_estructura_a_tarea_simple",
    introTitle: "Preparar comida - línea de base",
    introCopy:
      "Observa la cocina y coordina una secuencia simple con arroz, carne de res, verduras salteadas y rodajas de papa.",
    introSmall:
      "La tarea registra tiempos específicos para sal al arroz, verduras, carne y papa.",
    steps: phase3SimpleSteps,
    burnerLabels: {
      "arroz-f3": "Arroz",
      "carne-res": "Carne de res",
      "verduras-salteadas": "Verduras",
      "papa-rodajas": "Rodajas de papa"
    },
    temporal: {
      countdownSeconds: 25,
      stepDeadlinesMs: phaseThreeSimpleStepDeadlinesMs,
      mandatoryStepId: "carne-res-on",
      mandatoryDeadlineMs: 15000
    },
    visualVariant: "phase3",
    kitchenSlots: {
      topLeft: "arroz-f3",
      topRight: "carne-res",
      bottomLeft: "verduras-salteadas",
      bottomRight: "papa-rodajas"
    },
    recipeNotes: [
      ["sal-arroz-f3", 220, "Sal a", "arroz"],
      ["verduras-salteadas-on", 294, "Sofreír", "verduras"],
      ["carne-res-on", 368, "Freír", "carne"],
      ["verduras-salteadas-off", 442, "Apagar", "verduras"],
      ["papa-rodajas-on", 516, "Freír", "papa"]
    ],
    initialBurnersOn: {
      "arroz-f3": true,
      "carne-res": false,
      "verduras-salteadas": false,
      "papa-rodajas": false
    },
    memory: null,
    timeColumns: [
      ["tiempo_sal_arroz", "sal-arroz-f3"],
      ["tiempo_verduras_encender", "verduras-salteadas-on"],
      ["tiempo_carne_encender", "carne-res-on"],
      ["tiempo_verduras_apagar", "verduras-salteadas-off"],
      ["tiempo_papa_encender", "papa-rodajas-on"]
    ]
  },
  "3-double": {
    enabled: true,
    phaseNumber: 3,
    structure: "Estructura A",
    taskLabel: "Tarea doble",
    taskType: "fase_3_estructura_a_tarea_doble",
    introTitle: "Preparar comida - línea de base doble",
    introCopy:
      "Coordina papas, pechuga, guiso y plátanos mientras recuerdas una lista de compras.",
    introSmall:
      "La interferencia de memoria aparece durante la cocción y luego continúa la secuencia.",
    steps: phase3DoubleSteps,
    burnerLabels: {
      "papas-f3-doble": "Papas",
      "pechuga-f3-doble": "Pechuga",
      "guiso-f3-doble": "Guiso",
      "platano-f3-doble": "Plátanos"
    },
    temporal: {
      countdownSeconds: 25,
      stepDeadlinesMs: phaseThreeDoubleStepDeadlinesMs,
      mandatoryStepId: "guiso-f3-doble-on",
      mandatoryDeadlineMs: 15000
    },
    visualVariant: "phase2-double",
    kitchenSlots: {
      topLeft: "papas-f3-doble",
      topRight: "pechuga-f3-doble",
      bottomLeft: "guiso-f3-doble",
      bottomRight: "platano-f3-doble"
    },
    recipeNotes: [
      ["sal-papas-f3-doble", 220, "Sal a", "papas"],
      ["pechuga-f3-doble-on", 294, "Freír", "pechuga"],
      ["guiso-f3-doble-on", 368, "Sofreír", "guiso"],
      ["guiso-f3-doble-off", 442, "Apagar", "guiso"],
      ["platano-f3-doble-on", 516, "Freír", "plátanos"]
    ],
    initialBurnersOn: {
      "papas-f3-doble": true,
      "pechuga-f3-doble": false,
      "guiso-f3-doble": false,
      "platano-f3-doble": false
    },
    memory: {
      title: "Mensaje de tu hija",
      prompt: "Escucha y recuerda esta lista de compras para responder ahora.",
      question: "¿Qué alimentos pidió recordar tu hija?",
      instruction: "Selecciona todos los alimentos y provisiones mencionados.",
      audioSrc: "../Audio/PrepararComida/Fase3/F3_A_DOBLE_01_interferencia_hija.mp3",
      audioText:
        "Hola, recuerda una libra de lentejas, dos libras de garbanzo, cinco tomates, dos cebollas para cocinar, una cabeza de lechuga, espinaca y menudencias en carnicería.",
      list: daughterShoppingList,
      options: memoryProductOptions,
      interruptAfterStepId: "guiso-f3-doble-on",
      askAfterInterrupt: true,
      immediateQuestionAfterAudio: true
    },
    timeColumns: [
      ["tiempo_sal_papas", "sal-papas-f3-doble"],
      ["tiempo_pechuga_encender", "pechuga-f3-doble-on"],
      ["tiempo_guiso_encender", "guiso-f3-doble-on"],
      ["tiempo_guiso_apagar", "guiso-f3-doble-off"],
      ["tiempo_platano_encender", "platano-f3-doble-on"]
    ]
  },
  "4-simple": {
    enabled: true,
    phaseNumber: 4,
    structure: "Estructura B",
    taskLabel: "Tarea simple",
    taskType: "fase_4_estructura_b_tarea_simple",
    introTitle: "Preparar comida con claves visoespaciales",
    introCopy:
      "Observa las claves visuales de la cocina para coordinar lentejas, pollo, guiso y tajadas de plátano.",
    introSmall:
      "Cada paso resalta el alimento, la hornilla y la nota correspondiente para apoyar el recuerdo contextual.",
    steps: phase4SimpleSteps,
    burnerLabels: {
      lentejas: "Lentejas",
      "pollo-f4": "Pollo",
      "guiso-f4": "Guiso",
      "platano-tajadas": "Tajadas de plátano"
    },
    temporal: {
      countdownSeconds: 25,
      stepDeadlinesMs: phaseFourSimpleStepDeadlinesMs,
      mandatoryStepId: "pollo-f4-on",
      mandatoryDeadlineMs: 15000
    },
    visualVariant: "phase4",
    visualCueMode: true,
    kitchenSlots: {
      topLeft: "lentejas",
      topRight: "pollo-f4",
      bottomLeft: "guiso-f4",
      bottomRight: "platano-tajadas"
    },
    recipeNotes: [
      ["sal-lentejas", 220, "Sal a", "lentejas"],
      ["guiso-f4-on", 294, "Sofreír", "guiso"],
      ["pollo-f4-on", 368, "Freír", "pollo"],
      ["guiso-f4-off", 442, "Apagar", "guiso"],
      ["platano-tajadas-on", 516, "Freír", "plátano"]
    ],
    initialBurnersOn: {
      lentejas: true,
      "pollo-f4": false,
      "guiso-f4": false,
      "platano-tajadas": false
    },
    memory: null,
    timeColumns: [
      ["tiempo_sal_lentejas", "sal-lentejas"],
      ["tiempo_guiso_encender", "guiso-f4-on"],
      ["tiempo_pollo_encender", "pollo-f4-on"],
      ["tiempo_guiso_apagar", "guiso-f4-off"],
      ["tiempo_platano_encender", "platano-tajadas-on"]
    ]
  },
  "4-double": {
    enabled: true,
    phaseNumber: 4,
    structure: "Estructura B",
    taskLabel: "Tarea doble",
    taskType: "fase_4_estructura_b_tarea_doble",
    introTitle: "Preparar comida con claves visoespaciales",
    introCopy:
      "Coordina arroz, verduras, carne y papas mientras atiendes una interferencia visual.",
    introSmall:
      "Durante la cocción aparece una noticia breve y luego una pregunta visual sobre imágenes de vehículos.",
    steps: phase4DoubleSteps,
    burnerLabels: {
      "arroz-f4-doble": "Arroz",
      "carne-f4-doble": "Carne",
      "verduras-f4-doble": "Verduras",
      "papas-f4-doble": "Papas"
    },
    temporal: {
      countdownSeconds: 25,
      stepDeadlinesMs: phaseFourDoubleStepDeadlinesMs,
      mandatoryStepId: "carne-f4-doble-on",
      mandatoryDeadlineMs: 15000
    },
    visualVariant: "phase4-double",
    visualCueMode: true,
    kitchenSlots: {
      topLeft: "arroz-f4-doble",
      topRight: "carne-f4-doble",
      bottomLeft: "verduras-f4-doble",
      bottomRight: "papas-f4-doble"
    },
    recipeNotes: [
      ["sal-arroz-f4-doble", 220, "Sal a", "arroz"],
      ["verduras-f4-doble-on", 294, "Sofreír", "verduras"],
      ["carne-f4-doble-on", 368, "Freír", "carne"],
      ["verduras-f4-doble-off", 442, "Apagar", "verduras"],
      ["papas-f4-doble-on", 516, "Freír", "papas"]
    ],
    initialBurnersOn: {
      "arroz-f4-doble": true,
      "carne-f4-doble": false,
      "verduras-f4-doble": false,
      "papas-f4-doble": false
    },
    memory: {
      kind: "image-captcha",
      title: "Noticia en el celular",
      prompt:
        "Observa la noticia: se muestra un accidente de automóvil. Luego responde la pregunta visual.",
      question: "Selecciona los dos autos que aparecieron en el accidente.",
      instruction: "Marca solo las dos imágenes de autos que aparecieron en el accidente.",
      audioText: "",
      newsTitle: "Fuerte accidente en la vía",
      newsImageSrc: "../assets/interferencia-autos/accidente-autos.png",
      list: ["auto_rojo", "auto_blanco"],
      options: phase4VehicleOptions,
      interruptAfterStepId: "carne-f4-doble-on",
      askAfterInterrupt: true
    },
    timeColumns: [
      ["tiempo_sal_arroz", "sal-arroz-f4-doble"],
      ["tiempo_verduras_encender", "verduras-f4-doble-on"],
      ["tiempo_carne_encender", "carne-f4-doble-on"],
      ["tiempo_verduras_apagar", "verduras-f4-doble-off"],
      ["tiempo_papas_encender", "papas-f4-doble-on"]
    ]
  }
};

const foodState = {
  currentPhase: null,
  currentMode: null
};

const gameState = {
  screen: "intro",
  phaseNumber: 1,
  taskMode: "simple",
  currentStepIndex: 0,
  runToken: 0,
  startedAt: null,
  endedAt: null,
  stepStartedAt: null,
  correctSteps: 0,
  errors: 0,
  temporalErrors: 0,
  temporalErrorSteps: [],
  isClockPaused: false,
  pausedAt: null,
  totalPausedMs: 0,
  pauseEvents: [],
  feedback: "",
  feedbackType: "",
  feedbackTarget: "",
  isStepLocked: false,
  resolvedStepId: null,
  lastTargetClickAt: 0,
  completedStepIds: [],
  stepTimings: [],
  selectedProducts: [],
  memoryCorrectCount: 0,
  memoryReview: null,
  memoryReviewContinueTo: "result",
  memoryAnswered: false,
  memoryStartedAt: null,
  memoryResponseTimeMs: null,
  memoryProductTimings: {},
  autoSpokenStepIds: [],
  timeoutModalOpen: false,
  burnersOn: {
    arroz: true,
    carne: false,
    guiso: false,
    huevos: false
  },
  countdownStepId: null,
  stepCountdownRemaining: null,
  lastResult: null
};

let voiceSequenceToken = 0;
let stepCountdownInterval = null;

function showFoodScreen(screenId) {
  const targetScreen = document.getElementById(screenId);

  if (!targetScreen) return;

  foodScreens.forEach((screen) => {
    screen.classList.remove("is-active");
  });

  targetScreen.classList.add("is-active");
}

function getScenarioKey(phaseNumber = foodState.currentPhase, mode = foodState.currentMode) {
  return `${phaseNumber}-${mode || "simple"}`;
}

function getCurrentScenario() {
  return (
    cookingScenarioConfigs[getScenarioKey(gameState.phaseNumber, gameState.taskMode)] ||
    cookingScenarioConfigs["1-simple"]
  );
}

function getSelectedScenario(mode = foodState.currentMode) {
  return cookingScenarioConfigs[getScenarioKey(foodState.currentPhase, mode)];
}

function updateFoodModeCards(phaseNumber) {
  const copy = foodPhaseModeCopy[phaseNumber] || {
    structure: `Estructura ${phaseNumber}`,
    simpleDescription: "Espacio reservado para estructurar la tarea simple.",
    doubleDescription: "Espacio reservado para estructurar la tarea doble."
  };

  const simpleNumber = foodModeCards.simple?.querySelector(".phase-number");
  const simpleTitle = foodModeCards.simple?.querySelector(".phase-title");
  const simpleDescription = foodModeCards.simple?.querySelector(".phase-description");
  const doubleNumber = foodModeCards.double?.querySelector(".phase-number");
  const doubleTitle = foodModeCards.double?.querySelector(".phase-title");
  const doubleDescription = foodModeCards.double?.querySelector(".phase-description");

  if (simpleNumber) simpleNumber.textContent = copy.structure;
  if (simpleTitle) simpleTitle.textContent = "Tarea Simple";
  if (simpleDescription) simpleDescription.textContent = copy.simpleDescription;
  if (doubleNumber) doubleNumber.textContent = copy.structure;
  if (doubleTitle) doubleTitle.textContent = "Tarea Doble";
  if (doubleDescription) doubleDescription.textContent = copy.doubleDescription;
}

function showFoodModeSelection(phaseNumber) {
  foodState.currentPhase = Number(phaseNumber);
  foodState.currentMode = null;

  if (foodModeTitle) {
    foodModeTitle.textContent = `Fase ${foodState.currentPhase}`;
  }

  updateFoodModeCards(foodState.currentPhase);
  showFoodScreen("screen-food-mode-selection");
}

function showEmptyFoodActivity(mode) {
  foodState.currentMode = mode;
  const scenario = getSelectedScenario(mode);

  if (scenario?.enabled) {
    resetGame(mode);
    showFoodScreen("screen-food-game");
    return;
  }

  const modeText = mode === "double" ? "tarea doble" : "tarea simple";

  if (foodEmptyTitle) {
    foodEmptyTitle.textContent = `Fase ${foodState.currentPhase} - ${modeText}`;
  }

  if (foodEmptyDescription) {
    if (scenario) {
      foodEmptyDescription.textContent = `${scenario.introCopy} ${scenario.introSmall}`;
    } else {
      foodEmptyDescription.textContent =
        "Esta estructura queda lista para asignar funcionalidades.";
    }
  }

  showFoodScreen("screen-food-empty-activity");
}

function resetGame(mode = foodState.currentMode || "simple") {
  clearStepCountdown();

  const scenario = getSelectedScenario(mode) || cookingScenarioConfigs["1-simple"];

  gameState.runToken++;
  gameState.screen = "intro";
  gameState.phaseNumber = scenario.phaseNumber;
  gameState.taskMode = mode;
  gameState.currentStepIndex = 0;
  gameState.startedAt = null;
  gameState.endedAt = null;
  gameState.stepStartedAt = null;
  gameState.correctSteps = 0;
  gameState.errors = 0;
  gameState.temporalErrors = 0;
  gameState.temporalErrorSteps = [];
  gameState.isClockPaused = false;
  gameState.pausedAt = null;
  gameState.totalPausedMs = 0;
  gameState.pauseEvents = [];
  gameState.feedback = "";
  gameState.feedbackType = "";
  gameState.feedbackTarget = "";
  gameState.isStepLocked = false;
  gameState.resolvedStepId = null;
  gameState.lastTargetClickAt = 0;
  gameState.completedStepIds = [];
  gameState.stepTimings = [];
  gameState.selectedProducts = [];
  gameState.memoryCorrectCount = 0;
  gameState.memoryReview = null;
  gameState.memoryReviewContinueTo = "result";
  gameState.memoryAnswered = false;
  gameState.memoryStartedAt = null;
  gameState.memoryResponseTimeMs = null;
  gameState.memoryProductTimings = {};
  gameState.autoSpokenStepIds = [];
  gameState.timeoutModalOpen = false;
  gameState.burnersOn = { ...scenario.initialBurnersOn };
  gameState.lastResult = null;
  gameState.countdownStepId = null;
  gameState.stepCountdownRemaining = null;
  renderScreen();
}

function getCurrentStep() {
  const steps = getCurrentScenario().steps;
  return steps[gameState.currentStepIndex] || steps[0];
}

function getCurrentSteps() {
  return getCurrentScenario().steps;
}

function getCurrentBurnerLabels() {
  return getCurrentScenario().burnerLabels;
}

function getCurrentMemoryConfig() {
  return getCurrentScenario().memory;
}

function showMemoryQuestionScreen() {
  gameState.screen = "memory";
  gameState.memoryStartedAt = Date.now();
  gameState.feedback = "";
  gameState.feedbackType = "";
  gameState.feedbackTarget = "";
  gameState.isStepLocked = false;
  gameState.resolvedStepId = null;
  renderScreen();
}

function getElapsedMilliseconds() {
  if (!gameState.startedAt) return 0;

  const endTime = gameState.endedAt || Date.now();
  return Math.max(0, endTime - gameState.startedAt - getTotalPausedMilliseconds(endTime));
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
  if (isOpeningStepCountdownActive()) {
    const remaining = gameState.stepCountdownRemaining ?? getCurrentCountdownSeconds();
    return getCountdownText(remaining);
  }
  return getCurrentStep().timer;
}

function getCountdownText(seconds) {
  const safeSeconds = Math.max(0, Number(seconds) || 0);
  return `Faltan ${safeSeconds} ${safeSeconds === 1 ? "segundo" : "segundos"}`;
}

function isOpeningStepCountdownActive() {
  return gameState.screen === "scene" && Boolean(getCurrentScenario().temporal);
}

function getCurrentCountdownSeconds() {
  return getCurrentScenario().temporal?.countdownSeconds || openingStepCountdownSeconds;
}

function updateCountdownDisplay() {
  const timerElement = cookingGameRoot?.querySelector(".cooking-status strong");
  const progressElement = cookingGameRoot?.querySelector(".cooking-progress span");

  if (timerElement) {
    timerElement.textContent = getCountdownText(gameState.stepCountdownRemaining);
  }

  if (progressElement) {
    progressElement.style.width = `${getCountdownProgress()}%`;
    progressElement.style.backgroundColor = getCountdownProgressColor();
  }
}

function getCountdownProgress() {
  const countdownSeconds = getCurrentCountdownSeconds();
  const remaining = gameState.stepCountdownRemaining ?? countdownSeconds;
  const elapsedSeconds = countdownSeconds - remaining;

  return Math.min(100, Math.max(0, (elapsedSeconds / countdownSeconds) * 100));
}

function getCountdownProgressColor() {
  const remaining = gameState.stepCountdownRemaining ?? getCurrentCountdownSeconds();

  if (remaining <= 10) return "#dc2626";
  if (remaining <= 15) return "#f97316";
  return "#16a34a";
}

function stopStepCountdownInterval() {
  if (stepCountdownInterval) {
    window.clearInterval(stepCountdownInterval);
    stepCountdownInterval = null;
  }
}

function clearStepCountdown() {
  stopStepCountdownInterval();

  if (gameState) {
    gameState.countdownStepId = null;
    gameState.stepCountdownRemaining = null;
  }
}

function syncOpeningStepCountdown() {
  if (!isOpeningStepCountdownActive()) {
    if (gameState.isClockPaused) {
      stopStepCountdownInterval();
      return;
    }

    clearStepCountdown();
    return;
  }

  const countdownId = `${gameState.phaseNumber}-${gameState.taskMode}`;

  if (
    gameState.countdownStepId !== countdownId ||
    gameState.stepCountdownRemaining === null ||
    gameState.stepCountdownRemaining === undefined
  ) {
    gameState.countdownStepId = countdownId;
    gameState.stepCountdownRemaining = getCurrentCountdownSeconds();
  }

  updateCountdownDisplay();

  if (gameState.timeoutModalOpen) return;
  if (stepCountdownInterval) return;

  const runToken = gameState.runToken;
  stepCountdownInterval = window.setInterval(() => {
    if (runToken !== gameState.runToken || !isOpeningStepCountdownActive()) {
      clearStepCountdown();
      return;
    }

    gameState.stepCountdownRemaining = Math.max(0, gameState.stepCountdownRemaining - 1);
    updateCountdownDisplay();

    if (shouldRepeatTimedScenarioForMissingMandatoryStep()) {
      showTimedScenarioRepeatRequest();
      return;
    }

    if (gameState.stepCountdownRemaining <= 0) {
      clearStepCountdown();
      cancelBrowserVoice();

      if (isTimedCookingRun()) {
        recordExpiredTimedScenarioSteps();
        finishGame();
        return;
      }

      resetGame(gameState.taskMode);
    }
  }, 1000);
}

function hasCompletedCookingStep(stepId) {
  return gameState.stepTimings.some((entry) => entry.id === stepId);
}

function getTotalPausedMilliseconds(atTime = Date.now()) {
  const activePauseMs =
    gameState.isClockPaused && gameState.pausedAt
      ? Math.max(0, atTime - gameState.pausedAt)
      : 0;

  return gameState.totalPausedMs + activePauseMs;
}

function pauseCookingClock(reason = "interferencia") {
  if (!isTimedCookingRun() || gameState.isClockPaused) return;

  stopStepCountdownInterval();
  gameState.isClockPaused = true;
  gameState.pausedAt = Date.now();
  gameState.pauseEvents.push({
    reason,
    startedAt: gameState.pausedAt,
    endedAt: null,
    durationMs: null
  });
}

function resumeCookingClock() {
  if (!gameState.isClockPaused || !gameState.pausedAt) return;

  const resumedAt = Date.now();
  const pauseDurationMs = Math.max(0, resumedAt - gameState.pausedAt);
  const currentPauseEvent = gameState.pauseEvents.at(-1);

  gameState.totalPausedMs += pauseDurationMs;

  if (currentPauseEvent && currentPauseEvent.endedAt === null) {
    currentPauseEvent.endedAt = resumedAt;
    currentPauseEvent.durationMs = pauseDurationMs;
  }

  gameState.isClockPaused = false;
  gameState.pausedAt = null;
}

function isTimedCookingRun() {
  return gameState.screen === "scene" && Boolean(getCurrentScenario().temporal);
}

function getElapsedSinceGameStartMs(atTime = Date.now()) {
  if (!gameState.startedAt) return 0;

  return Math.max(0, atTime - gameState.startedAt - getTotalPausedMilliseconds(atTime));
}

function getPhaseOneSimpleStepDeadlineMs(stepId) {
  const temporal = getCurrentScenario().temporal;

  if (!isTimedCookingRun() || !temporal) return null;

  return temporal.stepDeadlinesMs?.[stepId] ?? null;
}

function shouldRepeatTimedScenarioForMissingMandatoryStep() {
  const temporal = getCurrentScenario().temporal;

  if (!isTimedCookingRun() || !temporal?.mandatoryStepId) return false;
  if (hasCompletedCookingStep(temporal.mandatoryStepId)) return false;

  return getElapsedSinceGameStartMs() >= temporal.mandatoryDeadlineMs;
}

function showTimedScenarioRepeatRequest() {
  stopStepCountdownInterval();
  gameState.timeoutModalOpen = true;
  gameState.isStepLocked = true;
  gameState.feedback = "";
  gameState.feedbackType = "";
  gameState.feedbackTarget = "";
  renderScreen();
}

function getPhaseOneSimpleTimingStatus(step, answeredAt) {
  const deadlineMs = getPhaseOneSimpleStepDeadlineMs(step.id);

  if (!deadlineMs) {
    return {
      elapsedMs: getElapsedSinceGameStartMs(answeredAt),
      deadlineMs: null,
      isLate: false
    };
  }

  const elapsedMs = getElapsedSinceGameStartMs(answeredAt);

  return {
    elapsedMs,
    deadlineMs,
    isLate: elapsedMs >= deadlineMs
  };
}

function recordTemporalStepError(step, timingStatus) {
  if (gameState.temporalErrorSteps.some((entry) => entry.id === step.id)) return;

  gameState.errors++;
  gameState.temporalErrors++;
  gameState.temporalErrorSteps.push({
    id: step.id,
    label: step.instruction,
    elapsedMs: timingStatus.elapsedMs,
    deadlineMs: timingStatus.deadlineMs
  });
}

function recordExpiredTimedScenarioSteps() {
  if (!isTimedCookingRun()) return;

  const elapsedMs = getElapsedSinceGameStartMs();

  getCurrentSteps().forEach((step) => {
    if (hasCompletedCookingStep(step.id)) return;

    const deadlineMs = getPhaseOneSimpleStepDeadlineMs(step.id);

    if (!deadlineMs || elapsedMs < deadlineMs) return;

    recordTemporalStepError(step, {
      elapsedMs,
      deadlineMs
    });
  });
}

function getProgress() {
  if (gameState.screen === "result") return 100;
  if (gameState.screen === "intro") return 0;
  if (isOpeningStepCountdownActive()) return getCountdownProgress();
  return getCurrentStep().progress;
}

function getTaskModeLabel() {
  return getCurrentScenario().taskLabel;
}

function createShell(title, body, actions = "") {
  const scenario = getCurrentScenario();
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
  const timeoutModalMarkup = gameState.timeoutModalOpen
    ? `
    <div class="cooking-timeout-modal" role="dialog" aria-modal="true" aria-labelledby="cooking-timeout-title">
      <div class="cooking-timeout-card">
        <h2 id="cooking-timeout-title">Debes repetir la tarea</h2>
        <p>No se completó la actividad clave dentro del tiempo esperado.</p>
        <button class="memory-button button-one cooking-action-button" type="button" data-cooking-timeout-reset>
          Repetir tarea
        </button>
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
        <p>Fase ${scenario.phaseNumber} · ${scenario.structure} · ${getTaskModeLabel()}</p>
      </div>
    </header>

    ${statusMarkup}

    <div class="cooking-body">
      ${body}
    </div>

    <div class="${actionsClass}">
      ${actions}
    </div>

    ${timeoutModalMarkup}
  `;
}

function renderIntro() {
  const scenario = getCurrentScenario();
  const body = `
    <section class="cooking-intro">
      <h2>${scenario.introTitle}</h2>
      <p>${scenario.introCopy}</p>
      <small>${scenario.introSmall}</small>
    </section>
  `;

  const actions = `
    <button class="memory-button button-one cooking-action-button" type="button" data-cooking-start>
      Iniciar
    </button>
  `;

  return createShell(scenario.introTitle, body, actions);
}

function renderScene() {
  const step = getCurrentStep();
  const body = `
    <section class="cooking-instruction">
      <h2>${step.instruction}</h2>
      <p>${step.note}</p>
    </section>
    ${renderKitchenSvg()}
    ${
      gameState.feedback && gameState.feedbackType === "neutral"
        ? `<p class="cooking-feedback is-${gameState.feedbackType || "neutral"}">${gameState.feedback}</p>`
        : ""
    }
  `;

  const actions = `
    ${
      step.audioText || step.audioSrc
        ? `<button class="memory-button button-one cooking-action-button" type="button" data-cooking-speak="${step.audioText || ""}" data-cooking-audio-src="${step.audioSrc || ""}">
            Escuchar pista de la hija
          </button>`
        : ""
    }
    <button class="memory-button button-two cooking-action-button" type="button" data-cooking-repeat-instruction>
      Repetir instrucción
    </button>
  `;

  return createShell(step.title, body, actions);
}

function renderDaughterMessage() {
  const memory = getCurrentMemoryConfig();
  const audioButton = memory.audioText || memory.audioSrc
    ? `<button class="daughter-audio-cue" type="button" data-cooking-speak="${memory.audioText || ""}" data-cooking-audio-src="${memory.audioSrc || ""}">
        Repetir audio
      </button>`
    : "";
  const listMarkup =
    memory.kind === "image-captcha"
      ? `<div class="news-reel-card" aria-hidden="true">
          <div class="news-phone">
            <div class="news-screen">
              <div class="news-phone-bar">
                <span>NOTICIA</span>
              </div>
              <strong>${memory.newsTitle || "Fuerte accidente"}</strong>
              <div class="news-image-frame">
                <img src="${memory.newsImageSrc}" alt="" />
              </div>
              <p>Dos vehículos chocaron esta tarde en una vía principal.</p>
            </div>
          </div>
        </div>`
      : `<ul>
          ${memory.list.map((product) => `<li>${product}</li>`).join("")}
        </ul>`;
  const body = `
    <section class="daughter-message-card">
      <h2>${memory.title}</h2>
      <p>${memory.prompt}</p>
      ${audioButton}
      ${listMarkup}
    </section>
  `;

  const actions = memory.immediateQuestionAfterAudio
    ? ""
    : `
      <button class="memory-button button-one cooking-action-button" type="button" data-cooking-continue-daughter>
        ${memory.askAfterInterrupt ? "Responder pregunta" : "Continuar cocinando"}
      </button>
    `;

  return createShell("Tarea doble", body, actions);
}

function renderMemoryQuestion() {
  const memory = getCurrentMemoryConfig();
  const review = gameState.memoryReview;
  const selectedSet = new Set(gameState.selectedProducts);
  const correctSet = new Set(memory.list);
  const correctAnswerText = getMemorySelectionLabels(memory, memory.list).join(", ");
  const getOptionReviewClass = (item) => {
    if (!review) return "";

    const wasSelected = selectedSet.has(item);
    const isCorrect = correctSet.has(item);

    if (wasSelected && isCorrect) return " is-correct";
    if (wasSelected && !isCorrect) return " is-wrong";
    if (!wasSelected && isCorrect) return " is-wrong";
    return "";
  };
  const optionsMarkup =
    memory.kind === "image-captcha"
      ? `<div class="vehicle-captcha-grid">
          ${memory.options
            .map((option) => {
              const selected = gameState.selectedProducts.includes(option.id) ? " is-selected" : "";
              const reviewClass = getOptionReviewClass(option.id);
              return `
                <button class="vehicle-captcha-option${selected}${reviewClass}" type="button" data-cooking-memory-product="${option.id}" ${review ? "disabled" : ""}>
                  <img src="${option.imageSrc}" alt="${option.label}" />
                  <span>${option.label}</span>
                </button>
              `;
            })
            .join("")}
        </div>`
      : `<div class="memory-product-grid">
          ${memory.options
            .map((product) => {
              const selected = gameState.selectedProducts.includes(product) ? " is-selected" : "";
              const reviewClass = getOptionReviewClass(product);
              return `
                <button class="memory-product${selected}${reviewClass}" type="button" data-cooking-memory-product="${product}" ${review ? "disabled" : ""}>
                  <span class="memory-product-icon" aria-hidden="true">${getMemoryProductIcon(product)}</span>
                  <span>${product}</span>
                </button>
              `;
            })
            .join("")}
        </div>`;
  const body = `
    <section class="cooking-instruction">
      <h2>${memory.question}</h2>
      <p>${memory.instruction}</p>
    </section>
    ${optionsMarkup}
    ${
      gameState.feedback && gameState.feedbackType === "neutral"
        ? `<p class="cooking-feedback is-neutral">${gameState.feedback}</p>`
        : ""
    }
    ${
      review
        ? `<p class="memory-correct-answer">Las opciones correctas eran: ${correctAnswerText}.</p>`
        : ""
    }
  `;

  const actions = `
    <button class="memory-button button-one cooking-action-button" type="button" data-cooking-confirm-memory>
      ${review ? "Continuar" : memory.kind === "image-captcha" ? "Confirmar imágenes" : "Confirmar lista"}
    </button>
  `;

  return createShell("Pregunta de memoria", body, actions);
}

function getMemoryProductIcon(product) {
  const icons = {
    Lentejas: "🟤",
    Arroz: "🍚",
    Garbanzos: "🟡",
    Tomates: "🍅",
    Pan: "🥖",
    Cebollas: "🧅",
    Lechuga: "🥬",
    Espinaca: "🥬",
    Leche: "🥛",
    Menudencias: "🥩",
    Queso: "🧀",
    Papas: "🥔",
    Azúcar: "🧂",
    Sal: "🧂",
    Envueltos: "🌽",
    Pollo: "🍗",
    Huevos: "🥚"
  };

  return icons[product] || "🍽️";
}

function renderResult() {
  const result = gameState.lastResult;
  const memory = getCurrentScenario().memory;
  const memoryMarkup =
    result.taskMode === "double" && memory
      ? `<p><strong>Memoria:</strong> ${result.memoryCorrectCount}/${memory.list.length}</p>`
      : "";

  return `
    <section class="cooking-results-screen">
      <h1 class="cooking-results-title">Resultados</h1>

      <section class="results-box cooking-result">
        <p><strong>Aciertos:</strong> ${result.correctSteps}/${getCurrentSteps().length}</p>
        <p><strong>Errores:</strong> ${result.errors}</p>
        ${memoryMarkup}
        <p><strong>Tiempo:</strong> ${formatMilliseconds(result.totalTimeMs)}</p>
        <div class="result-trophy" aria-hidden="true">🏆</div>
      </section>

      <div class="medical-actions cooking-result-actions">
        <button class="memory-button button-one medical-action-button" type="button" data-cooking-export>
          Descargar CSV
        </button>
        <button class="memory-button button-one medical-action-button" type="button" data-cooking-repeat>
          Repetir
        </button>
        <button class="memory-button button-two medical-action-button" type="button" data-cooking-nav="phases">
          Salir
        </button>
      </div>
    </section>
  `;
}

function renderScreen() {
  if (!cookingGameRoot) return;

  const screens = {
    intro: renderIntro,
    scene: renderScene,
    daughter: renderDaughterMessage,
    memory: renderMemoryQuestion,
    result: renderResult
  };

  cookingGameRoot.dataset.cookingScreen = gameState.screen;
  cookingGameRoot.closest(".cooking-card")?.setAttribute("data-cooking-screen", gameState.screen);
  cookingGameRoot.innerHTML = screens[gameState.screen]();
  syncOpeningStepCountdown();
}

function startGame() {
  const scenario = getCurrentScenario();

  gameState.screen = "scene";
  gameState.startedAt = Date.now();
  gameState.stepStartedAt = Date.now();
  gameState.feedback = "";
  gameState.feedbackType = "";
  gameState.feedbackTarget = "";
  gameState.isStepLocked = false;
  gameState.resolvedStepId = null;
  gameState.lastTargetClickAt = 0;
  renderScreen();

  if (scenario.phaseNumber === 2) {
    playCookingCueSequence([
      { audioSrc: scenario.openingAudioSrc, text: scenario.openingAudioText },
      getAutoStepAudioCue()
    ]);
    return;
  }

  if (scenario.openingAudioText || scenario.openingAudioSrc) {
    playCookingCue({ audioSrc: scenario.openingAudioSrc, text: scenario.openingAudioText });
  }
}

function recordStepTiming(step, responseTimeMs, timingStatus = {}) {
  gameState.stepTimings.push({
    id: step.id,
    label: step.instruction,
    responseTimeMs,
    elapsedMs: timingStatus.elapsedMs ?? null,
    deadlineMs: timingStatus.deadlineMs ?? null,
    isLate: Boolean(timingStatus.isLate)
  });
}

function applyStepEffect(step) {
  if (step.turnOn) {
    gameState.burnersOn[step.turnOn] = true;
  }

  if (step.turnOff) {
    gameState.burnersOn[step.turnOff] = false;
  }
}

function handleCookingTarget(targetId) {
  if (gameState.screen !== "scene") return;
  if (gameState.isStepLocked) return;

  const step = getCurrentStep();
  const answeredAt = Date.now();

  if (answeredAt - gameState.lastTargetClickAt < 250) return;
  gameState.lastTargetClickAt = answeredAt;

  const responseTimeMs = answeredAt - (gameState.stepStartedAt || answeredAt);

  if (targetId !== step.targetId) {
    gameState.errors++;
    gameState.feedbackType = "error";
    gameState.feedbackTarget = targetId;
    gameState.feedback = `Intenta de nuevo. Busca ${getCurrentBurnerLabels()[step.targetId]}.`;
    renderScreen();
    return;
  }

  if (gameState.resolvedStepId === step.id) return;

  const timingStatus = getPhaseOneSimpleTimingStatus(step, answeredAt);

  if (step.id === getCurrentScenario().temporal?.mandatoryStepId && timingStatus.isLate) {
    showTimedScenarioRepeatRequest();
    return;
  }

  if (timingStatus.isLate) {
    recordTemporalStepError(step, timingStatus);
  }

  gameState.isStepLocked = true;
  gameState.resolvedStepId = step.id;
  gameState.correctSteps++;
  gameState.completedStepIds.push(step.targetId);
  gameState.feedbackType = "success";
  gameState.feedbackTarget = targetId;
  gameState.feedback = timingStatus.isLate
    ? `✓ ${step.success} Fuera de tiempo.`
    : `✓ ${step.success}`;
  recordStepTiming(step, responseTimeMs, timingStatus);
  applyStepEffect(step);
  renderScreen();

  const runToken = gameState.runToken;
  window.setTimeout(() => {
    if (runToken !== gameState.runToken) return;

    if (gameState.currentStepIndex >= getCurrentSteps().length - 1) {
      if (getCurrentMemoryConfig() && !gameState.memoryAnswered) {
        showMemoryQuestionScreen();
        return;
      }

      finishGame();
      return;
    }

    if (getCurrentMemoryConfig()?.interruptAfterStepId === step.id) {
      const memory = getCurrentMemoryConfig();

      pauseCookingClock(memory.kind === "image-captcha" ? "interferencia_visual" : "interferencia_compra");
      gameState.screen = "daughter";
      gameState.feedback = "";
      gameState.feedbackType = "";
      gameState.feedbackTarget = "";
      gameState.isStepLocked = false;
      gameState.resolvedStepId = null;
      renderScreen();
      playCookingCue({ audioSrc: memory.audioSrc, text: memory.audioText }, () => {
        if (memory.immediateQuestionAfterAudio && gameState.screen === "daughter") {
          showMemoryQuestionScreen();
        }
      });
      return;
    }

    gameState.currentStepIndex++;
    gameState.stepStartedAt = Date.now();
    gameState.feedback = "";
    gameState.feedbackType = "";
    gameState.feedbackTarget = "";
    gameState.isStepLocked = false;
    gameState.resolvedStepId = null;
    renderScreen();
    speakCurrentStepHelpIfNeeded();
  }, 650);
}

function repeatCurrentInstruction() {
  if (gameState.isStepLocked) return;

  const step = getCurrentStep();
  gameState.feedbackType = "neutral";
  gameState.feedbackTarget = "";
  gameState.feedback = `↻ ${step.instruction}`;
  renderScreen();
}

function cancelBrowserVoice() {
  voiceSequenceToken++;

  cookingAudioPlayer.pause();
  cookingAudioPlayer.currentTime = 0;
  cookingAudioPlayer.onended = null;
  cookingAudioPlayer.onerror = null;

  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

function playCookingCueSequence(cues) {
  const queue = cues.filter((cue) => cue && (cue.audioSrc || cue.text));

  if (queue.length === 0) return;

  const playNext = () => {
    const cue = queue.shift();

    if (!cue) return;
    playCookingCue(cue, playNext);
  };

  playNext();
}

function getAutoStepAudioCue() {
  const scenario = getCurrentScenario();
  const step = getCurrentStep();

  if (scenario.phaseNumber !== 2 || gameState.screen !== "scene" || (!step.audioText && !step.audioSrc)) {
    return null;
  }

  if (gameState.autoSpokenStepIds.includes(step.id)) {
    return null;
  }

  gameState.autoSpokenStepIds.push(step.id);
  return { audioSrc: step.audioSrc, text: step.audioText };
}

function speakCurrentStepHelpIfNeeded() {
  const cue = getAutoStepAudioCue();

  if (cue) {
    playCookingCue(cue);
  }
}

function continueAfterDaughterMessage() {
  cancelBrowserVoice();

  if (getCurrentMemoryConfig()?.askAfterInterrupt) {
    showMemoryQuestionScreen();
    return;
  }

  gameState.screen = "scene";
  resumeCookingClock();
  gameState.currentStepIndex++;
  gameState.stepStartedAt = Date.now();
  gameState.feedback = "";
  gameState.feedbackType = "";
  gameState.feedbackTarget = "";
  gameState.isStepLocked = false;
  gameState.resolvedStepId = null;
  renderScreen();
}

function toggleMemoryProduct(product) {
  if (gameState.screen !== "memory" || gameState.memoryReview) return;

  if (!gameState.memoryProductTimings[product]) {
    gameState.memoryProductTimings[product] = Date.now() - (gameState.memoryStartedAt || Date.now());
  }

  if (gameState.selectedProducts.includes(product)) {
    gameState.selectedProducts = gameState.selectedProducts.filter((item) => item !== product);
  } else {
    gameState.selectedProducts.push(product);
  }

  gameState.feedback = "";
  gameState.feedbackType = "";
  renderScreen();
}

function confirmMemoryProducts() {
  if (gameState.screen !== "memory") return;

  if (gameState.memoryReview) {
    continueAfterMemoryReview();
    return;
  }

  cancelBrowserVoice();

  const memory = getCurrentMemoryConfig();
  if (!memory) return;

  const selectedSet = new Set(gameState.selectedProducts);
  const correctSet = new Set(memory.list);
  const correctSelections = gameState.selectedProducts.filter((product) => correctSet.has(product)).length;
  const wrongSelections = gameState.selectedProducts.filter((product) => !correctSet.has(product)).length;
  const missedItems = memory.list.filter((product) => !selectedSet.has(product));
  const missedSelections = missedItems.length;
  const correctItems = gameState.selectedProducts.filter((product) => correctSet.has(product));
  const wrongItems = gameState.selectedProducts.filter((product) => !correctSet.has(product));

  gameState.memoryCorrectCount = correctSelections;
  gameState.memoryAnswered = true;
  gameState.memoryResponseTimeMs = Date.now() - (gameState.memoryStartedAt || Date.now());
  gameState.errors += wrongSelections + missedSelections;
  gameState.memoryReview = {
    correctLabels: getMemorySelectionLabels(memory, correctItems),
    wrongLabels: getMemorySelectionLabels(memory, wrongItems),
    missedLabels: getMemorySelectionLabels(memory, missedItems)
  };

  if (memory.askAfterInterrupt && gameState.currentStepIndex < getCurrentSteps().length - 1) {
    gameState.memoryReviewContinueTo = "scene";
    renderScreen();
    return;
  }

  gameState.memoryReviewContinueTo = "result";
  renderScreen();
}

function continueAfterMemoryReview() {
  if (gameState.screen !== "memory") return;

  if (gameState.memoryReviewContinueTo === "scene") {
    gameState.screen = "scene";
    resumeCookingClock();
    gameState.currentStepIndex++;
    gameState.stepStartedAt = Date.now();
    gameState.feedback = "";
    gameState.feedbackType = "";
    gameState.feedbackTarget = "";
    gameState.memoryReview = null;
    gameState.memoryReviewContinueTo = "result";
    gameState.isStepLocked = false;
    gameState.resolvedStepId = null;
    renderScreen();
    speakCurrentStepHelpIfNeeded();
    return;
  }

  finishGame();
}

function getMemorySelectionLabels(memory, selectedItems) {
  if (!memory || memory.kind !== "image-captcha") return selectedItems;

  const optionMap = new Map(memory.options.map((option) => [option.id, option.label]));
  return selectedItems.map((item) => optionMap.get(item) || item);
}

function playCookingCue(cue = {}, onComplete) {
  const audioSrc = cue.audioSrc || "";
  const text = cue.text || "";

  if (audioSrc) {
    cancelBrowserVoice();
    const cueToken = voiceSequenceToken;
    cookingAudioPlayer.src = audioSrc;
    cookingAudioPlayer.currentTime = 0;
    cookingAudioPlayer.onended = () => {
      if (cueToken !== voiceSequenceToken) return;
      cookingAudioPlayer.onended = null;
      cookingAudioPlayer.onerror = null;
      if (onComplete) onComplete();
    };
    cookingAudioPlayer.onerror = () => {
      if (cueToken !== voiceSequenceToken) return;
      cookingAudioPlayer.onended = null;
      cookingAudioPlayer.onerror = null;
      speakWithBrowserVoice(text, onComplete);
    };
    cookingAudioPlayer.play().catch(() => {
      if (cueToken !== voiceSequenceToken) return;
      cookingAudioPlayer.onended = null;
      cookingAudioPlayer.onerror = null;
      speakWithBrowserVoice(text, onComplete);
    });
    return;
  }

  speakWithBrowserVoice(text, onComplete);
}

function speakWithBrowserVoice(text, onComplete) {
  if (!("speechSynthesis" in window) || !text) {
    if (onComplete) onComplete();
    return;
  }

  cancelBrowserVoice();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "es-CO";
  utterance.rate = 0.88;
  utterance.pitch = 1;
  utterance.onend = () => {
    if (onComplete) onComplete();
  };
  utterance.onerror = () => {
    if (onComplete) onComplete();
  };
  window.speechSynthesis.speak(utterance);
}

function finishGame() {
  cancelBrowserVoice();

  gameState.endedAt = Date.now();
  gameState.isStepLocked = false;
  gameState.resolvedStepId = null;

  const scenario = getCurrentScenario();
  const safeCorrectSteps = Math.min(gameState.correctSteps, scenario.steps.length);
  const result = {
    game: "preparar_comida",
    phase: `Fase ${scenario.phaseNumber}`,
    structure: scenario.structure,
    taskMode: gameState.taskMode,
    taskType: scenario.taskType,
    startedAt: new Date(gameState.startedAt).toISOString(),
    endedAt: new Date(gameState.endedAt).toISOString(),
    totalTimeMs: getElapsedMilliseconds(),
    totalSessionTimeMs: Math.max(0, gameState.endedAt - gameState.startedAt),
    totalPausedMs: getTotalPausedMilliseconds(gameState.endedAt),
    pauseEvents: [...gameState.pauseEvents],
    correctSteps: safeCorrectSteps,
    errors: gameState.errors,
    temporalErrors: gameState.temporalErrors,
    temporalErrorSteps: [...gameState.temporalErrorSteps],
    memoryCorrectCount: gameState.memoryCorrectCount,
    memoryResponseTimeMs: gameState.memoryResponseTimeMs,
    memoryList: scenario.memory?.list ? [...scenario.memory.list] : [],
    memoryCorrectLabels: getMemorySelectionLabels(scenario.memory, scenario.memory?.list || []),
    memoryProductTimings: { ...gameState.memoryProductTimings },
    selectedProducts: [...gameState.selectedProducts],
    selectedProductLabels: getMemorySelectionLabels(scenario.memory, gameState.selectedProducts),
    timeColumns: [...scenario.timeColumns],
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

function toCSVColumnKey(text) {
  return String(text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function exportResultsCSV() {
  const sessions = JSON.parse(localStorage.getItem("preparar_comida_sessions") || "[]");
  const session = gameState.lastResult || sessions.at(-1);

  if (!session) return;

  const timeColumns = session.timeColumns?.length
    ? session.timeColumns
    : cookingScenarioConfigs["1-simple"].timeColumns;
  const memoryProducts = session.memoryList || [];
  const memoryColumnPrefix =
    session.taskType === "fase_4_estructura_b_tarea_doble"
      ? "tiempo_interferencia"
      : "tiempo_compra";
  const memoryTimeColumns = memoryProducts.length
    ? [
        "tiempo_respuesta",
        ...memoryProducts.map((product) => `${memoryColumnPrefix}_${toCSVColumnKey(product)}`)
      ]
    : [];
  const rows = [
    [
      "fecha_inicio",
      "fecha_fin",
      "prueba",
      "fase",
      "estructura",
      "aciertos",
      "errores",
      "fallos_de_tiempo",
      "pasos_fuera_de_tiempo",
      "tiempo_total",
      "tiempo_total_sesion",
      "tiempo_pausa_interferencia",
      "detalle_pausas",
      ...timeColumns.map(([columnName]) => columnName),
      ...memoryTimeColumns,
      "aciertos_memoria",
      "productos_correctos",
      "productos_seleccionados"
    ],
    [
      session.startedAt,
      session.endedAt,
      "Preparar comida",
      session.phase || "Fase 1",
      session.taskType || "estructura_a_tarea_simple",
      session.correctSteps,
      session.errors,
      session.temporalErrors || 0,
      session.temporalErrorSteps?.length
        ? session.temporalErrorSteps
            .map((entry) =>
              `${entry.id}: ${formatMilliseconds(entry.elapsedMs)} / límite ${formatMilliseconds(entry.deadlineMs)}`
            )
            .join(", ")
        : "No aplica",
      formatMilliseconds(session.totalTimeMs),
      formatMilliseconds(session.totalSessionTimeMs),
      formatMilliseconds(session.totalPausedMs),
      session.pauseEvents?.length
        ? session.pauseEvents
            .map((entry) => `${entry.reason}: ${formatMilliseconds(entry.durationMs)}`)
            .join(", ")
        : "No aplica",
      ...timeColumns.map(([, stepId]) =>
        formatMilliseconds(session.stepTimings?.find((entry) => entry.id === stepId)?.responseTimeMs)
      ),
      ...(memoryProducts.length
        ? [
            formatMilliseconds(session.memoryResponseTimeMs),
            ...memoryProducts.map((product) =>
              formatMilliseconds(session.memoryProductTimings?.[product])
            )
          ]
        : []),
      memoryProducts.length ? session.memoryCorrectCount : "No aplica",
      session.memoryCorrectLabels?.join(", ") || memoryProducts.join(", ") || "No aplica",
      session.selectedProductLabels?.join(", ") || session.selectedProducts?.join(", ") || "No aplica"
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
  link.download = `resultado-preparar-comida-${session.taskType || "fase"}-${Date.now()}.csv`;
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
  const continueDaughterButton = event.target.closest("[data-cooking-continue-daughter]");
  const memoryProductButton = event.target.closest("[data-cooking-memory-product]");
  const confirmMemoryButton = event.target.closest("[data-cooking-confirm-memory]");
  const speakButton = event.target.closest("[data-cooking-speak]");
  const repeatButton = event.target.closest("[data-cooking-repeat]");
  const exportButton = event.target.closest("[data-cooking-export]");
  const navButton = event.target.closest("[data-cooking-nav]");
  const timeoutResetButton = event.target.closest("[data-cooking-timeout-reset]");

  if (timeoutResetButton) {
    cancelBrowserVoice();
    resetGame(gameState.taskMode);
    return;
  }

  if (phaseButton) {
    cancelBrowserVoice();
    showFoodModeSelection(phaseButton.dataset.foodPhase);
    return;
  }

  if (modeButton) {
    cancelBrowserVoice();
    showEmptyFoodActivity(modeButton.dataset.foodPhaseMode);
    return;
  }

  if (nextButton) {
    cancelBrowserVoice();
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

  if (continueDaughterButton) {
    continueAfterDaughterMessage();
    return;
  }

  if (speakButton) {
    const shouldAdvanceAfterRepeatedDaughterAudio =
      gameState.screen === "daughter" && getCurrentMemoryConfig()?.immediateQuestionAfterAudio;

    playCookingCue(
      {
        audioSrc: speakButton.dataset.cookingAudioSrc,
        text: speakButton.dataset.cookingSpeak
      },
      () => {
        if (shouldAdvanceAfterRepeatedDaughterAudio && gameState.screen === "daughter") {
          showMemoryQuestionScreen();
        }
      }
    );
    return;
  }

  if (memoryProductButton) {
    toggleMemoryProduct(memoryProductButton.dataset.cookingMemoryProduct);
    return;
  }

  if (confirmMemoryButton) {
    confirmMemoryProducts();
    return;
  }

  if (repeatButton) {
    cancelBrowserVoice();
    resetGame(gameState.taskMode);
    return;
  }

  if (exportButton) {
    exportResultsCSV();
    return;
  }

  if (navButton) {
    if (navButton.dataset.cookingNav === "phases") {
      cancelBrowserVoice();
      resetGame();
      showFoodScreen("screen-food-phase-selection");
      return;
    }

  }
});
