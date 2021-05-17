import { useEffect, useRef, useState } from "react";
import { extend, useFrame } from "@react-three/fiber";
import * as meshline from "threejs-meshline";
import Line from "./Line";

extend(meshline);

const COLORS = {
  distance: "lightblue",
  time: "yellow",
};

export default function PlayerPath({
  newPlayer,
  pathfindingMode,
  selectedVertex,
  dispatchStats,
}) {
  const pathRef = useRef();
  const pathRefDistance = useRef();
  const pathRefTime = useRef();

  const [color, setColor] = useState("lightblue");
  const [compare, setCompare] = useState(false);

  useEffect(() => {
    newPlayer.modeSelect(pathfindingMode);
    setColor(COLORS[pathfindingMode]);
    if (pathfindingMode !== "compare") setCompare(false);
  }, [pathfindingMode, newPlayer]);

  useEffect(() => {
    if (!selectedVertex) return;
    const res = newPlayer.click(selectedVertex);
    if (res) {
      setCompare({
        distance: res.distance.arrayOfSteps,
        time: res.time.arrayOfSteps,
      });
      dispatchStats(res);
    } else setCompare(false);
  }, [newPlayer, selectedVertex, dispatchStats]);

  useFrame(() => {
    if (compare) return;
    if (newPlayer.arrayOfSteps.length)
      pathRef.current.geometry.setVertices(newPlayer.arrayOfSteps);
  });

  return (
    <>
      {compare ? (
        <>
          <Line
            pathRef={pathRefDistance}
            vertices={compare.distance}
            color={COLORS["distance"]}
            width={0.5}
          />
          <Line
            pathRef={pathRefTime}
            vertices={compare.time}
            color={COLORS["time"]}
            width={0.2}
          />
        </>
      ) : (
        <Line pathRef={pathRef} vertices={[]} color={color} width={0.3} />
      )}
    </>
  );
}
