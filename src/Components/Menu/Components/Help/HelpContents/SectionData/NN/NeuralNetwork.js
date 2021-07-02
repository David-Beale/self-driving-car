import ReactPlayer from "react-player/lazy";
import AIEvolution from "./AI evolution.JPG";
import perceptron from "./perceptron.png";
import { SectionSubHeading, SectionRow } from "../SectionStyles";
import ClickableImage from "../ClickableImage";

export default function NeuralNetwork() {
  return (
    <>
      <ReactPlayer url={"https://youtu.be/NwyDRwl1pO4"} controls={true} />
      <SectionSubHeading>Architecture</SectionSubHeading>
      <ClickableImage
        height={400}
        width={640}
        src={perceptron}
        alt="training"
      />
      <SectionRow>
        This was my first go at using neural networks, so I kept things pretty
        simple. I made a multilayer perceptron using Tensorflow.js and used
        neuroevolution to train the network.
      </SectionRow>
      <SectionRow>
        I initially tried using the{" "}
        <a
          href="https://en.wikipedia.org/wiki/Neuroevolution_of_augmenting_topologies"
          target="_blank"
          rel="noreferrer"
        >
          NEAT
        </a>{" "}
        algorithm, but it never managed to get passed the first turn (probably a
        failing of my simulation/fitness function).
      </SectionRow>
      <SectionRow>
        <b>Inputs:</b> Velocity, heading variance (difference between current
        heading and desired heading), distance to the next turn, distance to the
        destination.
      </SectionRow>
      <SectionRow>
        <b>Outputs:</b> Steering force, acceleration, braking.
      </SectionRow>
      <SectionSubHeading>Training</SectionSubHeading>
      <ClickableImage
        height={400}
        width={640}
        src={AIEvolution}
        alt="training"
      />
      <SectionRow>
        I used a{" "}
        <a
          href="https://towardsdatascience.com/introduction-to-genetic-algorithms-including-example-code-e396e98d8bf3"
          target="_blank"
          rel="noreferrer"
        >
          genetic algorithm
        </a>{" "}
        to evolve the network. It probably would have been a lot faster to use
        the inputs and outputs from my manual self driving algorithm and use{" "}
        <a
          href="https://en.wikipedia.org/wiki/Stochastic_gradient_descent"
          target="_blank"
          rel="noreferrer"
        >
          SGD
        </a>{" "}
        to optimize the network, but I wanted to see if the AI to train itself
        without any human input. There was definitely a lot of trial and error
        e.g. tweaking the fitness function, mutation rate, population size, and
        network size, but I'm really happy with how it worked out.
      </SectionRow>
      <SectionRow>
        You can actually see on the graph where the main challenges were. It
        took about 25 generations before it figured out how to turn. It didn't
        figure out how to brake at the end until generation 55, and then it
        continued tweaking itself, gradually getting faster and faster.
      </SectionRow>
      <SectionRow>
        For the fitness function, I used a combination of the distance
        travelled, proximity of it's final position to the end point (to make
        sure it braked properly), and time taken.
      </SectionRow>
      <SectionRow>
        The fitness determined the chance of the network moving onto the next
        generation and a small mutation rate was used to tweak the weights and
        biases.
      </SectionRow>
      <SectionSubHeading>Observations</SectionSubHeading>
      <SectionRow>
        The AI clearly suffers from "overfitting" to the specific training
        route. The route included 4 right turns (including a hairpin) and only 1
        left turn, so the AI learned to stick to the left side of the road,
        always ready to make a right turn.
      </SectionRow>
      <SectionRow>
        There's also zero tolerance to any latency. The physics engine is
        asynchronous, so there's a chance the AI will mess up a turn on a slow
        computer.
      </SectionRow>
      <SectionSubHeading>Future plans</SectionSubHeading>
      <SectionRow>
        It's probably a good idea to randomise the training path, to avoid
        overfitting issues. Hopefully it would also get better at driving in a
        straight line.
      </SectionRow>
      <SectionRow>
        I also want to try including the obstacle detection inputs to see if it
        can learn to avoid random obstacles.
      </SectionRow>
    </>
  );
}
