import { useCallback, useEffect, useState } from "react";
import { useKeyboardControls } from "./useKeyboardControls";
import { useMouseControls } from "./useMouseControls";

export const useControls = (
  chassisRef,
  vehicleRef,
  playerRef,
  mode,
  setGauges,
  selectedVertex,
  currentDNA,
  useAICar
) => {
  const resetPosition = useCallback(() => {
    chassisRef.current.api.position.set(147.5, 4, 192.5);
    chassisRef.current.api.angularVelocity.set(0, 0, 0);
    chassisRef.current.api.velocity.set(0, 0, 0);
    chassisRef.current.api.rotation.set(0, Math.PI, 0);
  }, [chassisRef]);

  const clearPath = () => {
    playerRef.current.arrayOfSteps = [];
    playerRef.current.pathGeometry.setVertices([]);
  };

  useKeyboardControls(mode, vehicleRef, resetPosition, clearPath, setGauges);

  useMouseControls(selectedVertex, playerRef, mode, vehicleRef, setGauges);

  useEffect(() => {
    resetPosition();
    if (!currentDNA) return;
    playerRef.current.updateDNA?.(currentDNA);
  }, [playerRef, currentDNA, resetPosition, useAICar]);
};
