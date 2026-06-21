export class MoneyDisplay {
  constructor(root) {
    this.el = document.createElement('div');
    this.el.style.cssText = [
      'position:absolute',
      'top:38px',
      'right:16px',
      'color:#4cff4c',
      'font-size:14px',
      'font-family:monospace',
      'font-weight:bold',
      'text-shadow:0 0 6px #00aa00'
    ].join(';');
    root.appendChild(this.el);
    this.set(0);
  }

  set(amount) {
    this.el.textContent = '$' + amount.toLocaleString();
  }
}
