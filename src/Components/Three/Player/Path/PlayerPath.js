import { memo, useEffect, useRef } from "react";
import { extend } from "@react-three/fiber";
import * as meshline from "threejs-meshline";
import Line from "./Line";

extend(meshline);

export default memo(function PlayerPath({ player }) {
  const pathRef = useRef();

  useEffect(() => {
    player.pathGeometry = pathRef.current.geometry;
  }, [player]);

  return <Line pathRef={pathRef} vertices={[]} color="lightblue" width={0.3} />;
});
