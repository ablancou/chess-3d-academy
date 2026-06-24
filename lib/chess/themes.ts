export interface GlassMaterialConfig {
  color: string;
  accent?: string;
  metalness: number;
  roughness: number;
  transmission: number;
  thickness: number;
  ior: number;
  opacity: number;
  emissive: string;
  emissiveIntensity: number;
  clearcoat?: number;
  clearcoatRoughness?: number;
}

export interface BoardThemeConfig {
  light: string;
  dark: string;
  frame: string;
  selected: string;
  legalMove: string;
  lastMove: string;
  gridGlow: string;
  lightGlass: GlassMaterialConfig;
  darkGlass: GlassMaterialConfig;
  frameGlass: GlassMaterialConfig;
  showGrid: boolean;
}

export interface PieceThemeConfig {
  white: GlassMaterialConfig;
  black: GlassMaterialConfig;
  selectionRing: string;
}

export interface SceneThemeConfig {
  background: string;
  backgroundGradient: string;
  fog: string;
  fogNear: number;
  fogFar: number;
  ambientIntensity: number;
  keyLightColor: string;
  keyLightIntensity: number;
  fillLightColor: string;
  fillLightIntensity: number;
  accentLightColor: string;
  accentLightIntensity: number;
  rimLightColor: string;
  environment: "city" | "studio" | "dawn" | "night" | "warehouse";
}

export interface ChessTheme {
  id: string;
  name: string;
  description: string;
  preview: {
    light: string;
    dark: string;
    white: string;
    black: string;
  };
  board: BoardThemeConfig;
  pieces: PieceThemeConfig;
  scene: SceneThemeConfig;
}

const glass = (
  overrides: Partial<GlassMaterialConfig> & Pick<GlassMaterialConfig, "color">,
): GlassMaterialConfig => ({
  metalness: 0.12,
  roughness: 0.04,
  transmission: 0.72,
  thickness: 0.45,
  ior: 1.5,
  opacity: 0.92,
  emissive: "#0a1220",
  emissiveIntensity: 0.1,
  clearcoat: 1,
  clearcoatRoughness: 0.02,
  ...overrides,
});

function createScene(accent: string, rim = "#94a3b8"): SceneThemeConfig {
  return {
    background: "#030712",
    backgroundGradient:
      "radial-gradient(ellipse 80% 60% at 50% 35%, #0f172a 0%, #030712 72%)",
    fog: "#030712",
    fogNear: 18,
    fogFar: 55,
    ambientIntensity: 0.22,
    keyLightColor: "#f1f5f9",
    keyLightIntensity: 2.4,
    fillLightColor: accent,
    fillLightIntensity: 0.28,
    accentLightColor: accent,
    accentLightIntensity: 0.35,
    rimLightColor: rim,
    environment: "studio",
  };
}

