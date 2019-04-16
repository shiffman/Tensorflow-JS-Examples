// Daniel Shiffman
// Nature of Code
// https://github.com/nature-of-code/noc-syllabus-S19

class NeuralNetwork {
  constructor(a, b, c, d) {
    if (a instanceof tf.Sequential) {
      this.model = a;
      this.num_inputs = b;
      this.num_hidden = c;
      this.num_outputs = d;
    } else {
      this.num_inputs = a;
      this.num_hidden = b;
      this.num_outputs = c;
      this.model = this.createModel();
    }
  }

  createModel() {
    const model = tf.sequential();
    let hidden = tf.layers.dense({
      inputShape: [this.num_inputs],
      units: this.num_hidden,
      activation: 'sigmoid'
    });
    let output = tf.layers.dense({
      units: this.num_outputs,
      activation: 'sigmoid'
    });
    model.add(hidden);
    model.add(output);
    return model;
  }

  dispose() {
    this.model.dispose();
  }

  save() {
    this.model.save('downloads://vehicle`-brain');
  }

  // Synchronous for now
  predict(input_array) {
    // console.log(input_array);
    return tf.tidy(() => {
      let xs = tf.tensor([input_array]);
      let ys = this.model.predict(xs);
      let y_values = ys.dataSync();
      return y_values;
    });
  }

  // Adding function for neuro-evolution
  copy() {
    return tf.tidy(() => {
      const modelCopy = this.createModel();
      const w = this.model.getWeights();
      for (let i = 0; i < w.length; i++) {
        w[i] = w[i].clone();
      }
      modelCopy.setWeights(w);
      const nn = new NeuralNetwork(modelCopy, this.num_inputs, this.num_hidden, this.num_outputs);
      return nn;
    });
  }

  // Accept an arbitrary function for mutation
  mutate(rate) {
    tf.tidy(() => {
      const w = this.model.getWeights();
      for (let i = 0; i < w.length; i++) {
        let shape = w[i].shape;
        let arr = w[i].dataSync().slice();
        for (let j = 0; j < arr.length; j++) {
          arr[j] = mutateWeight(arr[j], rate);
        }
        let newW = tf.tensor(arr, shape);
        w[i] = newW;
      }
      this.model.setWeights(w);
    });
  }
}

// Mutation function to be passed into bird.brain
function mutateWeight(x, rate) {
  if (random(1) < rate) {
    let offset = randomGaussian() * 0.5;
    let newx = x + offset;
    return newx;
  } else {
    return x;
  }
}
