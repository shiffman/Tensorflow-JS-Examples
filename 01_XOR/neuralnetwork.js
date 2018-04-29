// Based on: https://github.com/tensorflow/tfjs-examples/tree/master/mnist

class NeuralNetwork {

  constructor(inputs, hidden, outputs) {
    this.model = tf.sequential();
    const hiddenLayer = tf.layers.dense({
      units: hidden,
      inputShape: [inputs],
      activation: 'sigmoid'
    });
    const outputLayer = tf.layers.dense({
      units: outputs,
      inputShape: [hidden],
      activation: 'sigmoid'
    });
    this.model.add(hiddenLayer);
    this.model.add(outputLayer);
    this.model.compile({
      optimizer: 'sgd',
      loss: 'meanSquaredError'
    });
  }

  predict(inputs) {
    const xs = tf.tensor2d([inputs]);
    return this.model.predict(xs).get();
  }

  async train(data) {
    const xs = tf.tensor2d(data.inputs);
    const ys = tf.tensor2d(data.targets);
    console.log('start training.')
    await this.model.fit(xs, ys, {
      epochs: 1000
    });
    console.log('finish training.');
  }
}