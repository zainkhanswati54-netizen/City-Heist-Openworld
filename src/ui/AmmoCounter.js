export class AmmoCounter {
  constructor(root) {
    this.el = document.createElement('div');
    this.el.style.cssText = 'position:absolute;bottom:60px;right:16px;color:#ff0;font-size:14px;font-weight:bold;font-family:monospace;';
    this.el.textContent = '30';
    root.appendChild(this.el);
  }

  set(ammo) {
    this.el.textContent = String(ammo);
  }
}
