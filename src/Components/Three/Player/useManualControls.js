import { useFrame } from "@react-three/fiber";
import { useEffect, useState } from "react";

function useKeyPress(target, mode) {
  const [keyPressed, setKeyPressed] = useState(false);

  // If pressed key is our target key then set to true
  const downHandler = (e) => {
    e.preventDefault();
    return e.key === target ? setKeyPressed(true) : null;
  };
  const upHandler = ({ key }) => (key === target ? setKeyPressed(false) : null);
  useEffect(() => {
    if (mode === "keyboard") {
      // Add event listeners
      window.addEventListener("keydown", downHandler);
      window.addEventListener("keyup", upHandler);
      // Remove event listeners on cleanup
      return () => {
        window.removeEventListener("keydown", downHandler);
        window.removeEventListener("keyup", upHandler);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  return keyPressed;
}

export const useManualControls = (
  setSteeringValue,
  setEngineForce,
  setBrakeForce,
  setReset,
  engineForce,
  parameters,
  mode
) => {
  const forward = useKeyPress("w", mode);
  const backward = useKeyPress("s", mode);
  const left = useKeyPress("a", mode);
  const right = useKeyPress("d", mode);
  const brake = useKeyPress(" ", mode); // space bar
  const reset = useKeyPress("r", "keyboard");

  const { maxSteerVal, maxForce, maxBrakeForce } = parameters;

  useFrame(() => {
    if (reset) {
      setReset([true]);
    }
    if (mode !== "keyboard") return;
    if (left && !right) {
      setSteeringValue(maxSteerVal);
    } else if (right && !left) {
      setSteeringValue(-maxSteerVal);
    } else {
      setSteeringValue(0);
    }
    if (forward && !backward) {
      setBrakeForce(0);
      setEngineForce(-maxForce);
    } else if (backward && !forward) {
      setBrakeForce(0);
      setEngineForce(maxForce);
    } else if (engineForce !== 0) {
      setEngineForce(0);
    }
    if (brake) {
      setBrakeForce(maxBrakeForce);
    }
    if (!brake) setBrakeForce(0);
  });
};
