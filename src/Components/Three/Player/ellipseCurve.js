import * as THREE from "three";
const RADIUS = 25;
const STEP_COUNT = 10;
export const getCurve = (cx, cy, startX, startY, endX, endY) => {
  const { startAngle, endAngle, clockwise } = getCircleParameters(
    cx,
    cy,
    startX,
    startY,
    endX,
    endY
  );
  const curve = new THREE.EllipseCurve(
    cx,
    cy,
    RADIUS,
    RADIUS,
    startAngle,
    endAngle,
    clockwise,
    0 // aRotation
  );
  const points = curve.getPoints(STEP_COUNT);

  return points.map((point, index) => {
    return {
      point,
      angle: +curve
        .getTangent(index / STEP_COUNT)
        .angle()
        .toFixed(3),
    };
  });
};

const getCircleParameters = (cx, cy, startX, startY, endX, endY) => {
  switch (true) {
    //Clockwise
    case startX > cx && startX > endX && startY > endY:
      return {
        startAngle: 0,
        endAngle: (3 * Math.PI) / 2,
        clockwise: true,
      };
    case startY < cy && startX > endX && startY < endY:
      return {
        startAngle: (3 * Math.PI) / 2,
        endAngle: Math.PI,
        clockwise: true,
      };
    case startX < cx && startX < endX && startY < endY:
      return {
        startAngle: Math.PI,
        endAngle: Math.PI / 2,
        clockwise: true,
      };
    case startY > cy && startX < endX && startY > endY:
      return {
        startAngle: Math.PI / 2,
        endAngle: 0,
        clockwise: true,
      };
    //Anti Clockwise
    case startX > cx && startX > endX && startY < endY:
      return {
        startAngle: 0,
        endAngle: Math.PI / 2,
        clockwise: false,
      };
    case startY > cy && startX > endX && startY > endY:
      return {
        startAngle: Math.PI / 2,
        endAngle: Math.PI,
        clockwise: false,
      };
    case startX < cx && startX < endX && startY > endY:
      return {
        startAngle: Math.PI,
        endAngle: (3 * Math.PI) / 2,
        clockwise: false,
      };
    case startY < cy && startX < endX && startY < endY:
      return {
        startAngle: (3 * Math.PI) / 2,
        endAngle: 0,
        clockwise: false,
      };

    default:
      break;
  }
};
