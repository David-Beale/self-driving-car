import { Sky, Stars } from "@react-three/drei";
import { useState } from "react";
import Effects from "../Effects/Effects";

const settings = {
  night: {
    name: "night",
    directionalLight: 0.1,
    ambientLight: 0.3,
    inclination: 0,
    bloom: 2.3,
    rayleigh: 8,
    sunPosition: [0, 750, -1000],
  },
  sunset: {
    name: "sunset",
    directionalLight: 1.7,
    ambientLight: 0.3,
    inclination: 0.491,
    bloom: 0.4,
    rayleigh: 0.9,
    sunPosition: [0, 750, -1000],
  },
  day: {
    name: "day",
    directionalLight: 2,
    ambientLight: 2,
    inclination: 0.61,
    bloom: 0,
    rayleigh: 0.07,
    sunPosition: [0, 1000, -1000],
  },
};
export default function SkyComponent({ time }) {
  return (
    <>
      <ambientLight color="#ffffff" intensity={settings[time].ambientLight} />
      <directionalLight
        color="#ffffff"
        intensity={settings[time].directionalLight}
        position={settings[time].sunPosition}
      />
      <Sky
        distance={45000} // Camera distance (default=450000)
        inclination={settings[time].inclination} // Sun elevation angle from 0 to 1 (default=0)
        azimuth={0.25} // Sun rotation around the Y axis from 0 to 1 (default=0.25)
        rayleigh={settings[time].rayleigh}
      />
      {settings[time].name === "night" && <Stars radius={1000} factor={15} />}
      <Effects strength={settings[time].bloom} />
    </>
  );
}
