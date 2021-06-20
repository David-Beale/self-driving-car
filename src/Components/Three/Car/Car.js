import * as THREE from "three";
import * as d3 from "d3-ease";
import pathfinding from "./pathfinding/pathfinder";
import { getCurve } from "./ellipseCurve";
import { path } from "./path";
import { map } from "../graph/graphSetup";
const RADIUS = 2.5;

export default class Car {
  constructor() {
    this.map = map.graphObj;
    this.verticesLookup = map.lookup;
    this.stepCount = 10;
    this.arrayOfSteps = path.slice();
    this.target = new THREE.Vector2();
    this.velocityVector = new THREE.Vector3();
    this.position = new THREE.Vector2();
    this.followCamVector = new THREE.Vector3();
    this.chassisVector = new THREE.Vector3();
    this.slowDown = 0;
    this.reverse = false;
    this.steerVal = 0.875;
    this.maxForce = 1000;
    this.maxBrakeForce = 20;
    this.maxSpeed = 18;
    this.stoppingDistance = 35;
    this.slowDistance = 20;
    this.obstacles = {};
    this.pathDistanceCheck = 2;
    this.maxAngle = (2 * Math.PI) / 8;
    this.anglesToCheck = this.getAnglesToCheck(0);
    this.prevVel = 0;
  }
  run() {
    if (!this.position) return;
    const targetFound = this.getNextTarget();
    if (!targetFound) return this.destinationReached();

    const vecDiff = this.target.sub(this.position);
    const angle = vecDiff.angle();
    this.angleDiff = angle - this.rotation;
    if (this.angleDiff > Math.PI) this.angleDiff -= 2 * Math.PI;
    else if (this.angleDiff < -Math.PI) this.angleDiff += 2 * Math.PI;

    if (this.pathGeometry) this.pathGeometry.setVertices(this.arrayOfSteps);
    const maxSpeed = this.approachingEnd()
      ? 3
      : this.approachingTurn()
      ? 8
      : false;

    if (maxSpeed && this.velocity > maxSpeed) {
      this.slowDown = maxSpeed;
    } else this.slowDown = false;

    const [steering, engine, braking] = this.getForces();

    return {
      forces: { steering, engine, braking },
      gauges: this.getGuagevals(steering, engine, braking),
    };
  }
  approachingEnd() {
    return !this.arrayOfSteps[this.stoppingDistance];
  }
  approachingTurn() {
    const current = this.arrayOfSteps[this.arrayOfSteps.length - 1];
    const target =
      this.arrayOfSteps[this.arrayOfSteps.length - this.slowDistance];
    if (!current || !target) return false;
    return current.x !== target.x && current.z !== target.z;
  }
  getNextTarget() {
    while (true) {
      if (!this.arrayOfSteps.length) return;

      const { x: xTarget, z: zTarget } =
        this.arrayOfSteps[this.arrayOfSteps.length - 1];
      this.target.set(xTarget, -zTarget);

      const distanceCheck =
        this.position.distanceTo(this.target) < this.pathDistanceCheck;
      if (distanceCheck) {
        this.arrayOfSteps.pop();
        this.pathDistanceCheck = 2;
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
  getForces = () => {
    let engine = 0;
    let braking = 0;

    this.obstacleCheck();
    this.obstacles = {};

    let steering = this.angleDiff * this.steerVal;

    if (this.slowDown !== false && this.velocity > this.slowDown) {
      //braking
      braking =
        this.maxBrakeForce * d3.easeCubicInOut(this.velocity / this.maxSpeed);
    } else if (this.slowDown !== false && this.velocity < this.slowDown) {
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
    if (this.reverseObstacle) {
      if (this.velocity > this.prevVel) {
        steering = -steering;
      }
      this.prevVel = this.velocity;
      engine = 300;
    } else if (this.reverse && Math.abs(this.angleDiff) < Math.PI / 3) {
      //cancel reverse
      this.reverse = false;
    } else if (this.reverse || Math.abs(this.angleDiff) > Math.PI / 2) {
      this.reverse = true;
      steering = -steering / 2;
      engine = -engine;
    }

    return [steering, engine, braking];
  };
  obstacleCheck() {
    const obstaclesAngles = Object.keys(this.obstacles);
    if (!obstaclesAngles.length) return;

    let minDistance = this.distanceToClosestObstacle(obstaclesAngles);
    const emergency = this.checkEmergency();
    if (emergency) return;
    if (minDistance < 2.5 || (this.reverseObstacle && minDistance < 6)) {
      this.reverseObstacle = true;
      return;
    }
    if (minDistance === Infinity) {
      this.reverseObstacle = false;
      return;
    }

    this.reverseObstacle = false;
    //increase radius to next target so car can go around obstacles
    this.pathDistanceCheck = 10;

    const angleSpaceRequired = this.findAngleSpaceRequired(minDistance);
    // we want to look slightly beyond the obstruction to make sure there is space
    minDistance += 1;

    let availableAngle = false;
    this.anglesToCheck = this.getAnglesToCheck(this.angleDiff);
    for (let angle of this.anglesToCheck) {
      this.angleDiff = angle;
      const blocked = this.checkIfAngleIsObstructed(
        obstaclesAngles,
        angleSpaceRequired,
        minDistance
      );
      if (blocked === false) {
        availableAngle = true;
        break;
      }
    }
    if (!availableAngle) {
      if (minDistance < 6) {
        this.steering = 0;
        this.reverseObstacle = true;
      }
      this.slowDown = 0;
    } else if (this.velocity > 10) {
      this.slowDown = 10;
    }
  }
  distanceToClosestObstacle(obstaclesAngles) {
    this.leftSide = this.leftBumper = this.rightBumper = this.rightSide = false;
    return obstaclesAngles.reduce((min, angle) => {
      const [distance, obstacle] = this.obstacles[angle];
      if (obstacle && distance < 3) {
        if (angle > Math.PI / 6) this.leftSide = true;
        else if (angle > 0) this.leftBumper = true;
        else if (angle > -Math.PI / 6) this.rightBumper = true;
        else this.rightSide = true;
      }
      if (
        (obstacle || (!obstacle && distance < 6)) &&
        Math.abs(this.angleDiff - angle) < 0.15 &&
        distance < min
      ) {
        return distance;
      }
      return min;
    }, Infinity);
  }

  checkIfAngleIsObstructed(obstaclesAngles, angleSpaceRequired, minDistance) {
    for (let i = 0; i < obstaclesAngles.length; i++) {
      let angle = obstaclesAngles[i];
      const [distance, obstacle] = this.obstacles[angle];
      if (!obstacle && distance > minDistance) continue;
      if (obstacle && distance > minDistance + 4) continue;
      if (Math.abs(this.angleDiff - angle) < angleSpaceRequired) {
        return true;
      }
    }
    return false;
  }
  findAngleSpaceRequired(minDistance) {
    return Math.asin(1.6 / minDistance);
  }
  getAnglesToCheck(start) {
    let anglesToCheck = [];
    //check 45 angles in arc
    const angleDiff = Math.PI / (45 * 1.5);
    for (let i = start - Math.PI / 10; i >= -Math.PI / 3; i -= angleDiff) {
      anglesToCheck.push(i);
    }
    for (
      let i = start - Math.PI / 10 + angleDiff;
      i <= Math.PI / 3;
      i += angleDiff
    ) {
      anglesToCheck.push(i);
    }
    return anglesToCheck;
  }
  checkEmergency() {
    if (this.leftBumper || this.rightBumper) {
      this.reverseObstacle = true;
    }
    if (this.leftBumper && this.rightBumper) {
      this.angleDiff = 0;
      return true;
    }
    if (this.leftBumper) {
      this.angleDiff = -0.75;
      return true;
    }
    if (this.rightBumper) {
      this.angleDiff = 0.75;
      return true;
    }
    if (this.leftSide || this.rightSide) {
      this.angleDiff = 0;
      return true;
    }
  }
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
