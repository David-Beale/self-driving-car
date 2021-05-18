import { memo, useEffect, useRef } from "react";
import { extend } from "@react-three/fiber";
import * as meshline from "threejs-meshline";
import Line from "./Line";

extend(meshline);

export default memo(function PlayerPath({ newPlayer, selectedVertex }) {
  const pathRef = useRef();

  useEffect(() => {
    if (!selectedVertex) return;
    newPlayer.click(selectedVertex);
  }, [newPlayer, selectedVertex]);

  useEffect(() => {
    newPlayer.pathGeometry = pathRef.current.geometry;
  }, [newPlayer]);

  return <Line pathRef={pathRef} vertices={[]} color="lightblue" width={0.3} />;
});
