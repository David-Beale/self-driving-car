import { useEffect } from "react";

export const useSubscriptions = (player, playerRef) => {
  useEffect(() => {
    playerRef.current.api.position.subscribe((p) => {
      player.position.set(p[0], -p[2]);
    });
    playerRef.current.api.velocity.subscribe((v) => {
      player.velocityVector.set(...v);
      player.velocity = player.velocityVector.length();
    });
    playerRef.current.api.rotation.subscribe((r) => {
      player.rotation = r[1] - Math.PI / 2;
    });
  }, [playerRef, player]);
};
