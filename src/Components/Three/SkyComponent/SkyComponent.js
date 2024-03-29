import { Sky, Stars } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import Effects from "../Effects/Effects";

const settings = {
  night: {
    directionalLight: 0.25,
    ambientLight: 0.3,
    inclination: 0.48,
    bloom: 1,
    rayleigh: 5,
    sunPosition: 750,
  },
  sunset: {
    directionalLight: 1.7,
    ambientLight: 0.3,
    inclination: 0.491,
    bloom: 0.4,
    rayleigh: 0.9,
    sunPosition: 750,
  },
  day: {
    directionalLight: 1,
    ambientLight: 1.5,
    inclination: 0.61,
    bloom: 0,
    rayleigh: 0.07,
    sunPosition: 1000,
  },
};

const lerp = (start, end, progress) => {
  return (1 - progress) * start + progress * end;
};

export default function SkyComponent({ time, quality }) {
  const [currentSettings, setCurrentSettings] = useState(settings[time]);
  const [starsOn, setStarsOn] = useState(false);
  const prevTime = useRef(time);
  const animate = useRef(false);
  const progress = useRef(0);
  useEffect(() => {
    if (prevTime.current === time) return;
    if (time === "night") setStarsOn(true);
    else setStarsOn(false);
    animate.current = true;
    progress.current = 0;
  }, [time]);

  useFrame(() => {
    if (!animate.current) return;
    progress.current++;
    const newSettings = {};
    Object.keys(currentSettings).forEach((key) => {
      newSettings[key] = lerp(
        settings[prevTime.current][key],
        settings[time][key],
        progress.current / 100
      );
    });
    setCurrentSettings(newSettings);
    if (progress.current > 99) {
      animate.current = false;
      prevTime.current = time;
    }
  });
  return (
    <>
      <ambientLight
        color="#ffffff"
        intensity={currentSettings.ambientLight + (quality === 1 ? 0.7 : 0)}
      />
      {quality > 1 && (
        <>
          <directionalLight
            color="#ffffff"
            intensity={currentSettings.directionalLight}
            position={[0, currentSettings.sunPosition, -1000]}
          />
          <Sky
            distance={45000} // Camera distance (default=450000)
            inclination={currentSettings.inclination} // Sun elevation angle from 0 to 1 (default=0)
            azimuth={0.25} // Sun rotation around the Y axis from 0 to 1 (default=0.25)
            rayleigh={currentSettings.rayleigh}
          />
          {starsOn && <Stars radius={1000} factor={15} />}
        </>
      )}
      {quality > 2 && <Effects strength={currentSettings.bloom} />}
    </>
  );
}
