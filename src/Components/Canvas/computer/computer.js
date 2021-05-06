import randomCar from "./possibleCars";
const RADIUS = 25;

export default class Computer {
  constructor(context, map, vertex) {
    this.context = context;
    this.map = map;
    this.currentVertex = map[vertex];
    this.computerCar = randomCar();
    this.stopped = true;
    this.counter = 0;
    this.currentX = this.currentVertex.x + RADIUS;
    this.currentY = this.currentVertex.y + RADIUS;

    this.masterSpeed = 5;
    this.speed = 5;
  }

  run() {
    this.calculateNextStep();
    this.drawCar();
  }

  calculateNextStep() {
    if (this.stopped) {
      this.findNewPath();
    }
    if (this.stopped) return;
    this.counter++;
    this.currentX += this.dx;
    this.currentY += this.dy;
    this.checkCounter();
  }

  checkCounter() {
    if (this.counter !== this.stepCount) return;
    this.counter = 0;

    //fix rounding diffs:
    this.currentX = this.targetX;
    this.currentY = this.targetY;
    this.findNewPath();
  }

  findNewPath() {
    if (this.currentVertex.light !== "green") {
      this.stopped = true;
      return;
    }
    const possibleDestinations = this.currentVertex.getEdges();
    const unoccupiedDestinations = possibleDestinations.filter(
      (vertex) => !this.map[vertex].occupied
    );

    if (!unoccupiedDestinations.length) {
      this.stopped = true;
      return;
    }

    const randomIndex = Math.floor(
      Math.random() * unoccupiedDestinations.length
    );

    this.nextVertex = this.map[unoccupiedDestinations[randomIndex]];

    this.speedCheck();

    this.nextDirection();

    this.stopped = false;
    this.currentVertex.occupiedFalse();
    this.currentVertex = this.nextVertex;
    this.currentVertex.occupied = true;
    this.currentVertex.speed = this.speed;
  }
  speedCheck() {
    if (this.nextVertex.roadWorks) {
      this.speed = 1;
    } else {
      this.speed = this.masterSpeed;
    }
    // if (this.nextVertex?.speed < this.speed) {
    //   this.speed = this.nextVertex.speed;
    // }
    this.stepCount = Math.floor(50 / this.speed);
  }

  nextDirection() {
    this.targetX = this.nextVertex.x + RADIUS;
    this.targetY = this.nextVertex.y + RADIUS;

    if (this.currentX - this.targetX > 0) {
      this.carAngle = 0;
      this.dx = -this.speed;
      this.dy = 0;
    }
    if (this.currentX - this.targetX < 0) {
      this.carAngle = 180;
      this.dx = this.speed;
      this.dy = 0;
    }
    if (this.currentY - this.targetY > 0) {
      this.carAngle = 90;
      this.dx = 0;
      this.dy = -this.speed;
    }
    if (this.currentY - this.targetY < 0) {
      this.carAngle = 270;
      this.dx = 0;
      this.dy = this.speed;
    }
  }

  drawCar() {
    const x = this.currentX - RADIUS + 25;
    const y = this.currentY - RADIUS / 2 + 12.5;
    const angle = (this.carAngle * Math.PI) / 180;
    this.context.save();
    this.context.translate(x, y);
    this.context.rotate(angle);
    this.context.drawImage(this.computerCar, -25, -12.5, 50, 25);
    this.context.restore();
  }
}
