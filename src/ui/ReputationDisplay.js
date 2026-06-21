export class ReputationDisplay {
  constructor(root) {
    this.el = document.createElement('div');
    this.el.style.cssText = [
      'position:absolute',
      'top:58px',
      'right:16px',
      'font-size:12px',
      'font-family:monospace',
      'font-weight:bold'
    ].join(';');
    root.appendChild(this.el);
    this.set(0);
  }

  set(rep) {
    const clamped = Math.max(-100, Math.min(100, Math.round(rep)));
    const bars = Math.abs(Math.round(clamped / 20));
    const positive = clamped >= 0;
    const color = positive ? '#4cff4c' : '#ff4444';
    const label = positive ? 'REP: +' : 'REP: ';
    const icon = positive ? '▲'.repeat(bars) : '▼'.repeat(bars);
    this.el.style.color = color;
    this.el.style.textShadow = `0 0 6px ${positive ? '#00aa00' : '#aa0000'}`;
    this.el.textContent = label + clamped + ' ' + icon;
  }
}
