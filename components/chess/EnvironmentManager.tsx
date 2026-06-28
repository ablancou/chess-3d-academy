import { Environment } from "@react-three/drei";
import { useThemeStore } from "@/stores/theme-store";
import { getThemeById } from "@/lib/chess/themes";
import { SceneAtmosphere } from "./SceneAtmosphere";
import { SceneBackdrop } from "./SceneBackdrop";
import { Suspense } from "react";

export function EnvironmentManager() {
  const { themeId, environmentId } = useThemeStore();
  const theme = getThemeById(themeId);

  if (environmentId === "cyber") {
    return (
      <>
        <SceneAtmosphere scene={theme.scene} />
        <SceneBackdrop scene={theme.scene} />
      </>
    );
  }

  const file =
    environmentId === "mexico-beach"
      ? "/environments/mexico_beach.jpg"
      : "/environments/italy_beach.jpg";

  return (
    <Suspense fallback={null}>
      {/* 
        We use background={true} to set the scene background.
        We also use it for lighting by default.
      */}
      <Environment background files={file} />
    </Suspense>
  );
}
