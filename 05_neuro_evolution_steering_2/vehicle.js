// Daniel Shiffman
// Nature of Code
// https://github.com/nature-of-code/noc-syllabus-S19

// Evolutionary "Steering Behavior" Simulation

const TOTALSENSORS = 9;

// This is a class for an individual sensor
// Each vehicle will have N sensors
class Sensor {
  constructor(angle, range) {
    // The vector describes the sensor's direction
    this.dir = p5.Vector.fromAngle(angle);
    this.range = range;
    this.len = 250;
    // This is the sensor's reading
    this.val = 0;
  }

  max() {
    this.val = this.len;
  }

  normalize() {
    return map(this.val, 0, this.len, 1, 0);
  }

  show() {
    if (this.val > 0) {
      stroke(255);
      strokeWeight(this.normalize());
      line(0, 0, this.dir.x * this.val, this.dir.y * this.val);
    }
  }
}

// This is the class for each Vehicle
class Vehicle {
  // A vehicle can be from a "brain" (Neural Network)
  constructor(brain) {
    // All the physics stuff
    this.fx = 0;
    this.vx = 0;
    this.x = random(width);
    this.r = 8;
    this.y = height - this.r * 2;

    // This indicates how well it is doing
    this.score = 0;

    // How many sensors does each vehicle have?
    // How far can each vehicle see?
    // What's the angle in between sensors

    // Create an array of sensors
    this.sensors = [];
    const deltaAngle = PI / TOTALSENSORS;
    for (let angle = PI; angle <= TWO_PI; angle += deltaAngle) {
      this.sensors.push(new Sensor(angle, deltaAngle));
    }

    // If a brain is passed via constructor copy it
    if (brain) {
      this.brain = brain.copy();
      this.brain.mutate(0.1);
      // Otherwise make a new brain
    } else {
      // inputs are all the sensors plus position and velocity info
      let inputs = this.sensors.length + 2;
      this.brain = new NeuralNetwork(inputs, inputs, 1);
    }
  }

  // Called each time step
  update() {
    // Move
    this.x += this.vx;
    this.vx += this.fx;
    // Increase score
    this.score += 1;
  }

  // Make a copy of this vehicle according to probability
  clone(prob) {
    // Pick a random number
    let r = random(1);
    if (r < prob) {
      // New vehicle with brain copy
      return new Vehicle(this.brain);
    }
    // otherwise will return undefined
  }

  // Function to calculate all sensor readings
  // And predict a "desired velocity"
  check(obstacles) {
    if (this.x < 0 || this.x > width) {
      return true;
    }

    // All sensors start with maximum length
    for (let j = 0; j < this.sensors.length; j++) {
      this.sensors[j].max();
    }
    for (let i = 0; i < obstacles.length; i++) {
      let pos = obstacles[i].pos;
      // How far away?
      let d = dist(this.x, this.y, pos.x, pos.y);
      // Skip if it's too far away
      if (d > this.sensors[0].len) {
        continue;
      } else if (d < this.r + obstacles[i].r) {
        return true;
      }
      // What is vector pointing to food
      let toObstacle = p5.Vector.sub(pos, createVector(this.x, this.y));

      // Check all the sensors
      for (let j = 0; j < this.sensors.length; j++) {
        // If the relative angle of the food is in between the range
        let delta = this.sensors[j].dir.angleBetween(toObstacle);
        if (abs(delta) < this.sensors[j].range * 0.5) {
          // Sensor value is the closest food
          this.sensors[j].val = min(this.sensors[j].val, d);
        }
      }
    }

    // Create inputs
    let inputs = [];
    // These inputs are the current velocity vector
    inputs[0] = this.vx;
    inputs[1] = map(this.x, 0, width, 0, 1);
    // All the sensor readings
    for (let j = 0; j < this.sensors.length; j++) {
      inputs[j + 2] = this.sensors[j].normalize();
    }

    // Get two outputs
    let outputs = this.brain.predict(inputs);
    // Output is a push in a direction
    this.fx = outputs[0] * 2; //map(outputs[0], 0, 1, -1, 1);
  }

  debug() {
    push();
    // Translate to vehicle position
    translate(this.x, this.y);

    // Draw lines for all the activated sensors
    for (let i = 0; i < this.sensors.length; i++) {
      let val = this.sensors[i].val;
      if (val > 0) {
        stroke(255);
        strokeWeight(map(val, 0, this.sensors[i].len, 1, 0));
        let position = this.sensors[i].dir;
        line(0, 0, position.x * val, position.y * val);
      }
    }
    noFill();
    stroke(255);
    strokeWeight(0.5);
    // Draw a triangle rotated in the direction of velocity
    ellipse(0, 0, this.r * 2);
    pop();
  }

  // Highlight with a grey bubble
  highlight() {
    push();
    translate(this.x, this.y);
    if (debug.checked()) {
      for (let i = 0; i < this.sensors.length; i++) {
        this.sensors[i].show();
      }
      noStroke();
      fill(255, 200);
      textAlign(LEFT, CENTER);
      text(int(this.score), this.r + 2, 0);
    }
    fill(255);
    stroke(255);
    ellipse(0, 0, this.r * 2);
    pop();
  }
}
