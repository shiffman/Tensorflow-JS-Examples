/* The training dataset is so small that duplicating the data would speed up training
   more efficiently than increasing the number of epochs. */
let data = {
  inputs: [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1]
  ],
  targets: [
    [0],
    [1],
    [1],
    [0]
  ]
};

let resolution = 50;
let batch;
let results;
let cols;
let rows;

let counter = 0;

let training = false;

function train() {
  if (!training) {
    training = true;
    nn.train().then(finished);
  }
}

function finished() {
  counter++;
  statusP.html('training pass: ' + counter + '<br>framerate: ' + floor(frameRate()));
  training = false;
  nn.predictAsync(batch).then(ys => (results = ys));
  
  // We need to let the JavaScript event loop tick forward before we call `train()`.
  setTimeout(train, 0);
}

let statusP;

function setup() {
  createCanvas(400, 400);
  noStroke();
  textAlign(CENTER, CENTER);
  statusP = createP('0');

  nn = new NeuralNetwork(2, 2, 1);
  nn.setTrainingData(data);

  // The test input never changes, so we can precalculate it here.
  batch = new Batch();
  cols = width / resolution;
  rows = height / resolution;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x1 = i / cols;
      let x2 = j / rows;
      let inputs = [x1, x2];
      batch.add(inputs);
    }
  }
  batch.toTensor();
  results = nn.predict(batch);
  train();
}

function draw() {
  // Technically, this only needs to be redrawn when `predictAsync()` is fulfilled.
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let y = results[i + j * rows];
      fill(y * 255);
      rect(i * resolution, j * resolution, resolution, resolution);
      fill(255 - y * 255);
      text(
        nf(y, 0, 2),
        i * resolution + resolution / 2,
        j * resolution + resolution / 2
      );
    }
  }
}
