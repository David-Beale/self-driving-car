import { useEffect, useState } from "react";
import { useKeyboardControls } from "./useKeyboardControls";
import { useMouseControls } from "./useMouseControls";

export const useControls = (
  chassisRef,
  vehicleRef,
  player,
  mode,
  setGauges,
  selectedVertex,
  currentDNA,
  useAICar
) => {
  const [resetPosition, setResetPosition] = useState(false);
  const [clearPath, setClearPath] = useState(false);

  useKeyboardControls(
    mode,
    vehicleRef,
    setResetPosition,
    setClearPath,
    setGauges
  );

  useMouseControls(selectedVertex, player, mode, vehicleRef, setGauges);

  useEffect(() => {
    setResetPosition([true]);
    if (!currentDNA || useAICar) return;
    player.updateDNA(currentDNA);
  }, [player, currentDNA, useAICar]);

  useEffect(() => {
    if (!clearPath) return;
    player.arrayOfSteps = [];
    player.pathGeometry.setVertices([]);
  }, [player, clearPath]);

  useEffect(() => {
    if (!resetPosition) return;
    chassisRef.current.api.position.set(147.5, 4, 192.5);
    chassisRef.current.api.angularVelocity.set(0, 0, 0);
    chassisRef.current.api.velocity.set(0, 0, 0);
    chassisRef.current.api.rotation.set(0, Math.PI, 0);
  }, [resetPosition, chassisRef]);
};
