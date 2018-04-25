class Classifier {

  constructor() {
    this.model = tf.sequential();
    this.model.add(tf.layers.conv2d({
      inputShape: [28, 28, 1],
      kernelSize: 5,
      filters: 8,
      strides: 1,
      activation: 'relu',
      kernelInitializer: 'VarianceScaling'
    }));
    this.model.add(tf.layers.maxPooling2d({
      poolSize: [2, 2],
      strides: [2, 2]
    }));
    this.model.add(tf.layers.conv2d({
      kernelSize: 5,
      filters: 16,
      strides: 1,
      activation: 'relu',
      kernelInitializer: 'VarianceScaling'
    }));
    this.model.add(tf.layers.maxPooling2d({
      poolSize: [2, 2],
      strides: [2, 2]
    }));
    this.model.add(tf.layers.flatten());
    this.model.add(tf.layers.dense({
      units: CLASSES,
      kernelInitializer: 'VarianceScaling',
      activation: 'softmax'
    }));

    const LEARNING_RATE = 0.15;
    const optimizer = tf.train.sgd(LEARNING_RATE);
    this.model.compile({
      optimizer: optimizer,
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy'],
    });
  }

  async train(data) {
    const batchSize = 100;
    const iterations = data.total / batchSize;
    console.log(iterations);

    for (let i = 0; i < iterations; i++) {
      console.log("Iteration: " + i);
      const batch = data.getTrainBatch(batchSize, i * batchSize);
      const batchData = batch.data.reshape([batchSize, 28, 28, 1]);
      const batchLabels = batch.labels;
      const options = {
        batchSize: batchSize,
        validationData: null,
        epochs: 1
      }

      const history = await this.model.fit(batchData, batchLabels, options);
      const loss = history.history.loss[0];
      const accuracy = history.history.acc[0];
      console.log(loss, accuracy);
    }
  }
}
