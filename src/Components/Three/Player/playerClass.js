import * as THREE from "three";
import dijkstra from "../graph/helpers/dijkstra";
import { getCurve } from "./ellipseCurve";
import { path } from "./path";
const RADIUS = 2.5;

export default class Player {
  constructor(map) {
    this.map = map.graphObj;
    this.arrayOfVertices = Object.keys(map.graphObj);
    this.stepCount = 10;
    this.arrayOfSteps = path;
    // this.arrayOfSteps = [];
    this.target = new THREE.Vector2();
  }
  run() {
    if (!this.position) return [];
    const targetFound = this.getNextTarget();
    if (!targetFound) return ["end"];

    const vecDiff = this.target.sub(this.position);
    const angle = vecDiff.angle();
    let angleDiff = angle - this.rotation;
    if (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
    else if (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

    this.pathGeometry.setVertices(this.arrayOfSteps);
    const maxSpeed = this.apprachingEnd()
      ? 3
      : this.apprachingTurn()
      ? 8
      : false;
    return [angleDiff, maxSpeed];
  }
  apprachingEnd() {
    return !this.arrayOfSteps[35];
  }
  apprachingTurn() {
    return this.arrayOfSteps[this.arrayOfSteps.length - 20]?.turn;
  }
  getNextTarget() {
    if (!this.arrayOfSteps.length) return;

    const { x: xTarget, z: zTarget } =
      this.arrayOfSteps[this.arrayOfSteps.length - 1];
    this.target.set(xTarget, -zTarget);

    const distanceCheck = this.position.distanceTo(this.target) < 2;
    if (distanceCheck) this.arrayOfSteps.pop();
    return true;
  }

  //
  // ─── USER INTERACTIONS ──────────────────────────────────────────────────────────
  //

  click(target) {
    const start = this.findVertex();
    if (start === target.value) return;
    this.runPathfinding(start, target.value);
    this.pathGeometry.setVertices(this.arrayOfSteps);
    // console.log(JSON.stringify(this.arrayOfSteps));
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
    };

    this.buildFirstSegment(pathArray);

    this.buildMiddleSegments(pathArray);

    this.buildLastSegment(pathArray);

    return this.pathParameters.arrayOfSteps.reverse();
  }
  buildFirstSegment(pathArray) {
    const currentVertex = this.map[pathArray[0]];
    const nextVertex = this.map[pathArray[1]];
    this.pathParameters.currentX = currentVertex.x;
    this.pathParameters.currentZ = currentVertex.z;
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

    const curve = getCurve(
      centerX,
      centerZ,
      this.pathParameters.currentX,
      this.pathParameters.currentZ,
      endX,
      endZ
    );
    for (let i = 1; i < curve.length; i++) {
      const point = curve[i];
      const object = {
        x: point.x - RADIUS,
        y: 0.5,
        z: -point.y - RADIUS,
      };
      if (i === 1) object.turn = true;

      this.pathParameters.arrayOfSteps.push(object);
      const final = curve[curve.length - 1];
      this.pathParameters.currentX = final.x;
      this.pathParameters.currentZ = -final.y;
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
      };

      this.pathParameters.arrayOfSteps.push(object);
    }
  }
}
