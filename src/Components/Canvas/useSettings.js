import { useRef } from "react";
import { useSelector } from "react-redux";

export const useSettings = () => {
  const settingsRef = useRef({});

  settingsRef.current.trafficLights = useSelector(
    ({ settings }) => settings.trafficLights
  );
  settingsRef.current.cameraLock = useSelector(
    ({ settings }) => settings.cameraLock
  );
  settingsRef.current.computerNumber = useSelector(
    ({ settings }) => settings.computerNumber
  );
  settingsRef.current.collisionBoxes = useSelector(
    ({ settings }) => settings.collisionBoxes
  );
  settingsRef.current.trafficConditions = useSelector(
    ({ settings }) => settings.trafficConditions
  );

  return settingsRef;
};
