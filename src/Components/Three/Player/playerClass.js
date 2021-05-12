import dijkstra from "../graph/helpers/dijkstra";
import dijkstraTime from "../graph/helpers/dijkstra-time";
import { getCurve } from "./ellipseCurve";
const RADIUS = 25;
const COLORS = {
  distance: "rgb(58, 94, 211)",
  time: "yellow",
};

export default class Player {
  constructor() {
    this.angle = 0;
    this.stepCount = 10;
    this.counter = 0;
    this.speedCounter = 0;
    this.arrayOfSteps = [];
    this.pathfinding = "distance";
    this.startingCoords = [];
    this.comparePaths = {};
    this.speed = 5;
    this.maxSpeed = 5;
  }
  run() {
    if (!this.compare && this.pathArray) this.calculateNextStep();
    if (this.currentVertex) this.currentVertex.internalCounter++;
  }

  addMap(map) {
    this.map = map.graphObj;
    this.arrayOfVertices = Object.keys(map.graphObj);
  }
  //
  // ─── USER INTERACTIONS ──────────────────────────────────────────────────────────
  //

  click(vertex) {
    return !this.currentVertex
      ? this.firstClick(vertex)
      : this.secondClick(vertex);
  }

  firstClick(vertex) {
    this.currentVertex = vertex;
    this.currentVertex.occupied = true;
    this.currentX = vertex.x - RADIUS;
    this.currentY = -vertex.y + RADIUS;
    this.current = { x: this.currentX, y: this.currentY, angle: 0 };
  }
  secondClick(vertex) {
    const startVertex = this.nextVertex?.value || this.currentVertex.value;

    this.runPathfinding(startVertex, vertex.value);

    if (this.compare) return this.comparePaths;

    this.pathIndex = -1;
    if (!this.nextVertex) {
      this.counter = this.stepCount;
      this.vertexCheck();
    }
  }

  runPathfinding(a, b) {
    switch (this.pathfinding) {
      case "distance": {
        this.pathColor = COLORS.distance;
        const res = dijkstra(this.map, a, b);
        this.pathArray = res.path;
        this.arrayOfSteps = this.buildPath(this.pathArray);
        return;
      }
      case "time": {
        this.pathColor = COLORS.time;
        const res = dijkstraTime(this.map, a, b);
        this.pathArray = res.path;
        this.arrayOfSteps = this.buildPath(this.pathArray);
        return;
      }
      case "compare": {
        const { totalDistance: distanceDist, path: distancePath } = dijkstra(
          this.map,
          a,
          b
        );
        const { totalDistance: timeTime, path: timePath } = dijkstraTime(
          this.map,
          a,
          b
        );
        this.comparePaths.distance = {
          distance: distanceDist,
          path: distancePath,
          time: this.getEstimatedTime(distancePath),
          arrayOfSteps: this.buildPath(distancePath),
        };
        this.comparePaths.time = {
          distance: timePath.length - 1,
          path: timePath,
          time: timeTime,
          arrayOfSteps: this.buildPath(timePath),
        };
        this.compare = true;
        return;
      }
      default:
        return;
    }
  }
  modeSelect(mode) {
    this.pathfinding = mode;
    if (!this.compare) return;
    this.compare = false;
    this.pathColor = COLORS[mode];
    this.pathArray = this.comparePaths[mode].path;
    this.arrayOfSteps = this.comparePaths[mode].arrayOfSteps;
    this.pathIndex = -1;
    if (!this.nextVertex) {
      this.counter = this.stepCount;
      this.vertexCheck();
    }
  }
  getEstimatedTime(path) {
    let time = 0;
    for (let i = 1; i < path.length; i++) {
      const thisVertex = this.map[path[i]];
      time += thisVertex.average;
    }
    return time;
  }
  //
  // ─── AUTOMATIC FUNCTIONS ────────────────────────────────────────────────────────
  //

  calculateNextStep() {
    if (this.stopped) {
      this.checkExistingObstacles();
    }
    if (this.stopped || this.compare) return;

    const speedLimited = this.speedCheck();
    if (speedLimited) {
      this.lerpMovement(speedLimited);
      return;
    }
    this.takeNextStep();
    this.vertexCheck();
  }

  checkExistingObstacles() {
    if (
      !this.nextVertex.occupied &&
      this.currentVertex.light === "green" &&
      !this.compare
    ) {
      this.currentVertex.occupiedFalse();
      this.nextVertex.occupied = true;
      this.nextVertex.speed = this.speed;
      this.stopped = false;
    }
  }
  speedCheck() {
    this.speedCounter += this.speed;
    if (this.speedCounter < this.maxSpeed) return this.speed / this.maxSpeed;
    this.speedCounter = 0;
    this.counter++;
  }
  lerpMovement(speedLimited) {
    const { x: nextX, y: nextY, angle: nextAngle } = this.arrayOfSteps[
      this.arrayOfSteps.length - 1
    ];
    this.currentX += speedLimited * (nextX - this.current.x);
    this.currentY += speedLimited * (nextY - this.current.y);
    this.angle += speedLimited * (nextAngle - this.current.angle);
  }
  takeNextStep() {
    this.current = this.arrayOfSteps.pop(); //save this value to be used in lerp
    this.currentX = this.current.x;
    this.currentY = this.current.y;
    this.angle = this.current.angle;
  }

