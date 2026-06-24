// GTA SA-style touch controls
// Left side:  fixed virtual joystick for movement
// Right side: look/camera drag zone
// Buttons:    Fire (bottom-right), Sprint toggle, Enter/Exit, Weapon cycle

import { makeIconButton, bindHoldButton, bindTapButton } from './TouchIcons.js';

export class TouchControls {
  constructor(root) {
    this.state = {
      moveX: 0,
      moveY: 0,
      lookDX: 0,
      lookDY: 0,
      firing: false,
      sprinting: false,
      enterExitPressed: false,
      weaponCyclePressed: false
    };

    this.onFootContainer = document.createElement('div');
    this.onFootContainer.style.cssText = 'position:absolute;inset:0;pointer-events:none;';
    root.appendChild(this.onFootContainer);

    this._buildMovementJoystick(this.onFootContainer);
    this._buildFireButton(this.onFootContainer);
    this._buildSprintButton(this.onFootContainer);
    this._buildAlwaysOnButtons(root);
    this._buildLookZone(root);
  }

  showOnFootControls() {
    this.onFootContainer.style.display = 'block';
  }

  hideOnFootControls() {
    this.onFootContainer.style.display = 'none';
    this.state.moveX = 0;
    this.state.moveY = 0;
    this.state.firing = false;
    this.state.sprinting = false;
  }

  _buildMovementJoystick(root) {
    const SIZE = 130;
    const KNOB = 50;
    const MAX_DIST = 52;

    const base = document.createElement('div');
    base.style.cssText = `
      position:absolute;
      bottom:28px;
      left:20px;
      width:${SIZE}px;
      height:${SIZE}px;
      border-radius:50%;
      background:rgba(255,255,255,0.10);
      border:2.5px solid rgba(255,255,255,0.35);
      pointer-events:auto;
      touch-action:none;
      box-shadow:0 0 18px rgba(0,0,0,0.4);
    `;

    const knob = document.createElement('div');
    knob.style.cssText = `
      position:absolute;
      top:${(SIZE - KNOB) / 2}px;
      left:${(SIZE - KNOB) / 2}px;
      width:${KNOB}px;
      height:${KNOB}px;
      border-radius:50%;
      background:rgba(255,255,255,0.55);
      border:2px solid rgba(255,255,255,0.8);
      pointer-events:none;
      transition:box-shadow 0.1s;
      box-shadow:0 2px 8px rgba(0,0,0,0.4);
    `;
    base.appendChild(knob);
    root.appendChild(base);

    let active = false;
    let originX = 0, originY = 0;

    const start = (cx, cy) => {
      active = true;
      const rect = base.getBoundingClientRect();
      originX = rect.left + rect.width / 2;
      originY = rect.top + rect.height / 2;
      knob.style.boxShadow = '0 0 12px rgba(100,200,255,0.7)';
    };

    const move = (cx, cy) => {
      if (!active) return;
      let dx = cx - originX;
      let dy = cy - originY;
      const rawDist = Math.sqrt(dx * dx + dy * dy);
      const dist = Math.min(MAX_DIST, rawDist);
      const angle = Math.atan2(dy, dx);
      dx = Math.cos(angle) * dist;
      dy = Math.sin(angle) * dist;
      knob.style.transform = `translate(${dx}px,${dy}px)`;
      this.state.moveX = dx / MAX_DIST;
      this.state.moveY = dy / MAX_DIST;
      // Auto-sprint when joystick pushed ≥ 85%
      this.state.sprinting = rawDist / MAX_DIST >= 0.85;
    };

    const end = () => {
      active = false;
      knob.style.transform = 'translate(0,0)';
      knob.style.boxShadow = '0 2px 8px rgba(0,0,0,0.4)';
      this.state.moveX = 0;
      this.state.moveY = 0;
      this.state.sprinting = false;
    };

    base.addEventListener('touchstart',  e => { start(e.touches[0].clientX, e.touches[0].clientY); e.preventDefault(); }, { passive: false });
    base.addEventListener('touchmove',   e => { move(e.touches[0].clientX,  e.touches[0].clientY);  e.preventDefault(); }, { passive: false });
    base.addEventListener('touchend',    end);
    base.addEventListener('touchcancel', end);
    base.addEventListener('mousedown',   e => start(e.clientX, e.clientY));
    window.addEventListener('mousemove', e => move(e.clientX,  e.clientY));
    window.addEventListener('mouseup',   end);
  }

