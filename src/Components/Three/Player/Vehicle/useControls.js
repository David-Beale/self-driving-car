import { useFrame } from "@react-three/fiber";
import { useEffect, useState } from "react";

function useKeyPress(target) {
  const [keyPressed, setKeyPressed] = useState(false);

  // If pressed key is our target key then set to true
  const downHandler = ({ key }) =>
    key === target ? setKeyPressed(true) : null;
  const upHandler = ({ key }) => (key === target ? setKeyPressed(false) : null);
  useEffect(() => {
    // Add event listeners
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return keyPressed;
}

export const useControls = (api, wheels) => {
  const forward = useKeyPress("w");
  const backward = useKeyPress("s");
  const left = useKeyPress("a");
  const right = useKeyPress("d");
  const brake = useKeyPress(" "); // space bar

  const [steeringValue, setSteeringValue] = useState(0);
  const [engineForce, setEngineForce] = useState(0);
  const [brakeForce, setBrakeForce] = useState(0);

  const maxSteerVal = 0.5;
  const maxForce = 1000;
  const maxBrakeForce = 20;

  useFrame(() => {
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
  useEffect(() => {
    api.applyEngineForce(engineForce, 2);
    api.applyEngineForce(engineForce, 3);
  }, [engineForce, api]);
  useEffect(() => {
    api.setSteeringValue(steeringValue, 0);
    api.setSteeringValue(steeringValue, 1);
  }, [steeringValue, api]);
  useEffect(() => {
    for (let i = 0; i < 4; i++) {
      api.setBrake(brakeForce, i);
    }
  }, [brakeForce, api, wheels]);
};
