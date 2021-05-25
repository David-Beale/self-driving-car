import { useEffect, useState } from "react";
import { useKeyboardControls } from "./useKeyboardControls";
import { useMouseControls } from "./useMouseControls";

export const useControls = (
  player,
  mode,
  setGauges,
  selectedVertex,
  currentDNA
) => {
  const [forces, setForces] = useState({ steering: 0, engine: 0, braking: 0 });
  const [reset, setReset] = useState(false);

  useKeyboardControls(mode, setForces, setReset, setGauges);

  useMouseControls(selectedVertex, player, mode, setForces, setGauges);

  useEffect(() => {
    if (!currentDNA) return;
    player.updateDNA(currentDNA);
    setReset([false]);
  }, [player, currentDNA]);

  useEffect(() => {
    if (!reset || !reset[0]) return;
    player.arrayOfSteps = [];
    player.pathGeometry.setVertices([]);
  }, [player, reset]);

  return [forces, reset];
};