export const CHESS_THEMES: ChessTheme[] = [
  {
    id: "arctic-glass",
    name: "Cristal Ártico",
    description: "Hielo translúcido y azules glaciares",
    preview: {
      light: "#a8d8ff",
      dark: "#1e3a5f",
      white: "#e8f4ff",
      black: "#2b5a8a",
    },
    board: {
      light: "#a8d8ff",
      dark: "#1e3a5f",
      frame: "#0c1929",
      selected: "#7ec8ff",
      legalMove: "#4ade80",
      lastMove: "#60a5fa",
      gridGlow: "#38bdf8",
      lightGlass: glass({
        color: "#b8e4ff",
        transmission: 0.78,
        roughness: 0.12,
        emissive: "#1a4a7a",
        emissiveIntensity: 0.2,
      }),
      darkGlass: glass({
        color: "#1a3a5c",
        transmission: 0.55,
        roughness: 0.18,
        emissive: "#0a2040",
        emissiveIntensity: 0.35,
      }),
      frameGlass: glass({
        color: "#0a1525",
        transmission: 0.4,
        metalness: 0.35,
        emissive: "#1e3a5f",
        emissiveIntensity: 0.5,
      }),
      showGrid: true,
    },
    pieces: {
      white: glass({
        color: "#e8f4ff",
        accent: "#b8e0ff",
        transmission: 0.9,
        roughness: 0.04,
        emissive: "#4a9eff",
        emissiveIntensity: 0.25,
      }),
      black: glass({
        color: "#2b5a8a",
        accent: "#1e4070",
        transmission: 0.75,
        roughness: 0.1,
        emissive: "#0a2848",
        emissiveIntensity: 0.4,
      }),
      selectionRing: "#7ec8ff",
    },
    scene: createScene("#38bdf8", "#bae6fd"),
  },
  {
    id: "neon-hologram",
    name: "Holograma Neón",
    description: "Tablero oscuro con piezas de luz azul eléctrica",
    preview: {
      light: "#1e3a5f",
      dark: "#0a0f1a",
      white: "#00d4ff",
      black: "#0066cc",
    },
    board: {
      light: "#152238",
      dark: "#080c14",
      frame: "#050810",
      selected: "#00d4ff",
      legalMove: "#22d3ee",
      lastMove: "#3b82f6",
      gridGlow: "#00d4ff",
      lightGlass: glass({
        color: "#1a2840",
        transmission: 0.35,
        metalness: 0.4,
        emissive: "#1e3a5f",
        emissiveIntensity: 0.6,
      }),
      darkGlass: glass({
        color: "#060a12",
        transmission: 0.2,
        metalness: 0.5,
        emissive: "#0a1020",
        emissiveIntensity: 0.8,
      }),
      frameGlass: glass({
        color: "#040608",
        transmission: 0.25,
        metalness: 0.6,
        emissive: "#00d4ff",
        emissiveIntensity: 0.3,
      }),
      showGrid: true,
    },
    pieces: {
      white: glass({
        color: "#00d4ff",
        accent: "#67e8f9",
        transmission: 0.65,
        metalness: 0.2,
        emissive: "#00d4ff",
        emissiveIntensity: 0.85,
      }),
      black: glass({
        color: "#0066cc",
        accent: "#0044aa",
        transmission: 0.5,
        metalness: 0.25,
        emissive: "#0044aa",
        emissiveIntensity: 0.7,
      }),
      selectionRing: "#00d4ff",
    },
    scene: createScene("#22d3ee", "#67e8f9"),
  },
  {
    id: "sapphire-matrix",
    name: "Matriz Zafiro",
    description: "Zafiro profundo con cristales de alta refracción",
    preview: {
      light: "#3b82f6",
      dark: "#1e1b4b",
      white: "#dbeafe",
      black: "#1e3a8a",
    },
    board: {
      light: "#2563eb",
      dark: "#1e1b4b",
      frame: "#0f0a2e",
      selected: "#60a5fa",
      legalMove: "#34d399",
      lastMove: "#818cf8",
      gridGlow: "#6366f1",
      lightGlass: glass({
        color: "#3b82f6",
        transmission: 0.7,
        roughness: 0.06,
        ior: 1.52,
        emissive: "#1e40af",
        emissiveIntensity: 0.3,
      }),
      darkGlass: glass({
        color: "#1e1b4b",
        transmission: 0.6,
        roughness: 0.1,
        ior: 1.5,
        emissive: "#312e81",
        emissiveIntensity: 0.45,
      }),
      frameGlass: glass({
        color: "#0f0a2e",
        transmission: 0.45,
        metalness: 0.3,
        emissive: "#4338ca",
        emissiveIntensity: 0.55,
      }),
      showGrid: true,
    },
    pieces: {
      white: glass({
        color: "#dbeafe",
        accent: "#93c5fd",
        transmission: 0.92,
        roughness: 0.03,
        ior: 1.55,
        emissive: "#3b82f6",
        emissiveIntensity: 0.2,
      }),
      black: glass({
        color: "#1e3a8a",
        accent: "#1e40af",
        transmission: 0.8,
        roughness: 0.06,
        ior: 1.5,
        emissive: "#1e1b4b",
        emissiveIntensity: 0.35,
      }),
      selectionRing: "#818cf8",
    },
    scene: createScene("#6366f1", "#a5b4fc"),
  },
  {
    id: "cyber-frost",
    name: "Escarcha Cyber",
    description: "Superficie helada con reflejos metálicos azulados",
    preview: {
      light: "#c4e0ff",
      dark: "#0c1929",
      white: "#f0f9ff",
      black: "#1a365d",
    },
    board: {
      light: "#c4e0ff",
      dark: "#0c1929",
      frame: "#061018",
      selected: "#93c5fd",
      legalMove: "#2dd4bf",
      lastMove: "#38bdf8",
      gridGlow: "#7dd3fc",
      lightGlass: glass({
        color: "#d4ecff",
        transmission: 0.85,
        roughness: 0.2,
        metalness: 0.25,
        emissive: "#60a5fa",
        emissiveIntensity: 0.15,
      }),
      darkGlass: glass({
        color: "#0c1929",
        transmission: 0.5,
        roughness: 0.15,
        metalness: 0.35,
        emissive: "#0a1628",
        emissiveIntensity: 0.5,
      }),
      frameGlass: glass({
        color: "#061018",
        transmission: 0.35,
        metalness: 0.45,
        roughness: 0.12,
        emissive: "#1a365d",
        emissiveIntensity: 0.4,
      }),
      showGrid: false,
    },
    pieces: {
      white: glass({
        color: "#f0f9ff",
        accent: "#e0f2fe",
        transmission: 0.88,
        roughness: 0.18,
        metalness: 0.2,
        emissive: "#bae6fd",
        emissiveIntensity: 0.18,
      }),
      black: glass({
        color: "#1a365d",
        accent: "#0f2744",
        transmission: 0.7,
        roughness: 0.12,
        metalness: 0.3,
        emissive: "#0c1929",
        emissiveIntensity: 0.45,
      }),
      selectionRing: "#93c5fd",
    },
    scene: createScene("#7dd3fc", "#e0f2fe"),
  },
  {
    id: "aurora-prism",
    name: "Prisma Aurora",
    description: "Iridiscencia azul-violeta con efecto prisma",
    preview: {
      light: "#818cf8",
      dark: "#1e1b4b",
      white: "#e0e7ff",
      black: "#4338ca",
    },
    board: {
      light: "#6366f1",
      dark: "#1e1b4b",
      frame: "#0f0a2e",
      selected: "#a5b4fc",
      legalMove: "#34d399",
      lastMove: "#818cf8",
      gridGlow: "#a78bfa",
      lightGlass: glass({
        color: "#818cf8",
        transmission: 0.72,
        roughness: 0.05,
        ior: 1.6,
        emissive: "#4f46e5",
        emissiveIntensity: 0.35,
      }),
      darkGlass: glass({
        color: "#1e1b4b",
        transmission: 0.58,
        roughness: 0.08,
        ior: 1.55,
        emissive: "#312e81",
        emissiveIntensity: 0.5,
      }),
      frameGlass: glass({
        color: "#0f0a2e",
        transmission: 0.4,
        metalness: 0.25,
        emissive: "#6366f1",
        emissiveIntensity: 0.6,
      }),
      showGrid: true,
    },
    pieces: {
      white: glass({
        color: "#e0e7ff",
        accent: "#c7d2fe",
        transmission: 0.9,
        roughness: 0.04,
        ior: 1.58,
        emissive: "#818cf8",
        emissiveIntensity: 0.3,
      }),
      black: glass({
        color: "#4338ca",
        accent: "#3730a3",
        transmission: 0.78,
        roughness: 0.06,
        ior: 1.52,
        emissive: "#312e81",
        emissiveIntensity: 0.5,
      }),
      selectionRing: "#a5b4fc",
    },
    scene: createScene("#818cf8", "#c7d2fe"),
  },
  {
    id: "deep-ocean",
    name: "Océano Profundo",
    description: "Tonos teal y cian con cristal marino",
    preview: {
      light: "#2dd4bf",
      dark: "#042f2e",
      white: "#ccfbf1",
      black: "#0f766e",
    },
    board: {
      light: "#14b8a6",
      dark: "#042f2e",
      frame: "#021a1a",
      selected: "#5eead4",
      legalMove: "#38bdf8",
      lastMove: "#2dd4bf",
      gridGlow: "#22d3ee",
      lightGlass: glass({
        color: "#2dd4bf",
        transmission: 0.75,
        roughness: 0.08,
        emissive: "#0d9488",
        emissiveIntensity: 0.3,
      }),
      darkGlass: glass({
        color: "#042f2e",
        transmission: 0.55,
        roughness: 0.12,
        emissive: "#022c2a",
        emissiveIntensity: 0.45,
      }),
      frameGlass: glass({
        color: "#021a1a",
        transmission: 0.38,
        metalness: 0.3,
        emissive: "#0f766e",
        emissiveIntensity: 0.5,
      }),
      showGrid: true,
    },
    pieces: {
      white: glass({
        color: "#ccfbf1",
        accent: "#99f6e4",
        transmission: 0.88,
        roughness: 0.05,
        emissive: "#2dd4bf",
        emissiveIntensity: 0.22,
      }),
      black: glass({
        color: "#0f766e",
        accent: "#0d5c56",
        transmission: 0.72,
        roughness: 0.1,
        emissive: "#042f2e",
        emissiveIntensity: 0.4,
      }),
      selectionRing: "#5eead4",
    },
    scene: createScene("#2dd4bf", "#99f6e4"),
  },
];

export const DEFAULT_THEME_ID = "arctic-glass";

export function getThemeById(id: string): ChessTheme {
  return CHESS_THEMES.find((t) => t.id === id) ?? CHESS_THEMES[0];
}