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
  player,
  mode,
  setForces,
  setReset,
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
      setReset([true]);
    }
    if (mode !== "keyboard") return;
    let steering = 0;
    let braking = 0;
    let engine = 0;
    if (left && !right) {
      steering = player.maxSteerVal;
    } else if (right && !left) {
      steering = -player.maxSteerVal;
    }

    if (forward && !backward) {
      engine = -player.maxForce;
    } else if (backward && !forward) {
      engine = player.maxForce;
    }

    if (brake) {
      braking = player.maxBrakeForce;
    }
    setForces({ steering, engine, braking });
    setGauges(player.getGuagevals(steering, engine, braking));
  });
};
