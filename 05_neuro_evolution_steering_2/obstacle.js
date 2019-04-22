class Obstacle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.r = 16;
  }

  update() {
    this.pos.y += 4;
  }

  show() {
    stroke(255);
    noFill();
    ellipse(this.pos.x, this.pos.y, this.r * 2);
  }
}
