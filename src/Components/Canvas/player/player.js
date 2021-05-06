import dijkstra from "../graph/helpers/dijkstra";
import dijkstraTime from "../graph/helpers/dijkstra-time";
import playerCarImg from "../../../Assets/player.png";
import ClickIndicator from "./clickIndicator";
const RADIUS = 25;
const clickIndicator = new ClickIndicator(RADIUS);
const playerCar = new Image();
playerCar.src = playerCarImg;
const COLORS = {
  distance: "rgb(58, 94, 211)",
  time: "yellow",
};

export default class Player {
  constructor(context, map, camera) {
    clickIndicator.context = context;
    this.camera = camera;
    this.map = map.graphObj;
    this.context = context;
    this.speed = 5;
    this.counter = 0;
    this.arrayOfVertices = Object.keys(map.graphObj);
    this.pathfinding = "distance";
    this.direction0 = null;
    this.direction1 = null;
    this.direction2 = null;
    this.masterSpeed = 5;
    this.startingCoords = [];
    this.comparePaths = {};
  }
  run() {
    clickIndicator.run();

    if (this.compare) {
      this.drawPath(this.comparePaths.time.path, 0, COLORS.time);
      this.drawPath(this.comparePaths.distance.path, 0, COLORS.distance);
    } else if (this.pathArray) {
      this.drawPath(this.pathArray, this.pathIndex, this.pathColor);
      this.calculateNextStep();
    }
    this.drawCar();
  }

  //
  // ─── USER INTERACTIONS ──────────────────────────────────────────────────────────
  //

  click(clientX, clientY) {
    const x = this.screenToCoords(clientX, this.camera.x);
    const y = this.screenToCoords(clientY, this.camera.y);
    clickIndicator.click(x, y);
    return !this.currentVertex ? this.firstClick(x, y) : this.secondClick(x, y);
  }
  screenToCoords(screenCoords, cameraAdjustment) {
    const cameraAdjustedCoords =
      (screenCoords + cameraAdjustment) / this.camera.scale;
    return Math.floor(cameraAdjustedCoords / 50) * 50 + RADIUS;
  }
  firstClick(x, y) {
    const vertex = this.findVertex(x, y);
    if (!vertex) return;
    this.currentVertex = this.map[vertex];
    this.currentVertex.occupied = true;
    this.currentX = x;
    this.currentY = y;
  }
  secondClick(x, y) {
    const targetVertex = this.findVertex(x, y);
    if (!targetVertex) return;
    const startVertex = this.nextVertex?.value || this.currentVertex.value;
    const { path } = this.runPathfinding(startVertex, targetVertex);
    if (this.compare) return this.comparePaths;
    this.pathArray = path;
    this.pathIndex = this.nextVertex ? -1 : 0;
    if (!this.nextVertex) this.findNextSubPath();
  }
  findVertex(x, y) {
    const targetX = x - RADIUS;
    const targetY = y - RADIUS;
    for (let vertex of this.arrayOfVertices) {
      if (this.map[vertex].x === targetX && this.map[vertex].y === targetY)
        return vertex;
    }
  }
  runPathfinding(a, b) {
    switch (this.pathfinding) {
      case "distance":
        this.pathColor = COLORS.distance;
        return dijkstra(this.map, a, b);
      case "time":
        this.pathColor = COLORS.time;
        return dijkstraTime(this.map, a, b);
      case "compare":
        const { totalDistance: distanceDist, path: distancePath } = dijkstra(
          this.map,
          a,
          b
        );
        const { totalDistance: timeTime, path: timePath } = dijkstraTime(
          this.map,
          a,
          b
        );
        this.comparePaths.distance = {
          distance: distanceDist,
          path: distancePath,
          time: this.getEstimatedTime(distancePath),
        };
        this.comparePaths.time = {
          distance: timePath.length - 1,
          path: timePath,
          time: timeTime,
        };
        this.compare = true;
        return {};
      default:
        return {};
    }
  }

