import React from "react";
import { useCanvas } from "./useCanvas";
import { useGraph } from "./graph/useGraph";
import { useMouseHandler } from "./mouseHandler/useMouseHandler";
import { useWindowResize } from "./useWindowResize";
import { StyledCanvas } from "./CanvasStyle";

export default function Canvas() {
  const [map, verticesMap] = useGraph();
  const { canvasRef, playerRef, cameraRef } = useCanvas(verticesMap, map);
  const [onMouseDown, onWheel, cursor] = useMouseHandler(
    playerRef,
    cameraRef,
    map
  );
  useWindowResize(canvasRef, cameraRef);

  return (
    <StyledCanvas
      ref={canvasRef}
      cursor={cursor}
      onMouseDown={onMouseDown}
      onWheel={onWheel}
    />
  );
}
