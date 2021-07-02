import { SectionSubHeading, SectionRow } from "../SectionStyles";

export default function Controls() {
  return (
    <>
      <SectionSubHeading>Keyboard</SectionSubHeading>
      <SectionRow>
        <b>W</b> - accelerate
      </SectionRow>
      <SectionRow>
        <b>S</b> - reverse
      </SectionRow>
      <SectionRow>
        <b>A</b> - steer left
      </SectionRow>
      <SectionRow>
        <b>D</b> - steer right
      </SectionRow>
      <SectionRow>
        <b>Space</b> - brake
      </SectionRow>
      <SectionSubHeading>Mouse</SectionSubHeading>
      <SectionRow>
        <b>Point and click</b> on any part of the road to begin self driving.
      </SectionRow>
      <SectionRow>
        By default this uses a manually programmed pathfinding and self driving
        algorithm.
      </SectionRow>
      <SectionRow>
        A self trained neural network can also be used (see below).
      </SectionRow>
      <SectionSubHeading>Camera</SectionSubHeading>
      <SectionRow>
        Hold the left or right mouse button and drag the mouse.
      </SectionRow>
      <SectionRow>Use the scroll wheel to zoom in and out.</SectionRow>
      <SectionRow>Press the camera icon to follow the vehicle.</SectionRow>
      <SectionRow></SectionRow>
    </>
  );
}
