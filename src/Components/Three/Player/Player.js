import { useEffect, useRef } from "react";
import PlayerPath from "./Path/PlayerPath";

import ClickIndicator from "./ClickVisuals";
import Vehicle from "./Vehicle/Vehicle";
import { useSubscriptions } from "./Hooks/useSubscriptions";
import { useControls } from "./Hooks/useControls";

export default function Player({
  selectedVertex,
  mode,
  player,
  setGauges,
  currentDNA,
  time,
}) {
  const playerRef = useRef();
  const followCameraRef = useRef();
  const vehicleRef = useRef();

  useSubscriptions(player, playerRef);

  useControls(
    playerRef,
    vehicleRef,
    player,
    mode,
    setGauges,
    selectedVertex,
    currentDNA
  );

  useEffect(() => {
    player.followCam = followCameraRef.current;
  }, [player, followCameraRef]);

  return (
    <>
      <Vehicle
        playerRef={playerRef}
        vehicleRef={vehicleRef}
        followCameraRef={followCameraRef}
        position={[147.5, 4, 192.5]}
        angularVelocity={[0, 0, 0]}
        rotation={[0, Math.PI, 0]}
        time={time}
      />
      <PlayerPath player={player} />
      <ClickIndicator selectedVertex={selectedVertex} />
    </>
  );
}
