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
}

function setup() {
  createCanvas(400, 400);
  nn = new NeuralNetwork(2, 4, 1);

  let counter = 0;
  nn.train(data, finished);

  function finished() {
    console.log('Training pass: ' + counter);
    counter++;
    nn.train(data, finished);
  }



}

function draw() {
  background(0);


  let resolution = 50;
  let cols = width / resolution;
  let rows = height / resolution;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x1 = i / cols;
      let x2 = j / rows;
      let inputs = [x1, x2];
      let y = nn.predict(inputs);
      noStroke();
      fill(y * 255);
      rect(i * resolution, j * resolution, resolution, resolution);
    }
  }

}