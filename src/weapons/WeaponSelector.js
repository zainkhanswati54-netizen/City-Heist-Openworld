export class WeaponSelector {
  constructor(registry) {
    this.registry = registry;
    this.activeIndex = 0;
  }

  get active() {
    return this.registry.list()[this.activeIndex];
  }

  next() {
    const list = this.registry.list();
    let tries = 0;
    do {
      this.activeIndex = (this.activeIndex + 1) % list.length;
      tries++;
    } while (!list[this.activeIndex].unlocked && tries < list.length);
    return this.active;
  }

  selectById(id) {
    const list = this.registry.list();
    const idx = list.findIndex(w => w.id === id);
    if (idx >= 0 && list[idx].unlocked) {
      this.activeIndex = idx;
    }
    return this.active;
  }
}
