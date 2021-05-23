import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";

export const useMouseControls = (
  selectedVertex,
  player,
  mode,
  setForces,
  setGauges
) => {
  const prevVertex = useRef();
  useEffect(() => {
    if (mode === "keyboard") {
      player.clearPath();
      return;
    }
    if (!selectedVertex || selectedVertex === prevVertex.current) return;
    prevVertex.current = selectedVertex;
    player.click(selectedVertex);
  }, [mode, selectedVertex, player]);

  useFrame(() => {
    if (mode !== "mouse") return;
    const res = player.run();
    if (!res) return;
    const { forces, gauges } = res;
    setForces(forces);
    setGauges(gauges);
  });
};
