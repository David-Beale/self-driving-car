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
  currentDNA
) => {
  const [reset, setReset] = useState(false);
  useKeyboardControls(mode, vehicleRef, setReset, setGauges);

  useMouseControls(selectedVertex, player, mode, vehicleRef, setGauges);

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

  useEffect(() => {
    if (!reset) return;
    playerRef.current.api.position.set(147.5, 4, 192.5);
    playerRef.current.api.angularVelocity.set(0, 0, 0);
    playerRef.current.api.velocity.set(0, 0, 0);
    playerRef.current.api.rotation.set(0, Math.PI, 0);
  }, [reset, playerRef]);
};
