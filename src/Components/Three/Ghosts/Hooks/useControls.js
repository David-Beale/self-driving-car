import { useEffect, useState } from "react";
import { useMouseControls } from "./useMouseControls";

export const useControls = (ghostCar, ghostDNA) => {
  const [forces, setForces] = useState({ steering: 0, engine: 0, braking: 0 });
  const [reset, setReset] = useState(false);

  useMouseControls(ghostCar, setForces);

  useEffect(() => {
    if (!ghostDNA) return;
    ghostCar.updateDNA(ghostDNA);
    setReset([false]);
  }, [ghostCar, ghostDNA]);

  return [forces, reset];
};
