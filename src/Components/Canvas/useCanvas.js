import { useRef, useEffect } from "react";

import Camera from "./camera/camera";
import Player from "./player/player";
import ComputerController from "./computer/computerController";
import { reset } from "./generalFunctions/reset";
import { drawMap } from "./map/drawMap";
import { drawTrafficLights } from "./trafficLights/drawTrafficLights";
import { drawCollisionBoxes } from "./collisionBoxes/drawCollisionBoxes";
import { drawRoadWorks } from "./roadWorks/drawRoadWorks";
import { drawTrafficConditions } from "./trafficConditions/drawTrafficConditions";
import { useSettings } from "./useSettings";

export const useCanvas = (verticesMap, map) => {
  const canvasRef = useRef(null);
  const playerRef = useRef(null);
  const cameraRef = useRef(null);
  const computerRef = useRef(null);
  const settingsRef = useSettings();

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    cameraRef.current = new Camera(context, canvas.width, canvas.height);
    const camera = cameraRef.current;
    playerRef.current = new Player(context, map, camera);
    const player = playerRef.current;
    computerRef.current = new ComputerController(context, map);
    const computerController = computerRef.current;
    const settings = settingsRef.current;

    const render = () => {
      window.requestAnimationFrame(render);

      if (settings.cameraLock) camera.followPlayer(player);
      reset(context, camera);
      drawMap(context);
      drawTrafficLights(context, verticesMap, settings.trafficLights);
      drawTrafficConditions(context, map, settings.trafficConditions);
      drawRoadWorks(context, map);
      if (settings.collisionBoxes) drawCollisionBoxes(context, map);
      player.run();
      computerController.run();
    };
    render();
  }, [settingsRef, verticesMap, map]);

  useEffect(() => {
    computerRef.current.spawnCars(settingsRef.current.computerNumber);
  }, [settingsRef, settingsRef.current.computerNumber]);
  return { canvasRef, playerRef, cameraRef };
};
