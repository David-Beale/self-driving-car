import ReactPlayer from "react-player/lazy";
import { SectionSubHeading, SectionRow } from "../SectionStyles";

export default function Training() {
  return (
    <>
      <ReactPlayer url={"https://youtu.be/7vgvm4FwbMk"} controls={true} />
      <SectionRow>
        This mode demonstrates the genetic algorithm used for the training the
        neural network. Just to be clear, this isn't actually training a neural
        network (that took a few thousand simulated hours).
      </SectionRow>
      <SectionRow>
        Instead, I'm evolving the parameters for my manual self driving
        algorithm e.g. steering force, acceleration, braking, vision distance.
      </SectionRow>
      <SectionRow>
        Each attempt is completely random, but the cars should evolve to a
        decent level within about 10 generations.
      </SectionRow>
      <SectionSubHeading>Instructions</SectionSubHeading>
      <SectionRow>
        <b>Load next generation: </b>The training simulations are done
        asynchronously on a separate thread, and the loading bar gives an
        indication of it's progress. When ready, press the "Next generation"
        button to load the next generation of vehicles.
      </SectionRow>
      <SectionRow>
        <b>Mutation rate: </b>By default, the mutation rate is 1% which works
        pretty well. If the scores are no longer increasing, try increasing the
        mutation rate to add some variation to the population.
      </SectionRow>
      <SectionRow>
        <b>Population size: </b>The higher the population size, the better the
        results will be, but the simulations will take much longer. Try
        adjusting the size depending on your computer speed.
      </SectionRow>
      <SectionRow>
        <b>Restart: </b>Start again from scratch.
      </SectionRow>
      <SectionRow>
        <b>Pretrained settings: </b>Load the default parameters.
      </SectionRow>
      <SectionRow>
        <b>Scoring: </b>This is based on the distance travelled and time taken.
        100% is the score I got for my default parameters. It's possible to get
        higher than 100%, but the braking and steering will get more aggressive.
      </SectionRow>
      <SectionRow>
        <b>Ghosts: </b>The best car from each population will be shown as the
        main car. Additional random cars from the population can be shown using
        the "ghosts" slider. Just a note, it's possible (but quite rare) that
        the cars will collide with each other. This is just a glitch in the
        physics engine.
      </SectionRow>
    </>
  );
}
