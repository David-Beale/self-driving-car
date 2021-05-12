import { useEffect, useRef, useState } from "react";

import ComputerClass from "./computerClass";
import ComputerCar from "./ComputerCar";

export default function ComputerControllers({ map, number }) {
  const [cars, setCars] = useState([]);
  const prevCars = useRef([]);

  useEffect(() => {
    const models = [
      "Car01_1_Carbon",
      "Car03_2_Racing",
      "Car03_1_Police",
      "Car02_3_Ambulance",
      "Car01_2_Taxi",
    ];

    prevCars.current.forEach((car) => {
      car.currentVertex.occupied = false;
    });

    const availablePositions = map.array.filter(
      (vertex) => !map.graphObj[vertex].occupied
    );
    const newCars = [];
    for (let i = 0; i < number; i++) {
      const randomIndex = Math.floor(Math.random() * availablePositions.length);
      const vertex = availablePositions.splice(randomIndex, 1);
      map.graphObj[vertex].occupied = true;
      const model = models[Math.floor(Math.random() * models.length)];
      const computer = new ComputerClass(map, vertex, model);
      newCars.push(computer);
    }
    prevCars.current = newCars;
    setCars(newCars);
  }, [map, number]);

  return (
    <>
      {cars.map((car, index) => (
        <ComputerCar key={index} car={car} />
      ))}
    </>
  );
}
