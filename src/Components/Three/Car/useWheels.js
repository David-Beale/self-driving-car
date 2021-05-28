import { useMemo, useRef } from "react";

// chassis - wheel connection helpers
const chassisWidth = 1.6;
const chassisHeight = -0.04; // ground clearance
const chassisFront = 1.3;
const chassisBack = -1.35;

const wheelInfo = {
  radius: 0.3,
  directionLocal: [0, -1, 0], // same as Physics gravity
  suspensionStiffness: 30,
  suspensionRestLength: 0.3,
  maxSuspensionForce: 1e4,
  maxSuspensionTravel: 0.3,
  dampingRelaxation: 2.3,
  dampingCompression: 4.4,
  frictionSlip: 5,
  rollInfluence: 0.01,
  axleLocal: [-1, 0, 0], // wheel rotates around X-axis, invert if wheels rotate the wrong way
  chassisConnectionPointLocal: [1, 0, 1],
  isFrontWheel: false,
  useCustomSlidingRotationalSpeed: true,
  customSlidingRotationalSpeed: -30,
};
export const useWheels = () => {
  const wheel_1 = useRef();
  const wheel_2 = useRef();
  const wheel_3 = useRef();
  const wheel_4 = useRef();

  // wheels
  const wheels = useMemo(() => [wheel_1, wheel_2, wheel_3, wheel_4], []);
  const wheelInfos = useMemo(() => {
    // FrontLeft [-X,Y,Z]
    const wheelInfo_1 = {
      ...wheelInfo,
      chassisConnectionPointLocal: [
        -chassisWidth / 2,
        chassisHeight,
        chassisFront,
      ],
      isFrontWheel: true,
    };
    // FrontRight [X,Y,Z]
    const wheelInfo_2 = {
      ...wheelInfo,
      chassisConnectionPointLocal: [
        chassisWidth / 2,
        chassisHeight,
        chassisFront,
      ],
      isFrontWheel: true,
    };
    // BackLeft [-X,Y,-Z]
    const wheelInfo_3 = {
      ...wheelInfo,
      chassisConnectionPointLocal: [
        -chassisWidth / 2,
        chassisHeight,
        chassisBack,
      ],
      isFrontWheel: false,
    };
    // BackRight [X,Y,-Z]
    const wheelInfo_4 = {
      ...wheelInfo,
      chassisConnectionPointLocal: [
        chassisWidth / 2,
        chassisHeight,
        chassisBack,
      ],
      isFrontWheel: false,
    };
    return [wheelInfo_1, wheelInfo_2, wheelInfo_3, wheelInfo_4];
  }, []);
  return [wheels, wheelInfos];
};
