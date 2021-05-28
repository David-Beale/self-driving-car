/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */
importScripts("cannon.min.js");
importScripts("roads.js");
importScripts("car.js");

class Sim {
  constructor() {
    this.car = new Car();
    this.fixedTimeStep = 1.0 / 60.0;
    this.initPhysics();
    this.endPoint = new CANNON.Vec3(147.5, 0.5, 7.5);
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
      var groundShape = new CANNON.Box(new CANNON.Vec3(road.w, road.h, 0.01));
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
    chassisBody.position.set(147.5, 4, 192.5);
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

  resetCar() {
    this.chassisBody.position.set(147.5, 4, 192.5);
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

  getFitness(DNA) {
    //0% for 0 distance travelled, 100% for arriving perfectly
    const distanceScore =
      (185 - this.chassisBody.position.distanceTo(this.endPoint)) * (50 / 185);
    //lose 0.5% per frame over best time
    let timeScore =
      !this.finish || distanceScore < 45 ? 0 : (2224 - this.finish) / 2;
    let totalScore = distanceScore + timeScore;
    if (totalScore <= 0) totalScore = 1;
    this.totalScores += totalScore;
    if (totalScore > this.bestScore) {
      this.bestScore = totalScore;
      this.bestDNA = DNA;
    }
    return totalScore;
  }

  translateDNA(DNA) {
    if (DNA.testingData) return DNA;
    return {
      steerVal: DNA[0] * 3,
      maxForce: DNA[1] * 2000,
      maxBrakeForce: (DNA[2] + 1) * 30,
      maxSpeed: (DNA[3] + 1) * 40,
      stoppingDistance: Math.round((DNA[4] + 1) * 30),
      slowDistance: Math.round((DNA[5] + 1) * 30),
    };
  }

  simulate(DNA) {
    const translatedDNA = this.translateDNA(DNA);
    this.car.updateDNA(translatedDNA);
    this.resetCar();
    this.counter = 0;
    this.finish = null;
    while (this.counter < 2224) {
      this.counter++;
      this.world.step(this.fixedTimeStep);
      const res = this.car.run();
      if (res) {
        this.applyForces(res.forces);
      }
      if (!this.car.arrayOfSteps.length && !this.finish)
        this.finish = this.counter;
    }
    // return this.chassisBody.position;
    return this.getFitness(DNA);
  }
}
