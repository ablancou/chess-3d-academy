/**
 * Libro de aperturas ECO local (offline).
 * Permite detectar la apertura actual sin depender de la red
 * y sugerir las continuaciones teóricas conocidas.
 */

export interface EcoOpening {
  eco: string;
  name: string;
  /** Línea principal en SAN separada por espacios */
  moves: string;
  description: string;
}

export interface OpeningMatch extends EcoOpening {
  /** Cuántas jugadas (plies) de la partida coinciden con la línea */
  plyCount: number;
  sans: string[];
}

export interface TheoryMove {
  san: string;
  name: string;
  eco: string;
}

export const ECO_OPENINGS: EcoOpening[] = [
  // ── Primeras jugadas ──────────────────────────────────────────────
  { eco: "B00", name: "Apertura de Peón de Rey", moves: "e4", description: "La jugada más popular de la historia. Ocupa el centro y libera al alfil y la dama." },
  { eco: "A40", name: "Apertura de Peón de Dama", moves: "d4", description: "Controla el centro con apoyo. Suele llevar a posiciones más estratégicas que 1.e4." },
  { eco: "A10", name: "Apertura Inglesa", moves: "c4", description: "Lucha por el centro desde el flanco. Flexible y muy usada a nivel magistral." },
  { eco: "A04", name: "Apertura Réti", moves: "Nf3", description: "Desarrollo flexible que evita comprometer los peones centrales temprano." },
  { eco: "A02", name: "Apertura Bird", moves: "f4", description: "Controla e5 desde el primer movimiento, buscando un ataque en el flanco de rey." },
  { eco: "A01", name: "Apertura Larsen", moves: "b3", description: "Fianchetto de dama inmediato para presionar la gran diagonal." },
  { eco: "C20", name: "Juego Abierto", moves: "e4 e5", description: "La respuesta clásica y simétrica. Ambos bandos luchan por el centro." },

  // ── Juegos abiertos (1.e4 e5) ─────────────────────────────────────
  { eco: "C50", name: "Apertura Italiana", moves: "e4 e5 Nf3 Nc6 Bc4", description: "El alfil apunta a f7, el punto más débil de las negras. Desarrollo rápido y natural." },
  { eco: "C53", name: "Giuoco Piano", moves: "e4 e5 Nf3 Nc6 Bc4 Bc5 c3", description: "El 'juego tranquilo': las blancas preparan d4 para construir un centro fuerte." },
  { eco: "C51", name: "Gambito Evans", moves: "e4 e5 Nf3 Nc6 Bc4 Bc5 b4", description: "Sacrifica un peón para ganar tiempo y abrir líneas de ataque contra el rey negro." },
  { eco: "C55", name: "Defensa de los Dos Caballos", moves: "e4 e5 Nf3 Nc6 Bc4 Nf6", description: "Las negras contraatacan e4 de inmediato, aceptando complicaciones tácticas." },
  { eco: "C60", name: "Apertura Española (Ruy López)", moves: "e4 e5 Nf3 Nc6 Bb5", description: "La apertura clásica por excelencia. Presiona al caballo que defiende e5." },
  { eco: "C65", name: "Española: Defensa Berlinesa", moves: "e4 e5 Nf3 Nc6 Bb5 Nf6", description: "La 'muralla de Berlín'. Sólida y famosa por resistir al más alto nivel." },
  { eco: "C68", name: "Española: Variante del Cambio", moves: "e4 e5 Nf3 Nc6 Bb5 a6 Bxc6", description: "Las blancas cambian el alfil para dañar la estructura de peones negra." },
  { eco: "C70", name: "Española: Defensa Morphy", moves: "e4 e5 Nf3 Nc6 Bb5 a6 Ba4", description: "Las negras preguntan al alfil antes de decidir su plan. La línea principal moderna." },
  { eco: "C84", name: "Española Cerrada", moves: "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7", description: "Batalla estratégica de largo aliento con maniobras profundas por ambos bandos." },
  { eco: "C44", name: "Apertura Escocesa", moves: "e4 e5 Nf3 Nc6 d4", description: "Abre el centro de inmediato para activar las piezas rápidamente." },
  { eco: "C45", name: "Juego Escocés", moves: "e4 e5 Nf3 Nc6 d4 exd4 Nxd4", description: "El caballo domina el centro. Posiciones abiertas con juego activo de piezas." },
  { eco: "C25", name: "Apertura Vienesa", moves: "e4 e5 Nc3", description: "Desarrolla el caballo dama primero, manteniendo la opción del avance f4." },
  { eco: "C29", name: "Gambito Vienés", moves: "e4 e5 Nc3 Nf6 f4", description: "Ataca e5 con el peón f, buscando un ataque rápido contra el rey." },
  { eco: "C30", name: "Gambito de Rey", moves: "e4 e5 f4", description: "El gambito romántico: entrega un peón por ataque y columnas abiertas." },
  { eco: "C33", name: "Gambito de Rey Aceptado", moves: "e4 e5 f4 exf4", description: "Las negras toman el peón; las blancas obtienen centro y la columna f." },
  { eco: "C42", name: "Defensa Petrov", moves: "e4 e5 Nf3 Nf6", description: "Contraataque simétrico sobre e4. Reputación de solidez extrema." },
  { eco: "C41", name: "Defensa Philidor", moves: "e4 e5 Nf3 d6", description: "Defiende e5 con el peón. Sólida pero algo pasiva para las negras." },
  { eco: "C47", name: "Juego de los Cuatro Caballos", moves: "e4 e5 Nf3 Nc6 Nc3 Nf6", description: "Desarrollo clásico y simétrico de los cuatro caballos antes de definir planes." },

  // ── Siciliana ─────────────────────────────────────────────────────
  { eco: "B20", name: "Defensa Siciliana", moves: "e4 c5", description: "La respuesta más combativa a 1.e4. Lucha asimétrica por el centro." },
  { eco: "B22", name: "Siciliana: Variante Alapin", moves: "e4 c5 c3", description: "Las blancas preparan d4 con apoyo, evitando la teoría de las líneas abiertas." },
  { eco: "B23", name: "Siciliana Cerrada", moves: "e4 c5 Nc3", description: "Las blancas evitan abrir el centro y planean expansión en el flanco de rey." },
  { eco: "B27", name: "Siciliana: Sistema Abierto", moves: "e4 c5 Nf3", description: "Camino a las líneas abiertas: las blancas preparan d4 para abrir el juego." },
  { eco: "B54", name: "Siciliana Abierta", moves: "e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3", description: "La estructura básica de la Siciliana abierta con juego para ambos bandos." },
  { eco: "B90", name: "Siciliana Najdorf", moves: "e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6", description: "La variante favorita de Fischer y Kasparov. Flexible, ambiciosa y muy teórica." },
  { eco: "B70", name: "Siciliana Dragón", moves: "e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6", description: "El alfil en g7 respira fuego sobre la gran diagonal. Ataques mutuos brutales." },
  { eco: "B33", name: "Siciliana Sveshnikov", moves: "e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 Nf6 Nc3 e5", description: "Acepta un hueco en d5 a cambio de actividad dinámica de piezas." },
  { eco: "B40", name: "Siciliana: Variante Taimanov", moves: "e4 c5 Nf3 e6", description: "Sistema flexible: las negras deciden más tarde dónde irán sus piezas." },

  // ── Otras defensas contra 1.e4 ────────────────────────────────────
  { eco: "C00", name: "Defensa Francesa", moves: "e4 e6", description: "Sólida cadena de peones. Las negras aceptan menos espacio a cambio de contragolpes." },
  { eco: "C02", name: "Francesa: Variante del Avance", moves: "e4 e6 d4 d5 e5", description: "Las blancas ganan espacio; las negras atacan la base de la cadena con c5." },
  { eco: "C03", name: "Francesa: Variante Tarrasch", moves: "e4 e6 d4 d5 Nd2", description: "El caballo en d2 evita la clavada Bb4 manteniendo la tensión central." },
  { eco: "C15", name: "Francesa: Variante Winawer", moves: "e4 e6 d4 d5 Nc3 Bb4", description: "La clavada desequilibra el juego: peones doblados a cambio de la pareja de alfiles." },
  { eco: "B10", name: "Defensa Caro-Kann", moves: "e4 c6", description: "Prepara d5 sin encerrar al alfil de c8. Reputación de solidez absoluta." },
  { eco: "B12", name: "Caro-Kann: Variante del Avance", moves: "e4 c6 d4 d5 e5", description: "Las blancas ganan espacio; el alfil negro sale a f5 antes de e6." },
  { eco: "B13", name: "Caro-Kann: Ataque Panov", moves: "e4 c6 d4 d5 exd5 cxd5 c4", description: "Transforma la partida en posiciones de peón dama aislado con juego activo." },
  { eco: "B18", name: "Caro-Kann Clásica", moves: "e4 c6 d4 d5 Nc3 dxe4 Nxe4 Bf5", description: "El alfil sale activo antes de cerrar la estructura. El plan clásico de las negras." },
  { eco: "B01", name: "Defensa Escandinava", moves: "e4 d5", description: "Desafía e4 de inmediato. Juego claro y directo desde la primera jugada." },
  { eco: "B01", name: "Escandinava: línea principal", moves: "e4 d5 exd5 Qxd5 Nc3 Qa5", description: "La dama se reubica en a5, manteniendo presión sobre el flanco de dama." },
  { eco: "B07", name: "Defensa Pirc", moves: "e4 d6", description: "Cede el centro temporalmente para atacarlo después con piezas y palancas." },
  { eco: "B06", name: "Defensa Moderna", moves: "e4 g6", description: "Fianchetto inmediato: el alfil de g7 presionará el centro a distancia." },
  { eco: "B02", name: "Defensa Alekhine", moves: "e4 Nf6", description: "Provoca el avance de los peones blancos para atacarlos como debilidades." },

  // ── Juegos de peón dama ───────────────────────────────────────────
  { eco: "D06", name: "Gambito de Dama", moves: "d4 d5 c4", description: "Ofrece el peón c para desviar al peón d y dominar el centro." },
  { eco: "D20", name: "Gambito de Dama Aceptado", moves: "d4 d5 c4 dxc4", description: "Las negras toman el peón para devolverlo después con desarrollo cómodo." },
  { eco: "D30", name: "Gambito de Dama Rehusado", moves: "d4 d5 c4 e6", description: "La respuesta clásica: mantiene el centro firme a costa del alfil de c8." },
  { eco: "D10", name: "Defensa Eslava", moves: "d4 d5 c4 c6", description: "Defiende d5 sin encerrar al alfil de c8. Sólida y muy respetada." },
  { eco: "D43", name: "Defensa Semi-Eslava", moves: "d4 d5 c4 c6 Nf3 Nf6 Nc3 e6", description: "Mezcla de Eslava y Gambito Rehusado. Rica en teoría y contrajuego." },
  { eco: "D02", name: "Sistema Londres", moves: "d4 d5 Nf3 Nf6 Bf4", description: "Esquema sólido y fácil de aprender: alfil fuera antes de cerrar la cadena." },
  { eco: "A45", name: "Ataque Trompowsky", moves: "d4 Nf6 Bg5", description: "Amenaza doblar los peones negros y saca la partida de la teoría convencional." },
  { eco: "E00", name: "Apertura Catalana", moves: "d4 Nf6 c4 e6 g3", description: "Combina el Gambito de Dama con el fianchetto: presión duradera en la diagonal larga." },

  // ── Defensas indias ───────────────────────────────────────────────
  { eco: "E60", name: "Defensa India de Rey", moves: "d4 Nf6 c4 g6 Nc3 Bg7", description: "Cede el centro para luego atacarlo con e5 o c5. Favorita de Kasparov." },
  { eco: "D80", name: "Defensa Grünfeld", moves: "d4 Nf6 c4 g6 Nc3 d5", description: "Golpea el centro de inmediato: el peón d4 se convertirá en blanco de ataque." },
  { eco: "E20", name: "Defensa Nimzoindia", moves: "d4 Nf6 c4 e6 Nc3 Bb4", description: "La clavada controla e4 sin mover peones centrales. Estrategia pura." },
  { eco: "E12", name: "Defensa India de Dama", moves: "d4 Nf6 c4 e6 Nf3 b6", description: "Fianchetto de dama para controlar e4 a distancia. Hermana de la Nimzoindia." },
  { eco: "A56", name: "Defensa Benoni", moves: "d4 Nf6 c4 c5", description: "Desequilibra la estructura de inmediato buscando contrajuego dinámico." },
  { eco: "A60", name: "Benoni Moderna", moves: "d4 Nf6 c4 c5 d5 e6", description: "Las negras abren la columna e y activan la mayoría de peones del flanco dama." },
  { eco: "A80", name: "Defensa Holandesa", moves: "d4 f5", description: "Controla e4 con el peón f y anuncia intenciones agresivas en el flanco rey." },

  // ── Inglesa / Réti ────────────────────────────────────────────────
  { eco: "A20", name: "Inglesa: Siciliana Invertida", moves: "c4 e5", description: "Una Siciliana con colores cambiados y un tiempo extra para las blancas." },
  { eco: "A30", name: "Inglesa Simétrica", moves: "c4 c5", description: "Simetría total: la batalla se decidirá por pequeños detalles de desarrollo." },
  { eco: "A09", name: "Apertura Réti: Gambito", moves: "Nf3 d5 c4", description: "Ataca d5 desde el flanco sin comprometer el centro propio." },
];

