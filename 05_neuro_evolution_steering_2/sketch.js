// Daniel Shiffman
// Nature of Code
// https://github.com/nature-of-code/noc-syllabus-S19

// Evolutionary "Steering Behavior" Simulation

// An array of vehicles
let population = [];

// An array of "obstacles"
let obstacles = [];

// Checkbox to show additional info
let debug;

// Slider to speed up simulation
let speedSlider;
let speedSpan;

let totalVehicles = 30;

let best = null;

function setup() {
  tf.setBackend('cpu');

  // Add canvas and grab checkbox and slider
  let canvas = createCanvas(640, 480);
  canvas.parent('canvascontainer');
  debug = select('#debug');
  speedSlider = select('#speedSlider');
  speedSpan = select('#speed');

  // Create initial population
  for (let i = 0; i < totalVehicles; i++) {
    population[i] = new Vehicle();
  }
}

let counter = 0;

function draw() {
  background(0);

  // How fast should we speed up
  let cycles = speedSlider.value();
  speedSpan.html(cycles);

  // Variable to keep track of highest scoring vehicle

  // Run the simulation "cycles" amount of time
  for (let n = 0; n < cycles; n++) {
    // Always keep a minimum amount of food
    if ((frameCount * cycles + n) % 15 == 0) {
      obstacles.push(new Obstacle(random(-50, width), 0));
    }

    let record = -1;
    // Go through all vehicles and find the best!
    for (let i = population.length - 1; i >= 0; i--) {
      let v = population[i];
      v.update();
      const dead = v.check(obstacles);
      // If the vehicle has died, remove
      if (dead) {
        population.splice(i, 1);
      } else {
        // Is it the vehicles that has lived the longest?
        if (v.score > record) {
          record = v.score;
          best = v;
        }
      }
    }

    // If there is less than 20 apply reproduction
    while (population.length < 20) {
      for (let v of population) {
        // Every vehicle has a chance of cloning itself according to score
        // Argument to "clone" is probability
        let newVehicle = v.clone((0.1 * v.score) / record);
        // If there is a child
        if (newVehicle != null) {
          population.push(newVehicle);
        }
      }
    }

    for (let i = 0; i < obstacles.length; i++) {
      obstacles[i].update();
    }
  }

  // Draw all the food
  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].show();
  }

  best.highlight();

  // Draw all the vehicles
  if (debug.checked()) {
    for (let v of population) {
      v.debug();
    }
  }
}
