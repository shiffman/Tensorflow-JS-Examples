// Data helper classes

// class ml5.Data

// ml5.Data?
class Data {
  // Need to deal with shape
  constructor(data) {
    this.xs = tf.tensor2d(data.inputs);
    this.ys = tf.tensor2d(data.targets);
  }
}

// Helper class for a Batch of Data: ml5.Batch
class Batch {
  constructor() {
    // Need to deal with shape
    // this.shape = ??;
    this.data = [];
  }

  add(data) {
    this.data.push(data);
  }

  toTensor() {
    this.data = tf.tensor2d(this.data);
  }
}

class NeuralNetwork {
  constructor(inputs, hidden, outputs, lr) {
    this.model = tf.sequential();
    const hiddenLayer = tf.layers.dense({
      units: hidden,
      inputShape: [inputs],
      activation: 'sigmoid'
    });
    const outputLayer = tf.layers.dense({
      units: outputs,
      // inferred
      // inputShape: [hidden],
      activation: 'sigmoid'
    });
    this.model.add(hiddenLayer);
    this.model.add(outputLayer);

    const LEARNING_RATE = lr || 0.5;
    const optimizer = tf.train.sgd(LEARNING_RATE);

    this.model.compile({
      optimizer: optimizer,
      // optimizer: 'sgd',
      loss: 'meanSquaredError'
    });
  }

  predict(inputs) {
    return tf.tidy(() => {
      let data;
      if (inputs instanceof Batch) {
        data = inputs.data;
      } else {
        data = [inputs];
      }
      const xs = data instanceof tf.Tensor ? data : tf.tensor2d(data);
      return this.model.predict(xs).dataSync();
    });
  }
  
  async predictAsync(inputs) {
    let ys = tf.tidy(() => {
      let data;
      if (inputs instanceof Batch) {
        data = inputs.data;
      } else {
        data = [inputs];
      }
      const xs = data instanceof tf.Tensor ? data : tf.tensor2d(data);
      return this.model.predict(xs);
    });
    let res = await ys.data();
    ys.dispose();
    return res;
  }

  setTrainingData(data) {
    if (data instanceof Data) {
      this.trainingData = data;
    } else {
      this.trainingData = new Data(data);
    }
  }

  async train(epochs, data) {
    let xs, ys;
    if (data) {
      xs = tf.tensor2d(data.inputs);
      ys = tf.tensor2d(data.targets);
    } else if (this.trainingData) {
      xs = this.trainingData.xs;
      ys = this.trainingData.ys;
    } else {
      console.log("I have no data!");
      return;
    }
    await this.model.fit(xs, ys, {
      epochs: epochs || 1,
      shuffle: true
    });
    if (data) {
      xs.dispose();
      ys.dispose();
    }
  }
}
