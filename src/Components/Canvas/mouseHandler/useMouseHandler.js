import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addStats } from "../../../redux/mode";

export const useMouseHandler = (playerRef, cameraRef, map) => {
  const dispatch = useDispatch();
  const addRoadWorks = useSelector(({ roadWorks }) => roadWorks.addRoadWorks);
  const removeRoadWorks = useSelector(
    ({ roadWorks }) => roadWorks.removeRoadWorks
  );
  const pathfindingMode = useSelector(({ mode }) => mode.mode);
  const clickStart = useRef(null);
  const prevCoords = useRef(null);

  //handle drawer resize
  const handleMouseDown = (e) => {
    const { clientX, clientY } = e;
    clickStart.current = { x: clientX, y: clientY };
    cameraRef.current.prev = { x: clientX, y: clientY };
    prevCoords.current = { x: clientX, y: clientY };
    document.addEventListener("mouseup", handleMouseUp, true);
    document.addEventListener("mousemove", handleMouseMove, true);
  };

  const handleMouseUp = (e) => {
    document.removeEventListener("mouseup", handleMouseUp, true);
    document.removeEventListener("mousemove", handleMouseMove, true);
    const { clientX, clientY } = e;
    const diffX = Math.abs(clickStart.current.x - clientX);
    const diffY = Math.abs(clickStart.current.y - clientY);
    if (diffX + diffY < 5) onClick(e);
  };

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    if (addRoadWorks || removeRoadWorks) {
      handleRoadWorks({ x: clientX, y: clientY });
      return;
    }
    cameraRef.current.drag(clientX, clientY);
  };
  const findVertex = (x, y) => {
    const arrayOfVertices = Object.keys(map.graphObj);
    for (let vertexName of arrayOfVertices) {
      const vertex = map.graphObj[vertexName];
      if (vertex.x === x && vertex.y === y) return vertex;
    }
  };
  const handleRoadWorks = ({ x, y }) => {
    let xCoord = (x + cameraRef.current.x) / cameraRef.current.scale;
    let yCoord = (y + cameraRef.current.y) / cameraRef.current.scale;
    let clickX = Math.floor(xCoord / 50) * 50;
    let clickY = Math.floor(yCoord / 50) * 50;
    const vertex = findVertex(clickX, clickY);
    if (!vertex) return;
    if (addRoadWorks) vertex.roadWorks = true;
    else if (removeRoadWorks) vertex.roadWorks = false;
  };

  const onClick = (e) => {
    const { clientX, clientY } = e;
    if (addRoadWorks || removeRoadWorks) {
      handleRoadWorks({ x: clientX, y: clientY });
      return;
    }
    const res = playerRef.current.click(clientX, clientY);
    if (res) dispatch(addStats({ ...res }));
  };

  const onWheel = (e) => {
    const { clientX, clientY, deltaY } = e;
    cameraRef.current.scroll(clientX, clientY, deltaY);
  };

  useEffect(() => {
    playerRef.current.modeSelect(pathfindingMode);
  }, [playerRef, pathfindingMode]);

  const cursor = addRoadWorks ? "crosshair" : removeRoadWorks ? "no-drop" : "";
  return [handleMouseDown, onWheel, cursor];
};