  vertexCheck() {
    if (this.counter !== this.stepCount) return;
    this.counter = 0;

    this.pathIndex++;
    this.currentVertex = this.map[this.pathArray[this.pathIndex]];
    this.nextVertex = this.map[this.pathArray[this.pathIndex + 1]];

    if (!this.nextVertex) {
      this.destinationReached();
      return true;
    }

    this.setSpeed();
    this.obstacleCheck();
  }

  destinationReached() {
    this.pathArray = null;
  }
  setSpeed() {
    if (this.nextVertex.roadWorks) {
      this.speed = 1;
    } else {
      this.speed = 5;
    }
  }
  obstacleCheck() {
    if (
      !this.nextVertex.occupied &&
      this.currentVertex.light === "green" &&
      !this.compare
    ) {
      this.currentVertex.occupiedFalse();
      this.nextVertex.occupied = true;
      this.nextVertex.speed = this.speed;
    } else {
      this.stopped = true;
    }
  }

  buildPath(pathArray) {
    this.pathParameters = {
      arrayOfSteps: [],
      currentX: 0,
      currentY: 0,
      currentAngle: 0,
    };

    this.buildFirstSegment(pathArray);

    this.buildMiddleSegments(pathArray);

    this.buildLastSegment(pathArray);

    const reversedArray = this.pathParameters.arrayOfSteps.reverse();
    const remainingSteps = this.stepCount - this.counter;
    const remainingPath = this.arrayOfSteps.slice(
      this.arrayOfSteps.length - remainingSteps,
      this.arrayOfSteps.length
    );
    return [...reversedArray, ...remainingPath];
  }
  buildFirstSegment(pathArray) {
    const currentVertex = this.map[pathArray[0]];
    const nextVertex = this.map[pathArray[1]];
    this.pathParameters.currentX = currentVertex.x;
    this.pathParameters.currentY = currentVertex.y;
    this.pathParameters.currentAngle = this.getAngle(
      this.pathParameters.currentX,
      this.pathParameters.currentY,
      nextVertex.x,
      nextVertex.y
    );

    this.straight(nextVertex, currentVertex, this.stepCount / 2);
  }
  buildMiddleSegments(pathArray) {
    for (let i = 1; i < pathArray.length - 1; i++) {
      const prevVertex = this.map[pathArray[i - 1]];
      const currentVertex = this.map[pathArray[i]];
      const nextVertex = this.map[pathArray[i + 1]];
      if (prevVertex.x !== nextVertex.x && prevVertex.y !== nextVertex.y) {
        this.turn(prevVertex, nextVertex);
      } else {
        this.straight(nextVertex, currentVertex, this.stepCount);
      }
    }
  }
  buildLastSegment(pathArray) {
    const nextVertex = this.map[pathArray[pathArray.length - 1]];
    const currentVertex = this.map[pathArray[pathArray.length - 2]];

    this.straight(nextVertex, currentVertex, this.stepCount / 2);
  }
  turn(prevVertex, nextVertex) {
    const centerX = (prevVertex.x + nextVertex.x) / 2;
    const centerY = (prevVertex.y + nextVertex.y) / 2;
    const endX =
      this.pathParameters.currentX === centerX ? nextVertex.x : centerX;
    const endY =
      this.pathParameters.currentY === centerY ? nextVertex.y : centerY;
    const curve = getCurve(
      centerX,
      -centerY,
      this.pathParameters.currentX,
      -this.pathParameters.currentY,
      endX,
      -endY
    );
    for (let j = 1; j < curve.length; j++) {
      const { angle, point } = curve[j];
      this.pathParameters.arrayOfSteps.push({
        x: Math.round(point.x) - RADIUS,
        y: Math.round(point.y) + RADIUS,
        z: 12,
        angle,
      });
      const final = curve[curve.length - 1];
      this.pathParameters.currentX = final.point.x;
      this.pathParameters.currentY = -final.point.y;
      this.pathParameters.currentAngle = final.angle;
    }
  }
  straight(nextVertex, currentVertex, length) {
    const dx = (nextVertex.x - currentVertex.x) / this.stepCount;
    const dy = (nextVertex.y - currentVertex.y) / this.stepCount;
    for (let i = 0; i < length; i++) {
      this.pathParameters.currentX += dx;
      this.pathParameters.currentY += dy;
      this.pathParameters.arrayOfSteps.push({
        x: this.pathParameters.currentX - RADIUS,
        y: -this.pathParameters.currentY + RADIUS,
        z: 12,
        angle: this.pathParameters.currentAngle,
      });
    }
  }
  getAngle(startX, startY, nextX, nextY) {
    let angle;
    switch (true) {
      case startX > nextX:
        angle = Math.PI;
        break;
      case startX < nextX:
        angle = 0;
        break;
      case startY < nextY:
        angle = (3 * Math.PI) / 2;
        break;
      case startY > nextY:
        angle = Math.PI / 2;
        break;
      default:
        break;
    }
    return +angle.toFixed(3);
  }
}
