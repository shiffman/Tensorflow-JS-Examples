let data;
let model;
let xs, ys;

let labelList = [
  'red-ish',
  'green-ish',
  'blue-ish',
  'orange-ish',
  'yellow-ish',
  'pink-ish',
  'purple-ish',
  'brown-ish',
  'grey-ish'
]

function preload() {
  data = loadJSON('colorData.json');
}


function setup() {
  console.log(data.entries.length);

  let colors = [];
  let labels = [];
  for (let record of data.entries) {
    let col = [record.r / 255, record.g / 255, record.b / 255];
    colors.push(col);
    labels.push(labelList.indexOf(record.label));
  }
  //console.log(colors);

  xs = tf.tensor2d(colors);
  //console.log(xs.shape);
  //xs.print();

  let labelsTensor = tf.tensor1d(labels, 'int32');
  //labelsTensor.print();

  ys = tf.oneHot(labelsTensor, 9).cast('float32');
  labelsTensor.dispose();

  model = tf.sequential();
  const hidden = tf.layers.dense({
    units: 16,
    inputShape: [3],
    activation: 'sigmoid'
  });
  const output = tf.layers.dense({
    units: 9,
    activation: 'softmax'
  });
  model.add(hidden);
  model.add(output);

  const LEARNING_RATE = 0.25;
  const optimizer = tf.train.sgd(LEARNING_RATE);

  model.compile({
    optimizer: optimizer,
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });

  xs.print();
  ys.print();

  train().then(result => {
    console.log(result.history.loss);
  });
}

async function train() {
  await model.fit(xs, ys, {
    shuffle: true,
    epochs: 100,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        console.log(epoch + ': ' + logs.loss.toFixed(5));
      },
      onBatchEnd: async (batch, logs) => {
        await tf.nextFrame();
      },
      onTrainEnd: () => {
        console.log('finished')
      },
    },
  });
}

function draw() {
  background(0);
  strokeWeight(2);
  stroke(255);
  line(frameCount % width, 0, frameCount % width, height);
}