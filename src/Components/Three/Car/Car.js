import * as THREE from "three";
import * as d3 from "d3-ease";
import pathfinding from "./pathfinding/pathfinder";
import { getCurve } from "./ellipseCurve";
import { path } from "./path";
const RADIUS = 2.5;

export default class Car {
  constructor(map) {
    this.map = map.graphObj;
    this.verticesLookup = map.lookup;
    this.stepCount = 10;
    this.arrayOfSteps = path.slice();
    this.target = new THREE.Vector2();
    this.velocityVector = new THREE.Vector3();
    this.position = new THREE.Vector2();
    this.followCamVector = new THREE.Vector3();
    this.slowDown = 0;
    this.reverse = false;
    this.steerVal = 0.875;
    this.maxForce = 1000;
    this.maxBrakeForce = 20;
    this.maxSpeed = 18;
    this.stoppingDistance = 35;
    this.slowDistance = 20;
  }
  run() {
    if (!this.position) return;
    const targetFound = this.getNextTarget();
    if (!targetFound) return this.destinationReached();

    const vecDiff = this.target.sub(this.position);
    const angle = vecDiff.angle();
    let angleDiff = angle - this.rotation;
    if (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
    else if (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

    if (this.pathGeometry) this.pathGeometry.setVertices(this.arrayOfSteps);
    const maxSpeed = this.approachingEnd()
      ? 3
      : this.approachingTurn()
      ? 8
      : false;

    if (maxSpeed && this.velocity > maxSpeed) this.slowDown = maxSpeed;

    const [steering, engine, braking] = this.getForces(angleDiff);

    return {
      forces: { steering, engine, braking },
      gauges: this.getGuagevals(steering, engine, braking),
    };
  }
  approachingEnd() {
    return !this.arrayOfSteps[this.stoppingDistance];
  }
  approachingTurn() {
    return this.arrayOfSteps[this.arrayOfSteps.length - this.slowDistance]
      ?.turn;
  }
  getNextTarget() {
    while (true) {
      if (!this.arrayOfSteps.length) return;

      const { x: xTarget, z: zTarget } =
        this.arrayOfSteps[this.arrayOfSteps.length - 1];
      this.target.set(xTarget, -zTarget);

      const distanceCheck = this.position.distanceTo(this.target) < 2;
      if (distanceCheck) {
        this.arrayOfSteps.pop();
      } else {
        return true;
      }
    }
  }

  destinationReached = () => {
    return {
      forces: { steering: 0, engine: 0, braking: 25 },
      gauges: { steering: 0, accel: 0 },
    };
  };
  getForces = (angleDiff) => {
    let engine = 0;
    let braking = 0;
    let steering = angleDiff * this.steerVal;

    if (this.slowDown && this.velocity > this.slowDown) {
      //braking
      braking =
        this.maxBrakeForce * d3.easeCubicInOut(this.velocity / this.maxSpeed);
    } else if (this.slowDown && this.velocity < this.slowDown) {
      //cancel braking
      this.slowDown = false;
    } else {
      //accelerating
      engine =
        -this.maxForce *
        d3.easeCubicOut(
          Math.max(this.maxSpeed - this.velocity, 0) / this.maxSpeed
        );
    }

    //check if reversing required
    if (this.reverse && Math.abs(angleDiff) < Math.PI / 3) {
      //cancel reverse
      this.reverse = false;
    } else if (this.reverse || Math.abs(angleDiff) > Math.PI / 2) {
      this.reverse = true;
      steering = -steering / 2;
      engine = -engine;
    }

    return [steering, engine, braking];
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
  updateDNA(DNA) {
    this.steerVal = DNA.steerVal;
    this.maxForce = DNA.maxForce;
    this.maxBrakeForce = DNA.maxBrakeForce;
    this.maxSpeed = DNA.maxSpeed;
    this.stoppingDistance = DNA.stoppingDistance;
    this.slowDistance = DNA.slowDistance;
    this.arrayOfSteps = path.slice();
  }
}
