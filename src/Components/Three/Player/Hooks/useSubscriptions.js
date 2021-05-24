import { useEffect } from "react";
import * as THREE from "three";

const velocityVector = new THREE.Vector3();
const positionVector = new THREE.Vector2();

export const useSubscriptions = (player, playerRef) => {
  useEffect(() => {
    playerRef.current.api.position.subscribe((p) => {
      positionVector.set(p[0], -p[2]);
      player.position = positionVector;
    });
    playerRef.current.api.velocity.subscribe((v) => {
      velocityVector.set(...v);
      player.velocity = velocityVector.length();
    });
    playerRef.current.api.rotation.subscribe((r) => {
      player.rotation = r[1] - Math.PI / 2;
    });
  }, [playerRef, player]);
};
