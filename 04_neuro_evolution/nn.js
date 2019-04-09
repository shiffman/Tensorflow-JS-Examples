function createModel() {
  const model = tf.sequential();
  let hidden = tf.layers.dense({
    inputShape: [5],
    units: 8,
    activation: 'sigmoid'
  });
  let output = tf.layers.dense({
    units: 2,
    activation: 'sigmoid'
  });
  model.add(hidden);
  model.add(output);
  return model;
}

class NeuralNetwork {
  constructor(nn) {
    if (nn instanceof tf.Sequential) {
      this.model = nn;
    } else {
      this.model = createModel();
    }
  }

  // Synchronous for now
  predict(input_array) {
    // console.log(input_array);
    let xs = tf.tensor([input_array]);
    let ys = this.model.predict(xs);
    let y_values = ys.dataSync();
    return y_values;
  }

  // Adding function for neuro-evolution
  copy() {
    const modelCopy = createModel();
    const w = this.model.getWeights();
    for (let i = 0; i < w.length; i++) {
      w[i] = w[i].clone();
    }
    modelCopy.setWeights(w);
    const nn = new NeuralNetwork(modelCopy);
    return nn;
  }

  // Accept an arbitrary function for mutation
  mutate(func) {
    const w = this.model.getWeights();
    for (let i = 0; i < w.length; i++) {
      let shape = w[i].shape;
      let arr = w[i].dataSync().slice();
      for (let j = 0; j < arr.length; j++) {
        if (random(1) < 0.1) {
          arr[j] = random(-1, 1);
        }
      }
      let newW = tf.tensor(arr, shape);
      w[i] = newW;
    }
    this.model.setWeights(w);
  }
}

// function mutateWeight(x) {
//   if (random(1) < 0.1) {
//     let offset = randomGaussian() * 0.5;
//     let newx = x + offset;
//     return newx;
//   } else {
//     return x;
//   }
// }
