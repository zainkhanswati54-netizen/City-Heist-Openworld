import { makeIconButton, bindHoldButton, bindTapButton } from './TouchIcons.js';

export class DPadControls {
  constructor(root, onHorn) {
    this.state = {
      accel: false,
      brake: false,
      left: false,
      right: false,
      handbrake: false
    };
    this.onHorn = onHorn;
    this.container = document.createElement('div');
    this.container.style.cssText = 'position:absolute;inset:0;pointer-events:none;display:none;';
    root.appendChild(this.container);

    this._buildSteering();
    this._buildPedals();
    this._buildHandbrake();
    this._buildHorn();
  }

  show() { this.container.style.display = 'block'; }
  hide() { this.container.style.display = 'none'; }

  _addToggle(icon, style, key, bg) {
    const btn = makeIconButton({ icon, size: 60, bg, extraStyle: style });
    bindHoldButton(btn, () => { this.state[key] = true; }, () => { this.state[key] = false; });
    this.container.appendChild(btn);
    return btn;
  }

  _buildSteering() {
    this._addToggle('steerLeft', 'bottom:28px;left:20px;', 'left', 'rgba(20,20,24,0.62)');
    this._addToggle('steerRight', 'bottom:28px;left:94px;', 'right', 'rgba(20,20,24,0.62)');
  }

  _buildPedals() {
    this._addToggle('accelerate', 'bottom:100px;right:20px;', 'accel', 'rgba(40,130,65,0.75)');
    this._addToggle('brake', 'bottom:28px;right:20px;', 'brake', 'rgba(155,40,40,0.75)');
  }

  _buildHandbrake() {
    this._addToggle('handbrake', 'bottom:100px;left:57px;', 'handbrake', 'rgba(160,115,20,0.75)');
  }

  _buildHorn() {
    const horn = makeIconButton({ icon: 'horn', size: 44, bg: 'rgba(20,20,24,0.55)', extraStyle: 'top:54px;right:20px;' });
    bindTapButton(horn, () => { if (this.onHorn) this.onHorn(); });
    this.container.appendChild(horn);
  }

  consume() {
    return { ...this.state };
  }
}
