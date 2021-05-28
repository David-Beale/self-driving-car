import { useEffect, useState } from "react";
import { useMouseControls } from "./useMouseControls";

export const useControls = (ghostRef, vehicleRef, ghostCar, ghostDNA) => {
  const [reset, setReset] = useState(false);

  useMouseControls(ghostCar, vehicleRef);

  useEffect(() => {
    if (!ghostDNA) return;
    ghostCar.updateDNA(ghostDNA);
    setReset([false]);
  }, [ghostCar, ghostDNA]);

  useEffect(() => {
    if (!reset) return;
    ghostRef.current.api.position.set(147.5, 4, 192.5);
    ghostRef.current.api.angularVelocity.set(0, 0, 0);
    ghostRef.current.api.velocity.set(0, 0, 0);
    ghostRef.current.api.rotation.set(0, Math.PI, 0);
  }, [reset, ghostRef]);
};
