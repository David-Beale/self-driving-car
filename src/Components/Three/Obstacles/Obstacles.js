import Obstacle from "./Obstalce";

export default function Obstacles({ obstacles }) {
  return (
    <>
      {obstacles.map((obstacle) => (
        <Obstacle key={obstacle.id} obstacle={obstacle} />
      ))}
    </>
  );
}
