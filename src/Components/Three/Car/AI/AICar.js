import * as THREE from "three";
import pathfinding from "../pathfinding/pathfinder";
import { getCurve } from "../ellipseCurve";
import { path } from "../path";
import { map } from "../../graph/graphSetup";
import { recordBrain } from "./recordBrain";
import NeuralNetwork from "./nn";
const RADIUS = 2.5;

export default class AICar {
  constructor() {
    this.stepCount = 10;
    this.map = map.graphObj;
    this.verticesLookup = map.lookup;
    this.arrayOfSteps = path.slice();
    this.target = new THREE.Vector2();
    this.velocityVector = new THREE.Vector3();
    this.position = new THREE.Vector2();
    this.followCamVector = new THREE.Vector3();
    this.distanceToTurn = 0;
    this.outputs = null;
    this.pathDistanceCheck = 2;
    this.brain = NeuralNetwork.loadJSON(recordBrain);
  }
  run() {
    if (!this.position) return;
    // console.log(this.position);
    const targetFound = this.getNextTarget();
    if (!targetFound) return this.destinationReached();

    const angleDiff = this.getAngleDiff();

    if (this.pathGeometry) this.pathGeometry.setVertices(this.arrayOfSteps);

    const distanceToEnd = Math.min(this.arrayOfSteps.length, 50);

    this.inputs = [
      angleDiff / Math.PI,
      this.velocity / 30,
      1 - distanceToEnd / 50,
      1 - this.distanceToTurn / 50,
    ];
    this.outputs = this.brain.predict(this.inputs);
    const { steering, engine, braking } = this.convertOutputs(this.outputs);

    return {
      forces: { steering, engine, braking },
      gauges: this.getGuagevals(steering, engine, braking),
    };
  }
  getAngleDiff() {
    const vecDiff = this.target.sub(this.position);
    const angleTotarget = vecDiff.angle();
    let angleDiff = angleTotarget - this.rotation;

    if (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
    else if (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
    return angleDiff;
  }

  getNextTarget() {
    while (true) {
      if (!this.arrayOfSteps.length) return;
      if (this.distanceToTurn <= 0) this.getDistanceToTurn();
      const { x: xTarget, z: zTarget } =
        this.arrayOfSteps[this.arrayOfSteps.length - 1];
      this.target.set(xTarget, -zTarget);

      const distanceCheck =
        this.position.distanceTo(this.target) < this.pathDistanceCheck;
      if (distanceCheck) {
        this.distanceToTurn--;
        this.arrayOfSteps.pop();
      } else {
        return true;
      }
    }
  }

  getDistanceToTurn() {
    const currentTarget = this.arrayOfSteps[this.arrayOfSteps.length - 1];
    if (!currentTarget) {
      this.distanceToTurn = 0;
      return;
    }
    let counter = 0;
    for (
      let i = this.arrayOfSteps.length - 1;
      i >= this.arrayOfSteps.length - 50;
      i--
    ) {
      counter++;
      const nextTarget = this.arrayOfSteps[i];
      if (!nextTarget) break;
      if (
        currentTarget.x !== nextTarget.x &&
        currentTarget.z !== nextTarget.z
      ) {
        this.distanceToTurn = counter;
        return;
      }
    }
    this.distanceToTurn = Math.min(this.arrayOfSteps.length, 50);
  }

  convertOutputs(outputs) {
    let [normSteering, force] = outputs;
    const steering = 2 * (normSteering - 0.5);
    const engine = force > 0.5 ? (force - 0.5) * -3000 : 0;
    const braking = force < 0.5 ? (0.5 - force) * 100 : 0;
    return { steering, engine, braking };
  }

  destinationReached = () => {
    return {
      forces: { steering: 0, engine: 0, braking: 25 },
      gauges: { steering: 0, accel: 0 },
    };
  };

  getGuagevals(steering, engine, braking) {
    const convertSteering = (steering) => {
      if (!steering) return 0;
      if (steering < -1) return 1;
      if (steering > 1) return -1;
      return -steering;
    };
    const getAccel = (engine, braking) => {
      if (braking) return -braking / 25;
      return -engine / 1500;
    };
    return {
      steering: convertSteering(steering),
      accel: getAccel(engine, braking),
    };
  }

  //
  // ─── USER INTERACTIONS ──────────────────────────────────────────────────────────
  //
  clearPath() {
    this.arrayOfSteps = [];
    this.pathGeometry.setVertices(this.arrayOfSteps);
  }
  click(target) {
    const start = this.findVertex(this.position.x, -this.position.y);
    const end = this.findVertex(target.x, target.z);
    if (!start || !end || start === end) return;
    this.runPathfinding(start, end);
    this.pathGeometry.setVertices(this.arrayOfSteps);
    this.slowDown = false;
  }

  findVertex(mapX, mapZ) {
    const x = (mapX - 5) / 10;
    const z = (mapZ - 5) / 10;
    const i = Math.ceil(z);
    const j = Math.ceil(x);
    const vertices = this.verticesLookup[i][j];
    if (!vertices) return;

    const remainderX = x % 1;
    const remainderZ = z % 1;
    switch (true) {
      case remainderX <= 0.5 && remainderZ <= 0.5:
        return vertices[0].value;
      case remainderX > 0.5 && remainderZ <= 0.5:
        return vertices[1].value;
      case remainderX <= 0.5 && remainderZ > 0.5:
        return vertices[2].value;
      case remainderX > 0.5 && remainderZ > 0.5:
        return vertices[3].value;
      default:
        break;
    }
  }
  runPathfinding(a, b) {
    const res = pathfinding(this.map, a, b);
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
