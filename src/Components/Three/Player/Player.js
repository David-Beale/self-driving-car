import { useRef } from "react";
import PlayerPath from "./Path/PlayerPath";

import ClickIndicator from "./ClickVisuals";
import Vehicle from "./Vehicle/Vehicle";
import { useSubscriptions } from "./Hooks/useSubscriptions";
import { useControls } from "./Hooks/useControls";

export default function Player({ selectedVertex, mode, player, setGauges }) {
  const playerRef = useRef();

  useSubscriptions(player, playerRef);

  const [forces, reset] = useControls(player, mode, setGauges, selectedVertex);

  return (
    <>
      <Vehicle
        playerRef={playerRef}
        position={[147.5, 10, 157.5]}
        rotation={[0, Math.PI, 0]}
        angularVelocity={[-1.49 * Math.PI, 0, 0]}
        forces={forces}
        reset={reset}
      />
      <PlayerPath player={player} />
      <ClickIndicator selectedVertex={selectedVertex} />
    </>
  );
}
