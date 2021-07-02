import ReactPlayer from "react-player/lazy";
import { SectionSubHeading, SectionRow } from "../SectionStyles";

export default function Obstacles() {
  return (
    <>
      <ReactPlayer url={"https://youtu.be/0tmCX2IiV_Q"} controls={true} />
      <SectionSubHeading>Instructions</SectionSubHeading>
      <SectionRow>
        <b>Add obstacles:</b> Select the "Add obstacles" button and click on the
        road to add an obstacle. Remember to deselect the button when finished.
      </SectionRow>
      <SectionRow>
        <b>Remove obstacles:</b> Select the "Remove obstacles" button to remove
        all obstacles.
      </SectionRow>
      <SectionRow>
        All obstacles will be removed when training or using the neural network.
      </SectionRow>
    </>
  );
}
