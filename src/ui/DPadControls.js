export class DPadControls {
  constructor(root) {
    this.state = {
      accel: false,
      brake: false,
      left: false,
      right: false,
      handbrake: false
    };
    this.container = document.createElement('div');
    this.container.style.cssText = 'position:absolute;inset:0;pointer-events:none;display:none;';
    root.appendChild(this.container);

    this._buildSteering();
    this._buildPedals();
    this._buildHandbrake();
  }

  show() { this.container.style.display = 'block'; }
  hide() { this.container.style.display = 'none'; }

  _bind(el, key) {
    const setTrue = e => { this.state[key] = true; if (e.cancelable) e.preventDefault(); };
    const setFalse = () => { this.state[key] = false; };
    el.addEventListener('touchstart', setTrue, { passive: false });
    el.addEventListener('touchend', setFalse);
    el.addEventListener('touchcancel', setFalse);
    el.addEventListener('mousedown', setTrue);
    el.addEventListener('mouseup', setFalse);
    el.addEventListener('mouseleave', setFalse);
  }

  _makeBtn(label, extraStyle) {
    const btn = document.createElement('div');
    btn.textContent = label;
    btn.style.cssText = `
      position:absolute;width:62px;height:62px;border-radius:12px;
      background:rgba(20,20,24,0.65);color:#fff;display:flex;align-items:center;justify-content:center;
      font-family:monospace;font-size:20px;font-weight:bold;user-select:none;touch-action:none;
      border:2px solid rgba(255,255,255,0.35);pointer-events:auto;
      ${extraStyle}
    `;
    return btn;
  }

  _buildSteering() {
    const left = this._makeBtn('◀', 'bottom:30px;left:24px;');
    const right = this._makeBtn('▶', 'bottom:30px;left:96px;');
    this._bind(left, 'left');
    this._bind(right, 'right');
    this.container.appendChild(left);
    this.container.appendChild(right);
  }

  _buildPedals() {
    const accel = this._makeBtn('▲', 'bottom:104px;right:24px;background:rgba(40,120,60,0.7);');
    const brake = this._makeBtn('▼', 'bottom:30px;right:24px;background:rgba(150,40,40,0.7);');
    this._bind(accel, 'accel');
    this._bind(brake, 'brake');
    this.container.appendChild(accel);
    this.container.appendChild(brake);
  }

  _buildHandbrake() {
    const hb = this._makeBtn('HB', 'bottom:104px;left:60px;width:48px;height:48px;font-size:12px;background:rgba(150,110,20,0.7);');
    this._bind(hb, 'handbrake');
    this.container.appendChild(hb);
  }

  consume() {
    return { ...this.state };
  }
}
