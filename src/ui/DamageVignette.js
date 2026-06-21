export class DamageVignette {
  constructor(root) {
    this.el = document.createElement('div');
    this.el.style.cssText = 'position:absolute;inset:0;pointer-events:none;box-shadow:inset 0 0 0px rgba(255,0,0,0);transition:box-shadow .3s;';
    root.appendChild(this.el);
    this.lastHealth = 100;
  }

  flashIfLow(health) {
    if (health < this.lastHealth) {
      this.el.style.boxShadow = 'inset 0 0 80px rgba(255,0,0,0.5)';
      setTimeout(() => {
        this.el.style.boxShadow = health < 30 ? 'inset 0 0 60px rgba(255,0,0,0.25)' : 'inset 0 0 0px rgba(255,0,0,0)';
      }, 180);
    }
    this.lastHealth = health;
  }
}
