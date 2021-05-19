import * as THREE from "three";
import dijkstra from "../graph/helpers/dijkstra";
import { getCurve } from "./ellipseCurve";
const RADIUS = 2.5;

export default class Player {
  constructor() {
    this.angle = 0;
    this.position = {};
    this.stepCount = 10;
    this.counter = 0;
    this.arrayOfSteps = [];
    this.startingCoords = [];
    this.comparePaths = {};
  }
  run() {
    // if (!this.compare && this.pathArray) this.calculateNextStep();
    let flag = true;
    while (flag) {
      if (!this.arrayOfSteps.length) return ["end"];
      const { x: xTarget, z: zTarget } =
        this.arrayOfSteps[this.arrayOfSteps.length - 1];
      const vec1 = new THREE.Vector2(this.position.x, -this.position.z);
      const vec2 = new THREE.Vector2(xTarget, -zTarget);

      flag = vec1.distanceTo(vec2) < 2;

      const vecDiff = vec2.sub(vec1);
      const angle = vecDiff.angle();
      let angleDiff = angle - this.rotation;
      if (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
      else if (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

      if (flag) {
        const nextStep = this.arrayOfSteps.pop();
        this.pathGeometry.setVertices(this.arrayOfSteps);
        if (nextStep.next >= 0) {
          this.vertexCheck();

          const breakingReqired = this.directions
            .slice(nextStep.next + 1, nextStep.next + 3)
            .some((dir) => dir !== 0);
          const approachingEnd = nextStep.next > this.directions.length - 4;
          return [angleDiff, breakingReqired, approachingEnd];
        }
      }
      return [angleDiff];
    }
  }

  addMap(map) {
    this.map = map.graphObj;
    this.arrayOfVertices = Object.keys(map.graphObj);
    this.firstClick(this.map["156A"]);
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
    this.pathGeometry.setVertices(this.arrayOfSteps);
    this.pathIndex = -1;
    console.log(this.pathArray);
    if (!this.nextVertex) {
      this.counter = this.stepCount;
      // this.vertexCheck();
    }
  }

  runPathfinding(a, b) {
    const res = dijkstra(this.map, a, b);
    this.pathArray = res.path;
    this.arrayOfSteps = this.buildPath(this.pathArray);
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
    if (this.stopped) return;

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

  takeNextStep() {
    this.current = this.arrayOfSteps.pop(); //save this value to be used in lerp
    this.currentX = this.current.x;
    this.currentY = this.current.y;
    this.angle = this.current.angle;
  }

  vertexCheck() {
    // if (this.counter !== this.stepCount) return;
    // this.counter = 0;

    this.pathIndex++;
    this.currentVertex = this.map[this.pathArray[this.pathIndex]];
    this.nextVertex = this.map[this.pathArray[this.pathIndex + 1]];

    // if (!this.nextVertex) {
    // this.destinationReached();
    // return true;
    // }

    // this.obstacleCheck();
  }

  destinationReached() {
    this.pathArray = null;
  }

  obstacleCheck() {
    if (this.currentVertex.light === "red") {
      this.stopped = true;
    }
  }

  buildPath(pathArray) {
    this.pathParameters = {
      arrayOfSteps: [],
      currentX: 0,
      currentZ: 0,
      currentAngle: 0,
      directions: [],
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
    this.directions = this.pathParameters.directions;
    return [...reversedArray, ...remainingPath];
  }
  buildFirstSegment(pathArray) {
    const currentVertex = this.map[pathArray[0]];
    const nextVertex = this.map[pathArray[1]];
    this.pathParameters.currentX = currentVertex.x;
    this.pathParameters.currentZ = currentVertex.z;
    this.pathParameters.currentAngle = this.getAngle(
      this.pathParameters.currentX,
      this.pathParameters.currentZ,
      nextVertex.x,
      nextVertex.z
    );

    this.straight(currentVertex, nextVertex, this.stepCount / 2);
  }
  buildMiddleSegments(pathArray) {
    for (let i = 1; i < pathArray.length - 1; i++) {
      const prevVertex = this.map[pathArray[i - 1]];
      const currentVertex = this.map[pathArray[i]];
      const nextVertex = this.map[pathArray[i + 1]];
      if (prevVertex.x !== nextVertex.x && prevVertex.z !== nextVertex.z) {
        this.turn(prevVertex, nextVertex);
      } else {
        this.straight(currentVertex, nextVertex, this.stepCount);
      }
    }
  }
  buildLastSegment(pathArray) {
    const nextVertex = this.map[pathArray[pathArray.length - 1]];
    const currentVertex = this.map[pathArray[pathArray.length - 2]];

    this.straight(currentVertex, nextVertex, this.stepCount / 2);
  }
  turn(prevVertex, nextVertex) {
    const centerX = (prevVertex.x + nextVertex.x) / 2;
    const centerZ = (prevVertex.z + nextVertex.z) / 2;
    const endX =
      this.pathParameters.currentX === centerX ? nextVertex.x : centerX;
    const endZ =
      this.pathParameters.currentZ === centerZ ? nextVertex.z : centerZ;

    const { curve, direction } = getCurve(
      centerX,
      centerZ,
      this.pathParameters.currentX,
      this.pathParameters.currentZ,
      endX,
      endZ
    );
    for (let i = 1; i < curve.length; i++) {
      const { angle, point } = curve[i];
      const object = {
        x: point.x - RADIUS,
        y: 0.5,
        z: -point.y - RADIUS,
        angle,
      };
      if (i === 1) {
        object.next = this.pathParameters.directions.length;
        this.pathParameters.directions.push(direction);
      }
      this.pathParameters.arrayOfSteps.push(object);
      const final = curve[curve.length - 1];
      this.pathParameters.currentX = final.point.x;
      this.pathParameters.currentZ = -final.point.y;
      this.pathParameters.currentAngle = final.angle;
    }
  }
  straight(currentVertex, nextVertex, length) {
    const dx = (nextVertex.x - currentVertex.x) / this.stepCount;
    const dz = (nextVertex.z - currentVertex.z) / this.stepCount;
    for (let i = 0; i < length; i++) {
      this.pathParameters.currentX += dx;
      this.pathParameters.currentZ += dz;

      const object = {
        x: this.pathParameters.currentX - RADIUS,
        y: 0.5,
        z: this.pathParameters.currentZ - RADIUS,
        angle: this.pathParameters.currentAngle,
      };
      if (i === 0) {
        object.next = this.pathParameters.directions.length;
        this.pathParameters.directions.push(0);
      }

      this.pathParameters.arrayOfSteps.push(object);
    }
  }
  getAngle(startX, startZ, nextX, nextZ) {
    let angle;
    switch (true) {
      case startX > nextX:
        angle = Math.PI;
        break;
      case startX < nextX:
        angle = 0;
        break;
      case startZ < nextZ:
        angle = (3 * Math.PI) / 2;
        break;
      case startZ > nextZ:
        angle = Math.PI / 2;
        break;
      default:
        break;
    }
    return +angle.toFixed(3);
  }
}
