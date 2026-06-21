export class Pool {
  constructor(factory, reset, initialSize = 20) {
    this.factory = factory;
    this.reset = reset;
    this.free = [];
    this.active = [];
    for (let i = 0; i < initialSize; i++) {
      this.free.push(this.factory());
    }
  }

  acquire() {
    const obj = this.free.pop() || this.factory();
    this.active.push(obj);
    return obj;
  }

  release(obj) {
    const idx = this.active.indexOf(obj);
    if (idx >= 0) this.active.splice(idx, 1);
    this.reset(obj);
    this.free.push(obj);
  }

  releaseAll() {
    while (this.active.length) this.release(this.active[0]);
  }
}
