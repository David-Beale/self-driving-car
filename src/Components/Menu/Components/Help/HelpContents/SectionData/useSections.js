import { useRef } from "react";
import Controls from "./Controls/Controls";
import NeuralNetwork from "./NN/NeuralNetwork";
import Training from "./Training/Training";
import Obstacles from "./Obstacles/Obstacles";

export default function useSections() {
  const controls = useRef();
  const obstacles = useRef();
  const neuralNetwork = useRef();
  const training = useRef();
  return [
    { name: "Controls", ref: controls, data: Controls },
    { name: "Neural Network", ref: neuralNetwork, data: NeuralNetwork },
    { name: "Training", ref: training, data: Training },
    { name: "Obstacles", ref: obstacles, data: Obstacles },
  ];
}
