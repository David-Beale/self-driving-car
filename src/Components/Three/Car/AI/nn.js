import * as tf from "@tensorflow/tfjs";
tf.setBackend("cpu");

export default class NeuralNetwork {
  constructor(input, hidden, output, weights) {
    this.input = input;
    this.hidden = hidden;
    this.output = output;
    this.createModel(weights);
  }

  createModel(weights) {
    this.model = tf.sequential();
    const hiddenLayer = tf.layers.dense({
      inputShape: [this.input],
      units: this.hidden,
      activation: "sigmoid",
    });
    this.model.add(hiddenLayer);
    const outputLayer = tf.layers.dense({
      units: this.output,
      activation: "sigmoid",
    });
    this.model.add(outputLayer);

    if (weights) this.model.setWeights(weights);
  }

  predict(inputs) {
    return tf.tidy(() => {
      const xs = tf.tensor2d([inputs]);
      const ys = this.model.predict(xs);
      const outputs = ys.dataSync();
      return outputs;
    });
  }
  dispose() {
    this.model.dispose();
  }

  static loadJSON(savedBrain) {
    const { weights, nodes } = savedBrain;
    const modelWeights = weights.map((weight) => {
      const { values, shape } = weight;
      return tf.tensor(values, shape);
    });
    return new NeuralNetwork(nodes[0], nodes[1], nodes[2], modelWeights);
  }
}
