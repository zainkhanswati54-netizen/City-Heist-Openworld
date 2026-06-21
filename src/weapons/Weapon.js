export class Weapon {
  constructor(name, fireDelay, damage) {
    this.name = name;
    this.fireDelay = fireDelay;
    this.damage = damage;
    this.cooldown = 0;
  }

  canFire() {
    return this.cooldown <= 0;
  }

  triggerCooldown() {
    this.cooldown = this.fireDelay;
  }

  update(dt) {
    if (this.cooldown > 0) this.cooldown -= dt;
  }
}
