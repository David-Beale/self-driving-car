import { useEffect, useState } from "react";
import { useKeyboardControls } from "./useKeyboardControls";
import { useMouseControls } from "./useMouseControls";

export const useControls = (
  playerRef,
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
    if (useAICar) {
      setResetPosition([true]);
      return;
    }
    if (!currentDNA) return;
    player.updateDNA(currentDNA);
    setResetPosition([true]);
  }, [player, currentDNA, useAICar]);

  useEffect(() => {
    if (!clearPath) return;
    player.arrayOfSteps = [];
    player.pathGeometry.setVertices([]);
  }, [player, clearPath]);

  useEffect(() => {
    if (!resetPosition) return;
    playerRef.current.api.position.set(147.5, 4, 192.5);
    playerRef.current.api.angularVelocity.set(0, 0, 0);
    playerRef.current.api.velocity.set(0, 0, 0);
    playerRef.current.api.rotation.set(0, Math.PI, 0);
  }, [resetPosition, playerRef]);
};