  // Right-side only look zone (avoids overlap with buttons on left)
  _buildLookZone(root) {
    const zone = document.createElement('div');
    zone.style.cssText = `
      position:absolute;
      top:0; right:0;
      width:55%;
      height:100%;
      pointer-events:auto;
      touch-action:none;
      z-index:0;
    `;
    root.appendChild(zone);

    let lastX = null, lastY = null;
    let touchId = null;

    zone.addEventListener('touchstart', e => {
      const t = e.changedTouches[0];
      touchId = t.identifier;
      lastX = t.clientX;
      lastY = t.clientY;
    }, { passive: true });

    zone.addEventListener('touchmove', e => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        if (t.identifier !== touchId) continue;
        if (lastX !== null) {
          this.state.lookDX = t.clientX - lastX;
          this.state.lookDY = t.clientY - lastY;
        }
        lastX = t.clientX;
        lastY = t.clientY;
      }
    }, { passive: true });

    zone.addEventListener('touchend', e => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchId) {
          lastX = null; lastY = null; touchId = null;
          this.state.lookDX = 0; this.state.lookDY = 0;
        }
      }
    });
  }

  _buildFireButton(root) {
    const btn = makeIconButton({
      icon: 'fire',
      size: 88,
      bg: 'rgba(200,30,30,0.8)',
      borderColor: 'rgba(255,100,100,0.7)',
      extraStyle: 'bottom:28px;right:20px;box-shadow:0 0 20px rgba(255,0,0,0.5);'
    });
    bindHoldButton(btn, () => { this.state.firing = true; }, () => { this.state.firing = false; });
    root.appendChild(btn);
  }

  _buildSprintButton(root) {
    const btn = makeIconButton({
      icon: 'sprint',
      size: 58,
      bg: 'rgba(200,130,0,0.75)',
      borderColor: 'rgba(255,200,50,0.8)',
      extraStyle: 'bottom:130px;right:26px;'
    });
    bindHoldButton(btn, () => { this.state.sprinting = true; }, () => { this.state.sprinting = false; });
    root.appendChild(btn);
  }

  _buildAlwaysOnButtons(root) {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'position:absolute;top:80px;right:16px;display:flex;flex-direction:column;gap:10px;align-items:center;pointer-events:auto;';
    root.appendChild(wrap);

    const enterBtn = makeIconButton({ icon: 'enterCar', size: 54, bg: 'rgba(0,150,170,0.75)' });
    bindTapButton(enterBtn, () => { this.state.enterExitPressed = true; });

    const weaponBtn = makeIconButton({ icon: 'weaponCycle', size: 54, bg: 'rgba(170,120,0,0.75)' });
    bindTapButton(weaponBtn, () => { this.state.weaponCyclePressed = true; });

    // Buttons created via makeIconButton are absolutely positioned by default (for the
    // driving D-pad's free-floating layout); here we want them stacked in a flex column,
    // so clear that positioning and let the flex wrapper handle placement instead.
    [enterBtn, weaponBtn].forEach(b => { b.style.position = 'relative'; });

    wrap.appendChild(enterBtn);
    wrap.appendChild(weaponBtn);
  }

  consumePressFlags() {
    const flags = {
      enterExitPressed: this.state.enterExitPressed,
      weaponCyclePressed: this.state.weaponCyclePressed
    };
    this.state.enterExitPressed = false;
    this.state.weaponCyclePressed = false;
    return flags;
  }

  consumeLook() {
    const look = { dx: this.state.lookDX, dy: this.state.lookDY };
    this.state.lookDX = 0;
    this.state.lookDY = 0;
    return look;
  }
}
