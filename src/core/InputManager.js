import { matchesBind } from '../config/keybinds.js';

export class InputManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.keys = new Set();
    this.mouseDX = 0;
    this.mouseDY = 0;
    this.locked = false;
    this._pressedOnce = new Set();
    this.touchOverride = {};

    canvas.addEventListener('click', () => canvas.requestPointerLock());
    document.addEventListener('pointerlockchange', () => {
      this.locked = document.pointerLockElement === canvas;
    });
    document.addEventListener('mousemove', e => {
      if (!this.locked) return;
      this.mouseDX += e.movementX;
      this.mouseDY += e.movementY;
    });
    document.addEventListener('keydown', e => {
      if (!this.keys.has(e.code)) this._pressedOnce.add(e.code);
      this.keys.add(e.code);
    });
    document.addEventListener('keyup', e => {
      this.keys.delete(e.code);
    });
  }

  setTouchOverride(overrides) {
    this.touchOverride = overrides || {};
  }

  isDown(bindName) {
    if (this.touchOverride[bindName]) return true;
    for (const code of this.keys) {
      if (matchesBind(code, bindName)) return true;
    }
    return false;
  }

  wasPressed(bindName) {
    for (const code of this._pressedOnce) {
      if (matchesBind(code, bindName)) return true;
    }
    return false;
  }

  consumeFrame() {
    this.mouseDX = 0;
    this.mouseDY = 0;
    this._pressedOnce.clear();
  }
}
