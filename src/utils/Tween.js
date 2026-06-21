import { Easing } from './Easing.js';

export class Tween {
  constructor(target, prop, from, to, duration, easing = Easing.easeOutQuad) {
    this.target = target;
    this.prop = prop;
    this.from = from;
    this.to = to;
    this.duration = duration;
    this.easing = easing;
    this.elapsed = 0;
    this.done = false;
    this.target[this.prop] = from;
  }

  update(dt) {
    if (this.done) return;
    this.elapsed += dt;
    const t = Math.min(1, this.elapsed / this.duration);
    const eased = this.easing(t);
    this.target[this.prop] = this.from + (this.to - this.from) * eased;
    if (t >= 1) this.done = true;
  }
}

export class TweenManager {
  constructor() {
    this.tweens = [];
  }

  add(tween) {
    this.tweens.push(tween);
    return tween;
  }

  update(dt) {
    for (let i = this.tweens.length - 1; i >= 0; i--) {
      this.tweens[i].update(dt);
      if (this.tweens[i].done) this.tweens.splice(i, 1);
    }
  }
}
