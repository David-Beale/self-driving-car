import * as THREE from "three";
import * as d3 from "d3-ease";
import { path } from "../../Car/path";

export default class GhostClass {
  constructor() {
    this.arrayOfSteps = path.slice();
    this.target = new THREE.Vector2();
    this.velocityVector = new THREE.Vector3();
    this.position = new THREE.Vector2();
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

    const maxSpeed = this.approachingEnd()
      ? 3
      : this.approachingTurn()
      ? 8
      : false;

    if (maxSpeed && this.velocity > maxSpeed) this.slowDown = maxSpeed;

    const [steering, engine, braking] = this.getForces(angleDiff);

    return {
      forces: { steering, engine, braking },
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
