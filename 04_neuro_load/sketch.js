// Daniel Shiffman
// Nature of Code: Intelligence and Learning
// https://github.com/shiffman/NOC-S18

// This flappy bird implementation is adapted from:
// https://youtu.be/cXgA1d_E-jY&

// Pipes
let pipes = [];
// A frame counter to determine when to add a pipe
let counter = 0;

// Interface elements
let speedSlider;
let speedSpan;
let highScoreSpan;
let allTimeHighScoreSpan;

// All time high score
let highScore = 0;
let bird;

function setup() {
  let canvas = createCanvas(600, 400);
  // tf.setBackend('cpu');
  canvas.parent('canvascontainer');

  // Access the interface elements
  speedSlider = select('#speedSlider');
  speedSpan = select('#speed');
  highScoreSpan = select('#hs');
  allTimeHighScoreSpan = select('#ahs');

  bird = new Bird();
}

// Start the game over
function resetGame() {
  counter = 0;
  // Resetting best bird score to 0
  bird.score = 0;
  bird.y = height / 2;
  bird.velocity = 0;
  pipes = [];
}

function draw() {
  background(0);

  // Should we speed up cycles per frame
  let cycles = speedSlider.value();
  speedSpan.html(cycles);

  // How many times to advance the game
  for (let n = 0; n < cycles; n++) {
    // Show all the pipes
    for (let i = pipes.length - 1; i >= 0; i--) {
      pipes[i].update();
      if (pipes[i].offscreen()) {
        pipes.splice(i, 1);
      }
    }
    // Are we just running the best bird
    bird.think(pipes);
    bird.update();
    for (let j = 0; j < pipes.length; j++) {
      // Start over, bird hit pipe
      if (pipes[j].hits(bird)) {
        resetGame();
        break;
      }
    }

    if (bird.bottomTop()) {
      resetGame();
    }
    // Or are we running all the active birds

    // Add a new pipe every so often
    if (counter % 75 == 0) {
      pipes.push(new Pipe());
    }
    counter++;
  }

  // What is highest score of the current population
  // Just one bird, the best one so far
  const tempHighScore = bird.score;
  if (tempHighScore > highScore) {
    highScore = tempHighScore;
  }

  // Update DOM Elements
  highScoreSpan.html(tempHighScore);
  allTimeHighScoreSpan.html(highScore);

  // Draw everything!
  for (let i = 0; i < pipes.length; i++) {
    pipes[i].show();
  }

  bird.show();
}
