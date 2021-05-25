/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */
importScripts("d3-ease.v2.min.js");
importScripts("three.min.js");
importScripts("cannon.min.js");
importScripts("path.js");
importScripts("roads.js");

class Car {
  constructor() {
    this.arrayOfSteps = path.slice();
    this.target = new THREE.Vector2();
    this.position2d = new THREE.Vector2();
    this.rotationVector = new THREE.Vector3();
    this.slowDown = 0;
    this.reverse = false;
    this.velocity = 0;
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

    const vecDiff = this.target.sub(this.position2d);
    const angle = vecDiff.angle();
    this.quaternion.toEuler(this.rotationVector);
    this.rotation = this.rotationVector.y - Math.PI / 2;
    let angleDiff = angle - this.rotation;
    if (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
    else if (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

    const maxSpeed = this.approachingEnd()
      ? 3
      : this.approachingTurn()
      ? 8
      : false;

    this.velocity = this.velocityVector.length();
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
    if (!this.arrayOfSteps.length) return;

    const { x: xTarget, z: zTarget } =
      this.arrayOfSteps[this.arrayOfSteps.length - 1];
    this.target.set(xTarget, -zTarget);
    this.position2d.set(this.position.x, -this.position.z);

    const distanceCheck = this.position2d.distanceTo(this.target) < 2;
    if (distanceCheck) this.arrayOfSteps.pop();
    return true;
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
}

class Game {
  constructor() {
    this.car = new Car();
    this.fixedTimeStep = 1.0 / 60.0;
    this.initPhysics();
    this.endPoint = new THREE.Vector3(147.5, 0.5, 7.5);
  }

  initPhysics() {
    this.physics = {};

    const world = new CANNON.World();
    this.world = world;

    world.broadphase = new CANNON.SAPBroadphase(world);
    world.gravity.set(0, -10, 0);
    world.solver.tolerance = 0.001;
    world.solver.iterations = 5;
    world.broadphase.axisIndex = 0;
    world.defaultContactMaterial.contactEquationStiffness = 1e6;

    roads.forEach((road) => {
      var groundShape = new CANNON.Box(new CANNON.Vec3(5, 5, 0.01));
      var groundBody = new CANNON.Body({
        mass: 0,
      });
      groundBody.addShape(groundShape);
      groundBody.position.set(road.x, 0, road.z);
      groundBody.quaternion.setFromAxisAngle(
        new CANNON.Vec3(1, 0, 0),
        -Math.PI / 2
      );

      world.add(groundBody);
    });

    const chassisShape = new CANNON.Box(new CANNON.Vec3(0.85, 0.5, 2));
    const chassisBody = new CANNON.Body({
      mass: 500,
    });
    chassisBody.addShape(chassisShape);
    chassisBody.position.set(147.5, 4, 157.5);
    chassisBody.angularVelocity.set(0, 0, 0);
    chassisBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI);
    this.chassisBody = chassisBody;

    const options = {
      radius: 0.3,
      directionLocal: new CANNON.Vec3(0, -1, 0),
      suspensionStiffness: 30,
      suspensionRestLength: 0.3,
      maxSuspensionForce: 1e4,
      maxSuspensionTravel: 0.3,
      dampingRelaxation: 2.3,
      dampingCompression: 4.4,
      frictionSlip: 5,
      rollInfluence: 0.01,
      axleLocal: new CANNON.Vec3(-1, 0, 0),
      chassisConnectionPointLocal: new CANNON.Vec3(1, 1, 0),
      useCustomSlidingRotationalSpeed: true,
      customSlidingRotationalSpeed: -30,
    };

    // Create the vehicle
    const vehicle = new CANNON.RaycastVehicle({
      chassisBody: chassisBody,
      indexRightAxis: 0,
      indexUpAxis: 1,
      indexForwardAxis: 2,
    });

    this.car.position = chassisBody.position;
    this.car.velocityVector = chassisBody.velocity;
    this.car.quaternion = chassisBody.quaternion;
    this.chassisBody = chassisBody;

    const chassisWidth = 1.6;
    const chassisHeight = -0.04; // ground clearance
    const chassisFront = 1.3;
    const chassisBack = -1.35;

    options.chassisConnectionPointLocal.set(
      -chassisWidth / 2,
      chassisHeight,
      chassisFront
    );
    vehicle.addWheel(options);

    options.chassisConnectionPointLocal.set(
      chassisWidth / 2,
      chassisHeight,
      chassisFront
    );
    vehicle.addWheel(options);

    options.chassisConnectionPointLocal.set(
      -chassisWidth / 2,
      chassisHeight,
      chassisBack
    );
    vehicle.addWheel(options);

    options.chassisConnectionPointLocal.set(
      chassisWidth / 2,
      chassisHeight,
      chassisBack
    );
    vehicle.addWheel(options);

    vehicle.addToWorld(world);
    const wheelBodies = [];

    this.cylinderShape = vehicle.wheelInfos.forEach(function (wheel) {
      const cylinderShape = new CANNON.Cylinder(
        wheel.radius,
        wheel.radius,
        wheel.radius / 2,
        20
      );
      const wheelBody = new CANNON.Body({
        mass: 1,
        type: "KINEMATIC",
        collisionFilterGroup: 0,
      });
      wheelBody.addShape(cylinderShape);
      wheelBodies.push(wheelBody);
    });

    this.vehicle = vehicle;
  }
  getFitness() {
    return 1 / (1 + this.chassisBody.position.distanceTo(this.endPoint));
  }
  resetCar() {
    this.car.arrayOfSteps = path.slice();
    this.chassisBody.position.set(147.5, 4, 157.5);
    this.chassisBody.velocity.set(0, 0, 0);
    this.chassisBody.angularVelocity.set(0, 0, 0);
    this.chassisBody.quaternion.setFromEuler(0, Math.PI, 0);
  }
  applyForces(forces) {
    const { steering, engine, braking } = forces;
    this.vehicle.applyEngineForce(engine, 2);
    this.vehicle.applyEngineForce(engine, 3);

    this.vehicle.setSteeringValue(steering, 0);
    this.vehicle.setSteeringValue(steering, 1);

    for (let i = 0; i < 4; i++) {
      this.vehicle.setBrake(braking, i);
    }
  }

  simulate() {
    this.resetCar();
    this.counter = 0;
    while (this.counter < 1500) {
      this.counter++;
      this.world.step(this.fixedTimeStep);
      const res = this.car.run();
      if (res) {
        this.applyForces(res.forces);
      }
    }
    // return this.chassisBody.position;
    return this.getFitness();
  }
}

const game = new Game();

self.onmessage = (e) => {
  // for (let i = 0; i < 1000; i++) {
  //   game.simulate();
  // }
  self.postMessage(game.simulate());
};
