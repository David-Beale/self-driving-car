import { Sky, Stars } from "@react-three/drei";
import Effects from "../Effects/Effects";

export default function SkyComponent() {
  return (
    <>
      <ambientLight color="#ffffff" intensity={0.3} />
      <directionalLight
        color="#ffffff"
        intensity={0.1}
        position={[-100, 50, 50]}
      />
      {/* <directionalLight color="#ffffff" position={[100, 50, 50]} /> */}
      <Sky
        distance={45000} // Camera distance (default=450000)
        inclination={0} // Sun elevation angle from 0 to 1 (default=0)
        azimuth={0.25} // Sun rotation around the Y axis from 0 to 1 (default=0.25)
        rayleigh={10}
      />
      <Stars radius={1000} factor={15} />
      <Effects />
    </>
  );
}
