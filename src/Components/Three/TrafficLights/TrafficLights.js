import { useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { trafficLights } from "./trafficLightData";
import TrafficLight from "./TrafficLight";

let counter = 0;

export default function TrafficLights({ verticesMap, enabled }) {
  const [color1, setColor1] = useState("green");
  const [color2, setColor2] = useState("red");

  useEffect(() => {
    if (!enabled) {
      trafficLights.forEach((tile) => {
        const { index, i, j } = tile;
        verticesMap[i][j][index].light = "green";
      });
    }
  }, [enabled, verticesMap]);

  useFrame(() => {
    if (!enabled) return;
    if (counter === 0) {
      setColor1("red");
      setColor2("green");
      trafficLights.forEach((tile) => {
        const { index, i, j, lightSet } = tile;
        verticesMap[i][j][index].light = lightSet === 2 ? "green" : false;
      });
    } else if (counter === 180) {
      setColor1("yellow");
      setColor2("yellow");
    } else if (counter === 200) {
      setColor1("green");
      setColor2("red");
      trafficLights.forEach((tile) => {
        const { index, i, j, lightSet } = tile;
        verticesMap[i][j][index].light = lightSet === 1 ? "green" : false;
      });
    } else if (counter === 380) {
      setColor1("yellow");
      setColor2("yellow");
    }
    counter++;
    if (counter === 400) counter = 0;
  });

  return (
    <>
      {enabled &&
        trafficLights.map((tile) => (
          <TrafficLight
            key={tile.key}
            tile={tile}
            color={tile.lightSet === 1 ? color1 : color2}
          />
        ))}
    </>
  );
}
