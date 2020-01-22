export default class Vector {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  clone() {
    return new this.constructor(this.x, this.y);
  }

  add(v) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  sub(v) {
    this.x = this.x - v.x;
    this.y = this.y - v.y;
    return this;
  }

  mul(x) {
    this.x *= x;
    this.y *= x;
    return this;
  }

  div(x) {
    this.x /= x;
    this.y /= x;
    return this;
  }

  get mag() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  norm() {
    var mag = this.mag;
    if (mag > 0) {
      this.div(mag);
    }
    return this;
  }
}
