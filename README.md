https://david-beale.github.io/self-driving-car/

# Controls

### Keyboard

**W** - accelerate

**S** - reverse

**A** - steer left

**D** - steer right

**Space** - brake

**R** - reset

### Mouse

**Point and click** on any part of the road to begin self driving.
By default this uses a manually programmed pathfinding and self driving algorithm.
A self trained neural network can also be used (see below).

### Camera

Hold the left or right mouse button and drag the mouse.
Use the scroll wheel to zoom in and out.
Press the camera icon to follow the vehicle.

---

# Neural Network

[![Video](https://user-images.githubusercontent.com/59053870/125497726-0b232f95-b624-4141-8637-a2a6bd73d15b.png)](https://youtu.be/NwyDRwl1pO4)

### Architecture

![image](https://user-images.githubusercontent.com/59053870/125497883-4a0eead9-84fc-4530-b8ad-daccd7dbbebb.png)

This was my first go at using neural networks, so I kept things pretty simple. I made a multilayer perceptron using Tensorflow.js and used neuroevolution to train the network.

I initially tried using the [NEAT](https://en.wikipedia.org/wiki/Neuroevolution_of_augmenting_topologies) algorithm, but it never managed to get passed the first turn (probably a failing of my simulation/fitness function).

**Inputs**: Velocity, heading variance (difference between current heading and desired heading), distance to the next turn, distance to the destination.

**Outputs**: Steering force, acceleration, braking.

### Training

![image](https://user-images.githubusercontent.com/59053870/125498225-9bb9418a-38f4-44eb-ae81-8f7ed8a3a4af.png)

I used a [genetic algorithm](https://towardsdatascience.com/introduction-to-genetic-algorithms-including-example-code-e396e98d8bf3) to evolve the network. It probably would have been a lot faster to use the inputs and outputs from my manual self driving algorithm and use [SGD](https://en.wikipedia.org/wiki/Stochastic_gradient_descent) to optimize the network, but I wanted to see if the AI to train itself without any human input. There was definitely a lot of trial and error e.g. tweaking the fitness function, mutation rate, population size, and network size, but I'm really happy with how it worked out.

You can see on the graph where the main challenges were. It took about 25 generations before it figured out how to turn. It didn't figure out how to brake at the end until generation 55, and then it continued tweaking itself, gradually getting faster and faster.

For the fitness function, I used a combination of the distance travelled, proximity of it's final position to the end point (to make sure it braked properly), and time taken.

The fitness determined the chance of the network moving onto the next generation and a small mutation rate was used to tweak the weights and biases.

### Observations

The AI clearly suffers from "overfitting" to the specific training route. The route included 4 right turns (including a hairpin) and only 1 left turn, so the AI learned to stick to the left side of the road, always ready to make a right turn.

There's also zero tolerance to any latency. The physics engine is asynchronous, so there's a chance the AI will mess up a turn on a slow computer.

### Future plans

It's probably a good idea to randomise the training path, to avoid overfitting issues. Hopefully it would also get better at driving in a straight line.

I also want to try including the obstacle detection inputs to see if it can learn to avoid random obstacles.

---

# Training

[![Video](https://user-images.githubusercontent.com/59053870/125498510-33569658-2820-4d36-b439-3cf71286dfba.png)](https://youtu.be/7vgvm4FwbMk)

This mode demonstrates the genetic algorithm used for the training the neural network. Just to be clear, this isn't actually training a neural network (that took a few thousand simulated hours).

Instead, I'm evolving the parameters for my manual self driving algorithm e.g. steering force, acceleration, braking, vision distance.

Each attempt is completely random, but the cars should evolve to a decent level within about 10 generations.

### Instructions

**Load next generation**: The training simulations are done asynchronously on a separate thread, and the loading bar gives an indication of it's progress. When ready, press the "Next generation" button to load the next generation of vehicles.

**Mutation rate**: By default, the mutation rate is 1% which works pretty well. If the scores are no longer increasing, try increasing the mutation rate to add some variation to the population.

**Population size**: The higher the population size, the better the results will be, but the simulations will take much longer. Try adjusting the size depending on your computer speed.

**Restart**: Start again from scratch.

**Pretrained settings**: Load the default parameters.

**Scoring**: This is based on the distance travelled and time taken. 100% is the score I got for my default parameters. It's possible to get higher than 100%, but the braking and steering will get more aggressive.

**Ghosts**: The best car from each population will be shown as the main car. Additional random cars from the population can be shown using the "ghosts" slider. Just a note, it's possible (but quite rare) that the cars will collide with each other. This is just a glitch in the physics engine.

---

# Obstacles

[![Video](https://user-images.githubusercontent.com/59053870/125498926-1ebb3908-857b-4a10-b08c-3a3942ab26e8.png)](https://youtu.be/0tmCX2IiV_Q)

### Instructions
**Add obstacles**: Select the "Add obstacles" button and click on the road to add an obstacle. Remember to deselect the button when finished.

**Remove obstacles**: Select the "Remove obstacles" button to remove all obstacles.

All obstacles will be removed when training or using the neural network.
