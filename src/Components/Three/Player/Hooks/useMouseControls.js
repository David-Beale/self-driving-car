import { useEffect } from "react";
import { useFrame } from "@react-three/fiber";

export const useMouseControls = (
  selectedVertex,
  player,
  mode,
  setForces,
  setGauges
) => {
  useEffect(() => {
    if (mode === "keyboard") {
      player.clearPath();
      return;
    }
    if (!selectedVertex) return;
    player.click(selectedVertex);
  }, [mode, selectedVertex, player]);

  useFrame(() => {
    if (mode !== "mouse") return;
    const res = player.run();
    if (!res) return;
    const { forces, guages } = res;
    setForces(forces);
    setGauges(guages);
  });
};
