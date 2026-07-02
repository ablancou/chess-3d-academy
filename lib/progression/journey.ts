import type { JourneyNode, JourneyWorld } from "./types";

export const JOURNEY_WORLDS: JourneyWorld[] = [
  {
    id: "world-basics",
    title: "Mundo 1 · Primeros Pasos",
    subtitle: "Domina los principios del juego abierto",
    color: "#38bdf8",
    nodes: [
      { id: "w1-italian", title: "Apertura Italiana", type: "lesson", lessonId: "italian-game", description: "El punto de partida clásico: desarrollo rápido y presión sobre f7.", xpReward: 60, x: 50 },
      { id: "w1-practice-1", title: "Práctica Libre", type: "practice", description: "Juega una partida completa aplicando lo aprendido.", xpReward: 40, x: 28 },
      { id: "w1-scotch", title: "Apertura Escocesa", type: "lesson", lessonId: "scotch-game", description: "Aprende a abrir el centro y activar tus piezas.", xpReward: 60, x: 66 },
      { id: "w1-four-knights", title: "Cuatro Caballos", type: "lesson", lessonId: "four-knights", description: "Desarrollo armónico: caballos antes que alfiles.", xpReward: 60, x: 40 },
      { id: "w1-boss", title: "Desafío: Jaque Mate", type: "boss", description: "Gana una partida por jaque mate para conquistar el mundo.", xpReward: 120, x: 50 },
    ],
  },
  {
    id: "world-open-games",
    title: "Mundo 2 · Juegos Abiertos",
    subtitle: "Ataques románticos y gambitos legendarios",
    color: "#a78bfa",
    nodes: [
      { id: "w2-ruy-lopez", title: "Apertura Española", type: "lesson", lessonId: "ruy-lopez", description: "La apertura de los campeones del mundo.", xpReward: 70, x: 50 },
      { id: "w2-vienna", title: "Apertura Vienesa", type: "lesson", lessonId: "vienna-game", description: "Flexibilidad y opciones de ataque con f4.", xpReward: 70, x: 30 },
      { id: "w2-kings-gambit", title: "Gambito de Rey", type: "lesson", lessonId: "kings-gambit", description: "El gambito romántico del siglo XIX.", xpReward: 70, x: 68 },
      { id: "w2-evans", title: "Gambito Evans", type: "lesson", lessonId: "evans-gambit", description: "Sacrifica un peón por iniciativa devastadora.", xpReward: 70, x: 42 },
      { id: "w2-boss", title: "Desafío Abierto", type: "boss", description: "Gana una partida por jaque mate con estilo atacante.", xpReward: 140, x: 50 },
    ],
  },
  {
    id: "world-defenses",
    title: "Mundo 3 · Defensas Sólidas",
    subtitle: "Aprende a jugar con las piezas negras",
    color: "#34d399",
    nodes: [
      { id: "w3-french", title: "Defensa Francesa", type: "lesson", lessonId: "french-defense", description: "Cadenas de peones y contragolpes en el centro.", xpReward: 70, x: 50 },
      { id: "w3-caro-kann", title: "Caro-Kann", type: "lesson", lessonId: "caro-kann", description: "La defensa más sólida contra 1.e4.", xpReward: 70, x: 30 },
      { id: "w3-petroff", title: "Defensa Petrov", type: "lesson", lessonId: "petroff-defense", description: "Contraataque simétrico de acero.", xpReward: 70, x: 68 },
      { id: "w3-scandinavian", title: "Escandinava", type: "lesson", lessonId: "scandinavian", description: "Desafía el centro desde la primera jugada.", xpReward: 70, x: 42 },
      { id: "w3-boss", title: "Práctica Defensiva", type: "practice", description: "Juega una partida completa demostrando solidez.", xpReward: 100, x: 50 },
    ],
  },
  {
    id: "world-sicilian",
    title: "Mundo 4 · Batallas Sicilianas",
    subtitle: "La defensa más combativa del ajedrez",
    color: "#f87171",
    nodes: [
      { id: "w4-sicilian", title: "Defensa Siciliana", type: "lesson", lessonId: "sicilian-defense", description: "La respuesta más popular y agresiva a 1.e4.", xpReward: 80, x: 50 },
      { id: "w4-alapin", title: "Variante Alapin", type: "lesson", lessonId: "sicilian-alapin", description: "El arma blanca contra la Siciliana.", xpReward: 80, x: 32 },
      { id: "w4-dragon", title: "Dragón Siciliano", type: "lesson", lessonId: "sicilian-dragon", description: "El alfil de g7 escupe fuego en la gran diagonal.", xpReward: 80, x: 66 },
      { id: "w4-boss", title: "Desafío Siciliano", type: "boss", description: "Gana por jaque mate para dominar la Siciliana.", xpReward: 160, x: 50 },
    ],
  },
  {
    id: "world-queens-pawn",
    title: "Mundo 5 · Imperio de Dama",
    subtitle: "Estrategia profunda con 1.d4",
    color: "#fbbf24",
    nodes: [
      { id: "w5-queens-gambit", title: "Gambito de Dama", type: "lesson", lessonId: "queens-gambit", description: "El arma estratégica más famosa del mundo.", xpReward: 80, x: 50 },
      { id: "w5-london", title: "Sistema Londres", type: "lesson", lessonId: "london-system", description: "Un esquema sólido y universal.", xpReward: 80, x: 30 },
      { id: "w5-slav", title: "Defensa Eslava", type: "lesson", lessonId: "slav-defense", description: "Solidez sin encerrar al alfil dama.", xpReward: 80, x: 68 },
      { id: "w5-qgd", title: "Gambito Rehusado", type: "lesson", lessonId: "queens-gambit-declined", description: "La respuesta clásica al Gambito de Dama.", xpReward: 80, x: 42 },
      { id: "w5-catalan", title: "Apertura Catalana", type: "lesson", lessonId: "catalan-opening", description: "Presión eterna en la gran diagonal.", xpReward: 80, x: 58 },
      { id: "w5-boss", title: "Desafío Estratégico", type: "boss", description: "Gana por jaque mate demostrando dominio posicional.", xpReward: 180, x: 50 },
    ],
  },
  {
    id: "world-indian",
    title: "Mundo 6 · Universo Indio",
    subtitle: "Sistemas hipermodernos de élite",
    color: "#e879f9",
    nodes: [
      { id: "w6-kings-indian", title: "India de Rey", type: "lesson", lessonId: "kings-indian", description: "Cede el centro… y luego destrúyelo.", xpReward: 90, x: 50 },
      { id: "w6-nimzo", title: "Nimzoindia", type: "lesson", lessonId: "nimzo-indian", description: "Estrategia pura: clavadas y estructuras.", xpReward: 90, x: 30 },
      { id: "w6-grunfeld", title: "Grünfeld", type: "lesson", lessonId: "grunfeld-defense", description: "Golpea el centro con dinamita hipermoderna.", xpReward: 90, x: 68 },
      { id: "w6-benoni", title: "Benoni Moderna", type: "lesson", lessonId: "benoni-defense", description: "Desequilibrio total desde la apertura.", xpReward: 90, x: 42 },
      { id: "w6-boss", title: "Gran Final", type: "boss", description: "El último desafío: gana por jaque mate como un gran maestro.", xpReward: 250, x: 50 },
    ],
  },
];

export const ALL_JOURNEY_NODES: JourneyNode[] = JOURNEY_WORLDS.flatMap(
  (w) => w.nodes,
);

export function getNodeById(id: string): JourneyNode | undefined {
  return ALL_JOURNEY_NODES.find((n) => n.id === id);
}

export function getNodeByLessonId(lessonId: string): JourneyNode | undefined {
  return ALL_JOURNEY_NODES.find((n) => n.lessonId === lessonId);
}

/** Un nodo está desbloqueado si es el primero global o el anterior está completado. */
export function isNodeUnlocked(nodeId: string, completedNodes: string[]): boolean {
  const index = ALL_JOURNEY_NODES.findIndex((n) => n.id === nodeId);
  if (index <= 0) return index === 0;
  return completedNodes.includes(ALL_JOURNEY_NODES[index - 1].id);
}

/** Primer nodo no completado (el "actual"). */
export function getCurrentNode(completedNodes: string[]): JourneyNode {
  return (
    ALL_JOURNEY_NODES.find((n) => !completedNodes.includes(n.id)) ??
    ALL_JOURNEY_NODES[ALL_JOURNEY_NODES.length - 1]
  );
}
