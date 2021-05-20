import * as THREE from "three";
import dijkstra from "../graph/helpers/dijkstra";
import { getCurve } from "./ellipseCurve";
const RADIUS = 2.5;

export default class Player {
  constructor() {
    this.stepCount = 10;
    this.arrayOfSteps = [];
    this.target = new THREE.Vector2();
  }
  run() {
    let flag = true;
    while (flag) {
      if (!this.arrayOfSteps.length) return ["end"];
      const { x: xTarget, z: zTarget } =
        this.arrayOfSteps[this.arrayOfSteps.length - 1];
      this.target.set(xTarget, -zTarget);

      flag = this.position.distanceTo(this.target) < 2;

      const vecDiff = this.target.sub(this.position);
      const angle = vecDiff.angle();
      let angleDiff = angle - this.rotation;
      if (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
      else if (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

      if (flag) {
        const nextStep = this.arrayOfSteps.pop();
        this.pathGeometry.setVertices(this.arrayOfSteps);
        if (nextStep.next >= 0) {
          //new vertex reached
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
  }
  //
  // ─── USER INTERACTIONS ──────────────────────────────────────────────────────────
  //

  click(target) {
    const start = this.findVertex();
    if (start === target.value) return;
    this.runPathfinding(start, target.value);
    this.pathGeometry.setVertices(this.arrayOfSteps);
  }

  findVertex() {
    const targetX = 5 * Math.ceil(this.position.x / 5);
    const targetZ = 5 * Math.ceil(-this.position.y / 5);
    for (let vertex of this.arrayOfVertices) {
      if (this.map[vertex].x === targetX && this.map[vertex].z === targetZ)
        return vertex;
    }
  }
  runPathfinding(a, b) {
    const res = dijkstra(this.map, a, b);
    this.arrayOfSteps = this.buildPath(res.path);
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

    this.directions = this.pathParameters.directions;
    return this.pathParameters.arrayOfSteps.reverse();
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
