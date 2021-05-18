import * as THREE from "three";
const RADIUS = 2.5;
const STEP_COUNT = 10;
export const getCurve = (cx, cz, startX, startZ, endX, endZ) => {
  //flip the z-axis. z increases as you go down which is the opposite of what we want
  const { startAngle, endAngle, clockwise } = getCircleParameters(
    cx,
    -cz,
    startX,
    -startZ,
    endX,
    -endZ
  );
  const curve = new THREE.EllipseCurve(
    cx,
    -cz,
    RADIUS,
    RADIUS,
    startAngle,
    endAngle,
    clockwise,
    0 // aRotation
  );
  const points = curve.getPoints(STEP_COUNT);

  return {
    curve: points.map((point, index) => {
      return {
        point,
        angle: +curve
          .getTangent(index / STEP_COUNT)
          .angle()
          .toFixed(3),
      };
    }),
    direction: clockwise ? -1 : 1,
  };
};

const getCircleParameters = (cx, cz, startX, startZ, endX, endZ) => {
  switch (true) {
    //Clockwise
    case startX > cx && startX > endX && startZ > endZ:
      return {
        startAngle: 0,
        endAngle: (3 * Math.PI) / 2,
        clockwise: true,
      };
    case startZ < cz && startX > endX && startZ < endZ:
      return {
        startAngle: (3 * Math.PI) / 2,
        endAngle: Math.PI,
        clockwise: true,
      };
    case startX < cx && startX < endX && startZ < endZ:
      return {
        startAngle: Math.PI,
        endAngle: Math.PI / 2,
        clockwise: true,
      };
    case startZ > cz && startX < endX && startZ > endZ:
      return {
        startAngle: Math.PI / 2,
        endAngle: 0,
        clockwise: true,
      };
    //Anti Clockwise
    case startX > cx && startX > endX && startZ < endZ:
      return {
        startAngle: 0,
        endAngle: Math.PI / 2,
        clockwise: false,
      };
    case startZ > cz && startX > endX && startZ > endZ:
      return {
        startAngle: Math.PI / 2,
        endAngle: Math.PI,
        clockwise: false,
      };
    case startX < cx && startX < endX && startZ > endZ:
      return {
        startAngle: Math.PI,
        endAngle: (3 * Math.PI) / 2,
        clockwise: false,
      };
    case startZ < cz && startX < endX && startZ < endZ:
      return {
        startAngle: (3 * Math.PI) / 2,
        endAngle: 0,
        clockwise: false,
      };

    default:
      break;
  }
};
