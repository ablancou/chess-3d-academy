import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_THEME_ID } from "@/lib/chess/themes";
import { audioManager } from "@/lib/audio/audio-manager";

export type EnvironmentId = "cyber" | "mexico-beach" | "italy-beach";

interface ThemeStore {
  themeId: string;
  environmentId: EnvironmentId;
  setThemeId: (id: string) => void;
  setEnvironmentId: (id: EnvironmentId) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      themeId: DEFAULT_THEME_ID,
      environmentId: "cyber",
      setThemeId: (id) => {
        set({ themeId: id });
      },
      setEnvironmentId: (id) => {
        set({ environmentId: id });
        audioManager.setAmbient(id);
      },
    }),
    { name: "chess-3d-theme" },
  ),
);