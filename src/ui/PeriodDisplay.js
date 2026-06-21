export class PeriodDisplay {
  constructor(root) {
    this.el = document.createElement('div');
    this.el.style.cssText = [
      'position:absolute',
      'top:10px',
      'left:50%',
      'transform:translateX(-50%)',
      'color:#ffe080',
      'font-size:12px',
      'font-family:monospace',
      'letter-spacing:2px',
      'text-shadow:0 0 8px #ff8800',
      'pointer-events:none'
    ].join(';');
    root.appendChild(this.el);
    this.set('MORNING');
  }

  set(period) {
    const icons = {
      morning: '🌅 MORNING',
      afternoon: '☀️ AFTERNOON',
      evening: '🌆 EVENING',
      night: '🌙 NIGHT'
    };
    this.el.textContent = icons[period] || period.toUpperCase();
  }
}
