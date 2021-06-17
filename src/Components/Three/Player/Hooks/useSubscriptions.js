import { useEffect } from "react";

export const useSubscriptions = (player, chassisRef) => {
  useEffect(() => {
    chassisRef.current.api.position.subscribe((p) => {
      player.position.set(p[0], -p[2]);
    });
    chassisRef.current.api.velocity.subscribe((v) => {
      player.velocityVector.set(...v);
      player.velocity = player.velocityVector.length();
    });
    chassisRef.current.api.rotation.subscribe((r) => {
      player.rotation = r[1] - Math.PI / 2;
    });
  }, [chassisRef, player]);
};
