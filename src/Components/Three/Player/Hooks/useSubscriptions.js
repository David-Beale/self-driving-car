import { useEffect } from "react";

export const useSubscriptions = (playerRef, chassisRef) => {
  useEffect(() => {
    chassisRef.current.api.position.subscribe((p) => {
      playerRef.current.position.set(p[0], -p[2]);
    });
    chassisRef.current.api.velocity.subscribe((v) => {
      playerRef.current.velocityVector.set(...v);
      playerRef.current.velocity = playerRef.current.velocityVector.length();
    });
    chassisRef.current.api.rotation.subscribe((r) => {
      playerRef.current.rotation = r[1] - Math.PI / 2;
    });
  }, [chassisRef, playerRef]);
};
