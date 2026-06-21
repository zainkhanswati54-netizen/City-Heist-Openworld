export class WantedStars {
  constructor(root) {
    this.el = document.createElement('div');
    this.el.style.cssText = [
      'position:absolute',
      'bottom:60px',
      'left:50%',
      'transform:translateX(-50%)',
      'font-size:20px',
      'letter-spacing:3px',
      'font-family:monospace',
      'text-align:center',
      'pointer-events:none',
      'transition:color 0.3s'
    ].join(';');
    root.appendChild(this.el);

    this._levelEl = document.createElement('div');
    this._levelEl.style.cssText = [
      'font-size:10px',
      'letter-spacing:1px',
      'margin-top:2px',
      'opacity:0.85'
    ].join(';');
    this.el.appendChild(this._levelEl);
    this.set(0);
  }

  set(level) {
    const full = Math.floor(level);
    const stars = '★'.repeat(full) + '☆'.repeat(Math.max(0, 5 - full));

    let color, label;
    if (full === 0)      { color = '#888'; label = ''; }
    else if (full === 1) { color = '#ffdd55'; label = 'INVESTIGATE'; }
    else if (full === 2) { color = '#ffaa22'; label = 'POLICE CHASE'; }
    else if (full === 3) { color = '#ff6600'; label = 'ROADBLOCK'; }
    else if (full === 4) { color = '#ff3300'; label = 'SWAT RESPONSE'; }
    else                 { color = '#cc00ff'; label = '⚠ MILITARY ⚠'; }

    this.el.style.color = color;
    this.el.style.textShadow = full > 0 ? `0 0 8px ${color}` : 'none';
    this.el.firstChild.textContent = stars;
    this._levelEl.textContent = label;
    this._levelEl.style.color = color;
  }
}
