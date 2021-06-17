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

export const useKeyboardControls = (
  mode,
  vehicleRef,
  setResetPosition,
  setClearPath,
  setGauges
) => {
  const forward = useKeyPress("w", mode);
  const backward = useKeyPress("s", mode);
  const left = useKeyPress("a", mode);
  const right = useKeyPress("d", mode);
  const brake = useKeyPress(" ", mode); // space bar
  const reset = useKeyPress("r", "keyboard");

  useFrame(() => {
    if (reset) {
      setResetPosition([true]);
      setClearPath([true]);
    }
    if (mode !== "keyboard" || !vehicleRef.current?.api) return;
    let steering = 0;
    let braking = 0;
    let engine = 0;
    if (left && !right) {
      steering = 0.5;
    } else if (right && !left) {
      steering = -0.5;
    }

    if (forward && !backward) {
      engine = -1500;
    } else if (backward && !forward) {
      engine = 1500;
    }

    if (brake) {
      braking = 50;
    }
    vehicleRef.current.api.applyEngineForce(engine, 2);
    vehicleRef.current.api.applyEngineForce(engine, 3);

    vehicleRef.current.api.setSteeringValue(steering, 0);
    vehicleRef.current.api.setSteeringValue(steering, 1);

    for (let i = 0; i < 4; i++) {
      vehicleRef.current.api.setBrake(braking, i);
    }
    setGauges({
      steering: -steering * 2,
      accel: braking ? -1 : engine ? -engine / 1500 : 0,
    });
  });
};
