class Game {
  constructor() {
    //if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

    this.container = null;
    this.stats = null;
    this.camera = null;
    this.scene = null;
    this.renderer = null;
    this.debug = true;
    this.debugPhysics = true;
    this.fixedTimeStep = 1.0 / 60.0;

    this.js = { forward: 0, turn: 0 };

    this.init();
  }

  initPhysics() {
    this.physics = {};

    const game = this;
    const world = new CANNON.World();
    this.world = world;

    world.broadphase = new CANNON.SAPBroadphase(world);
    world.gravity.set(0, -10, 0);
    world.defaultContactMaterial.friction = 1;
    world.defaultContactMaterial.contactEquationRelaxation = 0.001;

    const groundMaterial = new CANNON.Material("groundMaterial");
    const wheelMaterial = new CANNON.Material("wheelMaterial");
    const wheelGroundContactMaterial = new CANNON.ContactMaterial(
      wheelMaterial,
      groundMaterial,
      {
        friction: 0.3,
        restitution: 0,
        contactEquationStiffness: 1000,
      }
    );

    // We must add the contact materials to the world
    world.addContactMaterial(wheelGroundContactMaterial);

    const chassisShape = new CANNON.Box(new CANNON.Vec3(1.7, 1, 4));
    const chassisBody = new CANNON.Body({ mass: 500 });
    chassisBody.addShape(chassisShape);
    chassisBody.position.set(147.5, 1, 157.5);
    chassisBody.angularVelocity.set(0, 0, 0);
    chassisBody.rotation.set(0, Math.PI, 0);

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

    vehicle.wheelInfos.forEach(function (wheel) {
      const cylinderShape = new CANNON.Cylinder(
        wheel.radius,
        wheel.radius,
        wheel.radius / 2,
        20
      );
      const wheelBody = new CANNON.Body({ mass: 1, collisionFilterGroup: 0 });
      const q = new CANNON.Quaternion();
      q.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI / 2);
      wheelBody.addShape(cylinderShape);
      wheelBodies.push(wheelBody);
    });

    // Update wheels
    world.addEventListener("postStep", function () {
      for (var i = 0; i < game.vehicle.wheelInfos.length; i++) {
        game.vehicle.updateWheelTransform(i);
      }
    });

    this.vehicle = vehicle;

    this.animate();
  }

  updateDrive(forward = this.js.forward, turn = this.js.turn) {
    const maxSteerVal = 0.6;
    const maxForce = 500;
    const brakeForce = 10;

    const force = maxForce * forward;
    const steer = maxSteerVal * turn;

    if (forward != 0) {
      this.vehicle.setBrake(0, 0);
      this.vehicle.setBrake(0, 1);
      this.vehicle.setBrake(0, 2);
      this.vehicle.setBrake(0, 3);

      this.vehicle.applyEngineForce(force, 0);
      this.vehicle.applyEngineForce(force, 1);
    } else {
      this.vehicle.setBrake(brakeForce, 0);
      this.vehicle.setBrake(brakeForce, 1);
      this.vehicle.setBrake(brakeForce, 2);
      this.vehicle.setBrake(brakeForce, 3);
    }

    this.vehicle.setSteeringValue(steer, 2);
    this.vehicle.setSteeringValue(steer, 3);
  }

  animate() {
    const game = this;

    requestAnimationFrame(function () {
      game.animate();
    });

    this.world.step(this.fixedTimeStep);

    this.world.bodies.forEach(function (body) {
      if (body.threemesh !== undefined) {
        body.threemesh.position.copy(body.position);
        body.threemesh.quaternion.copy(body.quaternion);
      }
    });

    this.updateDrive();
  }
}
