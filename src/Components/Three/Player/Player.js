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
}) {
  const playerRef = useRef();
  const followCameraRef = useRef();

  useSubscriptions(player, playerRef);

  const [forces, reset] = useControls(
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
        followCameraRef={followCameraRef}
        position={[147.5, 4, 192.5]}
        angularVelocity={[0, 0, 0]}
        rotation={[0, Math.PI, 0]}
        forces={forces}
        reset={reset}
      />
      <PlayerPath player={player} />
      <ClickIndicator selectedVertex={selectedVertex} />
    </>
  );
}
