import Computer from "./computer.js";
export default class ComputerController {
  constructor(context, map) {
    this.map = map.graphObj;
    this.cars = [];
    this.arrayOfVertices = Object.keys(map.graphObj);
    this.context = context;
  }
  run() {
    this.cars.forEach((car) => car.run());
  }
  spawnCars(num) {
    this.clearExistingCars();
    const availablePositions = this.arrayOfVertices.filter(
      (vertex) => !this.map[vertex].occupied
    );
    for (let i = 0; i < num; i++) {
      const randomIndex = Math.floor(Math.random() * availablePositions.length);
      const vertex = availablePositions.splice(randomIndex, 1);
      this.map[vertex].occupied = true;
      const computer = new Computer(this.context, this.map, vertex);
      this.cars.push(computer);
    }
  }
  clearExistingCars() {
    this.cars.forEach((car) => {
      car.currentVertex.occupied = false;
    });
    this.cars = [];
  }
}
