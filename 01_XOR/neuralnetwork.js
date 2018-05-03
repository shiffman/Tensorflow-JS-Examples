class Batch {
  constructor() {
    // this.shape = ??;
    this.data = [];
  }

  add(data) {
    this.data.push(data);
  }
}


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

    const LEARNING_RATE = 0.5;
    const optimizer = tf.train.sgd(LEARNING_RATE);

    this.model.compile({
      optimizer: optimizer,
      // optimizer: 'sgd',
      loss: 'meanSquaredError'
    });
  }

  predict(inputs) {
    if (inputs instanceof Batch) {
      return tf.tidy(() => {
        const xs = tf.tensor2d(inputs.data);
        return this.model.predict(xs).dataSync();
      });
    } else {
      return tf.tidy(() => {
        const xs = tf.tensor2d([inputs]);
        return this.model.predict(xs).dataSync();
      });
    }
  }

  async train(data, epochs, callback) {
    const xs = tf.tensor2d(data.inputs);
    const ys = tf.tensor2d(data.targets);
    await this.model.fit(xs, ys, {
      epochs: epochs
    });
    xs.dispose();
    ys.dispose();
    callback();
  }
}
