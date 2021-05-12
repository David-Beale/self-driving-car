const RADIUS = 25;

export default class Computer {
  constructor(map, vertex, model) {
    this.model = model;
    this.map = map.graphObj;
    this.currentVertex = map.graphObj[vertex];
    this.stopped = true;
    this.counter = 0;
    this.currentX = this.currentVertex.x - RADIUS;
    this.currentY = -this.currentVertex.y + RADIUS;
    this.angle = 0;
    this.masterSpeed = 5;
    this.speed = 5;
  }

  run() {
    this.calculateNextStep();
    if (this.currentVertex) this.currentVertex.internalCounter++;
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
    this.targetX = this.nextVertex.x - RADIUS;
    this.targetY = -this.nextVertex.y + RADIUS;

    if (this.currentX - this.targetX > 0) {
      this.angle = Math.PI;
      this.dx = -this.speed;
      this.dy = 0;
    }
    if (this.currentX - this.targetX < 0) {
      this.angle = 0;
      this.dx = this.speed;
      this.dy = 0;
    }
    if (this.currentY - this.targetY > 0) {
      this.angle = (3 * Math.PI) / 2;
      this.dx = 0;
      this.dy = -this.speed;
    }
    if (this.currentY - this.targetY < 0) {
      this.angle = Math.PI / 2;
      this.dx = 0;
      this.dy = this.speed;
    }
  }
}
