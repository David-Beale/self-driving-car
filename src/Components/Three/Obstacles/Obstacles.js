import Obstacle from "./Obstacle";
import Wall from "./Wall";
import { walls } from "./walls";

export default function Obstacles({ obstacles }) {
  return (
    <>
      {obstacles.map((obstacle) => (
        <Obstacle key={obstacle.id} obstacle={obstacle} />
      ))}
      {walls.map((wall, index) => (
        <Wall key={index} wall={wall} />
      ))}
    </>
  );
}
