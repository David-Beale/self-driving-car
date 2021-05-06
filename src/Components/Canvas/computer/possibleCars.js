import green from "../../../Assets/green.png";
import orange from "../../../Assets/orange.png";
import red from "../../../Assets/red.png";
import yellow from "../../../Assets/yellow.png";
import blue from "../../../Assets/blue.png";

const greenCar = new Image();
greenCar.src = green;
const orangeCar = new Image();
orangeCar.src = orange;
const redCar = new Image();
redCar.src = red;
const yellowCar = new Image();
yellowCar.src = yellow;
const blueCar = new Image();
blueCar.src = blue;

const possibleCars = [greenCar, orangeCar, redCar, yellowCar, blueCar];

export default function randomCar() {
  return possibleCars[Math.floor(Math.random() * possibleCars.length)];
}
