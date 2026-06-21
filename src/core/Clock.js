export class Clock {
  constructor() {
    this.last = performance.now();
    this.elapsed = 0;
    this.delta = 0;
    this.frame = 0;
  }

  tick() {
    const now = performance.now();
    this.delta = Math.min((now - this.last) / 16.6667, 3);
    this.last = now;
    this.elapsed += this.delta;
    this.frame++;
    return this.delta;
  }
}