interface ParsedOpening extends EcoOpening {
  sans: string[];
}

let parsed: ParsedOpening[] | null = null;

function getParsedOpenings(): ParsedOpening[] {
  if (!parsed) {
    parsed = ECO_OPENINGS.map((o) => ({ ...o, sans: o.moves.split(" ") }));
  }
  return parsed;
}

/**
 * Detecta la apertura buscando la línea conocida más larga
 * que sea prefijo del historial de la partida.
 */
export function detectOpening(history: string[]): OpeningMatch | null {
  let best: OpeningMatch | null = null;

  for (const opening of getParsedOpenings()) {
    if (opening.sans.length > history.length) continue;
    let matches = true;
    for (let i = 0; i < opening.sans.length; i++) {
      if (opening.sans[i] !== history[i]) {
        matches = false;
        break;
      }
    }
    if (matches && (!best || opening.sans.length > best.plyCount)) {
      best = { ...opening, plyCount: opening.sans.length };
    }
  }

  return best;
}

/**
 * Devuelve las continuaciones teóricas conocidas para la posición actual,
 * deduplicadas por jugada (mantiene la línea con nombre más específico).
 */
export function getTheoryMoves(history: string[], limit = 5): TheoryMove[] {
  const seen = new Map<string, TheoryMove>();

  for (const opening of getParsedOpenings()) {
    if (opening.sans.length <= history.length) continue;
    let matches = true;
    for (let i = 0; i < history.length; i++) {
      if (opening.sans[i] !== history[i]) {
        matches = false;
        break;
      }
    }
    if (!matches) continue;

    const nextSan = opening.sans[history.length];
    if (!seen.has(nextSan)) {
      seen.set(nextSan, { san: nextSan, name: opening.name, eco: opening.eco });
    }
  }

  return Array.from(seen.values()).slice(0, limit);
}

/**
 * ¿La última jugada del historial sigue estando dentro de una línea teórica?
 */
export function isBookLine(history: string[]): boolean {
  const match = detectOpening(history);
  return match !== null && match.plyCount === history.length;
}
