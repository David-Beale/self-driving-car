import { useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import PlayerPath from "./Path/PlayerPath";
import playerClass from "./playerClass";
import ClickIndicator from "./ClickIndicator";
import Vehicle from "./Vehicle/Vehicle";
import { useManualControls } from "./useManualControls";

const newPlayer = new playerClass();
const parameters = {
  maxSteerVal: 0.5,
  maxForce: 1000,
  maxBrakeForce: 20,
};
export default function Player({ playerRef, map, selectedVertex }) {
  const [steeringValue, setSteeringValue] = useState(0);
  const [engineForce, setEngineForce] = useState(0);
  const [brakeForce, setBrakeForce] = useState(0);

  useManualControls(
    setSteeringValue,
    setEngineForce,
    setBrakeForce,
    engineForce,
    parameters
  );
  useEffect(() => {
    newPlayer.addMap(map);
  }, [map]);

  useFrame(() => {
    // console.log(playerRef.current.position.z);
    newPlayer.run(playerRef.current.position.x, playerRef.current.position.z);
    // playerRef.current.position.x = newPlayer.currentX;
    // playerRef.current.position.y = newPlayer.currentY;
    // playerRef.current.rotation.y = Math.PI / 2 + newPlayer.angle;
  });

  return (
    <>
      <Vehicle
        playerRef={playerRef}
        position={[147.5, 10, 157.5]}
        rotation={[0, Math.PI, 0]}
        angularVelocity={[-1.49 * Math.PI, 0, 0]}
        steeringValue={steeringValue}
        engineForce={engineForce}
        brakeForce={brakeForce}
      />
      <PlayerPath newPlayer={newPlayer} selectedVertex={selectedVertex} />
      <ClickIndicator selectedVertex={selectedVertex} />
    </>
  );
}