  modeSelect(mode) {
    this.pathfinding = mode;
    if (!this.compare) return;
    this.compare = false;
    this.pathColor = COLORS[mode];
    this.pathArray = this.comparePaths[mode].path;
    this.pathIndex = this.nextVertex ? -1 : 0;
    if (!this.nextVertex) this.findNextSubPath();
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
    if (this.stopped || this.compare) return;
    this.counter++;
    if (this.currentSubPath === 1) {
      this.subPath1();
    } else if (this.currentSubPath === 2) {
      this.subPath2();
    }
    this.currentX += this.dx;
    this.currentY += this.dy;
    this.checkCounter();
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
  checkCounter() {
    if (this.counter !== this.stepCount) return;
    this.counter = 0;
    if (this.currentSubPath === 1) {
      this.currentSubPath = 2;
      return;
    }
    //fix rounding diffs:
    this.currentX = this.targetX;
    this.currentY = this.targetY;

    this.pathIndex++;
    this.findNextSubPath();
  }
  findNextSubPath() {
    this.currentVertex = this.map[this.pathArray[this.pathIndex]];
    this.nextVertex = this.map[this.pathArray[this.pathIndex + 1]];
    if (!this.nextVertex) {
      this.destinationReached();
      return;
    }
    this.speedCheck();

    //the direction is the angle between each tile
    this.updateDirections();

    //the movement is based on the directions.
    //e.g. "up"=>"right" is a right turn, "down=>right" is a left turn
    this.updateMovements();

    //each tile is split into two different subPaths, allowing for cornering
    this.getSubPaths();

    this.getStartingCoords();

    this.getTarget();

    this.obstacleCheck();
  }

  destinationReached() {
    this.pathArray = null;
    this.direction1 = null;
    this.direction2 = null;
  }
  speedCheck() {
    if (this.nextVertex.roadWorks) {
      this.speed = 1;
    } else {
      this.speed = this.masterSpeed;
    }
    // if (this.nextVertex?.speed < this.speed) {
    //   this.speed = this.nextVertex.speed;
    // }
    this.stepCount = Math.floor(25 / this.speed);
  }
  updateDirections() {
    this.direction0 = this.direction1;
    this.direction1 = this.direction2;

    if (!this.direction1) {
      this.direction1 = this.getDirection({
        from: this.currentVertex,
        to: this.nextVertex,
      });
    }

    //need to look 2 ahead when turning
    const nextNextVertex = this.map[this.pathArray[this.pathIndex + 2]];
    if (nextNextVertex) {
      this.direction2 = this.getDirection({
        from: this.nextVertex,
        to: nextNextVertex,
      });
    } else {
      //if there is only 1 vertex left, we will always take a straight line to the end.
      this.direction2 = this.direction1;
    }
  }
  getDirection({ from, to }) {
    const x1 = from.x;
    const x2 = to.x;
    const y1 = from.y;
    const y2 = to.y;
    //right:
    if (x1 > x2) return 0;
    //left:
    else if (x2 > x1) return 180;
    //down:
    else if (y2 > y1) return 270;
    //up:
    else if (y1 > y2) return 90;
  }
  updateMovements() {
    if (this.direction0 === null) {
      // Car hasn't moved before, so we need to initalise some parameters
      this.straightMovement(this.direction1);
      this.carAngle = this.direction1;
      //we will always move straight to the next tile when starting
      this.movement1 = "straight";
    } else {
      this.movement1 = this.movement2;
    }
    this.movement2 = this.getMovement(this.direction1, this.direction2);
  }
  getMovement(direction1, direction2) {
    if (direction1 === direction2) return "straight";
    else if (direction2 === 0 && direction1 === 270) return "right";
    else if (direction1 === 0 && direction2 === 270) return "left";
    else if (direction2 > direction1) return "right";
    else if (direction2 < direction1) return "left";
  }
  getSubPaths() {
    switch (this.movement1) {
      case "straight":
        this.subPath1 = this.straight;
        break;
      case "right":
        this.subPath1 = this.exitRight;
        break;
      case "left":
        this.subPath1 = this.exitLeft;
        break;
      default:
        break;
    }
    switch (this.movement2) {
      case "straight":
        this.subPath2 = this.straight;
        break;
      case "right":
        this.subPath2 = this.enterRight;
        break;
      case "left":
        this.subPath2 = this.enterLeft;
        break;
      default:
        break;
    }
    this.currentSubPath = 1;
  }
  getStartingCoords = () => {
    this.startingCoords[0] = this.getEdgeCoords(1);
    this.startingCoords[1] = this.getEdgeCoords(2);
  };
  getEdgeCoords(subPath) {
    let vertex;
    let direction;
    let movement;
    if (subPath === 1) {
      vertex = this.currentVertex;
      direction = this.direction0;
      movement = this.movement1;
    } else {
      vertex = this.nextVertex;
      direction = this.direction1;
      movement = this.movement2;
    }
    if (movement === "straight") return;
    if (
      (direction === 90 && movement === "right") ||
      (direction === 0 && movement === "left")
    ) {
      return [vertex.x + 50, vertex.y + 50];
    } else if (
      (direction === 180 && movement === "right") ||
      (direction === 90 && movement === "left")
    )
      return [vertex.x, vertex.y + 50];
    else if (
      (direction === 270 && movement === "right") ||
      (direction === 180 && movement === "left")
    )
      return [vertex.x, vertex.y];
    else if (
      (direction === 0 && movement === "right") ||
      (direction === 270 && movement === "left")
    )
      return [vertex.x + 50, vertex.y];
  }
  getTarget() {
    switch (this.movement2) {
      case "straight":
        this.targetX = this.nextVertex.x + RADIUS;
        this.targetY = this.nextVertex.y + RADIUS;
        break;
      case "right": {
        const targetAngle = this.direction1 - 45;
        let [startX, startY] = this.startingCoords[1];
        this.targetX = Math.round(
          startX - RADIUS * Math.cos((Math.PI / 180) * targetAngle)
        );
        this.targetY = Math.round(
          startY - RADIUS * Math.sin((Math.PI / 180) * targetAngle)
        );
        break;
      }
      case "left": {
        const targetAngle = 405 - this.direction1;
        const [startX, startY] = this.startingCoords[1];
        this.targetX = Math.round(
          startX - RADIUS * Math.sin((Math.PI / 180) * targetAngle)
        );
        this.targetY = Math.round(
          startY - RADIUS * Math.cos((Math.PI / 180) * targetAngle)
        );
        break;
      }
      default:
        break;
    }
  }
  obstacleCheck() {
    if (
      !this.nextVertex.occupied &&
      this.currentVertex.light === "green" &&
      !this.compare
    ) {
      this.currentVertex.occupiedFalse();
      this.nextVertex.occupied = true;
      this.nextVertex.speed = this.speed;
    } else {
      this.stopped = true;
    }
  }

  //
  // ─── SUBPATHS ───────────────────────────────────────────────────────────────────
  //

  straight() {
    //If second subpath is straight, no need to update dx,dy
    //there is no change in direction.
    if (this.currentSubPath === 2) return;
    this.straightMovement(this.direction1);
    this.carAngle = this.direction1;
  }
  rightTurn(startX, startY, initialAngle) {
    const angle = initialAngle + this.counter * (45 / this.stepCount);
    this.carAngle = angle + 90;

    const xPos = startX - RADIUS * Math.cos((Math.PI / 180) * angle);
    const yPos = startY - RADIUS * Math.sin((Math.PI / 180) * angle);

    this.dx = xPos - this.currentX;
    this.dy = yPos - this.currentY;
  }
  exitRight() {
    const [startX, startY] = this.startingCoords[0];
    const initialAngle = this.direction0 - 45;
    this.rightTurn(startX, startY, initialAngle);
  }
  enterRight() {
    const [startX, startY] = this.startingCoords[1];
    const initialAngle = this.direction1 - 90;
    this.rightTurn(startX, startY, initialAngle);
  }
  leftTurn(startX, startY, initialAngle) {
    const angleDelta = this.counter * (45 / this.stepCount);
    const angle = initialAngle + angleDelta;
    this.carAngle = 360 - initialAngle - angleDelta;
    const xPos = startX - RADIUS * Math.sin((Math.PI / 180) * angle);

    const yPos = startY - RADIUS * Math.cos((Math.PI / 180) * angle);

    this.dx = xPos - this.currentX;
    this.dy = yPos - this.currentY;
  }
  exitLeft() {
    const [startX, startY] = this.startingCoords[0];
    const initialAngle = 405 - this.direction0;
    this.leftTurn(startX, startY, initialAngle);
  }
  enterLeft() {
    const [startX, startY] = this.startingCoords[1];
    const initialAngle = 360 - this.direction1;
    this.leftTurn(startX, startY, initialAngle);
  }

  straightMovement(direction) {
    if (direction === 0) {
      this.dx = -this.speed;
      this.dy = 0;
    } else if (direction === 180) {
      this.dx = this.speed;
      this.dy = 0;
    } else if (direction === 90) {
      this.dx = 0;
      this.dy = -this.speed;
    } else if (direction === 270) {
      this.dx = 0;
      this.dy = this.speed;
    }
  }

  //DRAWINGS
  drawCar() {
    if (!this.currentVertex) return;
    const x = this.currentX - RADIUS + 25;
    const y = this.currentY - RADIUS / 2 + 12.5;
    const angle = (this.carAngle * Math.PI) / 180;
    this.context.save();
    this.context.translate(x, y);
    this.context.rotate(angle);
    this.context.drawImage(playerCar, -25, -12.5, 50, 25);
    this.context.restore();
  }
  drawPath(array, startIndex, color) {
    for (let i = startIndex; i < array.length - 1; i++) {
      let startX;
      let startY;
      if (i === startIndex) {
        //path starts at car position
        startX = this.currentX;
        startY = this.currentY;
      } else {
        const vertex = this.map[array[i]];
        startX = vertex.x + RADIUS;
        startY = vertex.y + RADIUS;
      }
      const nextVertex = this.map[array[i + 1]];
      const nextX = nextVertex.x + RADIUS;
      const nextY = nextVertex.y + RADIUS;
      this.drawLine(startX, startY, nextX, nextY, color);
    }
  }
  drawLine(x, y, targetx, targety, color) {
    this.context.beginPath();
    this.context.fillStyle = color;
    let margin = 0;
    if (color === COLORS.time) {
      margin = 1.5;
    }
    let dx = targetx - x;
    let dy = targety - y;
    if (dx === 0) {
      this.context.fillRect(x - 2.5 - margin / 2, y, 5 + margin, dy * 1.05);
    } else
      this.context.fillRect(x, y - 2.5 - margin / 2, dx * 1.05, 5 + margin);
  }
}
