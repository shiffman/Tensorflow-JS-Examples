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
  data = loadJSON('colorData_small.json');
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

  const LEARNING_RATE = 0.1;
  const optimizer = tf.train.sgd(LEARNING_RATE);

  model.compile({
    optimizer: optimizer,
    loss: tf.losses.softmaxCrossEntropy
  });

  xs.print();
  ys.print();

  train().then(result => {
    console.log(result.history.loss);
  });
}

async function train() {
  const history = await model.fit(xs, ys, {
    shuffle: true,
    epochs: 1000,
    callbacks: {
       onBatchEnd: async (batch, logs) => {
         console.log(logs.loss.toFixed(5));
         await tf.nextFrame();
       },
       onTrainEnd: () => console.log('finished'),
     },
  });
  return history;
}

function draw() {
  background(0);
  strokeWeight(2);
  stroke(255);
  line(frameCount % width, 0, frameCount % width, height);
}
